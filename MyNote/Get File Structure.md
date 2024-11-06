# 用Windows CMD列出專案根目錄下的所有目錄及檔案。列出完整路徑(含檔名)，並且全部列成一長串。但：
README目錄：不列出目錄名稱
node_modules目錄：只列出目錄名稱。不列出目錄下的所有子目錄及檔案

```sh
Get-ChildItem -Recurse -Force | Where-Object { $_.FullName -notmatch "README|MyNote|node_modules|.terraform|.git|gitignore|.gitignore\\.*" } | ForEach-Object { $_.FullName }
```

列出的所有檔案COPY給AI, 請它畫出樹狀圖

vprofile-project\ShoppingSite
├── web-client
│   ├── node_modules
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── App.js
│   │   ├── index.js (http://localhost:3000)
│   │   ├── LoginPage.js
│   │   ├── try.js
│   │   ├── components
│   │   │   ├── CRUDPage.js
│   │   │   ├── UserCRUDPage
│   │   │   │   └── UserCRUDPage.js
│   │   │   ├── ProductCRUDPage
│   │   │   │   └── ProductCRUDPage.js
│   │   │   ├── OrderCRUDPage
│   │   │   │   └── OrderCRUDPage.js
│   │   │   └── PaymentCRUDPage
│   │   │       └── PaymentCRUDPage.js
│   ├── test
│   │   ├── App.test.js
│   │   ├── LoginPage.test.js
│   │   ├── UserCRUDPage.test.js
│   │   ├── ProductCRUDPage.test.js
│   │   ├── OrderCRUDPage.test.js
│   │   ├── PaymentCRUDPage.test.js
│   ├── k8s
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   └── webpack.config.js
├── user-service
│   ├── node_modules
│   ├── src
│   │   └── user-service.js (http://localhost:3001/users)
│   ├── test
│   │   └── user.test.js
│   ├── k8s
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── webpack.config.js
├── product-service
│   ├── node_modules
│   ├── src
│   │   └── product-service.js (http://localhost:3002/products)
│   ├── test
│   │   └── product.test.js
│   ├── k8s
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── webpack.config.js
├── order-service
│   ├── node_modules
│   ├── src
│   │   ├── order-service.js (http://localhost:3003/orders)
│   │   └── test-env.js
│   ├── test
│   │   └── order.test.js
│   ├── k8s
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── webpack.config.js
├── payment-service
│   ├── node_modules
│   ├── src
│   │   └── payment-service.js (http://localhost:3004/payments)
│   ├── test
│   │   └── payment.test.js
│   ├── k8s
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── webpack.config.js
├── init-db.js
├── dbConnectionPool.js
├── dbTest.js
├── .env
├── config.js
├── index.html
├── src
│   └── index.js
├── node_modules
├── yarn.lock
├── package.json
├── .babelrc
├── webpack.config.js
├── docker-compose.yml
└── dist
   └── bundle.js


//====k8s-shopping-site=============================================================================

k8s-shopping-site_2_nodejs_mysql
├── Init
│   └── CreateServers.tf
├── k8s-chart
│   ├── charts
│   ├── templates
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   ├── .helmignore
│   ├── Chart.yaml
│   └── values.yaml
├── src
│   ├── user-service
│   │   ├── Dockerfile
│   │   ├── index.js (port: 3001)
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   └── yarn.lock
│   ├── product-service
│   │   ├── Dockerfile
│   │   ├── index.js (port: 3002)
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   └── yarn.lock
│   ├── order-service
│   │   ├── Dockerfile
│   │   ├── index.js (port: 3003)
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   └── yarn.lock
│   └── payment-service
│       ├──  Dockerfile
│       ├── index.js (port: 3004)
│       ├── package-lock.json
│       ├── package.json
│       └── yarn.lock
├── .env
├── index.js (port: 3000)
├── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
├── package-lock.json
├── package.json
└── yarn.lock


