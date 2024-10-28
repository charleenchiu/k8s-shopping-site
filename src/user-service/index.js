const express = require('express');
const app = express();
const port = 3001; // 每個服務使用不同的端口

app.get('/', (req, res) => {
    res.send('Hi, this is user-service!');
});

app.listen(port, () => {
    console.log(`User Service listening at http://localhost:${port}`);
});
