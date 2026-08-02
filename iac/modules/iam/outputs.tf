output "role_create_item_arn" {
  value = aws_iam_role.create_item.arn
}

output "role_read_items_arn" {
  value = aws_iam_role.read_items.arn
}

output "role_delete_item_arn" {
  value = aws_iam_role.delete_item.arn
}

output "role_cors_options_arn" {
  value = aws_iam_role.cors_options.arn
}

output "role_create_item_name" {
  value = aws_iam_role.create_item.name
}

output "role_read_items_name" {
  value = aws_iam_role.read_items.name
}

output "role_delete_item_name" {
  value = aws_iam_role.delete_item.name
}

output "role_cors_options_name" {
  value = aws_iam_role.cors_options.name
}

output "policy_create_item_arn" {
  value = aws_iam_policy.create_item.arn
}

output "policy_read_items_arn" {
  value = aws_iam_policy.read_items.arn
}

output "policy_cors_options_exec_arn" {
  value = aws_iam_policy.cors_options_exec.arn
}
