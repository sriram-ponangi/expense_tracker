variable "callback_urls" {
  description = "Cognito app client callback URLs."
  type        = list(string)
}

variable "logout_urls" {
  description = "Cognito app client logout URLs."
  type        = list(string)
}
