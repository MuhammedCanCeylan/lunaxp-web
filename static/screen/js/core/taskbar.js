/* GÖREV ÇUBUĞU, BAŞLAT VE SİSTEM ALANI */
function toggleStartMenu(e) {
    if (e) e.stopPropagation();
    const sm = document.getElementById('startMenu');
    sm.style.display = (sm.style.display === 'flex') ? 'none' : 'flex';
}

function hideStartMenu() {
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('volumePopup').style.display = 'none';
}

function toggleVolumePopup(e) {
    if (e) e.stopPropagation();
    const vp = document.getElementById('volumePopup');
    vp.style.display = (vp.style.display === 'flex') ? 'none' : 'flex';
}

function changeVolume(val) {
    // Winamp veya sistem sesi kontrolü
    const frame = document.querySelector('#win-winamp iframe');
    if (frame && frame.contentWindow && frame.contentWindow.setGlobalVolume) {
        frame.contentWindow.setGlobalVolume(val);
    }
}

function toggleMuteAll(muted) {
    const frame = document.querySelector('#win-winamp iframe');
    if (frame && frame.contentWindow && frame.contentWindow.setMute) {
        frame.contentWindow.setMute(muted);
    }
}

function updateClock() {
    const d = new Date();
    const el = document.getElementById('clock');
    if (el) el.innerText = d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
}
setInterval(updateClock, 1000);