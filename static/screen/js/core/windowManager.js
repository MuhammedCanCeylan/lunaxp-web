/* İZOLE PENCERE YÖNETİCİSİ */
class WindowManager {
    constructor() {
        this.highestZ = 100;
        this.activeWindowId = null;
        this.maximizedGeom = {};
    }

    bringToFront(win) {
        this.highestZ++;
        win.style.zIndex = this.highestZ;
        document.querySelectorAll('.window').forEach(w => {
            if (w !== win) w.classList.add('inactive');
        });
        win.classList.remove('inactive');
        this.activeWindowId = win.id;
        this.setActiveTaskbar(win.dataset.appId);
    }

    open(appId) {
        const app = getAppConfig(appId);
        if (!app) return;

        let win = document.getElementById('win-' + appId);
        if (!win) {
            win = this.createWindowDOM(app);
            document.body.appendChild(win);
        }

        const frame = win.querySelector('iframe');
        if (frame && (frame.src === 'about:blank' || !frame.src)) {
            frame.src = app.url;
        }

        win.style.display = 'flex';
        this.bringToFront(win);
        this.ensureTaskbar(app);
        
        if (window.clippyComment) {
            window.clippyComment(`${app.title} başlatıldı!`);
        }
    }

    close(appId) {
        const win = document.getElementById('win-' + appId);
        if (!win) return;

        win.style.display = 'none';
        const frame = win.querySelector('iframe');
        if (frame) frame.src = 'about:blank'; // Müzik veya oyun seslerini anında yok eder

        const taskBtn = document.getElementById('task-' + appId);
        if (taskBtn) taskBtn.remove();

        if (this.activeWindowId === win.id) this.activeWindowId = null;
    }

    minimize(appId) {
        const win = document.getElementById('win-' + appId);
        if (!win) return;
        win.style.display = 'none';
        const taskBtn = document.getElementById('task-' + appId);
        if (taskBtn) taskBtn.classList.remove('active');
        if (this.activeWindowId === win.id) this.activeWindowId = null;
    }

    toggleMaximize(appId) {
        const win = document.getElementById('win-' + appId);
        if (!win) return;

        const maxBtn = win.querySelector('.win-max');
        if (!win.classList.contains('xp-maximized')) {
            this.maximizedGeom[appId] = {
                left: win.style.left, top: win.style.top,
                width: win.style.width, height: win.style.height
            };
            win.classList.add('xp-maximized');
            if (maxBtn) maxBtn.innerHTML = '❐';
        } else {
            win.classList.remove('xp-maximized');
            const g = this.maximizedGeom[appId] || {};
            if (g.left) win.style.left = g.left;
            if (g.top) win.style.top = g.top;
            if (g.width) win.style.width = g.width;
            if (g.height) win.style.height = g.height;
            if (maxBtn) maxBtn.innerHTML = '□';
        }
        this.bringToFront(win);
    }

    createWindowDOM(app) {
        const win = document.createElement('div');
        win.className = 'window' + (app.resizable ? ' resizable' : '');
        win.id = 'win-' + app.id;
        win.dataset.appId = app.id;
        win.style.width = (app.width || 500) + 'px';
        win.style.height = (app.height || 380) + 'px';
        win.style.left = (80 + Math.random() * 80) + 'px';
        win.style.top = (40 + Math.random() * 60) + 'px';

        win.innerHTML = `
            <div class="window-header">
                <div class="window-header-title">
                    <img src="${app.icon}" onerror="this.src='https://win98icons.alexmeub.com/icons/png/window-0.png'">
                    <span>${app.title}</span>
                </div>
                <div class="window-btns">
                    <div class="win-btn win-min" title="Simge Durumuna Küçült" onclick="windowManager.minimize('${app.id}')">_</div>
                    <div class="win-btn win-max ${app.resizable ? '' : 'disabled'}" title="Ekranı Kapla" onclick="${app.resizable ? `windowManager.toggleMaximize('${app.id}')` : ''}">□</div>
                    <div class="win-btn win-close" title="Kapat" onclick="windowManager.close('${app.id}')">✕</div>
                </div>
            </div>
            <div class="window-content">
                <iframe class="window-iframe" src="about:blank" allow="autoplay; fullscreen; keyboard"></iframe>
            </div>
        `;

        const header = win.querySelector('.window-header');
        header.onmousedown = (e) => this.dragWindow(e, win);
        if (app.resizable) {
            header.ondblclick = (e) => {
                if (!e.target.classList.contains('win-btn')) this.toggleMaximize(app.id);
            };
        }
        win.onmousedown = () => this.bringToFront(win);
        return win;
    }

    dragWindow(e, win) {
        if (e.target.classList.contains('win-btn')) return;
        if (win.classList.contains('xp-maximized')) return;
        this.bringToFront(win);

        let shiftX = e.clientX - win.offsetLeft;
        let shiftY = e.clientY - win.offsetTop;

        const onMouseMove = (ev) => {
            let left = ev.clientX - shiftX;
            let top = ev.clientY - shiftY;
            left = Math.max(-win.offsetWidth + 90, Math.min(left, window.innerWidth - 90));
            top = Math.max(0, Math.min(top, window.innerHeight - 55));
            win.style.left = left + 'px';
            win.style.top = top + 'px';
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    ensureTaskbar(app) {
        if (document.getElementById('task-' + app.id)) return;
        const btn = document.createElement('div');
        btn.className = 'task-btn active';
        btn.id = 'task-' + app.id;
        btn.innerHTML = `
            <img src="${app.icon}" width="14" height="14" onerror="this.src='https://win98icons.alexmeub.com/icons/png/window-0.png'">
            <span>${app.title}</span>
        `;
        btn.onclick = () => {
            const win = document.getElementById('win-' + app.id);
            if (!win) return;
            if (win.style.display === 'none') {
                win.style.display = 'flex';
                this.bringToFront(win);
            } else if (this.activeWindowId === win.id) {
                this.minimize(app.id);
            } else {
                this.bringToFront(win);
            }
        };
        document.getElementById('taskbarApps').appendChild(btn);
    }

    setActiveTaskbar(appId) {
        document.querySelectorAll('.task-btn').forEach(b => b.classList.remove('active'));
        const cur = document.getElementById('task-' + appId);
        if (cur) cur.classList.add('active');
    }
}

const windowManager = new WindowManager();