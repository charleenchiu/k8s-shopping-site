const express = require('express');
const app = express();
const host = process.env.HOST || 'localhost'; // 設定伺服器主機名稱，從環境變數讀取，若未設定則預設為 'localhost'
const port = process.env.PORT || 3004; // 每個服務使用不同的端口

app.get('/', (req, res) => {
    res.send('Hi, this is payment-service!');
});

// 啟動伺服器
app.listen(port, host, () => {
    console.log(`Payment Service listening at http://${host}:${port}`);
});

