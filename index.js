const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 3000; // 根目錄的網站入口

// 設定環境變數：本地和 EKS 環境的不同微服務 URL
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3001';
const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://order-service:3003';
const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3004';

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
app.use('/user-service', createProxyMiddleware({ 
    target: userServiceUrl, 
    changeOrigin: true, 
    pathRewrite: { '^/user-service': '/' },  // 重寫路徑
    logLevel: 'debug' 
}));
app.use('/product-service', createProxyMiddleware({ 
    target: productServiceUrl, 
    changeOrigin: true, 
    pathRewrite: { '^/product-service': '/' }, 
    logLevel: 'debug' 
}));
app.use('/order-service', createProxyMiddleware({ 
    target: orderServiceUrl, 
    changeOrigin: true, 
    pathRewrite: { '^/order-service': '/' }, 
    logLevel: 'debug' 
}));
app.use('/payment-service', createProxyMiddleware({ 
    target: paymentServiceUrl, 
    changeOrigin: true, 
    pathRewrite: { '^/payment-service': '/' }, 
    logLevel: 'debug' 
}));

// 啟動伺服器
app.listen(port, () => {
    console.log(`Index Page listening at http://localhost:${port}`);
});
