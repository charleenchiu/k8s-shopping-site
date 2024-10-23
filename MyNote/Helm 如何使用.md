# 前面您教我使用helm的部份，我想請您依照我的專案結構，再次具體教我怎麼做：
C:\charleen\LearnDevops\k8s-shopping-site_1_simple
├── ansible
│   ├── inventory
│   └── playbook.yml
├── k8s
│   ├── order-service-deployment.yaml
│   ├── payment-service-deployment.yaml
│   ├── product-service-deployment.yaml
│   ├── site-service-deployment.yaml
│   └── user-service-deployment.yaml
├── order-service
│   ├── Dockerfile
│   ├── index.js (http://localhost:3003)
│   ├── node_modules
│   ├── package-lock.json
│   └── package.json
├── payment-service
│   ├── Dockerfile
│   ├── index.js (http://localhost:3004)
│   ├── node_modules
│   ├── package-lock.json
│   └── package.json
├── product-service
│   ├── Dockerfile
│   ├── index.js (http://localhost:3002)
│   ├── node_modules
│   ├── package-lock.json
│   └── package.json
├── terraform
│   ├── main.tf
│   ├── outputs.tf
│   └── variables.tf
├── user-service
│   ├── Dockerfile
│   ├── index.js (http://localhost:3001)
│   ├── node_modules
│   ├── package-lock.json
│   └── package.json
├── .env
├── docker-compose.yml
├── Dockerfile
├── index.js
├── Jenkinsfile
├── node_modules
├── package-lock.json
└── package.json

使用 Helm 來管理 Kubernetes 應用程式是非常有用的，它能簡化部署、升級和管理應用程式的過程。以下是依照您的專案結構，具體的 Helm 實作步驟：

### 1. 安裝 Helm

首先，確保您已安裝 Helm。如果尚未安裝，可以參考 [Helm 官方文檔](https://helm.sh/docs/intro/install/) 進行安裝。

### 2. 建立 Helm Chart

在您的專案根目錄下，使用以下命令來創建 Helm Chart：

```bash
cd C:\charleen\LearnDevops\k8s-shopping-site_1_simple
helm create k8s-chart
```

這將在專案根目錄中創建一個名為 `k8s-chart` 的目錄，包含 Helm Chart 的基本結構。

### 3. 修改 Helm Chart 結構

接下來，您需要根據每個服務修改 `k8s-chart` 的結構。以下是應該如何組織該目錄的示例：

```plaintext
k8s-chart
├── Chart.yaml
├── values.yaml
└── templates
    ├── deployment.yaml
    ├── service.yaml
    └── ingress.yaml  # 如果您需要使用 Ingress
```

### 4. 編輯 `Chart.yaml`

編輯 `k8s-chart/Chart.yaml` 文件，設置 Chart 的基本信息：

```yaml
apiVersion: v2
name: k8s-shopping-site
description: A Helm chart for Kubernetes Shopping Site
version: 0.1.0
appVersion: "1.0"
```

### 5. 設定 `values.yaml`

在 `values.yaml` 中定義您服務的基本配置，例如環境變數、映像名稱等：

```yaml
replicaCount: 1

image:
  repository: your-ecr-repo-url  # 更新為您的 ECR 地址
  pullPolicy: IfNotPresent
  tag: "latest"  # 或您所使用的標籤

service:
  type: ClusterIP
  port: 80  # 您的應用程序端口

resources: {}
```

### 6. 編輯 `deployment.yaml`

在 `templates/deployment.yaml` 中定義 Kubernetes 部署：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}
  labels:
    app: {{ .Release.Name }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Release.Name }}
  template:
    metadata:
      labels:
        app: {{ .Release.Name }}
    spec:
      containers:
      - name: {{ .Release.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        ports:
        - containerPort: {{ .Values.service.port }}
        env:
        - name: NODE_ENV
          value: "production"
        # 根據需要添加其他環境變數
```

### 7. 編輯 `service.yaml`

在 `templates/service.yaml` 中定義服務：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ .Release.Name }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: {{ .Values.service.port }}
  selector:
    app: {{ .Release.Name }}
```

### 8. 部署 Helm Chart

在專案根目錄下運行以下命令以部署您的應用程序：

```bash
helm install k8s-shopping-site ./k8s-chart
```

### 9. 更新 Helm Chart

若要更新已部署的 Helm Chart，可以進行修改後運行：

```bash
helm upgrade k8s-shopping-site ./k8s-chart
```

### 10. 卸載 Helm Chart

如果需要卸載 Helm Chart，可以使用以下命令：

```bash
helm uninstall k8s-shopping-site
```

### 小結

通過以上步驟，您已經為每個微服務建立了 Helm Chart，這將使得在 Kubernetes 上管理和部署這些服務變得更加簡單和高效。您可以為每個微服務創建一個獨立的 Helm Chart，或將它們整合到一個 Chart 中，根據您的需求進行選擇。

//======具體完整的指導=======================================
# 我建的log group 是"/eks/k8s-shopping-site_task"
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
        image: your-dockerhub-username/user-service:latest # 替換為你的 Docker 映像
        ports:
        - containerPort: 3001
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  type: ClusterIP
  ports:
  - port: 3001
    targetPort: 3001
  selector:
    app: user-service

C:\charleen\LearnDevops\k8s-shopping-site_1_simple\k8s\user-service-deployment.yaml：
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
        image: your-dockerhub-username/user-service:latest # 替換為你的 Docker 映像
        ports:
        - containerPort: 3001
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  type: ClusterIP
  ports:
  - port: 3001
    targetPort: 3001
  selector:
    app: user-service


# 請問：
1.請加log_group給我看
2.每個微服務的這個檔案都很相似。請問適合如何用helm 

答：
1. **將 CloudWatch Log Group 加入 Kubernetes Deployment**  
要將 CloudWatch 日誌群組（log group）與您的 Kubernetes 部署集成，您需要配置 `awslogs` 日誌驅動。在您的 `user-service-deployment.yaml` 中，您可以在 `containers` 配置下添加一個 `logging` 配置來將日誌發送到 CloudWatch。假設 CloudWatch 日誌群組是 `/eks/k8s-shopping-site_task`，如下所示：

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
        image: your-dockerhub-username/user-service:latest # 替換為你的 Docker 映像
        ports:
        - containerPort: 3001
        env:
        - name: AWS_REGION
          value: "us-east-1"  # 替換為你使用的 AWS 區域
        - name: AWS_LOG_GROUP
          value: "/eks/k8s-shopping-site_task"  # 替換為你的 Log Group 名稱
        - name: AWS_LOG_STREAM
          value: "user-service"  # 每個微服務的日誌流可有不同的名稱
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
      # 日誌配置，這裡使用了 awslogs 日誌驅動
      logging:
        driver: awslogs
        options:
          awslogs-region: us-east-1 # 替換為你的 AWS 區域
          awslogs-group: "/eks/k8s-shopping-site_task"
          awslogs-stream-prefix: "user-service"
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  type: ClusterIP
  ports:
  - port: 3001
    targetPort: 3001
  selector:
    app: user-service
```

這裡我們在容器中配置了環境變數來指定 AWS 日誌群組和流。並使用了 `awslogs` 日誌驅動，將容器日誌發送到指定的 CloudWatch 日誌群組中。

2. **使用 Helm 為每個微服務部署相似的檔案**  
由於每個微服務的部署檔案相似，您可以通過 Helm Chart 來管理這些部署。Helm Chart 允許您使用模板來生成配置文件，這樣就可以避免每個微服務都寫一個相似的 YAML。

以下是簡化的 `values.yaml` 和 `deployment.yaml`：

- `values.yaml`:
```yaml
image:
  repository: your-dockerhub-username/user-service
  tag: latest
replicaCount: 1
service:
  type: ClusterIP
  port: 3001
logGroup: /eks/k8s-shopping-site_task
```

- `templates/deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "chart.name" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ include "chart.name" . }}
  template:
    metadata:
      labels:
        app: {{ include "chart.name" . }}
    spec:
      containers:
      - name: {{ include "chart.name" . }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        ports:
        - containerPort: {{ .Values.service.port }}
        env:
        - name: AWS_REGION
          value: "us-east-1"  # 替換為你的 AWS 區域
        - name: AWS_LOG_GROUP
          value: "{{ .Values.logGroup }}"
        - name: AWS_LOG_STREAM
          value: "{{ include "chart.name" . }}"
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
        logging:
          driver: awslogs
          options:
            awslogs-region: us-east-1
            awslogs-group: "{{ .Values.logGroup }}"
            awslogs-stream-prefix: "{{ include "chart.name" . }}"
```

這樣，您可以通過 `helm install` 或 `helm upgrade` 命令來管理每個微服務的部署，並只需修改 `values.yaml` 中的參數來適應不同的服務。


//================================================================================================================

# 如果我使用Helm，那麼還需要C:\charleen\LearnDevops\k8s-shopping-site_1_simple\k8s\user-service-deployment.yaml嗎？

答：
如果您使用 Helm 來管理您的 Kubernetes 應用程式和相關的資源，那麼 Helm Chart 會自動生成 `user-service-deployment.yaml` 類似的部署和服務配置。也就是說，您不再需要手動維護 `user-service-deployment.yaml`，因為 Helm Chart 可以將這些設定集中管理。

### Helm 的優勢：
- **模板化配置**：Helm Chart 允許您以模板的形式管理多個服務的配置，不需要每個服務手動寫一個部署檔案。
- **集中管理**：使用 Helm，您可以將所有微服務的部署、服務、ConfigMap、Secrets 甚至是日誌收集等設定集中在一個 Chart 中管理，方便維護和更新。
- **版本控制**：Helm 提供版本控制功能，您可以輕鬆回滾到某個之前的版本。
  
### 使用 Helm 後，還需要 `user-service-deployment.yaml` 嗎？
不需要，因為您可以在 Helm Chart 的 `values.yaml` 或是 Chart 模板檔案中指定部署的細節。這樣就不必為每個微服務單獨維護 YAML 文件。

### 示例：Helm Chart 如何替代 `user-service-deployment.yaml`

在 `values.yaml` 中，您可以指定用來部署 `user-service` 的配置：

```yaml
user-service:
  image:
    repository: your-dockerhub-username/user-service
    tag: latest
  service:
    type: ClusterIP
    port: 3001
  replicas: 1
  resources:
    limits:
      memory: "512Mi"
      cpu: "500m"
  env:
    - name: AWS_REGION
      value: "us-east-1"
    - name: AWS_LOG_GROUP
      value: "/eks/k8s-shopping-site_task"
    - name: AWS_LOG_STREAM
      value: "user-service"
```

這樣 Helm 會自動生成相應的 Kubernetes 資源來部署 `user-service`，就不需要手動維護 `user-service-deployment.yaml`。

### 小結
一旦使用 Helm，您不再需要手動管理和編寫像 `user-service-deployment.yaml` 這樣的 Kubernetes 部署文件。Helm Chart 會根據 `values.yaml` 中的配置自動生成所需的 Kubernetes 資源，並進行部署。

//==========================================
#問：我要使用helm，要使用deployment.yaml模版和values.yaml。請再告訴我要怎麼做，並且告訴我這些檔案的路徑。
我想未來用jenkins執行terraform，建立cloudwatch loggroup "/eks/k8s-shopping-site_task"，取得這個名字，再傳給helm指令。請問這樣可行嗎？如何做？是不是我在jenkinsfile動態修改C:\charleen\LearnDevops\k8s-shopping-site_1_simple\k8s-chart\values.yaml，訂一個變數呢？

答：
你可以將 Terraform 與 Helm 結合來自動化建立 CloudWatch Log Group 並將該 Log Group 傳遞給 Helm。以下是具體步驟和你需要修改的檔案路徑：

### 1. **Terraform 部分**
   在 Terraform 中建立 CloudWatch Log Group：
   
   **檔案路徑**: `C:\charleen\LearnDevops\k8s-shopping-site_1_simple\terraform\main.tf`
   ```hcl
   resource "aws_cloudwatch_log_group" "k8s_log_group" {
     name = "/eks/k8s-shopping-site_task"
     retention_in_days = 7
   }

   output "log_group_name" {
     value = aws_cloudwatch_log_group.k8s_log_group.name
   }
   ```

   Terraform 將建立 CloudWatch Log Group 並輸出 Log Group 名稱。

### 2. **Jenkins Pipeline (Jenkinsfile)**
   你可以在 Jenkinsfile 中動態取得 Terraform 的輸出，並將它傳遞給 Helm 的指令：

   **檔案路徑**: `C:\charleen\LearnDevops\k8s-shopping-site_1_simple\Jenkinsfile`
   ```groovy
   pipeline {
       agent any
       stages {
           stage('Terraform Init') {
               steps {
                   sh 'terraform init'
               }
           }
           stage('Terraform Apply') {
               steps {
                   sh 'terraform apply -auto-approve'
               }
           }
           stage('Get Log Group Name') {
               steps {
                   script {
                       def logGroupName = sh(script: 'terraform output -raw log_group_name', returnStdout: true).trim()
                       env.LOG_GROUP_NAME = logGroupName
                   }
               }
           }
           stage('Helm Deploy') {
               steps {
                   sh "helm upgrade --install k8s-site ./k8s-chart --set awsLogsGroup=$LOG_GROUP_NAME"
               }
           }
       }
   }
   ```

### 3. **Helm Chart 的 values.yaml**
   在 Helm 的 values.yaml 中定義一個變數用於 CloudWatch Log Group 名稱：

   **檔案路徑**: `C:\charleen\LearnDevops\k8s-shopping-site_1_simple\k8s-chart\values.yaml`
   ```yaml
   services:
     user-service:
       port: 3001
       awsLogsGroup: "" # 這裡會被 Jenkins 的 Helm 指令動態設置
     product-service:
       port: 3002
       awsLogsGroup: "" # 同上
     order-service:
       port: 3003
       awsLogsGroup: ""
     payment-service:
       port: 3004
       awsLogsGroup: ""
     site-service:
       port: 3000
       awsLogsGroup: ""
   ```

### 4. **Helm Deployment Template (deployment.yaml)**
   在 Helm 的 deployment.yaml 模版中，你可以使用 `.Values` 來動態套用這些值：

   **檔案路徑**: `C:\charleen\LearnDevops\k8s-shopping-site_1_simple\k8s-chart\templates\deployment.yaml`
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: {{ .Chart.Name }}-{{ .Values.serviceName }}
   spec:
     replicas: 1
     selector:
       matchLabels:
         app: {{ .Values.serviceName }}
     template:
       metadata:
         labels:
           app: {{ .Values.serviceName }}
       spec:
         containers:
         - name: {{ .Values.serviceName }}
           image: "{{ .Values.image }}"
           ports:
           - containerPort: {{ .Values.port }}
           env:
           - name: AWS_LOG_GROUP
             value: "{{ .Values.awsLogsGroup }}"
           - name: AWS_REGION
             value: "us-east-1"
   ```

### 整體流程
1. **Terraform** 先建立 CloudWatch Log Group。
2. **Jenkins** pipeline 執行 Terraform 並取得 log group 名稱。
3. **Helm** 使用 Jenkins 傳遞的 log group 名稱來部署服務到 EKS。

這樣的流程可以確保 CloudWatch Log Group 被正確地配置，並且與各個微服務連接。


//===========================================================
# 問：helm upgrade是否相當於kubectl apply？
答：
是的，`helm upgrade` 和 `kubectl apply` 之間有一些相似之處，但它們的作用和用法是不同的。以下是兩者的比較：

### `helm upgrade`
- **作用**：`helm upgrade` 用於更新已安裝的 Helm release。如果指定的 chart 已經安裝，這個命令將會使用新的設定來更新該 release 的資源。
- **功能**：Helm 管理的應用程式通常由多個 Kubernetes 資源組成（例如 Deployments、Services、ConfigMaps 等）。當你使用 `helm upgrade` 時，Helm 會根據提供的 values 來更新所有相關的資源，並自動處理資源的依賴關係。
- **版本控制**：Helm 會為每次更新創建一個新的 release 版本，這樣你可以輕鬆回滾到先前的版本。

### `kubectl apply`
- **作用**：`kubectl apply` 用於創建或更新 Kubernetes 資源。你可以直接使用 YAML 文件來指定資源的狀態。
- **功能**：`kubectl apply` 根據 YAML 文件中定義的狀態來調整 Kubernetes 中的實際狀態。這意味著你可以單獨更新特定的資源，而不需要處理整個應用程式的所有資源。
- **無版本控制**：`kubectl apply` 不會提供像 Helm 那樣的版本控制功能，對於回滾操作需要手動處理。

### 總結
- 如果你正在使用 Helm 作為應用程式包管理器，並希望簡化多個資源的管理和版本控制，則使用 `helm upgrade` 是合適的。
- 如果你想直接與 Kubernetes 資源交互，或者只需更新特定的資源，則可以使用 `kubectl apply`。

因此，雖然兩者都有更新資源的功能，但在管理複雜應用程式和版本控制方面，`helm upgrade` 提供了更多的便利性。

//====================================================================================
# 問：我的C:\charleen\LearnDevops\k8s-shopping-site_1_simple\k8s\site-service-deployment.yaml與其它4個微服務有些許不同，請問這樣可以套用同一個您剛才說的helm devployment.yaml模版嗎？
我原先的k8s檔案內容如下：
C:\charleen\LearnDevops\k8s-shopping-site_1_simple\k8s\site-service-deployment.yaml：
apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8s-shopping-site
spec:
  replicas: 1
  selector:
    matchLabels:
      app: k8s-shopping-site
  template:
    metadata:
      labels:
        app: k8s-shopping-site
    spec:
      containers:
      - name: k8s-shopping-site
        image: your-dockerhub-username/k8s-shopping-site:latest # 替換為你的 Docker 映像
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: k8s-shopping-site
spec:
  type: ClusterIP
  ports:
  - port: 3000
    targetPort: 3000
  selector:
    app: k8s-shopping-site

C:\charleen\LearnDevops\k8s-shopping-site_1_simple\k8s\user-service-deployment.yaml：
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
        image: your-dockerhub-username/user-service:latest # Docker 映像
        ports:
        - containerPort: 3001
        env:
        - name: AWS_REGION
          value: "us-east-1"  # AWS 區域
        - name: AWS_LOG_GROUP
          value: "/eks/k8s-shopping-site_task"  # Log Group 名稱
        - name: AWS_LOG_STREAM
          value: "user-service"  # 每個微服務的日誌流名稱
        #resources:
        #  limits:
        #    memory: "512Mi"
        #    cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  type: ClusterIP
  ports:
  - port: 3001
    targetPort: 3001
  selector:
    app: user-service

答：
根據您提供的 `site-service-deployment.yaml` 和 `user-service-deployment.yaml` 的差異，整體來說，這兩個部署文件非常相似，主要的差異在於：

1. **微服務名稱與端口：**
   - `site-service` 的名稱和端口是 `k8s-shopping-site`，而 `user-service` 使用不同的名稱和端口 (`user-service`, `3001`)。
   
2. **環境變數 (env variables)：**
   - `user-service` 包含了有關 AWS 日誌（`AWS_REGION`, `AWS_LOG_GROUP`, `AWS_LOG_STREAM`）的配置，而 `k8s-shopping-site` 沒有這些日誌相關的環境變數。

針對這樣的情況，您仍然可以使用同一個 Helm 模板來生成所有微服務的部署，只需根據服務的特定需求來在 `values.yaml` 中配置不同的值。也就是說，對於 `site-service`，您可以在 `values.yaml` 中指定不需要 AWS 日誌的配置，並根據需要為 `user-service` 等微服務添加日誌配置。

### 如何在 Helm 模板中處理差異化配置

以下是如何在 Helm 模板中靈活處理這些差異的做法：

1. **可選的日誌配置：** 使用條件語句來處理某些微服務（例如 `user-service`）的日誌配置，而對於其他服務（例如 `k8s-shopping-site`），則不需要這些配置。
   
2. **通過 `values.yaml` 文件進行細化配置：** 您可以在 `values.yaml` 中為每個微服務配置不同的值，讓模板可以根據這些值動態生成不同的配置。

### 更新後的 `deployment.yaml` 模板示例：

```yaml
{{- range $serviceName, $service := .Values.services }}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ $service.name }}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {{ $service.name }}
  template:
    metadata:
      labels:
        app: {{ $service.name }}
    spec:
      containers:
      - name: {{ $service.name }}
        image: {{ $service.image }}
        ports:
        - containerPort: {{ $service.port }}
        {{- if $service.logsEnabled }} # 可選的日誌配置
        env:
        - name: AWS_REGION
          value: {{ $.Values.global.aws.region }}
        - name: AWS_LOG_GROUP
          value: {{ $.Values.global.aws.logGroup }}
        - name: AWS_LOG_STREAM
          value: {{ $service.logStream }}
        logging:
          driver: awslogs
          options:
            awslogs-region: {{ $.Values.global.aws.region }}
            awslogs-group: {{ $.Values.global.aws.logGroup }}
            awslogs-stream-prefix: {{ $service.logStream }}
        {{- end }}
---
apiVersion: v1
kind: Service
metadata:
  name: {{ $service.name }}
spec:
  type: ClusterIP
  ports:
  - port: {{ $service.port }}
    targetPort: {{ $service.port }}
  selector:
    app: {{ $service.name }}
---
{{- end }}
```

### 說明：

1. **條件語句 `{{- if $service.logsEnabled }}`：**
   - 這裡根據 `values.yaml` 中的 `logsEnabled` 配置來決定是否為某個服務添加日誌相關的環境變數和配置。這樣，您可以在需要的微服務中開啟日誌功能，而對不需要的微服務（例如 `k8s-shopping-site`）則跳過這些配置。

### 修改後的 `values.yaml` 示例：

```yaml
global:
  aws:
    region: "us-east-1"
    logGroup: "/eks/k8s-shopping-site_task"

services:
  k8s-shopping-site:
    name: "k8s-shopping-site"
    image: "your-dockerhub-username/k8s-shopping-site"
    port: 3000
    logsEnabled: false  # 不啟用日誌配置

  user-service:
    name: "user-service"
    image: "your-dockerhub-username/user-service"
    port: 3001
    logStream: "user-service"
    logsEnabled: true  # 啟用日誌配置

  product-service:
    name: "product-service"
    image: "your-dockerhub-username/product-service"
    port: 3002
    logStream: "product-service"
    logsEnabled: true

  order-service:
    name: "order-service"
    image: "your-dockerhub-username/order-service"
    port: 3003
    logStream: "order-service"
    logsEnabled: true

  payment-service:
    name: "payment-service"
    image: "your-dockerhub-username/payment-service"
    port: 3004
    logStream: "payment-service"
    logsEnabled: true
```

### 小結

這樣的模板可以處理所有微服務，包括 `k8s-shopping-site` 和其它 4 個 API 的微服務。Helm 模板中通過使用條件語句來選擇性地添加日誌配置，使您可以針對不同服務的需求進行細化配置。您不需要為每個微服務維護獨立的 `deployment.yaml`，只需要使用一個通用的模板，並在 `values.yaml` 中定義具體的變數即可。