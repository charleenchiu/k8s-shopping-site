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
app.listen(port, () => {
    console.log(`Index Page listening at http://localhost:${port}`);
});
