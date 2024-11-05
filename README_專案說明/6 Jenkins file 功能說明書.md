# 功能說明書：Jenkins Pipeline (`jenkinsfile`)
這個 Jenkins Pipeline 為多階段自動化流程，包含程式碼檢出、基礎架構建置、測試、品質檢查、映像檔構建與推送、Helm 部署等。此 Pipeline 適合於 DevOps 團隊管理 Kubernetes 應用服務，並將服務自動部署至 AWS EKS。

### Pipeline 概觀

1. **Pipeline 定義與環境變數**
   - 設定 AWS 及 Jenkins 環境變數，包含 AWS 帳戶 ID、區域、Kubernetes 配置路徑及其他服務相關配置。
   - 預設 Docker 映像標籤為 `canary`。
   - 使用 Jenkins 中的憑證儲存 AWS 憑證，確保安全性。

2. **主要階段說明**

   #### 1. 檢出程式碼
   - 從 GitHub 儲存庫拉取程式碼（分支名稱：`1_simple`），將其作為此流程的基礎程式碼版本。

   #### 2. Terraform 初始化與建置
   - 執行 Terraform 配置以自動建置 AWS 資源（如 ECR、CloudWatch Log Group 等）。
   - 使用 `terraform init` 和 `terraform apply` 指令完成資源部署。

   #### 3. 取得並解析 Terraform 輸出
   - 抓取 Terraform 輸出的所有變數，並依照 ECR 儲存庫名稱、EKS 叢集名稱、CloudWatch Log Group 等分別存入 Jenkins 環境變數中，便於後續使用。

   #### 4. 驗證輸出變數
   - 於 Jenkins Console 中印出每個變數，確保成功抓取並可以進一步使用。

   #### 5. 安裝依賴及測試
   - 遍歷微服務清單，安裝依賴後執行各微服務的單元測試。
   - 設定測試超時機制，以應對某些測試可能超時的情況，並防止整體流程中斷。

   #### 6. SonarQube 分析與品質閘檢查
   - 使用 SonarScanner 分析程式碼品質，並將結果提交至 SonarQube 服務。
   - 等待品質閘結果，若未通過，會自動中止 Pipeline。

   #### 7. Docker 映像構建與推送
   - 使用 Dockerfile 為每個微服務構建映像檔，並將其推送至 AWS 公共 ECR。
   - 為每個映像檔打上時間戳記與穩定標籤，並上傳至 AWS ECR 儲存庫。

   #### 8. 安裝或升級 Helm
   - 下載並安裝 Helm，供後續 Kubernetes 應用服務的管理與部署。

   #### 9. 配置 kubectl 並連接 EKS 叢集
   - 更新 kubeconfig，以便 Jenkins Pipeline 使用 kubectl 指令控制 EKS 叢集資源。

   #### 10. 安裝或升級 Fluent Bit（選擇性）
   - 配置 Fluent Bit 以將 Kubernetes 日誌導入至 CloudWatch Log Group 中，便於日誌監控。

   #### 11. Helm 部署
   - 進入 Helm Chart 目錄，依據 Jenkins 中的環境變數進行部署或升級操作。
   - 將服務映像、CloudWatch Log Group 等參數動態傳遞至 Helm，進行 Kubernetes 服務部署。

---

### 注意事項

1. **環境變數更新限制**：
   - 一些由 Terraform 更新的環境變數無法在 Pipeline 開始時設置，因此會在 `Get Outputs` 階段中動態設定。

2. **錯誤處理**：
   - 測試階段包含錯誤捕捉及超時設置，確保 Pipeline 即使單一測試失敗也能繼續執行，提升流程穩定性。

3. **Helm 與 kubectl 安裝與配置**：
   - Pipeline 中已考慮可能缺少 Helm 與 kubectl 的情況，通過下載與設置 PATH 確保其正常運行。

---

### 版本歷程
- 初始版本 v1.0：提供基本自動化流程。
- **修改建議**：
   - 可以根據需求調整 Docker 標籤或超時設置時間。
   - 可以進一步增加 Ansible 配置步驟，以自動化更多操作。