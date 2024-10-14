# 我在一台已建立的EC2 Jenkins server上執行jenkinsfile、terraform檔、ansible檔來建立、設定、上傳、運行Docker image、ECR、EKS，並且要清除暫存檔及暫存的Docker Image。請教我怎麼撰寫這些檔案

要在 EC2 Jenkins server 上執行 Jenkinsfile、Terraform、Ansible，來建立 AWS 資源（例如 ECR、EKS），並且完成 Docker image 上傳和清理工作，你可以分別撰寫以下這些檔案來實現：

### 1. **Jenkinsfile**（定義 CI/CD Pipeline 流程）
Jenkinsfile 主要用來定義 Jenkins pipeline 的步驟，包括 Terraform 部署、Ansible 設定、Docker build & push 等步驟。以下是一個範例：

```groovy
pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1' // AWS 區域
        ECR_REPO = 'your-ecr-repository' // ECR Repository 名稱
        IMAGE_TAG = 'latest' // Docker Image Tag
    }

    stages {
        stage('Checkout Code') {
            steps {
                // 從 Git 獲取程式碼
                git branch: 'main', url: 'https://github.com/your-repo/your-project.git'
            }
        }

        stage('Terraform Init & Apply') {
            steps {
                script {
                    // 初始化 Terraform
                    sh 'terraform init'
                    
                    // 執行 Terraform Apply 建立資源
                    sh 'terraform apply -auto-approve'
                }
            }
        }

        stage('Ansible Configuration') {
            steps {
                script {
                    // 使用 Ansible 配置 EC2 或其他服務
                    sh 'ansible-playbook -i inventory.yml setup.yml'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // 使用 Dockerfile 建構 Image
                    sh 'docker build -t $ECR_REPO:$IMAGE_TAG .'
                }
            }
        }

        stage('Login to ECR & Push Image') {
            steps {
                script {
                    // 透過 AWS CLI 登入 ECR
                    sh 'aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com'
                    
                    // Push Image 到 ECR
                    sh 'docker tag $ECR_REPO:$IMAGE_TAG ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/$ECR_REPO:$IMAGE_TAG'
                    sh 'docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/$ECR_REPO:$IMAGE_TAG'
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                script {
                    // 使用 kubectl 將 Image 部署到 EKS 集群
                    sh 'kubectl apply -f k8s-deployment.yml'
                }
            }
        }

        stage('Clean up') {
            steps {
                script {
                    // 清理暫存檔案及 Docker image
                    sh 'docker system prune -f'
                }
            }
        }
    }

    post {
        always {
            // 無論成功與否，確保清理
            cleanWs()
        }
    }
}
```

### 2. **Terraform 檔案**（建立 ECR 和 EKS）
Terraform 檔案用於定義 AWS 資源，這裡包含 ECR（Docker 容器存放庫）和 EKS（Kubernetes 集群）資源。

- `main.tf`：
```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_ecr_repository" "my_repo" {
  name = "my-ecr-repo"
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "my-eks-cluster"
  cluster_version = "1.21"
  vpc_id          = var.vpc_id
  subnet_ids      = var.subnet_ids

  manage_aws_auth = true
  node_groups = {
    eks_nodes = {
      desired_capacity = 2
      max_capacity     = 3
      min_capacity     = 1

      instance_type = "t3.medium"
    }
  }
}
```

- `variables.tf`（定義變數）：
```hcl
variable "vpc_id" {}
variable "subnet_ids" {
  type = list(string)
}
```

- `outputs.tf`（輸出 EKS 和 ECR 資訊）：
```hcl
output "ecr_repository_url" {
  value = aws_ecr_repository.my_repo.repository_url
}

output "eks_cluster_name" {
  value = module.eks.cluster_id
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}
```

### 3. **Ansible 檔案**（配置 EC2 或其他服務）
Ansible 用來配置 EC2 或 Kubernetes 集群等服務的環境。

- `inventory.yml`（定義要配置的伺服器）：
```yaml
all:
  hosts:
    my-ec2-instance:
      ansible_host: ec2-instance-ip
      ansible_user: ec2-user
      ansible_ssh_private_key_file: /path/to/private-key.pem
```

- `setup.yml`（安裝所需的套件及配置）：
```yaml
---
- hosts: all
  become: true
  tasks:
    - name: Install Docker
      apt:
        name: docker.io
        state: present

    - name: Start Docker service
      service:
        name: docker
        state: started
        enabled: true

    - name: Install Kubernetes CLI
      apt:
        name: kubectl
        state: present
```

### 4. **清理腳本**（在 Jenkinsfile 中使用的清理步驟）
清理暫存檔案和 Docker Image 可以放在 Jenkinsfile 的 `Clean up` 步驟中。這裡可以使用 Docker 的 `prune` 命令清理不再需要的資源：

- `docker system prune -f`：會清理無用的資料，包括停止的容器、未使用的網路和無用的映像檔。

### 5. **EKS 部署檔案**（Kubernetes 部署設定）
當 Docker Image 上傳至 ECR 後，可以透過 `kubectl` 命令將 Image 部署到 EKS。範例 Kubernetes deployment 檔案如下：

- `k8s-deployment.yml`：
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app-container
          image: "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/my-ecr-repo:latest"
          ports:
            - containerPort: 80
```

### 6. **清理暫存的 Docker Image**
在 Jenkins pipeline 的最後一個步驟中，你可以使用 Docker 的清理指令來移除不再需要的 Image：

```bash
docker system prune -f
```

### 總結：
1. Jenkinsfile 定義了整個 CI/CD 流程，包含程式碼下載、Terraform 部署、Ansible 配置、Docker Build & Push、EKS 部署、清理工作等。
2. Terraform 檔案用來建立 AWS 資源（例如 ECR 和 EKS）。
3. Ansible 檔案用來配置 EC2 或 Kubernetes 相關的設定。
4. 在每個步驟中確保清理暫存檔案與不需要的 Docker Image，保持系統乾淨。

這樣的設計能夠有效實現從 Jenkins pipeline 到 AWS 資源建立，再到應用部署的自動化流程。

