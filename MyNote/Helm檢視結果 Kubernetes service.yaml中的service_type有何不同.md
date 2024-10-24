# 我能否用http://<node的external ip>:<service的port>來連到我的微服務？
ubuntu@ip-172-16-10-31:~$ kubectl get nodes -o wide
NAME                           STATUS   ROLES    AGE   VERSION               INTERNAL-IP    EXTERNAL-IP    OS-IMAGE                       KERNEL-VERSION                    CONTAINER-RUNTIME
ip-172-16-11-46.ec2.internal   Ready    <none>   89m   v1.31.0-eks-a737599   172.16.11.46   54.174.230.1   Amazon Linux 2023.6.20241010   6.1.112-122.189.amzn2023.x86_64   containerd://1.7.22
ubuntu@ip-172-16-10-31:~$ kubectl get pods
NAME                                      READY   STATUS    RESTARTS   AGE
aws-for-fluent-bit-gspc2                  1/1     Running   0          81m
user-service-deployment-8c459c675-fxkqk   1/1     Running   0          81m
ubuntu@ip-172-16-10-31:~$ kubectl get services
NAME                   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
aws-for-fluent-bit     ClusterIP   10.100.175.209   <none>        2020/TCP   81m
kubernetes             ClusterIP   10.100.0.1       <none>        443/TCP    94m
user-service-service   ClusterIP   10.100.155.248   <none>        3001/TCP   81m


## 在你的情況下，由於 `user-service-service` 的服務類型是 `ClusterIP`，你無法直接使用 `http://<node的external ip>:<service的port>` 來連接到你的微服務。

### 為什麼無法直接訪問？
- **ClusterIP**: 此類型的服務僅能在 Kubernetes 叢集內部進行訪問，這意味著只有叢集中的 Pod 可以通過服務的 `Cluster-IP` 訪問到該服務。外部請求無法直接路由到這個服務。

### 解決方案
如果你希望能從外部訪問你的微服務，有以下幾種選擇：

1. **更改服務類型為 NodePort**:
   - 這樣你可以通過任一節點的外部 IP 和 NodePort 來訪問你的微服務。
   - 將 `service.yaml` 中的類型改為 `NodePort`：
     ```yaml
     apiVersion: v1
     kind: Service
     metadata:
       name: user-service-service
     spec:
       type: NodePort
       ports:
         - port: 3001
           targetPort: 3001
           nodePort: 30001  # 指定 NodePort，必須是高於 30000 的數字
       selector:
         app: user-service
     ```

2. **使用 LoadBalancer**:
   - 如果你希望更方便地管理外部訪問，並希望自動獲取外部 IP，考慮使用 `LoadBalancer` 類型的服務。
   - 這樣，Kubernetes 會自動配置一個負載均衡器，並提供一個外部 IP 來訪問你的服務。
   - 修改 `service.yaml` 類似這樣：
     ```yaml
     apiVersion: v1
     kind: Service
     metadata:
       name: user-service-service
     spec:
       type: LoadBalancer
       ports:
         - port: 3001
           targetPort: 3001
       selector:
         app: user-service
     ```

3. **Ingress Controller**:
   - 如果你的應用程序需要處理多個微服務的外部訪問，可以考慮使用 Ingress Controller，這樣可以通過一個單一的外部 IP 處理所有流量。

### 總結
無法直接使用 `http://<node的external ip>:<service的port>` 來訪問你的微服務，因為 `user-service-service` 是 `ClusterIP` 類型。要讓外部可以訪問，你需要改變服務的類型為 `NodePort` 或 `LoadBalancer`。請根據你的需求選擇合適的方法。
或是執行
```sh
ubuntu@ip-172-16-10-31:~$ kubectl port-forward service/user-service-service 3001:3001
```
曝露port，然後瀏覽
http://98.81.235.115:3001
這也不行！！