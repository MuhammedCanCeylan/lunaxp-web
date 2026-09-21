/* MASAÜSTÜ ETKİLEŞİMİ & SEÇİM DİKDÖRTGENİ */
class DesktopManager {
    constructor() {
        this.ICON_POS_KEY = 'xp_icons_pos_v7';
    }

    init() {
        this.initDragSelection();
        this.initContextMenu();
        this.initDraggableIcons();
    }

    initDraggableIcons() {
        const saved = this.loadPositions();
        document.querySelectorAll('.icon').forEach(icon => {
            if (saved[icon.id]) {
                icon.style.left = saved[icon.id].left + 'px';
                icon.style.top = saved[icon.id].top + 'px';
            }

            let startX, startY, iconLeft, iconTop, moved = false;

            icon.onmousedown = (e) => {
                e.stopPropagation();
                document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
                icon.classList.add('selected');

                startX = e.clientX;
                startY = e.clientY;
                iconLeft = icon.offsetLeft;
                iconTop = icon.offsetTop;
                moved = false;

                const onMove = (ev) => {
                    if (Math.abs(ev.clientX - startX) > 3 || Math.abs(ev.clientY - startY) > 3) moved = true;
                    if (!moved) return;
                    icon.style.left = (iconLeft + ev.clientX - startX) + 'px';
                    icon.style.top = (iconTop + ev.clientY - startY) + 'px';
                };

                const onUp = () => {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                    if (moved) this.savePosition(icon.id, icon.offsetLeft, icon.offsetTop);
                };

                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            };
        });
    }

    savePosition(id, left, top) {
        const pos = this.loadPositions();
        pos[id] = { left, top };
        localStorage.setItem(this.ICON_POS_KEY, JSON.stringify(pos));
    }

    loadPositions() {
        try { return JSON.parse(localStorage.getItem(this.ICON_POS_KEY) || '{}'); } catch(e) { return {}; }
    }

    initDragSelection() {
        const desktopEl = document.getElementById('desktop');
        const box = document.getElementById('selectionBox');
        let startX, startY, active = false;

        desktopEl.addEventListener('mousedown', (e) => {
            if (e.target.closest('.icon') || e.target.closest('.window')) return;
            document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
            active = true;
            startX = e.clientX;
            startY = e.clientY;
            box.style.left = startX + 'px';
            box.style.top = startY + 'px';
            box.style.width = '0px';
            box.style.height = '0px';
            box.style.display = 'block';

            const onMove = (ev) => {
                if (!active) return;
                const left = Math.min(startX, ev.clientX);
                const top = Math.min(startY, ev.clientY);
                const width = Math.abs(ev.clientX - startX);
                const height = Math.abs(ev.clientY - startY);

                box.style.left = left + 'px';
                box.style.top = top + 'px';
                box.style.width = width + 'px';
                box.style.height = height + 'px';

                document.querySelectorAll('.icon').forEach(icon => {
                    const r = icon.getBoundingClientRect();
                    if (r.left < left + width && r.right > left && r.top < top + height && r.bottom > top) {
                        icon.classList.add('selected');
                    } else {
                        icon.classList.remove('selected');
                    }
                });
            };

            const onUp = () => {
                active = false;
                box.style.display = 'none';
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    }

    initContextMenu() {
        const menu = document.getElementById('desktopContextMenu');
        document.getElementById('desktop').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            menu.style.left = e.pageX + 'px';
            menu.style.top = e.pageY + 'px';
            menu.style.display = 'flex';
        });
        document.addEventListener('click', () => {
            menu.style.display = 'none';
        });
    }

    arrangeIcons() {
        localStorage.removeItem(this.ICON_POS_KEY);
        initAppIcons();
    }
}

window.xpDesktop = new DesktopManager();