當然可以！以下是整理後的筆記內容，並移除了與上一部分重複的部分：

```markdown
# EKS

將您的 API Docker 容器從 ECS 遷移到 EKS 需要一些步驟。以下是大致的流程：

## 建立 Role

要創建一個 IAM 角色來管理 EKS 所有項目，您需要確保該角色具有適當的許可權來執行各種操作。以下是一些關鍵的 IAM 策略和許可權，您可以附加到這個角色上：

### 1. AmazonEKSClusterPolicy

這個策略允許 EKS 叢集管理所需的基本許可權，包括創建和管理叢集。

### 2. AmazonEKSServicePolicy

這個策略允許 EKS 服務進行必要的操作，例如創建和管理負載均衡器。

### 3. AmazonEKSWorkerNodePolicy

這個策略允許 EKS 節點組管理所需的許可權，包括描述 VPC 中的 EC2 資源。

### 4. AmazonEC2ContainerRegistryReadOnly

這個策略允許節點從 Amazon ECR 拉取 Docker 映像。

### 5. CloudWatchLogsFullAccess

這個策略允許節點將日誌發送到 CloudWatch Logs。

### 6. AmazonEKS_CNI_Policy

這個策略允許 Amazon VPC CNI 插件為 Kubernetes 執行操作，例如配置網路接口和 IP 地址。

### 7. 自訂策略

如果您有特定的需求，可以創建自訂策略來包含其他必要的許可權。例如，以下是一個自訂策略的範例：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateTags",
        "ec2:DescribeInstances",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DescribeVpcs",
        "ec2:DescribeDhcpOptions",
        "ec2:DescribeAvailabilityZones",
        "kms:DescribeKey"
      ],
      "Resource": "*"
    }
  ]
}
```

### 創建角色的步驟

1. **開啟 IAM 控制台**。
2. **選擇 "Roles" (角色)**，然後選擇 "Create role" (建立角色)。
3. **選擇 "AWS service" (AWS 服務)** 作為信任實體，然後選擇 "EKS"。
4. **選擇 "EKS - Cluster" 作為使用案例**，然後選擇 "Next" (下一步)。
5. **附加上述策略**，然後選擇 "Next" (下一步)。
6. **為角色命名**，例如 `eksClusterRole`，然後選擇 "Create role" (建立角色)。

這樣，您就可以創建一個具有所有必要許可權的 IAM 角色，用於管理 EKS 的所有項目。

## 建立 EKS 叢集

首先，您需要在 AWS 上建立一個 EKS 叢集。您可以使用 AWS 管理控制台、AWS CLI 或 Terraform 來完成這一步。

- cluster name = 4api-docker-website-eks-cluster
- role = eksClusterRole

## 配置 kubectl

安裝並配置 `kubectl` 以便與您的 EKS 叢集進行互動。

- 路徑：C:\kubectl
- 版本：V.1.31.1

您可以使用 AWS CLI 來更新 kubeconfig 文件：

```sh
aws eks --region us-east-1 update-kubeconfig --name 4api-docker-website-eks-cluster
```

## 建立 Kubernetes 部署和服務

將您的 ECS 任務定義轉換為 Kubernetes 部署和服務。這包括創建一個 Deployment YAML 文件來定義您的容器，並創建一個 Service YAML 文件來暴露您的應用程式。

以下是一個簡單的範例：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: <your_ecr_repository>:<tag>
        ports:
        - containerPort: 3001
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  type: LoadBalancer
  selector:
    app: user-service
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3001
```

### 切換 EKS 叢集

每次您切換到不同的 EKS 叢集時，都需要執行 `aws eks --region <region> update-kubeconfig --name <cluster_name>` 命令來更新 kubeconfig 文件。這樣可以確保 `kubectl` 能夠正確地與您指定的 EKS 叢集進行互動。

這個命令會將新的叢集配置添加到您的 kubeconfig 文件中，而不會覆蓋現有的配置。因此，您可以在同一個 kubeconfig 文件中管理多個叢集。

如果您經常切換叢集，可以考慮使用 `kubectl config use-context` 命令來切換上下文，而不需要每次都更新 kubeconfig。例如：

1. 執行 `aws eks --region <region> update-kubeconfig --name <cluster_name>` 為每個叢集添加配置。
2. 使用 `kubectl config get-contexts` 查看所有可用的上下文。
3. 使用 `kubectl config use-context <context_name>` 切換到所需的上下文。

這樣可以更方便地管理和切換不同的 EKS 叢集。

## Debug

### Pod 處於 Pending 狀態

根據 `kubectl describe pod` 的輸出，您的 Pod 處於 `Pending` 狀態，並且有一個警告訊息 `FailedScheduling`，表示沒有可用的節點來調度 Pod。這通常是由於以下幾個原因：

1. **沒有可用的節點**：您的 EKS 叢集中可能沒有可用的節點來調度新的 Pod。您可以檢查您的叢集中是否有運行中的節點。
2. **資源不足**：您的節點可能沒有足夠的資源（如 CPU 或內存）來調度新的 Pod。您可以檢查節點的資源使用情況。
3. **節點選擇器或容忍度**：您的 Pod 可能有特定的節點選擇器或容忍度設置，導致它無法被調度到可用的節點上。

### 檢查節點狀態

您可以使用以下命令來檢查叢集中節點的狀態：

```sh
kubectl get nodes
```

這將顯示所有節點的狀態。如果沒有節點或節點處於 `NotReady` 狀態，您需要添加或修復節點。

### 添加節點

如果您的叢集中沒有可用的節點，您可以添加新的節點。以下是使用 AWS CLI 添加節點的範例：

```sh
# 建立 cluster：
# aws eks create-cluster --name my-eks-cluster --role-arn <role_arn> --resources-vpc-config subnetIds=subnet-12345678,subnet-87654321,securityGroupIds=<security_group_id>

