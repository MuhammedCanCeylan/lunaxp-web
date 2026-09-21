WINDOWS XP / EXCEL 2003 STYLE SPREADSHEET

Default target:
static/screen/apps/excel/

Installer auto-detects these existing folders:
- excel
- msexcel
- excel2003
- spreadsheet

ENGINE
- Luckysheet 2.1.13 (MIT)
- LuckyExcel 1.0.1 (MIT)
- SheetJS 0.18.5 helper

FEATURES
- Excel 2003 / XP style menu + standard/formatting toolbars
- Real spreadsheet grid
- Cell formulas and functions through Luckysheet
- Multiple worksheets
- Formatting, merge, sort, filter
- Find / Replace
- XLSX import (LuckyExcel)
- XLS / CSV import fallback (SheetJS)
- XLSX export
- CSV export
- Formula bar / sheet tabs / status bar
- LocalStorage autosave draft
- 32x32 transparent Excel-style icon
- No native alert/confirm/prompt
- No second XP titlebar/taskbar
- No runtime Node server

NOTES
- This is not Microsoft's original excel.exe.
- XLSX export preserves values/formulas, but some Luckysheet-specific advanced formatting can be simplified by the SheetJS export layer.
- The original Luckysheet repository was archived in 2025; it remains useful here as a local standalone spreadsheet engine for the retro XP simulator.
- Registry.js is NOT modified by the installer.
