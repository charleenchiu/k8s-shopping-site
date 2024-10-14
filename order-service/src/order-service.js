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
import { getOrdersUrl } from '../../config.js'; // 從 config.js 中引入 getOrdersUrl函數
//#endregion

const app = express(); // 創建一個 Express 應用

app.use(express.json()); // 使用 JSON 中介軟體來解析 JSON 請求

// 獲取所有訂單
app.get('/orders', async (req, res) => {
    try {
        const [orders] = await promisePool.query('SELECT * FROM orders');
        res.json(orders);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 獲取指定的一筆訂單
app.get('/orders/:id', async (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    try {
        const [order] = await promisePool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (order.length === 0) {
            return res.status(404).send('Order not found');
        }
        res.json(order[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 新增訂單
app.post('/orders', async (req, res) => {
    const { userId, orderTime, details } = req.body;
    try {
        const [orderResult] = await promisePool.query('INSERT INTO orders (userId, orderTime) VALUES (?, ?)', [userId, orderTime]);
        const orderId = orderResult.insertId;

        for (const detail of details) {
            const { productId, quantity } = detail;
            await promisePool.query('INSERT INTO orderDetails (orderId, productId, quantity) VALUES (?, ?, ?)', [orderId, productId, quantity]);
        }

        res.status(201).json({ id: orderId, userId, orderTime, details });
    } catch (err) {
        res.status(500).send(err);
    }
});

// 更新訂單
app.put('/orders/:id', async (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    const { userId, orderTime, details } = req.body;
    try {
        await promisePool.query('UPDATE orders SET userId = ?, orderTime = ? WHERE id = ?', [userId, orderTime, orderId]);

        await promisePool.query('DELETE FROM orderDetails WHERE orderId = ?', [orderId]);
        for (const detail of details) {
            const { productId, quantity } = detail;
            await promisePool.query('INSERT INTO orderDetails (orderId, productId, quantity) VALUES (?, ?, ?)', [orderId, productId, quantity]);
        }

        res.json({ id: orderId, userId, orderTime, details });
    } catch (err) {
        res.status(500).send(err);
    }
});

// 刪除訂單
app.delete('/orders/:id', async (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    try {
        await promisePool.query('DELETE FROM orderDetails WHERE orderId = ?', [orderId]);
        await promisePool.query('DELETE FROM orders WHERE id = ?', [orderId]);

        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

// 啟動伺服器，並監聽指定的埠號
app.listen(process.env.ORDER_SERVICE_PORT, () => {
    console.log(`Order service listening at ${process.env.ORDER_SERVICE_PORT} and URL is ${getOrdersUrl()}`); // 使用 getOrdersUrl 函數獲取訂單 API 的 URL
});

export default app;
