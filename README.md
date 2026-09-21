<div align="center">

# LunaXP Web

### A familiar desktop. A new life in your browser.

Windows XP Luna nostalgia, classic applications, and retro games — brought together in a browser-based desktop simulation.

<p>
  <img src="https://img.shields.io/badge/release-v0.1.0-245EDB?style=for-the-badge" alt="Release v0.1.0">
  <img src="https://img.shields.io/badge/status-in_development-EAA800?style=for-the-badge" alt="In development">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-3A9D23?style=for-the-badge" alt="MIT license"></a>
</p>

**Luna desktop** · **Classic apps** · **Retro games** · **Browser-native experiences**

[Explore](#-the-desktop-experience) · [Applications](#-inside-lunaxp) · [Quick start](#-quick-start) · [Development](#-build-for-lunaxp) · [License](#-license--credits)

---

</div>

## 🖥️ The desktop experience

LunaXP Web recreates the feel of a Windows XP Luna desktop through web-based applications, nostalgic interfaces, and playable retro experiences. A shared WindowManager brings the desktop together, while individual applications run in isolated iframes.

| A familiar workspace | A modular foundation | A collection to explore |
| :--- | :--- | :--- |
| Luna-inspired desktop, taskbar, and window management. | A central app registry and independent application folders. | Classic utilities, games, music players, and media recreations. |

> **Runs on the web.** The project focuses on browser versions, web ports, and recreations. No Moonlight, Sunshine, Parsec, or desktop-streaming dependency.

## 📦 Inside LunaXP

The project includes or has active modules for the following applications and games. Availability and completeness may vary during development.

| Collection | Applications & modules |
| :--- | :--- |
| **🗂️ Desktop essentials** | Explorer · Recycle Bin · Internet Explorer-inspired browser |
| **📝 Everyday tools** | Calculator · Notepad · Paint |
| **🎮 Classic games** | Minesweeper · Solitaire · Pinball · Snake |
| **🎵 Music & playback** | Winamp · VLC-style playback through WebVLC |
| **🎬 Media players** | QuickTime-inspired player · RealPlayer-inspired player · CyberLink PowerDVD-inspired player |
| **⚡ Flash content** | Macromedia Flash Player-inspired module with Ruffle-based SWF playback |
| **💿 Disc & codec tools** | Nero Burning ROM-inspired ISO creator · K-Lite Codec Pack / Codec Tweak Tool-inspired module |

<details>
<summary><strong>A closer look at the media integrations</strong></summary>

- **Ruffle** provides the foundation for SWF playback in the Flash-inspired module.
- **WebVLC** supports the project's VLC-style playback integration.
- **Nero-inspired tooling** focuses on ISO image creation.
- **QuickTime, RealPlayer, and PowerDVD-inspired modules** recreate familiar media-player experiences for the web.

These are web integrations or inspired recreations; the names do not imply that the original desktop programs run inside the browser.

</details>

## 🚀 Quick start

Serve the project over HTTP using Python's built-in local server.

**1. Open PowerShell in the directory containing your project.**

```powershell
cd portfolio-website
```

**2. Start the server.**

```powershell
python -m http.server 8080
```

**3. Open [localhost:8080](http://localhost:8080/) in your browser.**

> **Use HTTP instead of `file://`.** Opening HTML files directly can cause browser security restrictions and resource-loading issues.

Stop the server with `Ctrl+C` when you are finished.

## 🛠️ Build for LunaXP

Every application lives in its own folder and runs inside the desktop's main WindowManager.

### Application contract

| Item | Requirement |
| :--- | :--- |
| **Location** | `static/screen/apps/<application>/` |
| **Entry point** | `index.html` |
| **Desktop icon** | `icon.png` — transparent, 32 × 32 PNG |
| **Execution** | An iframe managed by the main desktop WindowManager |
| **Window chrome** | Supplied by the desktop; applications render their own internal UI only |
| **Dialogs** | In-app XP-style dialogs instead of `alert()`, `confirm()`, or `prompt()` |

<details>
<summary><strong>📁 Project structure</strong></summary>

```text
portfolio-website/
└── static/
    └── screen/
        ├── apps/
        │   └── <application>/
        │       ├── index.html
        │       └── icon.png
        ├── registry.js
        ├── taskbar.js
        ├── vfs.js
        └── windowManager.js
```

| File | Role |
| :--- | :--- |
| `apps/<application>/index.html` | Independent application entry point |
| `apps/<application>/icon.png` | Application icon for the desktop registry |
| `registry.js` | App registry |
| `taskbar.js` | Desktop taskbar |
| `vfs.js` | Virtual filesystem |
| `windowManager.js` | Desktop window management |

</details>

<details>
<summary><strong>🎨 Interface & compatibility rules</strong></summary>

- Keep application UI inside the host window.
- Do not draw a second Windows XP title bar or taskbar.
- Use internal menus, toolbars, status bars, and XP-style dialogs where appropriate.
- Avoid native JavaScript `alert()`, `confirm()`, and `prompt()` popups.
- Preserve iframe compatibility.
- Do not introduce project-wide COOP/COEP requirements that break iframe compatibility.
- Do not add Moonlight, Sunshine, Parsec, or similar desktop-streaming dependencies.

</details>

### Choose the right foundation

Before building a replacement from scratch, evaluate existing browser-compatible options in this order:

| Priority | Preferred approach |
| :---: | :--- |
| **01** | Official or faithful browser version |
| **02** | WebAssembly, Emscripten, or downloadable web port |
| **03** | Suitable open-source community remake |
| **04** | Custom recreation when no suitable project exists |

Prefer self-hosted, open-source web ports when suitable options are available.

## 🏷️ Releases & versioning

**Current release: `v0.1.0` — first public development release.**

The project follows Semantic Versioning. The versions below describe the release progression; they are not a list of already-published releases.

| Version | Purpose |
| :--- | :--- |
| **`v0.1.0`** | First public development release |
| `v0.1.1` | Bug fixes and corrections |
| `v0.2.0` | New applications or major features |
| `v1.0.0` | First stable core release |

## 📄 License & credits

Original project code is released under the **MIT License**, unless a file or bundled dependency states otherwise.

Third-party components, including projects such as **Ruffle** and **WebVLC**, retain their own licenses. The project's MIT License does not replace those terms.

**[Read the license](LICENSE)** · **[Third-party notices](THIRD_PARTY_NOTICES.md)**

<details>
<summary><strong>Legal notice & asset redistribution</strong></summary>

LunaXP Web is an independent, fan-made educational project.

Microsoft, Windows, Windows XP, and other product names, logos, and trademarks belong to their respective owners. This repository is not affiliated with, endorsed by, or sponsored by Microsoft, Apple, Adobe/Macromedia, RealNetworks, Nero, CyberLink, VideoLAN, Nullsoft, or other referenced vendors.

Do not distribute proprietary Windows files, commercial game data, installers, ROMs, ISOs, or other copyrighted assets unless redistribution is explicitly permitted.

See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for applicable terms and attribution.

</details>

---

<div align="center">

**LunaXP Web**

<sub>The desktop you remember. Recreated for the web.</sub>

</div>
