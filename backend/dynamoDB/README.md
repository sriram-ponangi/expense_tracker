# DynamoDB Setup Information: 

## DynamoDB → S3 Backup & Restore

Takes a full on-demand backup of the `expense-tracker` DynamoDB table into S3
(in a timestamped Atlantic-Time folder), and restores it into a new table.

### Default Config
| Setting | Value |
|---------|-------|
| Table | `expense-tracker` |
| Region | `us-east-2` |
| Bucket | `expense--tracker` |
| Backup path | `backups/YYYY-MM-DD_HHMM_AST/` |

---

### Prerequisites

#### 1. AWS CLI configured

Check if it works (shows your account ID if configured):
```bash
aws sts get-caller-identity
```
If it fails, configure it:
```bash
aws configure
## Enter: Access Key ID, Secret Access Key, region (us-east-2), output (json)
```

Check you have enough access (should list your DynamoDB tables without an
`AccessDenied` error):
```bash
aws dynamodb list-tables --region us-east-2
```

#### 2. Point-in-Time Recovery (PITR) enabled

Check current status:
```bash
aws dynamodb describe-continuous-backups \
    --table-name expense-tracker \
    --region us-east-2 \
    --query "ContinuousBackupsDescription.PointInTimeRecoveryDescription.PointInTimeRecoveryStatus" \
    --output text
```
If it returns `DISABLED`, enable it:
```bash
aws dynamodb update-continuous-backups \
    --table-name expense-tracker \
    --region us-east-2 \
    --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true
```

#### 3. S3 bucket exists

Check if the bucket exists (no output = exists):
```bash
aws s3api head-bucket --bucket expense--tracker
```
If it does NOT exist, create it (us-east-2 needs LocationConstraint):
```bash
aws s3api create-bucket \
    --bucket expense--tracker \
    --region us-east-2 \
    --create-bucket-configuration LocationConstraint=us-east-2
```

---

### Backup

#### Usage
```bash
chmod +x backup-dynamodb.sh   ## first time only
./backup-dynamodb.sh
```

#### What it does
1. Gets the table ARN
2. Starts a full export to S3
3. Waits until status is `COMPLETED` (or reports `FAILED` with reason)
4. Lists the backed-up files in S3

#### Output location
```
s3://expense--tracker/backups/<timestamp>/AWSDynamoDB/<id>/data/...
```

---


### Restore (Import from S3 → new table)

> ⚠️ `import-table` **always creates a NEW table** 
> (default name of new table is expense-tracker-restored). 
> You cannot import into an existing table.
>
> ⚠️ The source table's schema (keys, attributes, GSIs) is auto-extracted and
> reused. **LSIs cannot be created via import** — if your table has LSIs, they
> will be skipped.


Run it:
```bash
chmod +x restore-dynamodb.sh   ## first time only
./restore-dynamodb.sh
```

**Requires `jq`** (used to clean GSI definitions). Install if missing:
```bash
## macOS
brew install jq
## Ubuntu/Debian
sudo apt-get install -y jq
```

#### What the script does
1. Finds the **latest** export's `data/` prefix under `backups/`
2. Auto-extracts the source table's schema (keys, attributes, GSIs, LSIs) and **logs it**
3. Warns if Local Secondary Index(LSIs) exist (import can't recreate them)
4. Builds the `--table-creation-parameters` JSON automatically
5. Creates the new table and imports the data
6. Waits until `COMPLETED` (or reports `FAILED`/`CANCELLED` with the reason)
7. Prints a sample of the restored rows

**Restore a specific (older) backup**
By default the script picks the **most recent** export. To restore an older one,
hardcode the prefix instead of the auto-detection in Step 1:
```bash
DATA_PREFIX="backups/2024-01-15_1430_AST/AWSDynamoDB/01234567890-abcdef/data/"
```

#### Notes
- Import **always creates a new table** — set `TARGET_TABLE` to a name that does
  not already exist.
- Exports are GZIP-compressed, so `--input-compression-type GZIP` is required.
- LSIs cannot be recreated via import; GSIs are recreated automatically.
- Import takes a few minutes minimum, even for small tables.
