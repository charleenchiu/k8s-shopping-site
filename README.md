# vProfile Terraform Jenkins CI/CD Pipeline (4_jenkins_terraform_ansible)

本專案展示了一個完整的 CI/CD Pipeline，透過 Jenkins 整合 Terraform 來管理 AWS 資源，並由 Terraform 在建置 AWS 資源後，呼叫 Ansible 進行伺服器配置，達到自動化基礎設施部署的目標。該專案展示了從源碼管理、基礎設施規劃、手動審核、到自動化配置的一體化流程。

## 目標

此專案的目標是展示 CI/CD 的自動化流程，使用 Jenkins、Terraform 和 Ansible 配合在 AWS 雲端環境中動態建立與配置資源。流程中透過參數化設計達成靈活控制，並確保操作安全性，以便應用於 DevOps 團隊的需求。

## 架構與工具

1. **CI/CD 工具**：Jenkins - 負責整個自動化流程的管理，透過 Pipeline 實現自動化。
2. **基礎設施配置**：Terraform - 對 AWS 資源進行基礎設施即程式碼（IaC）管理。
3. **伺服器配置**：Ansible - 使用 Playbook 對伺服器進行配置，確保應用執行環境一致性。
4. **版本控制**：GitHub - 管理專案程式碼，透過分支進行不同環境的變更控制。

## 專案檔案結構

```
project-directory
├── Jenkinsfile                 # Jenkins Pipeline 自動化腳本
├── web_task.tf                 # Terraform 腳本，定義 AWS 基礎設施
├── master_ubuntu.yml           # Ansible Playbook，配置伺服器環境並部署網站
└── README.md                   # 專案說明文件（即本檔案）
```

## Pipeline 流程說明

該 Jenkins Pipeline 透過多個階段完成自動化基礎設施管理與應用部署，以下為各階段說明：

1. **Git Clone 階段**：
    - 透過 Jenkins 拉取指定的程式碼分支到 Terraform 工作目錄，以確保程式碼最新。

2. **Terraform Plan 階段**：
    - 初始化 Terraform 後生成計劃文件 `tfplan`，並儲存計劃內容至 `tfplan.txt` 作為人工審查的參考。

3. **Terraform Approval 階段**：
    - 若 `autoApprove` 參數設定為 `false`，此階段會顯示計劃內容，並等待人工確認是否進行 `apply`。

4. **Terraform Apply 階段**：
    - 經人工確認後，應用計劃進行資源創建。

### 選配的階段

專案內設有幾個選配的階段，用於選擇以 Jenkins Pipeline 呼叫 Ansible Playbook 進行 AWS 資源配置時，作為後續開發的選項：

- **設定私鑰權限**：對私鑰進行權限設置，確保私密性。
- **Ansible 部署**：透過 Ansible Playbook 完成伺服器的自動配置。
- **版本檢查**：檢查 Ansible 版本。
- **取回私鑰**：取回 Terraform 輸出的私鑰並設置權限。
- **寫入 Inventory**：將新建的 EC2 IP 寫入 Inventory，並執行 Ansible Playbook。

## 配置需求

- **AWS 憑證**：Jenkins 憑證管理中需事先設置 AWS 憑證。
- **Terraform 檔案**：`web_task.tf` 及其他 Terraform 檔案負責管理 AWS EC2、IAM 和 VPC 資源。
- **Ansible 檔案**：使用 `master_ubuntu.yml` Playbook 對伺服器進行配置。

## 使用說明

1. **自動化建置**：透過 Jenkins 的 `autoApprove` 參數設定，控制自動執行 `apply` 或等待人工批准。
2. **安全配置**：AWS 憑證管理及 Terraform、Ansible 配置文件，皆需遵循最小化權限及敏感資料加密。
3. **環境需求**：需配置 AWS、Jenkins 伺服器以及 Ansible 執行環境。

## 目標成效

本專案展示了 DevOps 基礎設施即程式碼（IaC）、自動化審批與配置等技能，有助於企業在雲端環境中實現快速部署、擴展及管理資源。

## 聯絡我
邱瓊瑩 charleenchiu@msn.com 0930-629-242
[LinkedIn](https://www.linkedin.com/in/charleenchiu/)
[104人力銀行](https://pda.104.com.tw/profile/share/i8TlEWaBQZoMAXKV0SEmPST014a1AIa9)(效期2024/11/20)