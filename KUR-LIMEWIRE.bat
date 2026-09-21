@echo off
cd /d "%~dp0"
echo.
echo LimeWire kurulumu baslatiliyor...
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-limewire-v3.ps1"
echo.
pause
