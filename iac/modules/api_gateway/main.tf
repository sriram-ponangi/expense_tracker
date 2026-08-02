resource "aws_api_gateway_rest_api" "expense_tracker" {
  name        = "expense-tracker"
  description = "API Gateway for the expense tracker app"

  api_key_source = "HEADER"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  disable_execute_api_endpoint = false
}

resource "aws_api_gateway_authorizer" "cognito" {
  name          = "expense-tracker-api-gateway-authorizer"
  rest_api_id   = aws_api_gateway_rest_api.expense_tracker.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = [var.cognito_pool_arn]

  identity_source = "method.request.header.Authorization"
}

resource "aws_api_gateway_request_validator" "query_and_headers" {
  name                        = "Validate query string parameters and headers"
  rest_api_id                 = aws_api_gateway_rest_api.expense_tracker.id
  validate_request_body       = false
  validate_request_parameters = true
}

# ------------------------------------------------------------------
# Resources
# ------------------------------------------------------------------

resource "aws_api_gateway_resource" "history" {
  rest_api_id = aws_api_gateway_rest_api.expense_tracker.id
  parent_id   = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  path_part   = "{history+}"
}

# ------------------------------------------------------------------
# Root path (/) methods
# ------------------------------------------------------------------

# POST / -> create-item
resource "aws_api_gateway_method" "root_post" {
  rest_api_id   = aws_api_gateway_rest_api.expense_tracker.id
  resource_id   = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id
}

resource "aws_api_gateway_integration" "root_post" {
  rest_api_id             = aws_api_gateway_rest_api.expense_tracker.id
  resource_id             = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  http_method             = aws_api_gateway_method.root_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arns["create_item"]
  passthrough_behavior    = "WHEN_NO_MATCH"
  content_handling        = "CONVERT_TO_TEXT"
  timeout_milliseconds    = 29000
}

