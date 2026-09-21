/* MERKEZİ UYGULAMA KAYIT DEFTERİ (APP REGISTRY) */
const APPS_REGISTRY = [
    {
        id: 'cv',
        title: 'Özgeçmiş (CV)',
        icon: 'https://win98icons.alexmeub.com/icons/png/write_wordpad-1.png',
        url: './apps/cv/index.html',
        width: 640, height: 500, resizable: true,
        tooltip: 'Resmi Özgeçmiş Belgesi'
    },
    {
        id: 'explorer',
        title: 'Bilgisayarım',
        icon: 'https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png',
        url: './apps/explorer/index.html',
        width: 680, height: 460, resizable: true,
        tooltip: 'Yerel disklere ve paylaşılan belgelere erişim'
    },
    {
        id: 'paint',
        title: 'Paint',
        icon: 'https://win98icons.alexmeub.com/icons/png/paint_file-3.png',
        url: 'https://jspaint.app/',
        width: 740, height: 530, resizable: true,
        tooltip: 'Bitmap (.bmp) çizimleri oluşturur'
    },
    {
        id: 'winamp',
        title: 'Winamp 2.91',
        icon: 'https://win98icons.alexmeub.com/icons/png/cd_audio_cd_a-4.png',
        url: './apps/winamp/index.html',
        width: 310, height: 350, resizable: true,
        tooltip: '90lar Türkçe Pop Winamp Çalar'
    },
    {
        id: 'minesweeper',
        title: 'Mayın Tarlası',
        icon: './mine.png',
        url: './apps/minesweeper/index.html',
        width: 240, height: 320, resizable: false,
        tooltip: 'Klasik Mayın Tarlası Oyunu'
    },
    {
        id: 'pinball',
        title: '3D Pinball',
        icon: 'https://win98icons.alexmeub.com/icons/png/game_solitaire-0.png',
        url: 'https://alula.github.io/SpaceCadetPinball/',
        width: 606, height: 442, resizable: false,
        tooltip: 'Space Cadet 3D Pinball'
    },
    {
        id: 'doom',
        title: 'DOOM (1993)',
        icon: 'https://win98icons.alexmeub.com/icons/png/joystick-0.png',
        url: './apps/doom/index.html',
        width: 646, height: 480, resizable: true,
        tooltip: 'DOOM MS-DOS Engine'
    },
    {
        id: 'solitaire',
        title: 'Solitaire',
        icon: 'https://win98icons.alexmeub.com/icons/png/game_solitaire-0.png',
        url: 'https://www.google.com/logos/fnbx/solitaire/standalone.html',
        width: 620, height: 500, resizable: true,
        tooltip: 'Klasik Solitaire Kart Oyunu'
    },
    {
        id: 'notepad',
        title: 'Not Defteri',
        icon: 'https://win98icons.alexmeub.com/icons/png/notepad-0.png',
        url: './apps/notepad/index.html',
        width: 520, height: 420, resizable: true,
        tooltip: 'Düz Metin (.txt) Editörü'
    },
    {
        id: 'calculator',
        title: 'Hesap Makinesi',
        icon: 'https://win98icons.alexmeub.com/icons/png/calculator-0.png',
        url: './apps/calculator/index.html',
        width: 230, height: 320, resizable: false,
        tooltip: 'Standart Hesap Makinesi'
    },
    {
        id: 'avast',
        title: 'avast! Antivirus',
        icon: './avast.png',
        url: './apps/avast/index.html',
        width: 480, height: 320, resizable: true,
        tooltip: 'avast! 4.8 Professional Edition'
    }
];

function getAppConfig(id) {
    return APPS_REGISTRY.find(app => app.id === id);
}

function initAppIcons() {
    const desktopEl = document.getElementById('desktop');
    const startMenuLeft = document.getElementById('startMenuApps');
    
    desktopEl.querySelectorAll('.icon.registered-app').forEach(el => el.remove());
    if (startMenuLeft) startMenuLeft.innerHTML = '';

    APPS_REGISTRY.forEach((app, idx) => {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon registered-app';
        iconDiv.id = 'icon-' + app.id;
        
        const col = Math.floor(idx / 5);
        const row = idx % 5;
        iconDiv.style.left = (20 + col * 90) + 'px';
        iconDiv.style.top = (20 + row * 90) + 'px';

        iconDiv.innerHTML = `
            <img src="${app.icon}" onerror="this.src='https://win98icons.alexmeub.com/icons/png/window-0.png'" alt="${app.title}">
            <span>${app.title}</span>
        `;
        iconDiv.ondblclick = () => windowManager.open(app.id);
        iconDiv.onmouseenter = (e) => showTooltip(e, app.tooltip || app.title);
        iconDiv.onmouseleave = () => hideTooltip();
        desktopEl.appendChild(iconDiv);

        if (startMenuLeft) {
            const mi = document.createElement('div');
            mi.className = 'menu-item';
            mi.innerHTML = `
                <img src="${app.icon}" width="20" height="20" onerror="this.src='https://win98icons.alexmeub.com/icons/png/window-0.png'">
                <b>${app.title}</b>
            `;
            mi.onclick = () => { windowManager.open(app.id); hideStartMenu(); };
            startMenuLeft.appendChild(mi);
        }
    });

    if (window.xpDesktop && window.xpDesktop.initDraggableIcons) {
        window.xpDesktop.initDraggableIcons();
    }
}