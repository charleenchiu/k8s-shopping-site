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
import { getUsersUrl } from '../../../../config.js'; // 從 config.js 中引入 getUsersUrl函數
//#endregion

// 設定 API 的 URL，指向 EC2 伺服器上的 user-service 容器
const url = getUsersUrl();

// 定義 UserCRUDPage 元件
const UserCRUDPage = () => {
    // 定義狀態變數：data 和 formData
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({ name: '' });

    // 使用 useEffect 在元件掛載時獲取資料
    useEffect(() => {
        fetchData();
    }, []);

    // 獲取資料的函數
    const fetchData = async () => {
        try {
            // 發送 GET 請求到 API 以獲取使用者資料
            const response = await axios.get(url);
            // 設定獲取到的資料到狀態中
            setData(response.data);
        } catch (error) {
            // 錯誤處理，輸出錯誤訊息
            console.error('獲取使用者資料錯誤', error);
        }
    };

    // 新增資料的函數
    const handleAdd = async () => {
        try {
            // 發送 POST 請求到 API 以新增使用者
            await axios.post(url, formData);
            // 獲取最新的資料
            fetchData();
            // 清空表單資料
            setFormData({ name: '' });
        } catch (error) {
            // 錯誤處理，輸出錯誤訊息
            console.error('新增使用者資料錯誤', error);
        }
    };

    // 更新資料的函數
    const handleUpdate = async (id) => {
        try {
            // 發送 PUT 請求到 API 以更新指定 ID 的使用者
            await axios.put(`${url}/${id}`, formData);
            // 獲取最新的資料
            fetchData();
        } catch (error) {
            // 錯誤處理，輸出錯誤訊息
            console.error('更新使用者資料錯誤', error);
        }
    };

    // 刪除資料的函數
    const handleDelete = async (id) => {
        try {
            // 發送 DELETE 請求到 API 以刪除指定 ID 的使用者
            await axios.delete(`${url}/${id}`);
            // 獲取最新的資料
            fetchData();
        } catch (error) {
            // 錯誤處理，輸出錯誤訊息
            console.error('刪除使用者資料錯誤', error);
        }
    };

    return (
        <div className='container'>
            <h2>管理使用者</h2>
            <form>
                <div className='form-group'>
                    <label>名稱</label>
                    <input type='text'
                        className='form-control'
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })} />
                </div>
                <button type="button"
                    className='btn btn-primary'
                    onClick={handleAdd}>新增</button>
            </form>
            <BootstrapTable keyField='id' data={data}
                columns={[
                    { dataField: 'id', text: 'ID' },
                    { dataField: 'name', text: '名稱' },
                    {
                        dataField: 'actions', text: '操作',
                        formatter: (cellContent, row) => (
                            <div>
                                <button onClick={() => handleUpdate(row.id)}
                                    className='btn btn-warning'>修改</button>
                                <button onClick={() => handleDelete(row.id)}
                                    className='btn btn-danger'>刪除</button>
                            </div>
                        )
                    }
                ]} />
        </div>
    );
};

export default UserCRUDPage;
