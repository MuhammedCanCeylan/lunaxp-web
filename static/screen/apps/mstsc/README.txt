WINDOWS XP UZAK MASAUSTU BAGLANTISI (MSTSC)

Hedef klasor:
portfolio-website/static/screen/apps/remotedesktop/

Dosyalar:
- index.html
- icon.png

Ozellikler:
- Windows XP Remote Desktop Connection benzeri ana ekran
- Options ac/kapat
- General / Display / Local Resources / Programs / Experience / Advanced
- Computer / username / password alanlari
- Parola kalici olarak kaydedilmez
- .rdp dosyasi acma
- .rdp dosyasi olusturma / indirme
- Cozunurluk ve renk derinligi
- Printer / Clipboard / Drives / Smart Cards secenekleri
- Remote audio ve Windows key combination ayarlari
- Alternate shell / start folder
- Experience/performance secenekleri
- Authentication level / gateway alani
- Baglanti akisi simulasyonu
- Ctrl+Alt+End simulasyonu
- localStorage ayarlari ve recent hosts
- native alert/confirm/prompt yok

ONEMLI:
Bu uygulama gercek RDP TCP baglantisi kurmaz.
Tarayicida gercek RDP icin Guacamole/FreeRDP-WebConnect benzeri
ayri bir gateway/backend gerekir. Kullanici kurallarina uygun olarak
daemon/server/streaming yolu bu pakete eklenmemistir.

Onerilen registry:
{
    id: 'remotedesktop',
    title: 'Uzak Masaüstü Bağlantısı',
    icon: './apps/remotedesktop/icon.png',
    url: './apps/remotedesktop/index.html',
    width: 620,
    height: 560,
    resizable: true,
    desktop: false
}
