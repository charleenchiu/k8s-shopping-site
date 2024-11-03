const express = require('express');
const app = express();
const port = process.env.PORT || 3002; // 每個服務使用不同的端口

app.get('/', (req, res) => {
    res.send('Hi, this is product-service!');
});

app.listen(port, 'product-service', () => {
    console.log(`Product Service listening at http://product-service:${port}`);
});
