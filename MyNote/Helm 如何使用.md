使用 Helm 可以幫助您更輕鬆地管理 Kubernetes 的應用程式部署，尤其是當您有多個 microservices 需要部署時。以下是具體的文件與步驟，教您如何編寫與使用 Helm。

## 1. Helm Chart 結構

首先，您需要為每個 microservice 建立 Helm Chart。Helm Chart 是一組檔案的集合，用來描述 Kubernetes 應用程式的資源。Helm Chart 的基本結構如下：

```bash
my-microservice-chart/
│
├── Chart.yaml            # Chart 的基本資訊
├── values.yaml           # 預設的變數值
├── templates/            # Kubernetes YAML 範本檔案
│   ├── deployment.yaml   # 部署 Deployment 的範本
│   ├── service.yaml      # 部署 Service 的範本
│   ├── ingress.yaml      # 部署 Ingress 的範本（可選）
│   └── _helpers.tpl      # 可重複使用的模板函數
```

### 1.1 `Chart.yaml`
這是 Helm Chart 的主檔案，用來定義 Chart 的名稱、版本等基本資訊。

範例 `Chart.yaml`：

```yaml
apiVersion: v2
name: my-microservice
description: A Helm chart for my microservice
version: 0.1.0
appVersion: "1.0.0"
```

### 1.2 `values.yaml`
這個檔案包含預設的變數值，這些值可以在範本中使用。

範例 `values.yaml`：

```yaml
replicaCount: 2

image:
  repository: my-microservice
  tag: "latest"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  annotations: {}
  hosts:
    - host: my-microservice.local
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls: []
```

### 1.3 `deployment.yaml` (在 `templates/` 中)
這是定義 Kubernetes Deployment 資源的範本，用來部署您的 microservice。

範例 `deployment.yaml`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-deployment
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
          resources: {}
```

### 1.4 `service.yaml` (在 `templates/` 中)
定義 Kubernetes Service 資源的範本，用來暴露 Deployment 中的服務。

範例 `service.yaml`：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ .Release.Name }}-service
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
  selector:
    app: {{ .Release.Name }}
```

### 1.5 `ingress.yaml` (在 `templates/` 中)
定義 Kubernetes Ingress 資源的範本，用來暴露 HTTP 路徑（可選）。

範例 `ingress.yaml`：

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Release.Name }}-ingress
  annotations:
    {{- range $key, $value := .Values.ingress.annotations }}
    {{ $key }}: {{ $value }}
    {{- end }}
spec:
  rules:
    - host: {{ .Values.ingress.hosts[0].host }}
      http:
        paths:
          - path: {{ .Values.ingress.hosts[0].paths[0].path }}
            pathType: {{ .Values.ingress.hosts[0].paths[0].pathType }}
            backend:
              service:
                name: {{ .Release.Name }}-service
                port:
                  number: {{ .Values.service.port }}
```

### 1.6 `_helpers.tpl` (在 `templates/` 中)
這個檔案可定義共用的模板函數，幫助簡化範本檔案（可選）。

範例 `_helpers.tpl`：

```yaml
{{- define "fullname" -}}
{{ .Release.Name }}-{{ .Chart.Name }}
{{- end -}}
```

## 2. 使用 Helm

### 2.1 安裝 Helm

如果尚未安裝 Helm，請按照以下指令安裝 Helm：

```bash
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
```

### 2.2 建立 Helm Chart

在每個 microservice 的根目錄中執行以下命令來初始化一個 Helm Chart：

```bash
helm create my-microservice
```

這會自動建立上述結構，然後您可以修改 `values.yaml` 和 `templates/` 中的檔案來適應您的專案需求。

### 2.3 部署 Helm Chart

當您完成了所有的設定，您可以使用以下命令將 microservice 部署到 Kubernetes 集群：

```bash
helm install my-microservice ./my-microservice-chart
```

其中 `my-microservice` 是部署的名稱，`./my-microservice-chart` 是 Helm Chart 的目錄路徑。

### 2.4 升級部署

如果需要修改配置，您可以更新 `values.yaml` 或其他模板檔案，然後執行以下命令來升級您的部署：

```bash
helm upgrade my-microservice ./my-microservice-chart
```

### 2.5 刪除部署

如果您需要刪除已安裝的 Chart，可以使用以下命令：

```bash
helm uninstall my-microservice
```

## 3. 整合 Jenkins Pipeline

您可以將 Helm 的部署命令整合進您的 Jenkins Pipeline 中，確保自動化部署。以下是範例 Jenkinsfile：

```groovy
pipeline {
    agent any
    environment {
        KUBECONFIG = credentials('kubeconfig-file')
    }
    stages {
        stage('Deploy to Kubernetes with Helm') {
            steps {
                script {
                    sh 'helm upgrade --install my-microservice ./my-microservice-chart --set image.tag=$IMAGE_TAG'
                }
            }
        }
    }
}
```

## 結論

這些步驟應該能幫助您在專案中開始使用 Helm。Helm 的優勢在於它能將 Kubernetes 應用的資源抽象化，使其變得更具模組化並且更容易管理。透過將每個 microservice 打包為一個 Helm Chart，您可以更容易地進行版本控制與自動化部署。