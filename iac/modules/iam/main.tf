data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# ------------------------------------------------------------------
# Customer-managed policies
# ------------------------------------------------------------------

data "aws_iam_policy_document" "create_item" {
  statement {
    sid       = "VisualEditor0"
    effect    = "Allow"
    actions   = ["dynamodb:PutItem"]
    resources = [var.dynamodb_table_arn]
  }
}

resource "aws_iam_policy" "create_item" {
  name        = "expense-tracker-create-item"
  path        = "/"
  description = ""
  policy      = data.aws_iam_policy_document.create_item.json
}

data "aws_iam_policy_document" "read_items" {
  statement {
    sid    = "VisualEditor0"
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:Scan",
      "dynamodb:Query",
    ]
    resources = [var.dynamodb_table_arn]
  }
}

resource "aws_iam_policy" "read_items" {
  name        = "expense-tracker-read-items"
  path        = "/"
  description = "To read items from the expense-tracker table in dynamoDB."
  policy      = data.aws_iam_policy_document.read_items.json

  tags = {
    purpose = "read-dynamoDB-items"
  }
}

data "aws_iam_policy_document" "cors_options_exec" {
  statement {
    effect    = "Allow"
    actions   = ["logs:CreateLogGroup"]
    resources = ["arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = [var.cors_options_log_group]
  }
}

resource "aws_iam_policy" "cors_options_exec" {
  name        = "AWSLambdaBasicExecutionRole-cc53c3eb-1c32-4c89-a82b-da2fd768e9be"
  path        = "/service-role/"
  description = ""
  policy      = data.aws_iam_policy_document.cors_options_exec.json
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

# ------------------------------------------------------------------
# Roles
# ------------------------------------------------------------------

resource "aws_iam_role" "create_item" {
  name                 = "expense-tracker-create-item"
  path                 = "/"
  description          = "Allows Lambda functions to call AWS services on your behalf."
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  max_session_duration = 3600
}

resource "aws_iam_role" "read_items" {
  name                 = "expense-tracker-read-items"
  path                 = "/"
  description          = "Allows Lambda functions to call AWS services on your behalf."
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  max_session_duration = 3600
}

resource "aws_iam_role" "delete_item" {
  name                 = "expense-tracker-delete-item-role-joil2tn5"
  path                 = "/service-role/"
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  max_session_duration = 3600
}

resource "aws_iam_role" "cors_options" {
  name                 = "expense-tracker-cors-options-role-uoe9f5yc"
  path                 = "/service-role/"
  assume_role_policy   = data.aws_iam_policy_document.lambda_assume_role.json
  max_session_duration = 3600
}

# ------------------------------------------------------------------
# Attachments
# ------------------------------------------------------------------

resource "aws_iam_role_policy_attachment" "create_item_writes" {
  role       = aws_iam_role.create_item.name
  policy_arn = aws_iam_policy.create_item.arn
}

resource "aws_iam_role_policy_attachment" "create_item_reads" {
  role       = aws_iam_role.create_item.name
  policy_arn = aws_iam_policy.read_items.arn
}

resource "aws_iam_role_policy_attachment" "read_items_reads" {
  role       = aws_iam_role.read_items.name
  policy_arn = aws_iam_policy.read_items.arn
}

resource "aws_iam_role_policy_attachment" "read_items_basic_exec" {
  role       = aws_iam_role.read_items.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "delete_item_writes" {
  role       = aws_iam_role.delete_item.name
  policy_arn = aws_iam_policy.create_item.arn
}

resource "aws_iam_role_policy_attachment" "delete_item_reads" {
  role       = aws_iam_role.delete_item.name
  policy_arn = aws_iam_policy.read_items.arn
}

resource "aws_iam_role_policy_attachment" "cors_options_exec" {
  role       = aws_iam_role.cors_options.name
  policy_arn = aws_iam_policy.cors_options_exec.arn
}
