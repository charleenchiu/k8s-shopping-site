const express = require('express');
const app = express();
const port = process.env.PORT || 3004; // 每個服務使用不同的端口

app.get('/', (req, res) => {
    res.send('Hi, this is payment-service!');
});

app.listen(port, 'payment-service', () => {
    console.log(`Payment Service listening at http://payment-service:${port}`);
});
