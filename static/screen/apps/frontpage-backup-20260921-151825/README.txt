MICROSOFT OFFICE FRONTPAGE 2003 STYLE - XP WEB SIMULATOR

Default target:
static/screen/apps/frontpage/

Installer auto-detects:
- frontpage
- msfrontpage
- frontpage2003
- fp

Engine:
VvvebJs
https://github.com/givanz/VvvebJs
Apache 2.0

Features:
- FrontPage 2003 / XP style menu bar
- Standard + Formatting toolbar
- Web Site Views sidebar
- Design / Split / Code / Preview
- Real WYSIWYG visual page builder through VvvebJs
- HTML/HTM open
- HTML save / Save As
- localStorage autosave
- Insert hyperlink
- Insert image from local file
- Insert table
- Basic text formatting
- Task pane
- Vvveb blocks/components/file manager available inside Design mode
- No native alert/confirm/prompt
- No second XP titlebar/taskbar
- No runtime Node/PHP/backend required for local editing/export

Runtime:
Serve the normal XP project over localhost/http.
Do not use file:// because VvvebJs uses nested iframes.

This is NOT Microsoft's original frontpg.exe.
