/* Windows XP App Registry - Phase 3B
 * Single catalog for Start Menu, VFS shortcuts, Desktop shell items and app metadata.
 */
const DEFAULT_XP_ICON = './icons/windows-0.png';

const XP_CATEGORY_FALLBACKS = {
    'Donatılar': './icons/windows-0.png',
    'Oyunlar': './icons/joystick-0.png',
    'Microsoft Office': './icons/write_wordpad-1.png',
    'İnternet': './icons/msie2-2.png',
    'İletişim': './icons/network_cool-0.png',
    'Multimedya': './icons/cd_audio_cd_a-4.png',
    'Adobe ve Web': './icons/paint_file-3.png',
    'Güvenlik': './icons/windows-0.png',
    'Sistem': './icons/computer_explorer-4.png',
    'Eğlence': './icons/joystick-0.png'
};

class AppRegistry {
    constructor() {
        this.iconPositionKey = 'xp_icon_positions_v3';
        this.recentKey = 'xp_recent_apps_v1';
        this.desktopSeedKey = 'xp_desktop_shortcuts_seed_v1';
        this.programSeedKey = 'xp_program_shortcuts_seed_v1';
        this.categoryOrder = ['Donatılar','Microsoft Office','İnternet','İletişim','Multimedya','Adobe ve Web','Güvenlik','Oyunlar','Eğlence','Sistem'];
        this.apps = [
            {
                        "id": "access2003",
                        "title": "Microsoft Access 2003",
                        "category": "Microsoft Office",
                        "subCategory": null,
                        "url": "./apps/access2003/index.html",
                        "icon": "./apps/access2003/access2003.png",
                        "status": "testing",
                        "indexBytes": 55460,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "adobereader",
                        "title": "Adobe Reader",
                        "category": "Adobe ve Web",
                        "subCategory": null,
                        "url": "./apps/adobereader/index.html",
                        "icon": "./apps/adobereader/icon.png",
                        "status": "testing",
                        "indexBytes": 26785,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "airxonix",
                        "title": "AirXonix",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/airxonix/index.html",
                        "icon": "./apps/airxonix/icon.png",
                        "status": "testing",
                        "indexBytes": 1687,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "aoe2",
                        "title": "Age of Empires II",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/aoe2/index.html",
                        "icon": "./apps/aoe2/icon.png",
                        "status": "testing",
                        "indexBytes": 2148,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "aom",
                        "title": "Age of Mythology",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/aom/index.html",
                        "icon": "./apps/aom/icon.png",
                        "status": "missing",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "ares",
                        "title": "Ares",
                        "category": "İnternet",
                        "subCategory": "Dosya Paylaşımı",
                        "url": "./apps/ares/index.html",
                        "icon": "./apps/ares/icon.png",
                        "status": "testing",
                        "indexBytes": 86441,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "avast",
                        "title": "avast! Antivirus",
                        "category": "Güvenlik",
                        "subCategory": null,
                        "url": "./apps/avast/index.html",
                        "icon": "./apps/avast/avast.png",
                        "status": "testing",
                        "indexBytes": 30230,
                        "width": 520,
                        "height": 360,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "bonzi",
                        "title": "BonziBUDDY",
                        "category": "Eğlence",
                        "subCategory": null,
                        "url": "./apps/bonzi/index.html",
                        "icon": "./apps/bonzi/icon.png",
                        "status": "testing",
                        "indexBytes": 14256,
                        "width": 360,
                        "height": 420,
                        "resizable": false,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": true
            },
            {
                        "id": "bsplayer",
                        "title": "BS.Player",
                        "category": "Multimedya",
                        "subCategory": null,
                        "url": "./apps/bsplayer/index.html",
                        "icon": "./apps/bsplayer/icon.png",
                        "status": "testing",
                        "indexBytes": 58940,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "bully",
                        "title": "Bully",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/bully/index.html",
                        "icon": "./apps/bully/icon.png",
                        "status": "missing",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "calculator",
                        "title": "Hesap Makinesi",
                        "category": "Donatılar",
                        "subCategory": null,
                        "url": "./apps/calculator/index.html",
                        "icon": "./icons/calculator-0.png",
                        "status": "testing",
                        "indexBytes": 5894,
                        "width": 240,
                        "height": 320,
                        "resizable": false,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "charmap",
                        "title": "Karakter Eşlem",
                        "category": "Donatılar",
                        "subCategory": null,
                        "url": "./apps/charmap/index.html",
                        "icon": "./apps/charmap/icon.png",
                        "status": "testing",
                        "indexBytes": 42777,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "chickeninvaders",
                        "title": "Chicken Invaders",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/chickeninvaders/index.html",
                        "icon": "./apps/chickeninvaders/icon.png",
                        "status": "testing",
                        "indexBytes": 38133,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "chrome",
                        "title": "Google Chrome",
                        "category": "İnternet",
                        "subCategory": null,
                        "url": "./apps/chrome/index.html",
                        "icon": "./apps/chrome/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "cleanmgr",
                        "title": "Disk Temizleme",
                        "category": "Donatılar",
                        "subCategory": "Sistem Araçları",
                        "url": "./apps/cleanmgr/index.html",
                        "icon": "./apps/cleanmgr/icon.png",
                        "status": "testing",
                        "indexBytes": 33903,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "cmd",
                        "title": "Komut İstemi",
                        "category": "Donatılar",
                        "subCategory": null,
                        "url": "./apps/cmd/index.html",
                        "icon": "./icons/console_prompt-0.png",
                        "status": "testing",
                        "indexBytes": 31026,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "cod",
                        "title": "Call of Duty",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/cod/index.html",
                        "icon": "./apps/cod/icon.png",
                        "status": "testing",
                        "indexBytes": 35578,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "cod2",
                        "title": "Call of Duty 2",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/cod2/index.html",
                        "icon": "./apps/cod2/icon.png",
                        "status": "testing",
                        "indexBytes": 64698,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "control",
                        "title": "Denetim Masası",
                        "category": "Sistem",
                        "subCategory": null,
                        "url": "./apps/control/index.html",
                        "icon": "./apps/control/icon.png",
                        "status": "testing",
                        "indexBytes": 36485,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "crazytaxi",
                        "title": "Crazy Taxi",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/crazytaxi/index.html",
                        "icon": "./apps/crazytaxi/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "cs16",
                        "title": "Counter-Strike 1.6",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/cs16/index.html",
                        "icon": "./apps/cs16/icon.png",
                        "status": "testing",
                        "indexBytes": 348,
                        "width": 760,
                        "height": 540,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "cssource",
                        "title": "Counter-Strike: Source",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/cssource/index.html",
                        "icon": "./apps/cssource/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "cv",
                        "title": "Özgeçmiş (CV)",
                        "category": "Sistem",
                        "subCategory": null,
                        "url": "./apps/cv/index.html",
                        "icon": "./icons/write_wordpad-1.png",
                        "status": "testing",
                        "indexBytes": 2879,
                        "width": 640,
                        "height": 500,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "defrag",
                        "title": "Disk Birleştiricisi",
                        "category": "Donatılar",
                        "subCategory": "Sistem Araçları",
                        "url": "./apps/defrag/index.html",
                        "icon": "./apps/defrag/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "diablo2",
                        "title": "Diablo II",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/diablo2/index.html",
                        "icon": "./apps/diablo2/icon.png",
                        "status": "testing",
                        "indexBytes": 349,
                        "width": 680,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "doom",
                        "title": "DOOM (1993)",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/doom/index.html",
                        "icon": "./apps/doom/icon.png",
                        "status": "testing",
                        "indexBytes": 430,
                        "width": 680,
                        "height": 500,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "doom3",
                        "title": "DOOM 3",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/doom3/index.html",
                        "icon": "./apps/doom3/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "dreamweaver",
                        "title": "Macromedia Dreamweaver",
                        "category": "Adobe ve Web",
                        "subCategory": null,
                        "url": "./apps/dreamweaver/index.html",
                        "icon": "./apps/dreamweaver/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "emule",
                        "title": "eMule",
                        "category": "İnternet",
                        "subCategory": "Dosya Paylaşımı",
                        "url": "./apps/emule/index.html",
                        "icon": "./apps/emule/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "excel2003",
                        "title": "Microsoft Excel 2003",
                        "category": "Microsoft Office",
                        "subCategory": null,
                        "url": "./apps/excel2003/index.html",
                        "icon": "./apps/excel2003/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "explorer",
                        "title": "Bilgisayarım",
                        "category": "Sistem",
                        "subCategory": null,
                        "url": "./apps/explorer/index.html",
                        "icon": "./icons/computer_explorer-4.png",
                        "status": "ready",
                        "indexBytes": 48005,
                        "width": 760,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "farcry",
                        "title": "Far Cry",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/farcry/index.html",
                        "icon": "./apps/farcry/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "feedingfrenzy",
                        "title": "Feeding Frenzy",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/feedingfrenzy/index.html",
                        "icon": "./apps/feedingfrenzy/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "fifa",
                        "title": "FIFA",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/fifa/index.html",
                        "icon": "./apps/fifa/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "firefox",
                        "title": "Mozilla Firefox",
                        "category": "İnternet",
                        "subCategory": null,
                        "url": "./apps/firefox/index.html",
                        "icon": "./apps/firefox/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "flashmx",
                        "title": "Macromedia Flash MX",
                        "category": "Adobe ve Web",
                        "subCategory": null,
                        "url": "./apps/flashmx/index.html",
                        "icon": "./apps/flashmx/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "flashplayer",
                        "title": "Macromedia Flash Player",
                        "category": "Multimedya",
                        "subCategory": null,
                        "url": "./apps/flashplayer/index.html",
                        "icon": "./apps/flashplayer/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "flatout",
                        "title": "FlatOut",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/flatout/index.html",
                        "icon": "./apps/flatout/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "fm",
                        "title": "Football Manager",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/fm/index.html",
                        "icon": "./apps/fm/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "freecell",
                        "title": "FreeCell",
                        "category": "Oyunlar",
                        "subCategory": "Windows Oyunları",
                        "url": "./apps/freecell/index.html",
                        "icon": "./icons/game_solitaire-0.png",
                        "status": "testing",
                        "indexBytes": 335,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "frontpage",
                        "title": "Microsoft FrontPage",
                        "category": "Microsoft Office",
                        "subCategory": null,
                        "url": "./apps/frontpage/index.html",
                        "icon": "./apps/frontpage/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "generals",
                        "title": "Command & Conquer: Generals",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/generals/index.html",
                        "icon": "./apps/generals/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "gtasa",
                        "title": "Grand Theft Auto: San Andreas",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/gtasa/index.html",
                        "icon": "./apps/gtasa/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "gtavc",
                        "title": "Grand Theft Auto: Vice City",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/gtavc/index.html",
                        "icon": "./apps/gtavc/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "halflife",
                        "title": "Half-Life",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/halflife/index.html",
                        "icon": "./apps/halflife/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "halflife2",
                        "title": "Half-Life 2",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/halflife2/index.html",
                        "icon": "./apps/halflife2/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "hearts",
                        "title": "Hearts",
                        "category": "Oyunlar",
                        "subCategory": "Windows Oyunları",
                        "url": "./apps/hearts/index.html",
                        "icon": "./apps/hearts/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "help",
                        "title": "Yardım ve Destek",
                        "category": "Sistem",
                        "subCategory": null,
                        "url": "./apps/help/index.html",
                        "icon": "./apps/help/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "hitman_bm",
                        "title": "Hitman: Blood Money",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/hitman_bm/index.html",
                        "icon": "./apps/hitman_bm/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "hitman2",
                        "title": "Hitman 2",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/hitman2/index.html",
                        "icon": "./apps/hitman2/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "hyperterminal",
                        "title": "HyperTerminal",
                        "category": "Donatılar",
                        "subCategory": null,
                        "url": "./apps/hyperterminal/index.html",
                        "icon": "./apps/hyperterminal/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "icq",
                        "title": "ICQ",
                        "category": "İletişim",
                        "subCategory": null,
                        "url": "./apps/icq/index.html",
                        "icon": "./apps/icq/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "ie",
                        "title": "Internet Explorer",
                        "category": "İnternet",
                        "subCategory": null,
                        "url": "./apps/ie/index.html",
                        "icon": "./icons/msie2-2.png",
                        "status": "testing",
                        "indexBytes": 65193,
                        "width": 780,
                        "height": 530,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "insaniquarium",
                        "title": "Insaniquarium",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/insaniquarium/index.html",
                        "icon": "./apps/insaniquarium/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "java",
                        "title": "Java",
                        "category": "İnternet",
                        "subCategory": null,
                        "url": "./apps/java/index.html",
                        "icon": "./apps/java/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "klite",
                        "title": "K-Lite Codec Pack",
                        "category": "Multimedya",
                        "subCategory": null,
                        "url": "./apps/klite/index.html",
                        "icon": "./apps/klite/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "limewire",
                        "title": "LimeWire",
                        "category": "İnternet",
                        "subCategory": "Dosya Paylaşımı",
                        "url": "./apps/limewire/index.html",
                        "icon": "./apps/limewire/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "mafia",
                        "title": "Mafia",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/mafia/index.html",
                        "icon": "./apps/mafia/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "maxpayne",
                        "title": "Max Payne",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/maxpayne/index.html",
                        "icon": "./apps/maxpayne/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "maxpayne2",
                        "title": "Max Payne 2",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/maxpayne2/index.html",
                        "icon": "./apps/maxpayne2/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "midtownmadness2",
                        "title": "Midtown Madness 2",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/midtownmadness2/index.html",
                        "icon": "./apps/midtownmadness2/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "minesweeper",
                        "title": "Mayın Tarlası",
                        "category": "Oyunlar",
                        "subCategory": "Windows Oyunları",
                        "url": "./apps/minesweeper/index.html",
                        "icon": "./mine.png",
                        "status": "testing",
                        "indexBytes": 22639,
                        "width": 240,
                        "height": 340,
                        "resizable": false,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "mirc",
                        "title": "mIRC",
                        "category": "İletişim",
                        "subCategory": null,
                        "url": "./apps/mirc/index.html",
                        "icon": "./apps/mirc/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "mohaa",
                        "title": "Medal of Honor: Allied Assault",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/mohaa/index.html",
                        "icon": "./apps/mohaa/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "moviemaker",
                        "title": "Windows Movie Maker",
                        "category": "Multimedya",
                        "subCategory": null,
                        "url": "./apps/moviemaker/index.html",
                        "icon": "./apps/moviemaker/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "msn",
                        "title": "MSN Messenger",
                        "category": "İletişim",
                        "subCategory": null,
                        "url": "./apps/msn/index.html",
                        "icon": "./apps/msn/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "mstsc",
                        "title": "Uzak Masaüstü Bağlantısı",
                        "category": "Donatılar",
                        "subCategory": null,
                        "url": "./apps/mstsc/index.html",
                        "icon": "./apps/mstsc/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "neighboursfromhell",
                        "title": "Neighbours from Hell",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/neighboursfromhell/index.html",
                        "icon": "./apps/neighboursfromhell/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "nero",
                        "title": "Nero Burning ROM",
                        "category": "Multimedya",
                        "subCategory": null,
                        "url": "./apps/nero/index.html",
                        "icon": "./apps/nero/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "nfsmw",
                        "title": "Need for Speed: Most Wanted",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/nfsmw/index.html",
                        "icon": "./apps/nfsmw/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "nfsu",
                        "title": "Need for Speed: Underground",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/nfsu/index.html",
                        "icon": "./apps/nfsu/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "nfsu2",
                        "title": "Need for Speed: Underground 2",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/nfsu2/index.html",
                        "icon": "./apps/nfsu2/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "notepad",
                        "title": "Not Defteri",
                        "category": "Donatılar",
                        "subCategory": null,
                        "url": "./apps/notepad/index.html",
                        "icon": "./icons/notepad-0.png",
                        "status": "ready",
                        "indexBytes": 53751,
                        "width": 540,
                        "height": 400,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "opera",
                        "title": "Opera",
                        "category": "İnternet",
                        "subCategory": null,
                        "url": "./apps/opera/index.html",
                        "icon": "./apps/opera/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "outlook",
                        "title": "Outlook Express",
                        "category": "İletişim",
                        "subCategory": null,
                        "url": "./apps/outlook/index.html",
                        "icon": "./apps/outlook/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "paint",
                        "title": "Paint",
                        "category": "Donatılar",
                        "subCategory": null,
                        "url": "./apps/paint/index.html",
                        "icon": "./icons/paint_file-3.png",
                        "status": "ready",
                        "indexBytes": 328,
                        "width": 740,
                        "height": 530,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "pes4",
                        "title": "Pro Evolution Soccer 4",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/pes4/index.html",
                        "icon": "./apps/pes4/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "pes5",
                        "title": "Pro Evolution Soccer 5",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/pes5/index.html",
                        "icon": "./apps/pes5/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "pes6",
                        "title": "Pro Evolution Soccer 6",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/pes6/index.html",
                        "icon": "./apps/pes6/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "photoshop",
                        "title": "Adobe Photoshop",
                        "category": "Adobe ve Web",
                        "subCategory": null,
                        "url": "./apps/photoshop/index.html",
                        "icon": "./apps/photoshop/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "pinball",
                        "title": "3D Pinball: Space Cadet",
                        "category": "Oyunlar",
                        "subCategory": "Windows Oyunları",
                        "url": "./apps/pinball/index.html",
                        "icon": "./apps/pinball/icon.png",
                        "status": "testing",
                        "indexBytes": 7939,
                        "width": 606,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "pop_sot",
                        "title": "Prince of Persia: The Sands of Time",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/pop_sot/index.html",
                        "icon": "./apps/pop_sot/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "pop_t2t",
                        "title": "Prince of Persia: The Two Thrones",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/pop_t2t/index.html",
                        "icon": "./apps/pop_t2t/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "pop_ww",
                        "title": "Prince of Persia: Warrior Within",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/pop_ww/index.html",
                        "icon": "./apps/pop_ww/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "postal2",
                        "title": "Postal 2",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/postal2/index.html",
                        "icon": "./apps/postal2/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "powerdvd",
                        "title": "CyberLink PowerDVD",
                        "category": "Multimedya",
                        "subCategory": null,
                        "url": "./apps/powerdvd/index.html",
                        "icon": "./apps/powerdvd/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "powerpoint2003",
                        "title": "Microsoft PowerPoint 2003",
                        "category": "Microsoft Office",
                        "subCategory": null,
                        "url": "./apps/powerpoint2003/index.html",
                        "icon": "./apps/powerpoint2003/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "pvz",
                        "title": "Plants vs. Zombies",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/pvz/index.html",
                        "icon": "./apps/pvz/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "quake3",
                        "title": "Quake III Arena",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/quake3/index.html",
                        "icon": "./apps/quake3/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "quicktime",
                        "title": "QuickTime Player",
                        "category": "Multimedya",
                        "subCategory": null,
                        "url": "./apps/quicktime/index.html",
                        "icon": "./apps/quicktime/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "realplayer",
                        "title": "RealPlayer",
                        "category": "Multimedya",
                        "subCategory": null,
                        "url": "./apps/realplayer/index.html",
                        "icon": "./apps/realplayer/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "recyclebin",
                        "title": "Geri Dönüşüm Kutusu",
                        "category": "Sistem",
                        "subCategory": null,
                        "url": "./apps/recyclebin/index.html",
                        "icon": "./icons/recycle_bin_empty-0.png",
                        "status": "ready",
                        "indexBytes": 52621,
                        "width": 720,
                        "height": 500,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "redalert2",
                        "title": "Red Alert 2",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/redalert2/index.html",
                        "icon": "./apps/redalert2/icon.png",
                        "status": "testing",
                        "indexBytes": 4798,
                        "width": 780,
                        "height": 540,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "restore",
                        "title": "Sistem Geri Yükleme",
                        "category": "Donatılar",
                        "subCategory": "Sistem Araçları",
                        "url": "./apps/restore/index.html",
                        "icon": "./apps/restore/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "search",
                        "title": "Arama",
                        "category": "Donatılar",
                        "subCategory": "Sistem Araçları",
                        "url": "./apps/search/index.html",
                        "icon": "./apps/search/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "serioussam",
                        "title": "Serious Sam",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/serioussam/index.html",
                        "icon": "./apps/serioussam/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "skype",
                        "title": "Skype",
                        "category": "İletişim",
                        "subCategory": null,
                        "url": "./apps/skype/index.html",
                        "icon": "./apps/skype/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "snake",
                        "title": "AxySnake 3D",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/snake/index.html",
                        "icon": "./apps/snake/icon.png",
                        "status": "testing",
                        "indexBytes": 40100,
                        "width": 760,
                        "height": 560,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "solitaire",
                        "title": "Solitaire",
                        "category": "Oyunlar",
                        "subCategory": "Windows Oyunları",
                        "url": "./apps/solitaire/index.html",
                        "icon": "./icons/game_solitaire-0.png",
                        "status": "testing",
                        "indexBytes": 336,
                        "width": 640,
                        "height": 480,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "soundrecorder",
                        "title": "Ses Kaydedicisi",
                        "category": "Donatılar",
                        "subCategory": null,
                        "url": "./apps/soundrecorder/index.html",
                        "icon": "./apps/soundrecorder/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "spidersolitaire",
                        "title": "Spider Solitaire",
                        "category": "Oyunlar",
                        "subCategory": "Windows Oyunları",
                        "url": "./apps/spidersolitaire/index.html",
                        "icon": "./apps/spidersolitaire/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "stronghold",
                        "title": "Stronghold",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/stronghold/index.html",
                        "icon": "./apps/stronghold/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "thesims",
                        "title": "The Sims",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/thesims/index.html",
                        "icon": "./apps/thesims/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "thesims2",
                        "title": "The Sims 2",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/thesims2/index.html",
                        "icon": "./apps/thesims2/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "tour",
                        "title": "Windows XP Turu",
                        "category": "Donatılar",
                        "subCategory": null,
                        "url": "./apps/tour/index.html",
                        "icon": "./apps/tour/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "trackmania",
                        "title": "TrackMania",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/trackmania/index.html",
                        "icon": "./apps/trackmania/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "ut2004",
                        "title": "Unreal Tournament 2004",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/ut2004/index.html",
                        "icon": "./apps/ut2004/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "vlc",
                        "title": "VLC media player",
                        "category": "Multimedya",
                        "subCategory": null,
                        "url": "./apps/vlc/index.html",
                        "icon": "./apps/vlc/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "wab",
                        "title": "Adres Defteri",
                        "category": "Donatılar",
                        "subCategory": null,
                        "url": "./apps/wab/index.html",
                        "icon": "./apps/wab/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "warcraft3",
                        "title": "Warcraft III",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/warcraft3/index.html",
                        "icon": "./apps/warcraft3/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "warcraft3_tft",
                        "title": "Warcraft III: The Frozen Throne",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/warcraft3_tft/index.html",
                        "icon": "./apps/warcraft3_tft/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "winamp",
                        "title": "Winamp",
                        "category": "Multimedya",
                        "subCategory": null,
                        "url": "./apps/winamp/index.html",
                        "icon": "./icons/cd_audio_cd_a-4.png",
                        "status": "testing",
                        "indexBytes": 29570,
                        "width": 320,
                        "height": 440,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "winmessenger",
                        "title": "Windows Messenger",
                        "category": "İletişim",
                        "subCategory": null,
                        "url": "./apps/winmessenger/index.html",
                        "icon": "./apps/winmessenger/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "winrar",
                        "title": "WinRAR",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/winrar/index.html",
                        "icon": "./apps/winrar/winrar.png",
                        "status": "testing",
                        "indexBytes": 48270,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "wmp",
                        "title": "Windows Media Player",
                        "category": "Multimedya",
                        "subCategory": null,
                        "url": "./apps/wmp/index.html",
                        "icon": "./apps/wmp/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "word2003",
                        "title": "Microsoft Word 2003",
                        "category": "Microsoft Office",
                        "subCategory": null,
                        "url": "./apps/word2003/index.html",
                        "icon": "./apps/word2003/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "wordpad",
                        "title": "WordPad",
                        "category": "Donatılar",
                        "subCategory": null,
                        "url": "./apps/wordpad/index.html",
                        "icon": "./apps/wordpad/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "yahoomessenger",
                        "title": "Yahoo! Messenger",
                        "category": "İletişim",
                        "subCategory": null,
                        "url": "./apps/yahoomessenger/index.html",
                        "icon": "./apps/yahoomessenger/icon.png",
                        "status": "placeholder",
                        "indexBytes": 0,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            },
            {
                        "id": "zuma",
                        "title": "Zuma Deluxe",
                        "category": "Oyunlar",
                        "subCategory": "Diğer Oyunlar",
                        "url": "./apps/zuma/index.html",
                        "icon": "./apps/zuma/icon.png",
                        "status": "testing",
                        "indexBytes": 44532,
                        "width": 720,
                        "height": 520,
                        "resizable": true,
                        "installed": true,
                        "showAllPrograms": true,
                        "customLaunch": false
            }

,
            {
                id: 'control',
                title: 'Denetim Masası',
                icon: './apps/control/icon.png',
                url: './apps/control/index.html',
                width: 760, height: 540, resizable: true, desktop: false
            },
            {
                id: 'controlgame',
                title: 'CONTROL',
                icon: './apps/controlgame/icon.png',
                url: './apps/controlgame/index.html',
                width: 900, height: 620, resizable: true, desktop: true
            }
];
        this.apps.forEach((app, index) => app.sortOrder = index);
        this.syncInstalledProgramFilesystem();
        this.syncProgramShortcutsToVfs();
        this.seedDesktopShortcuts();
    }

