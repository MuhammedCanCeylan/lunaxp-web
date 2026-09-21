MOZILLA FIREFOX - XP WEB SIMULATOR

Default target:
static/screen/apps/firefox/

Installer auto-detects:
- firefox
- mozilla
- mozila
- mozilla-firefox

Selected approach:
Stage 1 - ready hosted Firefox WebApp embed.

Hosted app:
https://firefox.ywa.app/

Catalog:
https://ywa.app/

The ywa.app catalog explicitly publishes the Firefox WebApp as an iframe
embed and describes it as a vanilla HTML/CSS/JS Firefox clone with tabs,
URL bar, navigation controls and dark/light mode.

Runtime:
- Needs an Internet connection to firefox.ywa.app
- No Node.js
- No backend on the user's PC
- No VM
- No streaming
- No Moonlight/Sunshine/Parsec
- Runs inside the normal XP simulator iframe

Important:
This is NOT the real Mozilla Firefox Gecko engine. It is a browser-in-a-browser
clone. Websites loaded inside browser clones can still be limited by browser
security policy or the clone's own proxy/embed implementation.

The supplied icon is generic original artwork, not Mozilla's official logo.

Registry.js is NOT modified.
