powershell -command "&{$p='HKCU:SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StuckRects3';$v=(Get-ItemProperty -Path $p).Settings;$v[8]=3;&Set-ItemProperty -Path $p -Name Settings -Value $v;&Stop-Process -f -ProcessName explorer}"
taskkill /F /IM explorer.exe
explorer.exe
ping 127.0.0.1 -n 2 > nul
taskkill /F /IM explorer.exe
