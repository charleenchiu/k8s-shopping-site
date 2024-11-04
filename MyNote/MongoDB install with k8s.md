使用 MongoDB Operator 自建 Kubernetes 上的 MongoDB 是一個很好的選擇，尤其在需要更靈活的控制、特別配置需求或是避免雲服務依賴時。以下是如何透過 MongoDB Kubernetes Operator 來建置 MongoDB 的基本步驟：

### 1. 前置準備
確保你的 Kubernetes Cluster 已經運行，並且安裝好了 `kubectl` 和 Helm 來操作集群資源。

### 2. 安裝 MongoDB Community Kubernetes Operator
MongoDB 提供了官方的 Kubernetes Operator，可以幫助自動化 MongoDB 部署與管理。以下是安裝步驟：

1. **安裝 MongoDB Community Operator**
   MongoDB 官方提供了 Community Operator 可以直接在 Kubernetes 上使用。可以用以下指令下載並安裝：

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/mongodb/mongodb-kubernetes-operator/master/config/crd/bases/mongodbcommunity.mongodb.com_mongodbcommunity.yaml
   kubectl apply -f https://raw.githubusercontent.com/mongodb/mongodb-kubernetes-operator/master/config/rbac/role.yaml
   kubectl apply -f https://raw.githubusercontent.com/mongodb/mongodb-kubernetes-operator/master/config/rbac/role_binding.yaml
   kubectl apply -f https://raw.githubusercontent.com/mongodb/mongodb-kubernetes-operator/master/config/manager/manager.yaml
   ```

2. **確認 Operator 已成功安裝**：執行以下指令查看是否有 MongoDB Operator 運行中。
   ```bash
   kubectl get pods -n <你的命名空間>
   ```

### 3. 創建 MongoDB Cluster
接著我們可以創建 MongoDB Cluster YAML 檔案來定義 MongoDB 部署規範，檔案內容如下：

```yaml
apiVersion: mongodbcommunity.mongodb.com/v1
kind: MongoDBCommunity
metadata:
  name: my-mongodb
  namespace: <你的命名空間>
spec:
  members: 3
  type: ReplicaSet
  version: "4.4.6"
  persistent: true
  security:
    authentication:
      modes: ["SCRAM"]
  users:
    - name: "admin"
      db: "admin"
      passwordSecretRef:
        name: "my-mongodb-password"
      roles:
        - name: "root"
          db: "admin"
  statefulSet:
    spec:
      template:
        spec:
          containers:
            - name: mongod
              resources:
                requests:
                  cpu: "200m"
                  memory: "200Mi"
                limits:
                  cpu: "500m"
                  memory: "500Mi"
```

4. **設定密碼**：將 MongoDB 密碼存入 Kubernetes Secret，這樣在 YAML 中參照密碼的 Secret：
   ```bash
   kubectl create secret generic my-mongodb-password --from-literal=password='<你的密碼>' -n <你的命名空間>
   ```

5. **部署 MongoDB Cluster**：透過以下指令建立 MongoDB 的 Replica Set。
   ```bash
   kubectl apply -f my-mongodb.yaml
   ```

6. **確認 MongoDB 狀態**：檢查 MongoDB Cluster 是否正常運行。
   ```bash
   kubectl get pods -n <你的命名空間>
   ```

### 4. 測試與連線
- 確保 MongoDB 正常運行後，可以透過內部 Cluster IP 或 LoadBalancer 服務來連接你的 MongoDB，測試 MongoDB 部署的可行性。
  
- 使用 Kubernetes Service 暴露 MongoDB 的端口，讓其他應用可以與它互動。