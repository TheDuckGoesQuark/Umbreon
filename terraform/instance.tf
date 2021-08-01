data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}
//
//resource "aws_instance" "api-server" {
//  ami           = data.aws_ami.ubuntu.id
//  instance_type = "t3.micro"
//
//  tags = {
//    Name = "UmbreonServer"
//  }
//}

resource "aws_ecs_cluster" "umbreon_cluster" {
  name = "umbreon-cluster"
}