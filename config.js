//#region 取得全域變數
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 取得當前文件的絕對路徑 (__dirname 的替代方案)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 使用絕對路徑加載 .env 文件
dotenv.config({ path: join(__dirname, '.env') });
//#endregion

// 定義取得使用者URL的函數
const getUsersUrl = () => {
    const local_url = "/users"; // 定義本地URL
    if (process.env.USE_CONTAINER) { // 檢查是否在容器環境中
        // 返回完整的URL，包含EC2的IP地址和服務的埠號
        return `http://${process.env.EC2_PRIVATE_IP}:${process.env.USER_SERVICE_PORT}${local_url}`;
    }
    return local_url; // 返回本地URL
};

// 定義取得產品URL的函數
const getProductsUrl = () => {
    const local_url = "/products"; // 定義本地URL
    if (process.env.USE_CONTAINER) { // 檢查是否在容器環境中
        // 返回完整的URL，包含EC2的IP地址和服務的埠號
        return `http://${process.env.EC2_PRIVATE_IP}:${process.env.PRODUCT_SERVICE_PORT}${local_url}`;
    }
    return local_url; // 返回本地URL
};

// 定義取得訂單URL的函數
const getOrdersUrl = () => {
    const local_url = "/orders"; // 定義本地URL
    if (process.env.USE_CONTAINER) { // 檢查是否在容器環境中
        // 返回完整的URL，包含EC2的IP地址和服務的埠號
        return `http://${process.env.EC2_PRIVATE_IP}:${process.env.ORDER_SERVICE_PORT}${local_url}`;
    }
    return local_url; // 返回本地URL
};

// 定義取得付款URL的函數
const getPaymentsUrl = () => {
    const local_url = "/payments"; // 定義本地URL
    if (process.env.USE_CONTAINER) { // 檢查是否在容器環境中
        // 返回完整的URL，包含EC2的IP地址和服務的埠號
        return `http://${process.env.EC2_PRIVATE_IP}:${process.env.PAYMENT_SERVICE_PORT}${local_url}`;
    }
    return local_url; // 返回本地URL
};

// 將函數導出，供其他模組使用
export {
    getUsersUrl,
    getProductsUrl,
    getOrdersUrl,
    getPaymentsUrl
};