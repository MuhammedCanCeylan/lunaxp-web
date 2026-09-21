OPERA - XP WEB SIMULATOR

Default target:
static/screen/apps/opera/

Installer auto-detects:
- opera
- opera-browser
- operabrowser

Selected approach:
Stage 1 - ready hosted Opera WebApp embed.

Hosted WebApp:
https://opera.ywa.app/

Catalog:
https://ywa.app/

The YWA catalog publishes Opera as an embeddable iframe WebApp and describes
it as a functional HTML/CSS/Vanilla JS Opera clone with:
- sidebar
- dynamic tabs
- address bar
- Speed Dial homepage

Runtime:
- Internet connection required for opera.ywa.app
- No Node.js
- No backend on the user's PC
- No daemon
- No VM / ISO
- No Moonlight / Sunshine / Parsec
- No local Opera executable

Historical note:
Opera 36 was the last official Opera desktop version supporting Windows XP
and Windows Vista. This web module does not run that native executable.

Important:
This is NOT the real Opera Chromium/Presto browser engine. It is a
browser-in-a-browser clone. Some sites can still be limited by CSP,
X-Frame-Options, CORS, or the clone's own proxy implementation.

The icon is generic original artwork, not Opera's official trademark logo.

Registry.js is NOT modified.
