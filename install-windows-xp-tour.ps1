# ============================================================
# Windows XP Web Simulator - Windows XP Tour installer
# Selected Stage 3 source: DatsuneSan/WinTour
#
# Target:
#   static\screen\apps\tour\
#
# IMPORTANT:
# - Run this .ps1 FILE from portfolio-website root.
# - Do NOT paste the script line-by-line into PowerShell.
# - The original HTML tour is installed locally.
# - The original animated SWF tour is played with a local Ruffle runtime.
# - No Node.js, daemon, streaming, VM or ISO is required at runtime.
#
# Sources:
#   https://github.com/DatsuneSan/WinTour
#   https://github.com/ruffle-rs/ruffle
# ============================================================

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$Root       = (Get-Location).Path
$Apps       = Join-Path $Root "static\screen\apps"
$Target     = Join-Path $Apps "tour"
$Temp       = Join-Path $env:TEMP ("xp-tour-" + [guid]::NewGuid().ToString("N"))
$TourZip    = Join-Path $Temp "wintour.zip"
$TourExtract= Join-Path $Temp "wintour"
$RuffleZip  = Join-Path $Temp "ruffle.zip"
$RuffleExtract = Join-Path $Temp "ruffle"

if (-not (Test-Path $Apps)) {
    throw "static\screen\apps bulunamadi. PowerShell'i portfolio-website kokunde ac."
}

New-Item -ItemType Directory -Path $Temp -Force | Out-Null
New-Item -ItemType Directory -Path $TourExtract -Force | Out-Null
New-Item -ItemType Directory -Path $RuffleExtract -Force | Out-Null

