pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        AWS_ACCOUNT_ID = '167804136284' // AWS 帳戶 ID
        HELM_RELEASE_NAME="k8s-site"    // Helm upgrade 時用的release name
        //IMAGE_TAG = 'latest' // Docker Image Tag
        IMAGE_TAG = 'stable' // Docker Image Tag
        AWS_REGION = 'us-east-1'    // AWS 區域
        /*
        將在 Terraform 階段後更新的環境變數，不可在這裡給預設值，會無法在建置過程中賦值
        */
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
                    // 獲取原始輸出
                    def outputs = sh(script: 'cd terraform && terraform refresh && terraform output', returnStdout: true).trim()
                    //echo "outputs: ${outputs}"

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

        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }

        stage('Code Analysis with CheckStyle') {
            steps {
                sh 'mvn checkstyle:checkstyle'
            }
            post {
                success {
                    echo 'Generated Analysis Result'
                }
            }
        }

        stage('Build && SonarQube analysis') {
            environment {
                scannerHome = tool 'SonarScanner'
            }
            steps {
                withSonarQubeEnv('SonarServer') {
                    sh '''${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=k8s-site \
                    -Dsonar.projectName=k8s-site-repo \
                    -Dsonar.projectVersion=1.0 \
                    -Dsonar.sources=src/ \
                    -Dsonar.java.binaries=target/test-classes/com/visualpathit/account/controllerTest/ \
                    -Dsonar.junit.reportsPath=target/surefire-reports/ \
                    -Dsonar.jacoco.reportsPath=target/jacoco.exec \
                    -Dsonar.java.checkstyle.reportPaths=target/checkstyle-result.xml'''
                }
            }
        }
        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    // Parameter indicates whether to set pipeline to UNSTABLE if Quality Gate fails
                    // true = set pipeline to UNSTABLE, false = don't
                    waitForQualityGate abortPipeline: true
                }
            }
        }

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
        
        stage('Install Helm') {
            steps {
                script {
                    sh """
                    # 下載並安裝 Helm 到 /tmp 目錄(以防主機沒有安裝)
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

        stage('Install or Upgrade Fluent Bit') {
            steps {
                script {
                    // 用Fluent Bit將Kubernetes的log寫入cloudwatch log group
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

                    // 進入 helm chart 目錄
                    dir('./k8s-chart') {
                        // 使用 helm 指令，使用參數命名方式動態傳遞 awsRegion、serviceType 和 awsLogsGroup
                        sh """
                            set -x  # 啟用命令追蹤
                            helm upgrade --install ${env.HELM_RELEASE_NAME} . \
                            --set awsRegion=${env.AWS_REGION} \
                            --set awsLogsGroup=${env.LOG_GROUP_NAME} \
                            --set services.user-service.image.repository=${env.USER_SERVICE_ECR_REPO} \
                            --set services.user-service.image.tag=${env.IMAGE_TAG} \
                            --set services.product-service.image.repository=${env.PRODUCT_SERVICE_ECR_REPO} \
                            --set services.product-service.image.tag=${env.IMAGE_TAG} \
                            --set services.order-service.image.repository=${env.ORDER_SERVICE_ECR_REPO} \
                            --set services.order-service.image.tag=${env.IMAGE_TAG} \
                            --set services.payment-service.image.repository=${env.PAYMENT_SERVICE_ECR_REPO} \
                            --set services.payment-service.image.tag=${env.IMAGE_TAG} \
                            --set services.site-service.image.repository=${env.SITE_ECR_REPO} \
                            --set services.site-service.image.tag=${env.IMAGE_TAG}
                            set +x  # 關閉命令追蹤
                        """
                    }
                }
            }
        }

    }

    post {
        failure {
            // 如果過程失敗，清除 terraform 建的資源
            sh '''
                helm uninstall ${env.HELM_RELEASE_NAME} # 刪除Helm建立的資源，例如ELB。但不會自動刪除 Docker 映像
                helm uninstall aws-for-fluent-bit
                cd terraform     # 切換到 terraform 目錄
                sudo chmod +x delete_ecr_images.sh   # 確保 delete_ecr_images.sh 可執行
                ./delete_ecr_images.sh  # 注意加上 "./" 來執行當前目錄的腳本，執行刪除映像的腳本
                terraform destroy -auto-approve     # 刪除 terraform 資源
                rm -rf .terraform*              # 刪除相關的 terraform 檔案
                rm -rf terraform.tfstate*       # 刪除相關的 terraform 檔案
            '''
        }

        always {
            script {
                // 清理 Jenkins 工作區
                cleanWs(
                    cleanWhenNotBuilt: false,  // 構建未完成也進行清理
                    deleteDirs: true,          // 刪除目錄
                    disableDeferredWipeout: true, // 禁用延遲清除
                    notFailBuild: true,        // 清理失敗時不影響構建結果
                    patterns: [
                        [pattern: '.gitignore', type: 'INCLUDE'],  // 包含 .gitignore 檔案
                        [pattern: '.propsfile', type: 'EXCLUDE']  // 排除 .propsfile 檔案
                    ]
                )

                // 檢查並解除 Terraform 狀態鎖定
                def lockFile = 'terraform.tfstate.lock.info'
                if (fileExists(lockFile)) {
                    echo 'Terraform state is locked, attempting to unlock...'
                    def lockId = readFile(lockFile).trim()  // 讀取鎖定 ID
                    sh "terraform force-unlock ${lockId}"
                } else {
                    echo 'No lock found, proceeding normally.'
                }

                // 清理 Docker 資源
                sh '''
                    docker builder prune -f        # 清除所有未使用的 build cache
                    docker container prune -f      # 刪除未使用的容器
                    docker image prune -a -f     # 刪除所有未使用的映像
                    docker volume prune -f       # 刪除未使用的磁碟機
                '''
            }
        }
    }
}
