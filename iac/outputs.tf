output "user_pool_id" {
  description = "Cognito User Pool ID."
  value       = module.cognito.user_pool_id
}

output "user_pool_client_id" {
  description = "Cognito app client ID."
  value       = module.cognito.user_pool_client_id
}

output "user_pool_domain" {
  description = "Cognito hosted-UI domain prefix."
  value       = module.cognito.user_pool_domain
}

output "api_id" {
  description = "API Gateway REST API ID."
  value       = module.api_gateway.rest_api_id
}

output "api_invoke_url" {
  description = "Base invoke URL for the deployed API Gateway stage."
  value       = module.api_gateway.invoke_url
}

output "dynamodb_table_name" {
  description = "DynamoDB table name."
  value       = module.dynamodb.table_name
}
