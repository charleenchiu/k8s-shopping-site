const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js', // 這是你的入口 JS 文件
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), // 輸出文件的目錄
        clean: true, // 每次編譯時清理 dist 目錄
    },
    module: {
        rules: [
            {
                test: /\.js$/, // 對所有 .js 檔案應用這條規則
                exclude: /node_modules/, // 排除 node_modules 目錄
                use: {
                    loader: 'babel-loader', // 使用 Babel 編譯 ES6+
                },
            },
            {
                test: /\.css$/, // 處理 CSS 檔案
                use: ['style-loader', 'css-loader'], // 支援 CSS 文件
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', // 使用 public/index.html 作為模板
            filename: 'index.html', // 輸出文件名稱
        }),
    ],
    // 設定開發伺服器
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'), // 提供靜態文件
        },
        port: 3000, // 設定開發伺服器的端口
    },
};
