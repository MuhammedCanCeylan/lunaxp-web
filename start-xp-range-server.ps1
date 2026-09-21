$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (Get-Command py -ErrorAction SilentlyContinue) {
    py .\serve-xp-range.py 8080
}
elseif (Get-Command python -ErrorAction SilentlyContinue) {
    python .\serve-xp-range.py 8080
}
else {
    throw "Python bulunamadi."
}
