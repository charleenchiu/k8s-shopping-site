/project-root
├── Setup-AWS-Resources
│   └── Jenkinsfile  # 此為 Setup-AWS-Resources 的 Jenkinsfile
├── Build-and-Deploy
│   └── Jenkinsfile  # 此為 Build and Deploy 的 Jenkinsfile
├── Canary-Build-and-Deploy
│   └── Jenkinsfile  # 此為 Canary Build and Deploy 的 Jenkinsfile

# 如何在Multibranch中共享全域變數？(不是terraform output的部份)
在 Jenkins 的 Multibranch Pipeline 中，共享全域變數可以透過幾種方法來實現。以下是一些常用的方法：

### 1. 使用 **Jenkinsfile** 的 `environment` 區塊
在每個 Jenkinsfile 中，您可以定義一組全域變數，這些變數可以在該 Jenkinsfile 的所有階段中使用：

```groovy
pipeline {
    agent any
    environment {
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        AWS_REGION = 'us-east-1'
        IMAGE_TAG = 'latest'
        // 其他全域變數
    }
    stages {
        stage('Example Stage') {
            steps {
                script {
                    echo "AWS Region: ${env.AWS_REGION}"
                    // 其他操作
                }
            }
        }
    }
}
```

### 2. 使用 **Global Variables Plugin**
您可以使用 [Global Variables Plugin](https://plugins.jenkins.io/global-variables/) 來定義全域變數，這樣您可以在所有 Pipeline 中使用這些變數，而無需在每個 Jenkinsfile 中重複定義。

### 3. 使用 **Jenkins Job DSL Plugin**
如果您使用 [Job DSL Plugin](https://plugins.jenkins.io/job-dsl/)，您可以在一個地方定義變數，並將這些變數套用到所有 Jenkinsfile 中。

### 4. 使用 **Shared Libraries**
如果您有多個 Pipeline 需要共享一些邏輯或變數，建議使用 [Shared Libraries](https://www.jenkins.io/doc/book/pipeline/#shared-libraries)。這樣，您可以將變數和功能集中到一個地方，並在各個 Jenkinsfile 中引用它們。

#### 建立 Shared Library：
1. 在您的 Git 儲存庫中建立一個 `vars` 目錄。
2. 在 `vars` 目錄中，創建一個 Groovy 檔案，定義變數或功能，例如 `globalVars.groovy`：

```groovy
def call() {
    return [
        AWS_REGION: 'us-east-1',
        IMAGE_TAG: 'latest',
        // 其他全域變數
    ]
}
```

3. 在您的 Jenkinsfile 中引用這些全域變數：

```groovy
@Library('your-shared-library') _

pipeline {
    agent any
    stages {
        stage('Example Stage') {
            steps {
                script {
                    def vars = globalVars()
                    echo "AWS Region: ${vars.AWS_REGION}"
                    // 其他操作
                }
            }
        }
    }
}
```

### 5. 使用 **環境變數**
如果您希望在所有的 Pipeline 中使用相同的環境變數，可以在 Jenkins 的系統設定中定義這些變數。這些變數在所有的 Pipeline 中都是可用的，但請注意，這樣做會使變數更難在版本控制中管理。

這些方法中，選擇哪一種取決於您的使用情況和組織的需求。如果您需要在多個 Pipeline 中共享邏輯或變數，使用 Shared Libraries 是一個非常好的選擇。

# //===================================================================================

# 這樣的做法確實可以更方便地管理 Terraform output 的參數，但不一定非得放棄 Jenkins Multibranch Pipeline。以下是幾個實現方式，無論您使用單一 pipeline 還是 Multibranch 都可以運作順利：

### 1. 使用 Jenkins 中的 **共享變數** 或 **共享工作區**
在 Jenkins 中，您可以讓 `Setup-AWS-Resources` 將 Terraform output 寫入一個檔案，並將這些資料在 `Build-and-Deploy` 和 `Canary-Build-and-Deploy` 中讀取。示例如下：

#### 於 `Setup-AWS-Resources` Jenkinsfile 中：
```groovy
pipeline {
    agent any
    stages {
        stage('Setup AWS Resources') {
            steps {
                script {
                    def terraformOutput = sh(script: 'terraform output -json', returnStdout: true)
                    writeFile file: 'terraform_output.json', text: terraformOutput
                    archiveArtifacts artifacts: 'terraform_output.json', allowEmptyArchive: false
                }
            }
        }
    }
}
```

#### 在 `Build-and-Deploy` 和 `Canary-Build-and-Deploy` 中：
```groovy
pipeline {
    agent any
    stages {
        stage('Retrieve Terraform Outputs') {
            steps {
                copyArtifacts projectName: 'Setup-AWS-Resources', filter: 'terraform_output.json'
                script {
                    def terraformOutput = readJSON file: 'terraform_output.json'
                    env.CLUSTER_URL = terraformOutput.cluster_url.value
                    env.CERT_AUTH_DATA = terraformOutput.certificate_authority_data.value
                }
            }
        }
        // 其他部屬步驟
    }
}
```

### 2. **使用 Jenkins Pipeline Parameterized Trigger Plugin**
如果您希望透過程式碼管理所有工作流並保持靈活性，可讓 `Setup-AWS-Resources` 的 Jenkinsfile 在完成後以參數化方式觸發 `Build-and-Deploy` 或 `Canary-Build-and-Deploy`，並傳遞 Terraform output：

#### 於 `Setup-AWS-Resources` Jenkinsfile 中：
```groovy
pipeline {
    agent any
    stages {
        stage('Setup AWS Resources') {
            steps {
                script {
                    def terraformOutput = sh(script: 'terraform output -json', returnStdout: true)
                    def clusterUrl = parseJson(terraformOutput).cluster_url.value
                    def certAuthData = parseJson(terraformOutput).certificate_authority_data.value
                    
                    build job: 'Pipeline_Job_Stable-Build-and-Deploy', 
                        parameters: [string(name: 'CLUSTER_URL', value: clusterUrl), string(name: 'CERT_AUTH_DATA', value: certAuthData)]
                }
            }
        }
    }
}
```

### 3. **透過共享 Jenkinsfile 主控多個 Pipeline（您提到的方法）**
您也可以將 `Setup-AWS-Resources`、`Stable-Build-and-Deploy`、`Canary-Build-and-Deploy` 整合進一個 Jenkinsfile 裡的不同分支，並根據需求去啟用 Canary 或 Stable 部署。


//=============================================================================
為了將 AWS 資源的建立與其他經常執行的步驟分開，可以透過以下的方式將 AWS 資源的創建與應用程式的建置和部署過程拆分成不同的 Jenkins 階段。這樣的調整能確保 `Terraform Init` 和 `Terraform Apply` 只在必要時執行（例如第一次建置或資源有變更時），而不會在每次推送程式碼或更新映像檔時重複執行。下面的方式介紹如何在 Jenkins Pipeline 中調整相關階段：

### 修改建議

1. **新增一個初始化 Pipeline**:
    - 建立一個單獨的 Jenkins 任務來處理 `Terraform Init` 與 `Terraform Apply` 步驟，只在 AWS 資源需要建立或更新時執行該 Pipeline。
    - 可命名為 `Setup-AWS-Resources`，並在該 Pipeline 中只執行 Terraform 初始化、申請 EKS 集群、建立 ECR 等 AWS 資源。
    
2. **調整 `Jenkinsfile` 讓 `Build Docker Image` 和 `Helm Deploy` 階段更獨立**:
    - 把 `Terraform` 階段改為條件式執行或完全移除，並將相應的輸出變數設定為全域共享變數（例如透過 Jenkins Global Environment Variables 或 AWS Parameter Store 存取）。
    - 移除 `Terraform` 後的步驟改為僅推送 Docker 映像檔並執行 Helm 部署。

以下是修改後的 `Jenkinsfile`，將 AWS 資源的初始化與部署過程拆分為兩個 Pipeline：

#### Jenkinsfile for Build and Deploy

```groovy
pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        AWS_ACCOUNT_ID = '167804136284'
        HELM_RELEASE_NAME="k8s-site"
        IMAGE_TAG = 'latest'
        AWS_REGION = 'us-east-1'
        SERVICE_TYPE = "LoadBalancer"
        // Terraform 部署結果變數 (假設資源已建立並更新)
        SITE_ECR_REPO = "your_site_ecr_repo_url"
        USER_SERVICE_ECR_REPO = "your_user_service_ecr_repo_url"
        PRODUCT_SERVICE_ECR_REPO = "your_product_service_ecr_repo_url"
        ORDER_SERVICE_ECR_REPO = "your_order_service_ecr_repo_url"
        PAYMENT_SERVICE_ECR_REPO = "your_payment_service_ecr_repo_url"
        EKS_CLUSTER_NAME = "your_eks_cluster_name"
        LOG_GROUP_NAME = "your_log_group_name"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: '1_simple', url: 'https://github.com/charleenchiu/k8s-shopping-site.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
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
                    aws ecr-public get-login-password --region ${env.AWS_REGION} | docker login --username AWS --password-stdin public.ecr.aws
                    docker tag ${env.SITE_ECR_REPO}:${env.IMAGE_TAG} public.ecr.aws/${AWS_ACCOUNT_ID}/k8s-shopping-site:${env.IMAGE_TAG}
                    docker push public.ecr.aws/${AWS_ACCOUNT_ID}/k8s-shopping-site:${env.IMAGE_TAG}
                    // 重複此操作上傳其他服務
                    """
                }
            }
        }

        stage('Helm Deploy') {
            steps {
                dir('./k8s-chart') {
                    sh """
                        helm upgrade --install ${env.HELM_RELEASE_NAME} . \
                        --set awsRegion=${env.AWS_REGION} \
                        --set serviceType=${env.SERVICE_TYPE} \
                        --set awsLogsGroup=${env.LOG_GROUP_NAME} \
                        --set services.user-service.image.repository=${env.USER_SERVICE_ECR_REPO} \
                        --set services.user-service.image.tag=${env.IMAGE_TAG} \
                        --set services.product-service.image.repository=${env.PRODUCT_SERVICE_ECR_REPO} \
                        --set services.product-service.image.tag=${env.IMAGE_TAG} \
                        // 其他服務的設置
                    """
                }
            }
        }
    }

    post {
        failure {
            sh '''
                helm uninstall ${env.HELM_RELEASE_NAME}
            '''
        }

        always {
            cleanWs()
        }
    }
}
```

### 說明

- **分離的 Pipeline 工作流程**：
  - 在資源的首次建立後，不需要重新申請 EKS 和 ECR 等 AWS 資源，減少了不必要的計算資源浪費。
  - `Setup-AWS-Resources` 的 Pipeline 可以在 AWS 資源變更時手動執行。

- **使用全域環境變數**：
  - 將 `Setup-AWS-Resources` 的輸出，例如 ECR repository URIs、EKS Cluster 名稱等，儲存在 Jenkins 的全域變數中，讓 `Build and Deploy` Pipeline 可以直接引用。

這樣可以達到只在首次部署或 AWS 資源變更時初始化資源，後續的部署僅執行 `Build Docker Image` 和 `Helm Deploy` 階段，有效提升 Pipeline 執行效率並減少資源消耗。

# //============================================================================
試做Multibranch的小專案： C:\charleen\LearnDevops\testJKMB
來看看你的問題：

1. `'your-shared-library'`應該替換成你的 Jenkins 上共用庫的名稱。這個名稱可以在 Jenkins 的「Manage Jenkins」>「Configure System」>「Global Pipeline Libraries」中找到。如果你尚未設定共用庫，可以在此處新增，並給它一個名稱供 pipeline 使用。

2. 是的，共用庫與`def terraformOutput = sh(script: 'terraform output -json', returnStdout: true)`可以並用。共用庫提供變數和函數，而這行程式碼則用來直接從 Terraform 的輸出讀取 JSON 資料。兩者不會衝突。

3. 代碼上有些需要注意的地方和優化，以下是修改建議：

   - **Setup-AWS-Resources Jenkinsfile** 中：
     - `parseJson` 是個假設的函數。如果未自定義，可用 Jenkins 預設的 `readJSON` 函數。
     - 建議 Terraform 輸出結果存成 JSON 文件，方便後續 pipeline 閱讀。

   - **Stable-Build-and-Deploy Jenkinsfile** 和 **Canary-Build-and-Deploy Jenkinsfile** 中：
     - `copyArtifacts` 步驟假設 Setup-AWS-Resources 成功生成 `terraform_output.json` 並存於 artifact，確保此 JSON 文件存在。
     - 輸出錯誤回饋並優化變數調用。

以下為修改後程式碼：

---

### `Setup-AWS-Resources Jenkinsfile`
```groovy
@Library('your-shared-library') _

pipeline {
    agent any

    stages {
        stage('Setup AWS Resources') {
            steps {
                script {
                    // 執行 Terraform 並將結果儲存為 JSON 檔案
                    sh 'terraform apply -auto-approve'
                    sh 'terraform output -json > terraform_output.json'
                    archiveArtifacts artifacts: 'terraform_output.json', onlyIfSuccessful: true
                }
            }
        }
        
        stage('Example Stage') {
            steps {
                script {
                    def vars = globalVars()
                    echo "AWS_REGION: ${vars.AWS_REGION}"
                    env.teststr_aws = 'Hi From Setup-AWS-Resources.'
                }
            }
        }
    }
}
```

### `Stable-Build-and-Deploy Jenkinsfile`
```groovy
@Library('your-shared-library') _

pipeline {
    agent any

    stages {
        stage('Retrieve Terraform Outputs') {
            steps {
                copyArtifacts projectName: 'Setup-AWS-Resources', filter: 'terraform_output.json'
                script {
                    def terraformOutput = readJSON file: 'terraform_output.json'
                    env.CLUSTER_URL = terraformOutput.cluster_url.value
                    env.CERT_AUTH_DATA = terraformOutput.certificate_authority_data.value
                }
            }
        }
 
        stage('Example Stage') {
            steps {
                script {
                    def vars = globalVars()
                    echo "HELM_RELEASE_NAME: ${vars.HELM_RELEASE_NAME}"
                    env.teststr_stable = 'Hi From Stable-Build-and-Deploy.'
                }
            }
        }
    }
}
```

### `Canary-Build-and-Deploy Jenkinsfile`
```groovy
@Library('your-shared-library') _

pipeline {
    agent any

    stages {
        stage('Retrieve Terraform Outputs') {
            steps {
                copyArtifacts projectName: 'Setup-AWS-Resources', filter: 'terraform_output.json'
                script {
                    def terraformOutput = readJSON file: 'terraform_output.json'
                    env.CLUSTER_URL = terraformOutput.cluster_url.value
                    env.CERT_AUTH_DATA = terraformOutput.certificate_authority_data.value
                }
            }
        }
 
        stage('Example Stage') {
            steps {
                script {
                    def vars = globalVars()
                    echo "SERVICE_TYPE: ${vars.SERVICE_TYPE}"
                    env.teststr_canary = 'Hi From Canary-Build-and-Deploy.'
                }
            }
        }
    }
}
```

這些更新確保了所有變數與資料能夠正確流通，並讓你的 Jenkins Multibranch Pipeline 更具穩定性！