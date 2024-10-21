# windows power shell如何把指令回應的內容存成一個文字檔？

- 你可以使用 Out-File 或 Set-Content 來將指令回應的內容存成文字檔。以下是範例：

使用 Out-File 將指令回應存成文字檔：
```sh
Get-Process | Out-File -FilePath "C:\path\to\your\file.txt"
```

使用 Set-Content 將指令回應存成文字檔：
```sh
Get-Process | Set-Content -Path "C:\path\to\your\file.txt"
```