    get(id) {
        return this.apps.find(a => a.id === id) || null;
    }

    all() {
        return [...this.apps];
    }

    isAvailable(appOrId) {
        const app = typeof appOrId === 'string' ? this.get(appOrId) : appOrId;
        return !!(app && app.installed !== false);
    }

    canLaunch(appOrId) {
        const app = typeof appOrId === 'string' ? this.get(appOrId) : appOrId;
        if (!app || app.installed === false) return false;
        if (app.customLaunch) return typeof window.spawnBonzi === 'function';
        return app.status !== 'placeholder' && app.status !== 'missing';
    }

    resolveAssetUrl(path) {
        if (!path) return '';
        const value = String(path);
        // data:, blob:, http(s): and root-relative URLs are already portable.
        if (/^(?:data:|blob:|https?:|\/)/i.test(value)) return value;
        try {
            // IMPORTANT: registry.js lives in the parent XP shell. Resolve assets
            // against /screen/index.html, not against whichever iframe consumes it.
            return new URL(value, window.location.href).href;
        } catch (_) {
            return value;
        }
    }

    fallbackIconFor(appOrId) {
        const app = typeof appOrId === 'string' ? this.get(appOrId) : appOrId;
        return this.resolveAssetUrl(XP_CATEGORY_FALLBACKS[(app && app.category) || 'Sistem'] || DEFAULT_XP_ICON);
    }

