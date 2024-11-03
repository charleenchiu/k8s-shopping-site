# ShoppingSite

`ShoppingSite` 是一個用 **Node.js + MySQL** 開發的模擬電商網站全端應用，包含用戶、商品、訂單和支付等微服務。此專案支援基本的 CRUD（建立、讀取、更新、刪除）操作，並已使用 Docker 和 Kubernetes 進行容器化與部署設置。專案實現了 canary deployment 功能，當發生錯誤時，系統會自動回滾至 `1_simple` 所部署的 stable 標籤 Docker image 版本。這個專案的主要目的是展示 DevOps 流程和微服務架構的實踐應用。

本專案的網頁及程式功能已開發完畢，目前正在調整容器化及CI/CD功能。

## 目錄

- [功能特色](#功能特色)
- [安裝步驟](#安裝步驟)
- [使用方式](#使用方式)
- [測試方式](#測試方式)
- [技術架構](#技術架構)
- [目錄結構](#目錄結構)

## 功能特色

- **使用者服務**：處理使用者帳戶管理與登入註冊
- **商品服務**：管理商品資訊
- **訂單服務**：處理訂單建立、查詢與管理
- **付款服務**：模擬付款流程
- **前端網站**：使用 React 構建的使用者介面，支援各服務的 CRUD 操作

## 安裝步驟

請先確保安裝了以下工具：

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
- [Kubernetes CLI (kubectl)](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [Helm](https://helm.sh/)

### 1. Clone 專案

```bash
git clone -b '2_nodejs_mysql' https://github.com/charleenchiu/k8s-shopping-site.git
```

### 2. 安裝相依套件

進入 `web-client` 和各服務資料夾 (`user-service`, `product-service`, `order-service`, `payment-service`)，分別執行以下指令：

```bash
yarn install
```

### 3. 建立環境變數檔案

在專案根目錄中建立 `.env` 文件，並設定環境變數（如資料庫連線資訊、伺服器端口等）。

### 4. 啟動 Docker 容器

使用 `docker-compose.yml` 啟動所有服務：

```bash
docker-compose up -d
```

### 5. 部署到 Kubernetes（選用）

若要使用 Kubernetes 和 Helm 部署服務，可以到 `k8s` 資料夾內找到各微服務的 `deployment.yaml` 和 `service.yaml` 設定檔案。根據需求配置後，執行以下指令進行部署：

```bash
kubectl apply -f ./k8s/
```

## 使用方式

### 前端操作

在瀏覽器中打開 `http://localhost:3000`，可以進行登入、瀏覽商品、建立訂單等操作。

### API 操作

各微服務的 API 端點範例：

- 使用者服務：`http://localhost:3001/users`
- 商品服務：`http://localhost:3002/products`
- 訂單服務：`http://localhost:3003/orders`
- 付款服務：`http://localhost:3004/payments`

可以使用 [Postman](https://www.postman.com/) 等工具進行 API 測試。

## 測試方式

### 執行測試

在每個服務資料夾 (`user-service`, `product-service`, `order-service`, `payment-service`) 中執行以下指令，運行相應的測試檔案：

```bash
yarn test
```

### 測試範圍

測試範圍涵蓋各個 API 的基本功能測試，包括資料的建立、讀取、更新與刪除，以確保 CRUD 功能的正常運作。

## 技術架構

- **前端框架**：React
- **後端框架**：Node.js + Express
- **資料庫**：MySQL (使用 Sequelize ORM)
- **容器編排**：Docker、Kubernetes
- **CI/CD**：Jenkins Pipeline + Terraform
- **服務監控**：CloudWatch

## 目錄結構

```plaintext
ShoppingSite                 # 專案根目錄
│
├── terraform                     # Terraform 配置，管理 Kubernetes 部署相關基礎設施 (4. Terraform files for EKS deployment 功能說明書.md)
│   ├── main.tf                   # Terraform 主配置檔
│   ├── outputs.tf                # Terraform 輸出變數定義
│   ├── variables.tf              # Terraform 變數定義
│   ├── delete_ecr_images.sh      # 刪除 ECR 本專案公開儲存庫的映像檔 (7. delete_ecr_images.sh 功能說明書.md)
│   └── ManulCleanup.sh           # 清理 Kubernetes 和 Terraform 專案中已部署的資源 (8. ManulCleanup.sh 功能說明書.md)
│
├── k8s-chart                     # Kubernetes Helm chart，用於部署 Kubernetes 資源 (說明：5. Helm Chart 和 Kubernetes 模板檔案 功能說明書.md)
│   ├── charts                    # Helm charts 的子目錄
│   ├── templates                 # Kubernetes 部署和服務模板
│   │   ├── deployment.yaml       # 部署配置模板
│   │   ├── service.yaml          # 服務配置模板
│   ├── .helmignore               # 指定哪些文件在打包 Helm chart 時應被忽略
│   ├── Chart.yaml                # Helm chart 的描述檔
│   └── values.yaml               # Helm values 配置檔，用於覆蓋默認值
│
├── Jenkinsfile              # Jenkins Pipeline 配置
│
├── web-client               # 前端網站客戶端，使用 React 框架
│   ├── node_modules         # 前端相依套件資料夾，由 npm 或 yarn 安裝
│   ├── public               # 靜態資源資料夾
│   │   └── index.html       # 前端應用程式入口 HTML 檔案
│   ├── src                  # 前端程式碼資料夾
│   │   ├── App.js           # 主應用程式元件
│   │   ├── index.js         # 前端應用程式進入點 (啟動於 http://localhost:3000)
│   │   ├── LoginPage.js     # 登入頁面元件
│   │   ├── try.js           # 測試或臨時程式碼（可能是試驗性質的功能）
│   │   ├── components       # 各 CRUD 頁面的 React 元件
│   │   │   ├── CRUDPage.js  # 通用 CRUD 操作頁面元件
│   │   │   ├── UserCRUDPage  # 用戶 CRUD 頁面
│   │   │   │   └── UserCRUDPage.js  # 用戶 CRUD 頁面邏輯
│   │   │   ├── ProductCRUDPage # 產品 CRUD 頁面
│   │   │   │   └── ProductCRUDPage.js # 產品 CRUD 頁面邏輯
│   │   │   ├── OrderCRUDPage   # 訂單 CRUD 頁面
│   │   │   │   └── OrderCRUDPage.js # 訂單 CRUD 頁面邏輯
│   │   │   └── PaymentCRUDPage  # 支付 CRUD 頁面
│   │   │       └── PaymentCRUDPage.js # 支付 CRUD 頁面邏輯
│   ├── test                 # 前端測試檔案資料夾
│   │   ├── App.test.js      # 主應用程式元件的測試檔
│   │   ├── LoginPage.test.js # 登入頁面的測試檔
│   │   ├── UserCRUDPage.test.js # 用戶 CRUD 頁面的測試檔
│   │   ├── ProductCRUDPage.test.js # 產品 CRUD 頁面的測試檔
│   │   ├── OrderCRUDPage.test.js # 訂單 CRUD 頁面的測試檔
│   │   ├── PaymentCRUDPage.test.js # 支付 CRUD 頁面的測試檔
│   ├── k8s                  # Kubernetes 設定檔案
│   │   ├── deployment.yaml  # Kubernetes 部署設定檔案
│   │   └── service.yaml     # Kubernetes 服務設定檔案
│   └── webpack.config.js    # Webpack 設定檔案，用於編譯前端程式碼
├── user-service             # 用戶服務，提供用戶管理 API
│   ├── node_modules         # 相依套件資料夾
│   ├── src                  # 用戶服務的主要程式碼
│   │   └── user-service.js   # 用戶服務的 API (啟動於 http://localhost:3001/users)
│   ├── test                 # 用戶服務測試檔案
│   │   └── user.test.js      # 用戶服務測試檔
│   ├── k8s                  # Kubernetes 設定檔案
│   │   ├── deployment.yaml  # 用戶服務的 Kubernetes 部署設定
│   │   └── service.yaml     # 用戶服務的 Kubernetes 服務設定
│   ├── .dockerignore        # Docker 忽略檔案
│   ├── Dockerfile           # 用戶服務的 Docker 映像檔建構檔
│   ├── package.json         # 用戶服務的相依套件與腳本
│   └── webpack.config.js    # Webpack 設定檔案
├── product-service          # 產品服務，提供產品管理 API
│   ├── node_modules         # 相依套件資料夾
│   ├── src                  # 產品服務的主要程式碼
│   │   └── product-service.js # 產品服務的 API (啟動於 http://localhost:3002/products)
│   ├── test                 # 產品服務測試檔案
│   │   └── product.test.js   # 產品服務測試檔
│   ├── k8s                  # Kubernetes 設定檔案
│   │   ├── deployment.yaml  # 產品服務的 Kubernetes 部署設定
│   │   └── service.yaml     # 產品服務的 Kubernetes 服務設定
│   ├── .dockerignore        # Docker 忽略檔案
│   ├── Dockerfile           # 產品服務的 Docker 映像檔建構檔
│   ├── package.json         # 產品服務的相依套件與腳本
│   └── webpack.config.js    # Webpack 設定檔案
├── order-service            # 訂單服務，提供訂單管理 API
│   ├── node_modules         # 相依套件資料夾
│   ├── src                  # 訂單服務的主要程式碼
│   │   ├── order-service.js # 訂單服務的 API (啟動於 http://localhost:3003/orders)
│   │   └── test-env.js      # 測試環境設定檔
│   ├── test                 # 訂單服務測試檔案
│   │   └── order.test.js     # 訂單服務測試檔
│   ├── k8s                  # Kubernetes 設定檔案
│   │   ├── deployment.yaml  # 訂單服務的 Kubernetes 部署設定
│   │   └── service.yaml     # 訂單服務的 Kubernetes 服務設定
│   ├── .dockerignore        # Docker 忽略檔案
│   ├── Dockerfile           # 訂單服務的 Docker 映像檔建構檔
│   ├── package.json         # 訂單服務的相依套件與腳本
│   └── webpack.config.js    # Webpack 設定檔案
├── payment-service          # 支付服務，提供支付管理 API
│   ├── node_modules         # 相依套件資料夾
│   ├── src                  # 支付服務的主要程式碼
│   │   └── payment-service.js # 支付服務的 API (啟動於 http://localhost:3004/payments)
│   ├── test                 # 支付服務測試檔案
│   │   └── payment.test.js   # 支付服務測試檔
│   ├── k8s                  # Kubernetes 設定檔案
│   │   ├── deployment.yaml  # 支付服務的 Kubernetes 部署設定
│   │   └── service.yaml     # 支付服務的 Kubernetes 服務設定
│   ├── .dockerignore        # Docker 忽略檔案
│   ├── Dockerfile           # 支付服務的 Docker 映像檔建構檔
│   ├── package.json         # 支付服務的相依套件與腳本
│   └── webpack.config.js    # Webpack 設定檔案
├── init-db.js               # 資料庫初始化腳本
├── dbConnectionPool.js      # 資料庫連線池設定檔
├── dbTest.js                # 資料庫測試檔案
├── .env                     # 環境變數設定檔
├── config.js                # 應用程式配置檔
├── index.html               # 預設網頁 HTML
├── src                      # 應用程式主程式碼資料夾
│   └── index.js             # 應用程式進入點
├── node_modules             # 根目錄相依套件資料夾
├── yarn.lock                # Yarn 鎖定檔案
├── package.json             # 根目錄的相依套件與腳本
├── .babelrc                 # Babel 設定檔案
├── webpack.config.js        # 根目錄 Webpack 設定檔案
├── docker-compose.yml       # Docker Compose 設定檔，用於本地啟動多個服務
└── dist                     # 編譯後的靜態檔案資料夾
   └── bundle.js             # 打包後的前端程式碼

```