try {
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host " WINDOWS XP TOUR - WEB INSTALLER"
    Write-Host " Original HTML + Animated SWF via local Ruffle"
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host ""

    # --------------------------------------------------------
    # 1) Backup old installation
    # --------------------------------------------------------
    Write-Host "[1/9] Mevcut Windows XP Tour kontrol ediliyor..." -ForegroundColor Yellow

    if (Test-Path $Target) {
        $Stamp  = Get-Date -Format "yyyyMMdd-HHmmss"
        $Backup = Join-Path $Apps ("tour-backup-" + $Stamp)
        Move-Item $Target $Backup -Force
        Write-Host "      Yedek: $Backup" -ForegroundColor DarkGray
    }

    # --------------------------------------------------------
    # 2) Download original extracted XP Tour
    # --------------------------------------------------------
    Write-Host "[2/9] Windows XP Tour kaynaklari indiriliyor..." -ForegroundColor Yellow

    $TourUrls = @(
        "https://github.com/DatsuneSan/WinTour/archive/refs/heads/master.zip",
        "https://github.com/DatsuneSan/WinTour/archive/refs/heads/main.zip"
    )

    $Downloaded = $false

    foreach ($Url in $TourUrls) {
        try {
            Invoke-WebRequest -Uri $Url -OutFile $TourZip -UseBasicParsing
            if ((Test-Path $TourZip) -and ((Get-Item $TourZip).Length -gt 10000)) {
                $Downloaded = $true
                break
            }
        }
        catch {
            Remove-Item $TourZip -Force -ErrorAction SilentlyContinue
        }
    }

    if (-not $Downloaded) {
        throw "DatsuneSan/WinTour arsivi indirilemedi."
    }

    # --------------------------------------------------------
    # 3) Extract/copy
    # --------------------------------------------------------
    Write-Host "[3/9] Windows XP Tour kaynaklari kuruluyor..." -ForegroundColor Yellow

    Expand-Archive -Path $TourZip -DestinationPath $TourExtract -Force

    $Repo = Get-ChildItem $TourExtract -Directory | Select-Object -First 1
    if (-not $Repo) {
        throw "WinTour repo klasoru bulunamadi."
    }

    New-Item -ItemType Directory -Path $Target -Force | Out-Null
    $SourceDir = Join-Path $Target "source"
    New-Item -ItemType Directory -Path $SourceDir -Force | Out-Null

    Get-ChildItem $Repo.FullName -Force | ForEach-Object {
        Copy-Item $_.FullName $SourceDir -Recurse -Force
    }

    foreach ($Junk in @(".git",".github")) {
        $P = Join-Path $SourceDir $Junk
        if (Test-Path $P) {
            Remove-Item $P -Recurse -Force
        }
    }

    # --------------------------------------------------------
    # 4) Discover HTML tour entry
    # --------------------------------------------------------
    Write-Host "[4/9] HTML Tour giris dosyasi bulunuyor..." -ForegroundColor Yellow

    $DocsDir = Join-Path $SourceDir "docs"
    if (-not (Test-Path $DocsDir)) {
        throw "Kaynakta docs klasoru bulunamadi."
    }

    $HtmlCandidates = Get-ChildItem $DocsDir -Recurse -File |
        Where-Object { $_.Extension -match '^\.(htm|html)$' }

    if (-not $HtmlCandidates) {
        throw "HTML Tour icinde .htm/.html dosyasi bulunamadi."
    }

    $HtmlEntry = $HtmlCandidates |
        Sort-Object `
          @{ Expression = {
              if ($_.Name -match '^(default|index)\.(htm|html)$') { 0 }
              elseif ($_.Name -match '^(tour|start).*\.(htm|html)$') { 1 }
              else { 2 }
          }},
          @{ Expression = { $_.FullName.Length } } |
        Select-Object -First 1

    $TargetPrefix = (Resolve-Path $Target).Path.TrimEnd('\') + '\'
    $HtmlRel = $HtmlEntry.FullName.Substring($TargetPrefix.Length).Replace('\','/')
    Write-Host "      HTML: $HtmlRel" -ForegroundColor DarkGray

    # --------------------------------------------------------
    # 5) Discover main SWF
    # --------------------------------------------------------
    Write-Host "[5/9] Animated Tour SWF dosyasi bulunuyor..." -ForegroundColor Yellow

    $SwfDir = Join-Path $SourceDir "SWF"
    $Swfs = @()

    if (Test-Path $SwfDir) {
        $Swfs = Get-ChildItem $SwfDir -Recurse -File -Filter *.swf
    }

    if (-not $Swfs) {
        throw "Kaynakta animated Tour .swf dosyasi bulunamadi."
    }

    $SwfEntry = $Swfs |
        Sort-Object `
          @{ Expression = {
              if ($_.Name -match '^TourW\.swf$') { 0 }
              elseif ($_.Name -match '^TourP\.swf$') { 1 }
              elseif ($_.Name -match '^Tour.*\.swf$') { 2 }
              else { 3 }
          }},
          @{ Expression = { -$_.Length } } |
        Select-Object -First 1

    $SwfRel = $SwfEntry.FullName.Substring($TargetPrefix.Length).Replace('\','/')
    Write-Host "      SWF : $SwfRel" -ForegroundColor DarkGray

    # --------------------------------------------------------
    # 6) Download local Ruffle self-hosted runtime
    # --------------------------------------------------------
    Write-Host "[6/9] Ruffle Flash runtime indiriliyor..." -ForegroundColor Yellow

    $RuffleUrls = @(
        "https://github.com/ruffle-rs/ruffle/releases/download/nightly-2026-09-20/ruffle-nightly-2026_09_20-web-selfhosted.zip",
        "https://github.com/ruffle-rs/ruffle/releases/download/nightly-2026-09-19/ruffle-nightly-2026_09_19-web-selfhosted.zip"
    )

    $RuffleDownloaded = $false

    foreach ($Url in $RuffleUrls) {
        try {
            Invoke-WebRequest -Uri $Url -OutFile $RuffleZip -UseBasicParsing
            if ((Test-Path $RuffleZip) -and ((Get-Item $RuffleZip).Length -gt 500000)) {
                $RuffleDownloaded = $true
                break
            }
        }
        catch {
            Remove-Item $RuffleZip -Force -ErrorAction SilentlyContinue
        }
    }

    if (-not $RuffleDownloaded) {
        throw "Ruffle self-hosted paketi indirilemedi."
    }

    Expand-Archive -Path $RuffleZip -DestinationPath $RuffleExtract -Force

    $RuffleTarget = Join-Path $Target "ruffle"
    New-Item -ItemType Directory -Path $RuffleTarget -Force | Out-Null

    Get-ChildItem $RuffleExtract -Force | ForEach-Object {
        Copy-Item $_.FullName $RuffleTarget -Recurse -Force
    }

    if (-not (Test-Path (Join-Path $RuffleTarget "ruffle.js"))) {
        $NestedRuffle = Get-ChildItem $RuffleExtract -Recurse -File -Filter ruffle.js | Select-Object -First 1
        if (-not $NestedRuffle) {
            throw "Ruffle paketinde ruffle.js bulunamadi."
        }

        Remove-Item $RuffleTarget -Recurse -Force
        New-Item -ItemType Directory -Path $RuffleTarget -Force | Out-Null
        Get-ChildItem $NestedRuffle.Directory.FullName -Force | ForEach-Object {
            Copy-Item $_.FullName $RuffleTarget -Recurse -Force
        }
    }

    # --------------------------------------------------------
    # 7) Create XP Tour launcher/format chooser
    # --------------------------------------------------------
    Write-Host "[7/9] Windows XP Tour format secim ekrani hazirlaniyor..." -ForegroundColor Yellow

    $Launcher = @"
<!--
WINDOWS XP TOUR - LOCAL WEB MODULE

ORIGINAL TOUR SOURCE:
DatsuneSan/WinTour
https://github.com/DatsuneSan/WinTour

ANIMATED TOUR:
Original Microsoft Windows XP SWF assets, played locally using Ruffle.

NON-ANIMATED TOUR:
Original HTML tour files from the extracted XP Tour source.

No second XP title bar or taskbar is drawn inside this app.
-->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Windows XP Tour</title>
<style>
*{box-sizing:border-box}
html,body{width:100%;height:100%;margin:0;overflow:hidden}
body{font:11px Tahoma,Arial,sans-serif;background:#fff;color:#222}
button{font:11px Tahoma,Arial,sans-serif}

#chooser{
  width:100%;height:100%;display:grid;grid-template-rows:96px 1fr 53px;background:#fff
}
.banner{
  position:relative;overflow:hidden;
  background:linear-gradient(100deg,#fff 0%,#fff 48%,#e7f0fa 77%,#b7d3ee 100%);
  border-bottom:1px solid #8aa6c3
}
.banner:before{
  content:"";position:absolute;right:-75px;top:-65px;width:270px;height:210px;
  border-radius:50%;background:radial-gradient(circle at 38% 45%,#9ec4ec,#316fb5 48%,#173f80 73%,transparent 74%);
  opacity:.82
}
.xplogo{
  position:absolute;left:28px;top:19px;color:#1f4d83;
  font:normal 28px "Trebuchet MS",Tahoma,sans-serif
}
.xplogo b{font-weight:bold}
.xplogo small{
  display:block;margin-top:3px;color:#6884a4;
  font:11px Tahoma,Arial,sans-serif;letter-spacing:.2px
}
.content{padding:22px 34px 16px;overflow:auto}
.content h1{margin:0 0 8px;font:normal 21px "Trebuchet MS",Tahoma,sans-serif;color:#24558a}
.lead{font-size:12px;margin-bottom:21px}
.choice{
  display:grid;grid-template-columns:24px 42px 1fr;gap:8px;align-items:start;
  padding:9px 9px 10px;margin:4px 0;border:1px solid transparent
}
.choice:hover{background:#f4f8fd;border-color:#c5d7eb}
.choice input{margin-top:5px}
.choiceIcon{
  width:37px;height:31px;border:1px solid #58738b;background:linear-gradient(#87badf,#326fa8);
  position:relative;box-shadow:inset 0 0 0 2px #d7edf9
}
.choiceIcon.animated:after{
  content:"▶";position:absolute;left:10px;top:5px;color:#fff;font:bold 16px Arial
}
.choiceIcon.html:after{
  content:"";position:absolute;left:8px;top:6px;width:19px;height:16px;background:#fff;
  box-shadow:inset 0 0 0 1px #7f9db9
}
.choiceTitle{font-weight:bold;color:#174f88;margin-bottom:3px}
.choiceText{line-height:1.45;color:#444}
.footer{
  display:flex;align-items:center;justify-content:flex-end;gap:7px;
  padding:9px 12px;background:#ECE9D8;border-top:1px solid #ACA899
}
.xpbtn{
  min-width:78px;height:26px;padding:1px 12px;background:#ECE9D8;border:2px outset #fff;color:#000
}
.xpbtn:active{border-style:inset}
.xpbtn.primary{outline:1px solid #000;outline-offset:-4px}

#viewer{display:none;position:absolute;inset:0;background:#000}
#viewer.show{display:block}
#tourHost{position:absolute;inset:0;background:#000}
#htmlTour{width:100%;height:100%;border:0;background:#fff;display:none}
#ruffleHost{position:absolute;inset:0;display:none;background:#000}
#ruffleHost ruffle-player{width:100%!important;height:100%!important;display:block}
.viewerTools{
  position:absolute;right:9px;top:8px;z-index:50;display:flex;gap:5px;
  opacity:.18;transition:opacity .15s
}
.viewerTools:hover{opacity:1}
.viewerTools button{
  height:24px;padding:0 8px;border:1px solid #777;background:#ECE9D8;color:#000
}

/* in-app XP dialog */
#shade{
  display:none;position:absolute;inset:0;z-index:200;background:rgba(0,0,0,.18);
  align-items:center;justify-content:center;padding:18px
}
#shade.show{display:flex}
.dialog{
  width:min(430px,92vw);background:#ECE9D8;border:2px outset #fff;box-shadow:4px 5px 14px rgba(0,0,0,.45)
}
.dtitle{
  min-height:25px;padding:4px 7px;color:#fff;font-weight:bold;
  background:linear-gradient(90deg,#0A246A,#3A6EA5)
}
.dbody{padding:13px;line-height:1.45}
.dactions{text-align:right;padding:0 12px 11px}
.dactions button{min-width:78px;height:25px;background:#ECE9D8;border:2px outset #fff}
</style>
<script>
window.RufflePlayer = window.RufflePlayer || {};
window.RufflePlayer.config = {
  autoplay: "on",
  unmuteOverlay: "visible",
  splashScreen: false,
  letterbox: "on",
  scale: "showAll",
  forceScale: true,
  quality: "high"
};
</script>
<script src="./ruffle/ruffle.js"></script>
</head>
<body>

<section id="chooser">
  <div class="banner">
    <div class="xplogo"><b>Microsoft Windows</b> XP
      <small>Take a tour of Windows XP</small>
    </div>
  </div>

  <div class="content">
    <h1>Welcome to the Windows XP Tour!</h1>
    <div class="lead">The tour is available in two formats. Which format do you prefer?</div>

    <label class="choice">
      <input type="radio" name="format" value="animated" checked>
      <span class="choiceIcon animated"></span>
      <span>
        <div class="choiceTitle">Play the animated tour</div>
        <div class="choiceText">Features text, animation, music, and voice narration. The original Flash tour is played locally with Ruffle.</div>
      </span>
    </label>

    <label class="choice">
      <input type="radio" name="format" value="html">
      <span class="choiceIcon html"></span>
      <span>
        <div class="choiceTitle">Play the non-animated tour</div>
        <div class="choiceText">Features text and images only, matching the HTML tour that Windows XP opened in Internet Explorer.</div>
      </span>
    </label>
  </div>

  <div class="footer">
    <button class="xpbtn primary" id="nextBtn" type="button">Next &gt;</button>
    <button class="xpbtn" id="cancelBtn" type="button">Cancel</button>
  </div>
</section>

<section id="viewer">
  <div id="tourHost">
    <div id="ruffleHost"></div>
    <iframe id="htmlTour" title="Windows XP HTML Tour"></iframe>
  </div>
  <div class="viewerTools">
    <button id="backToFormat" type="button">Tour format</button>
  </div>
</section>

<div id="shade">
  <div class="dialog">
    <div class="dtitle">Windows XP Tour</div>
    <div class="dbody" id="dialogText"></div>
    <div class="dactions"><button id="dialogOK" type="button">OK</button></div>
  </div>
</div>

<script>
(function(){
  "use strict";

  const HTML_TOUR = "./$HtmlRel";
  const SWF_TOUR  = "./$SwfRel";

  const chooser=document.getElementById("chooser");
  const viewer=document.getElementById("viewer");
  const htmlTour=document.getElementById("htmlTour");
  const ruffleHost=document.getElementById("ruffleHost");
  const shade=document.getElementById("shade");
  let player=null;

  function dialog(text){
    document.getElementById("dialogText").textContent=String(text);
    shade.classList.add("show");
  }
  function hideDialog(){shade.classList.remove("show")}
  document.getElementById("dialogOK").onclick=hideDialog;
  shade.addEventListener("mousedown",e=>{if(e.target===shade)hideDialog()});

  window.alert=dialog;
  window.confirm=function(m){dialog(m);return false};
  window.prompt=function(m){dialog(m);return null};

  function showChooser(){
    try{
      if(player && player.ruffle) player.ruffle().pause();
    }catch(e){}
    ruffleHost.style.display="none";
    htmlTour.style.display="none";
    htmlTour.removeAttribute("src");
    viewer.classList.remove("show");
    chooser.style.display="grid";
  }

  async function startAnimated(){
    chooser.style.display="none";
    viewer.classList.add("show");
    htmlTour.style.display="none";
    ruffleHost.style.display="block";

    try{
      if(!player){
        const ruffle=window.RufflePlayer && window.RufflePlayer.newest
          ? window.RufflePlayer.newest()
          : null;

        if(!ruffle) throw new Error("Ruffle runtime could not start.");

        player=ruffle.createPlayer();
        player.style.width="100%";
        player.style.height="100%";
        ruffleHost.innerHTML="";
        ruffleHost.appendChild(player);
      }

      await player.ruffle().load({
        url: SWF_TOUR,
        autoplay: "on"
      });
    }catch(e){
      showChooser();
      dialog("Animated tour could not be started.\\n\\n" + (e && e.message ? e.message : e));
    }
  }

  function startHtml(){
    chooser.style.display="none";
    viewer.classList.add("show");
    ruffleHost.style.display="none";
    htmlTour.style.display="block";
    htmlTour.src=HTML_TOUR;
  }

  document.getElementById("nextBtn").onclick=function(){
    const chosen=document.querySelector('input[name="format"]:checked');
    if(chosen && chosen.value==="html") startHtml();
    else startAnimated();
  };

  document.getElementById("cancelBtn").onclick=function(){
    try{
      window.parent.postMessage({type:"XP_APP_CLOSE_REQUEST",app:"tour"},"*");
    }catch(e){}
  };

  document.getElementById("backToFormat").onclick=showChooser;

  document.addEventListener("keydown",function(e){
    if(shade.classList.contains("show")){
      if(e.key==="Escape" || e.key==="Enter"){
        e.preventDefault();
        hideDialog();
      }
      return;
    }

    if(e.key==="Escape" && viewer.classList.contains("show")){
      e.preventDefault();
      showChooser();
    }
  });
})();
</script>
</body>
</html>
"@

    Set-Content (Join-Path $Target "index.html") $Launcher -Encoding UTF8

    # --------------------------------------------------------
    # 8) Generate mandatory 32x32 transparent icon.png
    # --------------------------------------------------------
    Write-Host "[8/9] 32x32 seffaf Windows XP Tour ikonu olusturuluyor..." -ForegroundColor Yellow

    Add-Type -AssemblyName System.Drawing

    $Bmp = New-Object System.Drawing.Bitmap 32,32
    $G   = [System.Drawing.Graphics]::FromImage($Bmp)
    $G.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $G.Clear([System.Drawing.Color]::Transparent)

    $Blue  = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,47,111,181))
    $Light = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,181,216,241))
    $White = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,250,250,247))
    $Green = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,84,166,71))
    $Gold  = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,244,177,41))
    $Pen   = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255,48,70,91),1)

    # monitor
    $G.FillRectangle($White,3,4,24,18)
    $G.DrawRectangle($Pen,3,4,23,17)
    $G.FillRectangle($Blue,6,7,18,12)

    # XP-like rolling hill
    $G.FillPie($Green,5,12,21,13,180,180)
    $G.FillEllipse($Light,17,8,5,5)

    # monitor stand
    $G.FillRectangle($Pen.Brush,12,22,6,4)
    $G.FillRectangle($Light,8,26,14,2)

    # small tour/star badge
    $G.FillEllipse($Gold,20,18,10,10)
    $Font = New-Object System.Drawing.Font(
        "Arial",
        8,
        [System.Drawing.FontStyle]::Bold,
        [System.Drawing.GraphicsUnit]::Pixel
    )
    $G.DrawString("?", $Font, $White, [System.Drawing.PointF]::new(22,19))

    $Bmp.Save(
        (Join-Path $Target "icon.png"),
        [System.Drawing.Imaging.ImageFormat]::Png
    )

    $Font.Dispose()
    $Pen.Dispose()
    $Gold.Dispose()
    $Green.Dispose()
    $White.Dispose()
    $Light.Dispose()
    $Blue.Dispose()
    $G.Dispose()
    $Bmp.Dispose()

    # --------------------------------------------------------
    # 9) Notes + validation
    # --------------------------------------------------------
    Write-Host "[9/9] SOURCE.txt ve README.txt yaziliyor..." -ForegroundColor Yellow

    @"
