### 檔案 `web_task.tf` 功能說明報告

此 Terraform 配置檔案主要用於在 AWS 平台上自動化建立一個完整的網站基礎架構，涵蓋網站托管、儲存、網頁快取及安全配置等功能。此檔案中的配置將會部署 EC2 實例、EFS（Elastic File System）、S3 存儲桶、CloudFront 分佈網路等資源，提供高效且安全的網站服務環境。

---

#### 1. **AWS Provider 設定**
   - 指定 AWS 區域為 `us-east-1`，用於配置與資源部署。

#### 2. **工作目錄資訊管理**
   - 使用 `null_resource` 與 `local_file` 資源來將當前工作目錄的路徑儲存為文件，便於後續操作與依賴管理。

#### 3. **EC2 私鑰生成與管理**
   - 使用 `tls_private_key` 資源生成 4096 位元 RSA 私鑰，確保 EC2 實例的 SSH 連線安全性。
   - 將生成的私鑰寫入檔案並設定權限（600），同時創建相應的 AWS EC2 公鑰配對，使 Jenkins 連接具備所需的安全性。

#### 4. **安全組 (Security Group) 配置**
   - 建立 `allow_tcp_nfs` 安全組，開放特定 TCP、SSH、HTTPS、及 NFS 連線的入站流量，並允許所有出站流量，確保 EC2 實例的正常訪問與安全。

#### 5. **EC2 實例配置**
   - 使用 `aws_instance` 資源創建 `t2.micro` EC2 實例，並附加上述安全組以管理連接流量。
   - 配置 `file` 與 `remote-exec` provisioner，將私鑰上傳至 EC2 並設定權限，同時添加 Jenkins 公鑰到 `authorized_keys` 中，以支援自動化部署管理。

#### 6. **Elastic File System (EFS) 設定**
   - 使用 `aws_efs_file_system` 和 `aws_efs_mount_target` 來創建 EFS 檔案系統並掛載至指定子網，提供持久化儲存需求，便於數據共享與備份。

#### 7. **遠端配置（Ansible Integration）**
   - 使用 `null_resource` 搭配 `local-exec` provisioner 來執行 Ansible playbook，傳入 EFS 和 S3 資訊，並進行 EC2 遠端配置，確保基礎架構的初始化設置與整合。

#### 8. **S3 Bucket 創建與權限管理**
   - 使用 `aws_s3_bucket` 創建私有 S3 Bucket（`tera_bucket`），作為存儲解決方案並限制公共訪問。
   - 配置 `aws_s3_bucket_ownership_controls` 與 `aws_s3_bucket_public_access_block` 來管理擁有權與公開訪問控制，確保數據的私密性與安全。
   - 設置 S3 Bucket ACL 為私有，以限制對象的讀寫訪問。

#### 9. **CloudFront 分佈網路設置**
   - 使用 `aws_cloudfront_distribution` 建立 CloudFront 分佈網路來加速全球內容分發。
   - 配置 `default_cache_behavior` 與 `ordered_cache_behavior`，分別定義默認與路徑快取策略，並開啟壓縮以提升效能。
   - 設定地理限制，僅允許來自美國和加拿大的訪問，以滿足合規性需求。

#### 10. **輸出**
   - 配置輸出變數以便後續管理和監控，包括 EC2 公有 IP、EFS ID、S3 Bucket 名稱及 ARN，提供基礎架構必要的訪問資訊。

---

### 功能摘要

此 `web_task.tf` 配置檔案為網站伺服器基礎架構提供了全面的自動化部署解決方案，包括：

- **網站主機及儲存設置**：藉由 EC2 及 EFS 實現主機及持久化儲存服務。
- **安全設置**：建立 AWS 安全組，確保各類流量安全訪問。
- **內容分發及快取**：透過 CloudFront 提升全球網站訪問速度，並依需求設置快取行為。
- **私密性管理**：S3 Bucket 設置私有及訪問控制，確保數據隱私。

此架構適合 DevOps 環境的自動化部署，兼具彈性、高效能與安全性。