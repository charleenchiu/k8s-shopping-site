pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        AWS_REGION = 'us-east-1'    // AWS 區域
        AWS_ACCOUNT_ID = '167804136284' // AWS 帳戶 ID
        SITE_ECR_REPO = ''   // ECR Repository 名稱（將在 Terraform 階段後更新）
        USER_SERVICE_ECR_REPO = ''  // User Service 的 ECR Repository
        PRODUCT_SERVICE_ECR_REPO = '' // Product Service 的 ECR Repository
        ORDER_SERVICE_ECR_REPO = '' // Order Service 的 ECR Repository
        PAYMENT_SERVICE_ECR_REPO = '' // Payment Service 的 ECR Repository
        EKS_CLUSTER_ARN = '' // EKS Cluster ARN（將在 Terraform 階段後更新）
        EKS_CLUSTER_URL = '' // EKS Cluster URL（將在 Terraform 階段後更新）
        KUBECONFIG_CERTIFICATE_AUTHORITY_DATA = '' // Kubernetes 憑證授權中心的資料
        IMAGE_TAG = 'latest' // Docker Image Tag
        LOG_GROUP_NAME = ''   // CloudWatch Log Group 名稱（將在 Terraform 階段後更新）
    }

    stages {
        stage('Checkout Code') {
            steps {
                // 從 Git 獲取程式碼
                git branch: '1_simple', url: 'https://github.com/charleenchiu/k8s-shopping-site.git'
            }
        }

        stage('Terraform Init & Apply') {
            steps {
                script {
                    // 初始化 Terraform 並應用配置
                    /* Jenkins 的每一個 sh 步驟都在一個新的 shell 中執行，
                        因此要在同一個 sh 步驟中執行所有相關的 Terraform 命令，
                        也不可有空行，
                        才不會發生找不到路徑的問題 */
                    sh '''
                        pwd
                        cd terraform
                        pwd
                        terraform init
                        terraform apply -auto-approve
                    '''
                    // 確保從 terraform 目錄中取得輸出
                    env.SITE_ECR_REPO = sh(script: 'cd terraform && terraform output -raw site_ecr_repo', returnStdout: true).trim()
                    env.USER_SERVICE_ECR_REPO = sh(script: 'cd terraform && terraform output -raw user_service_ecr_repo', returnStdout: true).trim()
                    env.PRODUCT_SERVICE_ECR_REPO = sh(script: 'cd terraform && terraform output -raw product_service_ecr_repo', returnStdout: true).trim()
                    env.ORDER_SERVICE_ECR_REPO = sh(script: 'cd terraform && terraform output -raw order_service_ecr_repo', returnStdout: true).trim()
                    env.PAYMENT_SERVICE_ECR_REPO = sh(script: 'cd terraform && terraform output -raw payment_service_ecr_repo', returnStdout: true).trim()
                    env.EKS_CLUSTER_ARN = sh(script: 'cd terraform && terraform output -raw eks_cluster_arn', returnStdout: true).trim()
                    env.EKS_CLUSTER_URL = sh(script: 'cd terraform && terraform output -raw eks_cluster_url', returnStdout: true).trim()
                    env.KUBECONFIG_CERTIFICATE_AUTHORITY_DATA = sh(script: 'cd terraform && terraform output -raw kubeconfig_certificate_authority_data', returnStdout: true).trim()
                    env.LOG_GROUP_NAME = sh(script: 'cd terraform && terraform output -raw cloudwatch_log_group_name', returnStdout: true).trim()
                }
            }
        }

        
        stage('Ansible Configuration') {
            steps {
                script {
                    // 使用 Ansible 配置 EC2 或其他服務，並使用從 Terraform 獲得的變數
                    sh "ansible-playbook -i inventory.yml -e 'site_ecr_repo=${env.SITE_ECR_REPO} eks_cluster_arn=${env.EKS_CLUSTER_ARN}' setup.yml"
                }
            }
        }
        

        stage('Build Docker Image') {
            steps {
                script {
                    // 使用 Dockerfile 建構 Image
                    sh "docker build -t ${env.SITE_ECR_REPO}:${env.IMAGE_TAG} ."
                    sh "docker build -t ${env.USER_SERVICE_ECR_REPO}:${env.IMAGE_TAG} ."
                    sh "docker build -t ${env.PRODUCT_SERVICE_ECR_REPO}:${env.IMAGE_TAG} ."
                    sh "docker build -t ${env.ORDER_SERVICE_ECR_REPO}:${env.IMAGE_TAG} ."
                    sh "docker build -t ${env.PAYMENT_SERVICE_ECR_REPO}:${env.IMAGE_TAG} ."
                }
            }
        }

        stage('Login to ECR & Push Image') {
            steps {
                script {
                    // 透過 AWS CLI 登入 ECR
                    sh "aws ecr get-login-password --region ${env.AWS_REGION} | docker login --username AWS --password-stdin ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com"

                    // Push Image 到 ECR
                    sh "docker tag ${env.SITE_ECR_REPO}:${env.IMAGE_TAG} ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.SITE_ECR_REPO}:${env.IMAGE_TAG}"
                    sh "docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.SITE_ECR_REPO}:${env.IMAGE_TAG}"
                    sh "docker tag ${env.USER_SERVICE_ECR_REPO}:${env.IMAGE_TAG} ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.USER_SERVICE_ECR_REPO}:${env.IMAGE_TAG}"
                    sh "docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.USER_SERVICE_ECR_REPO}:${env.IMAGE_TAG}"
                    sh "docker tag ${env.PRODUCT_SERVICE_ECR_REPO}:${env.IMAGE_TAG} ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.PRODUCT_SERVICE_ECR_REPO}:${env.IMAGE_TAG}"
                    sh "docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.PRODUCT_SERVICE_ECR_REPO}:${env.IMAGE_TAG}"
                    sh "docker tag ${env.ORDER_SERVICE_ECR_REPO}:${env.IMAGE_TAG} ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ORDER_SERVICE_ECR_REPO}:${env.IMAGE_TAG}"
                    sh "docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ORDER_SERVICE_ECR_REPO}:${env.IMAGE_TAG}"
                    sh "docker tag ${env.PAYMENT_SERVICE_ECR_REPO}:${env.IMAGE_TAG} ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.PAYMENT_SERVICE_ECR_REPO}:${env.IMAGE_TAG}"
                    sh "docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.PAYMENT_SERVICE_ECR_REPO}:${env.IMAGE_TAG}"
                }
            }
        }

        
        stage('Update Kubernetes Deployment') {
            steps {
                script {
                    // 檢查當前工作目錄
                    sh 'pwd'

                    // 使用 sed 替換 YAML 中的 Docker image 欄位
                    sh "sed -i \"s#your-dockerhub-username/k8s-shopping-site:latest#${env.SITE_ECR_REPO}:${env.IMAGE_TAG}#\" ../k8s/site-service-deployment.yaml"
                    sh "sed -i \"s#your-dockerhub-username/k8s-shopping-site:latest#${env.USER_SERVICE_ECR_REPO}:${env.IMAGE_TAG}#\" ../k8s/user-service-deployment.yaml"
                    sh "sed -i \"s#your-dockerhub-username/k8s-shopping-site:latest#${env.PRODUCT_SERVICE_ECR_REPO}:${env.IMAGE_TAG}#\" ../k8s/product-service-deployment.yaml"
                    sh "sed -i \"s#your-dockerhub-username/k8s-shopping-site:latest#${env.ORDER_SERVICE_ECR_REPO}:${env.IMAGE_TAG}#\" ../k8s/order-service-deployment.yaml"
                    sh "sed -i \"s#your-dockerhub-username/k8s-shopping-site:latest#${env.PAYMENT_SERVICE_ECR_REPO}:${env.IMAGE_TAG}#\" ../k8s/payment-service-deployment.yaml"
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                script {
                    // 使用 kubectl 部署到 EKS
                    sh 'kubectl apply -f ../k8s/site-service-deployment.yaml'
                    sh 'kubectl apply -f ../k8s/user-service-deployment.yaml'
                    sh 'kubectl apply -f ../k8s/product-service-deployment.yaml'
                    sh 'kubectl apply -f ../k8s/order-service-deployment.yaml'
                    sh 'kubectl apply -f ../k8s/payment-service-deployment.yaml'
                }
            }
        }

        /*
        stage('Install Fluent Bit') {
            steps {
                script {
                    // 安裝 aws-for-fluent-bit Helm Chart
                    sh '''
                        helm repo add fluent https://fluent.github.io/helm-charts
                        helm repo update
                        helm install aws-for-fluent-bit fluent/fluent-bit --set awsRegion=${env.AWS_REGION} --set cloudWatch.logGroupName=${env.LOG_GROUP_NAME}
                    '''
                }
            }
        }

        stage('Helm Deploy') {
            steps {
                script {
                    // 建立 Docker images 的設定
                    def images = """
                        services.user-service.image=${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.USER_SERVICE_ECR_REPO}:${env.IMAGE_TAG},
                        services.product-service.image=${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.PRODUCT_SERVICE_ECR_REPO}:${env.IMAGE_TAG},
                        services.order-service.image=${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ORDER_SERVICE_ECR_REPO}:${env.IMAGE_TAG},
                        services.payment-service.image=${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.PAYMENT_SERVICE_ECR_REPO}:${env.IMAGE_TAG},
                        services.site-service.image=${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.SITE_ECR_REPO}:${env.IMAGE_TAG}
                    """

                    // 使用 helm 指令
                    sh "helm upgrade --install k8s-site ./k8s-chart --set awsLogsGroup=${env.LOG_GROUP_NAME},${images}"
                }
            }
        }
        */
    }

    post {
        always {
            // 無論成功與否，確保清理 Jenkins workspace
            cleanWS()
            sh '''
                # 清除所有未使用的 build cache
                echo y | docker builder prune -f
                # 刪除未使用的容器：
                echo y | docker container prune
                # 刪除所有未使用的映像，包括未被任何容器使用的映像。這是釋放空間的有效方法，但要小心，因為它也會刪除任何你不再需要的映像：
                # echo y | docker image prune -a
                # 刪除所有未使用的docker磁碟機。若你的 pipeline 有使用 docker磁碟機 來存儲數據，則需要考慮是否要保留這些docker磁碟機：
                # echo y | docker volume prune
            '''
        }
    }
}
