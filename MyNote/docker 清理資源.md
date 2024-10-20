你可以透過幾個步驟來**安全地清理開發過程中留下的映像（images）和容器（containers）**，而不會影響 Kubernetes 正常運行。以下是具體方法：

### 1. **標記和識別開發中的容器和映像**
   Kubernetes 的容器和映像通常有系統相關的名稱或前綴，像是 `k8s_`、`registry.k8s.io`、`docker/desktop`，這些可以忽略、保留。而開發中的映像和容器會以你專案或服務的名稱命名，比如：
   - `k8s-shopping-site-*`
   - `localstack/*`(這是模擬aws平台, 而不必真的在AWS創建資源，我要留)

### 2. **列出所有 Docker 容器和映像**
   - 容器：`docker ps -a` 列出所有容器，包含正在執行的和已停止的。
   - 映像：`docker images` 列出所有的映像。

### 3. **清理不再需要的容器**
   你可以選擇性地刪除不再需要的開發容器，避免影響 Kubernetes 容器。
   
   - 刪除停止的開發容器：
     ```bash
     docker rm $(docker ps -a --filter "status=exited" --filter "name=k8s-shopping-site" -q)
     ```
     這條指令會刪除名稱包含 `k8s-shopping-site` 的所有停止的容器。

   - 刪除特定名稱的容器：
     ```bash
     docker rm [CONTAINER_ID]
     ```
     例如刪除 LocalStack 的容器：
     ```bash
     docker rm keen_shamir
     ```

### 4. **清理不再需要的映像**
   你可以根據映像的名稱或標籤來刪除不再需要的映像。

   - 刪除特定映像：
     ```bash
     docker rmi [IMAGE_ID]
     ```
     例如刪除 LocalStack 的映像：
     ```bash
     docker rmi b1e120e3c98f
     ```

   - 刪除未使用的開發映像：
     使用這個命令可以自動清理未使用的映像：
     ```bash
     docker image prune -a
     ```
     它會刪除所有沒有被容器使用的未標記映像。

### 5. **避免刪除 Kubernetes 相關的映像和容器**
   - 通過 `docker ps` 和 `docker images`，你可以分辨出 Kubernetes 相關的容器和映像，這些通常包含：
     - `k8s_` 開頭的名稱（例如 `k8s_coredns`, `k8s_POD` 等）。
     - 來自 `registry.k8s.io` 或 `docker/desktop` 的映像。

   **跳過這些映像和容器**，以免影響 Kubernetes 的運行。

### 6. **自動清理 Docker**
   如果想定期清理開發中產生的暫存檔，可以使用以下命令來進行自動化的清理：
   - 清理未使用的容器、網路和映像：
     ```bash
     docker system prune -a
     ```

這樣你可以安全地清理開發過程中的殘留物，而不會影響 Kubernetes 必要的容器和映像。