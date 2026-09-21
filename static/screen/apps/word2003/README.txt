MICROSOFT OFFICE WORD 2003 STYLE - XP WEB SIMULATOR

Default target:
static/screen/apps/word/

Installer auto-detects:
- word
- winword
- msword
- word2003

Engine:
WordInWeb
https://github.com/theRealestAEP/wordinweb
License: MIT

Architecture:
- Classic Office 2003 menu bar / Standard toolbar / Formatting toolbar / ruler / status bar
- WordInWeb is the actual paginated DOCX editing engine
- Advanced WordInWeb toolbar can be toggled from View > Advanced Toolbars

Core supported features:
- paginated DOCX editing
- bold / italic / underline / font family / size / alignment
- bullets / numbering / indents
- tables and images
- page breaks, page numbers, date/time fields
- comments, footnotes
- tracked changes (suggesting), accept/reject revisions
- find / replace
- undo / redo
- headers/footers, layout, fields, equations, shapes, WordArt, charts,
  SmartArt and more through the advanced toolbar / API
- DOCX save and browser print/PDF
- no server required at runtime

Important:
- This is not Microsoft's original WINWORD.EXE.
- The selected editing engine works with DOCX. Legacy binary Word 97-2003 .DOC
  files are not directly edited by this module.
- Node.js is needed only once during installation/build.
- Registry.js is not modified.
