在 AWS EKS 控制台中，無法直接找到服務的 URL，因為 Kubernetes 本身並不會自動為服務分配公開的網址。你可以透過以下步驟取得服務的 URL：

1. **檢查 Service 的 Type**：  
   - 如果服務的 `Type` 設為 `LoadBalancer`，Kubernetes 會為該服務自動配置一個公共 IP 或 URL。確認服務的 `Type` 設定是否正確：
     ```bash
     kubectl get services
     ```

2. **獲取 LoadBalancer 的 URL 或 IP**：
   - 在 `kubectl get services` 的輸出中，查看 `EXTERNAL-IP` 欄位，這將顯示為服務分配的公共 IP 或 DNS 名稱。

3. **從 AWS EKS 控制台進入 ELB 控制台**：
   - 如果服務設定了 `LoadBalancer`，EKS 會在 AWS 中建立一個 ELB（Elastic Load Balancer）。可以在 AWS 管理控制台上選擇「EC2」服務，然後從左側選單找到「Load Balancers」以檢視自動創建的 ELB。
   - 點擊 ELB 名稱進入其詳細資料，複製該 URL。
   在 ELB（Elastic Load Balancer）的詳細頁面中，應該找到一個名為 **DNS name** 的欄位，這就是服務的 URL。您可以從這個欄位中複製 ELB 為服務配置的公共 URL，用來在外部存取您的 EKS 服務。

      ### 檢視方法：
      1. 進入 **EC2 控制台** > **Load Balancers**。
      2. 選擇 EKS 自動建立的 Load Balancer，名稱通常以 `k8s-` 開頭，後面跟著服務名稱和一串隨機字元。
      3. 點擊 Load Balancer 名稱，然後在詳細頁面的 **Description**（描述）標籤下找到 **DNS name** 欄位，這個欄位就是 Load Balancer 的 URL。

      複製該 **DNS name** 就可以用來從外部訪問您的服務。
      您需要在瀏覽器的網址列輸入完整的 URL 格式，包括 **`http://`** 以及 **port 號**（如果服務不是使用默認的 80 或 443 埠）。
      例如：

      ```plaintext
      http://a38a29ebb069143378fa9630da9e32ed-177998864.us-east-1.elb.amazonaws.com:3001
      ```

      其中 `http://` 是必要的，因為瀏覽器會根據這個協定去請求服務。另外，**port 號**必須是您的服務所設定的公開端口，例如您在 `values.yaml` 中的 3001 或其他端口。如果是 80（HTTP）或 443（HTTPS）埠，則可以省略不寫。

      以下列結果而言，應以**`http://a38a29ebb069143378fa9630da9e32ed-177998864.us-east-1.elb.amazonaws.com:3001`**來檢視服務：
      理由：
      - **`3001`** 是您在 `values.yaml` 中為 `user-service` 指定的端口，它對應於 `user-service` 的容器內部端口。
      - **`31819`** 是 Kubernetes 服務的 **NodePort**（如果您使用 `NodePort` 服務類型），在這種情況下是由 Kubernetes 分配的，通常用於直接通過工作節點的 IP 訪問服務，但這並不是您在 `values.yaml` 中明確設定的端口。

      因此，對於正確的訪問，使用您在 `values.yaml` 中設定的端口 **3001**，URL 應為：
      ```
      http://a38a29ebb069143378fa9630da9e32ed-177998864.us-east-1.elb.amazonaws.com:3001      ```
      這樣可以正確訪問 `user-service` 服務。如果您發現無法連接，請檢查安全組的設定，確保端口 3001 是開放的。

      根據的是下列佈署結果：
      jenkins@ip-172-16-10-31:~$ kubectl get deployments
      NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
      user-service-deployment   1/1     1            1           45m
      jenkins@ip-172-16-10-31:~$ kubectl get nodes
      NAME                           STATUS   ROLES    AGE   VERSION
      ip-172-16-11-88.ec2.internal   Ready    <none>   53m   v1.31.0-eks-a737599
      jenkins@ip-172-16-10-31:~$ kubectl get pods
      NAME                                      READY   STATUS    RESTARTS   AGE
      aws-for-fluent-bit-wm7kf                  1/1     Running   0          45m
      user-service-deployment-8c459c675-7blhq   1/1     Running   0          45m
      jenkins@ip-172-16-10-31:~$ kubectl get services
      NAME                   TYPE           CLUSTER-IP       EXTERNAL-IP                                                              PORT(S)          AGE
      aws-for-fluent-bit     ClusterIP      10.100.195.178   <none>                                                                   2020/TCP         45m
      kubernetes             ClusterIP      10.100.0.1       <none>                                                                   443/TCP          58m
      user-service-service   LoadBalancer   10.100.254.47    a38a29ebb069143378fa9630da9e32ed-177998864.us-east-1.elb.amazonaws.com   3001:31819/TCP   45m
      jenkins@ip-172-16-10-31:~$ kubectl get nodes -o wide
      NAME                           STATUS   ROLES    AGE   VERSION               INTERNAL-IP    EXTERNAL-IP      OS-IMAGE
            KERNEL-VERSION                    CONTAINER-RUNTIME
      ip-172-16-11-88.ec2.internal   Ready    <none>   54m   v1.31.0-eks-a737599   172.16.11.88   18.207.113.237   Amazon Linux 2023.6.20241010   6.1.112-122.189.amzn2023.x86_64   containerd://1.7.22      

4. **自訂域名（可選）**：
   - 如果你有自訂的域名，可以在 DNS 設定中新增一個 CNAME 記錄，將該域名指向 ELB 的 DNS 名稱。

如果你的服務 `Type` 設為 `ClusterIP`，它只會在 EKS 叢集內部可用，無法直接取得外部 URL。


