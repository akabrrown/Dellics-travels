$ErrorActionPreference = 'Stop'
Set-Location 'c:\Users\Dell\Desktop\PROjects\Dellics Travels\packages\database'
$line = Get-Content 'c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\api\.env' | Select-String '^DATABASE_URL=' | Select-Object -First 1
$url = ($line.Line -replace '^DATABASE_URL=', '').Trim('"')
$env:DATABASE_URL = $url
pnpm exec prisma db push
