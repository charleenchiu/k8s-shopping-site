# 為什麼我在Helm佈署時，每個service都指定了service type為LoadBalancer，佈署完成後，也看到有5個ELB，但只有網站根目錄的http://<ELB DNS>:3000可以從瀏覽器存取，其它http://<各 service 的ELB DNS>:<各 service 的 port>都無法存取呢？

根據你的描述，應該是各個微服務的ELB DNS（如 `http://<各 service 的ELB DNS>:<各 service 的 port>`）無法訪問的原因可能與以下幾點有關：

### 1. **LoadBalancer服務的預設行為：**
   * 在Kubernetes中，當你在`Service`中指定 `type: LoadBalancer` 時，Kubernetes會使用ELB來公開該服務。通常ELB是根據Service設定的 `targetPort` 來公開的，不需要再指定特定的應用內部port。
   * 若在`Service`設定時沒有明確指定`port`或`targetPort`，有可能會導致ELB未正確連結到應用服務的對應Port。

### 2. **Service Port和Target Port的配置：**
   請檢查每個微服務的 `service.yaml` 中的 `port` 與 `targetPort`，確保每個`Service`的 `targetPort` 和服務內部的應用程式Port（如 3001, 3002, 3003, 3004）是對應的。例如：

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: user-service
   spec:
     type: LoadBalancer
     ports:
       - port: 80         # ELB暴露的port
         targetPort: 3001 # 應用程式的port
     selector:
       app: user-service
   ```

   * 在這個設定中，ELB會接收HTTP流量到`port 80`，然後將流量轉送至`targetPort: 3001`。
   * 每個微服務都可以在`service.yaml`中對應不同的`targetPort`，而`port`可以保持為同一個（例如`80`），這樣使用者可以透過`http://<ELB DNS>`直接訪問。

### 3. **應用程式與Service的對應：**
   * 確認應用程式已經設定為對應的 `targetPort`，而不是你定義在程式碼內部的 `port`。在每個微服務的 `Dockerfile` 或應用程式設定中，應當對應Service中的 `targetPort`。

### 4. **Security Group和Firewall設定：**
   * Kubernetes會自動為 ELB 配置 Security Group，允許對指定的`port`的外部訪問。若 AWS 上的Security Group沒有正確配置開放對應的`port`，則會導致無法訪問。確認各個微服務的`targetPort`在Security Group中已開啟。

### 5. **ELB Port和應用程式Port配置衝突：**
   * ELB通常是將請求導向到指定的`targetPort`，並不需要在URL中附加`port`。試著僅訪問 `http://<各 service 的ELB DNS>`，而不是 `http://<各 service 的ELB DNS>:<各 service 的 port>`，看看是否能正常訪問。

---

### 其他調整建議：

若以上步驟仍無法解決，可以考慮以下設定：

1. **在Helm的 `values.yaml` 中定義Ports：**
   * 在 `values.yaml` 設定每個微服務的 `targetPort`，方便 `service.yaml` 自動引用此設定。

   ```yaml
   user-service:
     port: 80
     targetPort: 3001

   product-service:
     port: 80
     targetPort: 3002

   # 依此類推...
   ```

2. **排錯方式：**
   * 可以使用 `kubectl describe service <service name>` 確認每個 `Service` 配置的 `port` 與 `targetPort` 是否與設定一致。
   * 使用 `kubectl logs <pod-name>` 查看應用程式Log，確認服務是否在預期的 `targetPort` 上啟動。

這樣應該可以幫助你釐清並解決ELB無法訪問的問題。

# //=========================================================================================
# 我是否應該將helm 佈署根目錄docker的service type設為LoadBalancer，而其它service 的service type設為ClusterIP，這樣設計比較好呢？

是的，這樣的設計確實是比較常見且推薦的模式。

在微服務架構中，通常只需要將對外暴露的入口（即根目錄的主應用）設置為 `LoadBalancer`，讓流量從這個對外的ELB進入，再由主應用的API去調用其他內部微服務。具體來說：

### 具體設計建議

1. **根目錄（主應用）設為 LoadBalancer：**
   * 只需將 `根目錄` 的 `service type` 設為 `LoadBalancer`，Kubernetes會自動配置一個ELB來接收外部流量。
   * 用戶只需通過主應用的ELB DNS訪問應用，不需要知道內部其他微服務的細節。
   
2. **其餘微服務設為 ClusterIP：**
   * 將 `user-service`、`product-service` 等微服務的 `service type` 設為 `ClusterIP`，這樣它們只會在Kubernetes集群內部暴露，外部無法直接訪問。
   * 主應用可以通過 `ClusterIP` 方式與這些內部微服務進行通訊，這樣不僅更安全，也更符合微服務架構的分層設計。

### 優勢

- **安全性**：只有主應用的ELB暴露在網際網路上，其他微服務僅集群內部可訪問，減少潛在的外部攻擊風險。
- **簡化流量管理**：所有進出集群的流量都由主應用控制，這樣更便於集中化管理和監控。
- **降低成本**：每個 `LoadBalancer` 都會產生一個ELB資源，這樣的設計能減少不必要的ELB數量，降低成本。

### 設定範例

在 `values.yaml` 中可以設置：

```yaml
# 根目錄服務設定為LoadBalancer
site-service:
  service:
    type: LoadBalancer
    port: 80
    targetPort: 3000

# 其他微服務設定為ClusterIP
user-service:
  service:
    type: ClusterIP
    port: 3001

product-service:
  service:
    type: ClusterIP
    port: 3002

order-service:
  service:
    type: ClusterIP
    port: 3003

payment-service:
  service:
    type: ClusterIP
    port: 3004
```

### 結論
這種設計讓 `site-service` 成為應用的唯一對外訪問入口，透過ClusterIP進行內部微服務的調用，並且有效地節省資源，同時也提升了應用的安全性和管理性。