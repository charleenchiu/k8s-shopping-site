我重新梳理一遍。目前：
當我用docker compose up測試時，它們是能彼此相通的，頁面上的連結能正作運作
helm 發佈成功
pods 都是running
services 也都配置在正確的port上
只有site-service的service type 用LoadBalancer，其餘都用ClusterIP
叢集中只有一個名為 externaldns-external-dns 的網絡政策，它允許所有流量進出post 7979
能用瀏覽器，透過LoadBalancer的DNS(URL：http://a98a65f5009af496495cebe544edc86a-327645097.us-east-1.elb.amazonaws.com:3000/)正確訪問到site-service的頁面
按下頁面上的user-service連結時，期待它會從site-service pod內部，在cluster 內部，訪問http://user-service.default.svc.cluster.local:3001
但當我用kubectl exec -it site-service-deployment-6ddbd789d6-dml8m -- /bin/sh進入site-service pod， 試curl http://user-service.default.svc.cluster.local:3001 時，收到連線被拒的回應
而且當我進入user-service pod，試連下列3種URL時，都是連線被拒
jenkins@ip-172-16-10-31:~$ kubectl exec -it user-service-deployment-586977c859-9lvj9 -- curl http://localhost:3001/
curl: (7) Failed to connect to localhost port 3001: Connection refused
command terminated with exit code 7
jenkins@ip-172-16-10-31:~$ kubectl exec -it user-service-deployment-586977c859-9lvj9 -- curl http://0.0.0.0:3001/
curl: (7) Failed to connect to 0.0.0.0 port 3001: Connection refused
command terminated with exit code 7
jenkins@ip-172-16-10-31:~$ kubectl exec -it user-service-deployment-586977c859-9lvj9 -- curl http://user-service.default.svc.cluster.local:3001
curl: (7) Failed to connect to user-service.default.svc.cluster.local port 3001: Connection refused
command terminated with exit code 7
為什麼pod之間彼此不能相通呢？


相關的資訊如下：

```sh
# -----------------------------------------------------------------------------------------
# 所有serice都有配置在正確的port上
jenkins@ip-172-16-10-31:~$ kubectl get services
NAME                       TYPE           CLUSTER-IP       EXTERNAL-IP                                                              PORT(S)          AGE
aws-for-fluent-bit         ClusterIP      10.100.32.254    <none>                                                                   2020/TCP         107m
externaldns-external-dns   ClusterIP      10.100.113.150   <none>                                                                   7979/TCP         108m
kubernetes                 ClusterIP      10.100.0.1       <none>                                                                   443/TCP          143m
order-service              ClusterIP      10.100.53.105    <none>                                                                   3003/TCP         107m
payment-service            ClusterIP      10.100.235.94    <none>                                                                   3004/TCP         107m
product-service            ClusterIP      10.100.148.174   <none>                                                                   3002/TCP         107m
site-service               LoadBalancer   10.100.91.89     a98a65f5009af496495cebe544edc86a-327645097.us-east-1.elb.amazonaws.com   3000:30988/TCP   107m
user-service               ClusterIP      10.100.130.200   <none>                                                                   3001/TCP         107m

# -----------------------------------------------------------------------------------------
# 所有pods都在運行中
jenkins@ip-172-16-10-31:~$ kubectl get pods -o wide
NAME                                          READY   STATUS    RESTARTS   AGE    IP              NODE                           NOMINATED NODE   READINESS GATES
aws-for-fluent-bit-55wj2                      1/1     Running   0          108m   172.16.11.118   ip-172-16-11-74.ec2.internal   <none>           <none>
externaldns-external-dns-54d8f9d954-vmv5c     1/1     Running   0          108m   172.16.11.220   ip-172-16-11-74.ec2.internal   <none>           <none>
order-service-deployment-69fdd4f984-d9zmx     1/1     Running   0          108m   172.16.11.14    ip-172-16-11-74.ec2.internal   <none>           <none>
payment-service-deployment-7bd588c69c-vl2fw   1/1     Running   0          108m   172.16.11.120   ip-172-16-11-74.ec2.internal   <none>           <none>
product-service-deployment-6667797d44-56w6w   1/1     Running   0          108m   172.16.11.251   ip-172-16-11-74.ec2.internal   <none>           <none>
site-service-deployment-6ddbd789d6-dml8m      1/1     Running   0          108m   172.16.11.161   ip-172-16-11-74.ec2.internal   <none>           <none>
user-service-deployment-586977c859-9lvj9      1/1     Running   0          108m   172.16.11.7     ip-172-16-11-74.ec2.internal   <none>           <none>

# -----------------------------------------------------------------------------------------
# 列出network policy
jenkins@ip-172-16-10-31:~$ kubectl get networkpolicies -n default
NAME                       POD-SELECTOR                                                                 AGE
externaldns-external-dns   app.kubernetes.io/instance=externaldns,app.kubernetes.io/name=external-dns   130m

# -----------------------------------------------------------------------------------------
# network policy允許所有流量進出
jenkins@ip-172-16-10-31:~$ kubectl describe networkpolicy externaldns-external-dns -n default
Name:         externaldns-external-dns
Namespace:    default
Created on:   2024-10-31 03:02:24 +0000 UTC
Labels:       app.kubernetes.io/component=controller
              app.kubernetes.io/instance=externaldns
              app.kubernetes.io/managed-by=Helm
              app.kubernetes.io/name=external-dns
              app.kubernetes.io/version=0.15.0
              helm.sh/chart=external-dns-8.3.12
Annotations:  meta.helm.sh/release-name: externaldns
              meta.helm.sh/release-namespace: default
Spec:
  PodSelector:     app.kubernetes.io/instance=externaldns,app.kubernetes.io/name=external-dns
  Allowing ingress traffic:
    To Port: 7979/TCP
    From: <any> (traffic not restricted by source)
  Allowing egress traffic:
    To Port: <any> (traffic allowed to all ports)
    To: <any> (traffic not restricted by destination)
  Policy Types: Ingress, Egress

# -----------------------------------------------------------------------------------------
# 進入site-service pod，可以連到site-service自己
jenkins@ip-172-16-10-31:~$ kubectl exec -it site-service-deployment-6ddbd789d6-dml8m -- /bin/sh
# curl http://localhost:3000

        <h1>Welcome to the Shopping Site</h1>
        <p>Click the links below to access the APIs:</p>
        <ul>
            <li><a href="/user-service">User Service</a> - URL: http://user-service.default.svc.cluster.local:3001</li>
            <li><a href="/product-service">Product Service</a> - URL: http://product-service.default.svc.cluster.local:3002</li>
            <li><a href="/order-service">Order Service</a> - URL: http://order-service.default.svc.cluster.local:3003</li>
            <li><a href="/payment-service">Payment Service</a> - URL: http://payment-service.default.svc.cluster.local:3004</li>
        </ul>
        <p>Debug:</p>
        <ul>
            <li><a href="/user-service">User Service</a> - URL: http://user-service.default.svc.cluster.local:3001</li>
            <li><a href="/product-service">Product Service</a> - URL: http://product-service.default.svc.cluster.local:3002</li>
            <li><a href="/order-service">Order Service</a> - URL: http://order-service.default.svc.cluster.local:3003</li>
            <li><a href="/payment-service">Payment Service</a> - URL: http://payment-service.default.svc.cluster.local:3004</li>
        </ul>
    #
# curl http://0.0.0.0:3000

        <h1>Welcome to the Shopping Site</h1>
        <p>Click the links below to access the APIs:</p>
        <ul>
            <li><a href="/user-service">User Service</a> - URL: http://user-service.default.svc.cluster.local:3001</li>
            <li><a href="/product-service">Product Service</a> - URL: http://product-service.default.svc.cluster.local:3002</li>
            <li><a href="/order-service">Order Service</a> - URL: http://order-service.default.svc.cluster.local:3003</li>
            <li><a href="/payment-service">Payment Service</a> - URL: http://payment-service.default.svc.cluster.local:3004</li>
        </ul>
        <p>Debug:</p>
        <ul>
            <li><a href="/user-service">User Service</a> - URL: http://user-service.default.svc.cluster.local:3001</li>
            <li><a href="/product-service">Product Service</a> - URL: http://product-service.default.svc.cluster.local:3002</li>
            <li><a href="/order-service">Order Service</a> - URL: http://order-service.default.svc.cluster.local:3003</li>
            <li><a href="/payment-service">Payment Service</a> - URL: http://payment-service.default.svc.cluster.local:3004</li>
        </ul>
    #
# curl http://site-service.default.svc.cluster.local:3000

        <h1>Welcome to the Shopping Site</h1>
        <p>Click the links below to access the APIs:</p>
        <ul>
            <li><a href="/user-service">User Service</a> - URL: http://user-service.default.svc.cluster.local:3001</li>
            <li><a href="/product-service">Product Service</a> - URL: http://product-service.default.svc.cluster.local:3002</li>
            <li><a href="/order-service">Order Service</a> - URL: http://order-service.default.svc.cluster.local:3003</li>
            <li><a href="/payment-service">Payment Service</a> - URL: http://payment-service.default.svc.cluster.local:3004</li>
        </ul>
        <p>Debug:</p>
        <ul>
            <li><a href="/user-service">User Service</a> - URL: http://user-service.default.svc.cluster.local:3001</li>
            <li><a href="/product-service">Product Service</a> - URL: http://product-service.default.svc.cluster.local:3002</li>
            <li><a href="/order-service">Order Service</a> - URL: http://order-service.default.svc.cluster.local:3003</li>
            <li><a href="/payment-service">Payment Service</a> - URL: http://payment-service.default.svc.cluster.local:3004</li>
        </ul>

# -----------------------------------------------------------------------------------------
# 進入site-service pod，無法從那裡連到user-service
# curl http://user-service.default.svc.cluster.local:3001
curl: (7) Failed to connect to user-service.default.svc.cluster.local port 3001: Connection refused

# -----------------------------------------------------------------------------------------
# 進入user-service pod，也無法連到它自己
jenkins@ip-172-16-10-31:~$ kubectl exec -it user-service-deployment-586977c859-9lvj9 -- curl http://localhost:3001/
curl: (7) Failed to connect to localhost port 3001: Connection refused
command terminated with exit code 7
jenkins@ip-172-16-10-31:~$ kubectl exec -it user-service-deployment-586977c859-9lvj9 -- curl http://0.0.0.0:3001/
curl: (7) Failed to connect to 0.0.0.0 port 3001: Connection refused
command terminated with exit code 7
jenkins@ip-172-16-10-31:~$ kubectl exec -it user-service-deployment-586977c859-9lvj9 -- curl http://user-service.default.svc.cluster.local:3001
curl: (7) Failed to connect to user-service.default.svc.cluster.local port 3001: Connection refused
command terminated with exit code 7
jenkins@ip-172-16-10-31:~$ kubectl exec -it user-service-deployment-586977c859-9lvj9 -- /bin/sh
# curl http://localhost:3001/
curl: (7) Failed to connect to localhost port 3001: Connection refused
#
command terminated with exit code 7
# -----------------------------------------------------------------------------------------


# -----------------------------------------------------------------------------------------

```