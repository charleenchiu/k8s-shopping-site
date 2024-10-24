你可以切換回 `ubuntu` 帳號，然後執行以下步驟來解決 `jenkins` 帳號無法使用 `sudo` 的問題：

1. **切換回 `ubuntu` 帳號：**
   ```
   exit
   ```

2. **將 `jenkins` 帳號加入 `sudo` 群組：**
   在 `ubuntu` 帳號下，執行以下命令將 `jenkins` 帳號加入 `sudo` 群組：
   ```
   sudo usermod -aG sudo jenkins
   ```

3. **確認 `jenkins` 帳號是否已經加入 `sudo` 群組：**
   可以執行以下命令來檢查 `jenkins` 帳號是否已成功加入 `sudo` 群組：
   ```
   sudo groups jenkins
   ```

4. **重新登入 `jenkins` 帳號：**
   為了讓更改生效，你需要重新登出並再次登入 `jenkins` 帳號：
   ```
   sudo su - jenkins
   ```

這樣 `jenkins` 帳號應該就能夠使用 `sudo` 權限，並能夠創建 `/shared` 目錄以及進行其他需要 `sudo` 的操作。

# 在 `jenkins` 帳戶下編輯 `~/.bashrc`，並添加 `export KUBECONFIG=/shared/kubeconfig` 的話，將會有以下效果：

1. **設置 `KUBECONFIG` 環境變數：** 
   這行命令將 `KUBECONFIG` 環境變數設置為 `/shared/kubeconfig`，這表示 `kubectl` 將會使用 `/shared/kubeconfig` 這個檔案來連接到 Kubernetes 叢集。這樣可以讓 `jenkins` 帳號可以隨時存取 Kubernetes 叢集，而不需要每次都指定 `kubeconfig` 的路徑。

2. **載入設定：**
   執行 `source ~/.bashrc` 將會重新載入 `~/.bashrc` 設定檔，這樣剛剛添加的環境變數會立即生效。

3. **無法在 `ubuntu` 帳號中影響：** 
   注意，這些改動僅會影響 `jenkins` 帳號的環境。如果你在 `ubuntu` 帳號下執行這些操作，不會影響 `jenkins` 帳號的環境變數。

4. **確保 `/shared/kubeconfig` 可讀取：** 
   確保 `/shared/kubeconfig` 檔案的權限設置正確，`jenkins` 帳號需要有讀取這個檔案的權限。如果權限不足，則 `kubectl` 可能無法使用這個配置檔案。

### 如果你想讓 `ubuntu` 帳號也能使用同樣的 `KUBECONFIG` 設定，你需要：

1. **在 `ubuntu` 帳號的 `~/.bashrc` 中也添加相同的行：**
   ```
   export KUBECONFIG=/shared/kubeconfig
   ```

2. **重新載入 `ubuntu` 帳號的設定：**
   ```
   source ~/.bashrc
   ```

這樣兩個帳號就都能使用 `/shared/kubeconfig` 來連接 Kubernetes 叢集了。