# 建立 nodegroup
# aws eks create-nodegroup --cluster-name <cluster_name> --nodegroup-name <nodegroup_name> --subnets <subnet_ids> --instance-types <instance_type> --role-arn <role_arn> --scaling-config minSize=1,maxSize=3,desiredSize=2
aws eks create-nodegroup --cluster-name 4api-docker-website-eks-cluster --nodegroup-name user-service-nodegroup --subnets [subnet-0153eaf2e8d59b0a0,subnet-01a1ebac945fa5853] --instance-types <instance_type> --role-arn arn:aws:iam::167804136284:role/eksClusterRole --scaling-config minSize=1,maxSize=3,desiredSize=2
# 即：
aws eks create-nodegroup `
  --cluster-name 4api-docker-website-eks-cluster `
  --nodegroup-name user-service-nodegroup `
  --subnets subnet-0153eaf2e8d59b0a0 subnet-01a1ebac945fa5853 `
  --instance-types t2.micro `
  --scaling-config minSize=1,maxSize=3,desiredSize=2 `
  --capacity-type SPOT `
  --node-role arn:aws:iam::167804136284:role/eksNodeRole
```

### 刪除節點組

你可以使用 AWS CLI 來刪除失敗的節點組，然後重新建立。以下是刪除節點組的指令：

```bash
aws eks delete-nodegroup `
  --cluster-name 4api-docker-website-eks-cluster `
  --nodegroup-name user-service-nodegroup
```

這個指令會刪除指定的節點組。刪除過程可能需要一些時間，請耐心等待。

### 確認刪除完成

你可以使用以下指令來確認節點組已經刪除：

```bash
aws eks describe-nodegroup `
  --cluster-name 4api-docker-website-eks-cluster `
  --nodegroup-name user-service-nodegroup
```

如果節點組已經刪除，這個指令會返回一個錯誤，表示找不到節點組。

### 重新建立節點組

刪除完成後，你可以使用之前的指令重新建立節點組：

```powershell
aws eks create-nodegroup `
  --cluster-name 4api-docker-website-eks-cluster `
  --nodegroup-name user-service-nodegroup `
  --subnets subnet-0153eaf2e8d59b0a0 subnet-01a1ebac945fa5853 `
  --instance-types t2.micro `
  --scaling-config minSize=1,maxSize=5,desiredSize=4 `
  --node-role arn:aws:iam::167804136284:role/eksNodeRole
```

### 選擇 EC2 還是 Fargate

選擇 EC2 還是 Fargate 取決於您的需求和使用情境。以下是兩者的比較，幫助您做出決定：

#### EC2 節點組

**優點**：
- **更多控制**：您可以完全控制 EC2 實例的配置和管理。
- **靈活性**：支持多種實例類型和自定義 AMI。
- **成本效益**：可以使用 Spot 實例來降低成本。

**缺點**：
- **管理負擔**：需要手動管理實例的生命週期和擴展。

#### Fargate

**優點**：
- **無需管理基礎設施**：AWS 會自動管理底層基礎設施，您只需專注於應用程式。
- **自動擴展**：根據需求自動擴展和縮減資源。
- **簡化操作**：適合需要快速部署和簡化操作的工作負載。

**缺點**：
- **成本**：相比 EC2，Fargate 的成本可能更高。
- **限制**：不支持所有的 Kubernetes 功能，例如 DaemonSets。

### 選擇建議

- 如果您需要更多的控制和靈活性，並且有能力管理基礎設施，選擇 EC2 節點組可能更合適。
- 如果您希望簡化操作，減少管理負擔，並且可以接受較高的成本，選擇 Fargate 會更方便。