WINDOWS XP TOUR

Selected stage:
Stage 3 - use an already extracted copy of the original Windows XP Tour.

Original-tour preservation repository:
https://github.com/DatsuneSan/WinTour

Repository description:
- SWF: animated Windows XP Tour with music and voice-over
- HTML: non-animated tour with text and images

Flash runtime:
Ruffle self-hosted
https://github.com/ruffle-rs/ruffle

Installed structure:
apps/tour/
  index.html
  icon.png
  source/
    SWF/
    docs/
  ruffle/

Detected HTML entry:
$HtmlRel

Detected animated SWF:
$SwfRel

The source repository contains extracted Microsoft Windows XP Tour content.
This installer does not claim ownership of Microsoft's assets.
"@ | Set-Content (Join-Path $Target "SOURCE.txt") -Encoding UTF8

    @"
Windows XP Tour for the XP web simulator

Target:
static/screen/apps/tour/

Entry:
static/screen/apps/tour/index.html

Modes:
1. Animated Tour
   Original SWF assets played locally through Ruffle.
2. Non-animated Tour
   Original HTML tour content.

Runtime requirements:
- Same static HTTP server as the rest of the XP simulator.
- No Node.js.
- No local daemon.
- No streaming.
- No VM/ISO.
- No Adobe Flash plugin.

