const express = require('express');
const app = express();
const port = process.env.PORT || 3003; // 每個服務使用不同的端口

app.get('/', (req, res) => {
    res.send('Hi, this is order-service!');
});

// 啟動伺服器
app.listen(port, 'order-service', () => {
    console.log(`Order Service listening at http://order-service:${port}`);
});