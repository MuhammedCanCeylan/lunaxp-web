LIMEWIRE WEB EDITION - WINDOWS XP WEB SIMULATOR

Target:
static/screen/apps/limewire/

Files:
- index.html
- icon.png
- README.txt

This is a custom Stage 4 recreation inspired by the LimeWire 4.x era.

Implemented:
- classic LimeWire-style Search / Monitor / Connections / Library workflow
- file-type filters
- deterministic simulated search results
- simulated Gnutella peer mesh and network monitor
- download queue with speed/progress/time-left
- pause / resume / cancel / clear completed
- simulated uploads
- local Library
- import user files into Library for current browser session
- local audio/image preview where browser permits
- completed downloads automatically added to Library
- text-only placeholder payloads for simulated remote downloads
- Options and Statistics dialogs
- persistent settings, downloads, library metadata through localStorage
- no native alert / confirm / prompt
- no duplicate XP Luna titlebar/taskbar

Privacy/network:
- NO real Gnutella connection
- NO peer-to-peer upload
- NO VPN/tunnel/backend/daemon
- NO original LimeWire executable
- user-selected local files are not sent anywhere
- local File objects are not persisted after browser reload; metadata may remain

Registry.js is NOT modified.
