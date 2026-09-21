/* =============================================================
   Windows XP Shell UI Controller - Phase 2C
   Alt+Tab, system menu, Show Desktop and desktop keyboard actions.
   ============================================================= */
(function () {
    'use strict';

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    class XPShellUI {
        constructor() {
            this.altTab = { open: false, items: [], index: 0 };
            this.systemMenuTarget = null;
            this.showDesktopSnapshot = [];
        }

        init() {
            this.ensureAltTabOverlay();
            this.ensureSystemMenu();
            this.ensureDeleteDialog();
            this.bindGlobalKeys();
            this.bindWindowSystemMenus();
            this.bindDesktopKeyboard();
            this.bindDesktopSelectionSync();
            this.bindVfsRefresh();
        }

        ensureAltTabOverlay() {
            if ($('#xpAltTab')) return;
            const el = document.createElement('div');
            el.id = 'xpAltTab';
            el.className = 'xp-alttab';
            el.setAttribute('aria-hidden', 'true');
            el.innerHTML = `
                <div class="xp-alttab-window">
                    <div class="xp-alttab-title">Pencere seçin</div>
                    <div class="xp-alttab-grid" id="xpAltTabGrid"></div>
                    <div class="xp-alttab-caption" id="xpAltTabCaption">&nbsp;</div>
                </div>`;
            document.body.appendChild(el);
        }

        ensureSystemMenu() {
            if ($('#xpWindowSystemMenu')) return;
            const menu = document.createElement('div');
            menu.id = 'xpWindowSystemMenu';
            menu.className = 'xp-system-menu';
            menu.innerHTML = `
                <div class="xp-system-menu-row" data-action="restore"><span>Önceki Boyut</span></div>
                <div class="xp-system-menu-row disabled" data-action="move"><span>Taşı</span></div>
                <div class="xp-system-menu-row disabled" data-action="size"><span>Boyut</span></div>
                <div class="xp-system-menu-row" data-action="minimize"><span>Simge Durumuna Küçült</span></div>
                <div class="xp-system-menu-row" data-action="maximize"><span>Ekranı Kapla</span></div>
                <div class="xp-system-menu-sep"></div>
                <div class="xp-system-menu-row close-row" data-action="close"><span>Kapat</span><kbd>Alt+F4</kbd></div>`;
            document.body.appendChild(menu);

            menu.addEventListener('mousedown', e => e.stopPropagation());
            menu.addEventListener('click', e => {
                const row = e.target.closest('.xp-system-menu-row:not(.disabled)');
                if (!row || !this.systemMenuTarget) return;
                const action = row.dataset.action;
                const appId = this.systemMenuTarget.dataset.appId;
                if (!appId) return;
                if (action === 'restore' && this.systemMenuTarget.classList.contains('xp-maximized')) windowManager.toggleMaximize(appId);
                if (action === 'minimize') windowManager.minimize(appId);
                if (action === 'maximize' && !this.systemMenuTarget.classList.contains('xp-maximized')) windowManager.toggleMaximize(appId);
                if (action === 'close') windowManager.close(appId);
                this.hideSystemMenu();
            });
        }

        ensureDeleteDialog() {
            if ($('#xpDeleteDialog')) return;
            const el = document.createElement('div');
            el.id = 'xpDeleteDialog';
            el.className = 'xp-shell-modal';
            el.setAttribute('aria-hidden', 'true');
            el.innerHTML = `
                <div class="xp-delete-window">
                    <div class="xp-delete-title"><span>Dosya Silme İşlemini Onayla</span><button type="button" data-cancel></button></div>
                    <div class="xp-delete-body">
                        <img src="./icons/recycle_bin_full-0.png" onerror="this.onerror=null;this.src='./icons/recycle_bin_empty-0.png';" alt="">
                        <div><div id="xpDeleteQuestion">Bu öğeyi Geri Dönüşüm Kutusu'na göndermek istediğinizden emin misiniz?</div><strong id="xpDeleteName"></strong></div>
                    </div>
                    <div class="xp-delete-actions"><button class="xp-shell-button default" type="button" data-ok>Evet</button><button class="xp-shell-button" type="button" data-cancel>Hayır</button></div>
                </div>`;
            document.body.appendChild(el);
            $$('[data-cancel]', el).forEach(btn => btn.addEventListener('click', () => this.closeDeleteDialog()));
            $('[data-ok]', el).addEventListener('click', () => this.confirmDesktopDelete());
        }

        getOpenWindows() {
            return $$('.window').filter(win => {
                const appId = win.dataset.appId;
                return appId && document.getElementById('task-' + appId);
            });
        }

        getWindowInfo(win) {
            const appId = win.dataset.appId;
            const app = window.appRegistry && window.appRegistry.get(appId);
            return {
                win,
                appId,
                title: (app && app.title) || $('.window-header-title span', win)?.textContent || appId,
                icon: (app && app.icon) || $('.window-header-title img', win)?.src || './icons/window-0.png'
            };
        }

        beginAltTab(direction) {
            const open = this.getOpenWindows();
            if (!open.length) return;
            this.altTab.items = open
                .sort((a, b) => Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0))
                .map(win => this.getWindowInfo(win));
            if (!this.altTab.open) {
                this.altTab.open = true;
                const activeIndex = this.altTab.items.findIndex(x => x.win.id === windowManager.activeWindowId);
                this.altTab.index = activeIndex >= 0 ? activeIndex : 0;
                this.renderAltTab();
                $('#xpAltTab').classList.add('show');
                $('#xpAltTab').setAttribute('aria-hidden', 'false');
            }
            const len = this.altTab.items.length;
            this.altTab.index = (this.altTab.index + direction + len) % len;
            this.renderAltTab();
        }

        renderAltTab() {
            const grid = $('#xpAltTabGrid');
            const caption = $('#xpAltTabCaption');
            if (!grid || !caption) return;
            grid.innerHTML = '';
            this.altTab.items.forEach((info, idx) => {
                const cell = document.createElement('div');
                cell.className = 'xp-alttab-item' + (idx === this.altTab.index ? ' selected' : '');
                const img = document.createElement('img');
                img.src = info.icon;
                img.alt = '';
                img.onerror = function () { this.onerror = null; this.src = './icons/window-0.png'; };
                cell.appendChild(img);
                grid.appendChild(cell);
            });
            caption.textContent = this.altTab.items[this.altTab.index]?.title || '';
        }

        finishAltTab(commit = true) {
            if (!this.altTab.open) return;
            const selected = this.altTab.items[this.altTab.index];
            this.altTab.open = false;
            $('#xpAltTab')?.classList.remove('show');
            $('#xpAltTab')?.setAttribute('aria-hidden', 'true');
            if (commit && selected && selected.win) {
                if (selected.win.style.display === 'none') selected.win.style.display = 'flex';
                windowManager.bringToFront(selected.win);
            }
            this.altTab.items = [];
        }

        bindGlobalKeys() {
            document.addEventListener('keydown', e => {
                if (e.key === 'Tab' && e.altKey) {
                    e.preventDefault();
                    this.beginAltTab(e.shiftKey ? -1 : 1);
                    return;
                }
                if (e.altKey && (e.key === ' ' || e.code === 'Space')) {
                    e.preventDefault();
                    const active = document.getElementById(windowManager.activeWindowId);
                    if (active && active.style.display !== 'none') this.showSystemMenu(active, active.offsetLeft + 4, active.offsetTop + 24);
                    return;
                }
                if ((e.ctrlKey && e.key === 'Escape') || e.key === 'Meta') {
                    e.preventDefault();
                    if (typeof window.toggleStartMenu === 'function') window.toggleStartMenu(e);
                    return;
                }
                if (e.key === 'Escape') this.hideSystemMenu();
            }, true);

            document.addEventListener('keyup', e => {
                if (e.key === 'Alt' && this.altTab.open) this.finishAltTab(true);
            }, true);

            window.addEventListener('blur', () => {
                if (this.altTab.open) this.finishAltTab(false);
                this.hideSystemMenu();
            });
            document.addEventListener('mousedown', e => {
                if (!e.target.closest('#xpWindowSystemMenu')) this.hideSystemMenu();
            });
        }

        bindWindowSystemMenus() {
            document.addEventListener('click', e => {
                const icon = e.target.closest('.window-header-title img');
                if (!icon) return;
                const win = icon.closest('.window');
                if (!win) return;
                e.stopPropagation();
                const r = icon.getBoundingClientRect();
                this.showSystemMenu(win, r.left, r.bottom + 1);
            });

            document.addEventListener('contextmenu', e => {
                const header = e.target.closest('.window-header');
                if (!header) return;
                const win = header.closest('.window');
                if (!win) return;
                e.preventDefault();
                this.showSystemMenu(win, e.clientX, e.clientY);
            });
        }

        showSystemMenu(win, x, y) {
            const menu = $('#xpWindowSystemMenu');
            if (!menu || !win) return;
            this.systemMenuTarget = win;
            windowManager.bringToFront(win);
            const maximized = win.classList.contains('xp-maximized');
            const resizable = win.dataset.resizable !== 'false';
            const restore = $('[data-action="restore"]', menu);
            const maximize = $('[data-action="maximize"]', menu);
            restore.classList.toggle('disabled', !maximized);
            maximize.classList.toggle('disabled', maximized || !resizable);
            menu.classList.add('show');
            menu.style.left = Math.max(0, Math.min(x, window.innerWidth - menu.offsetWidth - 4)) + 'px';
            menu.style.top = Math.max(0, Math.min(y, window.innerHeight - 30 - menu.offsetHeight - 4)) + 'px';
        }

        hideSystemMenu() {
            $('#xpWindowSystemMenu')?.classList.remove('show');
            this.systemMenuTarget = null;
        }

        showDesktop() {
            const open = this.getOpenWindows();
            const visible = open.filter(w => w.style.display !== 'none');
            if (visible.length) {
                this.showDesktopSnapshot = visible.map(w => w.dataset.appId);
                visible.forEach(w => windowManager.minimize(w.dataset.appId));
                return;
            }
            if (this.showDesktopSnapshot.length) {
                const ids = [...this.showDesktopSnapshot];
                this.showDesktopSnapshot = [];
                ids.forEach(id => {
                    const win = document.getElementById('win-' + id);
                    if (win && document.getElementById('task-' + id)) win.style.display = 'flex';
                });
                const last = document.getElementById('win-' + ids[ids.length - 1]);
                if (last) windowManager.bringToFront(last);
            }
        }

        selectedDesktopIcon() {
            return $('.desktop .icon.selected');
        }

        selectedDesktopIcons() {
            return $$('.desktop .icon.selected');
        }

        openDesktopIcon(icon) {
            if (!icon) return false;
            if (icon.dataset.vfsPath && window.xpShell) return window.xpShell.openVfsItem(icon.dataset.vfsPath);
            if (icon.dataset.shellId && window.appRegistry) return window.appRegistry.openShellItem(icon.dataset.shellId);
            if (icon.dataset.appId && window.xpShell) return window.xpShell.openApp(icon.dataset.appId);
            icon.dispatchEvent(new MouseEvent('dblclick', { bubbles:true }));
            return true;
        }

        bindDesktopSelectionSync() {
            const desktop = $('#desktop');
            if (!desktop) return;
            desktop.addEventListener('click', e => {
                if (!e.target.closest('.icon')) return;
                e.stopPropagation();
            });
        }

        bindDesktopKeyboard() {
            document.addEventListener('keydown', e => {
                const activeTag = document.activeElement?.tagName;
                if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) return;
                if ($('#runDialog.show') || $('#shellNotice.show') || $('#xpDeleteDialog.show')) return;
                if (e.ctrlKey && String(e.key).toLowerCase() === 'a') {
                    const icons = $$('.desktop .icon');
                    if (icons.length) {
                        e.preventDefault();
                        icons.forEach(el => el.classList.add('selected'));
                        return;
                    }
                }
                const icon = this.selectedDesktopIcon();
                const selectedIcons = this.selectedDesktopIcons();
                if (!icon) return;

                if (e.key === 'F2' && selectedIcons.length === 1 && icon.dataset.vfsPath && typeof window.startInlineRename === 'function') {
                    e.preventDefault();
                    const label = $('.icon-label', icon);
                    window.startInlineRename(icon, label ? label.textContent : (window.vfs?.basename(icon.dataset.vfsPath) || ''));
                } else if (e.key === 'Delete' && icon.dataset.vfsPath) {
                    e.preventDefault();
                    this.openDeleteDialog(icon);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    selectedIcons.forEach((selected, index) => setTimeout(() => this.openDesktopIcon(selected), index * 120));
                }
            });
        }

        openDeleteDialog(icon) {
            const dialog = $('#xpDeleteDialog');
            if (!dialog || !icon?.dataset.vfsPath) return;
            dialog.dataset.path = icon.dataset.vfsPath;
            $('#xpDeleteName').textContent = window.vfs?.basename(icon.dataset.vfsPath) || icon.dataset.vfsPath;
            dialog.classList.add('show');
            dialog.setAttribute('aria-hidden', 'false');
            setTimeout(() => $('[data-ok]', dialog)?.focus(), 0);
        }

        closeDeleteDialog() {
            const dialog = $('#xpDeleteDialog');
            if (!dialog) return;
            dialog.classList.remove('show');
            dialog.setAttribute('aria-hidden', 'true');
            delete dialog.dataset.path;
        }

        confirmDesktopDelete() {
            const dialog = $('#xpDeleteDialog');
            const path = dialog?.dataset.path;
            if (!path || !window.vfs) return this.closeDeleteDialog();
            window.vfs.deletePath(path);
            this.closeDeleteDialog();
            if (window.appRegistry) {
                window.appRegistry.renderDesktopIcons();
                if (typeof window.initDraggableIcons === 'function') window.initDraggableIcons();
            }
        }

        bindVfsRefresh() {
            window.addEventListener('vfs-updated', () => {
                if (window.appRegistry) {
                    window.appRegistry.renderDesktopIcons();
                    if (typeof window.initDraggableIcons === 'function') window.initDraggableIcons();
                }
            });
        }
    }

    window.xpShellUI = new XPShellUI();
    window.addEventListener('load', () => window.xpShellUI.init());
    window.showDesktop = () => window.xpShellUI.showDesktop();
})();
