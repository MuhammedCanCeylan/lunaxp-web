JAVA(TM) CONTROL PANEL - XP WEB SIMULATOR

Default target:
static/screen/apps/java/

Installer auto-detects:
- java
- javacpl
- jre
- java-control-panel

This module recreates the Windows-era Java Control Panel (javacpl.exe).

Tabs:
- General
- Update
- Java
- Security
- Advanced

Functional simulation:
- About/version dialog
- Network Settings / proxy modes
- Temporary Internet Files settings
- Java Cache Viewer
- delete cached applications
- Java Update schedule + simulated update check
- Java Runtime Environment rows: add/edit/remove/enable
- browser Java enable switch
- security-level slider
- certificate list/import/remove simulation
- historical advanced Java settings
- OK / Cancel / Apply with localStorage persistence

Important:
- This app does not install or execute a JVM.
- It does not change the host Windows registry, Windows certificate store, or Java keystore.
- Java applets/JAR execution is intentionally not bundled into this Control Panel module.
- Modern browser-side Java execution could be added separately through a technology such as CheerpJ if the project later needs an actual Java app/applet launcher.
- icon.png is generic original artwork, not Oracle's original icon.
- Registry.js is NOT modified.
