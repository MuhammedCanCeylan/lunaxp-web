/* =============================================================
   Windows XP Shell System Settings - Phase 3D
   Taskbar properties, notification area, volume control/mixer,
   desktop Display Properties and local wallpaper upload.
   ============================================================= */
(function () {
    'use strict';

    const TASKBAR_KEY = 'xp_taskbar_settings_v1';
    const AUDIO_KEY = 'xp_audio_settings_v1';
    const DISPLAY_KEY = 'xp_display_settings_v1';

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    function readJSON(key, fallback) {
        try {
            const parsed = JSON.parse(localStorage.getItem(key) || 'null');
            return parsed && typeof parsed === 'object' ? Object.assign({}, fallback, parsed) : Object.assign({}, fallback);
        } catch (_) {
            return Object.assign({}, fallback);
        }
    }

    function writeJSON(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
    }

    function clamp(n, min, max) {
        n = Number(n);
        return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : min;
    }

    class XPSystemSettings {
        constructor() {
            this.taskbar = readJSON(TASKBAR_KEY, {
                locked: true,
                autoHide: false,
                keepOnTop: true,
                quickLaunch: true,
                hideInactive: true,
                showClock: true
            });
            this.audio = readJSON(AUDIO_KEY, {
                master: 80,
                wave: 100,
                synth: 85,
                cd: 90,
                line: 75,
                muted: false,
                waveMuted: false,
                synthMuted: false,
                cdMuted: false,
                lineMuted: false
            });
            this.display = readJSON(DISPLAY_KEY, {
                wallpaper: 'bliss',
                customWallpaper: '',
                customName: '',
                position: 'stretch',
                theme: 'blue',
                screenSaver: 'none',
                screenSaverMinutes: 10
            });
            this.currentDialog = null;
            this.taskMenu = null;
            this.taskButtonMenu = null;
            this.volumePopup = null;
        }

        init() {
            this.ensureShellUi();
            this.applyTaskbarSettings();
            this.applyDisplaySettings();
            this.applyAudioState();
            this.bindTaskbar();
            this.bindTray();
            this.bindGlobalDismiss();
            this.syncVolumeControls();
        }

        ensureShellUi() {
            if (!$('#xpTaskbarContextMenu')) {
                const menu = document.createElement('div');
                menu.id = 'xpTaskbarContextMenu';
                menu.className = 'xp-sys-menu';
                menu.innerHTML = `
                    <div class="xp-sys-menu-row has-sub" data-submenu="toolbar"><span>Araç Çubukları</span><b>▶</b></div>
                    <div class="xp-sys-submenu" data-menu="toolbar">
                        <div class="xp-sys-menu-row" data-action="toggle-quicklaunch"><i data-check="quickLaunch"></i><span>Hızlı Başlat</span></div>
                    </div>
                    <div class="xp-sys-menu-sep"></div>
                    <div class="xp-sys-menu-row" data-action="cascade"><span>Pencereleri Basamakla</span></div>
                    <div class="xp-sys-menu-row" data-action="tile-horizontal"><span>Pencereleri Yatay Döşe</span></div>
                    <div class="xp-sys-menu-row" data-action="tile-vertical"><span>Pencereleri Dikey Döşe</span></div>
                    <div class="xp-sys-menu-row" data-action="show-desktop"><span>Masaüstünü Göster</span></div>
                    <div class="xp-sys-menu-sep"></div>
                    <div class="xp-sys-menu-row" data-action="task-manager"><span>Görev Yöneticisi</span></div>
                    <div class="xp-sys-menu-sep"></div>
                    <div class="xp-sys-menu-row" data-action="toggle-lock"><i data-check="locked"></i><span>Görev Çubuğunu Kilitle</span></div>
                    <div class="xp-sys-menu-row" data-action="taskbar-properties"><span>Özellikler</span></div>`;
                document.body.appendChild(menu);
                this.taskMenu = menu;
            } else this.taskMenu = $('#xpTaskbarContextMenu');

            if (!$('#xpTaskButtonContextMenu')) {
                const menu = document.createElement('div');
                menu.id = 'xpTaskButtonContextMenu';
                menu.className = 'xp-sys-menu xp-task-button-menu';
                menu.innerHTML = `
                    <div class="xp-sys-menu-row" data-action="restore-window"><span>Önceki Boyut</span></div>
                    <div class="xp-sys-menu-row" data-action="minimize-window"><span>Simge Durumuna Küçült</span></div>
                    <div class="xp-sys-menu-row" data-action="maximize-window"><span>Ekranı Kapla</span></div>
                    <div class="xp-sys-menu-sep"></div>
                    <div class="xp-sys-menu-row strong" data-action="close-window"><span>Kapat</span><em>Alt+F4</em></div>`;
                document.body.appendChild(menu);
                this.taskButtonMenu = menu;
            } else this.taskButtonMenu = $('#xpTaskButtonContextMenu');

            // Reuse the existing compact popup but replace its content with a more XP-like control.
            const vp = $('#volumePopup');
            if (vp) {
                vp.classList.add('xp-volume-popup');
                vp.innerHTML = `
                    <div class="xp-volume-popup-title">Ses Düzeyi</div>
                    <div class="xp-volume-popup-body">
                        <span class="xp-volume-high">Yüksek</span>
                        <div class="xp-volume-track-wrap">
                            <input id="xpMasterVolume" type="range" min="0" max="100" value="${this.audio.master}" aria-label="Ana ses düzeyi">
                        </div>
                        <span class="xp-volume-low">Düşük</span>
                    </div>
                    <label class="xp-volume-mute"><input id="xpMasterMute" type="checkbox"> Sessiz</label>
                    <div class="xp-volume-hint">Karıştırıcı için çift tıklayın</div>`;
                this.volumePopup = vp;
            }
        }

        bindTaskbar() {
            const taskbar = $('.taskbar');
            if (!taskbar) return;

            taskbar.addEventListener('contextmenu', e => {
                const taskButton = e.target.closest('.task-btn');
                if (taskButton) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openTaskButtonMenu(taskButton, e.clientX, e.clientY);
                    return;
                }
                // Let the Start button / tray keep their own meaning but still allow taskbar properties on blank area.
                if (e.target.closest('.start-btn')) return;
                e.preventDefault();
                e.stopPropagation();
                this.openTaskbarMenu(e.clientX, e.clientY);
            });

            this.taskMenu?.addEventListener('click', e => {
                const row = e.target.closest('.xp-sys-menu-row[data-action]');
                if (!row) return;
                e.stopPropagation();
                this.handleTaskbarAction(row.dataset.action);
            });

            this.taskMenu?.addEventListener('mouseover', e => {
                const row = e.target.closest('[data-submenu]');
                if (!row) return;
                const sub = this.taskMenu.querySelector('[data-menu="' + row.dataset.submenu + '"]');
                if (sub) {
                    sub.style.display = 'block';
                    const rr = row.getBoundingClientRect();
                    sub.style.left = (rr.width - 2) + 'px';
                    sub.style.top = (row.offsetTop - 2) + 'px';
                }
            });
            this.taskMenu?.addEventListener('mouseleave', () => {
                this.taskMenu.querySelectorAll('.xp-sys-submenu').forEach(x => x.style.display = 'none');
            });

            this.taskButtonMenu?.addEventListener('click', e => {
                const row = e.target.closest('.xp-sys-menu-row[data-action]');
                if (!row || !this.taskButtonMenu.dataset.appId) return;
                const id = this.taskButtonMenu.dataset.appId;
                this.hideMenus();
                if (!window.windowManager) return;
                if (row.dataset.action === 'restore-window') {
                    const win = $('#win-' + CSS.escape(id));
                    if (win && win.style.display === 'none') win.style.display = 'flex';
                    if (win?.classList.contains('xp-maximized')) windowManager.toggleMaximize(id);
                    if (win) windowManager.bringToFront(win);
                } else if (row.dataset.action === 'minimize-window') windowManager.minimize(id);
                else if (row.dataset.action === 'maximize-window') {
                    const win = $('#win-' + CSS.escape(id));
                    if (win && !win.classList.contains('xp-maximized')) windowManager.toggleMaximize(id);
                } else if (row.dataset.action === 'close-window') windowManager.close(id);
            });
        }

        bindTray() {
            const speaker = $('.tray-speaker');
            if (speaker) {
                speaker.id = 'trayVolume';
                speaker.setAttribute('title', 'Ses Düzeyi');
                speaker.addEventListener('dblclick', e => {
                    e.preventDefault(); e.stopPropagation();
                    this.hideCompactVolume();
                    this.openVolumeMixer();
                });
                speaker.addEventListener('contextmenu', e => {
                    e.preventDefault(); e.stopPropagation();
                    this.openVolumeTrayMenu(e.clientX, e.clientY);
                });
            }

            const slider = $('#xpMasterVolume');
            const mute = $('#xpMasterMute');
            slider?.addEventListener('input', () => this.setMasterVolume(slider.value));
            mute?.addEventListener('change', () => this.setMuted(mute.checked));

            const clock = $('#clock');
            clock?.addEventListener('contextmenu', e => {
                e.preventDefault();
                if (typeof window.openDateTimeModal === 'function') window.openDateTimeModal();
            });
        }

        bindGlobalDismiss() {
            document.addEventListener('mousedown', e => {
                if (!e.target.closest('#xpTaskbarContextMenu') && !e.target.closest('#xpTaskButtonContextMenu') && !e.target.closest('.xp-tray-context')) {
                    this.hideMenus();
                }
                if (this.volumePopup && this.volumePopup.style.display === 'flex' && !e.target.closest('#volumePopup') && !e.target.closest('.tray-speaker')) {
                    this.hideCompactVolume();
                }
            });
            window.addEventListener('resize', () => this.hideMenus());
        }

        openTaskbarMenu(x, y) {
            this.hideMenus();
            const menu = this.taskMenu;
            if (!menu) return;
            menu.querySelectorAll('[data-check]').forEach(i => {
                const key = i.dataset.check;
                i.textContent = this.taskbar[key] ? '✓' : '';
            });
            menu.style.display = 'block';
            this.placeMenu(menu, x, y);
        }

        openTaskButtonMenu(button, x, y) {
            this.hideMenus();
            const id = (button.id || '').replace(/^task-/, '');
            const win = $('#win-' + CSS.escape(id));
            if (!id || !win) return;
            this.taskButtonMenu.dataset.appId = id;
            const maxRow = this.taskButtonMenu.querySelector('[data-action="maximize-window"]');
            const restoreRow = this.taskButtonMenu.querySelector('[data-action="restore-window"]');
            maxRow?.classList.toggle('disabled', win.dataset.resizable === 'false' || win.classList.contains('xp-maximized'));
            restoreRow?.classList.toggle('disabled', !win.classList.contains('xp-maximized') && win.style.display !== 'none');
            this.taskButtonMenu.style.display = 'block';
            this.placeMenu(this.taskButtonMenu, x, y);
        }

        openVolumeTrayMenu(x, y) {
            document.querySelectorAll('.xp-tray-context').forEach(el => el.remove());
            const menu = document.createElement('div');
            menu.className = 'xp-sys-menu xp-tray-context';
            menu.innerHTML = `
                <div class="xp-sys-menu-row" data-a="open"><span>Ses Denetimini Aç</span></div>
                <div class="xp-sys-menu-row" data-a="mute"><i>${this.audio.muted ? '✓' : ''}</i><span>Sessiz</span></div>
                <div class="xp-sys-menu-sep"></div>
                <div class="xp-sys-menu-row" data-a="properties"><span>Ses Özelliklerini Ayarla</span></div>`;
            document.body.appendChild(menu);
            menu.style.display = 'block';
            this.placeMenu(menu, x, y);
            menu.addEventListener('click', e => {
                const row = e.target.closest('[data-a]'); if (!row) return;
                const a = row.dataset.a; menu.remove();
                if (a === 'open') this.openVolumeMixer();
                else if (a === 'mute') this.setMuted(!this.audio.muted);
                else if (a === 'properties') this.openVolumeMixer();
            });
        }

        placeMenu(menu, x, y) {
            requestAnimationFrame(() => {
                const w = menu.offsetWidth || 190, h = menu.offsetHeight || 200;
                menu.style.left = Math.max(2, Math.min(x, innerWidth - w - 3)) + 'px';
                menu.style.top = Math.max(2, Math.min(y, innerHeight - h - 3)) + 'px';
            });
        }

        hideMenus() {
            [this.taskMenu, this.taskButtonMenu].forEach(m => { if (m) m.style.display = 'none'; });
            document.querySelectorAll('.xp-tray-context').forEach(el => el.remove());
        }

        handleTaskbarAction(action) {
            this.hideMenus();
            switch (action) {
                case 'toggle-quicklaunch': this.taskbar.quickLaunch = !this.taskbar.quickLaunch; this.saveTaskbar(); break;
                case 'toggle-lock': this.taskbar.locked = !this.taskbar.locked; this.saveTaskbar(); break;
                case 'cascade': this.arrangeWindows('cascade'); break;
                case 'tile-horizontal': this.arrangeWindows('horizontal'); break;
                case 'tile-vertical': this.arrangeWindows('vertical'); break;
                case 'show-desktop':
                    if (window.xpShellUI?.showDesktop) window.xpShellUI.showDesktop();
                    else if (typeof window.showDesktop === 'function') window.showDesktop();
                    break;
                case 'task-manager': this.showInfo('Windows Görev Yöneticisi', 'Görev Yöneticisi çekirdeği henüz kurulmadı. Bu seçenek Windows XP görev çubuğu düzeninin parçası olarak hazırlandı.'); break;
                case 'taskbar-properties': this.openTaskbarProperties(); break;
            }
        }

        saveTaskbar() {
            writeJSON(TASKBAR_KEY, this.taskbar);
            this.applyTaskbarSettings();
        }

        applyTaskbarSettings() {
            const tb = $('.taskbar');
            const ql = $('.quick-launch');
            const tray = $('.tray');
            const clock = $('#clock');
            if (!tb) return;
            tb.classList.toggle('xp-taskbar-unlocked', !this.taskbar.locked);
            tb.classList.toggle('xp-taskbar-auto-hide', !!this.taskbar.autoHide);
            tb.classList.toggle('xp-taskbar-not-top', !this.taskbar.keepOnTop);
            if (ql) ql.style.display = this.taskbar.quickLaunch ? 'flex' : 'none';
            if (clock) clock.style.display = this.taskbar.showClock ? '' : 'none';
            if (tray) {
                tray.classList.toggle('xp-hide-inactive-enabled', !!this.taskbar.hideInactive);
                if (!this.taskbar.hideInactive) tray.classList.add('show-inactive');
                else tray.classList.remove('show-inactive');
                const ch = $('.tray-chevron', tray);
                if (ch) ch.style.display = this.taskbar.hideInactive ? 'inline-flex' : 'none';
            }
        }

        arrangeWindows(mode) {
            const wins = $$('.window').filter(w => w.style.display !== 'none');
            if (!wins.length) return;
            const H = Math.max(120, innerHeight - 30);
            const W = innerWidth;
            wins.forEach(w => {
                if (w.classList.contains('xp-maximized') && window.windowManager) windowManager.toggleMaximize(w.dataset.appId);
            });
            if (mode === 'cascade') {
                const width = Math.max(360, Math.min(720, W - 160));
                const height = Math.max(260, Math.min(520, H - 130));
                wins.forEach((w, i) => {
                    w.style.left = (18 + (i % 10) * 24) + 'px';
                    w.style.top = (16 + (i % 10) * 24) + 'px';
                    if (w.dataset.resizable !== 'false') { w.style.width = width + 'px'; w.style.height = height + 'px'; }
                    windowManager?.bringToFront(w);
                });
                return;
            }
            const count = wins.length;
            if (mode === 'horizontal') {
                const h = Math.floor(H / count);
                wins.forEach((w, i) => {
                    w.style.left = '0px'; w.style.top = (i * h) + 'px';
                    w.style.width = W + 'px'; w.style.height = h + 'px';
                });
            } else {
                const width = Math.floor(W / count);
                wins.forEach((w, i) => {
                    w.style.left = (i * width) + 'px'; w.style.top = '0px';
                    w.style.width = width + 'px'; w.style.height = H + 'px';
                });
            }
        }

        toggleCompactVolume(e) {
            if (e) { e.stopPropagation(); e.preventDefault(); }
            const vp = this.volumePopup || $('#volumePopup');
            if (!vp) return;
            if (typeof window.closeNetworkPopup === 'function') window.closeNetworkPopup();
            const opening = vp.style.display !== 'flex';
            vp.style.display = opening ? 'flex' : 'none';
            if (opening) this.syncVolumeControls();
        }

        hideCompactVolume() {
            const vp = this.volumePopup || $('#volumePopup');
            if (vp) vp.style.display = 'none';
        }

        setMasterVolume(value) {
            this.audio.master = Math.round(clamp(value, 0, 100));
            if (this.audio.master > 0 && this.audio.muted && value > 0) this.audio.muted = false;
            this.saveAudio();
        }

        setMuted(muted) {
            this.audio.muted = !!muted;
            this.saveAudio();
        }

        saveAudio() {
            writeJSON(AUDIO_KEY, this.audio);
            this.syncVolumeControls();
            this.applyAudioState();
        }

        syncVolumeControls() {
            const s = $('#xpMasterVolume'), m = $('#xpMasterMute');
            if (s) s.value = String(this.audio.master);
            if (m) m.checked = !!this.audio.muted;
            const tray = $('#trayVolume');
            if (tray) tray.classList.toggle('muted', this.audio.muted || this.audio.master === 0);
            $$('[data-audio-channel]').forEach(el => {
                const key = el.dataset.audioChannel;
                if (el.type === 'range') el.value = String(this.audio[key] ?? 80);
                if (el.type === 'checkbox') el.checked = !!this.audio[key + 'Muted'];
            });
        }

        applyAudioState() {
            const effective = this.audio.muted ? 0 : clamp(this.audio.master / 100, 0, 1) * (this.audio.waveMuted ? 0 : clamp(this.audio.wave / 100, 0, 1));
            const applyDoc = doc => {
                try {
                    doc.querySelectorAll('audio,video').forEach(media => {
                        media.muted = this.audio.muted || this.audio.waveMuted;
                        media.volume = clamp(effective, 0, 1);
                    });
                } catch (_) {}
            };
            applyDoc(document);
            $$('iframe').forEach(frame => {
                try { if (frame.contentDocument) applyDoc(frame.contentDocument); } catch (_) {}
                try { frame.contentWindow?.postMessage({ type:'xp-audio-state', volume: effective, muted: this.audio.muted, channels: Object.assign({}, this.audio) }, '*'); } catch (_) {}
            });
        }

        openVolumeMixer() {
            const channels = [
                ['master','Ana Ses'], ['wave','Wave'], ['synth','SW Synth'], ['cd','CD Çalar'], ['line','Line In']
            ];
            const body = document.createElement('div');
            body.className = 'xp-mixer';
            body.innerHTML = '<div class="xp-mixer-device"><b>Aygıt:</b> Realtek AC97 Audio</div><div class="xp-mixer-channels"></div>';
            const host = $('.xp-mixer-channels', body);
            channels.forEach(([key,label]) => {
                const isMaster = key === 'master';
                const col = document.createElement('div'); col.className = 'xp-mixer-channel';
                col.innerHTML = `<div class="xp-mixer-label">${label}</div>
                    <div class="xp-balance"><span>Balans:</span><input type="range" min="0" max="100" value="50"></div>
                    <div class="xp-mixer-volume-label">Ses Düzeyi:</div>
                    <div class="xp-mixer-slider"><span>Yüksek</span><input data-audio-channel="${key}" type="range" min="0" max="100"><span>Düşük</span></div>
                    <label class="xp-mixer-check"><input data-audio-channel="${isMaster ? 'master' : key}" data-mute-key="${isMaster ? 'muted' : key + 'Muted'}" type="checkbox"> ${isMaster ? 'Tümü Sessiz' : 'Sessiz'}</label>`;
                host.appendChild(col);
            });
            const dlg = this.openDialog('Ses Denetimi', body, [{label:'Kapat'}], 620, 'xp-volume-mixer-dialog');
            dlg.querySelectorAll('input[type="range"][data-audio-channel]').forEach(el => {
                el.value = String(this.audio[el.dataset.audioChannel] ?? 80);
                el.addEventListener('input', () => { this.audio[el.dataset.audioChannel] = Number(el.value); this.saveAudio(); });
            });
            dlg.querySelectorAll('input[type="checkbox"][data-mute-key]').forEach(el => {
                el.checked = !!this.audio[el.dataset.muteKey];
                el.addEventListener('change', () => { this.audio[el.dataset.muteKey] = el.checked; this.saveAudio(); });
            });
        }

        openTaskbarProperties() {
            const body = document.createElement('div');
            body.innerHTML = `
                <div class="xp-prop-tabs"><button class="active">Görev Çubuğu</button><button>Başlat Menüsü</button></div>
                <div class="xp-prop-page">
                    <div class="xp-taskbar-preview"><div class="mini-start">başlat</div><div class="mini-task"></div><div class="mini-tray">◀ 🔊 12:00</div></div>
                    <fieldset><legend>Görev çubuğu görünümü</legend>
                        <label><input id="tbLocked" type="checkbox"> Görev çubuğunu kilitle</label>
                        <label><input id="tbAutoHide" type="checkbox"> Görev çubuğunu otomatik olarak gizle</label>
                        <label><input id="tbTop" type="checkbox"> Görev çubuğunu diğer pencerelerin üzerinde tut</label>
                        <label><input id="tbQuick" type="checkbox"> Hızlı Başlat'ı Göster</label>
                    </fieldset>
                    <fieldset><legend>Bildirim alanı</legend>
                        <label><input id="tbClock" type="checkbox"> Saati göster</label>
                        <label><input id="tbHideInactive" type="checkbox"> Etkin olmayan simgeleri gizle</label>
                    </fieldset>
                </div>`;
            const d = this.openDialog('Görev Çubuğu ve Başlat Menüsü Özellikleri', body, [
                {label:'Tamam', action: () => { this.readTaskbarForm(body); this.closeDialog(); }},
                {label:'İptal'},
                {label:'Uygula', keep:true, action: () => this.readTaskbarForm(body)}
            ], 430, 'xp-taskbar-properties');
            $('#tbLocked', d).checked = this.taskbar.locked;
            $('#tbAutoHide', d).checked = this.taskbar.autoHide;
            $('#tbTop', d).checked = this.taskbar.keepOnTop;
            $('#tbQuick', d).checked = this.taskbar.quickLaunch;
            $('#tbClock', d).checked = this.taskbar.showClock;
            $('#tbHideInactive', d).checked = this.taskbar.hideInactive;
        }

        readTaskbarForm(root) {
            this.taskbar.locked = $('#tbLocked', root).checked;
            this.taskbar.autoHide = $('#tbAutoHide', root).checked;
            this.taskbar.keepOnTop = $('#tbTop', root).checked;
            this.taskbar.quickLaunch = $('#tbQuick', root).checked;
            this.taskbar.showClock = $('#tbClock', root).checked;
            this.taskbar.hideInactive = $('#tbHideInactive', root).checked;
            this.saveTaskbar();
        }

        openDisplayProperties(initialTab = 'desktop') {
            const body = document.createElement('div');
            body.className = 'xp-display-properties';
            body.innerHTML = `
                <div class="xp-prop-tabs" id="displayTabs">
                    <button data-tab="themes">Temalar</button><button data-tab="desktop" class="active">Masaüstü</button>
                    <button data-tab="screensaver">Ekran Koruyucu</button><button data-tab="appearance">Görünüm</button><button data-tab="settings">Ayarlar</button>
                </div>
                <div class="xp-display-page" data-page="themes">
                    <p>Bilgisayarınızı kişiselleştirmek için bir tema seçin.</p>
                    <label>Tema:</label><select id="displayTheme"><option value="blue">Windows XP (Luna Mavi)</option><option value="olive">Windows XP (Zeytin Yeşili)</option><option value="silver">Windows XP (Gümüş)</option></select>
                    <div class="xp-theme-preview"><div></div><span>Windows XP</span></div>
                </div>
                <div class="xp-display-page active" data-page="desktop">
                    <div class="xp-monitor-preview"><div id="wallPreview"></div></div>
                    <div class="xp-wallpaper-controls">
                        <div><label>Arka plan:</label><select id="wallpaperChoice" size="5"><option value="bliss">Bliss</option><option value="blue">Windows XP Mavisi</option><option value="custom">Bilgisayarımdan seçilen resim</option></select></div>
                        <div class="xp-wallpaper-buttons"><button class="xp-shell-button" id="browseWallpaper">Gözat...</button><div id="wallpaperFileName"></div></div>
                    </div>
                    <div class="xp-wallpaper-position"><label>Konum:</label><select id="wallpaperPosition"><option value="stretch">Uzat</option><option value="center">Ortala</option><option value="tile">Döşe</option></select></div>
                    <input id="wallpaperFile" type="file" accept="image/*" hidden>
                </div>
                <div class="xp-display-page" data-page="screensaver">
                    <div class="xp-monitor-preview screensaver"><div id="screenSaverPreview">Windows XP</div></div>
                    <label>Ekran koruyucu:</label> <select id="screenSaverChoice"><option value="none">(Yok)</option><option value="xp">Windows XP</option><option value="stars">Yıldız Alanı</option></select>
                    <button class="xp-shell-button" id="previewScreenSaver">Önizleme</button>
                    <div class="xp-wait-row">Bekle: <input id="screenSaverMinutes" type="number" min="1" max="60"> dakika</div>
                </div>
                <div class="xp-display-page" data-page="appearance">
                    <div class="xp-appearance-preview"><div class="ap-title">Etkin Pencere</div><div class="ap-body"><button>Normal düğme</button></div></div>
                    <label>Pencereler ve düğmeler:</label><select id="appearanceTheme"><option value="blue">Windows XP stili - Mavi</option><option value="olive">Windows XP stili - Zeytin Yeşili</option><option value="silver">Windows XP stili - Gümüş</option></select>
                </div>
                <div class="xp-display-page" data-page="settings">
                    <div class="xp-monitor-preview settings"><div>${innerWidth} × ${innerHeight}</div></div>
                    <p><b>Ekran çözünürlüğü</b></p><input type="range" min="0" max="3" value="2" disabled><p>Tarayıcı penceresi: ${innerWidth} × ${innerHeight} piksel</p>
                    <p style="margin-top:12px;color:#555">Web simülasyonunda çözünürlük tarayıcı penceresine göre belirlenir.</p>
                </div>`;
            const dialog = this.openDialog('Görüntü Özellikleri', body, [
                {label:'Tamam', action: () => { this.readDisplayForm(body); this.closeDialog(); }},
                {label:'İptal'},
                {label:'Uygula', keep:true, action: () => this.readDisplayForm(body)}
            ], 520, 'xp-display-dialog');

            $$('#displayTabs button', dialog).forEach(btn => btn.addEventListener('click', () => this.switchDisplayTab(dialog, btn.dataset.tab)));
            this.switchDisplayTab(dialog, initialTab);
            $('#wallpaperChoice', dialog).value = this.display.wallpaper;
            $('#wallpaperPosition', dialog).value = this.display.position;
            $('#displayTheme', dialog).value = this.display.theme;
            $('#appearanceTheme', dialog).value = this.display.theme;
            $('#screenSaverChoice', dialog).value = this.display.screenSaver;
            $('#screenSaverMinutes', dialog).value = this.display.screenSaverMinutes;
            $('#wallpaperFileName', dialog).textContent = this.display.customName || 'Henüz özel resim seçilmedi.';
            this.updateWallpaperPreview(dialog);

            $('#wallpaperChoice', dialog).addEventListener('change', () => this.updateWallpaperPreview(dialog));
            $('#wallpaperPosition', dialog).addEventListener('change', () => this.updateWallpaperPreview(dialog));
            $('#browseWallpaper', dialog).addEventListener('click', () => $('#wallpaperFile', dialog).click());
            $('#wallpaperFile', dialog).addEventListener('change', e => {
                const file = e.target.files?.[0];
                if (file) this.loadWallpaperFile(file, dialog);
                e.target.value = '';
            });
            $('#previewScreenSaver', dialog).addEventListener('click', () => this.previewScreenSaver($('#screenSaverChoice', dialog).value));
        }

        switchDisplayTab(dialog, tab) {
            $$('#displayTabs button', dialog).forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
            $$('.xp-display-page', dialog).forEach(p => p.classList.toggle('active', p.dataset.page === tab));
        }

        loadWallpaperFile(file, dialog) {
            if (!file.type.startsWith('image/')) {
                this.showInfo('Görüntü Özellikleri', 'Seçilen dosya geçerli bir resim değil.');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const maxW = 1920, maxH = 1200;
                    const scale = Math.min(1, maxW / img.width, maxH / img.height);
                    const canvas = document.createElement('canvas');
                    canvas.width = Math.max(1, Math.round(img.width * scale));
                    canvas.height = Math.max(1, Math.round(img.height * scale));
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    let data;
                    try { data = canvas.toDataURL('image/jpeg', .86); } catch (_) { data = String(reader.result || ''); }
                    this.display.customWallpaper = data;
                    this.display.customName = file.name;
                    const choice = $('#wallpaperChoice', dialog);
                    choice.value = 'custom';
                    $('#wallpaperFileName', dialog).textContent = file.name;
                    this.updateWallpaperPreview(dialog);
                };
                img.src = String(reader.result || '');
            };
            reader.readAsDataURL(file);
        }

        updateWallpaperPreview(dialog) {
            const p = $('#wallPreview', dialog); if (!p) return;
            const choice = $('#wallpaperChoice', dialog)?.value || this.display.wallpaper;
            const pos = $('#wallpaperPosition', dialog)?.value || this.display.position;
            p.style.backgroundColor = '#1941a5';
            p.style.backgroundImage = '';
            if (choice === 'bliss') p.style.backgroundImage = "url('https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png')";
            else if (choice === 'custom' && this.display.customWallpaper) p.style.backgroundImage = `url(${JSON.stringify(this.display.customWallpaper).slice(1,-1)})`;
            p.style.backgroundPosition = 'center';
            p.style.backgroundRepeat = pos === 'tile' ? 'repeat' : 'no-repeat';
            p.style.backgroundSize = pos === 'stretch' ? 'cover' : 'auto';
        }

        readDisplayForm(root) {
            const choice = $('#wallpaperChoice', root); if (choice) this.display.wallpaper = choice.value;
            const position = $('#wallpaperPosition', root); if (position) this.display.position = position.value;
            const theme1 = $('#appearanceTheme', root), theme2 = $('#displayTheme', root);
            if (theme1 && theme1.value !== this.display.theme) this.display.theme = theme1.value;
            else if (theme2) this.display.theme = theme2.value;
            const saver = $('#screenSaverChoice', root); if (saver) this.display.screenSaver = saver.value;
            const mins = $('#screenSaverMinutes', root); if (mins) this.display.screenSaverMinutes = clamp(mins.value, 1, 60);
            writeJSON(DISPLAY_KEY, this.display);
            this.applyDisplaySettings();
        }

        applyDisplaySettings() {
            const body = document.body;
            if (!body) return;
            body.dataset.xpTheme = this.display.theme || 'blue';
            body.classList.remove('wall-bliss','wall-blue','wall-green','wall-red');
            body.style.backgroundImage = '';
            body.style.backgroundColor = '';
            body.style.backgroundRepeat = '';
            body.style.backgroundPosition = '';
            body.style.backgroundAttachment = '';
            body.style.backgroundSize = '';
            if (this.display.wallpaper === 'custom' && this.display.customWallpaper) {
                body.style.backgroundImage = `url(${JSON.stringify(this.display.customWallpaper).slice(1,-1)})`;
                body.style.backgroundColor = '#1941a5';
                body.style.backgroundPosition = 'center center';
                body.style.backgroundAttachment = 'fixed';
                body.style.backgroundRepeat = this.display.position === 'tile' ? 'repeat' : 'no-repeat';
                body.style.backgroundSize = this.display.position === 'stretch' ? 'cover' : 'auto';
            } else if (this.display.wallpaper === 'blue') {
                body.classList.add('wall-blue');
            } else {
                body.classList.add('wall-bliss');
            }
        }

        previewScreenSaver(type) {
            if (type === 'none') return;
            const overlay = document.createElement('div');
            overlay.className = 'xp-screensaver-preview';
            overlay.tabIndex = 0;
            overlay.innerHTML = type === 'stars' ? '<div class="stars">✦　·　✧　.　✦　·　✧</div>' : '<div class="xp-logo-preview">Microsoft<br><b>Windows XP</b></div>';
            const close = () => overlay.remove();
            overlay.addEventListener('mousedown', close, {once:true});
            overlay.addEventListener('keydown', close, {once:true});
            document.body.appendChild(overlay); overlay.focus();
        }

        openDialog(title, contentNode, buttons, width = 430, extraClass = '') {
            this.closeDialog();
            const overlay = document.createElement('div');
            overlay.className = 'xp-settings-overlay';
            const dlg = document.createElement('div');
            dlg.className = 'xp-settings-dialog ' + extraClass;
            dlg.style.width = Math.min(width, innerWidth - 20) + 'px';
            dlg.innerHTML = `<div class="xp-settings-title"><span>${this.escape(title)}</span><button class="xp-settings-close" type="button" aria-label="Kapat"></button></div><div class="xp-settings-body"></div><div class="xp-settings-buttons"></div>`;
            $('.xp-settings-body', dlg).appendChild(contentNode);
            const btnHost = $('.xp-settings-buttons', dlg);
            (buttons || [{label:'Tamam'}]).forEach(def => {
                const b = document.createElement('button'); b.className = 'xp-shell-button'; b.textContent = def.label;
                b.addEventListener('click', () => {
                    if (def.action) def.action();
                    else this.closeDialog();
                    if (!def.keep && def.action && overlay.isConnected && def.label !== 'Uygula') {
                        // action may already close; if not, close for ordinary action buttons.
                        if (overlay.isConnected) this.closeDialog();
                    }
                });
                btnHost.appendChild(b);
            });
            $('.xp-settings-close', dlg).addEventListener('click', () => this.closeDialog());
            overlay.addEventListener('mousedown', e => { if (e.target === overlay) this.closeDialog(); });
            overlay.appendChild(dlg); document.body.appendChild(overlay);
            this.currentDialog = overlay;
            requestAnimationFrame(() => dlg.querySelector('button,select,input')?.focus());
            return dlg;
        }

        closeDialog() {
            if (this.currentDialog) this.currentDialog.remove();
            this.currentDialog = null;
        }

        showInfo(title, text) {
            const body = document.createElement('div');
            body.className = 'xp-info-message';
            body.innerHTML = `<div class="xp-info-icon">i</div><div>${this.escape(text)}</div>`;
            this.openDialog(title, body, [{label:'Tamam'}], 380, 'xp-info-dialog');
        }

        escape(s) {
            return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        }
    }

    window.xpSystemSettings = new XPSystemSettings();

    // Compatibility wrappers used by the existing inline shell HTML.
    window.toggleVolumePopup = function (e) { window.xpSystemSettings.toggleCompactVolume(e); };
    window.changeGlobalVolume = function (v) { window.xpSystemSettings.setMasterVolume(v); };
    window.toggleGlobalMute = function (m) { window.xpSystemSettings.setMuted(m); };
    window.openDisplayProperties = function () { window.xpSystemSettings.openDisplayProperties('desktop'); };
    window.openTaskbarProperties = function () { window.xpSystemSettings.openTaskbarProperties(); };

    window.addEventListener('load', () => window.xpSystemSettings.init());
})();
