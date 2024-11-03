要在 Jenkins pipeline 中實現 canary 部署和 rollback，可以考慮以下步驟：

### 1. 先更新 `Jenkinsfile` 中的 Deploy 階段

你可以把部署的過程分成兩個階段：一個是部署新的版本到少數 Pods (canary)，另一個是檢查新的版本是否正常運行。如果一切正常，則將流量轉移到新的版本。

### 2. 先設定 Canary 部署的 Deployment

在 Kubernetes 中，你可以使用兩個不同的 Deployments，分別是 `user-service` 的 stable 和 canary 版本。可以這樣進行設置：

#### YAML 示例：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service-canary
spec:
  replicas: 1
  selector:
    matchLabels:
      app: user-service
      tier: canary
  template:
    metadata:
      labels:
        app: user-service
        tier: canary
    spec:
      containers:
      - name: user-service
        image: your-dockerhub-username/user-service:latest # 這裡應更新為 ECR 的 image
        ports:
        - containerPort: 3001
```

### 3. 更新 Deploy 階段

在 `Jenkinsfile` 的 Deploy 階段，你需要：

- 首先部署 canary 版本。
- 然後進行健康檢查。
- 若健康檢查通過，則將流量切換到 canary 版本。
- 若不通過，則可以 rollback。

### 4. 增加健康檢查和流量切換的邏輯

你可以在 `Deploy to EKS` 階段之後，增加健康檢查的步驟。

```groovy
stage('Deploy to EKS') {
    steps {
        script {
            // 先部署 canary 版本
            sh 'kubectl apply -f ../k8s/user-service-canary.yaml'

            // 健康檢查
            def healthy = sh(script: "kubectl get pods -l app=user-service,tier=canary -o jsonpath='{.items[0].status.containerStatuses[0].ready}'", returnStdout: true).trim()

            if (healthy == 'true') {
                // 如果健康檢查通過，則切換流量到 canary 版本
                sh 'kubectl set image deployment/user-service user-service=${env.USER_SERVICE_ECR_REPO}:${env.IMAGE_TAG}'
            } else {
                error('Canary deployment failed. Rolling back.')
            }
        }
    }
}
```

### 5. Rollback

如果發現 canary 部署失敗，你可以使用 `kubectl rollout undo` 命令來 rollback。

```groovy
stage('Rollback') {
    steps {
        script {
            // Rollback 到上一個穩定版本
            sh 'kubectl rollout undo deployment/user-service'
        }
    }
}
```

### 6. 其他考量

- **流量管理**：你可以利用 Kubernetes 的 Service 定義來控制流量，確保一些請求流量仍然指向舊版本。
- **版本控制**：建議為不同版本的映像使用不同的 tag，這樣可以更容易地回滾到之前的版本。

這樣你就能在 Jenkins pipeline 中實現 canary 部署和 rollback 的功能。需要根據實際需求調整細節，比如健康檢查的標準和流量切換的策略。