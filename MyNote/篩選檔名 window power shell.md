```sh
git ls-tree -r origin/1_simple --name-only | Select-String -Pattern 'main.tf'
```