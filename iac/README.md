# Terraform IaC — Expense Tracker Backend

Manages the existing AWS backend (Cognito, API Gateway, Lambda, IAM, DynamoDB) for the Expense Tracker app in account `885115002496`, region `us-east-2`.

State lives in `s3://expense--tracker/terraform/state/expense-tracker.tfstate` using S3 native locking (Terraform ≥ 1.10 — no DynamoDB lock table needed).

---

## Layout

```
iac/
├── versions.tf              # provider version pins (aws ~> 5.70, archive ~> 2.4)
├── providers.tf             # aws provider, default tags (app / project / managedBy)
├── backend.tf               # S3 remote state
├── variables.tf             # region, tags, table name, stage, CORS URLs
├── main.tf                  # composes modules
├── outputs.tf               # user pool, API, table, invoke URL
├── imports.tf               # one-time import blocks — block-commented after first apply
├── terraform.tfvars.example
└── modules/
    ├── dynamodb/
    ├── cognito/
    ├── iam/
    ├── lambda/              # zips + deploys code from backend/lambda_functions/
    └── api_gateway/
```

The Lambda source files under `backend/lambda_functions/` are packaged directly: Terraform reads each `expense-tracker-*.mjs|.js`, renames it to `index.mjs` (or `index.js`) inside the zip, and uploads. Any code change → `terraform apply`.

## Dependency Chain (Terraform handles automatically)

Resources are created in this order via implicit Terraform dependencies (reference tracking):

```
1. DynamoDB table (expense-tracker)
   ├─→ 2. DynamoDB auto-scaling targets + policies (reference the table name)
   
3. Cognito user pool
   ├─→ 4. Cognito user pool client (references pool ID)
   ├─→ 5. Cognito hosted-UI domain (references pool)
   └─→ 6. API Gateway Cognito authorizer (references pool ARN)

7. IAM roles (4 roles instantiated)
   ├─→ 8. IAM policies (3 customer-managed policies)
   └─→ 9. IAM role-policy attachments (reference roles + policies)

10. Lambda functions (5 functions, reference IAM roles in execution_role_arn)

11. API Gateway REST API
    ├─→ 12. API Gateway resources (/, /{history+})
    ├─→ 13. API Gateway methods (POST/GET/DELETE/OPTIONS)
    ├─→ 14. API Gateway integrations (reference Lambda function ARNs)
    ├─→ 15. API Gateway method/integration responses
    └─→ 16. API Gateway deployment + stage
```

**You do NOT need to manually control this order** — Terraform's dependency resolver traces all resource references and applies in the correct sequence. If you run `terraform apply` without specifying an order, Terraform will figure it out. However, the modular layout ensures:
- Cognito module is independent (no inter-service deps).
- DynamoDB module is independent.
- IAM is instantiated before Lambda so roles exist.
- Lambda is instantiated before API Gateway so function ARNs are available.
- API Gateway is last (depends on Lambda + Cognito).

---

<details>
<summary>
    <h2 style="display:inline">Part 1 — First-time setup (one-time import from live AWS)</h2>
</summary>

Run this **once** on a fresh machine to bring the existing AWS resources under Terraform's control.

### Step 1. Prerequisites

```bash
aws sts get-caller-identity     # must return account 885115002496
terraform version               # must be >= 1.10 for S3 native locking
```

### Step 2. Bootstrap the state bucket (idempotent)

The bucket `expense--tracker` already exists (used for DynamoDB backups). Enable versioning + block public access before Terraform stores state in it.

```bash
aws s3api put-bucket-versioning \
  --bucket expense--tracker --region us-east-2 \
  --versioning-configuration Status=Enabled

aws s3api put-public-access-block \
  --bucket expense--tracker --region us-east-2 \
  --public-access-block-configuration \
      "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

(Encryption is already AES256; no change needed.)

### Step 3. Initialize Terraform

```bash
cd iac
cp terraform.tfvars.example terraform.tfvars   # optional — defaults are fine
terraform init
```

`init` downloads providers and initializes the S3 backend. State file is created at `s3://expense--tracker/terraform/state/expense-tracker.tfstate`.

### Step 4. Import — preview

```bash
terraform plan -out first-apply.tfplan
```

The `import { }` blocks in [imports.tf](imports.tf) will pull 50 existing AWS resources into state. The plan will report:

```
Plan: 50 to import, 0 to add, ~19 to change, 0 to destroy.
```

The **19 in-place updates** are all expected and non-destructive:

| Category | What changes | Why |
|---|---|---|
| Tag additions | Every taggable resource gets `app=expense-tracker`, `project=expense-tracker`, `managedBy=terraform` added to `tags_all` | Provider `default_tags` block |
| Lambda code re-upload | 5 functions get new `source_code_hash` + `last_modified` | Repo code is **byte-identical** to what's live — only the zip's metadata differs. Functionally a no-op. |
| `aws_api_gateway_integration_response.*` (×4) | Removes a `response_templates = {"application/json": null}` map entry | AWS returns a null-valued entry the provider treats as absent. No functional impact. |

