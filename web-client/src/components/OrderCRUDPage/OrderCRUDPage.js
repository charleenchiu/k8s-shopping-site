import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';

//#region 取得全域變數
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 取得當前文件的絕對路徑 (__dirname 的替代方案)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 使用絕對路徑加載 .env 文件
dotenv.config({ path: join(__dirname, '../../../../.env') });
import { getOrdersUrl } from '../../../../config.js'; // 從 config.js 中引入 getProductsUrl函數
//#endregion

// 設定 API 的 URL，指向 EC2 伺服器上的 order-service 容器
const url = getOrdersUrl();

// 定義 OrderCRUDPage 元件
const OrderCRUDPage = () => {
    // 使用 useState 定義狀態變數 orders 和 formData
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({
        userId: '',
        orderTime: '',
        details: [{ productId: '', quantity: '' }]
    });

    // 使用 useEffect 在元件掛載時獲取資料
    useEffect(() => {
        fetchOrders();
    }, []);

    //#region 處理 order
    // 處理 order 時要向伺服器發送請求並等待回應，故使用 async 和 await 處理異步操作。
    const fetchOrders = async () => {
        try {
            const response = await axios.get(url);
            setOrders(response.data);
        } catch (error) {
            console.error('獲取訂單資料錯誤', error);
        }
    };

    // 新增訂單
    const handleAdd = async () => {
        try {
            await axios.post(url, formData);
            fetchOrders();
            setFormData({ userId: '', orderTime: '', details: [{ productId: '', quantity: '' }] });
        } catch (error) {
            console.error('新增訂單錯誤', error);
        }
    };

    // 更新訂單
    const handleUpdate = async (id) => {
        try {
            await axios.put(`${url}/${id}`, formData);
            fetchOrders();
        } catch (error) {
            console.error('更新訂單錯誤', error);
        }
    };

    // 刪除訂單
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${url}/${id}`);
            fetchOrders();
        } catch (error) {
            console.error('刪除訂單錯誤', error);
        }
    };
    //#endregion

    //#region 處理 orderDetail
    // handleDetailChange、addDetailRow 和 removeDetailRow 是用於處理本地狀態的函數，這些操作不需要與伺服器通信，它們只是修改存在於記憶體中的變數。所以不需要使用 async。
    const handleDetailChange = (index, key, value) => {
        const newDetails = formData.details.map((detail, i) => (
            i === index ? { ...detail, [key]: value } : detail
        ));
        setFormData({ ...formData, details: newDetails });
    };

    // 新增詳情行
    const addDetailRow = () => {
        setFormData({ ...formData, details: [...formData.details, { productId: '', quantity: '' }] });
    };

    // 刪除詳情行
    const removeDetailRow = (index) => {
        const newDetails = formData.details.filter((_, i) => i !== index);
        setFormData({ ...formData, details: newDetails });
    };
    //#endregion 

    return (
        <div className='container'>
            <h2>管理訂單</h2>
            <form>
                <div className='form-group'>
                    <label>使用者 ID</label>
                    <input type='text'
                        className='form-control'
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    />
                </div>
                <div className='form-group'>
                    <label>訂單建立時間</label>
                    <input type='text'
                        className='form-control'
                        value={formData.orderTime}
                        onChange={(e) => setFormData({ ...formData, orderTime: e.target.value })}
                    />
                </div>
                {formData.details.map((detail, index) => (
                    <div key={index} className='form-group'>
                        <label>產品 ID</label>
                        <input type='text'
                            className='form-control'
                            value={detail.productId}
                            onChange={(e) => handleDetailChange(index, 'productId', e.target.value)}
                        />
                        <label>數量</label>
                        <input type='text'
                            className='form-control'
                            value={detail.quantity}
                            onChange={(e) => handleDetailChange(index, 'quantity', e.target.value)}
                        />
                        <button type='button'
                            onClick={() => removeDetailRow(index)}
                        >刪除此行</button>
                    </div>
                ))}
                <button type='button' onClick={addDetailRow}>新增詳情行</button>
                <button type='button' className='btn btn-primary' onClick={handleAdd}>新增訂單</button>
            </form>
            <BootstrapTable keyField='id' data={orders}
                columns={[
                    { dataField: 'id', text: 'ID' },
                    { dataField: 'userId', text: '使用者 ID' },
                    { dataField: 'orderTime', text: '訂單建立時間' },
                    {
                        dataField: 'details', text: '詳情',
                        formatter: (cell, row) => (
                            <ul>
                                {row.details.map((detail, index) => (
                                    <li key={index}>{detail.productId} - {detail.quantity}</li>
                                ))}
                            </ul>
                        )
                    },
                    {
                        dataField: 'actions', text: '操作',
                        formatter: (cell, row) => (
                            <div>
                                <button onClick={() => handleUpdate(row.id)}
                                    className='btn btn-warning'>修改</button>
                                <button onClick={() => handleDelete(row.id)}
                                    className='btn btn-danger'>刪除</button>
                            </div>
                        )
                    }
                ]}
            />
        </div>
    );
};

export default OrderCRUDPage;
