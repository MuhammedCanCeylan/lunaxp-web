# ============================================================
# Windows XP Web Simulator - LimeWire 4.8.1 + CheerpJ installer
#
# Selected approach:
#   Stage 2 - original LimeWire Java desktop app, executed client-side
#   in the browser with CheerpJ 4.3.
#
# IMPORTANT
# - Put THIS FILE in portfolio-website root and execute the file.
# - DO NOT paste this script line-by-line into PowerShell.
# - The normal project HTTP server is enough:
#       cd .\static
#       py -m http.server 8080
# - No Moonlight/Sunshine/Parsec, VM, ISO, daemon or Node server.
# ============================================================

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$Root = (Get-Location).Path
$Static = Join-Path $Root "static"
$Apps = Join-Path $Static "screen\apps"

if (-not (Test-Path $Apps)) {
    throw "static\screen\apps bulunamadi. PowerShell'i portfolio-website kokunde ac."
}

# Re-use an existing likely app folder when there is exactly one.
$Candidates = @("limewire","lime-wire","lw")
$Existing = @($Candidates | Where-Object { Test-Path (Join-Path $Apps $_) })
if ($Existing.Count -eq 1) {
    $FolderName = $Existing[0]
} else {
    $FolderName = "limewire"
}

$Target = Join-Path $Apps $FolderName
$Original = Join-Path $Target "original"
$Temp = Join-Path $env:TEMP ("xp-limewire-" + [guid]::NewGuid().ToString("N"))
$Zip = Join-Path $Temp "LimeWireOther.zip"

New-Item -ItemType Directory -Path $Temp -Force | Out-Null

try {
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host " LIMEWIRE 4.8.1 - CHEERPJ WEB INSTALLER"
    Write-Host " Hedef klasor: $FolderName"
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host ""

    if (Test-Path $Target) {
        $ExistingFiles = @(Get-ChildItem $Target -Recurse -File -ErrorAction SilentlyContinue)

        if ($ExistingFiles.Count -eq 0) {
            # Previous failed/pasted installation may have left only empty folders.
            Write-Host "[1/7] Yarim kalmis bos LimeWire klasoru temizleniyor..." -ForegroundColor Yellow
            Remove-Item $Target -Recurse -Force
        } else {
            $Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
            $Backup = Join-Path $Apps ($FolderName + "-backup-" + $Stamp)
            Write-Host "[1/7] Mevcut LimeWire klasoru yedekleniyor..." -ForegroundColor Yellow
            Move-Item $Target $Backup -Force
            Write-Host "      $Backup" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "[1/7] Mevcut LimeWire klasoru yok." -ForegroundColor DarkGray
    }

    New-Item -ItemType Directory -Path $Original -Force | Out-Null

    Write-Host "[2/7] Orijinal LimeWire 4.8.1 paketi hazirlaniyor..." -ForegroundColor Yellow

    function Test-RealZip([string]$Path) {
        if (-not (Test-Path $Path)) { return $false }

        try {
            $File = Get-Item $Path
            if ($File.Length -lt 1000000) { return $false }

            $Stream = [IO.File]::OpenRead($Path)
            try {
                $B0 = $Stream.ReadByte()
                $B1 = $Stream.ReadByte()
                return ($B0 -eq 0x50 -and $B1 -eq 0x4B)
            }
            finally {
                $Stream.Dispose()
            }
        }
        catch {
            return $false
        }
    }

    # SourceForge is returning HTTP 403 to command-line downloaders on some
    # connections. Prefer a browser-downloaded local copy instead.
    $UserDownloads = Join-Path $HOME "Downloads"

    $LocalCandidates = @(
        (Join-Path $Root "LimeWireOther.zip"),
        (Join-Path $Root "LimeWireOther (1).zip"),
        (Join-Path $UserDownloads "LimeWireOther.zip"),
        (Join-Path $UserDownloads "LimeWireOther (1).zip"),
        (Join-Path ([Environment]::GetFolderPath("Desktop")) "LimeWireOther.zip")
    )

    # Also accept automatically renamed browser downloads such as
    # LimeWireOther (2).zip.
    if (Test-Path $UserDownloads) {
        $LocalCandidates += @(
            Get-ChildItem $UserDownloads -File -Filter "LimeWireOther*.zip" -ErrorAction SilentlyContinue |
            Sort-Object LastWriteTime -Descending |
            Select-Object -ExpandProperty FullName
        )
    }

    $LocalZip = $null
    foreach ($Candidate in ($LocalCandidates | Select-Object -Unique)) {
        if ($Candidate -and (Test-RealZip $Candidate)) {
            $LocalZip = $Candidate
            break
        }
    }

    if (-not $LocalZip) {
        Write-Host ""
        Write-Host "SourceForge komut satiri indirmelerini 403 ile engelliyor." -ForegroundColor Yellow
        Write-Host "Dosya web tarayicisindan indirilecek." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Tarayicida aciliyor:" -ForegroundColor White
        Write-Host "  https://sourceforge.net/projects/openwire/files/LimeWire/4.8.1/" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Sayfadan LimeWireOther.zip dosyasini indir." -ForegroundColor White
        Write-Host "Dosyayi Downloads klasorunde birakabilirsin." -ForegroundColor Gray
        Write-Host ""

        try {
            Start-Process "https://sourceforge.net/projects/openwire/files/LimeWire/4.8.1/"
        }
        catch {
            # Browser launch failure is not fatal; user can open the URL manually.
        }

        Read-Host "Indirme bittikten sonra ENTER'a bas"

        if (Test-Path $UserDownloads) {
            $LocalZip = Get-ChildItem $UserDownloads -File -Filter "LimeWireOther*.zip" -ErrorAction SilentlyContinue |
                Sort-Object LastWriteTime -Descending |
                Where-Object { Test-RealZip $_.FullName } |
                Select-Object -First 1 -ExpandProperty FullName
        }

        if (-not $LocalZip) {
            foreach ($Candidate in @(
                (Join-Path $Root "LimeWireOther.zip"),
                (Join-Path ([Environment]::GetFolderPath("Desktop")) "LimeWireOther.zip")
            )) {
                if (Test-RealZip $Candidate) {
                    $LocalZip = $Candidate
                    break
                }
            }
        }
    }

    if (-not $LocalZip) {
        throw @"
LimeWireOther.zip bulunamadi.

1) Tarayicida su sayfayi ac:
   https://sourceforge.net/projects/openwire/files/LimeWire/4.8.1/

2) LimeWireOther.zip dosyasini indir.

3) Dosyayi ya Downloads klasorunde birak
   ya da portfolio-website kokune kopyala.

