# Repair stale junctions left over from an isolated-linker install across the
# workspace. Any broken junction under a workspace node_modules is re-pointed
# at the hoisted root copy. Junction removal never touches link targets.
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

function Repair-Junctions($dir, $label) {
    if (-not (Test-Path -LiteralPath $dir)) { return }
    Get-ChildItem -LiteralPath $dir -Force -ErrorAction SilentlyContinue |
        Where-Object { $_.LinkType -eq 'Junction' } |
        ForEach-Object {
            $name = $_.Name
            $p = $_.FullName
            # Junction is healthy if its own package.json resolves.
            if (Test-Path -LiteralPath (Join-Path $p 'package.json')) { return }

            $target = Join-Path $root "node_modules\$label$name"
            [System.IO.Directory]::Delete($p, $false)
            if (Test-Path -LiteralPath (Join-Path $target 'package.json')) {
                New-Item -ItemType Junction -Path $p -Target $target | Out-Null
                Write-Output "FIXED   $ws\node_modules\$label$name -> root"
            } else {
                Write-Output "DROPPED $ws\node_modules\$label$name (no hoisted copy at root)"
            }
        }
}

foreach ($ws in $workspaces) {
    $nm = Join-Path $root "$ws\node_modules"
    if (-not (Test-Path -LiteralPath $nm)) { continue }
    Repair-Junctions $nm ''
    Get-ChildItem -LiteralPath $nm -Force -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name.StartsWith('@') } |
        ForEach-Object { Repair-Junctions $_.FullName ($_.Name + '\') }
}
Write-Output 'done'
