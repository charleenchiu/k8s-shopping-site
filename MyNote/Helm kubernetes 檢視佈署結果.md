怎樣才能用瀏覽器檢視我的佈署結果：
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> kubectl expose deployment my-deployment --type=NodePort --name=nginx-service-nodeport 
service/nginx-service-nodeport exposed
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> kubectl get services
NAME                     TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                       AGE
kubernetes               ClusterIP   10.96.0.1        <none>        443/TCP                       2d1h
nginx-service            ClusterIP   10.96.48.87      <none>        80/TCP                        4m26s
nginx-service-nodeport   NodePort    10.100.183.134   <none>        80:30097/TCP,6379:30696/TCP   25s
redis-service            ClusterIP   10.109.92.177    <none>        6379/TCP                      4m26s

要透過瀏覽器檢視你的 Kubernetes 部署結果，可以透過 `NodePort` 服務來訪問應用程式。以下是步驟：

### 1. 確認 NodePort 服務資訊
根據你執行的指令，`nginx-service-nodeport` 使用了 `NodePort` 類型來暴露服務。透過 `kubectl get services` 命令可以看到它的 `NodePort` 是 `30097`，對應的內部端口是 `80`。

```bash
nginx-service-nodeport   NodePort   10.100.183.134   <none>   80:30097/TCP   25s
```

### 2. 找到你的 Node IP
要使用 `NodePort` 訪問服務，你需要知道你 Kubernetes 節點（Node）的 IP 地址。如果你是在本地或某台機器上運行 Kubernetes，可以嘗試以下幾個方式找出節點的 IP 地址。

#### 使用 `kubectl` 查找 Node IP
你可以使用以下命令來列出節點並查找其 IP 地址：

```bash
kubectl get nodes -o wide
```

結果中，你會看到類似於：

```bash
NAME            STATUS   ROLES    AGE    VERSION   INTERNAL-IP     EXTERNAL-IP
k8s-node-1      Ready    <none>   2d1h   v1.21.0   192.168.1.100   <none>
```

`INTERNAL-IP` 是內部的節點 IP，如果你是在本地運行（例如使用 Minikube 或 Kind），可以直接用它來訪問。如果你的節點有外部 IP（`EXTERNAL-IP`），你也可以用那個。

### 3. 使用瀏覽器訪問
你現在可以使用以下網址在瀏覽器中訪問應用：

```
http://<Node-IP>:30097
```

假設你的 `Node IP` 是 `192.168.1.100`，則輸入：

```
http://192.168.1.100:30097
```

這樣就應該可以通過瀏覽器查看你的應用佈署結果。

### 4. 如果是 Minikube
如果你是使用 Minikube，執行以下命令可以直接獲得 Node IP：

```bash
minikube ip
```

然後再使用該 IP 和 `NodePort` 來訪問應用。

### 總結
確保你找到了正確的 Node IP 並使用瀏覽器訪問 `NodeIP:NodePort` 格式的 URL，就可以檢視佈署的結果。

//=========================================================================
# 歷程：
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> helm uninstall my-release
Error: uninstall: Release not loaded: my-release: release: not found
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> helm install my-release .
NAME: my-release
LAST DEPLOYED: Mon Oct 21 02:02:41 2024
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> minikube ip
192.168.49.2
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> kubectl



                                                                  kubectl get service
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP    12m
nginx-service   ClusterIP   10.97.133.125   <none>        80/TCP     104s
redis-service   ClusterIP   10.96.11.90     <none>        6379/TCP   104s
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> kubectl get








                                                                  kubectl get nodes -o wide
NAME       STATUS   ROLES           AGE   VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION                       CONTAINER-RUNTIME
minikube   Ready    control-plane   13m   v1.31.0   192.168.49.2   <none>        Ubuntu 22.04.4 LTS   5.15.153.1-microsoft-standard-WSL2   docker://27.2.0

檢視 http://192.168.49.2:80

//==========================================================================================
當你無法透過 `http://192.168.49.2:80` 檢視應用程式時，可能有以下幾個原因：

1. **Service 的類型是 `ClusterIP`**：
   根據你所顯示的 `kubectl get services` 輸出，`nginx-service` 和 `redis-service` 的類型都是 `ClusterIP`。`ClusterIP` 服務只能在 Kubernetes 內部網路中存取，而不能從外部（如瀏覽器）直接訪問。

   如果你想要透過瀏覽器來檢視服務，你需要將 `Service` 類型設置為 `NodePort` 或 `LoadBalancer`。例如，你可以用 `kubectl expose` 來將 `nginx-service` 暴露為 `NodePort`：

   ```bash
   kubectl expose deployment my-release --type=NodePort --name=nginx-service-nodeport
   ```

   然後，執行以下命令來檢查 NodePort：

   ```bash
   kubectl get services
   ```

   你會看到類似 `PORT(S)` 顯示為 `80:<NodePort>/TCP`。這時候，你可以透過 `http://<minikube-ip>:<NodePort>` 來訪問。

2. **檢查防火牆設置**：
   確保本機或 Docker Desktop 沒有防火牆阻擋你訪問 `NodePort`。

3. **部署是否正常運行**：
   你可以檢查部署是否一切正常：

   ```bash
   kubectl get pods
   ```

   確認你的 Pod 狀態是否是 `Running`，並且沒有遇到任何錯誤。

