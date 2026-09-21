/* Windows XP Virtual File System (VFS) Core Engine - Phase 2
 * Single source of truth for Desktop, Explorer and Recycle Bin.
 */
class VirtualFileSystem {
    constructor() {
        this.storageKey = 'xp_vfs_root_v5';
        this.legacyStorageKeys = ['xp_vfs_root_v4', 'xp_vfs_root_v3', 'xp_vfs_root_v2'];
        this.recycleStorageKey = 'xp_vfs_recycle_v1';
        this.currentUser = 'Muhammed Can Ceylan';
        this.fs = this.load() || this.createDefaultHierarchy();
        this.recycleBin = this.loadRecycleBin();
        this.migrate();
        this.save({ silent: true });
    }

    createDefaultHierarchy() {
        return {
            id: this.uid('root'), name: 'root', type: 'root', children: {
                'C:': {
                    id: this.uid('drive'), name: 'C:', type: 'drive', label: 'Yerel Disk (C:)',
                    totalSpace: '40.0 GB', freeSpace: '28.4 GB', children: {
                        'WINDOWS': {
                            id: this.uid('folder'), name: 'WINDOWS', type: 'folder', system: true, children: {
                                'system32': { id: this.uid('folder'), name: 'system32', type: 'folder', system: true, children: {} },
                                'Web': { id: this.uid('folder'), name: 'Web', type: 'folder', children: {
                                    'Wallpaper': { id: this.uid('folder'), name: 'Wallpaper', type: 'folder', children: {
                                        'Bliss.bmp': { id: this.uid('file'), name: 'Bliss.bmp', type: 'file', ext: 'bmp', size: '1.4 MB' },
                                        'Red_Moon.bmp': { id: this.uid('file'), name: 'Red_Moon.bmp', type: 'file', ext: 'bmp', size: '1.1 MB' }
                                    }}
                                }},
                                'explorer.exe': { id: this.uid('file'), name: 'explorer.exe', type: 'file', ext: 'exe', size: '1.0 MB', system: true },
                                'notepad.exe': { id: this.uid('file'), name: 'notepad.exe', type: 'file', ext: 'exe', size: '68 KB', system: true },
                                'win.ini': { id: this.uid('file'), name: 'win.ini', type: 'file', ext: 'ini', size: '4 KB', system: true }
                            }
                        },
                        'Program Files': { id: this.uid('folder'), name: 'Program Files', type: 'folder', children: {
                            'Internet Explorer': { id: this.uid('folder'), name: 'Internet Explorer', type: 'folder', children: {} },
                            'Outlook Express': { id: this.uid('folder'), name: 'Outlook Express', type: 'folder', children: {} },
                            'Winamp': { id: this.uid('folder'), name: 'Winamp', type: 'folder', children: {} },
                            'MSN Messenger': { id: this.uid('folder'), name: 'MSN Messenger', type: 'folder', children: {} }
                        }},
                        'Documents and Settings': { id: this.uid('folder'), name: 'Documents and Settings', type: 'folder', children: {
                            'All Users': { id: this.uid('folder'), name: 'All Users', type: 'folder', children: {
                                'Documents': { id: this.uid('folder'), name: 'Documents', type: 'folder', label: 'Paylaşılan Belgeler', children: {} },
                                'Start Menu': { id: this.uid('folder'), name: 'Start Menu', type: 'folder', system: true, children: {
                                    'Programs': { id: this.uid('folder'), name: 'Programs', type: 'folder', system: true, children: {} }
                                }}
                            }},
                            [this.currentUser]: { id: this.uid('folder'), name: this.currentUser, type: 'folder', children: {
                                'Desktop': { id: this.uid('folder'), name: 'Desktop', type: 'folder', isDesktop: true, children: {
                                    'Beni Oku.txt': {
                                        id: this.uid('file'), name: 'Beni Oku.txt', type: 'file', ext: 'txt', size: '420 B',
                                        content: 'Windows XP Professional SP3 Web Simülasyonuna hoş geldiniz!\nBu sistem tamamen tarayıcı üzerinde VFS ile çalışır.'
                                    }
                                }},
                                'Belgelerim': { id: this.uid('folder'), name: 'Belgelerim', type: 'folder', children: {
                                    'Resimlerim': { id: this.uid('folder'), name: 'Resimlerim', type: 'folder', children: {} },
                                    'Müziğim': { id: this.uid('folder'), name: 'Müziğim', type: 'folder', children: {} },
                                    'notlar.txt': { id: this.uid('file'), name: 'notlar.txt', type: 'file', ext: 'txt', size: '2 KB', content: 'Windows XP simülasyonu notları.' }
                                }}
                            }}
                        }},
                        'autoexec.bat': { id: this.uid('file'), name: 'autoexec.bat', type: 'file', ext: 'bat', size: '0 B', system: true },
                        'boot.ini': { id: this.uid('file'), name: 'boot.ini', type: 'file', ext: 'ini', size: '211 B', system: true },
                        'config.sys': { id: this.uid('file'), name: 'config.sys', type: 'file', ext: 'sys', size: '0 B', system: true }
                    }
                },
                'D:': { id: this.uid('drive'), name: 'D:', type: 'drive', label: 'CD Sürücüsü (D:)', totalSpace: '700 MB', freeSpace: '0 MB', readOnly: true, children: {} }
            }
        };
    }

