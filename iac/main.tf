locals {
  lambda_source_dir = "${path.module}/../backend/lambda_functions"
}

module "dynamodb" {
  source     = "./modules/dynamodb"
  table_name = var.table_name
}

module "cognito" {
  source        = "./modules/cognito"
  callback_urls = var.cognito_callback_urls
  logout_urls   = var.cognito_logout_urls
}

module "iam" {
  source                 = "./modules/iam"
  dynamodb_table_arn     = module.dynamodb.table_arn
  cors_options_log_group = "arn:aws:logs:${var.aws_region}:${var.aws_account_id}:log-group:/aws/lambda/expense-tracker-cors-options:*"
}

module "lambda" {
  source = "./modules/lambda"

  source_dir = local.lambda_source_dir

  role_arns = {
    create_item  = module.iam.role_create_item_arn
    read_items   = module.iam.role_read_items_arn
    delete_item  = module.iam.role_delete_item_arn
    cors_options = module.iam.role_cors_options_arn
  }
}

module "api_gateway" {
  source = "./modules/api_gateway"

  stage_name       = var.api_stage_name
  cognito_pool_arn = module.cognito.user_pool_arn
  lambda_invoke_arns = {
    create_item  = module.lambda.invoke_arns["create_item"]
    read_items   = module.lambda.invoke_arns["read_items"]
    read_history = module.lambda.invoke_arns["read_history"]
    delete_item  = module.lambda.invoke_arns["delete_item"]
    cors_options = module.lambda.invoke_arns["cors_options"]
  }
}

# ----------------------------------------------------------------------
# aws_lambda_permission resources are intentionally NOT declared here.
# The console-created permission statements (11 across 5 functions, some
# with duplicate SIDs) remain in each Lambda's resource-based policy in
# AWS but are unmanaged by Terraform. This keeps the initial import diff
# empty. When adding a new API endpoint later, either add an aws_lambda_permission
# block here or attach the permission via the console/CLI.
# ----------------------------------------------------------------------