resource "aws_api_gateway_method_response" "root_post_200" {
  rest_api_id = aws_api_gateway_rest_api.expense_tracker.id
  resource_id = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  http_method = aws_api_gateway_method.root_post.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "root_post_200" {
  rest_api_id = aws_api_gateway_rest_api.expense_tracker.id
  resource_id = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  http_method = aws_api_gateway_method.root_post.http_method
  status_code = aws_api_gateway_method_response.root_post_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [aws_api_gateway_integration.root_post]
}

# GET / -> read-items
resource "aws_api_gateway_method" "root_get" {
  rest_api_id          = aws_api_gateway_rest_api.expense_tracker.id
  resource_id          = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  http_method          = "GET"
  authorization        = "COGNITO_USER_POOLS"
  authorizer_id        = aws_api_gateway_authorizer.cognito.id
  request_validator_id = aws_api_gateway_request_validator.query_and_headers.id

  request_parameters = {
    "method.request.header.Authorization"     = true
    "method.request.querystring.startDate"    = true
    "method.request.querystring.endDate"      = true
    "method.request.querystring.responseData" = true
  }
}

resource "aws_api_gateway_integration" "root_get" {
  rest_api_id             = aws_api_gateway_rest_api.expense_tracker.id
  resource_id             = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  http_method             = aws_api_gateway_method.root_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arns["read_items"]
  passthrough_behavior    = "WHEN_NO_MATCH"
  content_handling        = "CONVERT_TO_TEXT"
  timeout_milliseconds    = 29000
}

resource "aws_api_gateway_method_response" "root_get_200" {
  rest_api_id = aws_api_gateway_rest_api.expense_tracker.id
  resource_id = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  http_method = aws_api_gateway_method.root_get.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "root_get_200" {
  rest_api_id = aws_api_gateway_rest_api.expense_tracker.id
  resource_id = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  http_method = aws_api_gateway_method.root_get.http_method
  status_code = aws_api_gateway_method_response.root_get_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [aws_api_gateway_integration.root_get]
}

# DELETE / -> delete-item
resource "aws_api_gateway_method" "root_delete" {
  rest_api_id   = aws_api_gateway_rest_api.expense_tracker.id
  resource_id   = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  http_method   = "DELETE"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id
}

resource "aws_api_gateway_integration" "root_delete" {
  rest_api_id             = aws_api_gateway_rest_api.expense_tracker.id
  resource_id             = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  http_method             = aws_api_gateway_method.root_delete.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arns["delete_item"]
  passthrough_behavior    = "WHEN_NO_MATCH"
  content_handling        = "CONVERT_TO_TEXT"
  timeout_milliseconds    = 29000
}

resource "aws_api_gateway_method_response" "root_delete_200" {
  rest_api_id = aws_api_gateway_rest_api.expense_tracker.id
  resource_id = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  http_method = aws_api_gateway_method.root_delete.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
}

resource "aws_api_gateway_integration_response" "root_delete_200" {
  rest_api_id = aws_api_gateway_rest_api.expense_tracker.id
  resource_id = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  http_method = aws_api_gateway_method.root_delete.http_method
  status_code = aws_api_gateway_method_response.root_delete_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [aws_api_gateway_integration.root_delete]
}

# OPTIONS / -> cors-options (Lambda proxy)
resource "aws_api_gateway_method" "root_options" {
  rest_api_id   = aws_api_gateway_rest_api.expense_tracker.id
  resource_id   = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "root_options" {
  rest_api_id             = aws_api_gateway_rest_api.expense_tracker.id
  resource_id             = aws_api_gateway_rest_api.expense_tracker.root_resource_id
  http_method             = aws_api_gateway_method.root_options.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arns["cors_options"]
  passthrough_behavior    = "WHEN_NO_MATCH"
  content_handling        = "CONVERT_TO_TEXT"
  timeout_milliseconds    = 29000
}

# ------------------------------------------------------------------
# /{history+} methods
# ------------------------------------------------------------------

# GET /{history+} -> read-items-history
resource "aws_api_gateway_method" "history_get" {
  rest_api_id          = aws_api_gateway_rest_api.expense_tracker.id
  resource_id          = aws_api_gateway_resource.history.id
  http_method          = "GET"
  authorization        = "COGNITO_USER_POOLS"
  authorizer_id        = aws_api_gateway_authorizer.cognito.id
  request_validator_id = aws_api_gateway_request_validator.query_and_headers.id

  request_parameters = {
    "method.request.header.Authorization"  = true
    "method.request.path.history"          = true
    "method.request.querystring.startDate" = true
    "method.request.querystring.endDate"   = true
  }
}

resource "aws_api_gateway_integration" "history_get" {
  rest_api_id             = aws_api_gateway_rest_api.expense_tracker.id
  resource_id             = aws_api_gateway_resource.history.id
  http_method             = aws_api_gateway_method.history_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arns["read_history"]
  passthrough_behavior    = "WHEN_NO_MATCH"
  content_handling        = "CONVERT_TO_TEXT"
  timeout_milliseconds    = 29000

  cache_key_parameters = ["method.request.path.history"]
}

resource "aws_api_gateway_method_response" "history_get_200" {
  rest_api_id = aws_api_gateway_rest_api.expense_tracker.id
  resource_id = aws_api_gateway_resource.history.id
  http_method = aws_api_gateway_method.history_get.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }
}

# OPTIONS /{history+} -> MOCK preflight
resource "aws_api_gateway_method" "history_options" {
  rest_api_id   = aws_api_gateway_rest_api.expense_tracker.id
  resource_id   = aws_api_gateway_resource.history.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "history_options" {
  rest_api_id          = aws_api_gateway_rest_api.expense_tracker.id
  resource_id          = aws_api_gateway_resource.history.id
  http_method          = aws_api_gateway_method.history_options.http_method
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  timeout_milliseconds = 29000

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "history_options_200" {
  rest_api_id = aws_api_gateway_rest_api.expense_tracker.id
  resource_id = aws_api_gateway_resource.history.id
  http_method = aws_api_gateway_method.history_options.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = false
    "method.response.header.Access-Control-Allow-Methods" = false
    "method.response.header.Access-Control-Allow-Origin"  = false
  }
}

resource "aws_api_gateway_integration_response" "history_options_200" {
  rest_api_id = aws_api_gateway_rest_api.expense_tracker.id
  resource_id = aws_api_gateway_resource.history.id
  http_method = aws_api_gateway_method.history_options.http_method
  status_code = aws_api_gateway_method_response.history_options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_integration.history_options]
}

# ------------------------------------------------------------------
# Deployment + stage
# ------------------------------------------------------------------

resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.expense_tracker.id
  description = "Cors fix for delete api"

  # The existing deployment (imported below) was created via the console and has
  # no `triggers` value stored. We keep `triggers` and `description` outside of
  # drift detection so import is clean; when you need to redeploy, use
  # `terraform apply -replace=module.api_gateway.aws_api_gateway_deployment.this`.
  lifecycle {
    create_before_destroy = true
    ignore_changes        = [triggers, description]
  }

  depends_on = [
    aws_api_gateway_method.root_post,
    aws_api_gateway_method.root_get,
    aws_api_gateway_method.root_delete,
    aws_api_gateway_method.root_options,
    aws_api_gateway_method.history_get,
    aws_api_gateway_method.history_options,
    aws_api_gateway_integration.root_post,
    aws_api_gateway_integration.root_get,
    aws_api_gateway_integration.root_delete,
    aws_api_gateway_integration.root_options,
    aws_api_gateway_integration.history_get,
    aws_api_gateway_integration.history_options,
  ]
}

resource "aws_api_gateway_stage" "this" {
  rest_api_id   = aws_api_gateway_rest_api.expense_tracker.id
  deployment_id = aws_api_gateway_deployment.this.id
  stage_name    = var.stage_name

  xray_tracing_enabled = true
}
