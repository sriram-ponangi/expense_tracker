variable "source_dir" {
  description = "Directory containing the Lambda source files (backend/lambda_functions)."
  type        = string
}

variable "role_arns" {
  description = "Map of logical function key to the IAM role ARN Terraform should assign."
  type = object({
    create_item  = string
    read_items   = string
    delete_item  = string
    cors_options = string
  })
}
