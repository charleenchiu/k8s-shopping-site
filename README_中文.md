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
    │   ├── CreateJenkinsServer.tf    # Terraform script，用於建立 Jenkins Server
    ├── k8s-chart
    │   ├── charts                    # Helm charts 資料夾
    │   ├── templates                 # Kubernetes 部署和服務模板
    │   │   ├── deployment.yaml
    │   │   ├── service.yaml
    │   │   ├── ingress.yaml
    │   ├── .helmignore
    │   ├── Chart.yaml
    │   ├── values.yaml               # Helm values 配置
    ├── user-service (port: 3001)     # User Service 微服務
    │   ├── Dockerfile
    │   ├── index.js
    │   ├── package.json
    ├── product-service (port: 3002)  # Product Service 微服務
    │   ├── Dockerfile
    │   ├── index.js
    │   ├── package.json
    ├── order-service (port: 3003)    # Order Service 微服務
    │   ├── Dockerfile
    │   ├── index.js
    │   ├── package.json
    ├── payment-service (port: 3004)  # Payment Service 微服務
    │   ├── Dockerfile
    │   ├── index.js
    │   ├── package.json
    ├── terraform                     # Terraform 配置，管理基礎設施
    │   ├── main.tf
    │   ├── outputs.tf
    │   ├── variables.tf
    ├── docker-compose.yml            # 本地端開發的 Docker Compose 配置
    ├── .env                          # 環境變數設定檔
    ├── Jenkinsfile                   # Jenkins Pipeline 配置
    └── index.js (port: 3000)         # 主網站入口，提供服務連結清單
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
   - 使用 Maven 執行單元測試，確保代碼品質。

6. **Code Analysis with CheckStyle**
   - 進行代碼風格檢查，生成分析結果。

7. **Build && SonarQube analysis**
   - 建置 Docker 映像，並使用 SonarQube 進行代碼質量檢查。

8. **Quality Gate**
   - 等待 SonarQube 的質量門檻檢查結果，若未通過則終止 Pipeline。

9. **Build Docker Image**
   - 根據 Dockerfile 建構各微服務的 Docker 映像。

10. **Login to Public ECR & Push Image**
    - 登入 AWS 公共 ECR 並推送 Docker 映像。

11. **Install Helm**
    - 下載並安裝 Helm，以便在 Kubernetes 中管理應用。

12. **Setup Helm**
    - 新增 ExternalDNS Helm repo 並安裝 ExternalDNS，幫助進行 DNS 設定。

13. **Config kubectl Connect to EKS Cluster**
    - 更新 kubeconfig，使得 kubectl 可以連接到 EKS 集群。

14. **Install or Upgrade Fluent Bit**
    - 安裝或升級 Fluent Bit，以將 Kubernetes 日誌寫入 CloudWatch。

15. **Helm Deploy**
    - 使用 Helm 部署應用至 Kubernetes 集群，設定所需的參數。

16. **Deploy Ingress**
    - 部署 Ingress 以管理外部訪問流量。

17. **Get ELB Information**
    - 獲取和顯示 ELB 的 DNS 和端口資訊，以便用戶訪問。

### 錯誤處理
若任一階段失敗，將自動清理 Terraform 創建的資源及 Helm 部署的應用，確保環境的整潔。

### 結論
本專案展示了在 Kubernetes 環境中實現 CI/CD 的最佳實踐，提供了一個可擴展且高效的微服務架構範例，並強調了使用 Terraform、Docker 和 Helm 等技術的重要性。