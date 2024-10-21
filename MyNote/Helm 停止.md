
指令
```sh
helm uninstall my-release
```

PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> kubectl get nodes                               
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   15h   v1.31.0
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> kubectl get services
NAME            TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
kubernetes      ClusterIP   10.96.0.1        <none>        443/TCP    15h
nginx-service   ClusterIP   10.101.162.207   <none>        80/TCP     15h
redis-service   ClusterIP   10.107.28.153    <none>        6379/TCP   15h
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> helm uninstall my-release
release "my-release" uninstalled
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> kubectl get services     
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   15h
PS C:\charleen\LearnDevops\k8s-shopping-site_1_simple\test-chart> kubectl get nodes        
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   15h   v1.31.0
