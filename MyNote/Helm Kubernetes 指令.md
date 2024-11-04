
### 使用 Helm 部署的基本步驟

1. **創建 Helm Chart**：
   ```bash
   helm create my-app
   ```

2. **編輯 `values.yaml`**：設置服務的相關參數。

3. **編輯 `templates/` 目錄下的 YAML 檔案**：配置 Deployments、Services 等 Kubernetes 資源。

4. **安裝應用**：
   ```bash
   helm install my-app ./my-app
   ```

5. **升級應用**：
   ```bash
   helm upgrade my-app ./my-app
   ```

6. **回滾版本**：
   ```bash
   helm rollback my-app <revision>
   ```
