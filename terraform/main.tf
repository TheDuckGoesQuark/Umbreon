terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  required_version = ">= 0.14.9"
}

provider "aws" {
  profile = "default"
  region = "eu-west-1"
}

resource aws_ecr_repository "umbreon_ecr" {
  name = "umbreon_ecr_repository"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

output "umbreon_ecr_name" {
  value = aws_ecr_repository.umbreon_ecr.name
}