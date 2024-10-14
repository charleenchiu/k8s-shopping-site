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

- 執行docker-compose up --build或docker build是否會在本機儲存暫存檔？我可以移除它們嗎？
Copilot
- 是的，執行 docker-compose up --build 或 docker build 會在本機儲存暫存檔1
。這些暫存檔包括 Docker build cache 和 tmpfs mounts

，它們會在您的系統上佔用空間2
。

您可以移除這些暫存檔，以釋放系統空間
。您可以使用以下命令來清除Docker的暫存檔：

```sh
docker system prune
```
這個命令會清除所有不再使用的容器、網絡、卷和Docker檔案2
。如果您只想清除特定的暫存檔，您可以使用以下命令：

```sh
docker builder prune
```
這個命令專門用於清除Docker build cache