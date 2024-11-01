以下是根據您提供的 Jenkinsfile 內容修改後的功能說明書：

## 功能說明書 - k8s-shopping-site 專案

### 簡介
本專案是基於 Kubernetes 的電子商務網站，旨在展示微服務架構下的 CI/CD 過程。透過 Jenkins 自動化工具，使用 Terraform 進行基礎架構的配置，並利用 Docker 和 Helm 部署各微服務。

### 架構
本專案包含多個微服務，每個微服務透過 Docker 映像進行容器化，並使用 Helm 管理 Kubernetes 上的應用部署。專案包括以下主要組件：

- **Jenkins Pipeline**: 負責整體自動化流程，包括代碼檢出、建置、測試和部署。
- **Terraform**: 負責在 AWS 上建立所需的基礎架構，如 EKS 集群、ECR 儲存庫、CloudWatch 日誌組等。
- **Docker**: 負責容器映像的建置與管理。
- **Helm**: 負責將應用部署到 Kubernetes 集群。

本專案檔案結構圖：

```plaintext
k8s-shopping-site_1_simple
├── InitAndCleanup
│   └── CreateServers.tf          # Terraform script，用於建立 Jenkins Server 和 SonarQube Server
│
├── terraform                     # Terraform 配置，管理基礎設施
│   ├── main.tf                   # Terraform 主配置檔案
│   ├── outputs.tf                # Terraform 輸出變數定義
│   ├── variables.tf              # Terraform 變數定義
│
├── k8s-chart                     # Kubernetes Helm chart，用於部署 Kubernetes 資源
│   ├── charts                    # Helm charts 的子目錄
│   ├── templates                 # Kubernetes 部署和服務模板
│   │   ├── deployment.yaml       # 部署配置模板
│   │   ├── service.yaml          # 服務配置模板
│   ├── .helmignore               # 指定哪些文件在打包 Helm chart 時應被忽略
│   ├── Chart.yaml                # Helm chart 的描述檔案
│   └── values.yaml               # Helm values 配置檔案，用於覆蓋默認值
│
├── src                           # 專案的主要程式碼資料夾
│   ├── user-service              # User Service 微服務
│   │   ├── Dockerfile            # Docker映像檔設定檔
│   │   ├── index.js (port: 3001) # 服務的主要程式碼
│   │   ├── package-lock.json     # 確保依賴版本一致
│   │   ├── package.json          # 依賴包設定
│   │   └── yarn.lock             # Yarn 鎖檔案，確保依賴版本一致
│   │
│   ├── product-service           # Product Service 微服務
│   │   ├── Dockerfile            # Docker映像檔設定檔
│   │   ├── index.js (port: 3002) # 服務的主要程式碼
│   │   ├── package-lock.json     # 確保依賴版本一致
│   │   ├── package.json          # 依賴包設定
│   │   └── yarn.lock             # Yarn 鎖檔案，確保依賴版本一致
│   │
│   ├── order-service             # Order Service 微服務
│   │   ├── Dockerfile            # Docker映像檔設定檔
│   │   ├── index.js (port: 3003) # 服務的主要程式碼
│   │   ├── package-lock.json     # 確保依賴版本一致
│   │   ├── package.json          # 依賴包設定
│   │   └── yarn.lock             # Yarn 鎖檔案，確保依賴版本一致
│   │
│   └── payment-service           # Payment Service 微服務
│       ├── Dockerfile            # Docker映像檔設定檔
│       ├── index.js (port: 3004) # 服務的主要程式碼
│       ├── package-lock.json     # 確保依賴版本一致
│       ├── package.json          # 依賴包設定
│       └── yarn.lock             # Yarn 鎖檔案，確保依賴版本一致
│
├── .env                          # 環境變數設定檔
├── index.js (port: 3000)         # 主網站入口，提供服務連結清單
├── Dockerfile                    # 主網站的 Docker 設定檔
├── docker-compose.yml            # 本地端開發的 Docker Compose 配置
├── Jenkinsfile                   # Jenkins Pipeline 配置
├── package-lock.json             # 確保依賴版本一致
├── package.json                  # 依賴包設定
└── yarn.lock                     # Yarn 鎖檔案，確保依賴版本一致
```

