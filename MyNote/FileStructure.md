# **專案架構**：
- 根目錄：ShoppingSite
- 4個API：使用者服務（User Service） 商品服務（Product Service） 訂單服務（Order Service） 付款服務（Payment Service）

建議將每個服務的 package.json 和 package-lock.json 文件放在各自的服務資料夾中。

將 Dockerfile 放在 `src` 資料夾內並不是最佳做法，主要有以下幾個原因：

1. **構建上下文**：Dockerfile 通常需要訪問專案根目錄中的檔案和資料夾。如果將 Dockerfile 放在 `src` 資料夾內，Docker 構建上下文會變得複雜，可能需要額外的配置來正確訪問根目錄中的檔案。

2. **清晰性**：將 Dockerfile 放在服務的根目錄下，可以更清晰地表明這是用於構建該服務的 Docker 映像的配置檔案。這樣可以使專案結構更加直觀和易於理解。

3. **分離關注點**：`src` 資料夾通常用於存放應用程式的源碼，而 Dockerfile 是用於構建和部署的配置檔案。將它們分開可以更好地分離關注點，便於維護和管理。

以下是建議的目錄結構：

```
ShoppingSite/
├── backup/
│   └── mysql_volume.tar.gz
├── user-service/
│   ├── Dockerfile
│   ├── src/
│   │   ├──  user-service.js
│   ├── test/
│   │   └── user.test.js
│   ├── k8s/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   ├── package.json
│   ├── Jenkinsfile
├── product-service/
│   ├── Dockerfile
│   ├── src/
│   │   ├──  product-service.js
│   ├── test/
│   │   └── product.test.js
│   ├── k8s/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   ├── package.json
│   ├── Jenkinsfile
├── order-service/
│   ├── Dockerfile
│   ├── src/
│   │   ├──  order-service.js
│   ├── test/
│   │   └── order.test.js
│   ├── k8s/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   ├── package.json
│   ├── Jenkinsfile
├── payment-service/
│   ├── Dockerfile
│   ├── src/
│   │   ├──  payment-service.js
│   ├── test/
│   │   └── payment.test.js
│   ├── k8s/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   ├── package.json
│   ├── Jenkinsfile
web-client/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── UserCRUDPage/
│   │   │   └── UserCRUDPage.js
│   │   ├── ProductCRUDPage/
│   │   │   └── ProductCRUDPage.js
│   │   ├── OrderCRUDPage/
│   │   │   └── OrderCRUDPage.js
│   │   ├── PaymentCRUDPage/
│   │   │   └── PaymentCRUDPage.js
│   ├── index.js
│   ├── LoginPage.js
│   ├── package.json
│   ├── Jenkinsfile
├── jenkins/
│   └── Jenkinsfile

# 建議將資料庫的docker volume 壓縮檔 mysql_volume.tar.gz放在一個通用的目錄，例如/backup，這樣可以在不同的服務之間共享該壓縮檔。至於設置資料庫的Jenkinsfile，可以放在根目錄下或是專門的ci或jenkins目錄中，保持專案目錄的整潔。
```

