
```groovy
        stage('Update Kubernetes Deployment') {
            steps {
                script {
                    // 檢查當前工作目錄
                    sh 'pwd'

                    // 使用 sed 替換 YAML 中的 Docker image 欄位
                    sh "sed -i \"s#your-dockerhub-username/k8s-shopping-site:latest#${env.SITE_ECR_REPO}:${env.IMAGE_TAG}#\" ../k8s/site-service-deployment.yaml"
                    sh "sed -i \"s#your-dockerhub-username/k8s-shopping-site:latest#${env.USER_SERVICE_ECR_REPO}:${env.IMAGE_TAG}#\" ../k8s/user-service-deployment.yaml"
                    sh "sed -i \"s#your-dockerhub-username/k8s-shopping-site:latest#${env.PRODUCT_SERVICE_ECR_REPO}:${env.IMAGE_TAG}#\" ../k8s/product-service-deployment.yaml"
                    sh "sed -i \"s#your-dockerhub-username/k8s-shopping-site:latest#${env.ORDER_SERVICE_ECR_REPO}:${env.IMAGE_TAG}#\" ../k8s/order-service-deployment.yaml"
                    sh "sed -i \"s#your-dockerhub-username/k8s-shopping-site:latest#${env.PAYMENT_SERVICE_ECR_REPO}:${env.IMAGE_TAG}#\" ../k8s/payment-service-deployment.yaml"
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                script {
                    // 使用 kubectl 部署到 EKS
                    sh 'kubectl apply -f ../k8s/site-service-deployment.yaml'
                    sh 'kubectl apply -f ../k8s/user-service-deployment.yaml'
                    sh 'kubectl apply -f ../k8s/product-service-deployment.yaml'
                    sh 'kubectl apply -f ../k8s/order-service-deployment.yaml'
                    sh 'kubectl apply -f ../k8s/payment-service-deployment.yaml'
                }
            }
        }
```