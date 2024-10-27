可以的！在 Docker 中，你可以在推送或標記 (tag) 映像時同時掛上多個標籤，以便使用不同的標籤名稱來指向同一個映像版本。這對 Canary 部署、穩定版本標示以及版本追蹤非常實用。以下是具體的操作方法：

### 步驟

1. **建立映像檔並打多個標籤**  
   首先，在 `docker build` 時可以只指定一個初始標籤，然後使用 `docker tag` 指定多個標籤指向該映像。

   ```bash
   # 假設要建立並標籤為 v1.2.3
   docker build -t your-repo/your-image:v1.2.3 .

   # 同時打上其他標籤
   docker tag your-repo/your-image:v1.2.3 your-repo/your-image:stable
   docker tag your-repo/your-image:v1.2.3 your-repo/your-image:canary
   ```

2. **推送多個標籤**  
   當映像打好標籤後，將每個標籤都推送到 Docker Registry。例如推送至 ECR 或 Docker Hub：

   ```bash
   docker push your-repo/your-image:v1.2.3
   docker push your-repo/your-image:stable
   docker push your-repo/your-image:canary
   ```

這樣，你的映像就同時具備 `v1.2.3`、`stable` 和 `canary` 三個標籤，並可以根據不同的需求在部署時選擇適合的標籤。

在 Canary 佈署中，建議進行版本化管理，以清晰追蹤不同版本的影響，而不單純使用 `latest` tag。以下是推薦的標籤策略：

1. **Canary Tag**：針對 Canary 佈署的 image，可以加上 `canary` tag，或使用版本號（例如 `v1.2.3-canary`）來代表這是測試版本，和主線版本有所區隔。
  
2. **Stable Tag**：當 Canary 佈署通過健康檢查後，將該 image tag 更新為 `stable`，並將此版本佈署到所有用戶端。這樣，`stable` 可代表最新且穩定的版本。

3. **Version Tag**：建議在每次 build 時產生唯一的版本號，例如 `v1.2.3`，方便在需要回滾或追蹤時使用。`stable` 和 `canary` 可作為通用標籤，指向最新的穩定和 Canary 版本，但在追蹤或查找問題時，具體的版本號更精確。

4. **Latest Tag 的作用**：`latest` 通常指向最新的 image，但在多環境部署中並不建議依賴 `latest`，因為它不一定穩定且可能不清楚具體內容。若你有 CI/CD pipeline，`latest` 可以暫時標示最近的開發版本（用於測試環境），但建議避免在生產環境使用。

這樣的標籤策略可以確保 Canary 部署流程中的穩定性，同時便於回滾操作。