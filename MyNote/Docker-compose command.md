當你執行了 `docker-compose up --build` 之後，Docker Compose 會依據 `docker-compose.yml` 來進行以下操作：

1. **建置容器**：
   - Docker 會根據每個微服務的 `Dockerfile` 建置相應的容器映像檔。如果是第一次執行，Docker 會下載所需的基礎映像，然後建置每個微服務。
   
2. **啟動服務**：
   - 所有定義在 `docker-compose.yml` 中的服務（如 `user-service`, `product-service`, `order-service`, `payment-service`）會在對應的埠號啟動並開始運行。
   
3. **檢視日誌**：
   - 終端機會顯示每個微服務的日誌輸出，這讓你可以看到每個服務是否成功啟動以及是否有錯誤發生。

### 下一步操作：

1. **確認服務是否已成功啟動**：
   你可以檢查日誌輸出，看是否所有服務都顯示 `Server started on port XXXX`（或類似訊息），確認服務已在指定的埠號啟動。

2. **檢查服務的狀態**：
   開啟瀏覽器，並根據你設置的埠號訪問各個服務，例如：
   - `http://localhost:3001` (User Service)
   - `http://localhost:3002` (Product Service)
   - `http://localhost:3003` (Order Service)
   - `http://localhost:3004` (Payment Service)

3. **檢查容器狀態**：
   你可以使用以下指令檢查所有運行中的容器：
   ```bash
   docker ps
   ```
   這會列出目前所有運行的 Docker 容器及其對應的服務名稱和埠號。

4. **停止服務**：
   當你想要停止所有服務時，可以按 `Ctrl + C`，這將停止所有運行的容器。如果你想完整停止並刪除所有容器，使用：
   ```bash
   docker-compose down
   ```

5. **進一步測試**：
   測試各個服務的 API 或前端應用，確認它們是否正確運行，並能夠相互通信（例如，`user-service` 能否呼叫 `order-service` 等）。

如果某些服務無法啟動或出現錯誤，可以從日誌中檢查詳細資訊，通常會提供具體的錯誤提示來解決問題。


//===============================================================================================
# 清除暫存檔

- 執行 docker-compose up --build 或 docker build 會在本機儲存暫存檔1
。這些暫存檔包括 Docker build cache 和 tmpfs mounts
，它們會在您的系統上佔用空間
您可以移除這些暫存檔，以釋放系統空間
。您可以使用以下命令來清除Docker的暫存檔：

```sh
docker system prune -f
```
範圍：全面清理

作用：這個指令會清理所有未使用的資料，包括停止的容器、未使用的網絡、未掛載的卷和所有未標記的影像。簡單來說，它會幫你打掃 Docker 系統的各個角落，讓你的 Docker 更加整潔。
-f：強制執行，不會提示確認。

```sh
docker builder prune -f
```
這個命令專門用於清除Docker build cache
範圍：針對構建過程

作用：這個指令專門清理構建過程中產生的未使用的建構快取（build cache）。這些快取可能會隨著時間累積，佔用大量空間，但這個指令只會清理這些構建快取，不會影響其他 Docker 資源。
-f：強制執行，不會提示確認。

總結來說，docker system prune -f 是大掃除，清理範圍更廣；而 docker build prune -f 僅清理構建過程中的垃圾，範圍更小。

清理不需要的 Docker 映像和容器：在磁碟空間不足的情況下，可以使用以下命令來清理不再使用的 Docker 資源：

刪除未使用的容器：docker container prune
刪除未使用的映像：docker image prune -a
刪除未使用的卷：docker volume prune

//=============================================================================================

# 在 Jenkins pipeline 執行結束後，釋放空間是個好習慣，特別是當你經常建構和推送 Docker 映像時。這四個指令的用途和必要性如下：

1. **`docker builder prune -f`**：這個指令會清除所有未使用的 build cache。這在你頻繁建構 Docker 映像時特別有用，可以釋放大量空間。如果你的 pipeline 經常建構映像，建議保留這個指令。

2. **`docker container prune`**：這個指令會刪除所有未使用的容器（即停止的容器）。如果你在 pipeline 中經常產生和停止容器，則建議保留此指令以釋放空間。

3. **`docker image prune -a`**：這個指令會刪除所有未使用的映像，包括未被任何容器使用的映像。這是釋放空間的有效方法，但要小心，因為它也會刪除任何你不再需要的映像。

4. **`docker volume prune`**：這個指令會刪除所有未使用的卷。若你的 pipeline 有使用 Docker 卷來存儲數據，則需要考慮是否要保留這些卷。若不需要，你可以保留此指令。

### 總結：
- **必要性**：如果你希望在 Jenkins 執行後釋放空間並且不需要保留未使用的容器、映像和卷，則這四個指令都是必要的。
- **選擇性**：如果你有需要保留的映像或卷，可以選擇性地執行某些指令，根據實際情況調整。

你可以根據需要調整這些指令的執行，例如在 `post` 區塊中執行時，可以選擇性刪除某些項目。這樣做可以避免不小心刪除仍在使用的容器或映像。