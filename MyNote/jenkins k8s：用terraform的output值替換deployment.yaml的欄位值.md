```sh
        stage('Update Kubernetes Deployment') {
            steps {
                script {
                    // 使用 sed 替換 YAML 中的 Docker image 欄位
                    sh "sed -i 's#your-dockerhub-username/k8s-shopping-site:latest#${env.ECR_REPO}:${env.IMAGE_TAG}#' C:/charleen/LearnDevops/k8s-shopping-site_1_simple/k8s/site-service-deployment.yaml"
                }
            }
        }
```

sh：這是 Jenkins 的 shell 步驟，用來執行 shell 命令。

sed：這是一個流編輯器，用來處理文本文件。這裡用來進行字串替換。

-i：這個選項告訴 sed 直接在文件中進行替換（即「原地編輯」）。

's#your-dockerhub-username/k8s-shopping-site:latest#${env.ECR_REPO}:${env.IMAGE_TAG}#'：

s：這是 sed 的替換命令。

#：這是定界符，用於分隔替換模式。

your-dockerhub-username/k8s-shopping-site:latest：這是要被替換的字串。

${env.ECR_REPO}:${env.IMAGE_TAG}：這是新的字串，替換成為 ECR 儲存庫地址和影像標籤。

```
// 在 docker 指令中，使用環境變數時，只需 $ 符號即可。
// ${AWS_REGION}的寫法是正確的，因為它是在 Jenkins Pipeline 的 sh 步驟中使用。在 Shell 指令中，我們直接使用 ${} 來引用變數。
sh 'docker tag $SITE_ECR_REPO:$IMAGE_TAG ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/$SITE_ECR_REPO:$IMAGE_TAG'
```

```
// 在 sed 指令中，由於它在 Jenkins Pipeline 的 sh 步驟內執行，因此需要使用 ${env.變數名稱} 來引用環境變數
sh "sed -i 's#your-dockerhub-username/k8s-shopping-site:latest#${env.SITE_ECR_REPO}:${env.IMAGE_TAG}#' ../k8s/site-service-deployment.yaml"
```
