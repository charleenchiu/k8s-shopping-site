這段 `index.js` 是一個使用 Express 的 Node.js 應用程式，作為 `k8s-shopping-site` 的入口網站，整合了其他四個微服務（`user-service`、`product-service`、`order-service` 和 `payment-service`），並透過 `http-proxy-middleware` 來轉發 HTTP 請求至各服務的 API。以下是代碼的詳細說明：

### 功能概述
1. **Express Web Server**：使用 Express 來建立一個 Web 伺服器，監聽 3000 埠。
2. **環境變數設定**：透過 `process.env` 來指定微服務的 URL，預設指向容器的內部網路地址。
3. **根目錄路由 (`/`)**：顯示包含各微服務 API 的鏈結。
4. **代理設定**：透過 `http-proxy-middleware` 將特定路徑的請求（如 `/user-service`）轉發到指定的微服務 URL。

### 主要代碼詳述

1. **環境變數設定**：
   ```javascript
   const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3001';
   const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
   const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://order-service:3003';
   const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3004';
   ```
   - 透過環境變數指定各微服務的 URL，若未提供環境變數，則使用預設的內部網路地址，適用於 Docker Compose 或 Kubernetes 的內部網路環境。

2. **首頁路由 (`/`)**：
   ```javascript
   app.get('/', (req, res) => {
       res.send(`
           <h1>Welcome to the Shopping Site</h1>
           <p>Click the links below to access the APIs:</p>
           <ul>
               <li><a href="/user-service">User Service</a> - URL: ${userServiceUrl}</li>
               <li><a href="/product-service">Product Service</a> - URL: ${productServiceUrl}</li>
               <li><a href="/order-service">Order Service</a> - URL: ${orderServiceUrl}</li>
               <li><a href="/payment-service">Payment Service</a> - URL: ${paymentServiceUrl}</li>
           </ul>
       `);
   });
   ```
   - 使用 HTML 標籤顯示服務入口資訊，提供每個微服務的 API 鏈結，以便於開發人員測試和檢查各微服務是否可用。

3. **代理設定**：
   ```javascript
   app.use('/user-service', createProxyMiddleware({ 
       target: userServiceUrl, 
       changeOrigin: true, 
       pathRewrite: { '^/user-service': '/' },  // 重寫路徑
       logLevel: 'debug' 
   }));
   ```
   - 透過 `http-proxy-middleware` 模組，將符合 `/user-service` 路徑的請求轉發至 `userServiceUrl`，並設定 `changeOrigin` 和 `pathRewrite`。
   - `changeOrigin: true` 讓代理伺服器偽裝成來自目標伺服器的請求，有助於處理 CORS 限制。
   - `pathRewrite` 會將路徑 `/user-service` 重寫成根路徑 `/`，以便於目標服務直接處理請求。

4. **註解的 Kubernetes ClusterIP 代理設置**：
   ```javascript
   /*
   app.use('/user-service', createProxyMiddleware({ target: 'http://user-service.default.svc.cluster.local:3001', changeOrigin: true }));
   */
   ```
   - 這部分代碼是預留給 Kubernetes 部署的。如果此應用程式執行於 Kubernetes 集群內部，`ClusterIP` 服務可以透過 `.default.svc.cluster.local` 領域名稱來定位服務。此設定已被註解，但適合 Kubernetes 的 ClusterIP 配置。

5. **伺服器啟動**：
   ```javascript
   app.listen(port, '0.0.0.0', () => {
       console.log(`Index Page listening at http://0.0.0.0:${port}`);
   });
   ```
   - 啟動伺服器並監聽 0.0.0.0，確保伺服器可以從 Docker 或 Kubernetes 的內部網路訪問。

### 使用方法
1. **運行環境**：確保設置了 `USER_SERVICE_URL` 等環境變數，並執行 `node index.js` 啟動伺服器。
2. **訪問首頁**：開啟 `http://localhost:3000` 或內部網路對應的 URL，可在首頁看到各微服務的鏈結。
3. **測試代理**：點擊鏈結，如 `/user-service`，應能透過代理轉發至相應的微服務。

此設計可以在本地開發和 Kubernetes 部署中靈活運行，並有效整合各微服務的 API。