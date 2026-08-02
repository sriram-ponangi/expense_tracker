output "rest_api_id" {
  description = "API Gateway REST API ID."
  value       = aws_api_gateway_rest_api.expense_tracker.id
}

output "execution_arn" {
  description = "Base execution ARN for the API (use with Lambda permission source_arn)."
  value       = aws_api_gateway_rest_api.expense_tracker.execution_arn
}

output "invoke_url" {
  description = "Base URL for the deployed stage."
  value       = aws_api_gateway_stage.this.invoke_url
}

output "history_resource_id" {
  description = "Resource ID for the /{history+} path (needed for imports)."
  value       = aws_api_gateway_resource.history.id
}

output "authorizer_id" {
  description = "Cognito authorizer ID."
  value       = aws_api_gateway_authorizer.cognito.id
}

output "request_validator_id" {
  description = "Query+header request validator ID."
  value       = aws_api_gateway_request_validator.query_and_headers.id
}

output "root_resource_id" {
  description = "Root resource ID of the REST API."
  value       = aws_api_gateway_rest_api.expense_tracker.root_resource_id
}
