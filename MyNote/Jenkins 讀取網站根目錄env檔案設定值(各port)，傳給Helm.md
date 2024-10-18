是的，你可以將 `.env` 文件中的設定值帶入到 `k8s-chart/values.yaml` 中，這樣能夠讓你的 Helm Chart 更具可配置性，並且使你在不同環境下的部署更方便。以下是一些建議來實現這個功能：

### 步驟

1. **使用環境變數**：
   - 在 `values.yaml` 中，你可以使用 `${VARIABLE_NAME}` 的方式來引用環境變數，前提是你在 Jenkins 或執行 Helm 命令時設置了這些變數。

   ```yaml
   services:
     user-service:
       image: ""
       port: ${USER_SERVICE_PORT} # 引用 .env 中的 USER_SERVICE_PORT
       awsLogsGroup: ""
     product-service:
       image: ""
       port: ${PRODUCT_SERVICE_PORT} # 引用 .env 中的 PRODUCT_SERVICE_PORT
       awsLogsGroup: ""
     order-service:
       image: ""
       port: ${ORDER_SERVICE_PORT} # 引用 .env 中的 ORDER_SERVICE_PORT
       awsLogsGroup: ""
     payment-service:
       image: ""
       port: ${PAYMENT_SERVICE_PORT} # 引用 .env 中的 PAYMENT_SERVICE_PORT
       awsLogsGroup: ""
     site-service:
       image: ""
       port: ${SITE_PORT} # 引用 .env 中的 SITE_PORT
       awsLogsGroup: ""
   ```

2. **設置環境變數**：
   - 在 Jenkins 中，你可以透過 Pipeline 設定這些環境變數。確保在執行 Helm 部署之前，這些環境變數已經被正確設置。

   ```groovy
   pipeline {
       agent any
       stages {
           stage('Set Environment Variables') {
               steps {
                   script {
                       env.USER_SERVICE_PORT = sh(script: 'echo $USER_SERVICE_PORT', returnStdout: true).trim()
                       env.PRODUCT_SERVICE_PORT = sh(script: 'echo $PRODUCT_SERVICE_PORT', returnStdout: true).trim()
                       env.ORDER_SERVICE_PORT = sh(script: 'echo $ORDER_SERVICE_PORT', returnStdout: true).trim()
                       env.PAYMENT_SERVICE_PORT = sh(script: 'echo $PAYMENT_SERVICE_PORT', returnStdout: true).trim()
                       env.SITE_PORT = sh(script: 'echo $SITE_PORT', returnStdout: true).trim()
                   }
               }
           }
           stage('Deploy with Helm') {
               steps {
                   sh "helm upgrade --install k8s-site ./k8s-chart --set awsLogsGroup=${LOG_GROUP_NAME} --set services.user-service.port=${USER_SERVICE_PORT} --set services.product-service.port=${PRODUCT_SERVICE_PORT} --set services.order-service.port=${ORDER_SERVICE_PORT} --set services.payment-service.port=${PAYMENT_SERVICE_PORT} --set services.site-service.port=${SITE_PORT}"
               }
           }
       }
   }
   ```

### 注意事項

- 確保在 Jenkins 環境中能夠正確讀取 `.env` 檔案的內容。你可以考慮在 Jenkins 的 Pipeline 開始時，使用 `dotenv` 插件或其他方法來載入 `.env` 檔案。
- 在 Helm Chart 中的環境變數必須在執行時解析，因此需要確保 Jenkins 或你的 CI/CD 環境在執行 Helm 命令時已經設定好這些變數。

這樣的設定能讓你的部署更靈活，並且在不同的環境中更容易進行調整。

在 Jenkins 中載入 `.env` 檔案有幾種方法，這裡主要介紹使用 `dotenv` 插件和直接在 Pipeline 中讀取檔案的兩種方法。

### 方法 1: 使用 dotenv 插件

1. **安裝 dotenv 插件**：
   - 在 Jenkins 的管理介面中，前往「Manage Jenkins」 > 「Manage Plugins」。
   - 在「Available」選項卡中搜索 `dotenv`，然後安裝它。

2. **在 Pipeline 中使用 dotenv**：
   - 你可以在 Pipeline 腳本中使用 `dotenv` 來載入 `.env` 檔案的變數。

   ```groovy
   pipeline {
       agent any
       stages {
           stage('Load .env') {
               steps {
                   // 假設你的 .env 檔案放在根目錄下
                   dotenv 'C:/charleen/LearnDevops/k8s-shopping-site_1_simple/.env'
               }
           }
           stage('Deploy with Helm') {
               steps {
                   sh "helm upgrade --install k8s-site ./k8s-chart --set awsLogsGroup=${LOG_GROUP_NAME} --set services.user-service.port=${USER_SERVICE_PORT} --set services.product-service.port=${PRODUCT_SERVICE_PORT} --set services.order-service.port=${ORDER_SERVICE_PORT} --set services.payment-service.port=${PAYMENT_SERVICE_PORT} --set services.site-service.port=${SITE_PORT}"
               }
           }
       }
   }
   ```

### 方法 2: 直接在 Pipeline 中讀取檔案

如果不想使用插件，你可以直接在 Pipeline 腳本中讀取 `.env` 檔案的內容並將變數設置到環境中。

```groovy
pipeline {
    agent any
    stages {
        stage('Load .env') {
            steps {
                script {
                    // 讀取 .env 檔案並解析每一行
                    def props = readFile('C:/charleen/LearnDevops/k8s-shopping-site_1_simple/.env').split("\n")
                    props.each { line ->
                        if (line && !line.startsWith("#")) { // 忽略空行和註解行
                            def keyValue = line.split("=")
                            if (keyValue.length == 2) {
                                env[keyValue[0].trim()] = keyValue[1].trim() // 設定環境變數
                            }
                        }
                    }
                }
            }
        }
        stage('Deploy with Helm') {
            steps {
                sh "helm upgrade --install k8s-site ./k8s-chart --set awsLogsGroup=${LOG_GROUP_NAME} --set services.user-service.port=${USER_SERVICE_PORT} --set services.product-service.port=${PRODUCT_SERVICE_PORT} --set services.order-service.port=${ORDER_SERVICE_PORT} --set services.payment-service.port=${PAYMENT_SERVICE_PORT} --set services.site-service.port=${SITE_PORT}"
            }
        }
    }
}
```

### 注意事項

- 確保 `.env` 檔案的路徑正確，並且 Jenkins 執行使用者有權限讀取該檔案。
- 在 `.env` 檔案中，變數必須以 `KEY=VALUE` 格式定義，且如果有特殊字符（如空格），需要用引號包裹。

選擇最適合你的需求和環境的方法來載入 `.env` 檔案！

