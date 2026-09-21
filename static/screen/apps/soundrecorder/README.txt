WINDOWS XP SES KAYDEDICISI

Hedef:
portfolio-website/static/screen/apps/soundrecorder/

Dosyalar:
- index.html
- icon.png

Gercek ozellikler:
- Mikrofon kaydi (getUserMedia)
- 60 saniyelik XP tarzi kayit limiti
- WAV 16-bit mono PCM kaydetme
- WAV/MP3/OGG vb. tarayicinin destekledigi ses dosyalarini acma
- Playback + konum slideri + waveform
- Kopyala / Yapistir Ekle / Yapistir Karistir
- Dosya Ekle / Dosyayla Karistir
- Konumdan once/sonra silme
- Sesi artir / azalt
- Hizi artir / azalt
- Yanki
- Ters cevir
- Ozellikler / Ses Ozellikleri
- XP ic dialoglari
- native alert/confirm/prompt yok

Mikrofon:
En iyi sonuc icin ana XP projesini localhost veya HTTPS ile calistirin.

Onerilen registry:
{
    id: 'soundrecorder',
    title: 'Ses Kaydedicisi',
    icon: './apps/soundrecorder/icon.png',
    url: './apps/soundrecorder/index.html',
    width: 470,
    height: 285,
    resizable: true,
    desktop: false
}
