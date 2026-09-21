HYPERTERMINAL - WINDOWS XP WEB SIMULATOR

Default target:
static/screen/apps/hyperterminal/

Installer auto-detects:
- hyperterminal
- hypertrm
- hyperterm
- terminal

Implementation:
Custom browser-side reconstruction of the Windows XP HyperTerminal workflow.

Features:
- File / Edit / View / Call / Transfer / Help menus
- classic XP toolbar and status bar
- real Web Serial API connection when browser supports it
- baud rate, data bits, parity, stop bits, flow control
- terminal emulation profile labels: Auto Detect / ANSI / VT100 / TTY
- ASCII Setup: local echo, CR/LF handling, line delay, character delay
- terminal fonts and colors
- text capture -> .txt download
- send text file with delays
- connection profile save/open
- built-in demo Hayes modem
- built-in demo GNSS/NMEA receiver
- built-in demo network-device CLI
- localStorage profile persistence
- no native alert / confirm / prompt
- no second XP Luna titlebar/taskbar

Browser support:
- Real serial access requires Web Serial support, typically Chrome/Edge/other Chromium browsers.
- Web Serial requires a secure context; localhost is appropriate for the project.
- Firefox/Floorp/Safari can still use the demo devices.

Limitations vs original Windows XP HyperTerminal:
- no XMODEM / YMODEM / ZMODEM implementation
- no modem TAPI integration
- no incoming-call listener
- no unrestricted Telnet/raw TCP because a normal browser cannot open arbitrary raw TCP sockets without a bridge/backend
- .ht export is this simulator's JSON profile format, not Microsoft's original binary HyperTerminal profile format

Registry.js is NOT modified.
