import mysql from 'mysql2';

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

// 建立資料庫連線池
const pool = mysql.createPool({
    host: process.env.EC2_PRIVATE_IP,
    user: 'root',
    password: 'mysql',
    database: 'ShoppingSiteDB',
});

const promisePool = pool.promise();

// 測試連接的自執行異步函數
(async () => {
    try {
        const [rows, fields] = await promisePool.query('SELECT 1');
        console.log('Query result:', rows); // 應該回傳 [{ '1': 1 }]
    } catch (error) {
        console.error('Database connection error:', error);
    }
})();
