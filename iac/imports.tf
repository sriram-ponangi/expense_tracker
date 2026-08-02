/*
# ==================================================================
# Import blocks — bring existing AWS resources under Terraform state.
# After the first `terraform apply`, these blocks can be removed
# (state is already populated) or left as documentation.
# ==================================================================

# ------------------ DynamoDB ------------------

# DynamoDB application auto-scaling (targets + policies).
# Import IDs:
#   target: <namespace>/<resource-id>/<scalable-dimension>
#   policy: <namespace>/<resource-id>/<scalable-dimension>/<policy-name>

import {
  to = module.dynamodb.aws_appautoscaling_target.read
  id = "dynamodb/table/expense-tracker/dynamodb:table:ReadCapacityUnits"
}

import {
  to = module.dynamodb.aws_appautoscaling_target.write
  id = "dynamodb/table/expense-tracker/dynamodb:table:WriteCapacityUnits"
}

import {
  to = module.dynamodb.aws_appautoscaling_policy.read
  id = "dynamodb/table/expense-tracker/dynamodb:table:ReadCapacityUnits/$expense-tracker-scaling-policy"
}

import {
  to = module.dynamodb.aws_appautoscaling_policy.write
  id = "dynamodb/table/expense-tracker/dynamodb:table:WriteCapacityUnits/$expense-tracker-scaling-policy"
}


import {
  to = module.dynamodb.aws_dynamodb_table.expense_tracker
  id = "expense-tracker"
}

# ------------------ Cognito ------------------
import {
  to = module.cognito.aws_cognito_user_pool.main
  id = "us-east-2_psW66ZMih"
}

import {
  to = module.cognito.aws_cognito_user_pool_client.angular_app
  id = "us-east-2_psW66ZMih/1lpdqmtab9ou0mvjasth0r4k4c"
}

import {
  to = module.cognito.aws_cognito_user_pool_domain.hosted_ui
  id = "expense-tracker-app"
}

# ------------------ IAM roles ------------------
import {
  to = module.iam.aws_iam_role.create_item
  id = "expense-tracker-create-item"
}

import {
  to = module.iam.aws_iam_role.read_items
  id = "expense-tracker-read-items"
}

import {
  to = module.iam.aws_iam_role.delete_item
  id = "expense-tracker-delete-item-role-joil2tn5"
}

import {
  to = module.iam.aws_iam_role.cors_options
  id = "expense-tracker-cors-options-role-uoe9f5yc"
}

# ------------------ IAM customer-managed policies ------------------
import {
  to = module.iam.aws_iam_policy.create_item
  id = "arn:aws:iam::885115002496:policy/expense-tracker-create-item"
}

import {
  to = module.iam.aws_iam_policy.read_items
  id = "arn:aws:iam::885115002496:policy/expense-tracker-read-items"
}

import {
  to = module.iam.aws_iam_policy.cors_options_exec
  id = "arn:aws:iam::885115002496:policy/service-role/AWSLambdaBasicExecutionRole-cc53c3eb-1c32-4c89-a82b-da2fd768e9be"
}

# ------------------ IAM role-policy attachments ------------------
# aws_iam_role_policy_attachment import id syntax: "<role-name>/<policy-arn>"

import {
  to = module.iam.aws_iam_role_policy_attachment.create_item_writes
  id = "expense-tracker-create-item/arn:aws:iam::885115002496:policy/expense-tracker-create-item"
}

import {
  to = module.iam.aws_iam_role_policy_attachment.create_item_reads
  id = "expense-tracker-create-item/arn:aws:iam::885115002496:policy/expense-tracker-read-items"
}

import {
  to = module.iam.aws_iam_role_policy_attachment.read_items_reads
  id = "expense-tracker-read-items/arn:aws:iam::885115002496:policy/expense-tracker-read-items"
}

import {
  to = module.iam.aws_iam_role_policy_attachment.read_items_basic_exec
  id = "expense-tracker-read-items/arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

import {
  to = module.iam.aws_iam_role_policy_attachment.delete_item_writes
  id = "expense-tracker-delete-item-role-joil2tn5/arn:aws:iam::885115002496:policy/expense-tracker-create-item"
}

import {
  to = module.iam.aws_iam_role_policy_attachment.delete_item_reads
  id = "expense-tracker-delete-item-role-joil2tn5/arn:aws:iam::885115002496:policy/expense-tracker-read-items"
}

import {
  to = module.iam.aws_iam_role_policy_attachment.cors_options_exec
  id = "expense-tracker-cors-options-role-uoe9f5yc/arn:aws:iam::885115002496:policy/service-role/AWSLambdaBasicExecutionRole-cc53c3eb-1c32-4c89-a82b-da2fd768e9be"
}

# ------------------ Lambda functions ------------------
import {
  to = module.lambda.aws_lambda_function.fn["create_item"]
  id = "expense-tracker-create-item"
}

import {
  to = module.lambda.aws_lambda_function.fn["read_items"]
  id = "expense-tracker-read-items"
}

import {
  to = module.lambda.aws_lambda_function.fn["read_history"]
  id = "expense-tracker-read-items-history"
}

import {
  to = module.lambda.aws_lambda_function.fn["delete_item"]
  id = "expense-tracker-delete-item"
}

import {
  to = module.lambda.aws_lambda_function.fn["cors_options"]
  id = "expense-tracker-cors-options"
}

# ------------------ API Gateway ------------------
import {
  to = module.api_gateway.aws_api_gateway_rest_api.expense_tracker
  id = "p33uctgtx0"
}

import {
  to = module.api_gateway.aws_api_gateway_authorizer.cognito
  id = "p33uctgtx0/l0s065"
}

import {
  to = module.api_gateway.aws_api_gateway_request_validator.query_and_headers
  id = "p33uctgtx0/dzvoql"
}

import {
  to = module.api_gateway.aws_api_gateway_resource.history
  id = "p33uctgtx0/djhvw9"
}

# Methods (id: "<rest-api-id>/<resource-id>/<HTTP_METHOD>")
import {
  to = module.api_gateway.aws_api_gateway_method.root_post
  id = "p33uctgtx0/0rowfnvkbg/POST"
}

import {
  to = module.api_gateway.aws_api_gateway_method.root_get
  id = "p33uctgtx0/0rowfnvkbg/GET"
}

import {
  to = module.api_gateway.aws_api_gateway_method.root_delete
  id = "p33uctgtx0/0rowfnvkbg/DELETE"
}

import {
  to = module.api_gateway.aws_api_gateway_method.root_options
  id = "p33uctgtx0/0rowfnvkbg/OPTIONS"
}

import {
  to = module.api_gateway.aws_api_gateway_method.history_get
  id = "p33uctgtx0/djhvw9/GET"
}

import {
  to = module.api_gateway.aws_api_gateway_method.history_options
  id = "p33uctgtx0/djhvw9/OPTIONS"
}

# Integrations (id same as method)
import {
  to = module.api_gateway.aws_api_gateway_integration.root_post
  id = "p33uctgtx0/0rowfnvkbg/POST"
}

import {
  to = module.api_gateway.aws_api_gateway_integration.root_get
  id = "p33uctgtx0/0rowfnvkbg/GET"
}

import {
  to = module.api_gateway.aws_api_gateway_integration.root_delete
  id = "p33uctgtx0/0rowfnvkbg/DELETE"
}

import {
  to = module.api_gateway.aws_api_gateway_integration.root_options
  id = "p33uctgtx0/0rowfnvkbg/OPTIONS"
}

import {
  to = module.api_gateway.aws_api_gateway_integration.history_get
  id = "p33uctgtx0/djhvw9/GET"
}

import {
  to = module.api_gateway.aws_api_gateway_integration.history_options
  id = "p33uctgtx0/djhvw9/OPTIONS"
}

# Method responses (id: "<rest-api-id>/<resource-id>/<HTTP_METHOD>/<STATUS>")
import {
  to = module.api_gateway.aws_api_gateway_method_response.root_post_200
  id = "p33uctgtx0/0rowfnvkbg/POST/200"
}

import {
  to = module.api_gateway.aws_api_gateway_method_response.root_get_200
  id = "p33uctgtx0/0rowfnvkbg/GET/200"
}

import {
  to = module.api_gateway.aws_api_gateway_method_response.root_delete_200
  id = "p33uctgtx0/0rowfnvkbg/DELETE/200"
}

import {
  to = module.api_gateway.aws_api_gateway_method_response.history_get_200
  id = "p33uctgtx0/djhvw9/GET/200"
}

import {
  to = module.api_gateway.aws_api_gateway_method_response.history_options_200
  id = "p33uctgtx0/djhvw9/OPTIONS/200"
}

# Integration responses (same id)
import {
  to = module.api_gateway.aws_api_gateway_integration_response.root_post_200
  id = "p33uctgtx0/0rowfnvkbg/POST/200"
}

import {
  to = module.api_gateway.aws_api_gateway_integration_response.root_get_200
  id = "p33uctgtx0/0rowfnvkbg/GET/200"
}

import {
  to = module.api_gateway.aws_api_gateway_integration_response.root_delete_200
  id = "p33uctgtx0/0rowfnvkbg/DELETE/200"
}

import {
  to = module.api_gateway.aws_api_gateway_integration_response.history_options_200
  id = "p33uctgtx0/djhvw9/OPTIONS/200"
}

# Deployment (id: "<rest-api-id>/<deployment-id>") — the current live deployment
# is imported so the stage points at an existing deployment id. `triggers` and
# `description` are ignored via lifecycle so this stays a zero-diff import.
import {
  to = module.api_gateway.aws_api_gateway_deployment.this
  id = "p33uctgtx0/pnrdd8"
}

# Stage (id: "<rest-api-id>/<stage-name>")
import {
  to = module.api_gateway.aws_api_gateway_stage.this
  id = "p33uctgtx0/dev"
}

# NOTE: aws_lambda_permission blocks are intentionally not managed by Terraform.
# The console left multiple duplicate SIDs (6 on read-items, 2 on cors-options).
# They remain in each Lambda's resource-based policy in AWS but Terraform stays
# out of that state so the import diff is clean.

# NOTE: aws_cloudwatch_log_group resources are intentionally not managed by
# Terraform. AWS Lambda auto-creates them on first invocation (when the
# execution role has logs permissions). `expense-tracker-create-item` has no
# logs permission today so its log group does not yet exist — attempting to
# import it fails. If retention needs to be enforced later, add resources +
# imports for the log groups that already exist.
*/
