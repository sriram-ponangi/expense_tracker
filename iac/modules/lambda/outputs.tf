output "function_names" {
  description = "Map of logical function key to physical Lambda function name."
  value       = { for k, fn in aws_lambda_function.fn : k => fn.function_name }
}

output "function_arns" {
  description = "Map of logical function key to Lambda function ARN."
  value       = { for k, fn in aws_lambda_function.fn : k => fn.arn }
}

output "invoke_arns" {
  description = "Map of logical function key to Lambda invoke ARN for API Gateway integrations."
  value       = { for k, fn in aws_lambda_function.fn : k => fn.invoke_arn }
}
