Param(
  [string]$ImagesDir = "assets/img/products",
  [int]$MaxWidth = 1000,
  [int]$Quality = 82
)

function Has-Tool($name){ (Get-Command $name -ErrorAction SilentlyContinue) -ne $null }

if (-not (Test-Path $ImagesDir)) { Write-Error "Not found: $ImagesDir"; exit 1 }

if (-not (Has-Tool "magick")) {
  Write-Warning "ImageMagick (magick) not found. Install from https://imagemagick.org or via winget: winget install ImageMagick.ImageMagick"
  exit 1
}

$files = Get-ChildItem -File $ImagesDir | Where-Object { $_.Extension -match '\.(jpe?g|png)$' }
foreach($f in $files){
  $out = Join-Path $f.DirectoryName ( [IO.Path]::GetFileNameWithoutExtension($f.Name) + ".webp" )
  & magick convert "$($f.FullName)" -resize "$MaxWidth>" -quality $Quality "$out"
  Write-Host "Converted" $f.Name "->" (Split-Path -Leaf $out)
}

