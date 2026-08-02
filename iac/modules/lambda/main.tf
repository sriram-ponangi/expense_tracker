locals {
  functions = {
    create_item = {
      name          = "expense-tracker-create-item"
      source_file   = "expense-tracker-create-item.mjs"
      archive_entry = "index.mjs"
      description   = "expense-tracker-create-item"
      role_key      = "create_item"
    }
    read_items = {
      name          = "expense-tracker-read-items"
      source_file   = "expense-tracker-read-items.mjs"
      archive_entry = "index.mjs"
      description   = ""
      role_key      = "read_items"
    }
    read_history = {
      name          = "expense-tracker-read-items-history"
      source_file   = "expense-tracker-read-items-history.mjs"
      archive_entry = "index.mjs"
      description   = ""
      role_key      = "read_items"
    }
    delete_item = {
      name          = "expense-tracker-delete-item"
      source_file   = "expense-tracker-delete-item.mjs"
      archive_entry = "index.mjs"
      description   = ""
      role_key      = "delete_item"
    }
    cors_options = {
      name          = "expense-tracker-cors-options"
      source_file   = "expense-tracker-cors-options.js"
      archive_entry = "index.js"
      description   = ""
      role_key      = "cors_options"
    }
  }
}

data "archive_file" "package" {
  for_each = local.functions

  type                    = "zip"
  output_path             = "${path.module}/.build/${each.value.name}.zip"
  source_content          = file("${var.source_dir}/${each.value.source_file}")
  source_content_filename = each.value.archive_entry
}

# CloudWatch log groups are intentionally NOT managed by Terraform.
# AWS Lambda auto-creates them on first invocation (when the execution role
# has the required logs permissions). Managing them here would fail import for
# functions whose log group doesn't exist yet (e.g. create-item's role has no
# logs permission today). If retention needs to be enforced later, add
# aws_cloudwatch_log_group blocks with an explicit import for existing ones.

resource "aws_lambda_function" "fn" {
  for_each = local.functions

  function_name = each.value.name
  description   = each.value.description
  role          = var.role_arns[each.value.role_key]

  runtime       = "nodejs22.x"
  handler       = "index.handler"
  architectures = ["x86_64"]
  memory_size   = 128
  timeout       = 3

  filename         = data.archive_file.package[each.key].output_path
  source_code_hash = data.archive_file.package[each.key].output_base64sha256

  tracing_config {
    mode = "PassThrough"
  }

  ephemeral_storage {
    size = 512
  }

  logging_config {
    log_format = "Text"
    log_group  = "/aws/lambda/${each.value.name}"
  }
}
