以下是 `Jenkinsfile` 的功能說明報告，分為各主要階段及其具體步驟的詳細說明，以便完整展示 Jenkins Pipeline 的設計及其功能。

---

## 功能說明報告 - `Jenkinsfile`

### 檔案概述
此 `Jenkinsfile` 定義了 Jenkins Pipeline 的整個流程，用於部署 DevOps 工作流程。該 Pipeline 包括編譯、測試、部署到 Kubernetes 叢集，並使用 Ansible 和 Terraform 來設定基礎設施。主要功能包括 Docker 映像建立與推送、基礎設施配置、應用程式部署，以及服務的自動化和監控。

### Pipeline 分段說明

---

### 1. **初始化階段（Initialize）**
**功能**：初始化 Pipeline 環境，定義變數並設置項目運行的基礎配置。

- **環境變數設置**：定義了 AWS 區域、ECR 存儲庫 URL、服務名稱、容器名稱等重要的參數。
- **憑證設置**：加載 Jenkins 中配置的 AWS 憑證，以便後續步驟能夠訪問 AWS 資源。

---

### 2. **構建階段（Build）**
**功能**：在此階段，Pipeline 使用 Dockerfile 為各微服務建立 Docker 映像並推送到 AWS ECR。

- **步驟**
  - **Docker 登入**：透過 `aws ecr get-login-password` 命令登入 ECR，為推送映像準備。
  - **映像建立**：使用 `docker build` 命令為各微服務建立 Docker 映像。
  - **映像標記與推送**：將映像標記為特定版本（通常是 `latest` 或特定標籤），並推送到 ECR 存儲庫中，以便 Kubernetes 能夠從 ECR 中提取映像。

---

### 3. **基礎設施配置階段（Infrastructure Setup）**
**功能**：此階段使用 Terraform 來設定和配置 AWS 資源，包括 EKS 叢集和其他所需的基礎設施。

- **Terraform 初始化**：執行 `terraform init`，以確保 Terraform 能夠正確載入所需的模組及套件。
- **計劃與應用**：使用 `terraform plan` 生成更改計劃，並透過 `terraform apply` 將計劃應用到 AWS 中，以部署或更新 EKS 叢集和其他基礎設施。
- **輸出保存**：將 Terraform 執行結果保存為 Pipeline 的輸出，以便在後續階段使用，例如 EKS 叢集 ARN 和 ECR URL 等。

---

### 4. **配置管理階段（Configuration Management）**
**功能**：此階段利用 Ansible 進行配置管理，配置應用程式環境和執行必要的設置腳本。

- **Ansible Playbook 執行**：使用 Ansible Playbook 將設定應用到目標主機上，例如 EFS 掛載、Apache 安裝、Git 代碼克隆等。
- **變數設定**：在執行 Playbook 前，從 Terraform 的輸出結果中加載必要變數，以確保環境設置符合應用需求。

---

### 5. **部署階段（Deploy to Kubernetes）**
**功能**：將 Docker 映像部署到 Kubernetes EKS 叢集中。

- **Helm 部署**：透過 Helm 部署 Kubernetes 資源，並從 `values.yaml` 檔案中讀取設定。此步驟包含部署或更新 Deployment、Service 等 Kubernetes 資源。
- **滾動更新策略**：Helm 自動化了滾動更新的流程，以最少的中斷時間更新服務。
- **檢查部署狀態**：確保所有 Kubernetes Pods 都成功啟動並處於就緒狀態。

---

### 6. **監控與驗證階段（Monitoring and Verification）**
**功能**：在應用部署完成後執行監控與驗證，確保服務狀況正常。

- **應用健康檢查**：透過 `kubectl` 指令檢查 Pod 和 Service 狀態。
- **日誌收集與分析**：從 Kubernetes 或 EFS 收集日誌以確保應用程式運行正常。

---

### 7. **清理階段（Cleanup）**
**功能**：在 Pipeline 完成後執行清理動作以釋放資源。

- **Docker 映像清理**：刪除 Jenkins 主機中的臨時 Docker 映像，以節省儲存空間。
- **暫存檔案清理**：移除臨時檔案和中間輸出，以確保乾淨的運行環境。
- **Terraform 銷毀**：選擇性地執行 `terraform destroy`，以刪除不再需要的 AWS 資源。

---

### 主要變數

- `AWS_REGION`：指定 AWS 區域，預設為 `ap-south-1`。
- `ECR_REPO`：定義 ECR 存儲庫的路徑，便於 Docker 映像標記和推送。
- `SERVICE_NAME`：服務名稱，用於標記映像版本和 Kubernetes 部署。
- `IMAGE_TAG`：映像標籤，指定映像版本，如 `latest` 或特定標籤。

---

### 結論

此 `Jenkinsfile` 提供了一個完整的 CI/CD 自動化管道，通過多階段處理將應用程式從構建、測試、基礎設施配置、環境設定，到最終部署在 Kubernetes 上。整體流程確保了應用程式的持續交付和自動化管理。