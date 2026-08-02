variable "table_name" {
  description = "DynamoDB table name."
  type        = string
}

variable "autoscaling_min_capacity" {
  description = "Minimum capacity units for read/write auto-scaling."
  type        = number
  default     = 1
}

variable "autoscaling_max_capacity" {
  description = "Maximum capacity units for read/write auto-scaling."
  type        = number
  default     = 10
}

variable "autoscaling_target_utilization" {
  description = "Target utilization percentage for target-tracking scaling policies."
  type        = number
  default     = 70
}
