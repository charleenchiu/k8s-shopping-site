# =======如果原本沒有web-client目錄==================================================
# 在web-client/目錄下建立使用Bootstrap、Bootstrap Table、React.js和AJAX的購物網站。

## 1. 設定React專案
首先，確保你已經安裝了create-react-app：
```sh
npx create-react-app web-client
cd web-client
```

## 2. 安裝必要的依賴項
安裝Bootstrap、Bootstrap Table和Axios（用於AJAX請求）：
```sh
npm install bootstrap bootstrap-table-next axios
```

## 3. 在專案中引入Bootstrap
在src/index.js中引入Bootstrap的CSS：
```jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
```

## 4. 創建必要的頁面和元件
創建以下頁面和元件：

- 登入頁(LoginPage)

- 資料新增、修改、刪除頁面(CRUDPage)

- 其他你需要的頁面

### 每個 API 的 src/index.js
不一定每個 API 的 src/ 資料夾內都要有一個 index.js，但是每個服務都需要一個主進入點文件，這通常是 index.js。這個文件負責設定和啟動你的 Express 伺服器，並定義所有的路由和中介軟體。基本上，它就是那個讓你的服務跑起來的文件。

例如，在 user-service/src/index.js 中，你可能會有以下內容：

```javascript
import express from 'express';
const app = express();
const port = 3001;

app.use(express.json());

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // 這裡添加你的使用者身份驗證邏輯
    if (username === 'admin' && password === 'password') {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`User service listening at http://localhost:${port}`);
});
```

這個文件的作用包括：

設定 Express 應用程式：導入並設置 Express 伺服器，啟用中介軟體（如 express.json()）。

定義路由：指定應用程式如何處理不同的 HTTP 請求。例如，登入請求將由 /api/login 路由處理。

啟動伺服器：設定伺服器監聽的埠號並啟動伺服器。

每個 API 服務都會有一個類似的進入點文件，用來處理特定的功能和路由。例如，product-service 會處理與產品相關的請求，order-service 會處理訂單相關的請求，等等。

### LoginPage
創建src/LoginPage.js：
```jsx
import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/login', { username, password });
            if (response.data.success) {
                // 登入成功，重定向到CRUDPage
                window.location.href = '/crud';
            } else {
                alert('登入失敗');
            }
        } catch (error) {
            console.error('登入錯誤', error);
        }
    };

    return (
        <div className="container">
            <h2>登入</h2>
            <form>
                <div className="form-group">
                    <label>使用者名</label>
                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>密碼</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="button" className="btn btn-primary" onClick={handleLogin}>登入</button>
            </form>
        </div>
    );
};

export default LoginPage;
```

### CRUDPage
創建src/CRUDPage.js：
```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';

