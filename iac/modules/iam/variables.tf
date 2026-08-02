variable "dynamodb_table_arn" {
  description = "ARN of the DynamoDB table the policies grant access to."
  type        = string
}

variable "cors_options_log_group" {
  description = "CloudWatch log group ARN pattern the CORS options Lambda writes to (scoped exec role)."
  type        = string
}
