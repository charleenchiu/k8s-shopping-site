## 功能說明報告 - `master_ubuntu.yml`

### 檔案概述
此檔案為 Ansible Playbook，旨在配置 Ubuntu 主機以運行 Apache 網頁伺服器並掛載 Amazon EFS（Elastic File System）。Playbook 包含系統更新、安裝必要的服務（如 Apache、Git、NFS 客戶端），並從 GitHub 獲取靜態網站內容，同步至 Amazon S3。

### Playbook 結構

---

#### 文件開頭

```yaml
---
- hosts: all
  become: true
```

Playbook 使用 `---` 起始標記，設定 `hosts: all` 以作用於所有指定主機，並設置 `become: true` 以系統管理員權限執行操作。

---

### 第一部分：系統更新與基本套件安裝

**功能**：確保系統更新到最新版本，並安裝 Apache 和 Git，為靜態網站伺服器提供必要支持。

- `update`：更新所有軟體包的索引。
- `Install httpd`：安裝 Apache2 網頁伺服器。
- `Start` 和 `Enable httpd`：分別啟動並設置 Apache2 開機自啟。
- `Install git`：安裝 Git 以管理程式碼版本。

---

### 第二部分：EFS 文件系統掛載設置

**功能**：安裝 NFS 客戶端並掛載 Amazon EFS，使伺服器的靜態網站資料可儲存在彈性文件系統。

- **安裝 NFS 客戶端**：使用 `nfs-common` 套件，支援 NFS 協議。
- **確保掛載目錄存在**：建立本地掛載目錄 `/var/www/html`。
- **獲取 EC2 元數據**：從 EC2 實例中取得 AWS 區域以配置 EFS DNS。
- **設置 EFS DNS 名稱**：依據區域及文件系統 ID 設置 EFS 的 DNS 名稱。
- **掛載 EFS**：將 EFS 掛載到 `/var/www/html`，並設置掛載選項。
- **確認掛載成功**：列出掛載目錄中的文件，驗證掛載是否成功。

---

### 第三部分：開機自動掛載與靜態網站程式碼同步

**功能**：在 `/etc/fstab` 中配置自動掛載 EFS，並從 GitHub 克隆靜態網站程式碼至 EFS 掛載的目錄。

- **Edit fstab**：將 EFS 掛載指令寫入 `/etc/fstab` 以便重啟後自動掛載。
- **Clone repository**：將靜態網站程式碼從 GitHub 克隆到 EFS 掛載目錄中。
  
--- 

### 擴展部分：同步靜態網站到 S3

此 Playbook 最後部分包含將網站內容同步至 S3 的任務。若目標是儲存網站靜態文件，並在 AWS CloudFront 等服務中使用，可使用以下任務：

- **Install awscli**：安裝 `awscli` 以支援 AWS 資料操作。
- **Clone website repository**：克隆網站內容至本地 EFS 掛載目錄。
- **Upload to S3**：使用 `aws s3 sync` 將靜態網站內容同步到 S3 bucket。

---

### 結論

此 Playbook 提供一套完整的系統設置流程，支持 Ubuntu 主機上的 Apache 網頁伺服器、Git 程式碼管理、NFS 服務與 EFS 文件系統的自動掛載，並可選擇性地將靜態網站同步至 S3。此流程確保靜態網站程式碼可在重啟後自動載入，並可持續同步至 S3 以便備份或作為 CDN 的內容來源。