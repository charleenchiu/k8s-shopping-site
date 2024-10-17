const express = require('express');
const app = express();
const port = 3003; // 每個服務使用不同的端口

app.get('/', (req, res) => {
    res.send('Hi, this is order-service!');
});

app.listen(port, () => {
    console.log(`Order Service listening at http://localhost:${port}`);
});
