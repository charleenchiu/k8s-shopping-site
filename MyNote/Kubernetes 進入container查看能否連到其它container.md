# 如何進入site-service的docker container, 下指令查看可否連到其它service？
要進入 `site-service` 的 Docker container 並檢查是否能連到其他服務，可以使用 `kubectl exec` 指令來進行。以下是具體步驟：

1. **確認 `site-service` Pod 名稱**（已確認為 `site-service-deployment-6ddbd789d6-mvqlv`）。
2. **使用 `kubectl exec` 進入 `site-service` container**。

假設您希望在 `site-service` 容器中使用 `curl` 指令來測試與其他服務的連線，可以依照以下步驟進行：

```bash
# 進入 site-service container
kubectl exec -it site-service-deployment-6ddbd789d6-mvqlv -- /bin/sh
```

3. **在容器內測試與其他服務的連線**：

   - 使用 `curl` 或 `wget` 測試連線，假設其他服務名稱為 `user-service`, `product-service`, `order-service`, `payment-service` 且使用 Cluster IP 來存取：

   ```bash
   # 測試連接 user-service
   curl http://user-service:3001
   # 測試連接 product-service
   curl http://product-service:3002
   # 測試連接 order-service
   curl http://order-service:3003
   # 測試連接 payment-service
   curl http://payment-service:3004
   ```

如果您能成功取得各服務的回應，就代表各服務之間的網路配置正常。

要離開 `kubectl exec` 進入的容器，您可以使用以下指令：

1. 如果您是在 shell 中（例如 `/bin/sh` 或 `/bin/bash`），可以輸入 `exit` 或使用 `Ctrl + D` 來退出容器。

例如：
```bash
# 在容器內部
# 輸入 exit
exit
```

這樣就可以回到您原本的 shell 環境。