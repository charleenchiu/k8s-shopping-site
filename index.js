const express = require('express');
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
app.listen(port, () => {
    console.log(`Index Page listening at http://localhost:${port}`);
});
