// 引入 React 框架和 useState Hook
import React, { useState } from 'react';
// 引入 Axios 庫，用於發送 HTTP 請求
import axios from 'axios';

console.log("當前檔案所在的目錄:", __dirname);
console.log("當前檔案的完整路徑:", __filename);


// 定義 LoginPage 元件
const LoginPage = () => {
    // 使用 useState Hook 定義兩個狀態變數：username 和 password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // 處理登入的函數
    const handleLogin = async () => {
        try {
            // 發送 POST 請求到 /api/login，帶上使用者名和密碼
            const response = await axios.post('/api/login', { username, password });
            if (response.data.success) {
                // 登入成功，重新導向到 CRUDPage
                window.location.href = '/crud';
            } else {
                alert('登入失敗');
            }
        } catch (error) {
            // 捕捉並輸出登入錯誤
            console.error('登入錯誤', error);
        }
    };

    return (
        // 使用 Bootstrap 樣式
        <div className='container'>
            <h2>登入</h2>
            <form>
                <div className="form-group">
                    <label>使用者名：admin</label>
                    {/* 輸入框綁定 username 狀態 */}
                    <input type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>密碼：password</label>
                    {/* 輸入框綁定 password 狀態 */}
                    <input type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                {/* 登入按鈕 */}
                <button type='button'
                    className='btn btn-primary'
                    onClick={handleLogin}>登入</button>
            </form>
        </div>
    );
};

// 匯出 LoginPage 元件
export default LoginPage;