If the plan shows anything **other than these three categories** — especially any "will be destroyed", "must be replaced", or "will be created" for existing resources — **stop and investigate before applying**.

### Step 5. Import — apply

```bash
terraform apply first-apply.tfplan
```

This commits the import + applies the 19 in-place updates. Takes ~1–2 minutes.

### Step 6. Verify

```bash
terraform plan
```

Should now report:

```
No changes. Your infrastructure matches the configuration.
```

Smoke-test the app itself (angular UI → sign-in, add expense, view history, delete expense) to confirm nothing regressed.

### Step 7. Cleanup

Once Step 6 is clean, the `import { }` blocks have done their job — state already holds every resource. Comment them out (as a block) so future `plan`s don't re-execute them, but the file stays around as documentation of what was imported.

Run from inside `iac/`:

```bash
cd iac
{ echo '/*'; cat imports.tf; echo '*/'; } > imports.tf.new && mv imports.tf.new imports.tf
terraform fmt imports.tf
terraform plan                   # should still be clean
git add imports.tf
git commit -m "iac: comment out import blocks after first-run import"
```

Optionally, remove `terraform.tfvars` from your local checkout (or keep it — it's already `.gitignore`d).

</details>

---

## Part 2 — Subsequent deployments (day-to-day)

Every workflow below assumes: state is initialized (Part 1 was completed on this account), imports are done, and you're starting from a clean local repo.

### Starting point (every session)

```bash
cd iac
terraform init         # cheap — refreshes plugin cache, no-op if unchanged
terraform plan         # confirms current AWS state matches config; expect "No changes"
```

If `plan` shows unexpected diffs at this stage, something changed in AWS outside Terraform (console edit, another user, etc.). Reconcile before making your own changes.

**Do I need `terraform.tfvars`?**

State lives in S3, so any machine with AWS credentials for account `885115002496` can run these commands — no local state to worry about. `terraform.tfvars` is only needed if you want to override the defaults in [variables.tf](variables.tf) (region, table name, stage, CORS URLs, tags). If defaults are fine, skip it. If you need overrides, `cp terraform.tfvars.example terraform.tfvars`, edit, then run `plan`.

### Change a Lambda function

```bash
# 1. Edit the source in the repo
vi backend/lambda_functions/expense-tracker-create-item.mjs

# 2. Plan
cd iac
terraform plan          # shows source_code_hash + last_modified diff on that function only

# 3. Apply
terraform apply
```

### Change infrastructure config (Cognito URLs, memory, timeout, table settings, …)

```bash
# 1. Edit the relevant module or root file
vi iac/modules/cognito/main.tf

# 2. Plan + apply
cd iac
terraform plan
terraform apply
```

### Add a new API Gateway endpoint

The console-created `aws_lambda_permission` statements are intentionally unmanaged. When you add a new method → new Lambda, add the corresponding permission block yourself:

```hcl
# iac/main.tf
resource "aws_lambda_permission" "my_new_endpoint" {
  statement_id  = "AllowAPIGatewayInvokeMyNewEndpoint"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.function_names["my_new_endpoint"]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${module.api_gateway.execution_arn}/*/POST/my-path"
}
```

### Force an API Gateway redeploy

The imported deployment has `lifecycle { ignore_changes = [triggers, description] }`, so method/integration edits do NOT automatically trigger a redeploy. To publish changes to the `dev` stage:

```bash
terraform apply -replace=module.api_gateway.aws_api_gateway_deployment.this
```

### Override variables at plan/apply time

```bash
terraform plan -var 'cognito_callback_urls=["https://app.example.com/home"]'
terraform apply -var 'cognito_callback_urls=["https://app.example.com/home"]'
```

Or, more durably, edit `terraform.tfvars`.

---

## Troubleshooting

**Partial state after a failed import**

Remove the affected entry and re-import:
```bash
terraform state rm module.<mod>.<resource>.<name>
terraform apply
```

**S3 lock stuck**

Native S3 locks auto-expire in seconds. If a run was hard-killed and the next `plan` complains about a lock, delete `s3://expense--tracker/terraform/state/expense-tracker.tfstate.tflock` in the console.

**Cognito schema drift**

The `aws_cognito_user_pool` resource has `lifecycle { ignore_changes = [schema] }` because AWS manages the standard OIDC attribute set. To add a custom attribute, remove that ignore, add a `schema {}` block for the new attribute, and apply.

**Unmanaged resources you want to bring under Terraform**

CloudWatch log groups (auto-created by Lambda on invocation) and the 11 `aws_lambda_permission` statements are intentionally unmanaged. To adopt them:
1. Add the resource to the relevant module.
2. Add an `import { to = ..., id = ... }` block (uncomment `imports.tf` if needed).
3. `terraform plan` (adopts it) → `terraform apply`.
4. Comment out or delete the new import block once done.
