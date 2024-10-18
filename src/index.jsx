import React from 'react';
import ReactDOM from "react-dom/client";
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// 注册服务工作线程
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js')
            .then((registration) => {
                console.log('服务工作线程注册成功:', registration);
            })
            .catch((error) => {
                console.log('服务工作线程注册失败:', error);
            });
    });
}

