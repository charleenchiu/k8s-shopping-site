// src/components/CRUDPage.js

import React from 'react';
import { Link } from 'react-router-dom';

const CRUDPage = () => {
    return (
        <div>
            <h2>選擇要管理的項目</h2>
            <ul>
                <li><Link to="/orders">訂單管理</Link></li>
                <li><Link to="/payments">付款管理</Link></li>
                <li><Link to="/products">產品管理</Link></li>
                <li><Link to="/users">使用者管理</Link></li>
            </ul>
        </div>
    );
};

export default CRUDPage;
