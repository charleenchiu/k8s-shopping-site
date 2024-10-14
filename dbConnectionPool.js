import mysql from 'mysql2';

//#region 取得全域變數
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 取得當前文件的絕對路徑 (__dirname 的替代方案)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 使用絕對路徑加載 .env 文件
dotenv.config({ path: join(__dirname, './.env') });
//#endregion

// 建立MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.EC2_PRIVATE_IP,
    user: 'root',
    password: 'mysql',
    database: 'ShoppingSiteDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0    
});

// 簡化 Connection Pool的使用
const promisePool = pool.promise();

// 將 promisePool 導出為預設導出
export default promisePool;