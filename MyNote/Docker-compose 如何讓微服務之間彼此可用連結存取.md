# 請問我要如何修改，將這些連結改成連到同網站的其它微服務？
例如讓http://localhost:3000/user-service連到的是http://localhost:3001
依此類推
執行docker compose up後，這是http://localhost:3000的C:\charleen\LearnDevops\k8s-shopping-site_1_simple\index.js：
const express = require('express');
const app = express();
const port = 3000; // 根目錄的網站入口

// 根目錄
app.get('/', (req, res) => {
    res.send(
        <h1>Welcome to the Shopping Site</h1>
        <p>Click the links below to access the APIs:</p>
        <ul>
            <li><a href="/user-service">User Service</a></li>
            <li><a href="/product-service">Product Service</a></li>
            <li><a href="/order-service">Order Service</a></li>
            <li><a href="/payment-service">Payment Service</a></li>
        </ul>
    );
});

// 四個 API 的路由
app.get('/user-service', (req, res) => {
    res.send('This is the User Service API!');
});

app.get('/product-service', (req, res) => {
    res.send('This is the Product Service API!');
});

app.get('/order-service', (req, res) => {
    res.send('This is the Order Service API!');
});

app.get('/payment-service', (req, res) => {
    res.send('This is the Payment Service API!');
});

// 啟動伺服器
app.listen(port, '0.0.0.0', () => {
    console.log(Index Page listening at http://0.0.0.0:${port});
});


答：
要讓這些連結指向其他服務（如 `http://localhost:3001`），需要將 `index.js` 程式碼修改為能夠將 `/user-service` 的請求代理到 `http://localhost:3001`。可以使用 `http-proxy-middleware` 這個 npm 套件來實現代理。

### 1. 安裝 `http-proxy-middleware`
在 `k8s-shopping-site_1_simple` 目錄下執行以下指令來安裝：
```bash
npm install http-proxy-middleware
```

### 2. 修改 `index.js` 代碼
在 `index.js` 中，透過 `http-proxy-middleware` 將 `/user-service`、`/product-service`、`/order-service` 和 `/payment-service` 的請求代理到相對應的端口：

```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware'); // 引入代理中介
const app = express();
const port = 3000; // 根目錄的網站入口

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

// 使用 http-proxy-middleware 將請求轉發到對應的微服務
app.use('/user-service', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/product-service', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));
app.use('/order-service', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }));
app.use('/payment-service', createProxyMiddleware({ target: 'http://localhost:3004', changeOrigin: true }));

// 啟動伺服器
app.listen(port, '0.0.0.0', () => {
    console.log(`Index Page listening at http://0.0.0.0:${port}`);
});
```

### 3. 測試
重新啟動你的服務：
```bash
docker compose up
```

接著，訪問 `http://localhost:3000`，點擊 `/user-service`、`/product-service`、`/order-service` 和 `/payment-service` 的連結，這些路徑將會代理到 `http://localhost:3001`、`http://localhost:3002`、`http://localhost:3003` 和 `http://localhost:3004`，分別指向各自的微服務。

1. **在同一台主機上使用 HTTP 協定的原因**：
   即便所有微服務都部署在同一台主機上，使用 HTTP 協定仍然是標準做法。主要原因是：
   - **一致性**：HTTP 是一種通用的協定，支援伺服器之間的通訊，不論是跨主機還是同一主機。
   - **代理需求**：微服務架構中，代理（proxy）和負載均衡器通常用於管理流量。在這些情境下，即使是本地主機上的服務，HTTP 協定仍可確保代理的正確運行。
   - **便於日後擴展**：若未來將這些微服務遷移到不同的主機或容器上，使用 HTTP 可以確保最小的變動。

   如果是不同主機之間的通訊，則建議在 HTTP 的基礎上，進一步考慮使用 HTTPS 來保護資料。

2. **`changeOrigin: true` 的作用**：
   - `changeOrigin: true` 用於 HTTP 代理設置中，讓代理請求改變來源（origin）標頭，使之顯示為目標伺服器的 URL，而不是原始請求的 URL。
   - 當啟用 `changeOrigin: true` 時，代理會將來源標頭改為代理的目標，這樣目標伺服器會認為請求是直接從代理伺服器發出的，而非原始客戶端，這在跨域請求和某些伺服器驗證中很有用。

   例如：
   - 如果 `changeOrigin` 設為 `true`，則代理請求中的 `Host` 標頭將顯示為目標伺服器（如 `http://localhost:3001`），而非原始的 `http://localhost:3000`。