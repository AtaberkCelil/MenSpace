# MenSpace — Görev Tasarım Simülatörü

NASA Space Apps mücadelesi için hazırlanmış, uçtan uca bir uzay görevi tasarlama oyunu.
Fırlatma aracından bilim yüküne, fırlatma penceresinden inişe ve yüzey operasyonlarına
kadar bütün kararların görevin sonucunu nasıl değiştirdiğini gösterir. Her görevde hedef
gök cismi seçilir; çekim kuvveti farklı olduğu için iniş stratejisi de değişir.

Her koşu **yeni bir görev brifingi** ile açılır: hedef, hedef gök cismi, süre, ortam
koşulları ve ödül değişir. Aynı 10 sölü tekrar tekrar oynamak yerine her seferinde
farklı bir mühendislik problemi çözersin.

## Çalıştırma

Harici bağımlılık yok; üç dosya (`index.html`, `style.css`, `game.js`) tarayıcıda çalışır.

```bash
# doğrudan aç
xdg-open app/index.html

# ya da yerel sunucu (file:// kısıtlarını kaldırmak için)
python3 -m http.server 8899 --directory app
# → http://localhost:8899
```

## Hedef gök cisimleri

Görev brifingine rastgele bir hedef atanır; çekim kuvveti ve atmosfer inişi doğrudan
etkiler, yüzey rengi ve cruise sahnesi buna göre değişir.

| Hedef | Çekim (oyun) | Atmosfer | İniş zorluğu |
|---|---|---|---|
| Ay | 42 birim | yok | Hafif çekim, yumuşak iniş |
| Mars | 50 birim | ince CO₂ | Daha ağır çekim, motor daha çok çalışır |
| Merkür | 52 birim | yok | Atmosfer yok — düşüşü sadece motor kesiyor |
| Venüs | 60 birim | yoğun CO₂ | Ağır çekim; her itki yakıt yakar |

Çekim değerleri oyunun hız dengesi için ölçeklendirilmiştir; sırası gerçek hayat pullarına
uygun verilmiştir (Venüs > Merkür ≈ Mars > Ay). `assets/jupiter.png` ise gaz devi için
planlanan "uçuş görevi" modu için bekliyor (yüzeyi olmadığından iniş mekaniğine
dahil edilmedi).

## Oyunun akışı

Oyun doğrudan bir **ana menüyle** açılır; oradan “Göreve Başla” ile brifing ekranına gidilir, seçtiğin görevle tasarım fazına geçilir.

| Faz | Ne yaparsın | Neyi öğrenirsin |
|---|---|---|
| **Ana menü** | Oyunu menüden başlat, “Nasıl Oynanır”ı aç veya rekorlarına bak | Oyunun kontrol yolunu |
| **Brifing** | Üç görevden birini seçersin | Hedefin, gök cisminin ve ortamın tasarımı nasıl değiştirdiği |
| **Tasarım** | Fırlatma aracı, iniş modülü ve bilim yükünü seçersin | Bütçe, kütle, güç dengesi ve anten zorunluluğu |
| **Fırlatma** | Pencere göstergesinde ateşleme zamanını yakalarsın | Araç güvenilirliği ve pencere genişliği arasındaki bağ |
| **Seyir** | Yakıtı arabulucu atış için ayırıp ayırmayacağına karar verirsin | Yakıtın her fazın sigortası olduğu |
| **İniş** | Hedef gök cisminin çekimine karşı düşüş ve yan hızı sınırların içinde tutarak iniş yaparsın | Yumuşak inişin yakıt–hassasiyet denklemi, her cismin çekimi farklı |
| **Yüzey** | Söl boyunca enstrümanları çalıştırıp veriyi iletirsin | Gündüz/gece döngüsü, depolama, veri tamponu, olaylar |
| **Rapor** | Not, puan ve brifing durumu | Hangi karar puanı yükseltti, hangisi bedel getirdi |

