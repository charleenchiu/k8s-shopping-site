# 我該如何修改根目錄index.js，讓我在本機用docker compose檢視時，及發佈到EKS檢視時，都能用同樣的index.js？

為了讓 `index.js` 同時適用於本地 Docker Compose 和 EKS 環境，建議使用環境變數來設定不同的服務路徑。在本地測試時，可以使用本機 `localhost` 路徑，而在 EKS 中則使用 Kubernetes 的 Cluster DNS 名稱。 

### 修改 `index.js` 使用環境變數
可以透過環境變數判斷當前環境（例如 `NODE_ENV`），或者直接將每個服務的 URL 作為環境變數傳入。這樣無論在本機或 EKS，都可以使用相同的 `index.js`。

### 修改後的 `index.js`
```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 3000;

// 設定環境變數：本地和 EKS 環境的不同微服務 URL
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3003';
const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004';

// 根目錄
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Shopping Site</h1>
        <p>Click the links below to access the APIs:</p>
        <ul>
            <li><a href="/user-service">User Service</a></li>
            <li><a href="/product-service">Product Service</a></li>
            <li><a href="/order-service">Order Service</a></li>
            <li><a href="/payment-service">Payment Service</a></li>
        </ul>
    `);
});

// 使用 http-proxy-middleware 將請求轉發到對應的微服務，使用環境變數設定目標 URL
app.use('/user-service', createProxyMiddleware({ target: userServiceUrl, changeOrigin: true }));
app.use('/product-service', createProxyMiddleware({ target: productServiceUrl, changeOrigin: true }));
app.use('/order-service', createProxyMiddleware({ target: orderServiceUrl, changeOrigin: true }));
app.use('/payment-service', createProxyMiddleware({ target: paymentServiceUrl, changeOrigin: true }));

// 啟動伺服器
app.listen(port, () => {
    console.log(`Index Page listening at http://localhost:${port}`);
});
```

### 配置環境變數

1. **本地 Docker Compose**：
   - 在 `docker-compose.yml` 中加入環境變數：
     ```yaml
     services:
       site-service:
         environment:
           - USER_SERVICE_URL=http://localhost:3001
           - PRODUCT_SERVICE_URL=http://localhost:3002
           - ORDER_SERVICE_URL=http://localhost:3003
           - PAYMENT_SERVICE_URL=http://localhost:3004
     ```

2. **EKS 環境**：
   - 在 Helm Chart 的 `values.yaml` 設定環境變數：
     ```yaml
     env:
       USER_SERVICE_URL: "http://user-service.default.svc.cluster.local:3001"
       PRODUCT_SERVICE_URL: "http://product-service.default.svc.cluster.local:3002"
       ORDER_SERVICE_URL: "http://order-service.default.svc.cluster.local:3003"
       PAYMENT_SERVICE_URL: "http://payment-service.default.svc.cluster.local:3004"
     ```
   - 然後在 `deployment.yaml` 中引入這些環境變數：
     ```yaml
     env:
       - name: USER_SERVICE_URL
         value: {{ .Values.env.USER_SERVICE_URL }}
       - name: PRODUCT_SERVICE_URL
         value: {{ .Values.env.PRODUCT_SERVICE_URL }}
       - name: ORDER_SERVICE_URL
         value: {{ .Values.env.ORDER_SERVICE_URL }}
       - name: PAYMENT_SERVICE_URL
         value: {{ .Values.env.PAYMENT_SERVICE_URL }}
     ```

這樣配置後，無論是在本機的 Docker Compose 還是 EKS， `index.js` 皆會使用不同的環境變數來連接各自的服務，避免硬編碼問題。