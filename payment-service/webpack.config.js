import path from 'path';
import fs from 'fs';

// 獲取當前目錄名稱
const __dirname = path.resolve();

// 設置輸入和輸出路徑
export default {
  mode: 'development', // 或 'production'
  entry: './src/payment-service.js', // 假設所有服務都以 .js 結尾的檔案為入口
  output: {
    path: path.resolve(__dirname, 'dist'), // 輸出目錄
    filename: '[name].bundle.js', // 輸出檔案名稱
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 匹配所有 JavaScript 檔案
        exclude: /node_modules/, // 排除 node_modules 目錄
        use: {
          loader: 'babel-loader', // 使用 Babel 轉換 ES6 語法
          options: {
            presets: ['@babel/preset-env'], // 使用 env 預設設定
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'], // 解析檔案擴展名
  },
  devtool: 'source-map', // 提供源映射，以便更容易調試
  devServer: {
    contentBase: path.join(__dirname, 'dist'), // 開發伺服器提供的內容目錄
    compress: true,
    port: 3000, // 指定開發伺服器端口
  },
};
