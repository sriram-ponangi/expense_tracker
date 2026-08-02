variable "stage_name" {
  description = "API Gateway stage name."
  type        = string
}

variable "cognito_pool_arn" {
  description = "Cognito User Pool ARN used as the Cognito authorizer's provider."
  type        = string
}

variable "lambda_invoke_arns" {
  description = "Map of logical function key to Lambda invoke ARN."
  type = object({
    create_item  = string
    read_items   = string
    read_history = string
    delete_item  = string
    cors_options = string
  })
}
