DOOM 3 WebAssembly Demo - XP iframe module

Target:
portfolio-website/static/screen/apps/doom3/

Files:
- index.html
- icon.png

Selected source:
https://kdata1.com/2020/01/d3demo/

This is a mirrored deployment of the D3Wasm Doom 3 Demo used as an iframe by KBHGames.
Engine/source project:
https://github.com/gabrielcuvillier/d3wasm

Notes:
- No second XP title bar/taskbar is drawn inside the iframe.
- No Node.js server, COOP/COEP, streaming, ISO, service or virtual gamepad.
- The first load is large because D3Wasm downloads/caches Doom 3 Demo data.
- HOME replaces ESC for the game menu.
- INSERT can be used for the console.
- TAB opens the PDA.
