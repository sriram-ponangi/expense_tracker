resource "aws_dynamodb_table" "expense_tracker" {
  name         = var.table_name
  billing_mode = "PROVISIONED"

  read_capacity  = 1
  write_capacity = 1

  hash_key  = "user_id"
  range_key = "date"

  attribute {
    name = "user_id"
    type = "S"
  }

  attribute {
    name = "date"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  deletion_protection_enabled = false

  # Auto-scaling (below) actively adjusts read/write capacity. Ignore the
  # capacity attributes so Terraform doesn't fight the scaling policy.
  lifecycle {
    ignore_changes = [read_capacity, write_capacity]
  }
}

# ------------------------------------------------------------------
# Application Auto Scaling — read + write capacity
# ------------------------------------------------------------------

resource "aws_appautoscaling_target" "read" {
  service_namespace  = "dynamodb"
  resource_id        = "table/${aws_dynamodb_table.expense_tracker.name}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  min_capacity       = var.autoscaling_min_capacity
  max_capacity       = var.autoscaling_max_capacity

  # AWS's DescribeScalableTargets does not return an ARN, so the provider can't
  # call TagResource. Provider default_tags would otherwise cause a permanent
  # drift on tags_all every plan.
  lifecycle {
    ignore_changes = [tags, tags_all]
  }
}

resource "aws_appautoscaling_target" "write" {
  service_namespace  = "dynamodb"
  resource_id        = "table/${aws_dynamodb_table.expense_tracker.name}"
  scalable_dimension = "dynamodb:table:WriteCapacityUnits"
  min_capacity       = var.autoscaling_min_capacity
  max_capacity       = var.autoscaling_max_capacity

  lifecycle {
    ignore_changes = [tags, tags_all]
  }
}

resource "aws_appautoscaling_policy" "read" {
  # Hardcoded to match the console-created policy name (has a literal `$` prefix).
  name               = "$expense-tracker-scaling-policy"
  service_namespace  = aws_appautoscaling_target.read.service_namespace
  resource_id        = aws_appautoscaling_target.read.resource_id
  scalable_dimension = aws_appautoscaling_target.read.scalable_dimension
  policy_type        = "TargetTrackingScaling"

  target_tracking_scaling_policy_configuration {
    target_value = var.autoscaling_target_utilization

    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }
  }
}

resource "aws_appautoscaling_policy" "write" {
  # Hardcoded to match the console-created policy name (has a literal `$` prefix).
  name               = "$expense-tracker-scaling-policy"
  service_namespace  = aws_appautoscaling_target.write.service_namespace
  resource_id        = aws_appautoscaling_target.write.resource_id
  scalable_dimension = aws_appautoscaling_target.write.scalable_dimension
  policy_type        = "TargetTrackingScaling"

  target_tracking_scaling_policy_configuration {
    target_value = var.autoscaling_target_utilization

    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }
  }
}
