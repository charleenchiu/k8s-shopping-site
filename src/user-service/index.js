const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // 每個服務使用不同的端口

app.get('/', (req, res) => {
    res.send('Hi, this is user-service!');
});

app.listen(port, 'user-service', () => {
    console.log(`User Service listening at http://user-service:${port}`);
});
