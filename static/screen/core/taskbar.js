/* Windows XP Taskbar Controller - Phase 1 */
class TaskbarManager {
    constructor() {
        this.appsContainer = document.getElementById('taskbarApps');
        this.clockEl = document.getElementById('clock');
        this.clockTimer = null;
        this.resizeHandler = () => this.rebalanceButtons();
    }

    init() {
        this.updateClock();
        if (this.clockTimer) clearInterval(this.clockTimer);
        this.clockTimer = setInterval(() => this.updateClock(), 1000);
        window.removeEventListener('resize', this.resizeHandler);
        window.addEventListener('resize', this.resizeHandler);
        this.rebalanceButtons();
    }

    updateClock() {
    const d = new Date();

    if (this.clockEl) {
        this.clockEl.textContent = d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
}

    ensureButton(appConfig) {
        if (!this.appsContainer || document.getElementById('task-' + appConfig.id)) return;

        const btn = document.createElement('div');
        btn.className = 'task-btn';
        btn.id = 'task-' + appConfig.id;
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.title = appConfig.title || appConfig.id;

        const img = document.createElement('img');
        img.src = appConfig.icon || './icons/window-0.png';
        img.alt = '';
        img.onerror = function () {
            this.onerror = null;
            this.src = './icons/window-0.png';
        };

        const label = document.createElement('span');
        label.textContent = appConfig.title || appConfig.id;
        btn.append(img, label);

        const activate = () => {
            const win = document.getElementById('win-' + appConfig.id);
            if (!win) return;
            if (win.style.display === 'none') {
                win.style.display = 'flex';
                windowManager.bringToFront(win);
            } else if (windowManager.activeWindowId === win.id) {
                windowManager.minimize(appConfig.id);
            } else {
                windowManager.bringToFront(win);
            }
        };

        btn.addEventListener('click', activate);
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
        this.appsContainer.appendChild(btn);
        this.rebalanceButtons();
    }

    rebalanceButtons() {
        if (!this.appsContainer) return;
        const buttons = Array.from(this.appsContainer.querySelectorAll('.task-btn'));
        if (!buttons.length) return;
        const available = Math.max(0, this.appsContainer.clientWidth - Math.max(0, buttons.length - 1) * 3);
        const width = Math.max(74, Math.min(162, Math.floor(available / buttons.length)));
        buttons.forEach(btn => {
            btn.style.width = width + 'px';
            btn.style.minWidth = width + 'px';
            btn.style.maxWidth = width + 'px';
        });
    }

    setActiveTask(appId) {
        document.querySelectorAll('.task-btn').forEach(b => b.classList.remove('active'));
        const cur = document.getElementById('task-' + appId);
        if (cur) cur.classList.add('active');
    }

    setInactiveTask(appId) {
        const cur = document.getElementById('task-' + appId);
        if (cur) cur.classList.remove('active');
    }

    removeButton(appId) {
        const btn = document.getElementById('task-' + appId);
        if (btn) btn.remove();
        this.rebalanceButtons();
    }
}

window.taskbar = new TaskbarManager();