    uid(prefix = 'item') {
        return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    }

    clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    load() {
        const keys = [this.storageKey, ...this.legacyStorageKeys];
        for (const key of keys) {
            try {
                const raw = localStorage.getItem(key);
                if (raw) return JSON.parse(raw);
            } catch (_) {}
        }
        return null;
    }

    loadRecycleBin() {
        try {
            const raw = localStorage.getItem(this.recycleStorageKey);
            return raw ? JSON.parse(raw) : [];
        } catch (_) {
            return [];
        }
    }

    migrate() {
        if (!this.fs || typeof this.fs !== 'object') this.fs = this.createDefaultHierarchy();
        if (!this.fs.children) this.fs.children = {};
        this.ensureIds(this.fs);

        // Core XP hierarchy is mandatory even when an older/localStorage VFS is incomplete.
        if (!this.fs.children['C:']) {
            this.fs.children['C:'] = { id:this.uid('drive'), name:'C:', type:'drive', label:'Yerel Disk (C:)', totalSpace:'40.0 GB', freeSpace:'28.4 GB', children:{} };
        }
        if (!this.fs.children['D:']) {
            this.fs.children['D:'] = { id:this.uid('drive'), name:'D:', type:'drive', label:'CD Sürücüsü (D:)', totalSpace:'700 MB', freeSpace:'0 MB', readOnly:true, children:{} };
        }

        const c = this.fs.children['C:'];
        c.type = 'drive';
        c.name = 'C:';
        c.label ||= 'Yerel Disk (C:)';
        c.totalSpace ||= '40.0 GB';
        c.freeSpace ||= '28.4 GB';
        c.children ||= {};

        if (!c.children['WINDOWS']) c.children['WINDOWS'] = { id:this.uid('folder'), name:'WINDOWS', type:'folder', system:true, children:{} };
        const windowsDir = c.children['WINDOWS'];
        windowsDir.children ||= {};
        if (!windowsDir.children['system32']) windowsDir.children['system32'] = { id:this.uid('folder'), name:'system32', type:'folder', system:true, children:{} };

        if (!c.children['Program Files']) c.children['Program Files'] = { id:this.uid('folder'), name:'Program Files', type:'folder', system:true, children:{} };
        c.children['Program Files'].children ||= {};

        if (!c.children['Documents and Settings']) c.children['Documents and Settings'] = { id: this.uid('folder'), name:'Documents and Settings', type:'folder', system:true, children:{} };
        const ds = c.children['Documents and Settings'];
        ds.children ||= {};

        if (!ds.children[this.currentUser]) ds.children[this.currentUser] = { id:this.uid('folder'), name:this.currentUser, type:'folder', children:{} };
        const user = ds.children[this.currentUser];
        user.children ||= {};
        if (!user.children.Desktop) user.children.Desktop = { id:this.uid('folder'), name:'Desktop', type:'folder', isDesktop:true, children:{} };
        if (!user.children.Belgelerim) user.children.Belgelerim = { id:this.uid('folder'), name:'Belgelerim', type:'folder', children:{} };
        user.children.Belgelerim.children ||= {};
        if (!user.children.Belgelerim.children.Resimlerim) user.children.Belgelerim.children.Resimlerim = { id:this.uid('folder'), name:'Resimlerim', type:'folder', children:{} };
        if (!user.children.Belgelerim.children.Müziğim) user.children.Belgelerim.children.Müziğim = { id:this.uid('folder'), name:'Müziğim', type:'folder', children:{} };

        if (!ds.children['All Users']) ds.children['All Users'] = { id:this.uid('folder'), name:'All Users', type:'folder', system:true, children:{} };
        const all = ds.children['All Users'];
        all.children ||= {};
        if (!all.children.Documents) all.children.Documents = { id:this.uid('folder'), name:'Documents', label:'Paylaşılan Belgeler', type:'folder', children:{} };
        if (!all.children['Start Menu']) all.children['Start Menu'] = { id:this.uid('folder'), name:'Start Menu', type:'folder', system:true, children:{} };
        const startMenu = all.children['Start Menu'];
        startMenu.children ||= {};
        if (!startMenu.children.Programs) startMenu.children.Programs = { id:this.uid('folder'), name:'Programs', type:'folder', system:true, children:{} };

        const d = this.fs.children['D:'];
        d.type = 'drive';
        d.name = 'D:';
        d.label ||= 'CD Sürücüsü (D:)';
        d.children ||= {};

        if (!Array.isArray(this.recycleBin)) this.recycleBin = [];
        this.recycleBin = this.recycleBin.map((it, i) => ({
            id: it.id || this.uid('recycle'),
            name: it.name || 'Bilinmeyen öğe',
            originalParent: it.originalParent || it.orig || 'C:\\',
            orig: it.orig || it.originalParent || 'C:\\',
            deletedAt: it.deletedAt || it.date || new Date().toISOString(),
            date: it.date || this.formatDate(it.deletedAt || new Date()),
            size: this.sizeToBytes(it.size),
            type: it.type || this.describeType(it.node || it),
            icon: it.icon || null,
            node: it.node || { id:this.uid('file'), name:it.name || 'Bilinmeyen öğe', type:'file' }
        }));
        this.ensureIds(this.fs);
    }

