# k8s-shopping-site

這個專案展示了一個完整的微服務應用程式 DevOps 部署流程，目的是讓 HR 或面試官可以了解我在 CI/CD、基礎設施自動化、Docker 容器化及 Kubernetes 編排上的技術能力。此專案將作為我履歷的附加資料之一。儘管我有多年的 C# 程式設計經驗，但在 CI/CD 領域還是新手，期望透過這個專案來展現我在 DevOps 方面的學習成果和潛力。

## 專案架構

```plaintext
k8s-shopping-site_1_simple
├── InitAndCleanup
│   ├── CreateJenkinsServer.tf    # Terraform script，用於建立 Jenkins Server
├── k8s-chart
│   ├── charts                    # Helm charts 資料夾
│   ├── templates                 # Kubernetes 部署和服務模板
│   │   ├── deployment.yaml
│   │   ├── service.yaml
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

## 已完成功能

- **多微服務架構**：包括 User Service、Product Service、Order Service 和 Payment Service，各服務獨立運作並容器化。
- **Kubernetes 和 Helm 編排**：使用 Helm charts 管理 Kubernetes 部署，確保系統具備彈性和擴充性。
- **CI/CD 流程**：設計了 Jenkins pipeline，涵蓋 Docker image 建置、自動化測試和部署的持續整合與交付流程。
- **基礎設施自動化**：透過 Terraform 管理 AWS 資源的建置與銷毀，實現「基礎設施即程式碼」(IaC) 的理念。

## 未來擴充計畫

1. **版本管理與標籤策略**  
   設計一套版本標籤策略，包括 `stable` 與 `canary` 版本的標籤管理，適用於每個服務，以支援滾動升級與版本控制。

2. **代碼品質和安全性檢查**  
   集成 SonarQube 來進行代碼品質分析和安全性檢查，確保程式碼的品質和安全。

3. **Docker 部署 MySQL**  
   將 MySQL 整合到服務中，並透過 Docker 容器管理資料庫，便於開發與測試環境的快速建置。

4. **使用 Ansible 配置 MySQL 資料的 Docker Volume**  
   使用 Ansible 自動化配置 MySQL 資料卷，增強資料持久化的穩定性與管理便利性。

5. **改為 Node.js + MySQL 架構**  
   將目前的架構改為 Node.js + MySQL，模擬真實企業常用技術堆疊，展示後端整合的能力。

6. **在部署過程中加入測試**  
   在 CI/CD pipeline 中加入測試階段，包括單元測試、整合測試及端對端測試，以確保上線前的穩定性。

7. **開發 Python + NoSQL 版本**  
   在目前基礎上新增 Python + NoSQL 版本，擴展技術多樣性，展示對不同語言及資料庫的適應能力，強化專案的靈活性。

## 使用方式

1. Clone 專案：
   ```bash
   git clone https://github.com/charleenchiu/k8s-shopping-site_1_simple.git
   ```
2. 使用 Jenkins 設定 pipeline，依據 `Jenkinsfile` 配置執行 CI/CD 流程。
3. 將微服務部署至 Kubernetes 叢集，並透過 Helm 管理不同版本的發布。
4. （選擇性）根據未來擴充計畫進行增強，展示全面的 DevOps 技術應用。

## 聯絡方式

有任何問題或建議，歡迎聯絡：charleen1209@gmail.com

## 附圖
