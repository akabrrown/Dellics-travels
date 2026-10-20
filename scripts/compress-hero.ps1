$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$src = 'c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\Dellics Travels\Dellics Travels\images\Tanzania.jpg'
$hero = 'c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\web\public\images\services\tanzania.jpg'
$img = [System.Drawing.Image]::FromFile($src)
$w = 1800
$h = [int]($img.Height * ($w / $img.Width))
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, $w, $h)
$g.Dispose(); $img.Dispose()
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]70)
$tmp = "$hero.tmp"
$bmp.Save($tmp, $encoder, $encParams)
$bmp.Dispose()
Move-Item -LiteralPath $tmp -Destination $hero -Force
Write-Output ("Hero: 1800px q70 -> {0} KB" -f [math]::Round((Get-Item -LiteralPath $hero).Length / 1KB))
