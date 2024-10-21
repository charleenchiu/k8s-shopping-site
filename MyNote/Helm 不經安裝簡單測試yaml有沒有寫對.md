# 如何簡單地測試(不經過helm install)，k8s-chart\values.yaml能不能讓test-chart\templates\deployment.yaml正確地套用？

你可以使用 Helm 提供的模板渲染功能來測試 `values.yaml` 和 `deployment.yaml` 是否正確套用，而不必實際執行 `helm install`。這可以透過 `helm template` 指令來達成，它會生成 Kubernetes YAML 文件，並顯示出來讓你檢查是否正確。

### 步驟：

1. **在 `test-chart` 目錄中執行 `helm template`**：
   ```bash
   helm template my-release ./test-chart
   ```

2. **檢查輸出的 YAML**：
   - 這個指令會讀取 `k8s-chart/values.yaml` 的內容，並套用到 `templates/deployment.yaml`。結果會生成最終的 Kubernetes 資源清單，顯示在終端機中。

3. **確認模板渲染是否正確**：
   - 查看輸出的結果，確認 `deployment.yaml` 是否正確地使用了 `values.yaml` 中的變數，如 `.Values.replicaCount`、`.Values.service.port` 等。

這樣就能在不實際部署的情況下，驗證你的模板渲染是否正確。