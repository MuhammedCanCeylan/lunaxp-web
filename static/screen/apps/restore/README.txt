WINDOWS XP SISTEM GERI YUKLEME (rstrui)

Hedef varsayilan klasor:
portfolio-website/static/screen/apps/rstrui/

Installer su mevcut klasor adlarini otomatik algilar:
- rstrui
- systemrestore
- system-restore
- restore

Bir tanesi zaten varsa onu kullanir. Hicbiri yoksa rstrui olusturur.

Ozellikler:
- XP System Restore wizard ana ekrani
- "Bilgisayarimi onceki bir zamana geri yukle"
- "Geri yukleme noktasi olustur"
- Basarili bir restorasyondan sonra "Son geri yuklememi geri al"
- Takvim: restore point olan gunler kalin / isaretli
- Ayni gundeki restore point listesi
- Manuel restore point olusturma
- System Checkpoint / Install / Update / Driver / Manual turleri
- Restore confirmation
- Progress akisi
- XP restart animasyonu
- Restoration Complete ekrani
- Undo Last Restoration
- localStorage kaliciligi
- native alert/confirm/prompt yok
- ikinci XP titlebar/taskbar yok

Sinir:
Bu browser uygulamasi host Windows sistem dosyalarini veya registry'yi degistirmez.
Ana XP simulatorunun registry/vfs semasi bilinmedigi icin tahmini sistem dosyasi restorasyonu yapmaz.
