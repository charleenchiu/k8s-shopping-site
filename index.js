const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 3000; // 根目錄的網站入口

// 設定環境變數：本地和 EKS 環境的不同微服務 URL
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3001';
const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://order-service:3003';
const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3004';

// 根目錄，顯示各微服務的 URL
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

/*
// 使用 http-proxy-middleware 來代理請求至 Kubernetes 內部的 ClusterIP 服務
app.use('/user-service', createProxyMiddleware({ target: 'http://user-service.default.svc.cluster.local:3001', changeOrigin: true }));
app.use('/product-service', createProxyMiddleware({ target: 'http://product-service.default.svc.cluster.local:3002', changeOrigin: true }));
app.use('/order-service', createProxyMiddleware({ target: 'http://order-service.default.svc.cluster.local:3003', changeOrigin: true }));
app.use('/payment-service', createProxyMiddleware({ target: 'http://payment-service.default.svc.cluster.local:3004', changeOrigin: true }));
*/

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
app.listen(port, '0.0.0.0', () => {
    console.log(`Index Page listening at http://0.0.0.0:${port}`);
});