    iconForApp(appOrId) {
        const app = typeof appOrId === 'string' ? this.get(appOrId) : appOrId;
        return this.resolveAssetUrl((app && app.icon) || this.fallbackIconFor(app));
    }

    applyIconFallback(img, appOrId) {
        if (!img) return;
        const fallback = this.fallbackIconFor(appOrId);
        img.onerror = function () {
            this.onerror = null;
            this.src = fallback;
        };
    }

    iconForVfsNode(node) {
        if (!node) return this.resolveAssetUrl('./icons/windows-0.png');
        if (node.type === 'shortcut' || node.type === 'application') {
            if (node.targetAppId) return this.iconForApp(node.targetAppId);
            if (node.targetPath) return this.resolveAssetUrl('./icons/directory_closed-4.png');
            return this.resolveAssetUrl('./icons/windows-0.png');
        }
        if (node.type === 'folder') return this.resolveAssetUrl('./icons/directory_closed-4.png');
        const ext = String(node.ext || (node.name && node.name.includes('.') ? node.name.split('.').pop() : '')).toLowerCase();
        const map = {
            txt: './icons/notepad-0.png', log: './icons/notepad-0.png', ini: './icons/notepad-0.png',
            bmp: './icons/paint_file-3.png', png: './icons/paint_file-3.png', jpg: './icons/paint_file-3.png', jpeg: './icons/paint_file-3.png', gif: './icons/paint_file-3.png',
            mp3: './icons/cd_audio_cd_a-4.png', wav: './icons/cd_audio_cd_a-4.png',
            html: './icons/msie2-2.png', htm: './icons/msie2-2.png',
            exe: './icons/windows-0.png'
        };
        return this.resolveAssetUrl(map[ext] || './icons/windows-0.png');
    }

