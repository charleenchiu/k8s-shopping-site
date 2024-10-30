## Functionality Report for `web_task.tf`

This Terraform configuration file is primarily used to automate the creation of a complete website infrastructure on the AWS platform, covering functionalities such as website hosting, storage, web caching, and security configurations. The configurations in this file will deploy resources including EC2 instances, EFS (Elastic File System), S3 storage buckets, and CloudFront distribution networks, providing an efficient and secure website service environment.

---

### 1. **AWS Provider Configuration**
   - Specifies the AWS region as `us-east-1` for resource deployment configuration.

### 2. **Working Directory Information Management**
   - Uses `null_resource` and `local_file` resources to store the path of the current working directory in a file for subsequent operations and dependency management.

### 3. **EC2 Private Key Generation and Management**
   - Uses `tls_private_key` resource to generate a 4096-bit RSA private key to ensure the security of SSH connections to EC2 instances.
   - Writes the generated private key to a file with permissions set to 600 and creates a corresponding AWS EC2 public key pair to secure the connection from Jenkins.

### 4. **Security Group Configuration**
   - Creates a security group `allow_tcp_nfs` to allow inbound traffic for specific TCP, SSH, HTTPS, and NFS connections while permitting all outbound traffic to ensure normal access and security for EC2 instances.

### 5. **EC2 Instance Configuration**
   - Uses `aws_instance` resource to create a `t2.micro` EC2 instance and attaches the aforementioned security group to manage connection traffic.
   - Configures `file` and `remote-exec` provisioners to upload the private key to EC2, set its permissions, and add the Jenkins public key to `authorized_keys` for automated deployment management.

### 6. **Elastic File System (EFS) Configuration**
   - Uses `aws_efs_file_system` and `aws_efs_mount_target` to create an EFS file system and mount it to a specified subnet, providing persistent storage needs for data sharing and backup.

### 7. **Remote Configuration (Ansible Integration)**
   - Uses `null_resource` with `local-exec` provisioner to execute Ansible playbooks, passing EFS and S3 information for remote configuration of EC2, ensuring the initialization settings and integration of infrastructure.

### 8. **S3 Bucket Creation and Permission Management**
   - Uses `aws_s3_bucket` to create a private S3 bucket (`tera_bucket`) as a storage solution and restrict public access.
   - Configures `aws_s3_bucket_ownership_controls` and `aws_s3_bucket_public_access_block` to manage ownership and public access controls, ensuring data privacy and security.
   - Sets the S3 bucket ACL to private to restrict read/write access to objects.

### 9. **CloudFront Distribution Network Setup**
   - Uses `aws_cloudfront_distribution` to create a CloudFront distribution network to accelerate global content delivery.
   - Configures `default_cache_behavior` and `ordered_cache_behavior` to define default and path caching strategies, enabling compression to enhance performance.
   - Sets geographic restrictions to only allow access from the United States and Canada to meet compliance requirements.

### 10. **Outputs**
   - Configures output variables for subsequent management and monitoring, including EC2 public IP, EFS ID, S3 bucket name, and ARN, providing essential access information for infrastructure.

---

### Functionality Summary

This `web_task.tf` configuration file provides a comprehensive automated deployment solution for website server infrastructure, including:

- **Website Hosting and Storage Setup**: Achieved through EC2 and EFS for hosting and persistent storage services.
- **Security Setup**: Establishes AWS security groups to ensure secure access for various types of traffic.
- **Content Distribution and Caching**: Enhances global website access speed through CloudFront and sets caching behaviors as needed.
- **Privacy Management**: Configures the S3 bucket to be private with access control to ensure data confidentiality.

This architecture is suitable for automated deployments in a DevOps environment, combining flexibility, high performance, and security.