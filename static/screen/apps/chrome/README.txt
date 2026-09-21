GOOGLE CHROME 49 - Windows XP Web Simulator

Hedef klasor:
portfolio-website/static/screen/apps/chrome/

Dosyalar:
- index.html
- icon.png

Ozellikler:
- Chrome 49 / XP donemi esintili sekme seridi
- Coklu sekme
- Geri / ileri / yenile / ana sayfa
- Omnibox
- Google aramasi (iframe icin ?igu=1 yaklasimi)
- Yer isaretleri
- Gecmis
- Indirilenler
- Ayarlar
- Chrome Hakkinda
- Gizli mod gorunumu
- Ctrl+L / Ctrl+T / Ctrl+W / Ctrl+H / Ctrl+J
- Alt+Sol / Alt+Sag
- localStorage

Onemli:
Bu gercek Google Chrome executable'i degildir.
Genel internet siteleri iframe icinde X-Frame-Options veya CSP frame-ancestors ile
acilmayi reddedebilir. Bu tarayici guvenlik siniri JS ile asilamaz.

Onerilen registry kaydi:
{
    id: 'chrome',
    title: 'Google Chrome',
    icon: './apps/chrome/icon.png',
    url: './apps/chrome/index.html',
    width: 1024,
    height: 720,
    resizable: true,
    desktop: true
}
