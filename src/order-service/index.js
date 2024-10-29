const express = require('express');
const app = express();
const port = 3003; // 每個服務使用不同的端口

app.get('/', (req, res) => {
    res.send('Hi, this is order-service!');
});

// 啟動伺服器
app.listen(port, '0.0.0.0', () => {
    console.log(`Order Service listening at http://0.0.0.0:${port}`);
});