    getIconPositions() {
        try { return JSON.parse(localStorage.getItem(this.iconPositionKey) || '{}'); }
        catch (_) { return {}; }
    }

    saveDesktopIconPosition(key, left, top) {
        if (!key) return;
        const positions = this.getIconPositions();
        positions[key] = { left: Math.round(Number(left) || 0), top: Math.round(Number(top) || 0) };
        localStorage.setItem(this.iconPositionKey, JSON.stringify(positions));
    }

    clearDesktopIconPositions() {
        localStorage.removeItem(this.iconPositionKey);
    }

    recordLaunch(appId) {
        if (!this.get(appId)) return;
        let ids = [];
        try { ids = JSON.parse(localStorage.getItem(this.recentKey) || '[]'); } catch (_) {}
        ids = [appId, ...ids.filter(id => id !== appId)].slice(0, 8);
        localStorage.setItem(this.recentKey, JSON.stringify(ids));
        this.renderStartMenu();
    }

    recentApps() {
        let ids = [];
        try { ids = JSON.parse(localStorage.getItem(this.recentKey) || '[]'); } catch (_) {}
        const defaults = ['notepad','paint','winamp','winrar','minesweeper','calculator'];
        const merged = [...ids, ...defaults].filter((id, i, arr) => arr.indexOf(id) === i);
        return merged.map(id => this.get(id)).filter(Boolean).slice(0, 6);
    }

