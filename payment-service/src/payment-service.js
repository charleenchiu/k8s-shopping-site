import express from 'express';  // 引入 Express 框架
import promisePool from '../../dbConnectionPool.js'; // 從上上層目錄引入 Connection Pool 模組

//#region 取得全域變數
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 取得當前文件的絕對路徑 (__dirname 的替代方案)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 使用絕對路徑加載 .env 文件
dotenv.config({ path: join(__dirname, '../../.env') });
import { getPaymentsUrl } from '../../config.js'; // 從 config.js 中引入 getPaymentsUrl函數
//#endregion

const app = express(); // 創建一個 Express 應用

app.use(express.json()); // 使用 JSON 中介軟體來解析 JSON 請求

// 獲取所有付款
app.get('/payments', async (req, res) => {
    try {
        const [payments] = await promisePool.query('SELECT * FROM payments');
        res.json(payments);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 獲取指定的一筆付款
app.get('/payments/:id', async (req, res) => {
    const paymentId = parseInt(req.params.id, 10);
    try {
        const [payment] = await promisePool.query('SELECT * FROM payments WHERE id = ?', [paymentId]);
        if (payment.length === 0) {
            return res.status(404).send('Payment not found');
        }
        res.json(payment[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 新增付款
app.post('/payments', async (req, res) => {
    const { orderId, amount } = req.body;
    try {
        const [paymentResult] = await promisePool.query('INSERT INTO payments (orderId, amount) VALUES (?, ?)', [orderId, amount]);
        const paymentId = paymentResult.insertId;
        res.status(201).json({ id: paymentId, orderId, amount });
    } catch (err) {
        res.status(500).send(err);
    }
});

// 更新付款
app.put('/payments/:id', async (req, res) => {
    const paymentId = parseInt(req.params.id, 10);
    const { orderId, amount } = req.body;
    try {
        await promisePool.query('UPDATE payments SET orderId = ?, amount = ? WHERE id = ?', [orderId, amount, paymentId]);
        res.json({ id: paymentId, orderId, amount });
    } catch (err) {
        res.status(500).send(err);
    }
});

// 刪除付款
app.delete('/payments/:id', async (req, res) => {
    const paymentId = parseInt(req.params.id, 10);
    try {
        await promisePool.query('DELETE FROM payments WHERE id = ?', [paymentId]);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

// 啟動伺服器，並監聽指定的埠號
app.listen(process.env.PAYMENT_SERVICE_PORT, () => {
    console.log(`Payment service listening at ${process.env.PAYMENT_SERVICE_PORT} and URL is ${getPaymentsUrl()}`); // 使用 getPaymentsUrl 函數獲取訂單 API 的 URL
});

export default app;
