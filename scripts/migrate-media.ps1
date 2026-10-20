# Task 2: migrate legacy media into apps/web/public, kebab-case names,
# record rename map, compress the oversized hero image.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$legacy = 'c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\Dellics Travels\Dellics Travels'
$web = 'c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\web\public'
$mapFile = 'c:\Users\Dell\Desktop\PROjects\Dellics Travels\docs\superpowers\notes\media-rename-map.md'

$dirs = @(
    "$web\images\africa", "$web\images\asia", "$web\images\europe",
    "$web\images\middle-east", "$web\images\north-america", "$web\images\services",
    "$web\videos", "$web\badges",
    (Split-Path $mapFile)
)
foreach ($d in $dirs) { New-Item -ItemType Directory -Force -Path $d | Out-Null }

function Get-KebabName([string]$name) {
    $n = $name.ToLowerInvariant()
    $n = $n -replace '[ _]', '-'
    $n = $n -replace '-{2,}', '-'
    return $n
}

$map = New-Object System.Collections.Generic.List[string]
$map.Add('| Destination | Legacy file | New file |')
$map.Add('|---|---|---|')

# source spec: @{ Src = <path>; Dest = <dir>; Recurse = <bool> }
$copies = @(
    @{ Src = "$legacy\images\Africa";         Dest = "$web\images\africa";        Recurse = $false },
    @{ Src = "$legacy\images\Asia";           Dest = "$web\images\asia";          Recurse = $false },
    @{ Src = "$legacy\images\Europe";         Dest = "$web\images\europe";        Recurse = $false },
    @{ Src = "$legacy\images\Middle_East";    Dest = "$web\images\middle-east";   Recurse = $false },
    @{ Src = "$legacy\images\North_America";  Dest = "$web\images\north-america"; Recurse = $false },
    @{ Src = "$legacy\images";                Dest = "$web\images\services";      Recurse = $false },
    @{ Src = "$legacy\licensedaccredited";    Dest = "$web\badges";               Recurse = $false }
)

foreach ($c in $copies) {
    Get-ChildItem -LiteralPath $c.Src -File | ForEach-Object {
        $newName = Get-KebabName $_.Name
        $target = Join-Path $c.Dest $newName
        # collision safety: suffix with -2, -3, ...
        $i = 2
        $stem = [System.IO.Path]::GetFileNameWithoutExtension($newName)
        $ext = [System.IO.Path]::GetExtension($newName)
        while (Test-Path -LiteralPath $target) {
            $target = Join-Path $c.Dest ("$stem-$i$ext")
            $i++
        }
        Copy-Item -LiteralPath $_.FullName -Destination $target
        if ($_.Name -ne (Split-Path $target -Leaf)) {
            $rel = $target.Substring($web.Length + 1).Replace('\', '/')
            $map.Add("| $rel | $($_.Name) | $(Split-Path $target -Leaf) |")
        }
    }
}

# videos + logo (explicit kebab names per plan)
Copy-Item -LiteralPath "$legacy\airporttravels\airport transportation.mp4" -Destination "$web\videos\airport-transfers.mp4"
Copy-Item -LiteralPath "$legacy\hotelsandairbnb\hotel.mp4" -Destination "$web\videos\hotels.mp4"
Copy-Item -LiteralPath "$legacy\company logo.png" -Destination "$web\logo.png"
$map.Add('| videos/airport-transfers.mp4 | airporttravels\airport transportation.mp4 | airport-transfers.mp4 |')
$map.Add('| videos/hotels.mp4 | hotelsandairbnb\hotel.mp4 | hotels.mp4 |')
$map.Add('| logo.png | company logo.png | logo.png |')

Set-Content -LiteralPath $mapFile -Value ($map -join "`r`n") -Encoding utf8
Write-Output ("Rename map written: {0} entries" -f ($map.Count - 2))

# Compress Tanzania hero image: max 2000px wide, JPEG quality 75, overwrite.
$hero = "$web\images\services\tanzania.jpg"
$heroSizeBefore = [math]::Round((Get-Item -LiteralPath $hero).Length / 1KB)
$img = [System.Drawing.Image]::FromFile($hero)
$scale = [Math]::Min(1.0, 2000.0 / $img.Width)
$w = [int]($img.Width * $scale)
$h = [int]($img.Height * $scale)
$resized = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($resized)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, $w, $h)
$g.Dispose(); $img.Dispose()

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [long]75)

$tmp = "$hero.tmp"
$resized.Save($tmp, $encoder, $encParams)
$resized.Dispose()
Move-Item -LiteralPath $tmp -Destination $hero -Force
Write-Output ("Hero compressed: {0} KB -> {1} KB" -f `
    $heroSizeBefore, [math]::Round((Get-Item -LiteralPath $hero).Length / 1KB))