### Pipeline 階段說明

1. **Checkout Code**
   - 從 GitHub 獲取指定分支的程式碼。

2. **Terraform Init**
   - 初始化 Terraform，準備應用基礎架構變更。

3. **Get Outputs**
   - 獲取 Terraform 執行的輸出，包括 ECR 儲存庫和 EKS 相關信息。

4. **Verify Outputs**
   - 驗證從 Terraform 獲取的輸出變數，確保其正確性。

5. **Test**
   - 使用 `yarn test` 執行各微服務的單元測試，確保代碼品質。

7. **Build Docker Image**
   - 根據 Dockerfile 建構各微服務的 Docker 映像。

8. **Login to ECR & Push Image**
   - 登入 AWS ECR 並推送 Docker 映像。

9. **Install Helm**
   - 下載並安裝 Helm，以便在 Kubernetes 中管理應用。

10. **Setup Helm**
    - 新增 ExternalDNS Helm repo 並安裝 ExternalDNS，幫助進行 DNS 設定。

11. **Config kubectl Connect to EKS Cluster**
    - 更新 kubeconfig，使得 kubectl 可以連接到 EKS 集群。

12. **Install or Upgrade Fluent Bit**
    - 安裝或升級 Fluent Bit，以將 Kubernetes 日誌寫入 CloudWatch。

13. **Helm Deploy**
    - 使用 Helm 部署應用至 Kubernetes 集群，設定所需的參數。

14. **Deploy Ingress**
    - 部署 Ingress 以管理外部訪問流量。

15. **Get ELB Information**
    - 獲取和顯示 ELB 的 DNS 和端口資訊，以便用戶訪問。

### 錯誤處理
若任一階段失敗，將自動清理 Terraform 創建的資源及 Helm 部署的應用，確保環境的整潔。

### 結論
本專案展示了在 Kubernetes 環境中實現 CI/CD 的最佳實踐，提供了一個可擴展且高效的微服務架構範例，並強調了使用 Terraform、Docker 和 Helm 等技術的重要性。

=======================================================================
Jenkins Pipeline 階段說明
Checkout Code

從 GitHub 獲取指定分支的程式碼。

Terraform Init

初始化 Terraform，準備應用基礎架構變更。

Get Outputs

獲取 Terraform 執行的輸出，包括 ECR 儲存庫和 EKS 相關信息。

Verify Outputs

驗證從 Terraform 獲取的輸出變數，確保其正確性。

Install Dependencies and Run Tests

使用 yarn test 執行各微服務的單元測試，確保代碼品質。

SonarQube analysis

使用 SonarQube 分析代碼品質。

Quality Gate

設置質量門，確保代碼品質達到要求。

Build Docker Image

根據 Dockerfile 建構各微服務的 Docker 映像。

Login to Public ECR & Push Image

登入 AWS ECR 並推送 Docker 映像。

Install Helm

下載並安裝 Helm，以便在 Kubernetes 中管理應用。

Config kubectl Connect to EKS Cluster

更新 kubeconfig，使得 kubectl 可以連接到 EKS 集群。

Install or Upgrade Fluent Bit

安裝或升級 Fluent Bit，以將 Kubernetes 日誌寫入 CloudWatch。

Helm Deploy

使用 Helm 部署應用至 Kubernetes 集群，設定所需的參數。

Get ELB Information

獲取和顯示 ELB 的 DNS 和端口資訊，以便用戶訪問。

錯誤處理
若任一階段失敗，將自動清理 Terraform 創建的資源及 Helm 部署的應用，確保環境的整潔。

結論
本專案展示了在 Kubernetes 環境中實現 CI/CD 的最佳實踐，提供了一個可擴展且高效的微服務架構範例，並強調了使用 Terraform、Docker 和 Helm 等技術的重要性。