    shellDesktopItems() {
        const recycleFull = window.vfs && window.vfs.getRecycleBin().length > 0;
        return [
            { id:'mydocs', title:'Belgelerim', icon:this.resolveAssetUrl('./icons/directory_open_file_mydocs-4.png') },
            { id:'explorer', title:'Bilgisayarım', icon:this.resolveAssetUrl('./icons/computer_explorer-4.png') },
            { id:'network', title:'Ağ Komşularım', icon:this.resolveAssetUrl('./icons/network_cool-0.png') },
            { id:'recyclebin', title:'Geri Dönüşüm Kutusu', icon:this.resolveAssetUrl(recycleFull ? './icons/recycle_bin_full-0.png' : './icons/recycle_bin_empty-0.png') }
        ];
    }

    openShellItem(id) {
        if (!window.xpShell) return false;
        if (id === 'mydocs') return window.xpShell.openExplorer(window.vfs.getSpecialFolderPath('documents'));
        if (id === 'explorer') return window.xpShell.openExplorer('Bilgisayarım');
        if (id === 'network') return window.xpShell.openExplorer('Ağ Komşularım');
        if (id === 'recyclebin') return window.xpShell.openApp('recyclebin');
        return false;
    }

    seedDesktopShortcuts() {
        if (!window.vfs) return;
        const desktop = window.vfs.getSpecialFolderPath('desktop');
        // Idempotent on every boot: VFS and visible desktop can never drift apart.
        window.vfs.createShortcutIfMissing(desktop, 'Internet Explorer.lnk', { targetAppId:'ie', displayName:'Internet Explorer', managed:false });
        window.vfs.createShortcutIfMissing(desktop, 'Özgeçmiş (CV).lnk', { targetAppId:'cv', displayName:'Özgeçmiş (CV)', managed:false });
        localStorage.setItem(this.desktopSeedKey, '1');
    }

