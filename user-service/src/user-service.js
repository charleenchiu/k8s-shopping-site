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
import { getUsersUrl } from '../../config.js'; // 從 config.js 中引入 getUsersUrl函數
//#endregion

const app = express(); // 創建一個 Express 應用

// 定義路由，取得所有使用者資料
app.get('/users', async (req, res) => {
    try {
        const [rows, fields] = await promisePool.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 定義路由，透過 ID 取得特定使用者資料
app.get('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    try {
        const [rows, fields] = await promisePool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).send('User not found');
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 啟動伺服器，並監聽指定的埠號
app.listen(process.env.USER_SERVICE_PORT, () => {
    console.log(`User service listening at ${process.env.USER_SERVICE_PORT} and URL is ${getUsersUrl()}`); // 使用 getUsersUrl 函數獲取訂單 API 的 URL
});

export default app;
