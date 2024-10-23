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

        stage('Terraform Init') {
            steps {
                script {
                    // 初始化與應用 Terraform
                    sh '''
                        cd terraform
                        terraform init
                        terraform apply -auto-approve
                    '''
                }
            }
        }
        stage('Get Outputs') {
            steps {
                script {
                    def outputs = sh(script: 'terraform output -json', returnStdout: true).trim()
                    echo "Raw Terraform Output: ${outputs}"
                    
                    def json = readJSON(text: outputs)
                    echo "Parsed JSON: ${json}"
                    
                    // 設定環境變數
                    env.SITE_ECR_REPO = json.site_ecr_repo?.value ?: "null"
                    env.USER_SERVICE_ECR_REPO = json.user_service_ecr_repo?.value ?: "null"
                    env.PRODUCT_SERVICE_ECR_REPO = json.product_service_ecr_repo?.value ?: "null"
                    env.ORDER_SERVICE_ECR_REPO = json.order_service_ecr_repo?.value ?: "null"
                    env.PAYMENT_SERVICE_ECR_REPO = json.payment_service_ecr_repo?.value ?: "null"
                    env.EKS_CLUSTER_ARN = json.eks_cluster_arn?.value ?: "null"
                    env.EKS_CLUSTER_URL = json.eks_cluster_url?.value ?: "null"
                    env.LOG_GROUP_NAME = json.log_group_name?.value ?: "null"
                }
            }
        }
        stage('Verify Outputs') {
            steps {
                script {
                    // 驗證輸出的變數
                    echo "Verify All Terraform Outputs: ${outputs}"
                    echo "SITE_ECR_REPO: ${env.SITE_ECR_REPO}"
                    echo "USER_SERVICE_ECR_REPO: ${env.USER_SERVICE_ECR_REPO}"
                    echo "PRODUCT_SERVICE_ECR_REPO: ${env.PRODUCT_SERVICE_ECR_REPO}"
                    echo "ORDER_SERVICE_ECR_REPO: ${env.ORDER_SERVICE_ECR_REPO}"
                    echo "PAYMENT_SERVICE_ECR_REPO: ${env.PAYMENT_SERVICE_ECR_REPO}"
                    echo "EKS_CLUSTER_ARN: ${env.EKS_CLUSTER_ARN}"
                    echo "EKS_CLUSTER_URL: ${env.EKS_CLUSTER_URL}"
                    echo "LOG_GROUP_NAME: ${env.LOG_GROUP_NAME}"
                }
            }
        }

        /*
        stage('Ansible Configuration') {
            steps {
                script {
                    // 使用 Ansible 配置 EC2 或其他服務，並使用從 Terraform 獲得的變數
                    sh "ansible-playbook -i inventory.yml -e 'site_ecr_repo=${env.SITE_ECR_REPO} eks_cluster_arn=${env.EKS_CLUSTER_ARN}' setup.yml"
                }
            }
        }
        */
        

        stage('Build Docker Image') {
            steps {
                script {
                    // 使用 Dockerfile 建構 Image
                    sh """
                    docker build -t ${env.SITE_ECR_REPO}:${env.IMAGE_TAG} .
                    docker build -t ${env.USER_SERVICE_ECR_REPO}:${env.IMAGE_TAG} .
                    docker build -t ${env.PRODUCT_SERVICE_ECR_REPO}:${env.IMAGE_TAG} .
                    docker build -t ${env.ORDER_SERVICE_ECR_REPO}:${env.IMAGE_TAG} .
                    docker build -t ${env.PAYMENT_SERVICE_ECR_REPO}:${env.IMAGE_TAG} .
                    """
                }
            }
        }

        stage('Login to ECR & Push Image') {
            steps {
                script {
                    // 驗證輸出的變數
                    sh """
                    echo "SITE_ECR_REPO: ${env.SITE_ECR_REPO}"
                    echo "USER_SERVICE_ECR_REPO: ${env.USER_SERVICE_ECR_REPO}"
                    echo "PRODUCT_SERVICE_ECR_REPO: ${env.PRODUCT_SERVICE_ECR_REPO}"
                    echo "ORDER_SERVICE_ECR_REPO: ${env.ORDER_SERVICE_ECR_REPO}"
                    echo "PAYMENT_SERVICE_ECR_REPO: ${env.PAYMENT_SERVICE_ECR_REPO}"
                    echo "EKS_CLUSTER_ARN: ${env.EKS_CLUSTER_ARN}"
                    echo "EKS_CLUSTER_URL: ${env.EKS_CLUSTER_URL}"
                    echo "LOG_GROUP_NAME: ${env.LOG_GROUP_NAME}"
                    set -e  # 開啟 Shell 的錯誤模式，若有錯誤則停止執行
                    # 透過 AWS CLI 登入 ECR
                    aws ecr get-login-password --region ${env.AWS_REGION} | docker login --username AWS --password-stdin ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com
                    # Push Image 到 ECR
                    docker tag ${env.SITE_ECR_REPO}:${env.IMAGE_TAG} ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.SITE_ECR_REPO}:${env.IMAGE_TAG}
                    docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.SITE_ECR_REPO}:${env.IMAGE_TAG}
                    docker tag ${env.USER_SERVICE_ECR_REPO}:${env.IMAGE_TAG} ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.USER_SERVICE_ECR_REPO}:${env.IMAGE_TAG}
                    docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.USER_SERVICE_ECR_REPO}:${env.IMAGE_TAG}
                    docker tag ${env.PRODUCT_SERVICE_ECR_REPO}:${env.IMAGE_TAG} ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.PRODUCT_SERVICE_ECR_REPO}:${env.IMAGE_TAG}
                    docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.PRODUCT_SERVICE_ECR_REPO}:${env.IMAGE_TAG}
                    docker tag ${env.ORDER_SERVICE_ECR_REPO}:${env.IMAGE_TAG} ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ORDER_SERVICE_ECR_REPO}:${env.IMAGE_TAG}
                    docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ORDER_SERVICE_ECR_REPO}:${env.IMAGE_TAG}
                    docker tag ${env.PAYMENT_SERVICE_ECR_REPO}:${env.IMAGE_TAG} ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.PAYMENT_SERVICE_ECR_REPO}:${env.IMAGE_TAG}
                    docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.PAYMENT_SERVICE_ECR_REPO}:${env.IMAGE_TAG}
                    """
                }
            }
        }

        
        /*
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
        */

        stage('Install Fluent Bit') {
            steps {
                script {
                    // 安裝 aws-for-fluent-bit Helm Chart
                    sh """
                        helm repo add fluent https://fluent.github.io/helm-charts
                        helm repo update
                        helm install aws-for-fluent-bit fluent/fluent-bit \
                        --set awsRegion=${env.AWS_REGION} \
                        --set cloudWatch.logGroupName=${env.LOG_GROUP_NAME}
                    """
                }
            }
        }

        stage('Helm Deploy') {
            steps {
                script {
                    // 建立 Docker images 的設定，使用參數命名方式
                    def images = """
                        --set services.user-service.image.repository=${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.USER_SERVICE_ECR_REPO} \
                        --set services.user-service.image.tag=${env.IMAGE_TAG} \
                        --set services.product-service.image.repository=${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.PRODUCT_SERVICE_ECR_REPO} \
                        --set services.product-service.image.tag=${env.IMAGE_TAG} \
                        --set services.order-service.image.repository=${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ORDER_SERVICE_ECR_REPO} \
                        --set services.order-service.image.tag=${env.IMAGE_TAG} \
                        --set services.payment-service.image.repository=${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.PAYMENT_SERVICE_ECR_REPO} \
                        --set services.payment-service.image.tag=${env.IMAGE_TAG} \
                        --set services.site-service.image.repository=${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.SITE_ECR_REPO} \
                        --set services.site-service.image.tag=${env.IMAGE_TAG}
                    """

                    // 使用 helm 指令，使用參數命名方式動態傳遞 awsRegion 和 awsLogsGroup
                    sh """
                        helm upgrade --install k8s-site ./k8s-chart \
                        --set awsRegion=${env.AWS_REGION} \
                        --set services.user-service.awsLogsGroup=${env.LOG_GROUP_NAME} \
                        --set services.product-service.awsLogsGroup=${env.LOG_GROUP_NAME} \
                        --set services.order-service.awsLogsGroup=${env.LOG_GROUP_NAME} \
                        --set services.payment-service.awsLogsGroup=${env.LOG_GROUP_NAME} \
                        --set services.site-service.awsLogsGroup=${env.LOG_GROUP_NAME} \
                        ${images}
                    """
                }
            }
        }
    }

    post {
        failure {
            // 如果過程失敗，清除 terraform 建的資源
            sh '''
                cd terraform
                terraform destroy -auto-approve
                rm -rf .terraform*
                rm -rf terraform.tfstate*
            '''
        }

        always {
            script {
                // 無論成功與否，確保清理 Jenkins workspace
                //cleanWS()
                // Clean after build
                // 清理工作區設置
                cleanWs(
                    // 如果構建未完成也進行清理
                    cleanWhenNotBuilt: false,
                    // 刪除目錄
                    deleteDirs: true,
                    // 禁用延遲清除
                    disableDeferredWipeout: true,
                    // 失敗時不會使構建失敗
                    notFailBuild: true,
                    // 包含與排除的檔案模式
                    patterns: [
                        // 包含 .gitignore 檔案
                        [pattern: '.gitignore', type: 'INCLUDE'],
                        // 排除 .propsfile 檔案
                        [pattern: '.propsfile', type: 'EXCLUDE']
                    ]
                )

                // 檢查 Terraform 是否被鎖定，並解除鎖定
                def lockFile = 'terraform.tfstate.lock.info'
                if (fileExists(lockFile)) {
                    echo 'Terraform state is locked, attempting to unlock...'
                    // 用 force-unlock 解鎖
                    def lockId = readFile(lockFile).trim() // 讀取鎖定 ID
                    sh "terraform force-unlock ${lockId}"
                } else {
                    echo 'No lock found, proceeding normally.'
                }

                sh '''
                    # 清除所有未使用的 build cache
                    docker builder prune -f
                    # 刪除未使用的容器
                    docker container prune -f
                    # 刪除所有未使用的映像
                    # docker image prune -a -f
                    # 刪除所有未使用的 docker 磁碟機
                    # docker volume prune -f
                '''
            }
        }
    }
}