// 定義 ProductCRUDPage 元件
const ProductCRUDPage = () => {
    // 定義狀態變數：data 和 formData
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({ name: '', price: '' });

    // 使用 useEffect 在元件掛載時獲取資料
    useEffect(() => {
        fetchData();
    }, []);

    // 設定 API 的 URL，指向 EC2 伺服器上的 product-service 容器
    const url = 'http://your-ec2-ip:3002/api/products';

    // 獲取資料的函數
    const fetchData = async () => {
        try {
            // 發送 GET 請求到 API 以獲取產品資料
            const response = await axios.get(url);
            // 設定獲取到的資料到狀態中
            setData(response.data);
        } catch (error) {
            // 錯誤處理，輸出錯誤訊息
            console.error('獲取資料錯誤', error);
        }
    };

    // 新增資料的函數
    const handleAdd = async () => {
        try {
            // 發送 POST 請求到 API 以新增產品
            await axios.post(url, formData);
            // 獲取最新的資料
            fetchData();
            // 清空表單資料
            setFormData({ name: '', price: '' });
        } catch (error) {
            // 錯誤處理，輸出錯誤訊息
            console.error('新增資料錯誤', error);
        }
    };

    // 更新資料的函數
};

    const handleUpdate = async (id) => {
        try {
            await axios.put(`${url}/${id}`, formData);
            fetchData();
        } catch (error) {
            console.error('更新資料錯誤', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${url}/${id}`);
            fetchData();
        } catch (error) {
            console.error('刪除資料錯誤', error);
        }
    };

    return (
        <div className="container">
            <h2>管理產品</h2>
            <form>
                <div className="form-group">
                    <label>名稱</label>
                    <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>價格</label>
                    <input type="text" className="form-control" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <button type="button" className="btn btn-primary" onClick={handleAdd}>新增</button>
            </form>
            <BootstrapTable keyField='id' data={data} columns={[
                { dataField: 'id', text: 'ID' },
                { dataField: 'name', text: '名稱' },
                { dataField: 'price', text: '價格' },
                {
                    dataField: 'actions',
                    text: '操作',
                    formatter: (cellContent, row) => (
                        <div>
                            <button onClick={() => handleUpdate(row.id)} className="btn btn-warning">修改</button>
                            <button onClick={() => handleDelete(row.id)} className="btn btn-danger">刪除</button>
                        </div>
                    )
                }
            ]} />
        </div>
    );
};

export default CRUDPage;
```

## 5. 設定路由
在web-client/src/App.js中設定路由：
```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './LoginPage';
import CRUDPage from './CRUDPage';

const App = () => (
    <Router>
        <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/crud" component={CRUDPage} />
            <Route path="/" component={LoginPage} />
        </Switch>
    </Router>
);

export default App;
```

## 6. 更新public/index.html
確保你在public/index.html中加入Bootstrap的CSS：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
    <title>購物網站</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

這樣基本上就可以搭建一個包含登入頁、資料新增、修改、刪除頁面的購物網站。如果有更多頁面的需求，可以依照這樣的方式繼續添加。



# =======如果原本有web-client目錄==================================================
# 在保留現有web-client目錄的前提下，完成React專案的設置並引入必要的依賴項
如果你已經有一個web-client目錄，那麼在同一位置執行npx create-react-app web-client將會導致目錄被覆蓋，原有內容會丟失。
為了避免這種情況，你可以在原有的web-client目錄內手動添加React、Bootstrap、Bootstrap Table和Axios。
以下是步驟：

1.進入現有的web-client目錄：
```sh
cd /path/to/```shoppingSite/web-client
```

2.初始化React專案： 如果你已經有package.json文件，可以跳過這一步。否則，運行以下命令初始化：
```sh
npm init -y
```

3.安裝React、Bootstrap、Bootstrap Table和Axios：
清理 npm 緩存：有時候緩存中的數據可能會導致問題，你可以清理 npm 緩存並再次安裝：
```sh
npm cache clean --force
```

```sh
# npm install react react-dom bootstrap bootstrap-table-next axios
# npm install react react-dom bootstrap react-bootstrap-table-next axios
npm install react@16.14.0 react-dom@16.14.0 bootstrap react-bootstrap-table-next axios
# npm install react-table bootstrap axios


```

4.創建React應用程式結構： 在web-client目錄下創建src資料夾，並在其中創建index.js和其他必要的React組件，如LoginPage.js和CRUDPage.js。

5.App.js：這個文件負責定義應用程式的主要結構和路由：
```jsx
// 引入 React 框架
import React from 'react';
// 引入 React Router 組件進行路由處理
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// 引入自定義的 LoginPage 和 CRUDPage 組件
import LoginPage from './components/LoginPage/LoginPage';
import UserCRUDPage from './components/UserCRUDPage/UserCRUDPage';
import ProductCRUDPage from './components/ProductCRUDPage/ProductCRUDPage';
import OrderCRUDPage from './components/OrderCRUDPage/OrderCRUDPage';
import PaymentCRUDPage from './components/PaymentCRUDPage/PaymentCRUDPage';

// 定義一個名為 App 的函數式元件
const App = () => (
    // 使用 React Router 進行路由處理
    <Router>
        {/* Switch 組件用於逐一匹配路由 */}
        <Switch>
            {/* 當路徑為 /login 時，渲染 LoginPage 組件 */}
            <Route path="/login" component={LoginPage} />
            {/* 當路徑為 /users 時，渲染 UserCRUDPage 組件 */}
            <Route path="/users" component={UserCRUDPage} />
            {/* 當路徑為 /products 時，渲染 ProductCRUDPage 組件 */}
            <Route path="/products" component={ProductCRUDPage} />
            {/* 當路徑為 /orders 時，渲染 OrderCRUDPage 組件 */}
            <Route path="/orders" component={OrderCRUDPage} />
            {/* 當路徑為 /payments 時，渲染 PaymentCRUDPage 組件 */}
            <Route path="/payments" component={PaymentCRUDPage} />
            {/* 當路徑為 / 時，渲染 LoginPage 組件 */}
            <Route path="/" component={LoginPage} />
        </Switch>
    </Router>
);

export default App;
```
6.index.js：這個文件負責渲染 App 元件到 DOM 中：
```jsx
// 引入 React 框架
import React from 'react';
// 引入新的 createRoot API
import { createRoot } from 'react-dom/client';
// 引入 Bootstrap 和 React Bootstrap Table 的 CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
// 引入 App 元件
import App from './App';

// 使用新的 createRoot API 來渲染元件
const container = document.getElementById('root'); // 獲取 HTML 中 id 為 root 的 DOM 元素
const root = createRoot(container); // 創建一個新的根元素
root.render(<App />); // 將 App 元件渲染到根元素
```
