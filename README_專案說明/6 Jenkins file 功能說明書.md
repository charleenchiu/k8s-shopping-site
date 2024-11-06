# 功能說明書：Jenkins Pipeline (`jenkinsfile`)

### 目標

本 `Jenkinsfile` 用於自動化部署 Kubernetes 應用，涵蓋從程式碼檢出、Terraform 初始化、Docker 影像建構，到部署 Helm Charts 和測試的完整流程。最終將應用部署到 AWS EKS，並將日誌寫入 CloudWatch。

### 環境變數設定

- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`: 透過 Jenkins 憑證管理來提供 AWS 認證。
- `AWS_ACCOUNT_ID`: AWS 帳戶 ID。
- `HELM_RELEASE_NAME`: Helm 部署的發行名稱。
- `IMAGE_TAG`: Docker 映像的標籤（預設為 `canary`）。
- `AWS_REGION`: AWS 區域（預設為 `us-east-1`）。
- `KUBECONFIG`: 設定 Kubernetes 配置路徑。

### 階段說明

#### 1. **Checkout Code**:
   - 從 GitHub 取得程式碼，使用分支 `2_nodejs_mysql` 進行檢出。

#### 2. **Terraform Init**:
   - 初始化 Terraform 並應用配置。執行 `terraform init` 和 `terraform apply -auto-approve`，確保基礎設施配置更新。

#### 3. **Get Outputs**:
   - 透過 `terraform output` 命令獲取 Terraform 執行結果的輸出，並將結果拆解為對應的環境變數，例如 ECR repository、EKS Cluster 相關設定等。

#### 4. **Verify Outputs**:
   - 驗證輸出的變數，檢查 ECR 和 EKS 配置。

#### 5. **Install Dependencies and Run Tests**:
   - 安裝依賴並在各微服務目錄下執行測試，設定測試的超時時間為 1 秒，若測試失敗或超時，流程不會中斷。

#### 6. **SonarQube Analysis**:
   - 使用 SonarQube 進行程式碼質量分析，配置 `sonar-project` 相關的參數。

#### 7. **Quality Gate**:
   - 檢查 SonarQube 的品質門檻，若未達標，則中止部署。

#### 8. **Build Docker Image**:
   - 使用 `docker build` 建構 Docker 映像，標籤為指定的 `IMAGE_TAG`，並依照不同服務建立映像。

#### 9. **Login to Public ECR & Push Image**:
   - 登入 AWS ECR，將 Docker 映像推送到公共 ECR 仓库，並使用當前日期作為額外標籤。

#### 10. **Install Helm**:
   - 安裝 Helm，若系統中未安裝 Helm，則透過下載安裝包並解壓。

#### 11. **Config kubectl Connect to EKS Cluster**:
   - 使用 `aws eks update-kubeconfig` 連接到 EKS 集群，設定 `kubectl` 以便與 EKS 進行互動。

#### 12. **Install or Upgrade Fluent Bit**:
   - 安裝或升級 Fluent Bit Helm Chart，將 Kubernetes 日誌導入到 AWS CloudWatch。

#### 13. **Helm Deploy**:
   - 使用 Helm 部署應用，並將各微服務的 Docker 映像部署到 Kubernetes 上。部署完成後會進行健康檢查，若健康檢查通過，將流量切換到 canary 版本。

#### 14. **Rollback**:
   - 如果 `Helm Deploy` 失敗，則回滾到上一個穩定版本。

#### 15. **Get ELB Information**:
   - 獲取並顯示部署的 ELB (Elastic Load Balancer) DNS 和端口信息，用於檢查部署是否成功。

### Post 建立階段

#### 1. **Failure**:
   - 如果流程失敗，將進行清理操作，刪除 Terraform、Helm 和 Docker 中的資源，確保不留殘餘的服務和映像。

#### 2. **Always**:
   - 清理 Jenkins 工作區，確保每次執行後都不留下無用的文件。
   - 檢查 Terraform 狀態鎖定並進行解除。
   - 清理 Docker 資源，如未使用的容器和影像。

### 主要工具與技術

- **Terraform**: 用於基礎設施管理與自動化配置，建立和管理 EKS 集群、ECR 儲存庫等。
- **Docker**: 用來建構微服務的容器映像。
- **Helm**: Kubernetes 部署工具，透過 Helm Charts 部署微服務到 Kubernetes。
- **SonarQube**: 程式碼質量管理工具，用來檢查程式碼中的潛在問題。
- **Fluent Bit**: 用來將 Kubernetes 日誌輸送到 CloudWatch。
- **Kubernetes**: 用來運行應用和服務的容器編排平台，與 EKS 集群密切集成。

這個 `Jenkinsfile` 適合用於實現微服務架構的 CI/CD 管道，通過自動化的方式確保應用能夠高效且穩定地部署到雲端平台。