Recommended test URL:
http://localhost:8080/screen/apps/tour/

Press ESC while viewing a tour to return to the format selector.
"@ | Set-Content (Join-Path $Target "README.txt") -Encoding UTF8

    foreach ($Required in @(
        "index.html",
        "icon.png",
        "ruffle\ruffle.js"
    )) {
        if (-not (Test-Path (Join-Path $Target $Required))) {
            throw "Eksik dosya: $Required"
        }
    }

    if (-not (Test-Path $HtmlEntry.FullName)) {
        throw "HTML Tour entry kayboldu: $HtmlRel"
    }

    if (-not (Test-Path $SwfEntry.FullName)) {
        throw "Animated Tour SWF kayboldu: $SwfRel"
    }

    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host " WINDOWS XP TOUR KURULDU"
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Klasor:" -ForegroundColor White
    Write-Host "  $Target" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Animated Tour:" -ForegroundColor White
    Write-Host "  $SwfRel" -ForegroundColor Gray
    Write-Host ""
    Write-Host "HTML Tour:" -ForegroundColor White
    Write-Host "  $HtmlRel" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Test:" -ForegroundColor White
    Write-Host "  http://localhost:8080/screen/apps/tour/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "NOT: Bu scriptin ICERIGINI satir satir yapistirma." -ForegroundColor Yellow
    Write-Host "    .\install-windows-xp-tour.ps1 olarak DOSYA halinde calistir." -ForegroundColor Yellow
}
finally {
    Remove-Item $Temp -Recurse -Force -ErrorAction SilentlyContinue
}
