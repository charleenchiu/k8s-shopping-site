import path from 'path';
import { fileURLToPath } from 'url';

// 模擬 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  // 入口點（entry point），從這裡開始打包應用程式
  entry: './src/index.js',

  // 輸出選項，定義打包後的檔案
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // 模式可以是 'development' 或 'production'
  mode: 'development',

  // 處理不同類型文件的規則
  module: {
    rules: [
      {
        test: /\.js$/, // 對所有 .js 檔案應用這條規則
        exclude: /node_modules/, // 排除 node_modules 目錄
        use: {
          loader: 'babel-loader', // 使用 Babel 處理 ES6+ 語法
        },
      },
      {
        test: /\.css$/, // 處理 CSS 檔案
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  // 如果要使用 live-server，這一段可以刪除
  // 設定開發伺服器（如果使用）
  devServer: {
    static: './dist', // 開發伺服器會從這個目錄提供靜態文件
    port: 3000, // 可設置您想使用的開發伺服器端口
  },

  // Webpack 5 的 fallback 設定，用於支援 Node.js 核心模組的 polyfills
  resolve: {
    fallback: {
      "path": "path-browserify",
      "os": "os-browserify/browser",
      "crypto": "crypto-browserify",
    },
  },
};