### 檢查資源使用情況

您可以使用以下命令來檢查節點的資源使用情況：

```sh
kubectl describe node <node_name>
```

這將顯示節點的詳細信息，包括資源使用情況。如果資源不足，您可能需要擴展節點的資源或添加更多節點。

### 檢查 Pod 的節點選擇器和容忍度

您可以檢查 Pod 的 YAML 文件，確保沒有設置特定的節點選擇器或容忍度，導致 Pod 無法被調度到可用的節點上。

## 部署到 EKS

使用 `kubectl apply` 命令將您的 Deployment 和 Service 部署到 EKS 叢集：

```sh
kubectl apply -f deployment.yaml  # 將 deployment.yaml 文件中的 Kubernetes 部署配置應用到叢集
kubectl apply -f service.yaml     # 將 service.yaml 文件中的 Kubernetes 服務配置應用到叢集
```

## 驗證部署

使用下列命令來驗證您的應用程式是否已成功部署並運行：

```sh
kubectl get pods                  # 列出當前叢集中所有的 Pod，顯示其狀態
kubectl get services              # 列出當前叢集中所有的服務，顯示其狀態
```

您可以使用 `kubectl describe pod <pod_name>` 來查看詳細信息。

```sh
PS C:\charleen\LearnDevops\vprofile-project\ShoppingSite\user-service\k8s> kubectl get pods
NAME                            READY   STATUS    RESTARTS   AGE
user-service-5d596cf4dd-jrc9g   0/1     Pending   0          58s
NAME           TYPE           CLUSTER-IP       EXTERNAL-IP                                                              PORT(S)        AGE
kubernetes     ClusterIP      10.100.0.1       <none>                                                                   443/TCP        3h23m
user-service   LoadBalancer   10.100.125.102   a63489d2c76834c34887e79680ca1372-672655474.us-east-1.elb.amazonaws.com   80:30670/TCP   62s
```

## 使用瀏覽器查看佈建結果

您可以使用 `kubectl get services` 命令中顯示的 EXTERNAL-IP 來訪問您的服務。在這個例子中，您可以在瀏覽器中輸入以下 URL 來查看佈建結果：

```
http://a63489d2c76834c34887e79680ca1372-672655474.us-east-1.elb.amazonaws.com
```

這些步驟應該能幫助您將 API Docker 容器從 ECS 遷移到 EKS。

## 停止並重新執行 Kubernetes 部署和服務

### 停止現有的部署和服務

1. **刪除部署**：
   ```bash
   kubectl delete -f deployment.yaml
   ```

2. **刪除服務**：
   ```bash
   kubectl delete -f service.yaml
   ```

### 重新執行部署和服務

1. **應用部署配置**：
   ```bash
   kubectl apply -f deployment.yaml
   ```

2. **應用服務配置**：
   ```bash
   kubectl apply -f service.yaml
   ```

### 檢查狀態

1. **列出所有 Pod**：
   ```bash
   kubectl get pods
   ```

2. **列出所有服務**：
   ```bash
   kubectl get services
   ```

## 解決 Pod 處於 Pending 狀態的問題

### 1. 檢查節點狀態

確保你的節點組中的節點已經啟動並且處於 `Ready` 狀態。你可以使用以下指令來檢查節點狀態：

```bash
kubectl get nodes
```

### 2. 檢查資源配額

確保你的節點有足夠的資源（CPU 和內存）來分配給 Pod。你可以使用以下指令來檢查資源配額：

```bash
kubectl describe nodes
```

### 3. 檢查事件日誌

查看 Pod 的事件日誌，以獲取更多關於為什麼 Pod 處於 `Pending` 狀態的詳細信息。你可以使用以下指令來查看事件日誌：

```bash
kubectl describe pod user-service-5d596cf4dd-sb977
```

### 4. 檢查網路和安全組設置

確保你的節點和 Pod 之間的網路設置正確，並且安全組允許所需的流量。

### 5. 檢查 IAM 角色和權限

確保你的節點組的 IAM 角色（`eksNodeRole`）具有正確的權限，並且已附加所需的策略。

## 增加節點數量

你可以增加節點組中的節點數量，以提供更多的資源來容納新的 Pod。你可以使用以下指令來更新節點組的大小：

```bash
aws eks update-nodegroup-config `
  --cluster-name 4api-docker-website-eks-cluster `
  --nodegroup-name user-service-nodegroup `
  --scaling-config minSize=1,maxSize=5,desiredSize=4
```

## 檢查資源請求和限制

確保你的 Pod 的資源請求和限制合理，不會超過節點的可用資源。你可以在 `deployment.yaml` 文件中設置資源請求和限制，例如：

```yaml
resources:
  requests:
    memory: "64Mi"
    cpu: "250m"
  limits:
    memory: "128Mi"
    cpu: "500m"
