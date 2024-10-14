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

// 定義資料庫名稱變數
const dbName = 'ShoppingSiteDB';

console.log(process.env.EC2_PRIVATE_IP);

const connection = mysql.createConnection({
    host: process.env.EC2_PRIVATE_IP,
    user: 'root',
    password: 'mysql',
});

connection.connect();

// 創建資料庫
connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err, result) => {
    if (err) throw err;
    console.log('Database created');
});

// 選擇資料庫
connection.query(`USE ${dbName}`, (err, result) => {
    if (err) throw err;
    console.log('Database selected');
});

// 創建客戶資料表
connection.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )
`, (err, result) => {
    if (err) throw err;
    console.log('Table created');
});

// 創建商品資料表
connection.query(`
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL
    )
`, (err, result) => {
    if (err) throw err;
    console.log('Table created');
});

// 創建訂單細項資料表
connection.query(`
    CREATE TABLE IF NOT EXISTS orderDetails (
        id INT AUTO_INCREMENT PRIMARY KEY,
        productId INT NOT NULL,
        quantity INT NOT NULL,
        FOREIGN KEY (productId) REFERENCES products(id)
    )
`, (err, result) => {
    if (err) throw err;
    console.log('Table created');
});

// 創建訂單資料表
connection.query(`
    CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        orderTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        orderDetailId INT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (orderDetailId) REFERENCES orderDetails(id)
    )
`, (err, result) => {
    if (err) throw err;
    console.log('Table created');
});

// 創建付款資料表
connection.query(`
    CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderId INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders(id)
    )
`, (err, result) => {
    if (err) throw err;
    console.log('Table created');
});

// 結束資料庫連線
connection.end();
