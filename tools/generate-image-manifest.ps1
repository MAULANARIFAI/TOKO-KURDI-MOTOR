Param(
  [string]$ImagesDir = "assets/img/products",
  [string]$OutFile = "assets/data/product-images.json"
)

if (-not (Test-Path $ImagesDir)) { Write-Error "Not found: $ImagesDir"; exit 1 }
$files = Get-ChildItem -File -Path $ImagesDir | Select-Object -ExpandProperty Name
$json = $files | ConvertTo-Json -Depth 1
Set-Content -Path $OutFile -Value $json -Encoding UTF8
Write-Host "Wrote manifest:" $OutFile

