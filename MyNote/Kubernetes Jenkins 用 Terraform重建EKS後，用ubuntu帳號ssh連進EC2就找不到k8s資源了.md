# unbuntu帳戶裡的kubeconfig檔案是舊的，jenkins帳戶裡的kubeconfig檔案是新建的。所以unbuntu連不到，jenkins連得到。
ubuntu@ip-172-16-10-31:~$ kubectl get nodes -o wide
Unable to connect to the server: dial tcp: lookup 67A11B0A0F022F2FDB3CD859A49AD01E.gr7.us-east-1.eks.amazonaws.com on 127.0.0.53:53: no such host
ubuntu@ip-172-16-10-31:~$ kubectl get pods
Unable to connect to the server: dial tcp: lookup 67A11B0A0F022F2FDB3CD859A49AD01E.gr7.us-east-1.eks.amazonaws.com on 127.0.0.53:53: no such host
ubuntu@ip-172-16-10-31:~$ kubectl get services
Unable to connect to the server: dial tcp: lookup 67A11B0A0F022F2FDB3CD859A49AD01E.gr7.us-east-1.eks.amazonaws.com on 127.0.0.53:53: no such host
ubuntu@ip-172-16-10-31:~$ sudo su - jenkins
jenkins@ip-172-16-10-31:~$ kubectl get nodes -o wide
NAME                           STATUS   ROLES    AGE   VERSION               INTERNAL-IP    EXTERNAL-IP    OS-IMAGE
     KERNEL-VERSION                    CONTAINER-RUNTIME
ip-172-16-11-46.ec2.internal   Ready    <none>   49m   v1.31.0-eks-a737599   172.16.11.46   54.174.230.1   Amazon Linux 2023.6.20241010   6.1.112-122.189.amzn2023.x86_64   containerd://1.7.22
jenkins@ip-172-16-10-31:~$ kubectl get pods
NAME                                      READY   STATUS    RESTARTS   AGE
aws-for-fluent-bit-gspc2                  1/1     Running   0          42m
user-service-deployment-8c459c675-fxkqk   1/1     Running   0          42m
jenkins@ip-172-16-10-31:~$ kubectl get services
NAME                   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
aws-for-fluent-bit     ClusterIP   10.100.175.209   <none>        2020/TCP   42m
kubernetes             ClusterIP   10.100.0.1       <none>        443/TCP    54m
user-service-service   ClusterIP   10.100.155.248   <none>        3001/TCP   42m

# 要讓 `ubuntu` 帳戶也能隨時取得和 `jenkins` 帳戶一樣的 kubeconfig，你可以將 `jenkins` 帳戶的 kubeconfig 複製到 `ubuntu` 帳戶，或者設定一個共享的 kubeconfig 檔案路徑。以下是具體操作步驟：

### 方法 1：複製 kubeconfig 檔案
1. 先切換到 `jenkins` 帳戶：
    ```bash
    sudo su - jenkins
    ```
2. 確認 `jenkins` 帳戶的 kubeconfig 檔案位置，通常是 `~/.kube/config`：
    ```bash
    echo $KUBECONFIG
    ```
    或檢查 `~/.kube/config`：
    ```bash
    ls ~/.kube/config
    ```
3. 將 kubeconfig 複製到 `ubuntu` 帳戶的 `.kube` 目錄：
    ```bash
    sudo cp /var/lib/jenkins/.kube/config /home/ubuntu/.kube/config
    sudo chown ubuntu:ubuntu /home/ubuntu/.kube/config
    ```
    這會把 `jenkins` 的 kubeconfig 複製給 `ubuntu`，並設定正確的權限。

### 方法 2：設定共享 kubeconfig 檔案
1. 把 `jenkins` 的 kubeconfig 設為一個共享路徑，例如 `/shared/kubeconfig`：
    ```bash
    sudo mkdir -p /shared
    sudo cp /var/lib/jenkins/.kube/config /shared/kubeconfig
    sudo chmod 644 /shared/kubeconfig
    ```
2. 在 `ubuntu` 帳戶下設定 `KUBECONFIG` 環境變數指向這個共享檔案：
    編輯 `~/.bashrc` 或 `~/.zshrc`（取決於你用的 shell）：
    ```bash
    nano ~/.bashrc
    ```
    在檔案末尾加上：
    ```bash
    export KUBECONFIG=/shared/kubeconfig
    ```
3. 重新載入設定：
    ```bash
    source ~/.bashrc
    ```

這樣無論是 `ubuntu` 還是 `jenkins` 帳戶，都會使用同一個 kubeconfig 檔案，確保指令執行時能連到正確的 Kubernetes cluster。

# 是的，當你在 `ubuntu` 和 `jenkins` 兩個帳號中都設置 `KUBECONFIG` 環境變數為 `/shared/kubeconfig` 時，這兩個帳號實際上是讀取同一個檔案。

這表示：
1. **共享配置：** 任何一方對 `/shared/kubeconfig` 檔案的修改（例如，新增、刪除或更新配置）都會立即影響另一方，因為它們都在使用同一個檔案。

2. **權限考量：** 確保 `jenkins` 和 `ubuntu` 兩個帳號都具有讀取和（如果需要）寫入 `/shared/kubeconfig` 檔案的適當權限。你可以使用 `chmod` 和 `chown` 來設定檔案的權限和擁有者，以確保兩個帳號都能正確訪問這個檔案。

3. **檔案位置：** `/shared/kubeconfig` 應該是一個公共可訪問的路徑，讓兩個帳號都能夠存取。如果 `/shared` 資料夾的權限不正確，則可能會導致其中一個帳號無法讀取該檔案。

如果有進一步的需求或疑問，隨時告訴我！