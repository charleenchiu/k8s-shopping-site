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
import { getProductsUrl } from '../../config.js'; // 從 config.js 中引入 getProductsUrl函數
//#endregion

const app = express(); // 創建一個 Express 應用

app.use(express.json()); // 使用 JSON 中介軟體來解析 JSON 請求

// 獲取所有商品
app.get('/products', async(req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM products');
        if (rows.length === 0) return res.status(404).send('Product not found');
        res.json(rows);

    } catch (err) {
        res.status(500).send('Database error');
    }
});

// 獲取單個商品
app.get('/products/:id', async(req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT * FROM products 
                WHERE id = ?
            `,[req.params.id]);
        if (rows.length === 0) return res.status(404).send('Product not found');
        res.json(rows[0]);

    } catch (err) {
        res.status(500).send('Database error');
    }
});

// 新增商品
app.post('/products', async (req, res) => {
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();
        const {name,price} = req.body;
        const [result] = await connection.query(`
            INSERT INTO products (name,price) 
                VALUES (?,?)
            `,[name,price]);
        const newProduct = {id:result.insertId, name, price};
        await connection.commit();
        res.status(201).json(newProduct);
    } catch (err) {
        await connection.rollback();
        res.status(500).send('Database error');
    } finally {
        connection.release();
    }
});

// 更新商品
app.put('/products/:id', async (req, res) => {
    const connection  = await promisePool.getConnection();
    try {
        await connection.beginTransaction();
        const {name,price} = req.body;
        const [result] = await connection.query(
            `UPDATE products SET name = ?, price = ? 
                WHERE id = ?`
            ,[name, price, req.params.id]);

        await connection.commit();
        res.json({id:req.params.id, name, price});
    } catch (err) {
        await connection.rollback();
        res.status(500).send('Database error');
    } finally {
        connection.release();
    }
});

// 刪除商品
app.delete('/products/:id', async (req, res) => {
    const connection  = await promisePool.getConnection();
    try {
        await connection.beginTransaction();
        const [result] = await connection.query(`
            DELETE FROM products 
                WHERE id = ?
            `,[req.params.id]);
        if (result.affectedRows===0){
            await connection.rollback();
            return res.status(404).send('Product not found');
        }
        await connection.commit();
        res.status(204).send();
    } catch (err) {
        await connection.rollback();
        res.status(500).send('Database error');
    } finally {
        connection.release();
    }    
});

// 啟動伺服器，並監聽指定的埠號
app.listen(process.env.PRODUCT_SERVICE_PORT, () => {
    console.log(`Product service listening at ${process.env.PRODUCT_SERVICE_PORT} and URL is ${getProductsUrl()}`); // 使用 getProductsUrl 函數獲取訂單 API 的 URL
});

// 將 app 導出為預設導出
export default app;