    safePathSegment(value) {
        return String(value || 'Program').replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim() || 'Program';
    }

    installLocationFor(app) {
        const v = window.vfs;
        const system32Ids = new Set(['calculator','charmap','cleanmgr','cmd','mstsc','paint']);
        if (app.id === 'explorer' || app.id === 'notepad') return v.getSpecialFolderPath('windows');
        if (system32Ids.has(app.id)) return v.getSpecialFolderPath('system32');
        if (app.id === 'ie') return v.joinPath(v.getSpecialFolderPath('programFiles'), 'Internet Explorer');
        if (app.id === 'wmp') return v.joinPath(v.getSpecialFolderPath('programFiles'), 'Windows Media Player');
        return v.joinPath(v.getSpecialFolderPath('programFiles'), this.safePathSegment(app.title));
    }

    executableNameFor(app) {
        const known = {
            explorer:'explorer.exe', notepad:'notepad.exe', calculator:'calc.exe',
            charmap:'charmap.exe', cleanmgr:'cleanmgr.exe', cmd:'cmd.exe',
            mstsc:'mstsc.exe', paint:'mspaint.exe', ie:'iexplore.exe', wmp:'wmplayer.exe'
        };
        return known[app.id] || (this.safePathSegment(app.id) + '.exe');
    }

    syncInstalledProgramFilesystem() {
        if (!window.vfs) return;
        const v = window.vfs;
        v.ensureFolderPath(v.getSpecialFolderPath('programFiles'), { system:true });
        v.ensureFolderPath(v.getSpecialFolderPath('windows'), { system:true });
        v.ensureFolderPath(v.getSpecialFolderPath('system32'), { system:true });

        this.apps.filter(a => a.installed !== false).forEach(app => {
            const installPath = this.installLocationFor(app);
            const isSharedSystemFolder = installPath === v.getSpecialFolderPath('windows') || installPath === v.getSpecialFolderPath('system32');
            if (!isSharedSystemFolder) v.ensureFolderPath(installPath, { system:true, managedBy:'appRegistry' });
            v.upsertManagedApplication(installPath, this.executableNameFor(app), app.id, {
                displayName: app.title,
                status: app.status,
                installPath,
                system: true
            });
        });
        v.save({ silent:true });
    }

