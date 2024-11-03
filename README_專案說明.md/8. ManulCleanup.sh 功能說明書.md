# `ManulCleanup.sh` 功能說明書

### 檔案位置
- 路徑：`terraform\ManulCleanup.sh`

### 功能概述
此腳本用於清理 Kubernetes 和 Terraform 專案中已部署的資源。具體執行步驟包含刪除 Helm 部署資源、清理 Docker、刪除 ECR 映像，以及透過 Terraform 銷毀相關基礎設施。腳本要求使用者手動輸入 AWS 憑證，並將這些憑證加入到 Terraform 的設定檔中。

### 功能詳述

1. **AWS 憑證輸入**
   - 提示使用者輸入 `access_key` 和 `secret_key`。
   - 這些憑證會被寫入 `main.tf` 文件中，供 Terraform 使用。

2. **刪除 Helm 資源**
   - 刪除 Helm 部署的資源（如 ELB），包含以下項目：
     - 若存在，則刪除 `bitnami` 和 `fluent` 的 Helm repository。
     - 執行 `helm uninstall` 移除以下釋出：
       - `k8s-site`
       - `aws-for-fluent-bit`
       - `externaldns`

3. **修改 Terraform 配置 (`main.tf`)**
   - 檢查 `main.tf` 是否已包含 `provider "aws"` 的配置。
   - 若無配置，則將 `access_key` 和 `secret_key` 加入 `provider "aws"` 設定中。
   - 若 `main.tf` 已存在配置，則跳過此步驟。

4. **清理 Docker 資源**
   - 執行以下 Docker 清理指令：
     - `docker builder prune -f`：清理 build 快取。
     - `docker container prune -f`：移除未使用的容器。
     - `docker image prune -a -f`：刪除未使用的映像。
     - `docker volume prune -f`：刪除未使用的卷。

5. **刪除 ECR 映像**
   - 賦予 `delete_ecr_images.sh` 執行權限並執行此腳本，以刪除 ECR 儲存庫中的映像。

6. **執行 Terraform 銷毀**
   - 執行 `terraform destroy -auto-approve` 銷毀所有 Terraform 資源。
   - 刪除 Terraform 的臨時檔案，包括 `.terraform` 資料夾和 `terraform.tfstate` 文件。

7. **完成訊息**
   - 所有操作完成後，顯示「所有操作已完成。」作為結束訊息。

### 使用說明
執行此腳本前，確認 AWS CLI、Helm、Docker 及 Terraform 已安裝並可用。在終端中執行 `./ManulCleanup.sh`，依照提示輸入 AWS 憑證，腳本會自動進行清理操作。