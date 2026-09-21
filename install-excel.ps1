# ============================================================
# Windows XP Web Simulator - Excel 2003 style spreadsheet installer
#
# Engine:
#   Luckysheet 2.1.13
#   LuckyExcel 1.0.1
#   SheetJS 0.18.5
#
# Run this .ps1 FILE from portfolio-website root.
# DO NOT paste its contents line-by-line into PowerShell.
# ============================================================

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$Root = (Get-Location).Path
$Apps = Join-Path $Root "static\screen\apps"

if (-not (Test-Path $Apps)) {
    throw "static\screen\apps bulunamadi. PowerShell'i portfolio-website kokunde ac."
}

$Candidates = @("excel","msexcel","excel2003","spreadsheet")
$Existing = @($Candidates | Where-Object { Test-Path (Join-Path $Apps $_) })

if ($Existing.Count -eq 1) {
    $FolderName = $Existing[0]
} else {
    $FolderName = "excel"
}

$Target = Join-Path $Apps $FolderName
$Temp = Join-Path $env:TEMP ("xp-excel-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $Temp -Force | Out-Null

try {
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host " MICROSOFT EXCEL 2003 STYLE - XP INSTALLER"
    Write-Host " Hedef klasor: $FolderName"
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host ""

    if (Test-Path $Target) {
        $Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
        $Backup = Join-Path $Apps ($FolderName + "-backup-" + $Stamp)
        Write-Host "[1/7] Mevcut Excel klasoru yedekleniyor..." -ForegroundColor Yellow
        Move-Item $Target $Backup -Force
        Write-Host "      $Backup" -ForegroundColor DarkGray
    } else {
        Write-Host "[1/7] Mevcut Excel klasoru yok." -ForegroundColor DarkGray
    }

    Write-Host "[2/7] XP Excel kabugu kuruluyor..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $Target -Force | Out-Null

    $EmbeddedZip = Join-Path $Temp "app.zip"
    $Base64 = @'
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
'@
    [IO.File]::WriteAllBytes($EmbeddedZip,[Convert]::FromBase64String($Base64))
    Expand-Archive -Path $EmbeddedZip -DestinationPath $Target -Force

    Write-Host "[3/7] Luckysheet 2.1.13 indiriliyor..." -ForegroundColor Yellow
    $LuckyTgz = Join-Path $Temp "luckysheet.tgz"
    Invoke-WebRequest `
      -Uri "https://registry.npmjs.org/luckysheet/-/luckysheet-2.1.13.tgz" `
      -OutFile $LuckyTgz `
      -UseBasicParsing

    $LuckyExtract = Join-Path $Temp "luckysheet"
    New-Item -ItemType Directory -Path $LuckyExtract -Force | Out-Null

    $Tar = Get-Command tar.exe -ErrorAction SilentlyContinue
    if (-not $Tar) {
        throw "Windows tar.exe bulunamadi. Windows 10/11'in yerlesik tar araci gerekli."
    }

    & tar.exe -xzf $LuckyTgz -C $LuckyExtract
    if ($LASTEXITCODE -ne 0) { throw "Luckysheet paketi acilamadi." }

    $LuckyDist = Join-Path $LuckyExtract "package\dist"
    if (-not (Test-Path (Join-Path $LuckyDist "luckysheet.umd.js"))) {
        throw "Luckysheet dist/luckysheet.umd.js bulunamadi."
    }

    $LuckyVendor = Join-Path $Target "vendor\luckysheet"
    New-Item -ItemType Directory -Path $LuckyVendor -Force | Out-Null
    Copy-Item (Join-Path $LuckyDist "*") $LuckyVendor -Recurse -Force

    Write-Host "[4/7] LuckyExcel 1.0.1 indiriliyor..." -ForegroundColor Yellow
    $ExcelTgz = Join-Path $Temp "luckyexcel.tgz"
    Invoke-WebRequest `
      -Uri "https://registry.npmjs.org/luckyexcel/-/luckyexcel-1.0.1.tgz" `
      -OutFile $ExcelTgz `
      -UseBasicParsing

    $ExcelExtract = Join-Path $Temp "luckyexcel"
    New-Item -ItemType Directory -Path $ExcelExtract -Force | Out-Null
    & tar.exe -xzf $ExcelTgz -C $ExcelExtract
    if ($LASTEXITCODE -ne 0) { throw "LuckyExcel paketi acilamadi." }

    $ExcelDist = Join-Path $ExcelExtract "package\dist"
    $LuckyExcelJs = Get-ChildItem $ExcelDist -Recurse -File -Filter "luckyexcel.umd.js" | Select-Object -First 1
    if (-not $LuckyExcelJs) {
        throw "LuckyExcel luckyexcel.umd.js bulunamadi."
    }

    $ExcelVendor = Join-Path $Target "vendor\luckyexcel"
    New-Item -ItemType Directory -Path $ExcelVendor -Force | Out-Null
    Copy-Item $ExcelDist\* $ExcelVendor -Recurse -Force

    Write-Host "[5/7] SheetJS XLSX helper indiriliyor..." -ForegroundColor Yellow
    $SheetVendor = Join-Path $Target "vendor\sheetjs"
    New-Item -ItemType Directory -Path $SheetVendor -Force | Out-Null
    Invoke-WebRequest `
      -Uri "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js" `
      -OutFile (Join-Path $SheetVendor "xlsx.full.min.js") `
      -UseBasicParsing

    Write-Host "[6/7] Runtime dosyalari kontrol ediliyor..." -ForegroundColor Yellow
    $Required = @(
      "index.html",
      "icon.png",
      "README.txt",
      "vendor\luckysheet\luckysheet.umd.js",
      "vendor\luckysheet\plugins\js\plugin.js",
      "vendor\luckysheet\css\luckysheet.css",
      "vendor\luckyexcel\luckyexcel.umd.js",
      "vendor\sheetjs\xlsx.full.min.js"
    )

    foreach ($File in $Required) {
        if (-not (Test-Path (Join-Path $Target $File))) {
            throw "Eksik dosya: $File"
        }
    }

    Write-Host "[7/7] Kurulum tamamlandi." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host " EXCEL KURULDU"
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Klasor:" -ForegroundColor White
    Write-Host "  $Target" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Test:" -ForegroundColor White
    Write-Host "  http://localhost:8080/screen/apps/$FolderName/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Runtime'da Node.js veya backend gerekmez." -ForegroundColor Green
    Write-Host "Registry.js degistirilmedi." -ForegroundColor Yellow
}
finally {
    Remove-Item $Temp -Recurse -Force -ErrorAction SilentlyContinue
}
