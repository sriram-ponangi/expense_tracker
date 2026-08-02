output "user_pool_id" {
  description = "Cognito User Pool ID."
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_arn" {
  description = "Cognito User Pool ARN."
  value       = aws_cognito_user_pool.main.arn
}

output "user_pool_client_id" {
  description = "Cognito app client ID."
  value       = aws_cognito_user_pool_client.angular_app.id
}

output "user_pool_domain" {
  description = "Cognito hosted-UI domain prefix."
  value       = aws_cognito_user_pool_domain.hosted_ui.domain
}
