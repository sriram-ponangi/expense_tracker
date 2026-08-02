variable "aws_region" {
  description = "AWS region for all resources."
  type        = string
  default     = "us-east-2"
}

variable "aws_account_id" {
  description = "AWS account id the resources belong to."
  type        = string
  default     = "885115002496"
}

variable "default_tags" {
  description = "Tags applied to every taggable resource via the provider default_tags block."
  type        = map(string)
  default = {
    app       = "expense-tracker"
    project   = "expense-tracker"
    managedBy = "terraform"
  }
}

variable "table_name" {
  description = "DynamoDB table name."
  type        = string
  default     = "expense-tracker"
}

variable "api_stage_name" {
  description = "API Gateway stage name."
  type        = string
  default     = "dev"
}

variable "cognito_callback_urls" {
  description = "Cognito app client callback URLs."
  type        = list(string)
  default     = ["http://localhost:4200/home"]
}

variable "cognito_logout_urls" {
  description = "Cognito app client logout URLs."
  type        = list(string)
  default     = ["http://localhost:4200/sign-in"]
}
