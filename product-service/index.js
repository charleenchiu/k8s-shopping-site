const express = require('express');
const app = express();
const port = 3002; // 每個服務使用不同的端口

app.get('/', (req, res) => {
    res.send('Hi, this is product-service!');
});

app.listen(port, () => {
    console.log(`Product Service listening at http://localhost:${port}`);
});
