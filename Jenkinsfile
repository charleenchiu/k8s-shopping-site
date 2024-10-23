pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        AWS_ACCOUNT_ID = '167804136284' // AWS 帳戶 ID
        IMAGE_TAG = 'latest' // Docker Image Tag
        AWS_REGION = 'us-east-1'    // AWS 區域
        SERVICE_TYPE = "ClusterIP"    // Kubernetes 的 Service Type
        /*
        SITE_ECR_REPO = ''   // ECR Repository 名稱（將在 Terraform 階段後更新）
        USER_SERVICE_ECR_REPO = ''  // User Service 的 ECR Repository
        PRODUCT_SERVICE_ECR_REPO = '' // Product Service 的 ECR Repository
        ORDER_SERVICE_ECR_REPO = '' // Order Service 的 ECR Repository
        PAYMENT_SERVICE_ECR_REPO = '' // Payment Service 的 ECR Repository
        EKS_CLUSTER_NAME = '' // EKS Cluster Name（將在 Terraform 階段後更新）
        EKS_CLUSTER_ARN = '' // EKS Cluster ARN（將在 Terraform 階段後更新）
        EKS_CLUSTER_URL = '' // EKS Cluster URL（將在 Terraform 階段後更新）
        KUBECONFIG_CERTIFICATE_AUTHORITY_DATA = '' // Kubernetes 憑證授權中心的資料
        LOG_GROUP_NAME = ''   // CloudWatch Log Group 名稱（將在 Terraform 階段後更新）
        */
    }

    stages {
        stage('Checkout Code') {
            steps {
                // 從 Git 獲取程式碼
                git branch: '1_simple', url: 'https://github.com/charleenchiu/k8s-shopping-site.git'
            }
        }

        /*
        stage('Terraform Init') {
            steps {
                script {
                    // 初始化與應用 Terraform
                    sh '''
                        cd terraform
                        terraform init
                        terraform apply -auto-approve
                    '''
                    

                    // 執行 terraform refresh 以更新狀態
                    def refreshOutput = sh(script: 'cd terraform && terraform refresh', returnStdout: true).trim()
                    echo "Terraform refresh output: ${refreshOutput}"

                    // 獲取輸出值
                    def outputs = sh(script: 'cd terraform && terraform output', returnStdout: true).trim()
                    echo "outputs: ${outputs}"

                    // 格式化輸出
                    def formattedOutputs_1 = outputs.replaceAll(/\r?\n/, "\n")
                    echo "formattedOutputs_1: ${formattedOutputs_1}"
                    def formattedOutputs_2 = outputs.replaceAll(/(\w+\s+=\s+.+?)(?=\w+\s+=\s+)/, '$1\n---\n')
                    echo "formattedOutputs_2: ${formattedOutputs_2}"

                    // 提取 CloudWatch Log Group 名稱
                    def logGroupName = (outputs =~ /LOG_GROUP_NAME\s+=\s+(\S+)/)[0][1]
                    echo "logGroupName: ${logGroupName}"

                    // 設定環境變數
                    env.LOG_GROUP_NAME = logGroupName
                                     
                }
            }
        }
        */

        stage('Get Outputs') {
            steps {
                script {
                    // 獲取原始輸出
                    def outputs = sh(script: 'cd terraform && terraform refresh && terraform output', returnStdout: true).trim()
                    echo "outputs: ${outputs}"

                    // 將結果拆分為各自的變數
                    def outputList = outputs.split('\n').collect { it.trim() }
                    env.SITE_ECR_REPO = outputList.find { it.contains("site_ecr_repo") }?.split('=')[1]?.trim()
                    env.USER_SERVICE_ECR_REPO = outputList.find { it.contains("user_service_ecr_repo") }?.split('=')[1]?.trim()
                    env.PRODUCT_SERVICE_ECR_REPO = outputList.find { it.contains("product_service_ecr_repo") }?.split('=')[1]?.trim()
                    env.ORDER_SERVICE_ECR_REPO = outputList.find { it.contains("order_service_ecr_repo") }?.split('=')[1]?.trim()
                    env.PAYMENT_SERVICE_ECR_REPO = outputList.find { it.contains("payment_service_ecr_repo") }?.split('=')[1]?.trim()
                    env.LOG_GROUP_NAME = outputList.find { it.contains("log_group_name") }?.split('=')[1]?.trim()
                    env.EKS_CLUSTER_NAME = outputList.find { it.contains("eks_cluster_name") }?.split('=')[1]?.trim()
                    env.EKS_CLUSTER_ARN = outputList.find { it.contains("eks_cluster_arn") }?.split('=')[1]?.trim()
                    env.EKS_CLUSTER_URL = outputList.find { it.contains("eks_cluster_url") }?.split('=')[1]?.trim()
                    env.KUBECONFIG_CERTIFICATE_AUTHORITY_DATA = outputList.find { it.contains("kubeconfig_certificate_authority_data") }?.split('=')[1]?.trim()
                }
            }
        }

        stage('Verify Outputs') {
            steps {
                script {
                    // 獲取原始輸出
                    def outputs = sh(script: 'terraform output', returnStdout: true).trim()
                    echo "outputs: ${outputs}"

                    // 驗證輸出的變數
                    echo "SITE_ECR_REPO: ${env.SITE_ECR_REPO}"
                    echo "USER_SERVICE_ECR_REPO: ${env.USER_SERVICE_ECR_REPO}"
                    echo "PRODUCT_SERVICE_ECR_REPO: ${env.PRODUCT_SERVICE_ECR_REPO}"
                    echo "ORDER_SERVICE_ECR_REPO: ${env.ORDER_SERVICE_ECR_REPO}"
                    echo "PAYMENT_SERVICE_ECR_REPO: ${env.PAYMENT_SERVICE_ECR_REPO}"
                    echo "EKS_CLUSTER_NAME: ${env.EKS_CLUSTER_NAME}"
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
        
        /*
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
        */

        /*
        stage('Login to Private ECR & Push Image') {
            steps {
                script {
                    // 驗證輸出的變數
                    sh """
                    echo "SITE_ECR_REPO: ${env.SITE_ECR_REPO}"
                    echo "USER_SERVICE_ECR_REPO: ${env.USER_SERVICE_ECR_REPO}"
                    echo "PRODUCT_SERVICE_ECR_REPO: ${env.PRODUCT_SERVICE_ECR_REPO}"
                    echo "ORDER_SERVICE_ECR_REPO: ${env.ORDER_SERVICE_ECR_REPO}"
                    echo "PAYMENT_SERVICE_ECR_REPO: ${env.PAYMENT_SERVICE_ECR_REPO}"
                    echo "EKS_CLUSTER_NAME: ${env.EKS_CLUSTER_NAME}"
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
        }*/

        /*
        stage('Login to Public ECR & Push Image') {
            steps {
                script {
                    sh """
                    echo "SITE_ECR_REPO: ${env.SITE_ECR_REPO}"
                    echo "USER_SERVICE_ECR_REPO: ${env.USER_SERVICE_ECR_REPO}"
                    echo "PRODUCT_SERVICE_ECR_REPO: ${env.PRODUCT_SERVICE_ECR_REPO}"
                    echo "ORDER_SERVICE_ECR_REPO: ${env.ORDER_SERVICE_ECR_REPO}"
                    echo "PAYMENT_SERVICE_ECR_REPO: ${env.PAYMENT_SERVICE_ECR_REPO}"
                    echo "EKS_CLUSTER_NAME: ${env.EKS_CLUSTER_NAME}"
                    echo "EKS_CLUSTER_ARN: ${env.EKS_CLUSTER_ARN}"
                    echo "EKS_CLUSTER_URL: ${env.EKS_CLUSTER_URL}"
                    echo "LOG_GROUP_NAME: ${env.LOG_GROUP_NAME}"
                    set -e  # 開啟 Shell 的錯誤模式，若有錯誤則停止執行
                    # 透過 AWS CLI 登入公共 ECR
                    aws ecr-public get-login-password --region ${env.AWS_REGION} | docker login --username AWS --password-stdin public.ecr.aws
                    # Push Image 到公共 ECR
                    docker tag ${env.SITE_ECR_REPO}:${env.IMAGE_TAG} public.ecr.aws/j5a0e3h8/k8s-shopping-site:${env.IMAGE_TAG}
                    docker push public.ecr.aws/j5a0e3h8/k8s-shopping-site:${env.IMAGE_TAG}
                    docker tag ${env.USER_SERVICE_ECR_REPO}:${env.IMAGE_TAG} public.ecr.aws/j5a0e3h8/k8s-shopping-site/user_service:${env.IMAGE_TAG}
                    docker push public.ecr.aws/j5a0e3h8/k8s-shopping-site/user_service:${env.IMAGE_TAG}
                    docker tag ${env.PRODUCT_SERVICE_ECR_REPO}:${env.IMAGE_TAG} public.ecr.aws/j5a0e3h8/k8s-shopping-site/product_service:${env.IMAGE_TAG}
                    docker push public.ecr.aws/j5a0e3h8/k8s-shopping-site/product_service:${env.IMAGE_TAG}
                    docker tag ${env.ORDER_SERVICE_ECR_REPO}:${env.IMAGE_TAG} public.ecr.aws/j5a0e3h8/k8s-shopping-site/order_service:${env.IMAGE_TAG}
                    docker push public.ecr.aws/j5a0e3h8/k8s-shopping-site/order_service:${env.IMAGE_TAG}
                    docker tag ${env.PAYMENT_SERVICE_ECR_REPO}:${env.IMAGE_TAG} public.ecr.aws/j5a0e3h8/k8s-shopping-site/payment_service:${env.IMAGE_TAG}
                    docker push public.ecr.aws/j5a0e3h8/k8s-shopping-site/payment_service:${env.IMAGE_TAG}
                    """
                }
            }
        }
        */
        
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

        stage('Install Helm') {
            steps {
                script {
                    sh """
                    # 下載並安裝 Helm 到 /tmp 目錄
                    curl -L https://get.helm.sh/helm-v3.16.2-linux-amd64.tar.gz -o /tmp/helm.tar.gz
                    tar -zxvf /tmp/helm.tar.gz -C /tmp
                    export PATH=\$PATH:/tmp/linux-amd64                    
                    # 確認 Helm 安裝成功
                    helm version
                    """
                }
            }
        }
        
        stage('Config kubectl Connect to EKS Cluster') {
            steps {
                script { 
                    sh """
                    aws eks update-kubeconfig --region ${env.AWS_REGION} --name ${env.EKS_CLUSTER_NAME}
                    """
                }
            }
        }

        /*
        stage('Install Fluent Bit') {
            steps {
                script {
                    sh """
                    # 將 Helm 二進制檔案路徑加入到 PATH 中
                    export PATH=\$PATH:/tmp/linux-amd64                    
                    # 安裝 Fluent Bit Helm Chart
                    helm repo add fluent https://fluent.github.io/helm-charts
                    helm repo update
                    helm install aws-for-fluent-bit fluent/fluent-bit \
                    --set awsRegion=${env.AWS_REGION} \
                    --set cloudWatch.logGroupName=${env.LOG_GROUP_NAME}
                    """
                }
            }
        }
        */

        stage('Install or Upgrade Fluent Bit') {
            steps {
                script {
                    // 將 Helm 二進制檔案路徑加入到 PATH 中
                    sh """
                        export PATH=\$PATH:/tmp/linux-amd64
                        # 安裝或升級 Fluent Bit Helm Chart
                        helm repo add fluent https://fluent.github.io/helm-charts
                        helm repo update
                        helm upgrade --install aws-for-fluent-bit fluent/fluent-bit \
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
                    /* private ECR
                    def images = """
                        --set services.user-service.image.repository=public.ecr.aws/${env.USER_SERVICE_ECR_REPO} \
                        --set services.user-service.image.tag=${env.IMAGE_TAG} \
                        --set services.product-service.image.repository=public.ecr.aws/${env.PRODUCT_SERVICE_ECR_REPO} \
                        --set services.product-service.image.tag=${env.IMAGE_TAG} \
                        --set services.order-service.image.repository=public.ecr.aws/${env.ORDER_SERVICE_ECR_REPO} \
                        --set services.order-service.image.tag=${env.IMAGE_TAG} \
                        --set services.payment-service.image.repository=public.ecr.aws/${env.PAYMENT_SERVICE_ECR_REPO} \
                        --set services.payment-service.image.tag=${env.IMAGE_TAG} \
                        --set services.site-service.image.repository=public.ecr.aws/${env.SITE_ECR_REPO} \
                        --set services.site-service.image.tag=${env.IMAGE_TAG}
                    """
                    */

                    //public ECR
                    // 建立 Docker images 的設定，使用參數命名方式
                    def images = """
                        --set services.user-service.image.repository=public.ecr.aws/${env.USER_SERVICE_ECR_REPO} \
                        --set services.user-service.image.tag=${env.IMAGE_TAG} \
                        --set services.product-service.image.repository=public.ecr.aws/${env.PRODUCT_SERVICE_ECR_REPO} \
                        --set services.product-service.image.tag=${env.IMAGE_TAG} \
                        --set services.order-service.image.repository=public.ecr.aws/${env.ORDER_SERVICE_ECR_REPO} \
                        --set services.order-service.image.tag=${env.IMAGE_TAG} \
                        --set services.payment-service.image.repository=public.ecr.aws/${env.PAYMENT_SERVICE_ECR_REPO} \
                        --set services.payment-service.image.tag=${env.IMAGE_TAG} \
                        --set services.site-service.image.repository=public.ecr.aws/${env.SITE_ECR_REPO} \
                        --set services.site-service.image.tag=${env.IMAGE_TAG}
                    """

                    // 進入 helm chart 目錄
                    dir('./k8s-chart') {
                        // 使用 helm 指令，使用參數命名方式動態傳遞 awsRegion 和 awsLogsGroup
                        sh """
                            helm upgrade --install k8s-site . \
                            --set awsRegion=${env.AWS_REGION} \
                            --set serviceType=${env.SERVICE_TYPE} \
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
    }

    post {
        /*
        failure {
            // 如果過程失敗，清除 terraform 建的資源
            sh '''
                cd terraform
                terraform destroy -auto-approve
                rm -rf .terraform*
                rm -rf terraform.tfstate*
            '''
        }
        */

        always {
            script {
                /*
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
                */

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
