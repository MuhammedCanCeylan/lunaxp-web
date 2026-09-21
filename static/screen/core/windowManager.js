/* Windows XP Luna Window Manager - Phase 1 shell core */
class WindowManager {
    constructor() {
        this.highestZ = 100;
        this.activeWindowId = null;
        this.restoreGeometries = {};
        this.geometryStorageKey = 'xp_window_geometries_v2';
        this.cascadeIndex = 0;
        this.pendingLaunchContexts = {};
        this.altTabIndex = -1;

        window.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'xp-resize-window') {
                this.resize(e.data.appId, e.data.width, e.data.height);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'F4' && this.activeWindowId) {
                e.preventDefault();
                const active = document.getElementById(this.activeWindowId);
                if (active) this.close(active.dataset.appId);
                return;
            }
        });
    }

    getStoredGeometries() {
        try {
            return JSON.parse(localStorage.getItem(this.geometryStorageKey) || '{}');
        } catch (_) {
            return {};
        }
    }


    getWorkArea() {
        const taskbarHeight = 30;
        return {
            left: 0,
            top: 0,
            right: window.innerWidth,
            bottom: Math.max(120, window.innerHeight - taskbarHeight),
            width: window.innerWidth,
            height: Math.max(120, window.innerHeight - taskbarHeight)
        };
    }

    clampWindowToWorkArea(win, save = false) {
        if (!win || win.style.display === 'none' || win.classList.contains('xp-maximized')) return;

        const area = this.getWorkArea();
        const minW = Number(win.dataset.minWidth || 220);
        const minH = Number(win.dataset.minHeight || 160);

        let width = Math.min(
            Math.max(win.offsetWidth || parseInt(win.style.width, 10) || minW, minW),
            Math.max(minW, area.width - 4)
        );

        let height = Math.min(
            Math.max(win.offsetHeight || parseInt(win.style.height, 10) || minH, minH),
            Math.max(minH, area.height - 4)
        );

        let left = parseInt(win.style.left, 10);
        let top = parseInt(win.style.top, 10);

        if (!Number.isFinite(left)) left = 20;
        if (!Number.isFinite(top)) top = 20;

        left = Math.max(-width + 80, Math.min(left, area.right - 80));
        top = Math.max(area.top, Math.min(top, area.bottom - 25));

        if (top + height > area.bottom) {
            top = Math.max(area.top, area.bottom - height);
        }

        win.style.left = Math.round(left) + 'px';
        win.style.top = Math.round(top) + 'px';
        win.style.width = Math.round(width) + 'px';
        win.style.height = Math.round(height) + 'px';

        if (save) this.saveGeometry(win);
    }

    clampAllWindows() {
        document.querySelectorAll('.window').forEach(win => {
            if (win.style.display !== 'none') this.clampWindowToWorkArea(win, false);
        });
    }

    saveGeometry(win) {
        if (!win || win.classList.contains('xp-maximized')) return;
        const appId = win.dataset.appId;
        if (!appId) return;

        const all = this.getStoredGeometries();
        all[appId] = {
            left: Math.round(win.offsetLeft),
            top: Math.round(win.offsetTop),
            width: Math.round(win.offsetWidth),
            height: Math.round(win.offsetHeight)
        };
        localStorage.setItem(this.geometryStorageKey, JSON.stringify(all));
    }

    getInitialGeometry(appConfig) {
        const stored = this.getStoredGeometries()[appConfig.id];
        const area = this.getWorkArea();
        const minW = appConfig.minWidth || 220;
        const minH = appConfig.minHeight || 160;
        const maxW = Math.max(minW, area.width - 20);
        const maxH = Math.max(minH, area.height - 10);

        if (stored) {
            const width = Math.min(Math.max(stored.width || appConfig.width || 640, minW), maxW);
            const height = Math.min(Math.max(stored.height || appConfig.height || 460, minH), maxH);
            const left = Math.min(Math.max(stored.left || 0, -width + 80), area.right - 80);

            let top = Math.min(Math.max(stored.top || 0, 0), area.bottom - 25);
            if (top + height > area.bottom) top = Math.max(0, area.bottom - height);

            return { left, top, width, height };
        }

        const offset = (this.cascadeIndex++ % 8) * 24;
        const width = Math.min(Math.max(appConfig.width || 640, minW), maxW);
        const height = Math.min(Math.max(appConfig.height || 460, minH), maxH);
        const left = Math.min(34 + offset, Math.max(0, area.width - width - 10));
        const top = Math.min(28 + offset, Math.max(0, area.height - height - 8));
        return { left, top, width, height };
    }

    bringToFront(win) {
        if (!win || win.style.display === 'none') return;

        this.highestZ++;
        win.style.zIndex = this.highestZ;
        document.querySelectorAll('.window').forEach(w => {
            if (w !== win) w.classList.add('inactive');
        });
        win.classList.remove('inactive');
        this.activeWindowId = win.id;

        if (window.taskbar) window.taskbar.setActiveTask(win.dataset.appId);
    }

    activateTopVisibleWindow(excludeId = null) {
        const candidates = [...document.querySelectorAll('.window')]
            .filter(w => w.id !== excludeId && w.style.display !== 'none')
            .sort((a, b) => (parseInt(b.style.zIndex || '0', 10) - parseInt(a.style.zIndex || '0', 10)));

        if (candidates.length) {
            this.bringToFront(candidates[0]);
        } else {
            this.activeWindowId = null;
            document.querySelectorAll('.task-btn').forEach(b => b.classList.remove('active'));
        }
    }

    open(appConfig, launchContext = null) {
        if (!appConfig || !appConfig.id) return;

        let win = document.getElementById('win-' + appConfig.id);
        if (!win) {
            win = this.createDOM(appConfig);
            document.body.appendChild(win);
        }

        if (launchContext) this.pendingLaunchContexts[appConfig.id] = launchContext;

        const iframe = win.querySelector('iframe');
        if (iframe && appConfig.url && (iframe.getAttribute('src') === 'about:blank' || !iframe.getAttribute('src'))) {
            iframe.src = appConfig.url;
        } else if (iframe && launchContext) {
            this.sendLaunchContext(appConfig.id);
        }

        win.style.display = 'flex';
        this.clampWindowToWorkArea(win, false);
        if (window.taskbar) window.taskbar.ensureButton(appConfig);
        this.bringToFront(win);
    }

    sendLaunchContext(appId) {
        const context = this.pendingLaunchContexts[appId];
        if (!context) return;
        const win = document.getElementById('win-' + appId);
        const iframe = win && win.querySelector('iframe');
        if (!iframe || !iframe.contentWindow) return;
        try {
            iframe.contentWindow.postMessage({ type: 'xp-launch-context', appId, context }, '*');
            delete this.pendingLaunchContexts[appId];
        } catch (_) {}
    }

    cycleWindows(direction = 1) {
        const visible = [...document.querySelectorAll('.window')]
            .filter(w => w.style.display !== 'none')
            .sort((a, b) => parseInt(b.style.zIndex || '0', 10) - parseInt(a.style.zIndex || '0', 10));
        if (!visible.length) return;
        const current = visible.findIndex(w => w.id === this.activeWindowId);
        const start = current >= 0 ? current : 0;
        const next = (start + direction + visible.length) % visible.length;
        this.bringToFront(visible[next]);
    }

    resize(appId, width, height) {
        const win = document.getElementById('win-' + appId);
        if (!win || win.classList.contains('xp-maximized')) return;

        const minW = Number(win.dataset.minWidth || 220);
        const minH = Number(win.dataset.minHeight || 160);
        const area = this.getWorkArea();

        const requestedW = Math.max(minW, Number(width) || minW);
        const requestedH = Math.max(minH, Number(height) || minH);

        win.style.width = Math.min(requestedW, Math.max(minW, area.right - win.offsetLeft)) + 'px';
        win.style.height = Math.min(requestedH, Math.max(minH, area.bottom - win.offsetTop)) + 'px';

        this.clampWindowToWorkArea(win, false);
        this.saveGeometry(win);
    }

    setTitle(appId, title) {
        const text = String(title || '').trim();
        if (!text) return false;

        const win = document.getElementById('win-' + appId);
        if (win) {
            const label = win.querySelector('.window-header-title span');
            if (label) label.textContent = text;
        }

        const task = document.getElementById('task-' + appId);
        if (task) {
            const label = task.querySelector('span');
            if (label) label.textContent = text;
            task.title = text;
        }
        return true;
    }

    close(appId, options = {}) {
        const win = document.getElementById('win-' + appId);
        if (!win) return false;

        const iframe = win.querySelector('iframe');
        if (!options.force && iframe && iframe.contentWindow) {
            try {
                if (typeof iframe.contentWindow.xpBeforeClose === 'function') {
                    const allowClose = iframe.contentWindow.xpBeforeClose();
                    if (allowClose === false) {
                        this.bringToFront(win);
                        return false;
                    }
                }
            } catch (_) {}
        }

        this.saveGeometry(win);
        win.style.display = 'none';
        if (iframe) iframe.src = 'about:blank';
        if (window.taskbar) window.taskbar.removeButton(appId);

        if (this.activeWindowId === win.id) this.activateTopVisibleWindow(win.id);
        return true;
    }

    minimize(appId) {
        const win = document.getElementById('win-' + appId);
        if (!win) return;

        this.saveGeometry(win);
        win.style.display = 'none';
        if (window.taskbar) window.taskbar.setInactiveTask(appId);

        if (this.activeWindowId === win.id) this.activateTopVisibleWindow(win.id);
    }

    toggleMaximize(appId) {
        const win = document.getElementById('win-' + appId);
        if (!win || win.dataset.resizable === 'false') return;

        const maxBtn = win.querySelector('.win-max');
        if (!win.classList.contains('xp-maximized')) {
            this.restoreGeometries[appId] = {
                left: win.style.left,
                top: win.style.top,
                width: win.style.width,
                height: win.style.height
            };
            this.saveGeometry(win);
            win.classList.add('xp-maximized');
            if (maxBtn) {
                maxBtn.classList.add('is-restore');
                maxBtn.title = 'Önceki Boyut';
            }
        } else {
            win.classList.remove('xp-maximized');
            const g = this.restoreGeometries[appId] || this.getStoredGeometries()[appId] || {};
            if (g.left !== undefined) win.style.left = typeof g.left === 'number' ? g.left + 'px' : g.left;
            if (g.top !== undefined) win.style.top = typeof g.top === 'number' ? g.top + 'px' : g.top;
            if (g.width !== undefined) win.style.width = typeof g.width === 'number' ? g.width + 'px' : g.width;
            if (g.height !== undefined) win.style.height = typeof g.height === 'number' ? g.height + 'px' : g.height;
            if (maxBtn) {
                maxBtn.classList.remove('is-restore');
                maxBtn.title = 'Ekranı Kapla';
            }
            this.saveGeometry(win);
        }
        this.bringToFront(win);
    }

    createDOM(appConfig) {
        const win = document.createElement('div');
        const resizable = appConfig.resizable !== false;
        const geom = this.getInitialGeometry(appConfig);

        win.className = 'window' + (resizable ? ' resizable' : '');
        win.id = 'win-' + appConfig.id;
        win.dataset.appId = appConfig.id;
        win.dataset.resizable = String(resizable);
        win.dataset.minWidth = String(appConfig.minWidth || 220);
        win.dataset.minHeight = String(appConfig.minHeight || 160);
        win.style.width = geom.width + 'px';
        win.style.height = geom.height + 'px';
        win.style.left = geom.left + 'px';
        win.style.top = geom.top + 'px';

        win.innerHTML = `
            <div class="window-header">
                <div class="window-header-title">
                    <img src="${appConfig.icon || './icons/window-0.png'}" onerror="this.onerror=null; this.src='./icons/window-0.png';">
                    <span>${appConfig.title || 'Pencere'}</span>
                </div>
                <div class="window-btns">
                    <div class="win-btn win-min" role="button" aria-label="Simge Durumuna Küçült" title="Simge Durumuna Küçült"></div>
                    <div class="win-btn win-max ${resizable ? '' : 'disabled'}" role="button" aria-label="Ekranı Kapla" title="Ekranı Kapla"></div>
                    <div class="win-btn win-close" role="button" aria-label="Kapat" title="Kapat"></div>
                </div>
            </div>
            <div class="window-content" style="position:relative; flex:1; display:flex; overflow:hidden;">
                <iframe class="window-iframe" style="width:100%; height:100%; border:none;" src="about:blank" allow="autoplay; fullscreen"></iframe>
                <div class="iframe-shield" style="display:none; position:absolute; inset:0; z-index:999;"></div>
            </div>
            ${resizable ? `
                <div class="resizer resizer-r" style="position:absolute; right:0; top:0; width:6px; height:100%; cursor:ew-resize; z-index:100;"></div>
                <div class="resizer resizer-b" style="position:absolute; bottom:0; left:0; width:100%; height:6px; cursor:ns-resize; z-index:100;"></div>
                <div class="resizer resizer-rb" style="position:absolute; right:0; bottom:0; width:14px; height:14px; cursor:nwse-resize; z-index:101;"></div>
            ` : ''}
        `;

        const header = win.querySelector('.window-header');
        const minBtn = win.querySelector('.win-min');
        const maxBtn = win.querySelector('.win-max');
        const closeBtn = win.querySelector('.win-close');
        const iframe = win.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('load', () => {
                if (iframe.getAttribute('src') && iframe.getAttribute('src') !== 'about:blank') {
                    this.sendLaunchContext(appConfig.id);
                }
            });
        }

        minBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimize(appConfig.id);
        });
        if (resizable) {
            maxBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMaximize(appConfig.id);
            });
        }
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close(appConfig.id);
        });

        header.addEventListener('mousedown', (e) => this.dragWindow(e, win));
        if (resizable) {
            header.addEventListener('dblclick', (e) => {
                if (!e.target.closest('.win-btn')) this.toggleMaximize(appConfig.id);
            });
            this.initResize(win);
        }
        win.addEventListener('mousedown', () => this.bringToFront(win));
        return win;
    }

    dragWindow(e, win) {
        if (e.button !== 0 || e.target.closest('.win-btn')) return;
        if (win.classList.contains('xp-maximized')) return;
        e.preventDefault();
        this.bringToFront(win);

        const shield = win.querySelector('.iframe-shield');
        if (shield) shield.style.display = 'block';

        const shiftX = e.clientX - win.offsetLeft;
        const shiftY = e.clientY - win.offsetTop;

        const onMouseMove = (ev) => {
            let left = ev.clientX - shiftX;
            let top = ev.clientY - shiftY;
            left = Math.max(-win.offsetWidth + 80, Math.min(left, window.innerWidth - 80));
            top = Math.max(0, Math.min(top, this.getWorkArea().bottom - 25));
            win.style.left = left + 'px';
            win.style.top = top + 'px';
        };

        const onMouseUp = () => {
            if (shield) shield.style.display = 'none';
            this.saveGeometry(win);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    initResize(win) {
        const shield = win.querySelector('.iframe-shield');
        const makeResizable = (el, type) => {
            if (!el) return;
            el.addEventListener('mousedown', (e) => {
                if (e.button !== 0 || win.classList.contains('xp-maximized')) return;
                e.stopPropagation();
                e.preventDefault();
                this.bringToFront(win);
                if (shield) shield.style.display = 'block';

                const startX = e.clientX;
                const startY = e.clientY;
                const startW = win.offsetWidth;
                const startH = win.offsetHeight;
                const minW = Number(win.dataset.minWidth || 220);
                const minH = Number(win.dataset.minHeight || 160);

                const onMove = (ev) => {
                    if (type === 'r' || type === 'rb') {
                        const maxW = window.innerWidth - win.offsetLeft;
                        win.style.width = Math.min(maxW, Math.max(minW, startW + (ev.clientX - startX))) + 'px';
                    }
                    if (type === 'b' || type === 'rb') {
                        const maxH = this.getWorkArea().bottom - win.offsetTop;
                        win.style.height = Math.min(maxH, Math.max(minH, startH + (ev.clientY - startY))) + 'px';
                    }
                };

                const onUp = () => {
                    if (shield) shield.style.display = 'none';
                    this.saveGeometry(win);
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                };

                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            });
        };

        makeResizable(win.querySelector('.resizer-r'), 'r');
        makeResizable(win.querySelector('.resizer-b'), 'b');
        makeResizable(win.querySelector('.resizer-rb'), 'rb');
    }
}

window.windowManager = new WindowManager();

window.addEventListener('resize', () => {
    if (window.windowManager) window.windowManager.clampAllWindows();
});