4) install-limewire-v3.ps1 dosyasini tekrar calistir.
"@
    }

    Write-Host "      Kullanilan ZIP:" -ForegroundColor DarkGray
    Write-Host "      $LocalZip" -ForegroundColor DarkGray

    Copy-Item $LocalZip $Zip -Force

    if (-not (Test-RealZip $Zip)) {
        throw "Secilen LimeWireOther.zip gecerli bir ZIP degil."
    }

    Write-Host "      ZIP dogrulandi: $([math]::Round((Get-Item $Zip).Length / 1MB, 2)) MB" -ForegroundColor Green

    Write-Host "[3/7] Orijinal dosyalar aciliyor..." -ForegroundColor Yellow
    Expand-Archive -Path $Zip -DestinationPath $Original -Force

    # Some old archives contain one extra top-level directory. We do not
    # flatten or alter the original package; instead we dynamically build
    # a classpath from every JAR in the extracted tree.
    $Jars = @(Get-ChildItem $Original -Recurse -File -Filter *.jar | Sort-Object FullName)

    if ($Jars.Count -eq 0) {
        throw "Arsiv icinde hic JAR bulunamadi."
    }

    $MainJar = $Jars | Where-Object { $_.Name -ieq "LimeWire.jar" } | Select-Object -First 1
    if (-not $MainJar) {
        throw "Orijinal pakette LimeWire.jar bulunamadi."
    }

    Write-Host "      $($Jars.Count) JAR bulundu." -ForegroundColor DarkGray
    Write-Host "      Ana JAR: $($MainJar.FullName)" -ForegroundColor DarkGray

    Write-Host "[4/7] CheerpJ classpath hazirlaniyor..." -ForegroundColor Yellow

    # CheerpJ /app/ = the root served by portfolio-website/static.
    $StaticResolved = (Resolve-Path $Static).Path.TrimEnd('\') + '\'
    $ClassEntries = foreach ($Jar in $Jars) {
        $rel = $Jar.FullName.Substring($StaticResolved.Length).Replace('\','/')
        "/app/" + $rel
    }
    $ClassPath = $ClassEntries -join ":"

    # For display/debugging only.
    $ClasspathTxt = $ClassEntries -join [Environment]::NewLine
    Set-Content (Join-Path $Target "classpath.txt") $ClasspathTxt -Encoding UTF8

    Write-Host "[5/7] Browser launcher olusturuluyor..." -ForegroundColor Yellow

    $IndexTemplate = @'
<!--
LIMEWIRE 4.8.1 - ASSET LISTESI
| Dosya adi      | Tavsiye edilen boyut | Zorunluluk | Kullanim / Aciklama |
|----------------|----------------------|------------|----------------------------------------------|
| icon.png       | 32x32                | Zorunlu    | XP masaustu ikonu (ozgun/generic lime icon) |
| original/**    | Orijinal boyut       | Zorunlu    | OpenWire LimeWire 4.8.1 Java dosyalari      |
| classpath.txt  | Otomatik             | Zorunlu    | CheerpJ icin uretilen JAR classpath listesi |

NOT:
- Bu sayfa orijinal LimeWire Java Swing uygulamasini CheerpJ ile tarayicida calistirir.
- Ana XP WindowManager zaten dis Luna pencere cercevesini cizer.
- Java JFrame'in ust dekorasyon bolumu viewport disina kirpilir; ikinci dis titlebar gosterilmez.
- alert/confirm/prompt kullanilmaz; baslangic hatalari .xp-dialog icinde gosterilir.
-->
<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>LimeWire</title>
<script src="https://cjrtnc.leaningtech.com/4.3/loader.js"></script>
<style>
*{box-sizing:border-box}
html,body{width:100%;height:100%;margin:0;overflow:hidden}
body{font:11px Tahoma,sans-serif;background:#ECE9D8;color:#000}

#app{position:relative;width:100%;height:100%;overflow:hidden;background:#f5f5f5}

/*
  CheerpJ renders Swing top-level windows inside its display.
  The parent XP shell already owns the outer titlebar, so we crop the
  Java JFrame decoration area instead of drawing another XP window.
*/
#crop{position:absolute;inset:0;overflow:hidden;background:#efefef}
#javaHost{
  position:absolute;
  left:0;right:0;
  top:-27px;
  height:calc(100% + 27px);
  overflow:hidden;
  background:#efefef;
}
#javaHost>div{max-width:100%!important;max-height:100%!important}

#loading{
  position:absolute;inset:0;z-index:50;background:#fff;
  display:flex;align-items:center;justify-content:center
}
#loading.hide{display:none}
.loader{text-align:center;width:min(420px,82%)}
.logo{
  margin:0 auto 11px;width:58px;height:58px;border-radius:50%;
  background:#a4d648;border:1px solid #4b7b20;position:relative
}
.logo:before{
  content:"";position:absolute;inset:10px;border-radius:50%;
  background:#dff2aa;border:1px solid #6b9b31
}
.logo:after{
  content:"";position:absolute;left:28px;top:10px;width:1px;height:38px;
  background:#6b9b31;box-shadow:-9px 8px 0 -0.2px #6b9b31,9px 8px 0 -0.2px #6b9b31;
  transform:rotate(23deg)
}
.brand{font:bold 19px Tahoma,sans-serif;color:#537d22;margin-bottom:13px}
.track{height:18px;border:2px inset #fff;background:#f5f5f5;padding:2px;margin:0 auto 8px}
.bar{height:100%;width:18%;background:#316AC5;animation:load 1.5s ease-in-out infinite}
@keyframes load{0%{transform:translateX(0)}50%{transform:translateX(450%)}100%{transform:translateX(0)}}
.small{font-size:10px;color:#666;line-height:1.45}

.shade{
  display:none;position:absolute;inset:0;z-index:1000;background:rgba(0,0,0,.18);
  align-items:center;justify-content:center;padding:18px
}
.shade.show{display:flex}
.xp-dialog{
  width:min(500px,94vw);background:#ECE9D8;border:2px outset #fff;
  box-shadow:4px 5px 15px rgba(0,0,0,.48)
}
.dtitle{
  min-height:25px;padding:4px 7px;color:#fff;font-weight:bold;
  background:linear-gradient(90deg,#0A246A,#3A6EA5)
}
.dbody{padding:14px;line-height:1.5}
.dactions{text-align:right;padding:0 12px 11px}
.xpbtn{min-width:88px;height:25px;background:#ECE9D8;border:2px outset #fff;font:11px Tahoma,sans-serif}
.xpbtn:active{border-style:inset}
.warn{
  margin-top:9px;padding:7px 8px;border:1px solid #d8c466;background:#fff7d7;color:#5c5228
}
</style>
</head>
<body>
<div id="app">
  <div id="crop"><div id="javaHost"></div></div>

  <div id="loading">
    <div class="loader">
      <div class="logo"></div>
      <div class="brand">LimeWire 4.8.1</div>
      <div class="track"><div class="bar"></div></div>
      <div class="small" id="status">CheerpJ Java ortami baslatiliyor...</div>
    </div>
  </div>

  <div class="shade" id="shade">
    <div class="xp-dialog">
      <div class="dtitle">LimeWire</div>
      <div class="dbody" id="dialogBody"></div>
      <div class="dactions"><button class="xpbtn" id="dialogOK" type="button">Tamam</button></div>
    </div>
  </div>
</div>

<script>
(async()=>{
"use strict";

const CLASS_PATH = "__CLASSPATH__";
const MAIN_CLASS = "com.limegroup.gnutella.gui.Main";
const loading = document.getElementById("loading");
const status = document.getElementById("status");
const shade = document.getElementById("shade");
const dialogBody = document.getElementById("dialogBody");

function dialog(message){
  dialogBody.textContent = String(message);
  shade.classList.add("show");
}
document.getElementById("dialogOK").onclick=()=>shade.classList.remove("show");

/* native popup ban for wrapper */
window.alert=dialog;
window.confirm=m=>{dialog(m);return false};
window.prompt=m=>{dialog(m);return null};

try{
  status.textContent="Java 8 uyumluluk ortami yukleniyor...";

  await cheerpjInit({
    clipboardMode:"permission",
    javaProperties:[
      "user.home=/files",
      "java.io.tmpdir=/files",
      "java.net.preferIPv4Stack=true"
    ]
  });

  status.textContent="LimeWire Swing arayuzu hazirlaniyor...";

  const host=document.getElementById("javaHost");
  cheerpjCreateDisplay(-1,-1,host);

  /* Let CheerpJ create its graphical display before the Java main starts. */
  setTimeout(()=>loading.classList.add("hide"),1800);

  await cheerpjRunMain(MAIN_CLASS, CLASS_PATH);
}catch(e){
  loading.classList.add("hide");
  dialog(
    "LimeWire baslatilamadi.\n\n"+
    (e && e.message ? e.message : String(e))+
    "\n\nSayfayi file:// ile degil localhost uzerinden ac. "+
    "Ayrica CheerpJ runtime'i ilk acilista internet baglantisi ister."
  );
}
})();
</script>
</body>
</html>
'@

    $Index = $IndexTemplate.Replace("__CLASSPATH__", $ClassPath)
    Set-Content (Join-Path $Target "index.html") $Index -Encoding UTF8

    Write-Host "[6/7] 32x32 seffaf icon.png olusturuluyor..." -ForegroundColor Yellow

    $IconBase64 = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB3UlEQVR4nO1WMWvCQBT+LB0EQ1eXxt3OgqOWgnMRJ7HdXCyOUuIPaCiOUhc3LU5FuioUdeggONtdJ7ciCWRLB72YXO5yl7RO9VtC7l7e9917L+8ecMJ/RyzKRwUtZbPWx/oqtL/zKKT3d1c8M8dGVoyUUUFL2QGkTPT6SykRZ8cgB3ZR4qXKjUCFPPLpbAMAUOIJGJbprOdzSZ+tKBLcjSByrdwAALSHHdSLNWdPH7RCi2CmgEW+mBsecha0cgPT2QaLueFZD0qHsAYIDMuEEk8I7ei0iCAlgJy8XqyhPexw7UhKSCQiCaDDT4edJ4KuB1oELw3SKXCDFkGTh4GwEyrxhDDs7if97a8FGJbJrXxCyju9PmgBUAL9R0oBTR4UIRGkLyMAeHyYuN7Su7WPCYD0/nnA88u1lE9md3L/Ce9PahiNTNw219xuyI0Ai/jy5suTb1b1t4cdGJaJ78+Mx9cFVABdn0+fgFKlamPtVQ/sWrFMhyMdM988OCGHKVWqNgC8vXadSHiKkBgAwFYdOeQAkMkqyOeS+8pmg1xGmay38rfqyEPq5vHlpFSp2sT4GNcxHQXhxBJ1IGGRsyDsA2N9Fev1l0chB0JMxTJDqVvonw6lQWLciDKWn3DCDzmS+l64wDVZAAAAAElFTkSuQmCC"
    [IO.File]::WriteAllBytes(
        (Join-Path $Target "icon.png"),
        [Convert]::FromBase64String($IconBase64)
    )

    @"
LIMEWIRE 4.8.1 - XP WEB SIMULATOR

Selected stage:
Stage 2 - original LimeWire Java application running in the browser with CheerpJ 4.3.

Original package:
OpenWire / LimeWire / 4.8.1 / LimeWireOther.zip
SourceForge:
https://sourceforge.net/projects/openwire/files/LimeWire/4.8.1/

Runtime:
CheerpJ 4.3
https://cheerpj.com/
https://cjrtnc.leaningtech.com/4.3/loader.js

Main Java class:
com.limegroup.gnutella.gui.Main

Important network limitation:
The original LimeWire UI and Java application bytecode run client-side.
Classic Gnutella uses low-level peer networking. Browser sandboxes do not
provide unrestricted raw TCP/UDP access by default. CheerpJ can provide
general networking through its Tailscale integration, but this installer
does NOT configure a VPN/tunnel, exit node, daemon or external networking
service. Therefore the authentic UI can run while live Gnutella connectivity
may remain offline or limited.

Persistent Java home:
CheerpJ's /files virtual filesystem (IndexedDB). LimeWire can create its own profile folders there.

Runtime requirements:
- Open with the project's normal HTTP server, not file://
- Internet access for the CheerpJ community runtime
- No native Java/JRE installed on Windows
- No Node.js
- No Moonlight/Sunshine/Parsec
- No VM / ISO
- No local daemon/server beyond the normal static XP site server

CheerpJ licensing:
Check Leaning Technologies' current license terms if this portfolio is
deployed commercially. Community/non-commercial usage has separate terms.

icon.png is original/generic artwork generated for this simulator.

Registry.js is NOT modified.
"@ | Set-Content (Join-Path $Target "README.txt") -Encoding UTF8

    Write-Host "[7/7] Kurulum dogrulaniyor..." -ForegroundColor Yellow

    foreach ($Required in @(
        "index.html",
        "icon.png",
        "README.txt",
        "classpath.txt"
    )) {
        if (-not (Test-Path (Join-Path $Target $Required))) {
            throw "Eksik dosya: $Required"
        }
    }

    if (-not (Test-Path $MainJar.FullName)) {
        throw "LimeWire.jar dogrulama sirasinda bulunamadi."
    }

    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host " LIMEWIRE 4.8.1 KURULDU"
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Klasor:" -ForegroundColor White
    Write-Host "  $Target" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Test:" -ForegroundColor White
    Write-Host "  http://localhost:8080/screen/apps/$FolderName/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Normal proje sunucusu yeterli:" -ForegroundColor White
    Write-Host "  cd .\static" -ForegroundColor Gray
    Write-Host "  py -m http.server 8080" -ForegroundColor Gray
    Write-Host ""
    Write-Host "NOT: Gnutella P2P baglantisi browser socket kisitlari nedeniyle" -ForegroundColor Yellow
    Write-Host "     garanti edilmez. Installer hicbir VPN/daemon/tunnel kurmaz." -ForegroundColor Yellow
    Write-Host "Registry.js degistirilmedi." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "BU SCRIPTIN ICERIGINI SATIR SATIR YAPISTIRMA." -ForegroundColor Yellow
    Write-Host ".\install-limewire-v3.ps1 DOSYASINI calistir." -ForegroundColor Yellow
}
finally {
    Remove-Item $Temp -Recurse -Force -ErrorAction SilentlyContinue
}
