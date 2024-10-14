// src/App.js
import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './LoginPage.js';
import OrderCRUDPage from './components/OrderCRUDPage/OrderCRUDPage.js';
import PaymentCRUDPage from './components/PaymentCRUDPage/PaymentCRUDPage.js';
import ProductCRUDPage from './components/ProductCRUDPage/ProductCRUDPage.js';
import UserCRUDPage from './components/UserCRUDPage/UserCRUDPage.js';

const App = () => (
    <Router>
        <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/orders" component={OrderCRUDPage} />
            <Route path="/payments" component={PaymentCRUDPage} />
            <Route path="/products" component={ProductCRUDPage} />
            <Route path="/users" component={UserCRUDPage} />
            <Route path="/" component={LoginPage} />
        </Switch>
    </Router>
);

export default App;
