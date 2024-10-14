# 用Windows CMD列出專案根目錄下的所有目錄及檔案。列出完整路徑(含檔名)，並且全部列成一長串。但：
README目錄：不列出目錄名稱
node_modules目錄：只列出目錄名稱。不列出目錄下的所有子目錄及檔案

```sh
Get-ChildItem -Recurse -Force | Where-Object { $_.FullName -notmatch "README|node_modules\\.*" } | ForEach-Object { $_.FullName }
```

列出的所有檔案COPY給AI, 請它畫出樹狀圖

C:\charleen\LearnDevops\vprofile-project\ShoppingSite
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


//====k8s-shopping-site_V1=============================================================================

C:\charleen\LearnDevops\vprofile-project\k8s-shopping-site
├── user-service (http://localhost:3001)
│   ├── node_modules
│   ├── Dockerfile
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── product-service (http://localhost:3002)
│   ├── node_modules
│   ├── Dockerfile
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── order-service (http://localhost:3003)
│   ├── node_modules
│   ├── Dockerfile
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── payment-service (http://localhost:3004)
│   ├── Dockerfile
│   ├── index.js
│   ├── node_modules
│   ├── package-lock.json
│   └── package.json
├── .env
├── index.js (http://localhost:3000)
├── node_modules
├── package-lock.json
├── package.json
├── Dockerfile
├── docker-compose.yml
└── k8s
   ├── order-service-deployment.yaml
   ├── payment-service-deployment.yaml
   ├── product-service-deployment.yaml
   └── user-service-deployment.yaml



//====k8s-shopping-site_V2===================================================================


C:\charleen\LearnDevops\vprofile-project\k8s-shopping-site
├── user-service (http://localhost:3001)
│   ├── node_modules
│   ├── Dockerfile
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── product-service (http://localhost:3002)
│   ├── node_modules
│   ├── Dockerfile
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── order-service (http://localhost:3003)
│   ├── node_modules
│   ├── Dockerfile
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── payment-service (http://localhost:3004)
│   ├── Dockerfile
│   ├── index.js
│   ├── node_modules
│   ├── package-lock.json
│   └── package.json
├── .env
├── index.js (http://localhost:3000)
├── node_modules
├── package-lock.json
├── package.json
├── Dockerfile
├── docker-compose.yml
├── k8s
│   ├── order-service-deployment.yaml
│   ├── payment-service-deployment.yaml
│   ├── product-service-deployment.yaml
│   ├── user-service-deployment.yaml
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
├── ansible/
│   ├── playbook.yml
│   ├── inventory
└── Jenkinsfile

