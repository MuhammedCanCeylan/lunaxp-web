# LunaXP Web

A browser-based Windows XP Luna desktop simulation focused on nostalgic UI, classic applications, retro games, and web recreations.

> Current release: **v0.1.0**

## Highlights

- Windows XP Luna-inspired desktop and WindowManager
- taskbar, app registry and iframe-isolated applications
- classic utilities, games and media applications
- Ruffle-based SWF playback
- Nero-inspired ISO image creation
- QuickTime / RealPlayer / PowerDVD-inspired media players
- VLC-style playback through WebVLC
- no Moonlight, Sunshine, Parsec or desktop-streaming dependency

## Project Structure

```text
portfolio-website/
└─ static/
   └─ screen/
      ├─ apps/
      │  └─ <application>/
      │     ├─ index.html
      │     └─ icon.png
      ├─ registry.js
      ├─ taskbar.js
      ├─ vfs.js
      └─ windowManager.js
```

Each application is designed to run inside the main desktop WindowManager. Apps should not draw a second Windows title bar or taskbar.

## Current App / Game Modules

The project currently includes or has active modules for apps and games such as:

- Calculator
- Explorer
- Internet Explorer-inspired browser
- Notepad
- Paint
- Recycle Bin
- Minesweeper
- Solitaire
- Pinball
- Snake
- Winamp
- CyberLink PowerDVD-inspired player
- K-Lite Codec Pack / Codec Tweak Tool-inspired module
- Macromedia Flash Player-inspired Ruffle integration
- Nero Burning ROM-inspired ISO creator
- QuickTime Player-inspired player
- RealPlayer-inspired player
- VLC / WebVLC integration

The list will expand in later releases.

## Running Locally

Use a local HTTP server instead of opening pages through `file://`.

```powershell
cd portfolio-website
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

## Application Guidelines

Applications live under:

```text
static/screen/apps/<application>/
```

Expected entry files:

```text
index.html
icon.png
```

`icon.png` should be a transparent 32×32 PNG.

Project rules:

- do not draw another Windows XP title bar
- do not draw another taskbar
- avoid `alert()`, `confirm()` and `prompt()`
- use in-app XP-style dialogs
- prefer self-hosted/open-source web ports before writing replacements from scratch
- do not use Moonlight, Sunshine, Parsec or similar streaming
- do not introduce project-wide COOP/COEP requirements that break iframe compatibility

## Development Strategy

When adding software or games, the preferred order is:

1. official or faithful browser version
2. WebAssembly / Emscripten / downloadable web port
3. good open-source community remake
4. custom recreation only when no suitable project exists

## Versioning

The project uses Semantic Versioning.

- `v0.1.0` — first public development release
- `v0.1.1` — bug-fix release
- `v0.2.0` — new applications or major features
- `v1.0.0` — first stable core release

## Third-Party Software

Some modules use or build upon third-party open-source projects such as Ruffle and WebVLC.

Each third-party component keeps its own license. See `THIRD_PARTY_NOTICES.md`.

## Legal Notice

This is an independent fan-made and educational web project.

Microsoft, Windows, Windows XP and other product names, logos and trademarks belong to their respective owners. This repository is not affiliated with, endorsed by, or sponsored by Microsoft, Apple, Adobe/Macromedia, RealNetworks, Nero, CyberLink, VideoLAN, Nullsoft, or other referenced vendors.

Do not distribute proprietary Windows files, commercial game data, installers, ROMs, ISOs, or other copyrighted assets unless redistribution is explicitly permitted.

## License

Original project code is released under the MIT License unless a file or bundled dependency states otherwise.

See `LICENSE` and `THIRD_PARTY_NOTICES.md`.