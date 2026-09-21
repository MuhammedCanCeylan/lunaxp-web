/* Windows XP Shell Bridge - Phase 2
 * Connects VFS objects to applications without duplicating file-system state.
 */
class XPShellBridge {
    constructor() {
        this.clipboard = { mode: null, paths: [] };
        this.fileAssociations = {
            txt: 'notepad', log: 'notepad', ini: 'notepad', bat: 'notepad', sys: 'notepad',
            bmp: 'paint', png: 'paint', jpg: 'paint', jpeg: 'paint', gif: 'paint',
            zip: 'winrar', rar: 'winrar',
            mp3: 'winamp', wav: 'winamp', mid: 'winamp', midi: 'winamp',
            html: 'ie', htm: 'ie'
        };

        window.addEventListener('vfs-updated', () => this.refreshDesktop());
    }

    refreshDesktop() {
        if (window.appRegistry && typeof window.appRegistry.renderDesktopIcons === 'function') {
            window.appRegistry.renderDesktopIcons();
            if (typeof window.initDraggableIcons === 'function') window.initDraggableIcons();
        }
    }

    openApp(appId, context = null) {
        const app = window.appRegistry && window.appRegistry.get(appId);
        if (!app || !window.windowManager) return false;

        if (window.appRegistry && window.appRegistry.recordLaunch) window.appRegistry.recordLaunch(app.id);

        if (app.customLaunch) {
            if (typeof window.spawnBonzi === 'function') { window.spawnBonzi(); return true; }
            if (typeof window.showShellNotice === 'function') window.showShellNotice('Windows', (app.title || appId) + ' şu anda başlatılamıyor.');
            return false;
        }

        if (app.status === 'placeholder') {
            if (typeof window.showShellNotice === 'function') {
                window.showShellNotice(app.title || 'Windows', "Bu program Windows'a kayıtlı, ancak index.html şu anda boş. Geliştirme sırasına alındı.");
            }
            return true;
        }
        if (app.status === 'missing') {
            if (typeof window.showShellNotice === 'function') {
                window.showShellNotice(app.title || 'Windows', "Bu program Windows'a kayıtlı, ancak uygulama giriş dosyası henüz bulunmuyor.");
            }
            return true;
        }

        window.windowManager.open(app, context);
        return true;
    }

    openExplorer(path = 'Bilgisayarım') {
        return this.openApp('explorer', { path });
    }

    openFile(path) {
        if (!window.vfs) return false;
        const node = window.vfs.resolvePath(path);
        if (!node || node.type !== 'file') return false;
        const ext = String(node.ext || (node.name.includes('.') ? node.name.split('.').pop() : '')).toLowerCase();
        const appId = this.fileAssociations[ext];
        if (!appId) return false;
        return this.openApp(appId, { filePath: window.vfs.normalizePath(path), file: window.vfs.clone(node) });
    }

    openVfsItem(path) {
        if (!window.vfs) return false;
        const normalized = window.vfs.normalizePath(path);
        const node = window.vfs.resolvePath(normalized);
        if (!node) return false;
        if (node.type === 'folder' || node.type === 'drive') return this.openExplorer(normalized);
        if (node.type === 'shortcut') {
            if (node.targetAppId) return this.openApp(node.targetAppId, { shortcutPath: normalized });
            if (node.targetPath) return this.openVfsItem(node.targetPath);
            return false;
        }
        if (node.type === 'application') {
            if (node.targetAppId) return this.openApp(node.targetAppId, { executablePath: normalized });
            return false;
        }
        return this.openFile(normalized);
    }

    openMany(paths, delay = 70) {
        const list = Array.from(new Set((paths || []).filter(Boolean)));
        list.forEach((path, index) => setTimeout(() => this.openVfsItem(path), index * delay));
        return list.length;
    }


    setClipboard(mode, paths) {
        const cleanMode = mode === 'cut' ? 'cut' : 'copy';
        const cleanPaths = Array.from(new Set((Array.isArray(paths) ? paths : [paths])
            .filter(Boolean)
            .map(p => window.vfs ? window.vfs.normalizePath(p) : p)));
        this.clipboard = { mode: cleanPaths.length ? cleanMode : null, paths: cleanPaths };
        try { window.dispatchEvent(new CustomEvent('xp-clipboard-updated', { detail: this.getClipboard() })); } catch (_) {}
        return this.getClipboard();
    }

    clearClipboard() {
        this.clipboard = { mode: null, paths: [] };
        try { window.dispatchEvent(new CustomEvent('xp-clipboard-updated', { detail: this.getClipboard() })); } catch (_) {}
    }

    getClipboard() {
        return { mode: this.clipboard.mode, paths: [...this.clipboard.paths] };
    }

    hasClipboard() {
        return !!(this.clipboard.mode && this.clipboard.paths.length);
    }

    pasteInto(targetFolderPath) {
        if (!window.vfs || !this.hasClipboard()) return { ok: false, pasted: [], failed: [] };
        const target = window.vfs.normalizePath(targetFolderPath);
        if (!window.vfs.isContainer(target)) return { ok: false, pasted: [], failed: [...this.clipboard.paths] };

        const mode = this.clipboard.mode;
        const sourcePaths = [...this.clipboard.paths];
        const pasted = [], failed = [];
        sourcePaths.forEach(source => {
            const result = mode === 'cut'
                ? window.vfs.movePath(source, target)
                : window.vfs.copyPath(source, target);
            if (result) pasted.push(result); else failed.push(source);
        });
        if (mode === 'cut' && pasted.length) this.clearClipboard();
        return { ok: pasted.length > 0, pasted, failed };
    }
}

window.xpShell = new XPShellBridge();
