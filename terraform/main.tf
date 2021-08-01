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

output "ecr_name" {
  value = aws_ecr_repository.umbreon_ecr.name
}

output "ecr_url" {
  value = aws_ecr_repository.umbreon_ecr.repository_url
  description = "The ECR repository URL"
}

output "ecs_service" {
  value = aws_ecs_service.umbreon_service.name
}

output "ecs_cluster" {
  value = aws_ecs_cluster.umbreon_cluster.name
}

output "container_name" {
  value = aws_ecs_task_definition.umbreon_ecs_task.family
}