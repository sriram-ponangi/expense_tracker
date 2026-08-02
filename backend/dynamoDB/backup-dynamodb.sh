#!/bin/bash
set -e  # Stop immediately if any command fails

# ============================================================
#  DynamoDB → S3 Full Backup Script
#  Table:  expense-tracker  |  Region: us-east-2
#  Bucket: expense--tracker
# ============================================================

# ---------- CONFIG ----------
AWS_REGION="us-east-2"
TABLE_NAME="expense-tracker"
S3_BUCKET="expense--tracker"

# ---------- TIMESTAMP (Atlantic Time) ----------
TIMESTAMP=$(TZ="America/Halifax" date +"%Y-%m-%d_%H%M_%Z")
S3_PREFIX="backups/${TIMESTAMP}"

echo "============================================================"
echo " Backup started : $TIMESTAMP (Atlantic Time)"
echo " Table          : $TABLE_NAME"
echo " Destination    : s3://${S3_BUCKET}/${S3_PREFIX}"
echo "============================================================"

# ---------- STEP 1: Get Table ARN ----------
echo "==> Fetching table ARN..."
TABLE_ARN=$(aws dynamodb describe-table \
    --table-name "$TABLE_NAME" \
    --region "$AWS_REGION" \
    --query "Table.TableArn" \
    --output text)
echo "    Table ARN: $TABLE_ARN"

# ---------- STEP 2: Start Export ----------
echo "==> Triggering export to S3..."
EXPORT_ARN=$(aws dynamodb export-table-to-point-in-time \
    --table-arn "$TABLE_ARN" \
    --s3-bucket "$S3_BUCKET" \
    --s3-prefix "$S3_PREFIX" \
    --export-format DYNAMODB_JSON \
    --region "$AWS_REGION" \
    --query "ExportDescription.ExportArn" \
    --output text)
echo "    Export ARN: $EXPORT_ARN"

# ---------- STEP 3: Poll Until Complete ----------
echo "==> Waiting for export to complete (checks every 15s)..."
while true; do
    STATUS=$(aws dynamodb describe-export \
        --export-arn "$EXPORT_ARN" \
        --region "$AWS_REGION" \
        --query "ExportDescription.ExportStatus" \
        --output text)

    echo "    Status: $STATUS"

    if [ "$STATUS" == "COMPLETED" ]; then
        echo "==> ✅ Backup COMPLETED successfully."
        break
    elif [ "$STATUS" == "FAILED" ]; then
        FAILURE=$(aws dynamodb describe-export \
            --export-arn "$EXPORT_ARN" \
            --region "$AWS_REGION" \
            --query "ExportDescription.FailureMessage" \
            --output text)
        echo "==> ❌ Backup FAILED: $FAILURE"
        exit 1
    fi

    sleep 15
done

# ---------- STEP 4: Verify Files in S3 ----------
echo "==> Verifying backup files in S3:"
aws s3 ls "s3://${S3_BUCKET}/${S3_PREFIX}" --recursive

echo "============================================================"
echo " ✅ Done. Backup stored at: s3://${S3_BUCKET}/${S3_PREFIX}"
echo "============================================================"