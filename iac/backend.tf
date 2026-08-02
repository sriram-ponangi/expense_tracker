terraform {
  backend "s3" {
    bucket       = "expense--tracker"
    key          = "terraform/state/expense-tracker.tfstate"
    region       = "us-east-2"
    encrypt      = true
    use_lockfile = true
  }
}
