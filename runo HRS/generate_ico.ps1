Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Rishabh.Tripathi\.gemini\antigravity-ide\brain\9e0e0377-a366-42ca-bbb1-a800c0dfddf5\app_icon_1788962527276.jpg"
$destPng = Join-Path $PSScriptRoot "src\assets\icon.png"
$destIco = Join-Path $PSScriptRoot "src\assets\app.ico"

# 1. Load source image
$srcImg = [System.Drawing.Image]::FromFile($srcPath)

# 2. Save true PNG
$srcImg.Save($destPng, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved true PNG: $destPng"

# 3. Create resized bitmaps for standard Windows icon sizes: 256, 128, 64, 48, 32, 16
$sizes = @(256, 128, 64, 48, 32, 16)
$pngBytesList = @()

foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($srcImg, 0, 0, $size, $size)
    $g.Dispose()

    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $pngBytesList += ,@($size, $ms.ToArray())
    $ms.Dispose()
}

$srcImg.Dispose()

# 4. Write valid Windows ICO file format
$fs = [System.IO.File]::Create($destIco)
$bw = New-Object System.IO.BinaryWriter $fs

# ICONDIR header:
$bw.Write([UInt16]0) # Reserved = 0
$bw.Write([UInt16]1) # Type = 1 (ICO)
$bw.Write([UInt16]$pngBytesList.Count) # Image count

# Calculate offsets: 6 + (16 * count)
$offset = 6 + (16 * $pngBytesList.Count)

foreach ($entry in $pngBytesList) {
    $size = $entry[0]
    $bytes = $entry[1]
    
    $w = if ($size -ge 256) { 0 } else { [byte]$size }
    $h = if ($size -ge 256) { 0 } else { [byte]$size }
    
    $bw.Write([byte]$w)
    $bw.Write([byte]$h)
    $bw.Write([byte]0)
    $bw.Write([byte]0)
    $bw.Write([UInt16]1)
    $bw.Write([UInt16]32)
    $bw.Write([UInt32]$bytes.Length)
    $bw.Write([UInt32]$offset)
    
    $offset += $bytes.Length
}

foreach ($entry in $pngBytesList) {
    $bytes = $entry[1]
    $bw.Write($bytes, 0, $bytes.Length)
}

$bw.Close()
$fs.Close()
Write-Host "Saved valid multi-size Windows ICO: $destIco"