```

## 使用 Pod 反親和性

你可以使用 Pod 反親和性來確保 Pod 分佈在不同的節點上，這樣可以避免單個節點上的資源過載。你可以在 `deployment.yaml` 文件中設置反親和性，例如：

```yaml
affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
            - key: app
              operator: In
              values:
                - user-service
        topologyKey: "kubernetes.io/hostname"
```

## 檢查節點資源使用情況

你可以使用以下指令來檢查節點的資源使用情況，確保節點有足夠的資源來分配新的 Pod：

```bash
kubectl describe nodes
```

## 暫停 EKS 叢集並減少費用

要暫停 EKS 叢集並減少費用，你可以考慮以下幾個步驟：

### 1. 刪除 Kubernetes 資源

首先，刪除現有的部署和服務：

```bash
kubectl delete -f deployment.yaml
kubectl delete -f service.yaml
```

### 2. 刪除工作節點

接下來，刪除 EKS 叢集中的工作節點（EC2 實例）：

```bash
aws eks delete-nodegroup `
  --cluster-name 4api-docker-website-eks-cluster `
  --nodegroup-name user-service-nodegroup
```

### 3. 刪除 EKS 叢集（可選）

如果你不再需要 EKS 叢集，可以刪除整個叢集來停止所有費用。請注意，這將刪除所有與叢集相關的資源。

```bash
aws eks delete-cluster --name 4api-docker-website-eks-cluster
```

### 4. 停止 EKS 叢集（無直接方法）

目前，AWS 不提供直接暫停 EKS 叢集的功能，但你可以通過刪除工作節點來達到類似的效果。這樣可以停止計算資源的費用，但仍會產生每小時 $0.10 美元的叢集管理費用。

### 5. 使用 AWS Fargate（可選）

如果你希望按需付款計算資源費用，可以考慮使用 AWS Fargate。Fargate 允許你運行無伺服器的 Kubernetes 工作負載，並且只需為實際使用的資源付費。

希望這些步驟能幫助你有效地管理 EKS 叢集並減少費用！

---

這樣你就可以停止並重新執行你的 Kubernetes 部署和服務了。

看起來你的部署和服務已經成功重新應用，但 Pod 的狀態顯示為 `Pending`。這通常表示 Pod 無法分配到節點上。以下是一些可能的原因和解決方法：

### 1. 檢查節點狀態

確保你的節點組中的節點已經啟動並且處於 `Ready` 狀態。你可以使用以下指令來檢查節點狀態：

```bash
kubectl get nodes
```

### 2. 檢查資源配額

確保你的節點有足夠的資源（CPU 和內存）來分配給 Pod。你可以使用以下指令來檢查資源配額：

```bash
kubectl describe nodes
```

### 3. 檢查事件日誌

查看 Pod 的事件日誌，以獲取更多關於為什麼 Pod 處於 `Pending` 狀態的詳細信息。你可以使用以下指令來查看事件日誌：

```bash
kubectl describe pod user-service-5d596cf4dd-sb977
```

### 4. 檢查網路和安全組設置

確保你的節點和 Pod 之間的網路設置正確，並且安全組允許所需的流量。

### 5. 檢查 IAM 角色和權限

確保你的節點組的 IAM 角色（`eksNodeRole`）具有正確的權限，並且已附加所需的策略。

## 增加節點數量

你可以增加節點組中的節點數量，以提供更多的資源來容納新的 Pod。你可以使用以下指令來更新節點組的大小：

```bash
aws eks update-nodegroup-config `
  --cluster-name 4api-docker-website-eks-cluster `
  --nodegroup-name user-service-nodegroup `
  --scaling-config minSize=1,maxSize=5,desiredSize=4
```

## 檢查資源請求和限制

確保你的 Pod 的資源請求和限制合理，不會超過節點的可用資源。你可以在 `deployment.yaml` 文件中設置資源請求和限制，例如：

```yaml
resources:
  requests:
    memory: "64Mi"
    cpu: "250m"
  limits:
    memory: "128Mi"
    cpu: "500m"
```

## 使用 Pod 反親和性

你可以使用 Pod 反親和性來確保 Pod 分佈在不同的節點上，這樣可以避免單個節點上的資源過載。你可以在 `deployment.yaml` 文件中設置反親和性，例如：

```yaml
affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
            - key: app
              operator: In
              values:
                - user-service
        topologyKey: "kubernetes.io/hostname"
```

## 檢查節點資源使用情況

你可以使用以下指令來檢查節點的資源使用情況，確保節點有足夠的資源來分配新的 Pod：

```bash
kubectl describe nodes
```