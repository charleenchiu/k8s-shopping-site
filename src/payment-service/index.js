const express = require('express');
const app = express();
const port = 3004; // 每個服務使用不同的端口

app.get('/', (req, res) => {
    res.send('Hi, this is payment-service!');
});

app.listen(port, () => {
    console.log(`Payment Service listening at http://localhost:${port}`);
});
