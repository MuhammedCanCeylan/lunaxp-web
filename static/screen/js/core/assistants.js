/* CLIPPY, BONZI VE EKRAN KORUYUCU */
const clippyDialogues = [
    "Bir mektup mu yazıyorsunuz? Not Defteri uygulamasını açabilirim!",
    "Özgeçmiş penceresindeki başlıklara tıklayarak detaylı bilgi edinebilirsin.",
    "Pencereleri sağ alt köşelerinden tutup dilediğin gibi genişletebilirsin.",
    "Masaüstüne sağ tıklayarak klasik Windows XP duvar kağıtlarını değiştirebilirsin!",
    "Winamp'tan 90'lar pop şarkılarını dinlerken retro ortamın tadını çıkar!",
    "avast! kalkanı sistem dosyalarını güvende tutuyor.",
    "Sağ alttaki saate tıklayarak orijinal analog saat ve takvimi görebilirsin."
];
let clippyIdx = 0;

function clippyComment(msg) {
    const el = document.getElementById('clippyText');
    if (el) el.innerText = msg;
}

function clippyNextDialogue() {
    clippyIdx = (clippyIdx + 1) % clippyDialogues.length;
    clippyComment(clippyDialogues[clippyIdx]);
}

const bonziQuotes = [
    "Well hello there! I'm Bonzi, your purple buddy!",
    "Daisy, Daisy, give me your answer do!",
    "What do you call a monkey in a minefield? A BABOOM! Haha!",
    "Hey! Stop dragging me around, it tickles!",
    "Did you know Muhammed Can Ceylan built this whole 3D retro portfolio?"
];

function spawnBonzi() {
    const b = document.getElementById('bonziBuddy');
    b.style.display = 'flex';
    bonziTalk();
}

function bonziTalk() {
    const text = bonziQuotes[Math.floor(Math.random() * bonziQuotes.length)];
    document.getElementById('bonziText').innerHTML = text;
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, ''));
        utter.pitch = 1.35;
        utter.rate = 0.95;
        utter.lang = 'en-US';
        window.speechSynthesis.speak(utter);
    }
}

/* 3D BORULAR (SCREENSAVER) */
let idleTime = 0, ssRunning = false;
window.addEventListener('mousemove', () => { idleTime = 0; if (ssRunning) stopScreensaver(); });
window.addEventListener('keydown', () => { idleTime = 0; if (ssRunning) stopScreensaver(); });

setInterval(() => {
    idleTime++;
    if (idleTime === 15 && !ssRunning) clippyComment("Hala orada mısın? Sana yardım etmek için buradayım!");
    if (idleTime >= 45 && !ssRunning) startScreensaver();
}, 1000);

function startScreensaver() {
    ssRunning = true;
    const canvas = document.getElementById('screensaverCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    let x = canvas.width / 2, y = canvas.height / 2;
    const colors = ['#00ff00', '#0000ff', '#ff0000', '#ffff00', '#ff00ff', '#00ffff'];
    let color = colors[Math.floor(Math.random() * colors.length)];

    function drawPipe() {
        if (!ssRunning) return;
        ctx.strokeStyle = color; ctx.lineWidth = 14; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x, y);
        const dir = Math.floor(Math.random() * 4);
        if (dir === 0) x += 25; else if (dir === 1) x -= 25; else if (dir === 2) y += 25; else y -= 25;
        if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
            x = Math.random() * canvas.width; y = Math.random() * canvas.height;
            color = colors[Math.floor(Math.random() * colors.length)];
        }
        ctx.lineTo(x, y); ctx.stroke();
        setTimeout(drawPipe, 40);
    }
    drawPipe();
}

function stopScreensaver() {
    ssRunning = false;
    document.getElementById('screensaverCanvas').style.display = 'none';
}