    ensureIds(node) {
        if (!node || typeof node !== 'object') return;
        if (!node.id) node.id = this.uid(node.type || 'item');
        if (node.children) Object.values(node.children).forEach(child => this.ensureIds(child));
    }

    save(options = {}) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.fs));
            localStorage.setItem(this.recycleStorageKey, JSON.stringify(this.recycleBin));
        } catch (_) {}
        if (!options.silent) this.emit(options.detail || { action: 'save' });
    }

    emit(detail = {}) {
        try { window.dispatchEvent(new CustomEvent('vfs-updated', { detail })); } catch (_) {}
        try {
            document.querySelectorAll('iframe').forEach(frame => {
                try { frame.contentWindow.postMessage({ type: 'xp-vfs-updated', detail }, '*'); } catch (_) {}
            });
        } catch (_) {}
    }

    normalizePath(pathStr) {
        if (!pathStr || pathStr === '/' || pathStr === 'Bilgisayarım' || pathStr === 'My Computer') return 'Bilgisayarım';
        const aliases = {
            'Belgelerim': this.getSpecialFolderPath('documents'),
            'Masaüstü': this.getSpecialFolderPath('desktop'),
            'Paylaşılan Belgeler': this.getSpecialFolderPath('sharedDocuments')
        };
        let p = aliases[pathStr] || String(pathStr);
        p = p.replace(/\//g, '\\').replace(/\\+/g, '\\');
        if (/^[A-Za-z]:$/.test(p)) p += '\\';
        if (p.length > 3) p = p.replace(/\\+$/, '');
        return p;
    }

    pathParts(pathStr) {
        const p = this.normalizePath(pathStr);
        if (p === 'Bilgisayarım') return [];
        return p.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
    }

    resolvePath(pathStr) {
        const parts = this.pathParts(pathStr);
        let curr = this.fs;
        for (const part of parts) {
            if (!curr.children || !curr.children[part]) return null;
            curr = curr.children[part];
        }
        return curr;
    }

    getSpecialFolderPath(kind) {
        const base = `C:\\Documents and Settings\\${this.currentUser}`;
        if (kind === 'desktop') return base + '\\Desktop';
        if (kind === 'documents') return base + '\\Belgelerim';
        if (kind === 'pictures') return base + '\\Belgelerim\\Resimlerim';
        if (kind === 'music') return base + '\\Belgelerim\\Müziğim';
        if (kind === 'sharedDocuments') return 'C:\\Documents and Settings\\All Users\\Documents';
        if (kind === 'programs') return 'C:\\Documents and Settings\\All Users\\Start Menu\\Programs';
        if (kind === 'programFiles') return 'C:\\Program Files';
        if (kind === 'windows') return 'C:\\WINDOWS';
        if (kind === 'system32') return 'C:\\WINDOWS\\system32';
        if (kind === 'appcheck') return 'C:\\Documents and Settings\\All Users\\Start Menu\\Programs\\.AppCheck';
        return base;
    }

    getDesktopFolder() { return this.resolvePath(this.getSpecialFolderPath('desktop')); }

    getDrives() {
        return Object.values(this.fs.children || {}).filter(x => x.type === 'drive').map(x => this.clone(x));
    }

    isHiddenNode(node) {
        if (!node) return false;
        return node.hidden === true || String(node.name || '').startsWith('.');
    }

    list(pathStr, options = {}) {
        const node = this.resolvePath(pathStr);
        if (!node || !node.children) return [];
        const showHidden = options.showHidden === true;
        return Object.values(node.children)
            .filter(child => showHidden || !this.isHiddenNode(child))
            .map(child => this.clone(child));
    }

    joinPath(parentPath, name) {
        const parent = this.normalizePath(parentPath);
        if (parent === 'Bilgisayarım') return name;
        if (/^[A-Za-z]:\\$/.test(parent)) return parent + name;
        return parent + '\\' + name;
    }

    parentPath(pathStr) {
        const p = this.normalizePath(pathStr);
        if (p === 'Bilgisayarım') return null;
        if (/^[A-Za-z]:\\$/.test(p)) return 'Bilgisayarım';
        const idx = p.lastIndexOf('\\');
        if (idx < 0) return 'Bilgisayarım';
        if (idx === 2) return p.slice(0, 3);
        return p.slice(0, idx);
    }

    basename(pathStr) {
        const p = this.normalizePath(pathStr);
        if (p === 'Bilgisayarım') return p;
        const parts = this.pathParts(p);
        return parts[parts.length - 1] || p;
    }

    exists(pathStr) { return !!this.resolvePath(pathStr); }

    uniqueName(parentPath, desiredName) {
        const parent = this.resolvePath(parentPath);
        if (!parent || !parent.children) return desiredName;
        if (!parent.children[desiredName]) return desiredName;
        const m = desiredName.match(/^(.*?)(\.[^.]+)?$/);
        const base = m ? m[1] : desiredName;
        const ext = m && m[2] ? m[2] : '';
        let n = 2;
        while (parent.children[`${base} (${n})${ext}`]) n++;
        return `${base} (${n})${ext}`;
    }

    createItem(parentPath, name, type, extra = {}) {
        const parent = this.resolvePath(parentPath);
        if (!parent || !parent.children || parent.readOnly) return null;
        const safeName = this.uniqueName(parentPath, name);
        const node = {
            id: this.uid(type), name: safeName, type,
            created: new Date().toISOString(),
            ...(type === 'folder' ? { children: {} } : {}),
            ...extra
        };
        node.name = safeName;
        if (type === 'file' && !node.ext && safeName.includes('.')) node.ext = safeName.split('.').pop().toLowerCase();
        parent.children[safeName] = node;
        this.save({ detail: { action: 'create', path: this.joinPath(parentPath, safeName), node: this.clone(node) } });
        return this.clone(node);
    }

    createFolder(parentPath, name = 'Yeni Klasör') { return this.createItem(parentPath, name, 'folder'); }
    createFile(parentPath, name, content = '', extra = {}) { return this.createItem(parentPath, name, 'file', { content, ...extra }); }


    ensureFolderPath(pathStr, extra = {}) {
        const normalized = this.normalizePath(pathStr);
        if (normalized === 'Bilgisayarım') return this.fs;
        const parts = this.pathParts(normalized);
        let current = this.fs;
        let built = '';
        for (const part of parts) {
            if (!current.children) current.children = {};
            if (!current.children[part]) {
                current.children[part] = { id:this.uid('folder'), name:part, type: part.endsWith(':') ? 'drive' : 'folder', children:{}, ...extra };
            }
            current = current.children[part];
            if (!current.children && current.type !== 'file' && current.type !== 'shortcut') current.children = {};
            built = built ? this.joinPath(built, part) : part;
        }
        this.save({ silent:true });
        return current;
    }

    createShortcut(parentPath, name, target = {}) {
        const finalName = /\.lnk$/i.test(name) ? name : name + '.lnk';
        return this.createItem(parentPath, finalName, 'shortcut', {
            targetAppId: target.targetAppId || null,
            targetPath: target.targetPath || null,
            displayName: target.displayName || finalName.replace(/\.lnk$/i, ''),
            managedBy: target.managedBy || null,
            managed: target.managed === true,
            size: 1024
        });
    }

    createShortcutIfMissing(parentPath, name, target = {}) {
        const parent = this.resolvePath(parentPath);
        if (!parent || !parent.children) return null;
        const targetAppId = target.targetAppId || null;
        const targetPath = target.targetPath || null;
        const existing = Object.values(parent.children).find(n => n && n.type === 'shortcut' && ((targetAppId && n.targetAppId === targetAppId) || (targetPath && n.targetPath === targetPath)));
        if (existing) return this.clone(existing);
        return this.createShortcut(parentPath, name, target);
    }

    upsertManagedApplication(parentPath, fileName, appId, extra = {}) {
        const parent = this.resolvePath(parentPath) || this.ensureFolderPath(parentPath, { system:true, managedBy:'appRegistry' });
        if (!parent || !parent.children) return null;
        const finalName = /\.exe$/i.test(fileName) ? fileName : fileName + '.exe';
        let key = Object.keys(parent.children).find(k => {
            const n = parent.children[k];
            return n && n.type === 'application' && n.managedBy === 'appRegistry' && n.targetAppId === appId;
        });
        if (!key && parent.children[finalName]) key = finalName;
        if (key) {
            const node = parent.children[key];
            if (key !== finalName && !parent.children[finalName]) {
                delete parent.children[key];
                node.name = finalName;
                parent.children[finalName] = node;
            }
            node.type = 'application';
            node.targetAppId = appId;
            node.displayName = extra.displayName || node.displayName || finalName.replace(/\.exe$/i, '');
            node.ext = 'exe';
            node.size = extra.size || node.size || 65536;
            node.managedBy = 'appRegistry';
            node.managed = true;
            Object.assign(node, extra);
            this.save({ silent:true });
            return this.clone(node);
        }
        return this.createItem(parentPath, finalName, 'application', {
            ext:'exe',
            targetAppId:appId,
            displayName:extra.displayName || finalName.replace(/\.exe$/i, ''),
            size:extra.size || 65536,
            managedBy:'appRegistry',
            managed:true,
            ...extra
        });
    }

    upsertManagedShortcut(parentPath, name, target = {}) {
        const parent = this.resolvePath(parentPath) || this.ensureFolderPath(parentPath, { system:true, managedBy:'appRegistry' });
        if (!parent || !parent.children) return null;
        const targetAppId = target.targetAppId || null;
        let existingKey = Object.keys(parent.children).find(key => {
            const n = parent.children[key];
            return n && n.type === 'shortcut' && n.managedBy === 'appRegistry' && targetAppId && n.targetAppId === targetAppId;
        });
        const finalName = /\.lnk$/i.test(name) ? name : name + '.lnk';
        if (existingKey) {
            const node = parent.children[existingKey];
            if (existingKey !== finalName && !parent.children[finalName]) {
                delete parent.children[existingKey];
                node.name = finalName;
                parent.children[finalName] = node;
            }
            node.displayName = target.displayName || finalName.replace(/\.lnk$/i, '');
            node.targetAppId = targetAppId;
            node.targetPath = target.targetPath || null;
            node.managedBy = 'appRegistry';
            this.save({ silent:true });
            return this.clone(node);
        }
        return this.createShortcut(parentPath, finalName, { ...target, managedBy:'appRegistry', managed:true });
    }

    renameItem(parentPath, oldName, newName) {
        const parent = this.resolvePath(parentPath);
        if (!parent || !parent.children || !parent.children[oldName] || parent.readOnly) return false;
        const clean = String(newName || '').trim();
        if (!clean || /[\\/:*?"<>|]/.test(clean)) return false;
        if (clean !== oldName && parent.children[clean]) return false;
        const node = parent.children[oldName];
        delete parent.children[oldName];
        node.name = clean;
        if (node.type === 'file') node.ext = clean.includes('.') ? clean.split('.').pop().toLowerCase() : '';
        parent.children[clean] = node;
        this.save({ detail: { action: 'rename', from: this.joinPath(parentPath, oldName), to: this.joinPath(parentPath, clean), node: this.clone(node) } });
        return true;
    }

    renamePath(pathStr, newName) {
        const p = this.normalizePath(pathStr);
        const parent = this.parentPath(p);
        if (!parent) return false;
        return this.renameItem(parent, this.basename(p), newName);
    }

    deleteItem(parentPath, name, options = {}) {
        const parent = this.resolvePath(parentPath);
        if (!parent || !parent.children || !parent.children[name] || parent.readOnly) return false;
        const node = parent.children[name];
        if (node.system && !options.force) return false;
        delete parent.children[name];

        if (!options.permanent) {
            const deletedAt = new Date().toISOString();
            const originalParent = this.normalizePath(parentPath);
            this.recycleBin.push({
                id: this.uid('recycle'), name: node.name,
                originalParent, orig: originalParent,
                originalPath: this.joinPath(originalParent, node.name),
                deletedAt, date: this.formatDate(deletedAt),
                size: this.nodeSizeBytes(node), type: this.describeType(node),
                icon: null, node: this.clone(node)
            });
        }
        this.save({ detail: { action: options.permanent ? 'delete-permanent' : 'recycle', path: this.joinPath(parentPath, name) } });
        return true;
    }

    deletePath(pathStr, options = {}) {
        const p = this.normalizePath(pathStr);
        const parent = this.parentPath(p);
        if (!parent) return false;
        return this.deleteItem(parent, this.basename(p), options);
    }

    getRecycleBin() { return this.clone(this.recycleBin); }

    setRecycleBin(items) {
        this.recycleBin = Array.isArray(items) ? this.clone(items) : [];
        this.migrate();
        this.save({ detail: { action: 'recycle-sync' } });
    }

    restoreRecycleItem(id) {
        const idx = this.recycleBin.findIndex(x => x.id === id);
        if (idx < 0) return false;
        const item = this.recycleBin[idx];
        let parent = this.resolvePath(item.originalParent);
        if (!parent) parent = this.ensureFolderPath(item.originalParent);
        if (!parent || !parent.children || parent.readOnly) return false;
        const restored = this.clone(item.node);
        restored.name = this.uniqueName(item.originalParent, restored.name || item.name);
        parent.children[restored.name] = restored;
        this.recycleBin.splice(idx, 1);
        const restoredPath = this.joinPath(item.originalParent, restored.name);
        this.save({ detail: { action: 'restore', path: restoredPath, restoredFromRecycle:true } });
        return restoredPath;
    }

    permanentlyDeleteRecycleItem(id) {
        const idx = this.recycleBin.findIndex(x => x.id === id);
        if (idx < 0) return false;
        this.recycleBin.splice(idx, 1);
        this.save({ detail: { action: 'recycle-delete-permanent', id } });
        return true;
    }

    emptyRecycleBin() {
        const count = this.recycleBin.length;
        this.recycleBin = [];
        this.save({ detail: { action: 'recycle-empty', count } });
        return count;
    }

    regenerateIds(node) {
        if (!node || typeof node !== 'object') return node;
        node.id = this.uid(node.type || 'item');
        if (node.children) Object.values(node.children).forEach(child => this.regenerateIds(child));
        return node;
    }

    isContainer(pathStr) {
        const node = this.resolvePath(pathStr);
        return !!node && (node.type === 'folder' || node.type === 'drive' || node.type === 'root') && !!node.children;
    }

    isPathInside(candidatePath, ancestorPath) {
        const candidate = this.normalizePath(candidatePath);
        const ancestor = this.normalizePath(ancestorPath);
        if (candidate === ancestor) return true;
        if (ancestor === 'Bilgisayarım') return candidate !== 'Bilgisayarım';
        const prefix = /\\$/.test(ancestor) ? ancestor : ancestor + '\\';
        return candidate.startsWith(prefix);
    }

    copyPath(sourcePath, targetParentPath) {
        const source = this.normalizePath(sourcePath);
        const targetParent = this.normalizePath(targetParentPath);
        const node = this.resolvePath(source);
        const dest = this.resolvePath(targetParent);
        if (!node || !dest || !dest.children || dest.readOnly) return false;
        if (node.type === 'root' || node.type === 'drive') return false;
        if (node.type === 'folder' && this.isPathInside(targetParent, source)) return false;

        const copy = this.regenerateIds(this.clone(node));
        copy.name = this.uniqueName(targetParent, node.name);
        copy.created = new Date().toISOString();
        dest.children[copy.name] = copy;
        this.save({ detail: { action: 'copy', from: source, to: this.joinPath(targetParent, copy.name), node: this.clone(copy) } });
        return this.joinPath(targetParent, copy.name);
    }

    movePath(sourcePath, targetParentPath) {
        const source = this.normalizePath(sourcePath);
        const targetParent = this.normalizePath(targetParentPath);
        const srcParentPath = this.parentPath(source);
        if (!srcParentPath || source === targetParent) return false;
        const srcParent = this.resolvePath(srcParentPath);
        const dest = this.resolvePath(targetParent);
        const nodeName = this.basename(source);
        const node = srcParent && srcParent.children ? srcParent.children[nodeName] : null;
        if (!node || !dest || !dest.children || srcParent.readOnly || dest.readOnly) return false;
        if (node.system || node.type === 'drive' || node.type === 'root') return false;
        if (node.type === 'folder' && this.isPathInside(targetParent, source)) return false;
        if (srcParentPath === targetParent) return source;

        delete srcParent.children[nodeName];
        node.name = this.uniqueName(targetParent, node.name);
        dest.children[node.name] = node;
        const targetPath = this.joinPath(targetParent, node.name);
        this.save({ detail: { action: 'move', from: source, to: targetPath, node: this.clone(node) } });
        return targetPath;
    }

    writeFile(pathStr, content, extra = {}) {
        const path = this.normalizePath(pathStr);
        const node = this.resolvePath(path);
        if (!node || node.type !== 'file' || node.readOnly) return false;
        node.content = String(content == null ? '' : content);
        node.size = extra.size != null ? extra.size : node.content.length;
        node.modified = new Date().toISOString();
        Object.assign(node, extra);
        this.save({ detail: { action: 'write', path, node: this.clone(node) } });
        return true;
    }

    walk(startPath = 'C:\\', options = {}) {
        const start = this.normalizePath(startPath);
        const root = this.resolvePath(start);
        if (!root) return [];
        const out = [];
        const visit = (node, path) => {
            if (!options.excludeStart || path !== start) out.push({ path, node: this.clone(node) });
            Object.values(node.children || {}).forEach(child => visit(child, this.joinPath(path, child.name)));
        };
        visit(root, start);
        return out;
    }

    search(query, startPath = 'C:\\') {
        const q = String(query || '').trim().toLocaleLowerCase('tr');
        if (!q) return [];
        return this.walk(startPath, { excludeStart: true }).filter(entry =>
            String(entry.node.name || '').toLocaleLowerCase('tr').includes(q)
        );
    }

    sizeToBytes(value) {
        if (typeof value === 'number' && Number.isFinite(value)) return value;
        const s = String(value || '').trim().replace(',', '.');
        const n = parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
        if (/GB/i.test(s)) return Math.round(n * 1024 * 1024 * 1024);
        if (/MB/i.test(s)) return Math.round(n * 1024 * 1024);
        if (/KB/i.test(s)) return Math.round(n * 1024);
        return Math.round(n);
    }

    nodeSizeBytes(node) {
        if (!node) return 0;
        if (node.type === 'file' || node.type === 'application' || node.type === 'shortcut') {
            return this.sizeToBytes(node.size || (node.content ? String(node.content).length : 0));
        }
        return Object.values(node.children || {}).reduce((sum, child) => sum + this.nodeSizeBytes(child), 0);
    }

    describeType(node) {
        if (!node) return 'Öğe';
        if (node.type === 'drive') return 'Yerel Disk';
        if (node.type === 'folder') return 'Dosya Klasörü';
        if (node.type === 'shortcut') return 'Kısayol';
        if (node.type === 'application') return 'Uygulama';
        const ext = String(node.ext || (node.name && node.name.includes('.') ? node.name.split('.').pop() : '')).toLowerCase();
        const types = { txt:'Metin Belgesi', bmp:'Bitmap Resmi', jpg:'JPEG Resmi', jpeg:'JPEG Resmi', png:'PNG Resmi', zip:'Sıkıştırılmış Klasör', rar:'WinRAR Arşivi', exe:'Uygulama', ini:'Yapılandırma Ayarları', bat:'MS-DOS Toplu İş Dosyası', sys:'Sistem Dosyası', html:'HTML Belgesi', htm:'HTML Belgesi', mp3:'MP3 Ses Dosyası', wav:'Wave Ses Dosyası' };
        return types[ext] || (ext ? ext.toUpperCase() + ' Dosyası' : 'Dosya');
    }

    formatDate(value) {
        const d = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(d.getTime())) return '';
        const p = n => String(n).padStart(2, '0');
        return `${p(d.getDate())}.${p(d.getMonth()+1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
    }
}

window.vfs = new VirtualFileSystem();
