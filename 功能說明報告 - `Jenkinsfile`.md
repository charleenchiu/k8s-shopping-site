## 功能說明報告 - `Jenkinsfile`

### 檔案概述
此 `Jenkinsfile` 定義了一個 Jenkins Pipeline，運用 Terraform 來自動化 AWS 基礎設施的設定。此流程的特色是提供使用者選擇是否自動執行 `apply` 步驟，並支援 Ansible 部署和驗證工作流程。該 Pipeline 主要涵蓋 Git 代碼庫克隆、Terraform 計劃生成與應用、選擇性部署等步驟，從而實現 CI/CD 流程的自動化。

### Pipeline 各階段說明

---

### 1. **參數設置階段（Parameters）**
**功能**：提供 `autoApprove` 參數讓使用者選擇是否自動執行 Terraform `apply`，以便在生成 `plan` 後可以選擇手動審核或自動進行應用。

---

### 2. **環境設置階段（Environment）**
**功能**：從 Jenkins 憑證管理中提取 AWS 憑證，並存儲於環境變數 `AWS_ACCESS_KEY_ID` 和 `AWS_SECRET_ACCESS_KEY`，以便在 Pipeline 中安全地訪問 AWS 資源。

---

### 3. **Git Clone 階段**
**功能**：此階段將程式碼從 GitHub 儲存庫中的 `cicd-kube` 分支克隆到 Jenkins 工作區中的 `terraform` 目錄，以便 Pipeline 中的後續步驟可以使用最新的程式碼。

- **步驟**
  - **失敗處理**：若克隆失敗則會顯示錯誤訊息 `[ *] git clone failure`。
  - **成功處理**：若克隆成功則會顯示成功訊息 `[ *] git clone successful`。

---

### 4. **Terraform Plan 階段**
**功能**：此階段初始化 Terraform，生成並儲存基礎設施變更計劃，供後續的審核或自動執行。

- **步驟**
  - **檢查身份與目錄**：執行 `whoami` 和 `pwd` 來檢查執行環境。
  - **Terraform 初始化**：進行 `terraform init`，下載所需的模組和插件。
  - **生成計劃**：透過 `terraform plan -out tfplan` 生成計劃並將其保存至 `tfplan` 檔案。
  - **計劃輸出**：生成無顏色的文字格式計劃，存於 `tfplan.txt` 中以便人工審核。

---

### 5. **Terraform Approval 階段**
**功能**：在此階段中，若 `autoApprove` 設定為 `false`，則要求人工審核計劃，防止非預期的變更。

- **步驟**
  - **顯示計劃內容**：從 `tfplan.txt` 讀取計劃內容，並將其顯示給使用者審核。
  - **人工確認**：顯示訊息供使用者選擇是否執行 `apply`。此步驟提供可審核的視窗，以確保計劃符合期望。

---

### 6. **Terraform Apply 階段**
**功能**：若計劃獲得批准，則執行 `terraform apply` 來實施基礎設施變更，並將基礎設施配置至 AWS 環境中。

- **步驟**
  - **應用計劃**：使用 `terraform apply -input=false tfplan` 指令執行應用，以便快速進行基礎設施設定。

---

### 7. **選擇性步驟（Optional Stages）**
這些步驟是可選的，但若開啟，將執行進一步的基礎設施配置及 Ansible 部署。

1. **私鑰權限設置**：為私鑰檔案設置權限為 600，以增強檔案的安全性。
  
2. **Ansible 部署**：執行 Ansible Playbook 進行應用程式或基礎設施設定，且禁用 SSH 主機密鑰檢查。

3. **Ansible 版本檢查**：列出各 Ansible 工具的版本，便於確認是否符合版本需求。

4. **私鑰檔案取回與權限設置**：使用 Terraform 生成的私鑰並設置適當權限，確保 Jenkins 能安全存取遠端主機。

5. **將 EC2 IP 寫入 Ansible Inventory 並執行 Playbook**：將新建的 EC2 公有 IP 地址加入 Ansible 的 Inventory 檔案，並執行指定的 Playbook。

---

### 主要變數

- `AWS_ACCESS_KEY_ID` 和 `AWS_SECRET_ACCESS_KEY`：Jenkins 憑證管理中的 AWS 憑證，確保 Pipeline 過程中 AWS 資源訪問的安全性。
- `autoApprove`：布林變數，讓使用者選擇是否在生成計劃後自動執行 `apply`，以增加靈活性。

---

### 結論

此 `Jenkinsfile` 提供了一個具有靈活性與安全性的 CI/CD Pipeline，結合了 Git 環境配置、Terraform 基礎設施管理以及 Ansible 部署功能。這樣的 Pipeline 設計適合於分層化的基礎設施設定需求，並支持人工審核的工作流程。