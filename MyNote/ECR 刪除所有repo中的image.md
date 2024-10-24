要刪除所有名為 `k8s-shopping-site/*` 的 ECR Public 存儲庫中的映像，可以使用 AWS CLI 來執行以下步驟：

### 步驟 1：列出所有存儲庫
首先，列出所有的 ECR Public 存儲庫，以確定有哪些存儲庫需要刪除映像。

```bash
aws ecr-public describe-repositories --repository-names "k8s-shopping-site/*"
```

### 步驟 2：刪除映像
對於每個存儲庫，你需要先列出它們的所有映像，然後刪除這些映像。

這裡是一個使用 bash 的示範腳本，來自動刪除所有匹配 `k8s-shopping-site/*` 的存儲庫中的映像：

```bash
#!/bin/bash

# 列出所有名為 k8s-shopping-site/* 的存儲庫
repos=$(aws ecr-public describe-repositories --query "repositories[?starts_with(repositoryName, 'k8s-shopping-site/')].repositoryName" --output text)

# 對每個存儲庫執行操作
for repo in $repos; do
    echo "Processing repository: $repo"

    # 列出映像
    image_ids=$(aws ecr-public describe-images --repository-name "$repo" --query "imageDetails[*].imageDigest" --output text)

    # 如果有映像，則刪除
    if [ -n "$image_ids" ]; then
        echo "Deleting images from $repo..."
        aws ecr-public batch-delete-image --repository-name "$repo" --image-ids $image_ids
    else
        echo "No images to delete in $repo."
    fi
done

echo "All images deleted."
```

### 步驟 3：刪除存儲庫（可選）
如果你希望刪除這些存儲庫本身，可以在清除映像後執行以下命令：

```bash
for repo in $repos; do
    echo "Deleting repository: $repo"
    aws ecr-public delete-repository --repository-name "$repo" --force
done
```

### 注意事項
- 確保你的 AWS CLI 已正確配置，並且你有足夠的權限來刪除映像和存儲庫。
- 使用 `--force` 參數會在刪除存儲庫之前自動刪除所有映像，但這是一個不可逆的操作，因此請在執行之前確認。


# 當然，這裡是繼續的步驟：

### 步驟 2：編輯腳本內容

在 `nano` 編輯器中，將以下腳本內容貼上：

```bash
#!/bin/bash

# 設定 AWS CLI 和 ECR 的相關變數
REGISTRY_ID="167804136284"  # 替換為你的 ECR Registry ID
REPO_PREFIX="k8s-shopping-site"

# 獲取所有以指定前綴開頭的 ECR repository 名稱
repos=$(aws ecr-public describe-repositories --query "repositories[?starts_with(repositoryName, '${REPO_PREFIX}')].repositoryName" --output text)

# 刪除所有 repository 內的映像
for repo in $repos; do
    echo "Deleting images in repository: $repo"
    # 獲取所有映像的 tag 或 digest
    images=$(aws ecr-public list-images --repository-name $repo --query "imageIds[*]" --output json)

    # 如果有映像，則刪除
    if [ "$(echo $images | jq '. | length')" -gt 0 ]; then
        echo "Images found in $repo. Deleting..."
        # 刪除所有映像
        aws ecr-public batch-delete-image --repository-name $repo --image-ids "$images"
    else
        echo "No images found in $repo."
    fi
done

echo "All images in repositories with prefix '${REPO_PREFIX}' have been deleted."
```

### 步驟 3：儲存檔案並退出編輯器

1. **儲存檔案**：在 `nano` 中，按 `CTRL + O` 然後按 `Enter` 鍵來儲存檔案。
2. **退出編輯器**：按 `CTRL + X` 鍵退出 `nano` 編輯器。

### 步驟 4：設定執行權限

為了能夠執行這個腳本，你需要為它設定執行權限。執行以下命令：

```bash
chmod +x delete_ecr_images.sh
```

### 步驟 5：執行腳本

現在，你可以執行這個腳本來刪除所有名為 `k8s-shopping-site/*` 的 repository 內的映像：

```bash
./delete_ecr_images.sh
```

### 注意事項

- 確保你已經安裝了 AWS CLI 並且已經配置了適當的 AWS 資訊（如 `aws configure`）。
- 確保你有適當的權限來刪除 ECR 中的映像和 repository。

這樣就完成了儲存和執行 bash 檔案的步驟！如果有其他問題，隨時可以問我。