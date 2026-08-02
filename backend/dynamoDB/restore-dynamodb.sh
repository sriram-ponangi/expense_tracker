#!/bin/bash
set -e  ## Stop immediately if any command fails

## ============================================================
##  DynamoDB Restore: S3 export -> NEW table
##  Source schema is auto-extracted from SOURCE_TABLE.
## ============================================================

## ---------- CONFIG ----------
AWS_REGION="us-east-2"
SOURCE_TABLE="expense-tracker"                 ## table to copy schema from
TARGET_TABLE="expense-tracker-restored"        ## NEW table to create
S3_BUCKET="expense--tracker"

## ---------- STEP 1: Locate the export's data/ prefix ----------
## Uses the MOST RECENT export found under backups/.
echo "==> Locating latest export data/ prefix in s3://${S3_BUCKET}/backups/ ..."
DATA_PREFIX=$(aws s3 ls "s3://${S3_BUCKET}/backups/" --recursive \
    | grep "/data/" \
    | awk '{print $4}' \
    | sed -E 's#(.*/data/).*#\1#' \
    | sort -u \
    | tail -n 1)

if [ -z "$DATA_PREFIX" ]; then
    echo "==> ❌ No export data/ prefix found under backups/. Aborting."
    exit 1
fi
echo "    Using prefix: $DATA_PREFIX"

## ---------- STEP 2: Auto-extract source schema ----------
echo "==> Extracting schema from source table: $SOURCE_TABLE"

KEY_SCHEMA=$(aws dynamodb describe-table \
    --table-name "$SOURCE_TABLE" --region "$AWS_REGION" \
    --query "Table.KeySchema" --output json)

ATTR_DEFS=$(aws dynamodb describe-table \
    --table-name "$SOURCE_TABLE" --region "$AWS_REGION" \
    --query "Table.AttributeDefinitions" --output json)

GSIS=$(aws dynamodb describe-table \
    --table-name "$SOURCE_TABLE" --region "$AWS_REGION" \
    --query "Table.GlobalSecondaryIndexes" --output json)

LSIS=$(aws dynamodb describe-table \
    --table-name "$SOURCE_TABLE" --region "$AWS_REGION" \
    --query "Table.LocalSecondaryIndexes" --output json)

## ---------- Log the extracted schema ----------
echo "------------------------------------------------------------"
echo " Extracted schema from '$SOURCE_TABLE':"
echo "------------------------------------------------------------"
echo " KeySchema:"
echo "$KEY_SCHEMA"
echo " AttributeDefinitions:"
echo "$ATTR_DEFS"
echo " GlobalSecondaryIndexes:"
echo "$GSIS"
echo " LocalSecondaryIndexes:"
echo "$LSIS"
echo "------------------------------------------------------------"

if [ "$LSIS" != "null" ] && [ -n "$LSIS" ]; then
    echo "==> ⚠️  WARNING: Source table has LSIs. Import CANNOT create LSIs;"
    echo "    they will be omitted from the restored table."
fi

## ---------- STEP 3: Build --table-creation-parameters ----------
## Strip index metadata GSIs can't be imported with (status, ARNs, counts, etc.),
## keeping only IndexName, KeySchema, and Projection.
if [ "$GSIS" == "null" ] || [ -z "$GSIS" ]; then
    GSI_PARAM=""
else
    CLEAN_GSIS=$(echo "$GSIS" | jq '[.[] | {IndexName, KeySchema, Projection}]')
    GSI_PARAM=", \"GlobalSecondaryIndexes\": ${CLEAN_GSIS}"
fi

CREATION_PARAMS=$(cat <<EOF
{
    "TableName": "${TARGET_TABLE}",
    "AttributeDefinitions": ${ATTR_DEFS},
    "KeySchema": ${KEY_SCHEMA},
    "BillingMode": "PAY_PER_REQUEST"${GSI_PARAM}
}
EOF
)

echo "==> Table creation parameters:"
echo "$CREATION_PARAMS"

## ---------- STEP 4: Run the import ----------
echo "==> Starting import into NEW table: $TARGET_TABLE"
IMPORT_ARN=$(aws dynamodb import-table \
    --region "$AWS_REGION" \
    --s3-bucket-source "S3Bucket=${S3_BUCKET},S3KeyPrefix=${DATA_PREFIX}" \
    --input-format DYNAMODB_JSON \
    --input-compression-type GZIP \
    --table-creation-parameters "$CREATION_PARAMS" \
    --query "ImportTableDescription.ImportArn" \
    --output text)
echo "    Import ARN: $IMPORT_ARN"

## ---------- STEP 5: Poll until complete ----------
echo "==> Waiting for import to complete (checks every 15s)..."
while true; do
    STATUS=$(aws dynamodb describe-import \
        --import-arn "$IMPORT_ARN" \
        --region "$AWS_REGION" \
        --query "ImportTableDescription.ImportStatus" \
        --output text)
    echo "    Status: $STATUS"

    if [ "$STATUS" == "COMPLETED" ]; then
        echo "==> ✅ Import COMPLETED. Table created: $TARGET_TABLE"
        break
    elif [ "$STATUS" == "FAILED" ] || [ "$STATUS" == "CANCELLED" ]; then
        FAILURE=$(aws dynamodb describe-import \
            --import-arn "$IMPORT_ARN" \
            --region "$AWS_REGION" \
            --query "ImportTableDescription.FailureMessage" \
            --output text)
        echo "==> ❌ Import $STATUS: $FAILURE"
        exit 1
    fi
    sleep 15
done

## ---------- STEP 6: Verify ----------
echo "==> Sample of restored data:"
aws dynamodb scan --region "$AWS_REGION" \
    --table-name "$TARGET_TABLE" --max-items 5