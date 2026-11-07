# Katkı (Contribution)

Bu proje NASA Space Apps challenge için yapılan, uçtan uca bir uzay görevi tasarlama simülatörü.
Herkes katkıda bulunabilir — kod, çizim, belge veya fikir.

## Kurallar

1. **Çizim tarzı korunacak.** `pil.png`, `mars_rover.png` gibi varlıklar — kalın siyah kontur, düz renk dolgu, gölge/gradyan yok, şeffaf zemin. Yeni bir asset eklemeden önce mevcut birine bak.
2. **Kod stili.** `game.js` ve `style.css`'i bozmadan düzenleyin. Yeni bir fonksiyon yazıyorsanız `/* ============ ... ============ */` başlık ile ayırmak iyi olur.
3. **Türkçe yorum.** Oyun metinleri Türkçe. Yeni bir metin yazıyorsanız Türkçe tutun.
4. **Replay deterministik.** `runOfficialChallenge` ve worker'daki replay yolu `rng()` ve toplam `t` zamanına bağlıdır. Yeni bir olay eklemeden önce replay'de test edin.
5. **Test.** `node --check app/game.js && node --check worker/index.mjs` ve `/tmp/test-*.mjs` testlerini çalıştırın.

## Hangi alanlara katkı bulunabilir?

- **Yeni gezegen** (`HEDEFLER` dizisine ekleme) — çekim, zemin rengi, atmosfer metni, yüzey görseli.
- **Yeni brifing** (`BRIFLER` dizisine ekleme) — zorluk, ödül, arac/modül önerileri.
- **Yeni donanım** (`DONANIM` dizisine ekleme) — bilim cihazı, panel, anten.
- **Yeni production / atölye tarifi** (`URETIMLER` dizisine ekleme).
- **Yeni olay** (`MODIFIYELER` ve `solYurut` içindeki rastgele olaylar).
- **Dokümantasyon** — `readme.md` ve `CONTRIBUT.md` güncellemeleri.

## Çizim listesi

`app/assets/` klasörüne PNG ekleyin. Boyutlar ve konular için `readme.md`'deki "Yeni görseller" tablosuna bakın.

## Deploy

```bash
npx wrangler deploy
```

Worker `worker/index.mjs`'i ve `app/` klasöründaki statik assetleri publish eder.