    syncProgramShortcutsToVfs() {
        if (!window.vfs) return;
        const v = window.vfs;
        const root = v.getSpecialFolderPath('programs');
        v.ensureFolderPath(root, { system:true });

        // Hidden QA folder. A leading dot is treated as hidden by this VFS.
        const testFolder = v.getSpecialFolderPath('appcheck');
        v.ensureFolderPath(testFolder, { system:true, managedBy:'appRegistry', hidden:true });
        const testNode = v.resolvePath(testFolder);
        if (testNode) {
            testNode.hidden = true;
            testNode.system = true;
            testNode.managedBy = 'appRegistry';
        }

        // Old Phase 3B test folder is kept for data safety but hidden from normal Explorer.
        const oldTest = v.resolvePath(v.joinPath(root, 'Tüm Programlar - Test'));
        if (oldTest && oldTest.managedBy === 'appRegistry') oldTest.hidden = true;

        this.apps.filter(a => a.showAllPrograms !== false).forEach(app => {
            const parts = [app.category, app.subCategory].filter(Boolean);
            let folder = root;
            parts.forEach(part => {
                folder = v.joinPath(folder, part);
                v.ensureFolderPath(folder, { system:true, managedBy:'appRegistry' });
            });
            const shortcutMeta = {
                targetAppId: app.id,
                displayName: app.title,
                managedBy: 'appRegistry'
            };
            v.upsertManagedShortcut(folder, app.title + '.lnk', shortcutMeta);
            v.upsertManagedShortcut(testFolder, app.title + '.lnk', shortcutMeta);
        });
        v.save({ silent:true });
        localStorage.setItem(this.programSeedKey, '2');
    }

    renderDesktopIcons() {
        const desktop = document.getElementById('desktop');
        if (!desktop) return;
        desktop.querySelectorAll('.icon').forEach(el => el.remove());

        const positions = this.getIconPositions();
        const descriptors = [];

        this.shellDesktopItems().forEach(item => descriptors.push({
            kind:'shell', key:'shell:' + item.id, shellId:item.id,
            title:item.title, icon:item.icon
        }));

        if (window.vfs) {
            const desktopPath = window.vfs.getSpecialFolderPath('desktop');
            const folder = window.vfs.resolvePath(desktopPath);
            Object.values((folder && folder.children) || {})
                .filter(node => !(window.vfs && window.vfs.isHiddenNode && window.vfs.isHiddenNode(node)))
                .sort((a,b) => String(a.displayName || a.name).localeCompare(String(b.displayName || b.name), 'tr'))
                .forEach(node => {
                    descriptors.push({
                        kind:'vfs', key:'vfs:' + node.id, vfsId:node.id,
                        title: node.displayName || String(node.name || '').replace(/\.lnk$/i,''),
                        icon:this.iconForVfsNode(node), node,
                        path:window.vfs.joinPath(desktopPath, node.name)
                    });
                });
        }

        descriptors.forEach((item, idx) => {
            const col = Math.floor(idx / 5);
            const row = idx % 5;
            const iconDiv = document.createElement('div');
            iconDiv.className = 'icon';
            iconDiv.dataset.positionKey = item.key;
            if (item.kind === 'shell') {
                iconDiv.id = 'shell-icon-' + item.shellId;
                iconDiv.dataset.shellId = item.shellId;
                iconDiv.dataset.shellType = 'namespace';
            } else {
                iconDiv.id = 'vfs-icon-' + item.vfsId;
                iconDiv.dataset.vfsId = item.vfsId;
                iconDiv.dataset.vfsPath = item.path;
                iconDiv.dataset.vfsType = item.node && item.node.type ? item.node.type : '';
                if (item.node && item.node.targetAppId) iconDiv.dataset.appId = item.node.targetAppId;
            }

            const saved = positions[item.key];
            const defaultLeft = 16 + col * 92;
            const defaultTop = 16 + row * 88;
            const maxLeft = Math.max(0, desktop.clientWidth - 80);
            const maxTop = Math.max(0, desktop.clientHeight - 76);
            const left = saved ? Math.min(Math.max(Number(saved.left) || 0, 0), maxLeft) : defaultLeft;
            const top = saved ? Math.min(Math.max(Number(saved.top) || 0, 0), maxTop) : defaultTop;
            iconDiv.style.left = left + 'px';
            iconDiv.style.top = top + 'px';

            const img = document.createElement('img');
            img.src = item.icon || DEFAULT_XP_ICON;
            img.alt = item.title;
            if (item.kind === 'vfs' && item.node && item.node.targetAppId) this.applyIconFallback(img, item.node.targetAppId);
            else img.onerror = function() { this.onerror = null; this.src = DEFAULT_XP_ICON; };

            const span = document.createElement('span');
            span.className = 'icon-label';
            span.textContent = item.title;
            iconDiv.append(img, span);

            iconDiv.ondblclick = () => {
                if (item.kind === 'shell') this.openShellItem(item.shellId);
                else if (window.xpShell) window.xpShell.openVfsItem(iconDiv.dataset.vfsPath);
            };
            desktop.appendChild(iconDiv);
        });
    }

    launchFromMenu(app) {
        if (!app) return;
        if (window.xpShell) window.xpShell.openApp(app.id);
        else if (window.windowManager) window.windowManager.open(app);
        if (typeof window.hideStartMenu === 'function') window.hideStartMenu();
    }

    makeStartAppItem(app, mode='recent') {
        const item = document.createElement('div');
        item.className = 'start-app-item ' + (mode === 'pinned' ? 'start-app-pinned' : 'start-app-recent');
        item.dataset.appId = app.id;
        const img = document.createElement('img');
        img.src = this.iconForApp(app);
        img.alt = '';
        this.applyIconFallback(img, app);
        const copy = document.createElement('span');
        copy.className = 'start-app-copy';
        const title = document.createElement('b');
        title.textContent = app.title;
        copy.appendChild(title);
        if (mode === 'pinned') {
            const desc = document.createElement('small');
            desc.textContent = app.id === 'ie' ? 'Internet' : (app.id === 'msn' ? 'E-posta ve iletişim' : 'Program');
            copy.appendChild(desc);
        }
        item.append(img, copy);
        item.onclick = () => this.launchFromMenu(app);
        return item;
    }

