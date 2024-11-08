# k8s-shopping-site

本儲存庫包含四個專案，包括一個 Jenkins + Terraform + Ansible 綜合應用專案，以及三個不同版本的微服務網站 k8s-shopping-site 專案，簡介如下：

---

## ☁️ 一個 Jenkins + Terraform + Ansible 綜合應用專案
### 🌐 Ansible 設置 AWS EC2 主機  [➡️前往 4_jenkins_terraform_ansible](https://github.com/charleenchiu/k8s-shopping-site/tree/4_jenkins_terraform_ansible)
在 Jenkins pipeline 呼叫 Terraform 建置 AWS 資源後，使用 Ansible playbook 對主機進行設置。目前已完成開發及初步驗證。

---

## 🛒 三個 k8s-shopping-site 專案總覽

本系列專案旨在展示如何在 Kubernetes 環境下透過微服務架構實現電子商務網站的自動化部署與持續交付（CI/CD）。以下是三個專案的簡介，從最簡單的靜態服務部署到包含資料庫的複雜應用，展示了不同的部署策略（Stable 與 Canary 部署）以確保應用穩定性與高效性。

### 1️⃣ k8s-shopping-site (1_simple) 專案：簡單呈現 CI/CD、Helm Kubernetes 容器化部署的微服務購物網站（Stable 標籤部署）  [➡️前往 1_simple](https://github.com/charleenchiu/k8s-shopping-site/tree/1_simple)

此專案展示了最簡單的微服務架構，無資料庫及後端程式，僅將各服務簡單設置為顯示一個靜態句子，代表使用者、產品、訂單和付款等功能。這些服務使用 Kubernetes 進行容器化部署，所有服務的部署皆透過 Helm 完成，並以 Stable 標籤佈署，目的是展示 CI/CD 流程，並能在 AWS EKS 環境中穩定運行。

- **架構**: 使用 Docker 和 Helm，搭配 Kubernetes 進行部署。未使用資料庫及後端程式。
- **部署**: 服務以 `stable` 標籤部署，標示為穩定版本。
- **CI/CD**: 利用 Jenkins 完成自動化部署流程。

### 2️⃣ k8s-shopping-site (2_nodejs_mysql) 專案：Node.js + MySQL（Canary 部署）  [➡️前往 2_nodejs_mysql](https://github.com/charleenchiu/k8s-shopping-site/tree/2_nodejs_mysql)

此專案展示了基於 Node.js 和 MySQL 的電子商務網站，使用微服務架構處理使用者、產品、訂單和付款等功能，並採用 Canary 部署策略。新版本將先部署至部分服務中，根據監控結果再決定是否全量上線。使用 Docker、Helm 和 Kubernetes 來實現容器化、編排和自動化部署。

- **技術棧**: Node.js 作為後端語言，MySQL 作為資料庫，並採用微服務架構。
- **部署**: 透過 Canary 部署策略逐步上線，降低風險。
- **CI/CD**: 整合 Jenkins 流程來處理代碼檢出、構建、測試和部署。

### 3️⃣ k8s-shopping-site (3_python_nosql) 專案：Python + MongoDB（Canary 部署）  [➡️前往 3_python_nosql](https://github.com/charleenchiu/k8s-shopping-site/tree/3_python_nosql)

此專案基於 Python 和 MongoDB，功能與第二個專案相似，但使用不同的技術堆疊。專案採用微服務架構，並使用 Canary 部署策略，確保在生產環境中進行小範圍測試後再進行全面上線。服務涵蓋使用者管理、產品管理、訂單處理和付款功能。

- **技術棧**: Python 作為後端語言，MongoDB 作為資料庫，並使用微服務架構。
- **部署**: 採用 Canary 部署進行逐步更新，並根據結果調整。
- **CI/CD**: 透過 Jenkins 進行自動化測試和部署，提升效率與可靠性。

---

### 📈 結論

這三個 k8s-shopping-site 專案展示了如何使用 Kubernetes 搭配不同技術堆疊實現微服務架構，並強調 CI/CD 流程的自動化。無論是最簡單的靜態服務部署還是複雜的資料庫驅動型應用，這些專案提供了實用的架構與技術參考，並通過 Stable 和 Canary 部署策略確保應用的穩定性與高效性。



### 📞 聯絡我
👩‍💻 **邱瓊瑩**  
✉️ **Email**: [charleenchiu@msn.com](mailto:charleenchiu@msn.com)  
📱 **電話**: 0930-629-242  

🔗 [![LinkedIn](https://img.shields.io/badge/LinkedIn-邱瓊瑩-blue?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/charleenchiu/)  
🔗 [![104人力銀行](https://img.shields.io/badge/104人力銀行-履歷分享-orange?style=flat&logo=104&logoColor=white)](https://pda.104.com.tw/profile/share/i8TlEWaBQZoMAXKV0SEmPST014a1AIa9) **(效期至2024/11/20)**