4. **應用程式內部問題**：
   如果服務正常暴露但無法訪問，應用程式可能有內部問題。檢查 Pod 日誌來確定應用是否正常啟動：

   ```bash
   kubectl logs <pod-name>
   ```

根據這些步驟，你應該可以定位問題並解決無法訪問的情況。

# 流程：
```sh
# 進入到helm chart的目錄
cd C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart
# 缷除之前的安裝
helm uninstall my-release
# 重新安裝
helm install my-release .
# 如果Service 的類型是 `ClusterIP`，需要暴露IP供叢集外可存取
kubectl expose deployment my-release --type=NodePort --name=nginx-service-nodeport
# Minikube
minikube start
# 取得內部IP
minikube ip
# 取得port
kubectl get services
# 你會看到類似 `PORT(S)` 顯示為 `80:<NodePort>/TCP`。這時候，你可以透過 `http://<minikube-ip>:<NodePort>` 來訪問。

```
//=====================================================================================================
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> helm install my-release .                                           
NAME: my-release
LAST DEPLOYED: Mon Oct 21 02:30:19 2024
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> kubectl get services
NAME            TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
kubernetes      ClusterIP   10.96.0.1        <none>        443/TCP          39m
nginx-service   NodePort    10.101.162.207   <none>        80:31122/TCP     32s
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> kubectl get nodes
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   39m   v1.31.0
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> kubectl get pods
NAME                             READY   STATUS    RESTARTS   AGE
my-deployment-74c8fdd9df-bxqx4   2/2     Running   0          66m
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> kubectl expose deployment my-release --type=NodePort --name=nginx-service-nodeport
Error from server (NotFound): deployments.apps "my-release" not found
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> minikube ip
192.168.49.2

請問我該用什麼URL檢視我的K8s佈署？
根據你目前的 `kubectl get services` 輸出，你的 `nginx-service` 是用 `NodePort` 類型暴露的，且對外的端口是 `31122`。因此，你可以使用以下 URL 來檢視你的 K8s 部署：

```
http://192.168.49.2:31122
```

這個 URL 是由 `minikube ip` (192.168.49.2) 和 `NodePort` (31122) 組合而成的。請在瀏覽器中輸入這個地址來檢視應用程式。

如果還是無法訪問，請檢查：
1. 確認應用是否正常運行（`kubectl get pods` 檢查 pod 狀態）。
2. 檢查防火牆或網路設置是否阻止了外部訪問這個端口。

另外，如果 `my-release` deployment 無法暴露，你可能需要確認 `deployment.yaml` 是否正確應用了 `nginx-service` 的設定。

//==========================================

測試：
使用 kubectl port-forward 測試本地訪問： 你可以嘗試本地測試，確認應用是否正確運行，避免網路問題影響測試。執行以下指令來進行本地轉發：

```sh
kubectl port-forward svc/nginx-service 8080:80
```
然後在瀏覽器中訪問 http://localhost:8080 看看是否有回應。如果這個方法可行，則表示應用本身沒問題，接著可以排查外部網路連接問題。

訪問 http://localhost:8080是成功的。但請問kubectl port-forward svc/nginx-service 8080:80跟我的專案之間是什麼樣的關係？為什麼我要做這個動作呢？ 

`kubectl port-forward svc/nginx-service 8080:80` 這個命令的作用是將 Kubernetes 內部服務（`nginx-service`）的 **80** 埠，轉發到你本機的 **8080** 埠，從而讓你可以在瀏覽器中使用 `http://localhost:8080` 來訪問部署在 Kubernetes 集群內部的服務。

背後的機制是 Kubernetes 集群內的服務通常只對集群內的 Pod 可訪問，如果你沒有對外部開放服務（例如沒有使用 LoadBalancer 或 NodePort 類型的 Service），你無法直接從外部網路連接到這些服務。透過 `kubectl port-forward`，你可以建立一個臨時的隧道，讓本地端口與 Kubernetes 集群內的服務進行連接，從而在本機訪問這些內部服務。

### 為什麼需要這個動作？
1. **本機測試**：這是一個方便的方式，讓你在本地測試應用程式，特別是在開發過程中，而不需要直接公開服務到外部網路。
   
2. **避免配置 NodePort 或 LoadBalancer**：如果你只是短暫需要檢查某個服務，使用 `port-forward` 比配置 `NodePort` 或 `LoadBalancer` 要來得方便，因為這些會涉及到更多的網路設定。

3. **Kubernetes 服務隔離**：許多情況下，服務只設置為 `ClusterIP`（預設配置），這表示服務只能在 Kubernetes 集群內部訪問。`port-forward` 讓你能夠從本地機器與這些內部服務進行交互，而不改變原本的網路結構。

### 與你的專案的關係
這個命令不會對你的 Helm Chart 或 Kubernetes 部署進行任何更改，它只是暫時讓你在本地訪問 Kubernetes 中的服務。當你停止 `port-forward`，這個連接就會中斷。這對你在開發過程中測試服務非常有用，但最終如果你想讓應用程式公開給使用者使用，你需要配置正確的 Kubernetes 服務類型（如 `NodePort` 或 `LoadBalancer`）來實現對外部的持久性訪問。