    renderAllPrograms(container) {
        if (!container) return;
        container.innerHTML = '';
        const grouped = new Map();
        this.apps.filter(a => a.showAllPrograms !== false).forEach(app => {
            if (!grouped.has(app.category)) grouped.set(app.category, []);
            grouped.get(app.category).push(app);
        });

        this.categoryOrder.filter(cat => grouped.has(cat)).forEach(category => {
            const row = document.createElement('div');
            row.className = 'all-programs-item all-programs-folder';
            const img = document.createElement('img');
            img.src = this.resolveAssetUrl(XP_CATEGORY_FALLBACKS[category] || DEFAULT_XP_ICON);
            const label = document.createElement('span');
            label.textContent = category;
            const arrow = document.createElement('span');
            arrow.className = 'all-programs-arrow';
            arrow.textContent = '▶';
            row.append(img, label, arrow);

            const sub = document.createElement('div');
            sub.className = 'all-programs-submenu';

            const apps = grouped.get(category).sort((a,b) => {
                const sa = a.subCategory || '', sb = b.subCategory || '';
                return sa.localeCompare(sb,'tr') || a.title.localeCompare(b.title,'tr');
            });

            const subgroups = new Map();
            apps.forEach(app => {
                const key = app.subCategory || '';
                if (!subgroups.has(key)) subgroups.set(key, []);
                subgroups.get(key).push(app);
            });

            subgroups.forEach((groupApps, subName) => {
                if (subName) {
                    const hdr = document.createElement('div');
                    hdr.className = 'all-programs-subheader';
                    hdr.textContent = subName;
                    sub.appendChild(hdr);
                }
                groupApps.forEach(app => {
                    const appRow = document.createElement('div');
                    appRow.className = 'all-programs-item all-programs-app';
                    appRow.dataset.appId = app.id;
                    const appImg = document.createElement('img');
                    appImg.src = this.iconForApp(app);
                    this.applyIconFallback(appImg, app);
                    const text = document.createElement('span');
                    text.textContent = app.title;
                    appRow.append(appImg, text);
                    appRow.onclick = e => { e.stopPropagation(); this.launchFromMenu(app); };
                    sub.appendChild(appRow);
                });
            });
            row.appendChild(sub);
            row.addEventListener('mouseenter', () => {
                sub.style.left = 'calc(100% - 2px)';
                sub.style.right = 'auto';
                sub.style.top = '-3px';
                requestAnimationFrame(() => {
                    let rect = sub.getBoundingClientRect();
                    if (rect.right > window.innerWidth - 4) {
                        sub.style.left = 'auto';
                        sub.style.right = 'calc(100% - 2px)';
                    }
                    rect = sub.getBoundingClientRect();
                    const viewportBottom = window.innerHeight - 34;
                    if (rect.bottom > viewportBottom) {
                        const currentTop = parseFloat(sub.style.top || '-3') || -3;
                        sub.style.top = (currentTop - (rect.bottom - viewportBottom) - 2) + 'px';
                    }
                    rect = sub.getBoundingClientRect();
                    if (rect.top < 4) {
                        const currentTop = parseFloat(sub.style.top || '-3') || -3;
                        sub.style.top = (currentTop + (4 - rect.top)) + 'px';
                    }
                });
            });
            container.appendChild(row);
        });
    }

    renderStartMenu() {
        const container = document.getElementById('startMenuApps');
        const allPrograms = document.getElementById('allProgramsMenu');
        if (!container) return;

        container.innerHTML = '';
        const pinned = document.createElement('div');
        pinned.className = 'start-app-section start-pinned-section';
        ['ie','msn'].map(id => this.get(id)).filter(Boolean).forEach(app => pinned.appendChild(this.makeStartAppItem(app,'pinned')));
        container.appendChild(pinned);

        const separator = document.createElement('div');
        separator.className = 'start-left-separator';
        container.appendChild(separator);

        const recent = document.createElement('div');
        recent.className = 'start-app-section start-recent-section';
        this.recentApps().forEach(app => recent.appendChild(this.makeStartAppItem(app,'recent')));
        container.appendChild(recent);

        this.renderAllPrograms(allPrograms);
    }

    async probeAppAvailability(appOrId) {
        const app = typeof appOrId === 'string' ? this.get(appOrId) : appOrId;
        if (!app || app.customLaunch || !app.url) return app;

        try {
            const response = await fetch(app.url, { method:'GET', cache:'no-store' });
            if (!response.ok) {
                app.status = 'missing';
                app.indexBytes = 0;
                return app;
            }

            const text = await response.text();
            const byteLength = typeof TextEncoder !== 'undefined'
                ? new TextEncoder().encode(text).length
                : text.length;
            app.indexBytes = byteLength;

            if (!text.trim() || byteLength === 0) {
                app.status = 'placeholder';
            } else if (app.status === 'placeholder' || app.status === 'missing') {
                // The application was installed or filled after the static inventory
                // was generated. Mark it runnable without claiming it was QA verified.
                app.status = 'testing';
            }
        } catch (_) {
            app.status = 'missing';
            app.indexBytes = 0;
        }
        return app;
    }

    async probeInstalledApps() {
        // The catalog is persistent, but the files on disk can change at any time.
        // Re-probe every registered app on boot so a previously empty index.html
        // immediately becomes launchable after the user installs a real app.
        const checks = this.apps
            .filter(app => !app.customLaunch && app.url)
            .map(app => this.probeAppAvailability(app));

        await Promise.all(checks);
        this.syncInstalledProgramFilesystem();
        this.syncProgramShortcutsToVfs();
        this.renderDesktopIcons();
        this.renderStartMenu();
        if (typeof window.initDraggableIcons === 'function') window.initDraggableIcons();
    }

    syncShellShortcuts() {
        // Kept for backward compatibility with Phase 2D.
        const ie = document.getElementById('quickLaunchIE');
        if (ie) ie.style.display = '';
        const avast = document.getElementById('trayAvast');
        if (avast) avast.style.display = '';
    }
}

window.appRegistry = new AppRegistry();


