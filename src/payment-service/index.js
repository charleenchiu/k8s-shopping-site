const express = require('express');
const app = express();
const port = process.env.PORT || 3004; // 每個服務使用不同的端口

app.get('/', (req, res) => {
    res.send('Hi, this is payment-service!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Payment Service listening at http://0.0.0.0:${port}`);
});
