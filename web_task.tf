// 設定 AWS provider 區域資訊
provider "aws" {
    region = "us-east-1"
}

// 獲取當前工作目錄並存儲在一個文件中
resource "null_resource" "get_pwd" {
  // pwd 路徑會是：/var/lib/jenkins/workspace/vprofile-project/terraform
  provisioner "local-exec" {
    command = "pwd > ${path.module}/current_dir.txt"
  }
}

// 讀取當前工作目錄的資料
data "local_file" "current_dir" {
  depends_on = [null_resource.get_pwd]
  filename   = "${path.module}/current_dir.txt"
}

// 建立 EC2 私鑰變數
variable "key_name" {
  default = "charleen_Terraform_test_nfs"
}

// 生成 EC2 私鑰
resource "tls_private_key" "ec2_private_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

// 將私鑰寫入文件
// 不在上段產生 private key 時寫入檔案，以免造成循環依賴
resource "null_resource" "write_private_key" {
  provisioner "local-exec" {
    command = <<EOT
      echo '${tls_private_key.ec2_private_key.private_key_pem}' > ${path.module}/${var.key_name}.pem
      chmod 600 ${path.module}/${var.key_name}.pem
      EOT
  }
}

// 產生公鑰
// 不用 depends_on 以避免循環依賴
resource "aws_key_pair" "ec2_key_pair" {
  key_name   = var.key_name
  public_key = tls_private_key.ec2_private_key.public_key_openssh
}

// Jenkins 的公鑰
// 不用 depends_on 以避免循環依賴
locals {
  jenkins_public_key = aws_key_pair.ec2_key_pair.public_key
}

// 建立 AWS Security Group
resource "aws_security_group" "allow_tcp_nfs" {
  name        = "allow_tcp_nfs"
  description = "允許 TCP 和 NFS 的入站流量"
  vpc_id      = "vpc-02fb581658eb58d45"

  ingress {
    description = "TCP 流量來自 VPC"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
   ingress {
    description = "SSH 流量來自 VPC"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "HTTPS 流量來自 VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "NFS 流量來自 VPC"
    from_port   = 2049
    to_port     = 2049
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_tcp_nfs"
  }
}

// 啟動新的 EC2 實例
resource "aws_instance" "myWebServer" {
  ami = "ami-0e86e20dae9224db8"
  instance_type = "t2.micro"
  key_name = var.key_name
  vpc_security_group_ids = [aws_security_group.allow_tcp_nfs.id]
  subnet_id = "subnet-0153eaf2e8d59b0a0"
  associate_public_ip_address = true 
  tags = {
      Name = "myWebServer"
  }

  // file provisioner：將設置好權限的私鑰文件從本地複製到遠端機器
  provisioner "file" {
    source      = "${path.module}/${var.key_name}.pem"
    destination = "/home/ubuntu/.ssh/${var.key_name}.pem"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.ec2_private_key.private_key_pem
      host        = self.public_ip
    }
  }
 
  // remote-exec provisioner：設置私鑰文件的權限並添加 Jenkins 公鑰到 authorized_keys
  provisioner "remote-exec" {
    inline = [
      "echo '${local.jenkins_public_key}' >> /home/ubuntu/.ssh/authorized_keys"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.ec2_private_key.private_key_pem
      host        = self.public_ip
    }
  }
}

// 建立 EFS 檔案系統
resource "aws_efs_file_system" "myWebEFS" {
  creation_token = "CharleenWebFile"

  tags = {
    Name = "CharleenWebFileSystem"
  }
}

// 掛載 EFS
resource "aws_efs_mount_target" "mountefs" {
  file_system_id  = aws_efs_file_system.myWebEFS.id
  subnet_id       = "subnet-0153eaf2e8d59b0a0"
  security_groups = [aws_security_group.allow_tcp_nfs.id]
}

// 設定外部儲存體
resource "null_resource" "setupVol" {
  depends_on = [aws_instance.myWebServer, aws_efs_mount_target.mountefs, aws_s3_bucket.tera_bucket]

  // 連到新建的 EC2 並執行 Ansible playbook，傳入 EFS ID 和 S3 資訊
  provisioner "local-exec" {
    command = <<EOT
      ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook \
      -u ubuntu --private-key ${path.module}/${var.key_name}.pem \
      -i '${aws_instance.myWebServer.public_ip},' master_ubuntu.yml \
      -e "efs_id=${aws_efs_file_system.myWebEFS.id}" \
      -e "s3_bucket_name=${aws_s3_bucket.tera_bucket.bucket}" \
      -e "s3_bucket_arn=${aws_s3_bucket.tera_bucket.arn}"
    EOT
  }
}

// 建立 S3 私有 Bucket
resource "aws_s3_bucket" "tera_bucket" {
  bucket = "charleen-terra-bucket-test"

  tags = {
    Name = "terra_bucket"
  }
}

// S3 權限控制設定
// 設定 S3 Bucket 擁有權控制
resource "aws_s3_bucket_ownership_controls" "tera_bucket_ownership" {
  bucket = aws_s3_bucket.tera_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

// 公開訪問限制設定
resource "aws_s3_bucket_public_access_block" "tera_bucket_acblock" {
  bucket = aws_s3_bucket.tera_bucket.id

  block_public_acls   = true
  block_public_policy = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_acl" "tera_bucket_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.tera_bucket_ownership,
    aws_s3_bucket_public_access_block.tera_bucket_acblock,
  ]

  bucket = aws_s3_bucket.tera_bucket.id
  acl    = "private"
}

// 本地變數
locals {
  s3_origin_id = "myS3Origin"
}

// 為 CloudFront 建立 Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "Tera Access Identity"
}

// CloudFront 分佈設定
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.tera_bucket.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Terra Access Identity"

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  ordered_cache_behavior {
    path_pattern     = "/content/immutable/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true


    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA"]
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "Tera Access Identity"
  }
}

// 輸出
output "ec2_public_ip" {
  value = aws_instance.myWebServer.public_ip
}

output "efs_id" {
  value = aws_efs_file_system.myWebEFS.id
}

// 新增輸出 EFS 和 S3 Bucket 的資訊
output "s3_bucket_name" {
  value = aws_s3_bucket.tera_bucket.bucket
}

output "s3_bucket_arn" {
  value = aws_s3_bucket.tera_bucket.arn
}

output "efs_id" {
  value = aws_efs_file_system.myWebEFS.id
}