我的專案目錄結構：
```
ShoppingSite
├── .env
├── config.js
├── dbConnectionPool.js
├── dbTest.js
├── init-db.js
├── webpack.config.js
├── package.json
├── order-service
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── k8s
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   ├── node_modules
│   ├── src
│   │   └── order-service.js (http://localhost:3003/orders)
│   ├── test
│   │   └── order.test.js
├── payment-service
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── k8s
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   ├── node_modules
│   ├── src
│   │   └── payment-service.js (http://localhost:3004/payments)
│   ├── test
│   │   └── payment.test.js
├── product-service
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── k8s
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   ├── node_modules
│   ├── src
│   │   └── product-service.js (http://localhost:3002/products)
│   ├── test
│   │   └── product.test.js
├── Readme
│   ├── BuildPushDockerImgToECR.md
│   ├── DeployToEC2.md
│   ├── DeployToECS_Fargate.md
│   ├── DeployToEKS_EC2.md
│   ├── DeployToMinikube.md
│   ├── Docker-MultiStageBuildImage.md
│   ├── FileStructure.md
│   ├── Jenkins file with APP and DB docker volume.md
│   ├── MySQL.md
│   ├── MySQL_DB_Migrate.md
│   ├── Protocal between containers.md
│   ├── UI Pages.md
│   ├── Why.md
├── user-service
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── k8s
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   ├── node_modules
│   ├── src
│   │   └── user-service.js (http://localhost:3001/users)
│   ├── test
│   │   └── user.test.js
├── web-client
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── k8s
│   ├── node_modules
│   ├── public
│   │   └── index.html (http://localhost:3000)
│   ├── src
│   │   ├── components
│   │   │   ├── OrderCRUDPage
│   │   │   │   └── OrderCRUDPage.js
│   │   │   ├── PaymentCRUDPage
│   │   │   │   └── PaymentCRUDPage.js
│   │   │   ├── ProductCRUDPage
│   │   │   │   └── ProductCRUDPage.js
│   │   │   ├── UserCRUDPage
│   │   │   │   └── UserCRUDPage.js
│   │   ├── index.js
│   │   ├── LoginPage.js
│   ├── test

```

這樣的目錄結構可以幫助你更好地組織和管理你的微服務專案。

# 比如說，當我製作user-service的docker image時，我需要所有src/資料夾內的子資料夾和檔案，但不需要user-service/資料夾下除了src/之外的其它資料夾和檔案。這樣，我是否仍應該將dockerfile置於與src/同階，而不是src/之內？
- 在這種情況下，將 Dockerfile 放在 `src` 資料夾之外的根目錄下仍然是更好的選擇。這樣做的原因是：

1. **構建上下文**：當你執行 `docker build` 命令時，Docker 會將 Dockerfile 所在目錄作為構建上下文。如果 Dockerfile 位於 `src` 資料夾內，你可能需要額外的配置來排除不需要的檔案和資料夾。將 Dockerfile 放在根目錄下，可以更方便地指定構建上下文並排除不需要的檔案。

2. **清晰性**：將 Dockerfile 放在服務的根目錄下，可以更清晰地表明這是用於構建該服務的 Docker 映像的配置檔案。這樣可以使專案結構更加直觀和易於理解。

3. **分離關注點**：`src` 資料夾通常用於存放應用程式的源碼，而 Dockerfile 是用於構建和部署的配置檔案。將它們分開可以更好地分離關注點，便於維護和管理。

你可以在 Dockerfile 中使用 `.dockerignore` 檔案來排除不需要的檔案和資料夾。以下是範例：

### 目錄結構
```
ShoppingSite/
├── user-service/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── src/
│   │   └── user-service.js
│   ├── test/
│   │   └── user.test.js
│   ├── k8s/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   ├── package.json
│   ├── Jenkinsfile
```

### Dockerfile
```Dockerfile
# 使用適當的基礎映像
FROM node:14

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 安裝依賴項
RUN yarn install

# 複製 src 資料夾
COPY src ./src

# 暴露應用程式埠
EXPOSE 3000

# 啟動應用程式
CMD ["node", "src/index.js"]
```

### .dockerignore
```
node_modules
test
k8s
Dockerfile
.dockerignore
Jenkinsfile
```

這樣，當你構建 Docker 映像時，Docker 只會包含 `src` 資料夾和必要的檔案，而排除不需要的檔案和資料夾。


# 每個服務的 Jenkinsfile 範例
- 例如，product-service/Jenkinsfile：
pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'yarn install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'yarn test'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t your-docker-repo/product-service .'
            }
        }
        stage('Push Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-credentials', variable: 'DOCKERHUB_PASSWORD')]) {
                    sh 'echo $DOCKERHUB_PASSWORD | docker login -u your-dockerhub-username --password-stdin'
                    sh 'docker push your-docker-repo/product-service'
                }
            }
        }
    }
}
