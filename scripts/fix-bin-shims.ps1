# Ensure every package referenced by a workspace .bin shim exists locally.
# Missing entries get a junction to the hoisted root copy.
$ErrorActionPreference = 'Stop'
$root = 'c:\Users\Dell\Desktop\PROjects\Dellics Travels'

$workspaces = @(
    'apps\web',
    'apps\api',
    'apps\admin',
    'apps\mobile',
    'packages\ui',
    'packages\database',
    'packages\eslint-config',
    'packages\typescript-config'
)

foreach ($ws in $workspaces) {
    $bin = Join-Path $root "$ws\node_modules\.bin"
    if (-not (Test-Path -LiteralPath $bin)) { continue }

    $refs = Get-ChildItem -LiteralPath $bin -Filter '*.CMD' -File |
        Get-Content |
        Select-String -Pattern '\\\.\.\\((?:@[^\\]+\\)?[^\\]+)\\' -AllMatches |
        ForEach-Object { $_.Matches } |
        ForEach-Object { $_.Groups[1].Value } |
        Sort-Object -Unique

    foreach ($name in $refs) {
        $local = Join-Path $root "$ws\node_modules\$name"
        if (Test-Path -LiteralPath (Join-Path $local 'package.json')) { continue }
        $hoisted = Join-Path $root "node_modules\$name"
        if (-not (Test-Path -LiteralPath (Join-Path $hoisted 'package.json'))) {
            Write-Output "MISSING $ws needs '$name' (not hoisted at root)"
            continue
        }
        # remove any stale broken entry first (never follows the link)
        $item = Get-Item -LiteralPath $local -Force -ErrorAction SilentlyContinue
        if ($item) { [System.IO.Directory]::Delete($local, $false) }
        New-Item -ItemType Junction -Path $local -Target $hoisted | Out-Null
        Write-Output "FIXED   $ws\node_modules\$name -> root"
    }
}
Write-Output 'done'
