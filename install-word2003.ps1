# ============================================================
# Windows XP Web Simulator - Microsoft Word 2003 style
# Stage 3 engine: theRealestAEP/wordinweb (MIT)
#
# IMPORTANT:
# - Put this .ps1 FILE in portfolio-website root and RUN THE FILE.
# - DO NOT paste its contents line-by-line into PowerShell.
# - Node.js is needed only for this one-time Vite build.
# - Final runtime is static: no Node server / backend / daemon.
# ============================================================

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$Root = (Get-Location).Path
$Apps = Join-Path $Root "static\screen\apps"

if (-not (Test-Path $Apps)) {
    throw "static\screen\apps bulunamadi. PowerShell'i portfolio-website kokunde ac."
}

$Candidates = @("word","winword","msword","word2003")
$Existing = @($Candidates | Where-Object { Test-Path (Join-Path $Apps $_) })

if ($Existing.Count -eq 1) {
    $FolderName = $Existing[0]
} elseif ($Existing.Count -gt 1) {
    Write-Host "Birden fazla olasi Word klasoru bulundu:" -ForegroundColor Yellow
    $Existing | ForEach-Object { Write-Host "  - $_" }
    Write-Host "Guvenli varsayilan olarak word kullaniliyor." -ForegroundColor Yellow
    $FolderName = "word"
} else {
    $FolderName = "word"
}

$Target = Join-Path $Apps $FolderName

$Node = Get-Command node.exe -ErrorAction SilentlyContinue
$Npm  = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (-not $Node -or -not $Npm) {
    throw "Node.js/npm bulunamadi. Node.js 20+ kurup installer'i tekrar calistir."
}

$NodeVersion = (& node.exe --version).Trim().TrimStart('v')
$NodeMajor = [int](($NodeVersion -split '\.')[0])
if ($NodeMajor -lt 20) {
    throw "Node.js 20+ gerekli. Bulunan: $NodeVersion"
}

$Temp = Join-Path $env:TEMP ("xp-word2003-" + [guid]::NewGuid().ToString("N"))
$Src  = Join-Path $Temp "src"
New-Item -ItemType Directory -Path $Src -Force | Out-Null

try {
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host " MICROSOFT WORD 2003 STYLE INSTALLER"
    Write-Host " Engine: WordInWeb"
    Write-Host " Hedef klasor: $FolderName"
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host ""

    if (Test-Path $Target) {
        $Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
        $Backup = Join-Path $Apps ($FolderName + "-backup-" + $Stamp)
        Write-Host "[1/6] Mevcut Word klasoru yedekleniyor..." -ForegroundColor Yellow
        Move-Item $Target $Backup -Force
        Write-Host "      $Backup" -ForegroundColor DarkGray
    } else {
        Write-Host "[1/6] Mevcut Word klasoru yok." -ForegroundColor DarkGray
    }

    Write-Host "[2/6] Word 2003 proje kaynaklari hazirlaniyor..." -ForegroundColor Yellow
    $Zip = Join-Path $Temp "source.zip"
    $Base64 = @'
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
'@
    [IO.File]::WriteAllBytes($Zip,[Convert]::FromBase64String($Base64))
    Expand-Archive -Path $Zip -DestinationPath $Src -Force

    Write-Host "[3/6] WordInWeb / React / Vite bagimliliklari kuruluyor..." -ForegroundColor Yellow
    Push-Location $Src
    try {
        & npm.cmd install --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { throw "npm install basarisiz." }

        Write-Host "[4/6] Statik production build aliniyor..." -ForegroundColor Yellow
        & npm.cmd run build
        if ($LASTEXITCODE -ne 0) { throw "Vite build basarisiz." }
    }
    finally {
        Pop-Location
    }

    $Dist = Join-Path $Src "dist"
    if (-not (Test-Path (Join-Path $Dist "index.html"))) {
        throw "dist\index.html bulunamadi."
    }

    Write-Host "[5/6] Build apps\$FolderName klasorune kopyalaniyor..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $Target -Force | Out-Null
    Get-ChildItem $Dist -Force | ForEach-Object {
        Copy-Item $_.FullName $Target -Recurse -Force
    }

    Copy-Item (Join-Path $Src "icon.png") (Join-Path $Target "icon.png") -Force
    Copy-Item (Join-Path $Src "README.txt") (Join-Path $Target "README.txt") -Force

    @"
Microsoft Office Word 2003 style module

Selected stage:
Stage 3 - existing browser DOCX editor.

Engine:
WordInWeb
https://github.com/theRealestAEP/wordinweb
License: MIT

The editor is bundled into a static Vite build.
Node.js/npm are only used during installation.

No registry.js modifications were made.
"@ | Set-Content (Join-Path $Target "SOURCE.txt") -Encoding UTF8

    Write-Host "[6/6] Kurulum dogrulaniyor..." -ForegroundColor Yellow
    foreach ($Required in @("index.html","icon.png","README.txt","SOURCE.txt","blank.docx")) {
        if (-not (Test-Path (Join-Path $Target $Required))) {
            throw "Eksik dosya: $Required"
        }
    }

    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host " WORD 2003 KURULDU"
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Klasor:" -ForegroundColor White
    Write-Host "  $Target" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Test:" -ForegroundColor White
    Write-Host "  http://localhost:8080/screen/apps/$FolderName/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Runtime'da Node.js / Vite server / backend gerekmez." -ForegroundColor Green
    Write-Host "Registry.js degistirilmedi." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ONEMLI: Scriptin icerigini PowerShell'e satir satir yapistirma." -ForegroundColor Yellow
    Write-Host "        .\install-word2003.ps1 DOSYASINI calistir." -ForegroundColor Yellow
}
finally {
    Remove-Item $Temp -Recurse -Force -ErrorAction SilentlyContinue
}
