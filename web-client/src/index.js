import React from 'react';
import ReactDOM from 'react-dom/client'; // 使用 'react-dom/client'
//import './styles.css'; // 假設您有 CSS 檔案

const App = () => {
  return (
    <div>
      <h1>Welcome to the Shopping Site!</h1>
      <p>This is a simple React application.</p>
    </div>
  );
};

// 使用 createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); // 使用 render 方法來渲染應用程式
