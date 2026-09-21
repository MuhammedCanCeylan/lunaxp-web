eMule 0.50a - Windows XP Nostalgia Simulator

Hedef klasor:
portfolio-website/static/screen/apps/emule/

Dosyalar:
- index.html
- icon.png

Ozellikler:
- Sunucular
- Aktarimlar
- Arama
- Paylasilan Dosyalar
- Mesajlar
- IRC
- Istatistikler
- Secenekler
- Simule edilen ED2K/Kad baglanti durumu
- Simule edilen indirme/yukleme hizlari
- Yerel dosyalari "Paylasilan" listesine ekleme (dosya tarayici disina gonderilmez)
- localStorage ile durum kaydi
- Harici bagimlilik yok

Bu uygulama gercek eMule istemcisi degildir.
Gercek ED2K/Kad P2P agina baglanmaz.

Onerilen registry kaydi:
{
    id: 'emule',
    title: 'eMule 0.50a',
    icon: './apps/emule/icon.png',
    url: './apps/emule/index.html',
    width: 900,
    height: 620,
    resizable: true,
    desktop: true
}