## Görev brifingleri

Her yeni görevde üç brifing seçilir (kolay / orta / zor). Hedefe ulaşırsan brifing
ödülü rapor tablosuna eklenir.

| Brifing | Hedef | Süre | Ödül |
|---|---|---|---|
| Derin Veri | 45 birim veri ilet | 8 söl | +20 |
| Karanlığa Dayanıklı | 1 ay gecesini enerjisiz atlat | 8 söl | +20 |
| Tam Enstrüman | 5 söl boyunca tüm enstrümanlar çalışsın | 10 söl | +30 |
| Nokta Atışı | %80'den yüksek iniş hassasiyeti | 10 söl | +30 |
| Ucuz Misyon | 12 M$ bütçe rezerve et | 10 söl | +30 |
| Veri Avcısı | 95 birim veri ilet | 12 söl | +45 |
| Çift Gece | 2 ay gecesini sorunsuz geç | 12 söl | +45 |
| Çifte Hedef | 80 birim veri + 1 gece | 12 söl | +50 |

### Ortam modifiyeleri

Zorluk seviyesi arttıkça göreve ortam koşulları eklenir:

| Modifiye | Etkisi |
|---|---|
| Toz Fırtınası | panel hasadı yarıya iner |
| Regolit Tozu | panel hasadı her söl 3 birim azalır |
| Radyo Karartması | her 3 sölün birinde iletim yarı kapasitede |
| Soğuk Gece | pil kapasitesi %30 düşer |
| Güneş Fırtınası | panel hasadı %50 artar, meteorit riski iki katına çıkar |
| Sakin Uzay | meteorit yağmaz ama veri hedefi %25 yükselir |

Yüzeyde her söl bir olay çekebilir: mikrometeorit, güneş patlaması, ay depremi,
toz bulutu, anten arızası, pil sızıntısı.

## Hangi eşyaları eklemeliyim?

Genel kural: **önce anten, sonra güç, en son bilim cihazı.** Anten yoksa ürettiğin
bilim Dünya'ya ulaşmaz; güç dengesizse cihazlar ilk sölün sonunda kapanır.

| Eşya | Kütle | Maliyet | Etkisi | Ne zaman |
|---|---|---|---|---|
| Küçük Anten | 2 kg | 2 M$ | −1/söl, iletim 10 | Her görevde olmalı — veri hedefi olan brifinglerde şart |
| Büyük Anten | 4 kg | 3 M$ | −2/söl, iletim 22 | 80+ birim hedeflerde, gün sayısı çok olan görevlerde |
| Güneş Paneli | 3 kg | 3 M$ | +8/söl | Gece ve güç açığı olan her görevde |
| Pil | 2 kg | 2 M$ | +60 birim depo | Pil olmadan 30 birimlik araç bataryası var — geceleri çoğu görevde bu yeter |
| Kamera | 2 kg | 3 M$ | −1/söl, +6 bilim | Her zaman; en ucuz bilim |
| Spektrometre | 4 kg | 5 M$ | −2/söl, +9 bilim | Veri hedefi yüksek görevlerde, yer var ve bütçe varsa |
| Sismometre | 3 kg | 4 M$ | −1/söl, +5 bilim | Deprem bonusu + brifing "kesintisiz" hedefleri için |
| Bayrak | 1 kg | 1 M$ | +2 bilim | Bütçe artarsa bedava 2 puan |

### Brifinge göre önerilen kitler

Tümü bütçe (44 M$) ve kütle kısıtları içinde doğrulanmıştır:

| Brifing | Araç + modül | Eşyalar | Sonuç |
|---|---|---|---|
| Derin Veri | Yükseliş + Kelebek | Kamera, Küçük Anten, Panel, Pil | 14/24 kg · 30 M$ · +6/söl |
| Karanlığa Dayanıklı | Yükseliş + Kasında | Panel, Pil, Küçük Anten, Sismometre | 19/24 kg · 33 M$ · +6/söl |
| Tam Enstrüman | Yükseliş + Kelebek | Kamera, Spektrometre, Sismometre, Küçük Anten, Panel, Pil | 21/24 kg · 39 M$ · +20 bilim/söl |
| Nokta Atışı | Sefer + Kasında | Kamera, Küçük Anten, Panel, Pil | 18/44 kg · 42 M$ · +6/söl |
| Ucuz Misyon | Kıvılcım + Kelebek | Kamera, Küçük Anten, Panel | 12/12 kg · 20 M$ · +6/söl |
| Veri Avcısı | Yükseliş + Kasında | Spektrometre, Büyük Anten, Panel, Pil, Bayrak | 23/24 kg · 36 M$ · +9/söl |
| Çift Gece | Yükseliş + Kasında | 2× Panel, Pil, Büyük Anten, Sismometre | 24/24 kg · 37 M$ · +13/söl |
| Çifte Hedef | Yükseliş + Kelebek | Kamera, Spektrometre, Büyük Anten, Panel, Pil, Bayrak | 21/24 kg · 37 M$ · +15/söl |

Oyun tasarım ekranında da aynı öneri "Önerilen kit" rozetleriyle gösterilir; ekledikçe
✓ işaretine döner.

### Araç ve modül seçimi

| Fırlatma aracı | Yük | Güvenilirlik | Fırlatma penceresi |
|---|---|---|---|
| Kıvılcım | 12 kg | %72 | %13 — dar, ama ucuz |
| Yükseliş | 24 kg | %86 | %21 — denge noktası |
| Sefer | 44 kg | %94 | %30 — en geniş pencere, en pahalı |

| İniş modülü | Kütle | Yakıt | İtki |
|---|---|---|---|
| Kelebek | 5 kg | 34 | 150 — keskin ve hafif |
| Kasında | 9 kg | 50 | 125 — bol yakıt, ağır itki |

Güçlü fırlatma penceresini kaçırmamak için büyük araç, iniş hassasiyeti için hafif modül
tercih edilir. Kasında'nın fazla yakıtı seyir fazında arabulucu atışı bedelsiz yapar.

## Kontroller

- **Fırlatma:** `Boşluk` tuşu veya `FIRLAT` düğmesi (ilk tık geri sayımı başlatır, ikinci tık ateşler); `W` de aynı işlevi görür
- **İniş:** `W`/`↑`/`Boşluk` = tam itki, `S`/`↓` = yarım itki, `A`/`←` ve `D`/`→` = yan itki; ekrana dokunmak tam itki verir
- **Yüzey:** Enstrüman kutularını işaretle, `Sölü başlat` ile günü ilerlet, `Veriyi Dünya'ya gönder` ile tamponu boşalt

## Puanlama

Puan; fırlatma pencere hassasiyeti, iniş bölgesi hassasiyeti, toplanan bilim, bütçe
ekonomisi ve tutturulan brifing ödülünden oluşur. En yüksek not `S`. Rekor tarayıcıda
`localStorage`'da tutulur.

## Katkı / deploy

MenSpace, statik bir site olarak barındırılır. `wrangler.jsonc` dosyasındaki
`assets.directory` yolu `./app` klasörüne (site kök dizinine) işaret eder.

```bash
python3 -m http.server 8899 --directory app   # yerel önizleme
npx wrangler deploy                            # Cloudflare Workers (statik assets)
```

## Yapı

```
app/
  index.html   arayüz iskeleti (7 ekran)
  style.css    tasarım dili: kağıt/mürekkep paleti, defter estetiği
  game.js      oyun durumu, fazlar, brifing üretimi, canvas çizimi, ses (WebAudio)
  assets/      çizimler (PNG)
```

Teknik: saf HTML/CSS/JS + Canvas 2D, harici kütüphane veya build adımı yok.

## Lisans

MIT — bkz. [LICENCE](LICENCE).
