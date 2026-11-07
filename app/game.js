/* MenSpace — görev tasarım simülatörü
   fazlar: tasarım → fırlatma → seyir → iniş → yüzey → rapor        */
"use strict";

/* ============ yardımcılar ============ */
let challengeRandom = Math.random;
const rng = () => challengeRandom();
const $ = (s) => document.querySelector(s);
const sinir = (a, x, b) => Math.max(a, Math.min(x, b));
const say = (n, h) => n.toLocaleString("tr-TR", { maximumFractionDigits: h === undefined ? 1 : h });
const rast = (a, b) => a + rng() * (b - a);

/* ============ ses (WebAudio, dosyasız) ============ */
let sesBaglami = null;
function sesAc() {
  if (!sesBaglami) {
    try { sesBaglami = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (_) { /* sessiz kalır */ }
  }
  if (sesBaglami && sesBaglami.state === "suspended") sesBaglami.resume();
}
function ses(tip) {
  if (!sesBaglami) return;
  const gec = sesBaglami.currentTime;
  const os = sesBaglami.createOscillator();
  const gv = sesBaglami.createGain();
  os.connect(gv); gv.connect(sesBaglami.destination);
  if (tip === "tik")    { os.type = "square";   os.frequency.value = 660; gv.gain.setValueAtTime(0.04, gec); gv.gain.exponentialRampToValueAtTime(0.0001, gec + 0.07); os.start(gec); os.stop(gec + 0.08); }
  if (tip === "onay")   { os.type = "triangle"; os.frequency.setValueAtTime(520, gec); os.frequency.exponentialRampToValueAtTime(880, gec + 0.12); gv.gain.setValueAtTime(0.05, gec); gv.gain.exponentialRampToValueAtTime(0.0001, gec + 0.25); os.start(gec); os.stop(gec + 0.26); }
  if (tip === "hata")   { os.type = "sawtooth"; os.frequency.setValueAtTime(220, gec); os.frequency.exponentialRampToValueAtTime(70, gec + 0.3); gv.gain.setValueAtTime(0.05, gec); gv.gain.exponentialRampToValueAtTime(0.0001, gec + 0.32); os.start(gec); os.stop(gec + 0.34); }
  if (tip === "firlat") { os.type = "sawtooth"; os.frequency.setValueAtTime(90, gec); os.frequency.exponentialRampToValueAtTime(30, gec + 1.2); gv.gain.setValueAtTime(0.07, gec); gv.gain.exponentialRampToValueAtTime(0.0001, gec + 1.3); os.start(gec); os.stop(gec + 1.32); }
}

/* ============ veri kitaplığı ============ */
const BUTCE = 44;

const ARACLAR = [
  { anahtar: "kucuk", ad: "Kıvılcım", oz: "küçük araç", img: "assets/roket_kucuk.png",
    kapasite: 12, maliyet: 8,  guven: 0.72, pencere: 0.13 },
  { anahtar: "orta",  ad: "Yükseliş", oz: "orta araç", img: "assets/roket_orta.png",
    kapasite: 24, maliyet: 16, guven: 0.86, pencere: 0.21 },
  { anahtar: "buyuk", ad: "Sefer", oz: "ağır araç", img: "assets/roket_buyuk.png",
    kapasite: 44, maliyet: 26, guven: 0.94, pencere: 0.30 },
];

const MODULLER = [
  { anahtar: "hafif", ad: "Kelebek", img: "assets/inis_aracı.png",
    kutle: 5, maliyet: 4, yakit: 34, itus: 150 },
  { anahtar: "kasa", ad: "Kasında", img: "assets/inis_aracı.png",
    kutle: 9, maliyet: 6, yakit: 50, itus: 125 },
];

const DONANIM = [
  { anahtar: "kamera",   ad: "Kamera",        img: "assets/kamera.png",
    kutle: 2, maliyet: 3,   guc: 1, bilim: 6, not: "görüntü verisi üretir" },
  { anahtar: "spek",     ad: "Spektrometre",  img: "assets/spektrometre.png",
    kutle: 4, maliyet: 5,   guc: 2, bilim: 9, not: "kaya bileşimini tarar" },
  { anahtar: "sismo",    ad: "Sismometre",    img: "assets/sismometre.png",
    kutle: 3, maliyet: 4,   guc: 1, bilim: 5, not: "ay depremlerini dinler" },
  { anahtar: "anten_k",  ad: "Küçük Anten",   img: "assets/anten_kucuk.png",
    kutle: 2, maliyet: 2,   guc: 1, link: 10, not: "iletim başına 10 birime kadar gönderebilir" },
  { anahtar: "anten_b",  ad: "Büyük Anten",   img: "assets/anten_buyuk.png",
    kutle: 4, maliyet: 3,   guc: 2, link: 22, not: "iletim başına 22 birime kadar gönderebilir" },
  { anahtar: "panel",    ad: "Güneş Paneli",  img: "assets/panel.png",
    kutle: 3, maliyet: 3,   uretim: 8, not: "gündüz söl başına 8 birim üretir" },
  { anahtar: "pil",      ad: "Pil",           img: "assets/pil.png",
    kutle: 2, maliyet: 2,   kapasite: 60, not: "araç bataryasına +60 birim depo — ay gecesinin tek dayanağı" },
  { anahtar: "bayrak",   ad: "Bayrak",        img: "assets/bayrak.png",
    kutle: 1, maliyet: 1,   sabit: 2, not: "yüzeye inişte dikilir, +2 bilim" },
];

/* ============ atölye / üretim ============ */
const KAYNAKLAR = {
  metal:   { ad: "Metal",   img: "assets/kaynak_metal.png",   renk: "#B9BCC7" },
  kristal: { ad: "Kristal", img: "assets/kaynak_kristal.png", renk: "#4AD0E3" },
  buz:     { ad: "Buz",     img: "assets/kaynak_buz.png",     renk: "#BFE9FF" },
};

const URETIMLER = [
  { anahtar: "yedekPil", ad: "Yedek Pil", img: "assets/uretim_pil.png", tekrar: true,
    maliyet: { metal: 2, kristal: 1 },
    aciklama: "Üs gücü +25, rover +20. Güç bitince sölü yeniden açar." },
  { anahtar: "donusturucu", ad: "Yakıt Dönüştürücü", img: "assets/uretim_donusturucu.png", tekrar: false,
    maliyet: { metal: 3, kristal: 2, buz: 2 },
    aciklama: "Buz ve metalden yakıt üretmeyi açar (1 buz + 1 metal → 4 yakıt)." },
  { anahtar: "motorAyar", ad: "Motor Ayarı", img: "assets/uretim_metal.png", tekrar: false,
    maliyet: { metal: 2, kristal: 2 },
    aciklama: "İniş itkisinde yakıt tüketimi %20 azalır." },
  { anahtar: "roverPil", ad: "Rover Pil Yükseltmesi", img: "assets/uretim_roverpil.png", tekrar: false,
    maliyet: { metal: 2, buz: 2 },
    aciklama: "Rover pil kapasitesi +30 ve tam şarj." },
];

/* ============ hedef gök cisimleri ============ */
const HEDEFLER = [
  { anahtar: "ay", ad: "Ay", img: "assets/ay.png", cekim: 42, zemin: "#8A8D99", atmosfer: "yok", yuzey: "ay_yuzeyi",
    not: "1,62 m/s² — hafif çekim, yumuşak iniş." },
  { anahtar: "mars", ad: "Mars", img: "assets/mars.png", cekim: 50, zemin: "#A0522D", atmosfer: "ince CO₂", yuzey: "mars_yuzey",
    not: "3,72 m/s² — daha ağır çekim, ama ince atmosfer biraz frenliyor." },
  { anahtar: "merkur", ad: "Merkür", img: "assets/merkur.png", cekim: 52, zemin: "#8A8578", atmosfer: "yok", yuzey: "merkur_yuzey",
    not: "3,70 m/s² — atmosfer yok, düşüşü sadece motor kesiyor." },
  { anahtar: "venus", ad: "Venüs", img: "assets/venus.png", cekim: 60, zemin: "#C9A227", atmosfer: "yoğun CO₂", yuzey: "venus_yuzey", bulut: "venus_bulut",
    not: "8,87 m/s² — ağır çekim, her itki yakıt yakar." },
];

/* ============ görev brifleri ============ */
const BRIFLER = [
  { anahtar: "veri", ad: "Derin Veri", zorluk: 1, olcu: "iletilen", hedef: 45, odul: 20, arac: "orta", modul: "hafif",
    metin: "Görev sonuna kadar 45 birim veriyi Dünya'ya ilet.",
    onerilen: ["kamera", "anten_k", "panel", "pil"] },
  { anahtar: "gece", ad: "Karanlığa Dayanıklı", zorluk: 1, olcu: "gece", hedef: 1, odul: 20, arac: "orta", modul: "kasa",
    metin: "Bir ay gecesini enerjini kesmeden atlat.",
    onerilen: ["panel", "pil", "anten_k", "sismo"] },
  { anahtar: "cihaz", ad: "Tam Enstrüman", zorluk: 2, olcu: "kesintisiz", hedef: 5, odul: 30, arac: "orta", modul: "hafif",
    metin: "Tüm bilim enstrümanlarını 5 söl boyunca kesintisiz çalıştır.",
    onerilen: ["kamera", "spek", "sismo", "panel", "pil"] },
  { anahtar: "hassas", ad: "Nokta Atışı", zorluk: 2, olcu: "hassasiyet", hedef: 0.8, odul: 30, arac: "buyuk", modul: "kasa",
    metin: "İniş bölgesine 30 m içinde in.",
    onerilen: ["anten_k", "panel"] },
  { anahtar: "ekonomi", ad: "Ucuz Misyon", zorluk: 2, olcu: "butce", hedef: 12, odul: 30, arac: "kucuk", modul: "hafif",
    metin: "Bütçeden en az 12 M$ ayır.",
    onerilen: ["kamera", "anten_k"] },
  { anahtar: "veri2", ad: "Veri Avcısı", zorluk: 3, olcu: "iletilen", hedef: 95, odul: 45, arac: "orta", modul: "kasa",
    metin: "95 birim veriyi Dünya'ya ilet.",
    onerilen: ["spek", "anten_b", "panel", "pil", "bayrak"] },
  { anahtar: "cekirdek", ad: "Çift Gece", zorluk: 3, olcu: "gece", hedef: 2, odul: 45, arac: "orta", modul: "kasa",
    metin: "İki ay gecesini sorunsuz atlat.",
    onerilen: ["panel", "pil", "anten_b", "sismo"] },
  { anahtar: "combo", ad: "Çifte Hedef", zorluk: 3, olcu: "combo", hedef: 80, odul: 50, arac: "orta", modul: "hafif",
    metin: "80 birim veri ilet ve bir geceyi enerjisiz atlatma.",
    onerilen: ["kamera", "spek", "anten_b", "panel", "pil"] },
];

const MODIFIYELER = [
  { anahtar: "toz", ad: "Toz Fırtınası", tip: "hasatCarpan", deger: 0.5,
    metin: "panel hasadı yarıya iner" },
  { anahtar: "kum", ad: "Regolit Tozu", tip: "hasatEksik", deger: 3,
    metin: "panel hasadı her söl 3 birim azalır" },
  { anahtar: "karartma", ad: "Radyo Karartması", tip: "linkCarpan", deger: 0.5,
    metin: "her 3 sölün birinde iletim yarı kapasitede" },
  { anahtar: "soguk", ad: "Soğuk Gece", tip: "kapasiteCarpan", deger: 0.7,
    metin: "pil kapasitesi %30 düşer" },
  { anahtar: "parlak", ad: "Güneş Fırtınası", tip: "hasatCarpan", deger: 1.5,
    metin: "panel hasadı %50 artar, meteorit riski iki katına çıkar" },
  { anahtar: "sakin", ad: "Sakin Uzay", tip: "sakin", deger: 0.25,
    metin: "meteorit yağmaz ama veri hedefi %25 yükselir" },
];

const ZORLUK_SOL = { 1: 8, 2: 10, 3: 12 };
const ZORLUK_AD = { 1: "kolay", 2: "orta", 3: "zor" };

/* ============ oyun durumu ============ */
function setGlobalG(newG) {
  G = newG;
  if (typeof window !== "undefined") window.MENSPACE = G;
}

function freshState() {
  return {
    faz: "baslangic",
    clock: 0,
    misyonlar: [],
    brif: null,
    hedef: HEDEFLER[0],
    arac: null,
    modul: null,
    yakit: 0,
    donanim: new Set(),
    challenge: null,
    firlatma: { durum: "hazir", t: 0, merkez: 0.5, hamle: null, dogruluk: 0 },
    seyir: { durum: "bekleme", t: 0, guvence: false },
    inis: { durum: "bekleme", lander: null, pad: 440, hassasiyet: 0, sayac: 0 },
    yuzey: {
      sol: 1, pil: 0, pilKap: 0, tampon: 0, bilim: 0,
      aktif: new Set(), gunesKesik: false, bitti: false, pilBitti: false,
      bayrakDikildi: false, antenArizasi: false,
      iletilen: 0, geceler: 0, kesintisiz: 0,
      devam: false, gezegenSayisi: 1,
      rover: null, dugumler: [],
      kaynaklar: { metal: 0, kristal: 0, buz: 0 },
      uretimler: new Set(),
      uzayHava: null, uzayHavaCarpan: 1,
    },
  };
}
let G = freshState();
if (typeof window !== "undefined") window.MENSPACE = G;
if (typeof window !== "undefined") window.MENSPACE = G;

/* ============ varlık yükleme ============ */
const resimler = {};

function resimAdi(anahtar) {
  if (anahtar === "kucuk")  return "roket_kucuk";
  if (anahtar === "orta")   return "roket_orta";
  if (anahtar === "buyuk")  return "roket_buyuk";
  if (anahtar === "anten_k") return "anten_kucuk";
  if (anahtar === "anten_b") return "anten_buyuk";
  return anahtar;
}
function resim(anahtar) { return resimler[resimAdi(anahtar)]; }

function tumResimleriYukle() {
  const liste = [];
  ARACLAR.forEach(a => liste.push(a.img));
  liste.push("assets/inis_aracı.png");
  DONANIM.forEach(d => liste.push(d.img));
  liste.push("assets/patlama.png", "assets/dunya.png", "assets/ay.png",
             "assets/ay_yuzeyi.png", "assets/arkaplan.png");
  HEDEFLER.forEach((h) => { if (h.anahtar !== "ay") liste.push(h.img); });
  liste.push("assets/venus_bulut.png", "assets/mars_rover.png", "assets/gunes.png", "assets/saturn.png", "assets/inis_basarili.png", "assets/inis_basarisiz.png", "assets/rozet_inis.png", "assets/rozet_sol.png", "assets/rozet_bagis.png", "assets/rozet_s.png");
  liste.push("assets/kaynak_metal.png", "assets/kaynak_kristal.png", "assets/kaynak_buz.png",
             "assets/uretim_pil.png", "assets/uretim_donusturucu.png", "assets/uretim_metal.png", "assets/uretim_roverpil.png");
  liste.forEach(kaynak => {
    const im = new Image();
    im.src = kaynak;
    resimler[kaynak.replace("assets/", "").replace(".png", "")] = im;
  });
}

/* ============ ekran geçişi ============ */
function ekranAc(isim) {
  document.querySelectorAll(".ekran").forEach(e => e.classList.remove("acik"));
  $("#ekran-" + isim).classList.add("acik");
  document.body.classList.toggle("menu-mode", isim === "baslangic" || isim === "brif");
  G.faz = isim;
}

function saatGuncelle(metin) { $("#gorev-saat").textContent = metin; }

/* ============ bütçe / kütle / güç ============ */
function kutleTopla() {
  let k = G.modul ? G.modul.kutle : 0;
  G.donanim.forEach(a => {
    const d = DONANIM.find(x => x.anahtar === a);
    if (d) k += d.kutle;
  });
  return k;
}

function butceHarca() {
  let m = G.arac ? G.arac.maliyet : 0;
  if (G.modul) m += G.modul.maliyet;
  G.donanim.forEach(a => {
    const d = DONANIM.find(x => x.anahtar === a);
    if (d) m += d.maliyet;
  });
  return m;
}

function gucHesapla() {
  let harca = 0, uretim = 0, link = 0;
  G.donanim.forEach(a => {
    const d = DONANIM.find(x => x.anahtar === a);
    if (!d) return;
    if (d.guc) harca += d.guc;
    if (d.uretim) uretim += d.uretim;
    if (d.link) link = Math.max(link, d.link);
  });
  return { harca, uretim, net: uretim - harca, link };
}

function kaynakGuncelle() {
  const kutle = kutleTopla();
  const guc = gucHesapla();
  const butce = BUTCE - butceHarca();
  $("#kn-butce").textContent = say(butce) + " M$";
  $("#kn-butce").classList.toggle("asr", butce < 0);
  $("#kn-kutle").textContent = say(kutle) + (G.arac ? " / " + G.arac.kapasite + " kg" : " kg");
  $("#kn-kutle").classList.toggle("asr", !!G.arac && kutle > G.arac.kapasite);
  $("#kn-guc").textContent = say(guc.net) + " /söl";
  $("#kn-guc").classList.toggle("asr", guc.net < 0);
  $("#kn-yakit").textContent = say(G.yakit);
  $("#kn-bilim").textContent = say(G.yuzey.bilim, 0);
}

/* ============ UZAY HAVA (NASA DONKI) ============ */
const NASA_API_KEY = (typeof window !== "undefined" && window.NASA_API_KEY) || "DEMO_KEY";

function donkiTarih(secim) {
  const gun = new Date();
  gun.setDate(gun.getDate() + secim);
  return gun.toISOString().slice(0, 10);
}

async function uzayHavaYukle() {
  if (typeof window === "undefined" || window.MENSPACE_REPLAY) return null;
  const bugun = donkiTarih(0);
  const dun = donkiTarih(-1);
  const url = "https://api.nasa.gov/notifications?startDate=" + dun + "&endDate=" + bugun + "&api_key=" + NASA_API_KEY;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("donki " + res.status);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("DONKI yuklenemedi:", e && e.message);
    return null;
  }
}

function donkiOlaySec() {
  const olaylar = ["CME", "FLR", "SEP", "GST", "MPC", "WSA"];
  return olaylar[Math.floor(rng() * olaylar.length)];
}

function donkiEtkisiUygula(olay, hedef) {
  const y = G.yuzey;
  let mesaj = "";
  let etki = 1;
  const mesafe = hedef.anahtar === "merkur" ? 0.3 : hedef.anahtar === "venus" ? 0.5 : hedef.anahtar === "mars" ? 0.7 : 1;
  switch (olay) {
    case "CME":
      etki = 0.6 + mesafe * 0.4;
      y.uzayHawaCarpan = etki;
      y.antenArizasi = true;
      mesaj = "GÜNEŞ KÜTLESİ ATIMI — anten arızası, panel verimi ×" + etki.toFixed(2);
      break;
    case "FLR":
      etki = 1.2 + mesafe * 0.5;
      y.uzayHawaCarpan = etki;
      mesaj = "GÜNEŞ PATLAMASI (X-class) — panel hasadı ×" + etki.toFixed(2) + ", rover radyasyon zararı";
      break;
    case "SEP":
      etki = 0.8 + mesafe * 0.4;
      y.uzayHawaCarpan = etki;
      mesaj = "RASYON PARTİKÜLLERİ — rover pili azalır, cihazlar karartma modunda";
      break;
    case "GST":
      etki = 0.5 + mesafe * 0.3;
      y.uzayHawaCarpan = etki;
      y.antenArizasi = true;
      mesaj = "MANYETİK FIRTINA — anten arızası, iletim yarım kapasite";
      break;
    default:
      etki = 0.9 + mesafe * 0.2;
      y.uzayHawaCarpan = etki;
      mesaj = "UZAY HAVA UYARISI — hava koşulları etkin";
  }
  y.uzayHawa = { t: donkiTarih(0), olay: olay, mesaj: mesaj };
  return mesaj;
}

async function uzayHawaGuncelle() {
  const y = G.yuzey;
  if (G.faz !== "yuzey" || y.bitti) return;
  const bugun = y.sol;
  if (y.uzayHawa && y.uzayHawa.sol === bugun) return;
  if (rng() < 0.6) return; // bazen sessiz gün — hem canli hem replay'de deterministik
  let mesaj = "";
  if (typeof window !== "undefined" && window.MENSPACE_REPLAY) {
    const olay = donkiOlaySec();
    mesaj = donkiEtkisiUygula(olay, G.hedef);
  } else {
    const olaylar = await uzayHavaYukle();
    if (olaylar) {
      const secim = olaylar[Math.floor(rng() * olaylar.length)];
      const olay = (secim && secim.eventType) ? secim.eventType : donkiOlaySec();
      mesaj = donkiEtkisiUygula(olay, G.hedef);
    } else {
      const olay = donkiOlaySec();
      mesaj = donkiEtkisiUygula(olay, G.hedef);
    }
  }
  if (mesaj) {
    const gunlukEl = $("#yuzey-gunluk");
    if (gunlukEl) gunlukEl.textContent += "\n" + mesaj;
    ses("hata");
  }
}
function yildizOrgu(ctx, w, h) {
  ctx.fillStyle = "#3B4257";
  ctx.fillRect(0, 0, w, h);
  const rk = resim("arkaplan");
  if (rk && rk.complete && rk.naturalWidth) {
    ctx.fillStyle = ctx.createPattern(rk, "repeat");
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.fillStyle = "#F2C130";
    for (let i = 0; i < 40; i++) ctx.fillRect((i * 137) % w, (i * 89) % h, 4, 4);
  }
}

function yuzeySeridi(ctx, y, w, tint, offset) {
  const zemin = resim("ay_yuzeyi");
  const kaydir = offset ? ((offset % 86) + 86) % 86 : 0;
  for (let x = -kaydir; x < w; x += 86) {
    if (zemin && zemin.complete && zemin.naturalWidth) ctx.drawImage(zemin, x, y, 86, 84);
    else { ctx.fillStyle = "#9BA0AE"; ctx.fillRect(x, y, 86, 84); }
  }
  ctx.fillStyle = "rgba(35,37,47,0.22)";
  ctx.fillRect(0, y, w, 84);
  if (tint) {
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = tint;
    ctx.fillRect(0, y, w, 84);
    ctx.globalAlpha = 1;
  }
}

function etiket(ctx, metin, x, y) {
  ctx.font = "12px 'IBM Plex Mono', monospace";
  ctx.textAlign = "center";
  const gen = ctx.measureText(metin).width + 10;
  ctx.fillStyle = "rgba(35,37,47,0.78)";
  ctx.fillRect(x - gen / 2, y - 12, gen, 16);
  ctx.fillStyle = "#EDE7D6";
  ctx.fillText(metin, x, y);
}

function panelKanatlari(ctx, merkezX, genislik, tabanY, boy) {
  if (!G.donanim.has("panel") || !genislik) return;
  const im = resim("panel");
  if (!im || !im.complete) return;
  const kanatG = boy * 0.2;
  const kanatH = kanatG * (im.naturalHeight / im.naturalWidth);
  const y = tabanY - boy * 0.58;
  const sol = merkezX - genislik / 2 - kanatG;
  const sag = merkezX + genislik / 2;
  ctx.fillStyle = "#23252F";
  ctx.fillRect(sol + kanatG, y + kanatH / 2 - 2, 7, 4);
  ctx.fillRect(sag - 7, y + kanatH / 2 - 2, 7, 4);
  ctx.drawImage(im, sol, y, kanatG, kanatH);
  ctx.drawImage(im, sag, y, kanatG, kanatH);
}

/* ============ görev brifingi ============ */
function misyonlariUret() {
  const havuz = [...BRIFLER];
  const secim = [];
  [1, 2, 3].forEach((z) => {
    const adaylar = havuz.filter((b) => b.zorluk === z);
    const b = adaylar[Math.floor(rng() * adaylar.length)];
    secim.push(b);
    havuz.splice(havuz.indexOf(b), 1);
  });
  const modSayisi = { 1: 0, 2: 1, 3: 2 };
  return secim.map((b) => {
    const modHavuz = [...MODIFIYELER];
    const mods = [];
    for (let i = 0; i < modSayisi[b.zorluk]; i++) {
      const m = modHavuz.splice(Math.floor(rng() * modHavuz.length), 1)[0];
      mods.push(m);
    }
    let hedef = b.hedef;
    if (mods.some((m) => m.tip === "sakin")) hedef = Math.round(hedef * 1.25);
    const gokCisim = HEDEFLER[Math.floor(rng() * HEDEFLER.length)];
    return {
      ...b, hedef, modifiyeler: mods, sols: ZORLUK_SOL[b.zorluk], gokCisim,
      kod: "MS-" + (100 + Math.floor(rng() * 899)),
    };
  });
}

function modDeger(tip) {
  if (!G.brif) return null;
  const m = G.brif.modifiyeler.find((x) => x.tip === tip);
  return m ? m.deger : null;
}

function misyonKartlariCiz() {
  const kap = $("#gorev-liste");
  if (!kap) return;
  kap.innerHTML = "";
  G.misyonlar.forEach((m) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "gorev-kart" + (G.brif === m ? " secili" : "");
    b.setAttribute("aria-pressed", G.brif === m ? "true" : "false");
    b.innerHTML =
      '<span class="gorev-ust"><span class="gorev-kod">' + m.kod + "</span>" +
      '<span class="gorev-zorluk z' + m.zorluk + '">' + ZORLUK_AD[m.zorluk] + "</span></span>" +
      '<span class="gorev-ad">' + m.ad + "</span>" +
      '<span class="gorev-hedef"><img src="' + m.gokCisim.img + '" alt="">' + m.gokCisim.ad + " · " + m.gokCisim.atmosfer + " atmosfer</span>" +
      '<span class="gorev-metin">' + m.metin + "</span>" +
      '<span class="gorev-modlar">' +
      (m.modifiyeler.length
        ? m.modifiyeler.map((x) => x.ad + " — " + x.metin).join(" · ")
        : "Sakin ortam — meteorit yok, enerji düzenli.") + "</span>" +
      '<span class="gorev-alt"><span class="gorev-sure">' + m.sols + " söl · ödül +" + m.odul + " puan</span>" +
      '<span class="gorev-sec">' + (G.brif === m ? "✓ seçildi" : "seç") + "</span></span>" +
      '<span class="gorev-oneri">Öneri: ' +
      (ARACLAR.find((x) => x.anahtar === m.arac) || {}).ad + " + " +
      (MODULLER.find((x) => x.anahtar === m.modul) || {}).ad + "</span>";
    b.addEventListener("click", () => { sesAc(); ses("tik"); brifSec(m); });
    kap.appendChild(b);
  });
}

function brifSec(m) {
  if (G.challenge) G.challenge.log.push({ t: G.clock || 0, type: "brifing", index: G.misyonlar.indexOf(m) });
  G.brif = m;
  G.hedef = m.gokCisim || HEDEFLER[0];
  G.yuzey.iletilen = 0;
  G.yuzey.geceler = 0;
  G.yuzey.kesintisiz = 0;
  misyonKartlariCiz();
  $("#btn-brif-tasarim").disabled = false;
  brifKartiGuncelle();
}

function brifKartiGuncelle() {
  const kart = $("#brif-kart");
  const b = G.brif;
  if (!kart) return;
  if (!b) { kart.hidden = true; return; }
  kart.hidden = false;
  $("#brif-kod").textContent = b.kod;
  $("#brif-ad").textContent = b.ad;
  const z = $("#brif-zorluk");
  z.textContent = ZORLUK_AD[b.zorluk] + " · " + b.sols + " söl";
  z.className = "gorev-zorluk z" + b.zorluk;
  $("#brif-hedef").textContent = b.metin + "  Ödül: +" + b.odul + " puan.";
  const hImg = $("#brif-gok-cisim");
  if (hImg && b.gokCisim) {
    hImg.src = b.gokCisim.img;
    hImg.alt = b.gokCisim.ad;
    hImg.hidden = false;
  }
  const hYazi = $("#brif-gok-cisim-yazi");
  if (hYazi && b.gokCisim) hYazi.textContent = b.gokCisim.ad + " · " + b.gokCisim.not;
  const modUl = $("#brif-modlar");
  modUl.innerHTML = "";
  if (!b.modifiyeler.length) {
    const li = document.createElement("li");
    li.textContent = "Sakin ortam — meteorit yağmaz, enerji düzenli gelir.";
    modUl.appendChild(li);
  } else {
    b.modifiyeler.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = m.ad + " — " + m.metin;
      modUl.appendChild(li);
    });
  }
  onerilenGuncelle();
}

function onerilenGuncelle() {
  const kap = $("#onerilen-liste");
  if (!kap || !G.brif) return;
  kap.innerHTML = "";
  const ekle = (ad, seciliMi) => {
    const span = document.createElement("span");
    span.className = "onerilen-chip " + (seciliMi ? "var" : "yok");
    span.innerHTML = "<b>" + (seciliMi ? "✓" : "＋") + "</b> " + ad;
    kap.appendChild(span);
  };
  const arac = ARACLAR.find((x) => x.anahtar === G.brif.arac);
  const modul = MODULLER.find((x) => x.anahtar === G.brif.modul);
  if (arac) ekle(arac.ad, G.arac === arac);
  if (modul) ekle(modul.ad, G.modul === modul);
  G.brif.onerilen.forEach((anahtar) => {
    const d = DONANIM.find((x) => x.anahtar === anahtar);
    if (d) ekle(d.ad, G.donanim.has(anahtar));
  });
}

function brifDurumu() {
  const b = G.brif;
  const y = G.yuzey;
  if (!b) return { basarili: false, metin: "—" };
  if (b.olcu === "iletilen")
    return { basarili: y.iletilen >= b.hedef, metin: say(y.iletilen, 0) + " / " + b.hedef + " birim iletildi" };
  if (b.olcu === "gece")
    return { basarili: y.geceler >= b.hedef, metin: y.geceler + " / " + b.hedef + " gece atlatıldı" };
  if (b.olcu === "kesintisiz")
    return { basarili: y.kesintisiz >= b.hedef, metin: y.kesintisiz + " / " + b.hedef + " söl kesintisiz" };
  if (b.olcu === "hassasiyet")
    return { basarili: G.inis.hassasiyet >= b.hedef, metin: "%" + Math.round(G.inis.hassasiyet * 100) + " hassasiyet (hedef %" + Math.round(b.hedef * 100) + ")" };
  if (b.olcu === "butce")
    return { basarili: BUTCE - butceHarca() >= b.hedef, metin: say(BUTCE - butceHarca()) + " / " + b.hedef + " M$ rezerve" };
  if (b.olcu === "combo")
    return { basarili: y.iletilen >= 80 && y.geceler >= 1, metin: say(y.iletilen, 0) + " / 80 birim · " + y.geceler + " / 1 gece" };
  return { basarili: false, metin: "—" };
}

/* ============ TASARIM ============ */
function tasarimKur() {
  const aracKap = $("#arac-liste");
  ARACLAR.forEach(a => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "secenek";
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", "false");
    b.innerHTML =
      '<img src="' + a.img + '" alt="">' +
      '<span class="sec-metin"><span class="sec-ad">' + a.ad + "</span>" +
      '<span class="sec-ozet tabular">' + a.kapasite + " kg yük · " + say(a.maliyet, 0) +
      " M$ · güvenilirlik %" + Math.round(a.guven * 100) + "</span></span>";
    b.addEventListener("click", () => { sesAc(); ses("tik"); G.arac = a; logChallengeAction("arac", { anahtar: a.anahtar }); tasarimSecGuncelle(); tasarimDenetim(); });
    aracKap.appendChild(b);
    a.htm = b;
  });

  const modulKap = $("#modul-liste");
  MODULLER.forEach(m => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "secenek";
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", "false");
    b.innerHTML =
      '<img src="' + m.img + '" alt="">' +
      '<span class="sec-metin"><span class="sec-ad">' + m.ad + "</span>" +
      '<span class="sec-ozet tabular">' + m.kutle + " kg · " + say(m.maliyet, 0) + " M$ · " + m.yakit +
      " yakıt · itki " + m.itus + "</span></span>";
    b.addEventListener("click", () => { sesAc(); ses("tik"); G.modul = m; G.yakit = m.yakit; logChallengeAction("modul", { anahtar: m.anahtar }); tasarimSecGuncelle(); tasarimDenetim(); });
    modulKap.appendChild(b);
    m.htm = b;
  });

  const donKap = $("#donanim-liste");
  DONANIM.forEach(d => {
    const satir = document.createElement("div");
    satir.className = "donanim uyar";
    const ozetler = [];
    if (d.kutle)    ozetler.push(d.kutle + " kg");
    if (d.maliyet)  ozetler.push(say(d.maliyet, 1) + " M$");
    if (d.guc)      ozetler.push("−" + d.guc + "/söl");
    if (d.uretim)   ozetler.push("+" + d.uretim + "/söl");
    if (d.kapasite) ozetler.push(d.kapasite + " depo");
    if (d.bilim)    ozetler.push("+" + d.bilim + " bilim/söl");
    if (d.sabit)    ozetler.push("+" + d.sabit + " bilim");
    const li = document.createElement("label");
    li.className = "donanim-baslik";
    li.innerHTML =
      '<span class="dolap"><input type="checkbox" data-don="' + d.anahtar +
      '" aria-label="' + d.ad + '"></span>' +
      '<img src="' + d.img + '" alt="">' +
      "<span><b>" + d.ad + "</b> <i class='tabular' style='font-size:11px;color:var(--murekkep-2)'>" +
      ozetler.join(" · ") + "</i></span>";
    const notP = document.createElement("p");
    notP.className = "donanim-uzgun";
    notP.style.display = "none";
    notP.textContent = d.not || "";
    satir.appendChild(li);
    satir.appendChild(notP);
    const kutu = li.querySelector("input");
    kutu.addEventListener("change", () => {
      sesAc(); ses("tik");
      const dolap = li.querySelector(".dolap");
      if (kutu.checked) {
        if (d.anahtar === "anten_k") donanimKaldir("anten_b");
        if (d.anahtar === "anten_b") donanimKaldir("anten_k");
        G.donanim.add(d.anahtar);
        logChallengeAction("donanim", { keys: [...G.donanim] });
        dolap.classList.add("isaretli");
        notP.style.display = "block";
        satir.classList.remove("uyar");
      } else {
        G.donanim.delete(d.anahtar);
        logChallengeAction("donanim", { keys: [...G.donanim] });
        dolap.classList.remove("isaretli");
        notP.style.display = "none";
        satir.classList.add("uyar");
      }
      tasarimDenetim();
    });
    donKap.appendChild(satir);
  });

  $("#btn-tasarim-onay").addEventListener("click", () => { logChallengeAction("tasarimOnay", {}); sesAc(); ses("onay"); firlatmayaGec(); });
  tasarimDenetim();
}

function donanimKaldir(anahtar) {
  const kutu = document.querySelector('input[data-don="' + anahtar + '"]');
  if (kutu && kutu.checked) {
    kutu.checked = false;
    kutu.dispatchEvent(new Event("change"));
  }
}

function tasarimSecGuncelle() {
  const set = (liste, secili) => liste.forEach(x => {
    x.htm.classList.toggle("secili", x === secili);
    x.htm.setAttribute("aria-checked", x === secili ? "true" : "false");
  });
  set(ARACLAR, G.arac);
  set(MODULLER, G.modul);
}

function tasarimDenetim() {
  kaynakGuncelle();
  const durum = $("#tasarim-durum");
  const btn = $("#btn-tasarim-onay");
  const sorunlar = [];
  if (!G.arac) sorunlar.push("Fırlatma aracı seçilmedi.");
  if (!G.modul) sorunlar.push("İniş modülü seçilmedi.");
  const harca = butceHarca();
  if (harca > BUTCE) sorunlar.push("Bütçe aşıldı: " + say(harca) + " / " + BUTCE + " M$.");
  if (G.arac && kutleTopla() > G.arac.kapasite)
    sorunlar.push("Kütle payı aşıldı: " + say(kutleTopla()) + " / " + G.arac.kapasite + " kg.");
  if (G.arac) {
    const guc = gucHesapla();
    if (guc.net < 0 && !G.donanim.has("pil"))
      sorunlar.push("Enerji dengesi negatif ve pil yok: gündüz üretimin harcamayı karşılamıyor.");
    else if (guc.net < 0)
      sorunlar.push("Günlük güç açığı var: gündüz üretimi harcamayı karşılamıyor, pil geceyi kurtarmaz.");
    if (!G.donanim.has("anten_k") && !G.donanim.has("anten_b"))
      sorunlar.push("Anten yok: veri Dünya'ya iletemezsin, bu bilimin yarısı çöpe gider.");
  }
  if (sorunlar.length === 0) {
    durum.textContent = "Tasarım onaylandı — görev yönetimi fırlatmaya izin veriyor.";
    durum.classList.add("tamam"); durum.classList.remove("uyari");
    btn.disabled = false;
    btn.removeAttribute("title");
  } else {
    durum.innerHTML = sorunlar.join("<br>");
    durum.classList.add("uyari"); durum.classList.remove("tamam");
    btn.disabled = true;
    btn.title = "Tasarım onayı bekliyor: " + sorunlar.join(" ");
  }
  tasarimCiz();
  onerilenGuncelle();
}

function tasarimCiz() {
  const c = $("#montaj-kanvas");
  if (!c) return;
  const ctx = c.getContext("2d");
  const w = c.width, h = c.height;
  yildizOrgu(ctx, w, h);
  const zeminY = h - 70;
  yuzeySeridi(ctx, zeminY, w);
  ctx.fillStyle = "#23252F";
  ctx.fillRect(w / 2 - 90, zeminY + 30, 180, 12);

  const aracX = w / 2 + 95;
  const aracBoy = 190;
  let aracG = 0;
  if (G.arac) {
    const im = resim(G.arac.anahtar);
    if (im && im.complete) {
      aracG = aracBoy * (im.naturalWidth / im.naturalHeight);
      ctx.drawImage(im, aracX - aracG / 2, zeminY - aracBoy, aracG, aracBoy);
    }
    panelKanatlari(ctx, aracX, aracG, zeminY, aracBoy);
    etiket(ctx, G.arac.ad.toLowerCase() + " · " + G.arac.kapasite + " kg pay", aracX, zeminY + 24);
  }

  const modulX = 30, modulBoy = 100;
  let modulG = 0;
  if (G.modul) {
    const im = resim("inis_aracı");
    if (im && im.complete) {
      modulG = modulBoy * (im.naturalWidth / im.naturalHeight);
      ctx.drawImage(im, modulX, zeminY - modulBoy, modulG, modulBoy);
    }
    const pIm = resim("pil");
    if (G.donanim.has("pil") && pIm && pIm.complete) {
      const pilBoy = 42;
      const pilG = pilBoy * (pIm.naturalWidth / pIm.naturalHeight);
      const px = modulX + modulG / 2 - pilG / 2;
      const py = zeminY - modulBoy - pilBoy;
      ctx.drawImage(pIm, px, py, pilG, pilBoy);
      etiket(ctx, "pil", px + pilG / 2, py - 6);
    }
    etiket(ctx, G.modul.ad.toLowerCase() + " · " + G.modul.yakit + " yakıt", modulX + modulG / 2, zeminY + 24);
  }

  const antAnahtar = G.donanim.has("anten_b") ? "anten_b" : (G.donanim.has("anten_k") ? "anten_k" : null);
  if (antAnahtar) {
    const im = resim(antAnahtar);
    if (im && im.complete) {
      const antBoy = antAnahtar === "anten_b" ? 86 : 76;
      const antG = antBoy * (im.naturalWidth / im.naturalHeight);
      const ax = modulX + modulG + 12;
      ctx.drawImage(im, ax, zeminY - antBoy, antG, antBoy);
      etiket(ctx, antAnahtar === "anten_b" ? "büyük anten" : "küçük anten", ax + antG / 2, zeminY + 24);
    }
  }

  const yukler = DONANIM.filter(d => G.donanim.has(d.anahtar) && !["pil", "panel", "anten_b", "anten_k"].includes(d.anahtar));
  const rafSatir = new Set(yukler.map((d, i) => Math.floor(i / 2)));
  rafSatir.forEach(s => {
    const y = 300 - s * 88;
    ctx.fillStyle = "rgba(35,37,47,0.55)";
    ctx.fillRect(20, y - 1, 156, 3);
  });
  yukler.forEach((d, i) => {
    const im = resim(d.anahtar);
    if (!im || !im.complete) return;
    const boy = 56, g = Math.min(56, boy * (im.naturalWidth / im.naturalHeight));
    const x = 26 + (i % 2) * 74;
    const y = 300 - Math.floor(i / 2) * 88;
    ctx.drawImage(im, x, y - boy, g, boy);
    etiket(ctx, d.ad.toLowerCase(), x + g / 2, y + 18);
  });

  if (!G.arac && !G.modul && yukler.length === 0) {
    ctx.fillStyle = "rgba(237,231,214,0.7)";
    ctx.font = "16px 'IBM Plex Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Kıvılcım · Yükseliş · Sefer — hangisi senin görevini taşıyacak?", w / 2, 140);
    ctx.fillText("Seçtikçe araç burada kurulur.", w / 2, 166);
  }
}

/* ============ FIRLATMA ============ */
function firlatmayaGec() {
  ekranAc("firlatma");
  const f = G.firlatma;
  f.durum = "hazir"; f.t = 0; f.hamle = null; f.dogruluk = 0;
  f.merkez = rast(0.34, 0.66);
  $("#firlatma-yazi").textContent =
    "Renkli pencere araç güvenilirliği kadar geniş (toplam % " +
    Math.round(G.arac.pencere * 100) + "). İlk FIRLAT geri sayımı başlatır; ikincisi pencerede yakalar.";
  saatGuncelle("geri sayım bekleniyor");
  kaynakGuncelle();
}

function firlatmaTikla() {
  const f = G.firlatma;
  logChallengeAction("launchClick", {});
  if (f.durum === "hazir") { f.durum = "canli"; f.t = 0; ses("tik"); return; }
  if (f.durum !== "canli") return;
  const hiz = 0.9 / G.arac.pencere;
  const konum = 0.5 + 0.45 * Math.sin(f.t * hiz);
  const yari = G.arac.pencere / 2;
  const fark = Math.abs(konum - f.merkez);
  f.dogruluk = fark <= yari ? 1 - fark / (yari * 1.3) : Math.max(0, 0.25 - fark / 0.4);
  f.hamle = konum;
  const sanc = fark <= yari
    ? G.arac.guven * (0.88 + 0.12 * f.dogruluk)
    : G.arac.guven * 0.22 * f.dogruluk;
  const tuttu = rng() < sanc;
  f.durum = tuttu ? "ucus" : "patlak";
  f.t = 0;
  if (tuttu) { ses("firlat"); saatGuncelle("yükseliş — burun aşağı, tutum iyi"); }
  else { ses("hata"); saatGuncelle("fırlatma kazası"); }
}

function firlatmaCiz(dt) {
  const c = $("#firlatma-kanvas");
  const ctx = c.getContext("2d");
  const w = c.width, h = c.height;
  const f = G.firlatma;
  if (f.durum === "canli" || f.durum === "ucus" || f.durum === "patlak") f.t += dt;
  yildizOrgu(ctx, w, h);
  const zeminY = h - 70;
  yuzeySeridi(ctx, zeminY, w);
  ctx.fillStyle = "#23252F";
  ctx.fillRect(w / 2 - 70, zeminY + 30, 140, 12);

  const im = resim(G.arac.anahtar);

  if (f.durum === "hazir" || f.durum === "canli") {
    if (im && im.complete) {
      const boy = 210, g = boy * (im.naturalWidth / im.naturalHeight);
      ctx.drawImage(im, w / 2 - g / 2, zeminY - boy + 30, g, boy);
      panelKanatlari(ctx, w / 2, g, zeminY + 30, boy);
    }
    if (f.durum === "canli") {
      ctx.fillStyle = "#F2C130";
      ctx.beginPath();
      ctx.moveTo(w / 2 - 9, zeminY + 30);
      ctx.lineTo(w / 2 + 9, zeminY + 30);
      ctx.lineTo(w / 2, zeminY + 62 + rng() * 14);
      ctx.fill();
    }
    etiket(ctx, f.durum === "hazir" ? "geri sayım bekleniyor" : "T−0 — pencereyi yakala", w / 2, zeminY + 14);
  }

  if (f.durum === "ucus") {
    const yuk = Math.min(300, f.t * 150);
    if (im && im.complete) {
      const boy = 210, g = boy * (im.naturalWidth / im.naturalHeight);
      const y = zeminY - boy + 30 - yuk;
      if (y + boy > -40) {
        ctx.drawImage(im, w / 2 - g / 2, y, g, boy);
        panelKanatlari(ctx, w / 2, g, y + boy, boy);
        ctx.fillStyle = "#F2C130";
        ctx.beginPath();
        ctx.moveTo(w / 2 - 9, y + boy);
        ctx.lineTo(w / 2 + 9, y + boy);
        ctx.lineTo(w / 2, y + boy + 30 + rng() * 14);
        ctx.fill();
      }
    }
    if (f.t > 2.8) { seyireGec(); return; }
  }

  if (f.durum === "patlak") {
    if (im && im.complete) {
      const boy = 210, g = boy * (im.naturalWidth / im.naturalHeight);
      ctx.drawImage(im, w / 2 - g / 2, zeminY - boy + 30, g, boy);
    }
    if (f.t > 0.35) {
      const p = resim("patlama");
      if (p && p.complete) ctx.drawImage(p, w / 2 - 100, zeminY - 155, 200, 171);
    }
    if (f.t > 2.4) {
      raporaGec("Fırlatma kazası",
        "Pencere dışında ateşledin. Araç güvenilirliği kadar talih de gerekirdi; küçük araç hızlı pencere taşır, büyük araç affedicidir.",
        "firlatma");
      return;
    }
  }

  // zamanlama göstergesi
  const gY = 84, gX0 = 90, gX1 = w - 90;
  ctx.fillStyle = "#23252F";
  ctx.fillRect(gX0 - 6, gY - 24, gX1 - gX0 + 12, 48);
  const yari = G.arac.pencere / 2;
  const cX = gX0 + (gX1 - gX0) * f.merkez;
  const kW = (gX1 - gX0) * yari;
  ctx.fillStyle = "rgba(242,193,48,0.4)";
  ctx.fillRect(cX - kW, gY - 24, kW * 2, 48);
  ctx.fillStyle = "#F2C130";
  ctx.fillRect(cX - kW * 0.3, gY - 24, kW * 0.6, 48);
  let konum = 0.5;
  if (f.durum === "canli") {
    const hiz = 0.9 / G.arac.pencere;
    konum = 0.5 + 0.45 * Math.sin(f.t * hiz);
  } else if (f.hamle !== null && f.durum !== "hazir") {
    konum = f.hamle;
  }
  const iX = gX0 + (gX1 - gX0) * konum;
  ctx.fillStyle = "#EDE7D6";
  ctx.fillRect(iX - 2, gY - 32, 4, 64);
  etiket(ctx, "fırlatma penceresi", (gX0 + gX1) / 2, gY + 44);
}

/* ============ SEYİR ============ */
function seyireGec() {
  ekranAc("seyir");
  const s = G.seyir;
  s.t = 0; s.durum = "bekleme"; s.guvence = false;
  $("#seyir-karar-metin").textContent =
    G.yakit > 26
      ? "Yakıt tankın dolu: iniş için bolca var; bir atışı da seyir için ayırabilirsin."
      : "Yakıt gergin: iniş için lazım — ama arabulucu atışı yapmazsan " + G.hedef.ad + " sana uzak kalır.";
  $("#seyir-karar").hidden = false;
  saatGuncelle("Dünya–" + G.hedef.ad + " seyri");
  kaynakGuncelle();
}

function seyirKarar(guvenceSecildi) {
  const s = G.seyir;
  logChallengeAction("seyir", { burn: guvenceSecildi === true });
  if (s.durum !== "bekleme") return;
  if (guvenceSecildi) {
    s.guvence = true;
    G.yakit = Math.max(0, G.yakit - 3);
  }
  const rizika = s.guvence ? 0.02 : 0.20;
  $("#seyir-karar").hidden = true;
  kaynakGuncelle();
  if (rng() < rizika) {
    s.durum = "patlak";
    ses("hata");
    saatGuncelle("seyir kaybı");
  } else {
    s.durum = "ucus";
    ses("firlat");
  }
}

function seyirCiz(dt) {
  const c = $("#seyir-kanvas");
  const ctx = c.getContext("2d");
  const w = c.width, h = c.height;
  const s = G.seyir;
  s.t += dt;
  yildizOrgu(ctx, w, h);
  const transfer = s.durum === "transfer";
  const ilerleme = (s.durum === "ucus" || transfer) ? sinir(0, s.t / (transfer ? 4.6 : 5), 1) : 0.04;

  const dIm = resim("dunya");
  if (dIm && dIm.complete) {
    const x = 100 - ilerleme * 240;
    const boy = 120 - ilerleme * 44;
    ctx.drawImage(dIm, x, h / 2 - 34 - boy / 2, boy, boy * (dIm.naturalHeight / dIm.naturalWidth));
  }
  const aIm = resim(G.hedef.anahtar);
  if (aIm && aIm.complete) {
    const x = w - 88 + ilerleme * 30;
    const boy = 80 + ilerleme * 72;
    ctx.drawImage(aIm, x, h / 2 - boy / 2, boy, boy * (aIm.naturalHeight / aIm.naturalWidth));
    etiket(ctx, G.hedef.ad, x + boy / 2, h / 2 + boy / 2 + 18);
  }
  const pIm = resim(G.arac.anahtar);
  if (pIm && pIm.complete) {
    const x = w / 2 - 16 + Math.sin(s.t * 1.8) * 12;
    const y = h / 2 - 30 - ilerleme * 40;
    const boy = 58, g = boy * (pIm.naturalWidth / pIm.naturalHeight);
    ctx.drawImage(pIm, x, y, g, boy);
    panelKanatlari(ctx, x + g / 2, g, y + boy, boy);
    if (s.durum === "ucus" || transfer) {
      ctx.fillStyle = "#F2C130";
      ctx.beginPath();
      ctx.moveTo(x + g / 2 - 4, y + boy - 6);
      ctx.lineTo(x + g / 2 + 4, y + boy - 6);
      ctx.lineTo(x + g / 2, y + boy + 14 + rng() * 8);
      ctx.fill();
    }
  }
  if (transfer) etiket(ctx, "gezegenler arası uçuş · " + G.hedef.ad, w / 2, 52);
  if (s.durum === "patlak") {
    const p = resim("patlama");
    if (p && p.complete) ctx.drawImage(p, w / 2 - 86, h / 2 - 100, 172, 147);
    if (s.t > 2.4) {
      raporaGec("Seyir kaybı",
        "Yakıt ayırmadın; seyir düzeltmesi yapılamadı ve araç " + G.hedef.ad + " çekim alanında yörüngeden çıktı.",
        "seyir");
      return;
    }
  }

  if ((s.durum === "ucus" && s.t > 5.2) || (transfer && s.t > 4.7)) iniseGec();
}

/* ============ İNİŞ ============ */
const inisTuslari = { itki: false, yarim: false, sol: false, sag: false };

function iniseGec() {
  ekranAc("inis");
  const i = G.inis;
  i.durum = "inis"; i.hassasiyet = 0; i.sayac = 0;
  i.pad = rast(180, 700);
  i.lander = {
    x: rast(140, 700), y: -70,
    vx: rast(-26, 26), vy: rast(12, 28),
    yakit: G.yakit, itus: G.modul.itus,
  };
  saatGuncelle(G.hedef.ad + " inişi — canlı telemetri");
  kaynakGuncelle();
}

function inisTusKur() {
  const c = $("#inis-kanvas");
  const inisKeyLog = ["Space","ArrowUp","KeyW","KeyS","ArrowDown","ArrowLeft","KeyA","ArrowRight","KeyD"];
  document.addEventListener("keydown", (e) => {
    if (G.faz !== "inis") return;
    if (inisKeyLog.includes(e.code)) logChallengeAction("inisKey", { key: e.code, down: true });
    if (e.code === "Space" || e.code === "KeyW" || e.key === "ArrowUp") { e.preventDefault(); if (!e.repeat) { sesAc(); inisTuslari.itki = true; } }
    else if (e.code === "KeyS" || e.key === "ArrowDown") { e.preventDefault(); if (!e.repeat) { sesAc(); inisTuslari.yarim = true; } }
    else if (e.key === "ArrowLeft" || e.code === "KeyA") { e.preventDefault(); inisTuslari.sol = true; }
    else if (e.key === "ArrowRight" || e.code === "KeyD") { e.preventDefault(); inisTuslari.sag = true; }
  });
  document.addEventListener("keyup", (e) => {
    const inisKeyLog = ["Space","ArrowUp","KeyW","KeyS","ArrowDown","ArrowLeft","KeyA","ArrowRight","KeyD"];
    if (inisKeyLog.includes(e.code)) logChallengeAction("inisKey", { key: e.code, down: false });
    if (e.code === "Space" || e.code === "KeyW" || e.key === "ArrowUp") inisTuslari.itki = false;
    else if (e.code === "KeyS" || e.key === "ArrowDown") inisTuslari.yarim = false;
    else if (e.key === "ArrowLeft" || e.code === "KeyA") inisTuslari.sol = false;
    else if (e.key === "ArrowRight" || e.code === "KeyD") inisTuslari.sag = false;
  });
  c.addEventListener("pointerdown", (e) => {
    e.preventDefault(); sesAc();
    const kutu = c.getBoundingClientRect();
    const oran = (e.clientX - kutu.left) / kutu.width;
    inisTuslari.itki = true;
    inisTuslari.yarim = false;
    inisTuslari.sol = inisTuslari.sag = false;
    if (oran < 0.42) inisTuslari.sol = true;
    if (oran > 0.58) inisTuslari.sag = true;
  });
  c.addEventListener("pointerup", () => { inisTuslari.itki = inisTuslari.yarim = inisTuslari.sol = inisTuslari.sag = false; });
  c.addEventListener("pointercancel", () => { inisTuslari.itki = inisTuslari.yarim = inisTuslari.sol = inisTuslari.sag = false; });
}

function inisCiz(dt) {
  const c = $("#inis-kanvas");
  const ctx = c.getContext("2d");
  const w = c.width, h = c.height;
  const i = G.inis;
  const L = i.lander;
  yildizOrgu(ctx, w, h);
  if (G.hedef.anahtar === "venus") {
    const vIm = resim("venus_bulut");
    if (vIm && vIm.complete) {
      ctx.globalAlpha = 0.88;
      ctx.drawImage(vIm, 0, 0, w, h * 0.45);
      ctx.globalAlpha = 1;
    }
  }
  const zeminY = h - 64;
  yuzeySeridi(ctx, zeminY, w, G.hedef.zemin);
  ctx.fillStyle = "#177E89";
  ctx.fillRect(i.pad - 60, zeminY - 5, 120, 5);
  etiket(ctx, "iniş bölgesi · " + G.hedef.ad, i.pad, zeminY + 26);
  const bIm = resim("bayrak");
  if (bIm && bIm.complete) ctx.drawImage(bIm, sinir(0, i.pad + 70, w - 46), zeminY - 58, 44, 46);

  if (!L) return;
  const im = resim("inis_aracı");
  const boy = 66;
  const g = im && im.complete && im.naturalWidth ? boy * (im.naturalWidth / im.naturalHeight) : boy;

  if (i.durum === "inis") {
    const cer = Math.min(dt, 0.05);
    const verim = G.yuzey.uretimler && G.yuzey.uretimler.has("motorAyar") ? 0.8 : 1;
    L.vy += G.hedef.cekim * cer;            // hedef gök cisminin çekimi
    let itkiGucu = 0;
    if (inisTuslari.itki && L.yakit > 0) itkiGucu = 1;
    else if (inisTuslari.yarim && L.yakit > 0) itkiGucu = 0.5;
    if (itkiGucu > 0) {
      L.vy -= L.itus * itkiGucu * cer;
      L.yakit = Math.max(0, L.yakit - 7 * itkiGucu * cer * verim);
    }
    if (inisTuslari.sol && L.yakit > 0) { L.vx -= L.itus * 0.32 * cer; L.yakit = Math.max(0, L.yakit - 2.5 * cer * verim); }
    if (inisTuslari.sag && L.yakit > 0) { L.vx += L.itus * 0.32 * cer; L.yakit = Math.max(0, L.yakit - 2.5 * cer * verim); }
    L.x += L.vx * cer;
    L.y += L.vy * cer;
    L.x = sinir(12, L.x, w - 12 - g);

    if (L.y + boy >= zeminY) {
      L.y = zeminY - boy;
      if (Math.abs(L.vy) <= 62 && Math.abs(L.vx) <= 26) {
        i.durum = "basarili";
        i.hassasiyet = sinir(0, 1 - Math.abs(L.x + g / 2 - i.pad) / 170, 1);
        G.yakit = L.yakit;
        ses("onay");
        saatGuncelle("iniş tamam — ayakta");
        L.vy = 0; L.vx = 0;
      } else {
        i.durum = "kaza";
        i.sayac = 0;
        ses("hata");
        saatGuncelle("iniş kazası");
      }
    }
    $("#inis-vy").textContent = Math.abs(Math.round(L.vy * 0.4));
    $("#inis-vx").textContent = Math.abs(Math.round(L.vx * 0.4));
    $("#inis-yakit").textContent = Math.round(L.yakit);
  }

  if (i.durum !== "kaza" && im && im.complete) {
    ctx.drawImage(im, L.x, L.y, g, boy);
    if (i.durum === "inis" && (inisTuslari.itki || inisTuslari.yarim) && L.yakit > 0) {
      ctx.fillStyle = "#F2C130";
      ctx.beginPath();
      ctx.moveTo(L.x + g / 2 - 7, L.y + boy - 18);
      ctx.lineTo(L.x + g / 2 + 7, L.y + boy - 18);
      ctx.lineTo(L.x + g / 2, L.y + boy + 16 + rng() * 10);
      ctx.fill();
    }
  }
  if (i.durum === "kaza") {
    i.sayac += dt;
    const p = resim("patlama");
    if (p && p.complete && i.sayac > 0.25) ctx.drawImage(p, L.x - 62, zeminY - 150, 180, 154);
    if (i.sayac > 2.2) {
      const nedenler = [];
      if (Math.abs(L.vy) > 62) nedenler.push("düşüş hızı " + Math.abs(Math.round(L.vy * 0.4)) + " m/s (sınır 25)");
      if (Math.abs(L.vx) > 26) nedenler.push("yan hız " + Math.abs(Math.round(L.vx * 0.4)) + " m/s (sınır 10)");
      if (L.yakit === 0) nedenler.push("yakıt tamamen bitti — motor sustu");
      raporaGec("İniş kazası", nedenler.join("; ") + ".", "inis");
      return;
    }
  }
  if (i.durum === "basarili") {
    i.sayac += dt;
    if (i.sayac > 1.4) yuzeyeGec();
  }
}

/* ============ ROVER ============ */
const YUZEY_DUNYA_GENISLIK = 2600;
const YUZEY_US_X = 300;
const roverTuslari = { sol: false, sag: false };

function roverHazirla() {
  const y = G.yuzey;
  const bonus = y.uretimler && y.uretimler.has("roverPil") ? 30 : 0;
  const kap = 60 + bonus;
  y.rover = { x: YUZEY_US_X + 150, pil: kap, pilKap: kap, veri: 0, mesafe: 0, yon: 1, hiz: 0 };
  y.dugumler = [];
  const tipler = ["veri", "veri", "veri", "pil", "pil", "pil", "metal", "metal", "kristal", "kristal", "buz", "buz"];
  tipler.forEach((t) => roverDugumEkle(t));
  roverHudYaz();
  kaynakHudYaz();
}

function roverDugumEkle(tip) {
  const y = G.yuzey;
  if (!y.rover) return;
  let x = rast(420, YUZEY_DUNYA_GENISLIK - 120);
  if (y.dugumler.some((d) => !d.alindi && Math.abs(d.x - x) < 130)) {
    x = sinir(420, x + 240, YUZEY_DUNYA_GENISLIK - 120);
  }
  const aralik = {
    veri: [6, 12], pil: [18, 30], metal: [1, 3], kristal: [1, 2], buz: [1, 2],
  }[tip] || [1, 2];
  y.dugumler.push({
    id: y.dugumler.length + "-" + Math.round(x),
    tip: tip,
    x: x,
    alindi: false,
    deger: Math.round(rast(aralik[0], aralik[1])),
  });
}

function roverKurtarmaVar() {
  const y = G.yuzey;
  return Boolean(y.rover && y.rover.pil > 0 && y.dugumler.some((d) => !d.alindi && d.tip === "pil"));
}

function roverDurumYaz(metin) {
  const el = $("#rover-durum");
  if (el) el.textContent = metin;
}

function roverHudYaz() {
  const y = G.yuzey;
  const r = y.rover;
  const hud = $("#rover-hud");
  if (!hud || !r) return;
  hud.textContent = "Rover · pil " + Math.round(r.pil) + "/" + r.pilKap +
    " · veri " + r.veri + " · " + Math.round(r.mesafe) + " m · gezegen " + y.gezegenSayisi;
}

function kaynakHudYaz() {
  const el = $("#kaynak-hud");
  if (!el) return;
  const k = G.yuzey.kaynaklar || {};
  el.textContent = "Kaynaklar · metal " + (k.metal || 0) + " · kristal " + (k.kristal || 0) + " · buz " + (k.buz || 0);
}

function roverDugumTopla() {
  const y = G.yuzey;
  const r = y.rover;
  if (!r) return;
  if (!y.kaynaklar) y.kaynaklar = { metal: 0, kristal: 0, buz: 0 };
  y.dugumler.forEach((d) => {
    if (d.alindi || Math.abs(d.x - r.x) > 48) return;
    d.alindi = true;
    if (d.tip === "veri") {
      y.tampon += d.deger;
      r.veri += d.deger;
      roverDurumYaz("Veri örneği toplandı: +" + d.deger + " birim tampon.");
    } else if (d.tip === "pil") {
      const roverSarz = Math.round(d.deger * 0.6);
      y.pil = sinir(0, y.pil + d.deger, y.pilKap);
      r.pil = sinir(0, r.pil + roverSarz, r.pilKap);
      roverDurumYaz("Güç hücresi toplandı: üs +" + d.deger + ", rover +" + roverSarz + ".");
      if (y.pilBitti && y.pil > 0) {
        y.pilBitti = false;
        const btn = $("#btn-sol-basyaz");
        if (btn) btn.disabled = false;
        roverDurumYaz("GÜÇ GERİ GELDİ — üs yeniden açıldı, söl devam edebilir.");
      }
    } else {
      const kaynak = KAYNAKLAR[d.tip];
      if (!kaynak) return;
      y.kaynaklar[d.tip] = (y.kaynaklar[d.tip] || 0) + d.deger;
      roverDurumYaz(kaynak.ad + " toplandı: +" + d.deger + " · atölyede kullan.");
      kaynakHudYaz();
      if (atolyeAcikMi()) atolyeCiz();
    }
    ses("onay");
  });
}

function kaynakYeter(maliyet) {
  const k = G.yuzey.kaynaklar || {};
  return Object.keys(maliyet).every((a) => (k[a] || 0) >= maliyet[a]);
}

function kaynakHarca(maliyet) {
  const k = G.yuzey.kaynaklar || (G.yuzey.kaynaklar = { metal: 0, kristal: 0, buz: 0 });
  Object.keys(maliyet).forEach((a) => { k[a] = Math.max(0, (k[a] || 0) - maliyet[a]); });
}

function gucGeriGeldi() {
  const y = G.yuzey;
  if (y.pilBitti && y.pil > 0) {
    y.pilBitti = false;
    const btn = $("#btn-sol-basyaz");
    if (btn) btn.disabled = false;
  }
}

function uretimYap(anahtar) {
  const y = G.yuzey;
  if (G.faz !== "yuzey" || y.bitti) return;
  const u = URETIMLER.find((x) => x.anahtar === anahtar);
  if (!u) return;
  const kurulu = y.uretimler && y.uretimler.has(anahtar);
  if (kurulu && !u.tekrar) { roverDurumYaz(u.ad + " zaten kurulu."); ses("tik"); return; }
  if (!kaynakYeter(u.maliyet)) { roverDurumYaz(u.ad + " için kaynak yetersiz."); ses("hata"); return; }
  logChallengeAction("uretim", { anahtar: anahtar });
  kaynakHarca(u.maliyet);
  if (!y.uretimler) y.uretimler = new Set();
  y.uretimler.add(anahtar);
  const r = y.rover;
  if (anahtar === "yedekPil") {
    y.pil = sinir(0, y.pil + 25, y.pilKap);
    if (r) r.pil = sinir(0, r.pil + 20, r.pilKap);
    gucGeriGeldi();
    roverDurumYaz("Yedek pil takıldı: üs +25, rover +20.");
  } else if (anahtar === "roverPil") {
    if (r) { r.pilKap += 30; r.pil = r.pilKap; }
    roverDurumYaz("Rover pil kapasitesi +30 — tam şarj.");
  } else if (anahtar === "motorAyar") {
    roverDurumYaz("Motor ayarı yapıldı: iniş yakıt tüketimi %20 azaldı.");
  } else if (anahtar === "donusturucu") {
    roverDurumYaz("Yakıt dönüştürücü kuruldu: atölyeden yakıt üret.");
  }
  ses("onay");
  kaynakHudYaz();
  roverHudYaz();
  yuzeyCiz();
  atolyeCiz();
  kaynakGuncelle();
}

function yakitUret() {
  const y = G.yuzey;
  if (G.faz !== "yuzey" || y.bitti) return;
  if (!y.uretimler || !y.uretimler.has("donusturucu")) {
    roverDurumYaz("Önce yakıt dönüştürücü kur.");
    ses("hata");
    return;
  }
  if (!kaynakYeter({ buz: 1, metal: 1 })) {
    roverDurumYaz("Yakıt üretmek için 1 buz + 1 metal gerekli.");
    ses("hata");
    return;
  }
  logChallengeAction("yakitUret", {});
  kaynakHarca({ buz: 1, metal: 1 });
  G.yakit += 4;
  roverDurumYaz("Dönüştürücü çalıştı: +4 yakıt.");
  ses("onay");
  kaynakHudYaz();
  yuzeyCiz();
  atolyeCiz();
  kaynakGuncelle();
}

function atolyeAcikMi() {
  const pop = $("#atolye-popup");
  return Boolean(pop && !pop.hidden);
}

function atolyePopupAc(ac) {
  const pop = $("#atolye-popup");
  if (!pop) return;
  if (ac) atolyeCiz();
  pop.hidden = !ac;
}

function atolyeCiz() {
  const envanter = $("#atolye-envanter");
  const liste = $("#atolye-liste");
  if (!envanter || !liste) return;
  const y = G.yuzey;
  const k = y.kaynaklar || {};
  envanter.innerHTML = Object.keys(KAYNAKLAR).map((a) => {
    const x = KAYNAKLAR[a];
    return '<span class="kaynak-pill"><span class="kaynak-ikon ikon-' + a +
      '" style="--kaynak-renk:' + x.renk + '"></span>' + x.ad + " <b>" + (k[a] || 0) + "</b></span>";
  }).join("");
  const uretimler = y.uretimler || new Set();
  liste.innerHTML = "";
  URETIMLER.forEach((u) => {
    const kurulu = uretimler.has(u.anahtar);
    const bitti = kurulu && !u.tekrar;
    const yeter = kaynakYeter(u.maliyet);
    const kart = document.createElement("div");
    kart.className = "uretim-kart" + (bitti ? " kurulu" : "");
    const malzeme = Object.keys(u.maliyet).map((a) => {
      const ad = KAYNAKLAR[a].ad;
      const gerek = u.maliyet[a];
      const mevcut = k[a] || 0;
      return '<span class="maliyet' + (mevcut < gerek ? " eksik" : "") + '">' + ad + " ×" + gerek + "</span>";
    }).join("");
    kart.innerHTML =
      '<span class="uretim-ikon ikon-' + u.anahtar + '"></span>' +
      '<div class="uretim-metin"><b>' + u.ad + "</b><span>" + u.aciklama + "</span>" +
      '<span class="uretim-maliyet">' + malzeme + "</span></div>" +
      '<button class="btn uretim-btn" type="button"' + (bitti || !yeter ? " disabled" : "") + ">" +
      (bitti ? "kuruldu" : "üret") + "</button>";
    const btn = kart.querySelector("button");
    if (btn) btn.addEventListener("click", () => { sesAc(); uretimYap(u.anahtar); });
    liste.appendChild(kart);
  });
  const don = $("#atolye-donusturucu");
  if (don) {
    don.hidden = !uretimler.has("donusturucu");
    const b = $("#btn-yakit-uret");
    if (b) b.disabled = !kaynakYeter({ buz: 1, metal: 1 });
  }
}

function roverGuncelle(dt) {
  const y = G.yuzey;
  const r = y.rover;
  if (!r || y.bitti) return;
  let yon = 0;
  if (roverTuslari.sol) yon -= 1;
  if (roverTuslari.sag) yon += 1;
  if (yon !== 0 && r.pil > 0) {
    r.yon = yon;
    r.hiz = yon * 150;
    r.x = sinir(60, r.x + r.hiz * dt, YUZEY_DUNYA_GENISLIK - 60);
    const uzayTuketim = (y.uzayHawa && y.uzayHawa.olay === "SEP") ? 3.2 : 2.2;
    r.pil = Math.max(0, r.pil - uzayTuketim * dt);
    r.mesafe += Math.abs(r.hiz * dt);
    roverDugumTopla();
    if (r.pil <= 0) {
      roverDurumYaz("ROVER PİLİ BİTTİ — güç hücresi toplamak için enerji kalmadı.");
      if (y.pil <= 0.001 && y.tampon <= 0 && !y.bitti) {
        y.bitti = true;
        raporYuzeyden("Enerji tükendi", "Rover pili ve üs pili bitti; yüzey keşfi durdu.");
      }
    }
  } else {
    r.hiz = 0;
  }
}

function roverTusKur() {
  const tuslar = ["ArrowLeft", "KeyA", "ArrowRight", "KeyD"];
  document.addEventListener("keydown", (e) => {
    if (G.faz !== "yuzey" || !tuslar.includes(e.code)) return;
    const pop = $("#gezegen-popup");
    const atolye = $("#atolye-popup");
    if ((pop && !pop.hidden) || (atolye && !atolye.hidden)) return;
    e.preventDefault();
    if (e.repeat) return;
    logChallengeAction("roverKey", { key: e.code, down: true });
    sesAc();
    if (e.code === "ArrowLeft" || e.code === "KeyA") roverTuslari.sol = true;
    else roverTuslari.sag = true;
  });
  document.addEventListener("keyup", (e) => {
    if (!tuslar.includes(e.code)) return;
    logChallengeAction("roverKey", { key: e.code, down: false });
    if (e.code === "ArrowLeft" || e.code === "KeyA") roverTuslari.sol = false;
    else if (e.code === "ArrowRight" || e.code === "KeyD") roverTuslari.sag = false;
  });
  const bas = (id, yon) => {
    const b = $(id);
    if (!b) return;
    const ac = (e) => { e.preventDefault(); sesAc(); roverTuslari[yon] = true; };
    const kapa = () => { roverTuslari[yon] = false; };
    b.addEventListener("pointerdown", ac);
    b.addEventListener("pointerup", kapa);
    b.addEventListener("pointercancel", kapa);
    b.addEventListener("pointerleave", kapa);
  };
  bas("#btn-rover-sol", "sol");
  bas("#btn-rover-sag", "sag");
}

function yuzeyGuncelle(dt) {
  if (G.faz !== "yuzey") return;
  roverGuncelle(dt);
}

/* ============ YÜZEY ============ */
function yuzeyeGec() {
  ekranAc("yuzey");
  const y = G.yuzey;
  const devam = y.devam === true;
  const onceki = {
    sol: y.sol, bilim: y.bilim, iletilen: y.iletilen, geceler: y.geceler,
    gezegenSayisi: y.gezegenSayisi,
    kaynaklar: y.kaynaklar || { metal: 0, kristal: 0, buz: 0 },
    uretimler: y.uretimler || new Set(),
  };
  y.tampon = 0;
  y.gunesKesik = false;
  y.bitti = false;
  y.pilBitti = false;
  y.bayrakDikildi = false;
  y.antenArizasi = false;
  y.kesintisiz = 0;
  if (devam) {
    y.sol = onceki.sol;
    y.bilim = onceki.bilim + 8;
    y.iletilen = onceki.iletilen;
    y.geceler = onceki.geceler;
    y.gezegenSayisi = (onceki.gezegenSayisi || 1) + 1;
    y.kaynaklar = onceki.kaynaklar;
    y.uretimler = onceki.uretimler;
  } else {
    y.sol = 1; y.bilim = 0; y.iletilen = 0; y.geceler = 0; y.gezegenSayisi = 1;
    y.kaynaklar = { metal: 0, kristal: 0, buz: 0 };
    y.uretimler = new Set();
  }
  y.devam = false;
  y.pilKap = 30; // araç bataryası
  G.donanim.forEach(a => {
    const d = DONANIM.find(x => x.anahtar === a);
    if (d && d.kapasite) y.pilKap += d.kapasite;
  });
  const kapCarpan = modDeger("kapasiteCarpan");
  if (kapCarpan) y.pilKap = Math.round(y.pilKap * kapCarpan);
  y.pil = y.pilKap * 0.8;
  y.aktif = new Set(
    [...G.donanim].filter(a => {
      const d = DONANIM.find(x => x.anahtar === a);
      return d && d.bilim;
    })
  );
  roverHazirla();
  $("#btn-sol-basyaz").disabled = false;
  yuzeyGecisleriKur();
  yuzeyCiz();
  if (devam) {
    $("#yuzey-gunluk").textContent = G.hedef.ad + " yüzeyine indin. Keşif bonusu +8 bilim. Rover ile yeni veri, güç ve kaynak topla; atölyede üretim yap.";
    roverDurumYaz("Yeni gezegen: " + G.hedef.ad + " — rover hazır.");
  } else {
    $("#yuzey-gunluk").textContent = "Yüzeye sağ çıktın. Cihazları aç, sölü başlat, veriyi zamanında ilet. Rover ile kaynak toplayıp atölyede roketini güçlendir.";
    roverDurumYaz("Rover hazır — yüzeyde veri, güç ve kaynak ara.");
  }
  kaynakHudYaz();
  saatGuncelle("Söl " + y.sol + " / " + misyonSols());
  kaynakGuncelle();
}

function misyonSols() {
  return G.brif ? G.brif.sols : 10;
}

function yuzeyGecisleriKur() {
  const kap = $("#cihaz-gecisleri");
  kap.innerHTML = "";
  const bilimler = DONANIM.filter(d => d.bilim && G.donanim.has(d.anahtar));
  if (bilimler.length === 0) {
    const p = document.createElement("p");
    p.className = "not";
    p.textContent = "Çalışacak bilim cihazı yok — tasarım fazında bilim yükü seçmelisin.";
    kap.appendChild(p);
    return;
  }
  bilimler.forEach(d => {
    const li = document.createElement("label");
    li.className = "cihaz-satir";
    li.innerHTML =
      '<span class="dolap"><input type="checkbox" data-cihaz="' + d.anahtar +
      '" aria-label="' + d.ad + '"></span>' +
      '<img src="' + d.img + '" alt="">' +
      "<span>" + d.ad + " <i class='tabular' style='font-size:10px;color:var(--murekkep-2)'>−" +
      d.guc + "/söl · +" + d.bilim + "</i></span>";
    const kutu = li.querySelector("input");
    kutu.checked = y_aktifMi(d.anahtar);
    kutu.parentElement.classList.toggle("isaretli", kutu.checked);
    kutu.addEventListener("change", () => {
      if (kutu.checked) G.yuzey.aktif.add(d.anahtar); else G.yuzey.aktif.delete(d.anahtar);
      kutu.parentElement.classList.toggle("isaretli", kutu.checked);
      ses("tik");
    });
    kap.appendChild(li);
  });
}

function y_aktifMi(anahtar) { return G.yuzey.aktif.has(anahtar); }

function yuzeyCiz() {
  const c = $("#yuzey-kanvas");
  const ctx = c.getContext("2d");
  const w = c.width, h = c.height;
  const y = G.yuzey;
  const r = y.rover;
  yildizOrgu(ctx, w, h);
  const zeminY = h - 62;
  const kamera = r ? sinir(0, r.x - w * 0.38, YUZEY_DUNYA_GENISLIK - w) : 0;
  yuzeySeridi(ctx, zeminY, w, G.hedef.zemin, kamera);

  if (G.hedef.anahtar === "venus") {
    const vIm = resim("venus_bulut");
    if (vIm && vIm.complete) {
      ctx.globalAlpha = 0.75;
      ctx.drawImage(vIm, 0, 0, w, h * 0.38);
      ctx.globalAlpha = 1;
    }
  }

  const dIm = resim("dunya");
  if (dIm && dIm.complete) ctx.drawImage(dIm, 56, 26, 48, 48);

  const usX = YUZEY_US_X - kamera;
  if (usX > -280 && usX < w + 240) {
    const m = resim("inis_aracı");
    if (m && m.complete) ctx.drawImage(m, usX - 70, zeminY - 96, 62, 86);

    const bIm = resim("bayrak");
    if (y.bayrakDikildi && bIm && bIm.complete) ctx.drawImage(bIm, usX + 14, zeminY - 62, 38, 40);

    const cihazlar = DONANIM.filter(d =>
      G.donanim.has(d.anahtar) && !["bayrak", "pil", "panel", "anten_b", "anten_k"].includes(d.anahtar));
    cihazlar.forEach((d, i) => {
      const im = resim(d.anahtar);
      if (!(im && im.complete)) return;
      const boy = 64, g = Math.min(64, boy * (im.naturalWidth / im.naturalHeight));
      const x = usX - 250 + i * 76;
      ctx.globalAlpha = (y.aktif.has(d.anahtar) || !d.bilim) ? 1 : 0.4;
      ctx.drawImage(im, x, zeminY - boy, g, boy);
      ctx.globalAlpha = 1;
      etiket(ctx, d.ad.toLowerCase() + (y.aktif.has(d.anahtar) ? "" : " · kapalı"), x + g / 2, zeminY + 24);
    });

    const aIm = resim(G.donanim.has("anten_b") ? "anten_b" : (G.donanim.has("anten_k") ? "anten_k" : null));
    if (aIm && aIm.complete) {
      const boy = 74, g = boy * (aIm.naturalWidth / aIm.naturalHeight);
      ctx.drawImage(aIm, usX + 130, zeminY - boy, g, boy);
      etiket(ctx, (G.donanim.has("anten_b") ? "büyük" : "küçük") + " anten", usX + 150 + g / 2 - 20, zeminY + 24);
    }
    const pIm = resim("panel");
    if (G.donanim.has("panel") && pIm && pIm.complete) {
      ctx.drawImage(pIm, usX - 170, zeminY - 70, 84, 63);
    }
    etiket(ctx, "üs · " + G.hedef.ad, usX, zeminY + 24);
  }

  (y.dugumler || []).forEach((d) => {
    if (d.alindi) return;
    const x = d.x - kamera;
    if (x < -40 || x > w + 40) return;
    if (d.tip === "pil") {
      const im = resim("pil");
      if (im && im.complete) {
        const boy = 30, g = boy * (im.naturalWidth / im.naturalHeight);
        ctx.drawImage(im, x - g / 2, zeminY - boy - 6, g, boy);
      }
      etiket(ctx, "güç +" + d.deger, x, zeminY + 18);
    } else if (d.tip === "veri") {
      ctx.fillStyle = "#4ad0e3";
      ctx.beginPath();
      ctx.moveTo(x, zeminY - 44);
      ctx.lineTo(x + 13, zeminY - 27);
      ctx.lineTo(x, zeminY - 10);
      ctx.lineTo(x - 13, zeminY - 27);
      ctx.closePath();
      ctx.fill();
      etiket(ctx, "veri +" + d.deger, x, zeminY + 18);
    } else {
      const kaynak = KAYNAKLAR[d.tip];
      if (!kaynak) return;
      const im = resim("kaynak_" + d.tip);
      if (im && im.complete && im.naturalWidth) {
        const boy = 30, g = boy * (im.naturalWidth / im.naturalHeight);
        ctx.drawImage(im, x - g / 2, zeminY - boy - 6, g, boy);
      } else {
        ctx.fillStyle = kaynak.renk;
        if (d.tip === "metal") {
          ctx.fillRect(x - 12, zeminY - 38, 24, 24);
        } else {
          ctx.beginPath();
          if (d.tip === "buz") {
            ctx.moveTo(x, zeminY - 42);
            ctx.lineTo(x + 15, zeminY - 12);
            ctx.lineTo(x - 15, zeminY - 12);
            ctx.closePath();
          } else {
            ctx.moveTo(x, zeminY - 42);
            ctx.lineTo(x + 13, zeminY - 26);
            ctx.lineTo(x, zeminY - 10);
            ctx.lineTo(x - 13, zeminY - 26);
            ctx.closePath();
          }
          ctx.fill();
        }
      }
      etiket(ctx, kaynak.ad.toLowerCase() + " +" + d.deger, x, zeminY + 18);
    }
  });

  if (r) {
    const rx = r.x - kamera;
    const rIm = resim("mars_rover");
    if (rIm && rIm.complete) {
      const boy = 58, g = boy * (rIm.naturalWidth / rIm.naturalHeight);
      ctx.save();
      if (r.yon < 0) {
        ctx.translate(rx, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(rIm, -g / 2, zeminY - boy, g, boy);
      } else {
        ctx.drawImage(rIm, rx - g / 2, zeminY - boy, g, boy);
      }
      ctx.restore();
    } else {
      ctx.fillStyle = "#C0392B";
      ctx.fillRect(rx - 20, zeminY - 26, 40, 20);
    }
    etiket(ctx, "rover · " + Math.round(r.pil) + " pil", rx, zeminY + 24);
  }

  yuzeyOzetYaz();
}

function yuzeyOzetYaz() {
  const y = G.yuzey;
  const toplamSol = misyonSols();
  const gunduzMu = (y.sol - 1) % 6 !== 5;
  const calisan = [...y.aktif].map(a => (DONANIM.find(d => d.anahtar === a) || {}).ad).join(", ");
  $("#yuzey-gunosu").textContent = "Söl " + Math.min(y.sol, toplamSol) + " / " + toplamSol +
    (gunduzMu ? " — güneş açık" : " — " + G.hedef.ad.toUpperCase() + " GECESİ (panel çalışmaz)");
  $("#yuzey-ozet").textContent =
    "Cihazlar: " + (calisan || "yok") + " · tampon " + say(y.tampon, 0) + " birim" +
    (y.gunesKesik ? " · GÜNEŞ KESİNTİSİ" : "") +
    (y.antenArizasi ? " · ANTEN ARIZALI" : "");
  const oran = y.pilKap ? sinir(0, y.pil / y.pilKap, 1) : 0;
  const cubuk = $("#yuzey-pil");
  cubuk.style.transform = "scaleX(" + oran.toFixed(3) + ")";
  cubuk.classList.toggle("boscak", oran < 0.25);
  $("#yuzey-pil-yazi").textContent = say(y.pil, 0) + " / " + say(y.pilKap, 0) + " birim";
  const brifSatir = $("#yuzey-brif");
  if (brifSatir && G.brif) {
    const d = brifDurumu();
    brifSatir.textContent = "Brifing · " + G.brif.ad + " — " + d.metin + (d.basarili ? " ✓" : "");
    brifSatir.classList.toggle("tamam", d.basarili);
  }
  roverHudYaz();
  const uzEl = $("#uzay-hava");
  if (uzEl) {
    if (y.uzayHawa) { uzEl.textContent = "Uzay hava: " + y.uzayHawa.mesaj; uzEl.classList.add("aktif"); }
    else { uzEl.textContent = "Uzay hava: sakin"; uzEl.classList.remove("aktif"); }
  }
}

function solYurut() {
  logChallengeAction("sol", {});
  const y = G.yuzey;
  if (y.bitti || y.pilBitti) return;
  const gunluk = [];
  const gunduzMu = (y.sol - 1) % 6 !== 5;
  let geceMi = false;
  const kesikMi = y.gunesKesik;
  y.gunesKesik = false;
  y.antenArizasi = false;
  let hasat = 0;
  if (gunduzMu && !kesikMi) {
    G.donanim.forEach(a => {
      const d = DONANIM.find(x => x.anahtar === a);
      if (d && d.uretim) hasat += d.uretim;
    });
    const carpan = modDeger("hasatCarpan");
    if (carpan) hasat = Math.round(hasat * carpan);
    const uzayCarpan = y.uzayHawaCarpan || 1;
    if (uzayCarpan !== 1) hasat = Math.round(hasat * uzayCarpan);
    const eksik = modDeger("hasatEksik");
    if (eksik) hasat = Math.max(0, hasat - eksik);
  }
  if (hasat) { y.pil = sinir(0, y.pil + hasat, y.pilKap); gunluk.push("Panel +" + hasat + " birim şarj verdi."); }

  const cihazSayisi = y.aktif.size;
  let uretilen = 0, calisan = 0;
  [...y.aktif].forEach(a => {
    const d = DONANIM.find(x => x.anahtar === a);
    if (!d) return;
    if (y.pil >= d.guc) {
      y.pil -= d.guc;
      y.tampon += d.bilim;
      uretilen += d.bilim;
      calisan++;
    } else {
      gunluk.push(d.ad.toLowerCase() + " enerji yetmediğinden bu söl çalışamadı.");
      y.aktif.delete(a);
      const kutu = document.querySelector('input[data-cihaz="' + a + '"]');
      if (kutu) { kutu.checked = false; kutu.parentElement.classList.remove("isaretli"); }
    }
  });
  if (uretilen) gunluk.push("Cihazlar tampona +" + uretilen + " birim veri yazdı.");
  if (cihazSayisi > 0 && calisan === cihazSayisi) y.kesintisiz++;
  else y.kesintisiz = 0;

  const sakinMi = modDeger("sakin") !== null;
  const meteoritSans = sakinMi ? 0 : (modDeger("hasatCarpan") === 1.5 ? 0.20 : 0.10);
  const zar = rng();
  if (zar < meteoritSans) {
    y.pil = sinir(0, y.pil - 8, y.pilKap);
    gunluk.push("MİKROMETEORİT — pil −8 birim.");
  } else if (zar < meteoritSans + 0.07) {
    y.gunesKesik = true;
    gunluk.push("GÜNEŞ PATLAMASI — hasat bir söl boyu kesildi.");
  } else if (zar < meteoritSans + 0.13 && y.aktif.has("sismo")) {
    y.tampon += 4;
    gunluk.push("AY DEPREMİ — sismometre nadir kayıt, tampon +4.");
  } else if (zar < meteoritSans + 0.18) {
    y.pil = sinir(0, y.pil - 4, y.pilKap);
    gunluk.push("TOZ BULUTU — paneller kirlendi, pil −4 birim.");
  } else if (zar < meteoritSans + 0.22) {
    y.antenArizasi = true;
    gunluk.push("ANTEN ARIZASI — bu söl veri iletilemiyor.");
  } else if (zar < meteoritSans + 0.26) {
    y.pil = sinir(0, y.pil - 5, y.pilKap);
    gunluk.push("PİL SIZINTISI — pil −5 birim.");
  }

  if (!y.bayrakDikildi) {
    if (G.donanim.has("bayrak")) { y.bayrakDikildi = true; y.bilim += 2; gunluk.push("Bayrak dikildi (+2 bilim)."); }
  }

  if (!gunduzMu) geceMi = true;
  y.sol++;
  if (y.rover) {
    roverDugumEkle("veri");
    roverDugumEkle("pil");
    roverDugumEkle(["metal", "kristal", "buz"][(y.sol - 1) % 3]);
  }
  uzayHawaGuncelle();
  yuzeyCiz();
  $("#yuzey-gunluk").textContent = gunluk.join("\n") || "Söl sessiz geçti.";
  kaynakGuncelle();

  const toplamSol = misyonSols();
  if (geceMi && y.pil > 0.001) y.geceler++;
  if (y.sol > toplamSol) {
    y.bitti = true;
    raporYuzeyden(toplamSol + " söl tamamlandı", "Görev planının tamamı işletildi; kapsül raporu kapattı.");
  } else if (y.pil <= 0.001) {
    if (roverKurtarmaVar()) {
      y.pilBitti = true;
      $("#btn-sol-basyaz").disabled = true;
      $("#yuzey-gunluk").textContent += "\nPİL BOŞ — rover ile güç hücresi topla. Güç gelince üs yeniden açılır.";
      roverDurumYaz("Üs pili boşaldı — rover ile güç hücresi topla.");
    } else if (y.tampon > 0) {
      y.pilBitti = true;
      $("#btn-sol-basyaz").disabled = true;
      $("#yuzey-gunluk").textContent += "\nPİL BOŞ — enstrümanlar durdu. Son veriyi ilet; iletmek görevi kapatır.";
    } else {
      y.bitti = true;
      raporYuzeyden("Enerji tükendi", "Pil tamamen boşaldı, tamponda veri yoktu; kapsül kendini kapattı.");
    }
  }
  if (!y.bitti && !y.pilBitti) saatGuncelle("Söl " + y.sol + " / " + toplamSol);
}

function veriIlet() {
  logChallengeAction("veri", {});
  const y = G.yuzey;
  const guc = gucHesapla();
  if (!guc.link) {
    $("#yuzey-gunluk").textContent = "ANTEN YOK — veri Dünya'ya gönderilemiyor. Tasarım fazında bu bedel ödendi.";
    ses("hata");
    return;
  }
  if (y.antenArizasi) {
    $("#yuzey-gunluk").textContent = "ANTEN ARIZALI — bu söl iletim yok. Bir sonraki söle kadar bekle.";
    ses("hata");
    return;
  }
  if (y.tampon <= 0) { $("#yuzey-gunluk").textContent = "Tampondan veri çıkmaz — önce cihazları çalıştır."; ses("tik"); return; }
  let limit = guc.link;
  const karartma = modDeger("linkCarpan");
  const karartmaVar = karartma && y.sol % 3 === 0;
  if (karartmaVar) limit = Math.max(1, Math.round(limit * karartma));
  const giden = Math.min(y.tampon, limit);
  y.tampon -= giden;
  y.bilim += giden;
  y.iletilen += giden;
  const anten = G.donanim.has("anten_b") ? DONANIM.find(d => d.anahtar === "anten_b") : DONANIM.find(d => d.anahtar === "anten_k");
  if (anten && y.pil >= anten.guc) y.pil -= anten.guc;
  ses("onay");
  yuzeyCiz();
  $("#yuzey-gunluk").textContent = "DERİN UZAY AĞI: " + say(giden, 0) +
    " birim veri Dünya'ya iletildi" + (karartmaVar ? " (radyo karartması: yarı kapasite)" : "") +
    ". Tampon kalan " + say(y.tampon, 0) + ".";
  kaynakGuncelle();
  if (y.pilBitti && y.tampon <= 0) {
    y.bitti = true;
    raporYuzeyden("Enerji tükendi", "Pil bitti; son iletim yapıldı ve kapsül kendini kapattı.");
  }
}

/* ============ GEZEGENLER ARASI UÇUŞ ============ */
function transferMaliyeti(hedef) {
  if (!hedef) return 99;
  if (hedef.anahtar === "venus") return 8;
  if (hedef.anahtar === "merkur") return 6;
  if (hedef.anahtar === "mars") return 5;
  return 4;
}

function transferGucMaliyeti(hedef) {
  if (!hedef) return 99;
  if (hedef.anahtar === "venus") return 24;
  if (hedef.anahtar === "merkur") return 20;
  if (hedef.anahtar === "mars") return 18;
  return 15;
}

function gezegenListesiCiz() {
  const kap = $("#gezegen-liste");
  if (!kap) return;
  kap.innerHTML = "";
  HEDEFLER.forEach((h) => {
    const maliyet = transferMaliyeti(h);
    const gucMaliyet = transferGucMaliyeti(h);
    const ayni = G.hedef.anahtar === h.anahtar;
    const yeter = G.yakit >= maliyet && G.yuzey.pil >= gucMaliyet;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "gezegen-secim" + (ayni ? " secili" : "");
    b.disabled = ayni || !yeter;
    b.innerHTML =
      '<img src="' + h.img + '" alt="">' +
      '<span class="gezegen-metin"><b>' + h.ad + "</b>" +
      "<span>" + h.atmosfer + " atmosfer · çekim " + h.cekim + "</span>" +
      "<span>" + (ayni ? "şu an buradasın" : "yakıt −" + maliyet + " · güç −" + gucMaliyet + " · keşif +8 bilim") + "</span></span>";
    if (!ayni && !yeter) b.title = "Kaynak yetersiz — " + maliyet + " yakıt ve " + gucMaliyet + " üs gücü gerekli.";
    b.addEventListener("click", () => { sesAc(); ses("onay"); transferBaslat(h.anahtar); });
    kap.appendChild(b);
  });
}

function gezegenPopupAc(ac) {
  const pop = $("#gezegen-popup");
  if (!pop) return;
  if (ac) gezegenListesiCiz();
  pop.hidden = !ac;
}

function transferBaslat(anahtar) {
  const hedef = HEDEFLER.find((h) => h.anahtar === anahtar);
  if (!hedef || hedef.anahtar === G.hedef.anahtar) return;
  const maliyet = transferMaliyeti(hedef);
  const gucMaliyet = transferGucMaliyeti(hedef);
  if (G.yakit < maliyet) {
    roverDurumYaz("Yakıt yetersiz — " + hedef.ad + " için " + maliyet + " yakıt gerekli.");
    ses("hata");
    return;
  }
  if (G.yuzey.pil < gucMaliyet) {
    roverDurumYaz("Üs gücü yetersiz — rover ile güç hücresi toplayıp " + gucMaliyet + " birime ulaş.");
    ses("hata");
    return;
  }
  logChallengeAction("transfer", { anahtar: anahtar });
  G.yakit -= maliyet;
  G.yuzey.pil -= gucMaliyet;
  G.hedef = hedef;
  G.yuzey.devam = true;
  gezegenPopupAc(false);
  ekranAc("seyir");
  const s = G.seyir;
  s.t = 0;
  s.durum = "transfer";
  s.guvence = true;
  s.hedef = hedef;
  $("#seyir-karar").hidden = true;
  saatGuncelle(hedef.ad + " yolculuğu — " + maliyet + " yakıt, " + gucMaliyet + " güç harcandı");
  kaynakGuncelle();
}

function raporYuzeyden(baslik, ozet) {
  const y = G.yuzey;
  if (y.tampon > 0) y.bilim += Math.round(y.tampon * 0.5); // iletilmeyen verinin yarısı sayılır
  G.inis.durum = "bekleme";
  raporaGec(baslik, ozet, "yuzey");
}

function computeScore(kaynak) {
  if (kaynak === "firlatma") return { puan: 0, basarili: false };
  if (kaynak === "seyir") return { puan: G.firlatma.dogruluk * 20, basarili: false };
  if (kaynak === "inis") return { puan: G.firlatma.dogruluk * 20, basarili: false };
  let puan = G.firlatma.dogruluk * 20 + G.inis.hassasiyet * 15 + G.yuzey.bilim + (BUTCE - butceHarca()) * 0.6;
  if (G.brif && brifDurumu().basarili) puan += G.brif.odul;
  return { puan, basarili: true };
}

/* ============ RAPOR ============ */
function raporaGec(baslik, ozet, kaynak) {
  ekranAc("rapor");
  G.raporKaynak = kaynak;
  const satirlar = [];
  let puan = 0;
  let basarili;
  let tamaNotu = ozet;

  if (kaynak === "firlatma") {
    basarili = false;
    satirlar.push(["Fırlatma", "pencere dışında ateşlendi, araç yükselişte parçalandı", "0"]);
    satirlar.push(["Öğretiler", "küçük araç hızlı pencere taşır; büyük araç affedicidir", "—"]);
  } else if (kaynak === "seyir") {
    basarili = false;
    puan = G.firlatma.dogruluk * 20;
    satirlar.push(["Fırlatma", say(G.firlatma.dogruluk * 100, 0) + " pencere hassasiyeti", "+" + say(G.firlatma.dogruluk * 20, 0)]);
    satirlar.push(["Seyir", "yakıt ayırılmadı, arabulucu atış yapılamadı, araç kayboldu", "0"]);
    satirlar.push(["Öğretiler", "yakıt her fazın sigortasıdır — inişe de seyire de pay ayır", "—"]);
  } else if (kaynak === "inis") {
    basarili = false;
    puan = G.firlatma.dogruluk * 20;
    satirlar.push(["Fırlatma", say(G.firlatma.dogruluk * 100, 0) + " pencere hassasiyeti", "+" + say(G.firlatma.dogruluk * 20, 0)]);
    satirlar.push(["İniş", "gövde teması emniyet sınırlarını aştı; modül mandalları koptu", "0"]);
    satirlar.push(["Öğretiler", "düşüş hızı sınırı 25 m/s, yan hız 10 m/s — geç yakıt yakmak bedel ödetir", "—"]);
  } else {
    const y = G.yuzey;
    const guc = gucHesapla();
    satirlar.push(["Hedef", G.hedef.ad + " (" + G.hedef.atmosfer + " atmosfer, çekim " + G.hedef.cekim + " birim)", "—"]);
    satirlar.push(["Fırlatma", say(G.firlatma.dogruluk * 100, 0) + " pencere hassasiyeti", "+" + say(G.firlatma.dogruluk * 20, 0)]);
    satirlar.push(["İniş", say(G.inis.hassasiyet * 100, 0) + " bölge hassasiyeti", "+" + say(G.inis.hassasiyet * 15, 0)]);
    satirlar.push(["Toplanan bilim", say(y.bilim, 0) + " birim", "+" + say(y.bilim, 0)]);
    if (y.rover) satirlar.push(["Rover keşfi", say(y.rover.veri, 0) + " birim veri · " + say(y.rover.mesafe, 0) + " m sürüş", "—"]);
    if (y.uretimler && y.uretimler.size > 0) {
      const adlar = [...y.uretimler].map((a) => (URETIMLER.find((u) => u.anahtar === a) || {}).ad).filter(Boolean).join(", ");
      satirlar.push(["Atölye üretimi", y.uretimler.size + " yükseltme · " + adlar, "—"]);
    }
    if ((y.gezegenSayisi || 1) > 1) satirlar.push(["Gezegen ziyaretleri", y.gezegenSayisi + " gök cismi · keşif bonusları bilime dahil", "—"]);
    if (!guc.link) satirlar.push(["Anten yok", "tampon Dünya'ya gidemedi — bilimin yarısı öldü", "—"]);
    else if (y.tampon > 0.001) satirlar.push(["Kalan tampon", say(y.tampon, 0) + " birim (yarısı sayıldı)", "—"]);
    const kalan = BUTCE - butceHarca();
    satirlar.push(["Bütçe ekonomisi", say(kalan) + " M$ rezerve", "+" + say(kalan * 0.6, 0)]);
    if (G.brif) {
      const d = brifDurumu();
      satirlar.push(["Görev brifingi", G.brif.ad + " (" + G.brif.kod + ") — " + d.metin,
        d.basarili ? "+" + G.brif.odul : "—"]);
    }
    puan = computeScore("yuzey").puan;
    basarili = true;
  }

  let nota;
  if (!basarili) nota = (baslik || "KAYIP").toUpperCase();
  else if (puan >= 150) nota = "S";
  else if (puan >= 110) nota = "A";
  else if (puan >= 70)  nota = "B";
  else if (puan >= 35)  nota = "C";
  else if (puan >= 15)  nota = "D";
  else nota = "F";

  $("#rapor-baslik").textContent = "MenSpace — Görev Raporu";
  $("#rapor-nota").textContent = nota;
  const toplam = basarili ? say(puan, 0) : null;
  $("#rapor-ozet").textContent = basarili
    ? "Görev tamamlandı. Not " + nota + ", toplam puan " + toplam + "." +
      (G.brif ? (brifDurumu().basarili
        ? " Brifing tutturuldu: " + G.brif.ad + "."
        : " Brifing tutmadı: " + G.brif.ad + " — " + brifDurumu().metin + ".") : "")
    : (tamaNotu || "Görev tamamlanamadı — mühendislik kurulu seni yeniden tasarıma davet ediyor.");
  $("#ekran-rapor .rapor").classList.toggle("basarisiz", !basarili);

  const stamp = $("#rapor-stamp");
  const stampIng = $("#rapor-stamp-img");
  stamp.hidden = false;
  stampIng.src = basarili ? "assets/inis_basarili.png" : "assets/inis_basarisiz.png";
  stampIng.alt = basarili ? "görev başarılı" : "görev kayıp";

  const rozBox = $("#rapor-rozetler");
  rozBox.innerHTML = "";
  const rozetler = [];
  if (basarili) {
    if (G.inis.hassasiyet && G.inis.hassasiyet > 0) rozetler.push(["rozet_inis.png", "başarılı iniş"]);
    if (G.yuzey.sol > misyonSols()) rozetler.push(["rozet_sol.png", "tam plan"]);
    if (G.yuzey.iletilen >= 100) rozetler.push(["rozet_bagis.png", "100+ veri"]);
    if (nota === "S") rozetler.push(["rozet_s.png", "S sınıfı"]);
  }
  rozBox.hidden = rozetler.length === 0;
  rozetler.forEach(([src, label]) => {
    const d = document.createElement("div");
    d.className = "rapor-rozet";
    d.innerHTML = '<img src="assets/' + src + '" alt=""><span>' + label + '</span>';
    rozBox.appendChild(d);
  });

  const tb = $("#rapor-govde");
  tb.innerHTML = "";
  satirlar.forEach(([k, v, p]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td>" + k + "</td><td>" + v + "</td><td>" + p + "</td>";
    tb.appendChild(tr);
  });
  const tr = document.createElement("tr");
  tr.className = "buyuk";
  tr.innerHTML = "<td>TOPLAM</td><td></td><td>" + (basarili ? toplam : "—") + "</td>";
  tb.appendChild(tr);

  try {
    const rekor = localStorage.getItem("menSpace.rekor");
    if (basarili && (!rekor || puan > parseFloat(rekor))) {
      localStorage.setItem("menSpace.rekor", String(puan));
      const mr = $("#menu-rekor-deger");
      if (mr) mr.textContent = say(puan, 0);
      $("#rekor-satir").hidden = false;
      $("#rekor-deger").textContent = say(puan, 0);
    }
  } catch (_) { /* yalnız modda rekor yok */ }

  saatGuncelle(basarili ? "görev tamamlandı" : "görev kaybı");
  updateChallengeReportUI();
  if (kaynak === "yuzey") G.yuzey.bitti = true;
}

const OFFICIAL_CHALLENGE_SEED = 1337;
const SUPABASE_URL = window.SUPABASE_URL || "";
const SUPABASE_ANON = window.SUPABASE_ANON_KEY || "";
const TURNSTILE_SITE_KEY = "0x4AAAAAAFzihhflQW6bQ3-I";

let pendingLeaderboardToken = "";
let turnstileMounted = false;
let supabaseClient = null;
let currentSession = null;
let currentDisplayName = "";

function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function criarRng(seed) { return mulberry32(seed); }

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (!SUPABASE_URL || !SUPABASE_ANON || !window.supabase || !window.supabase.createClient) return null;
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
      auth: { detectSessionInUrl: true, flowType: "pkce" },
    });
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      currentSession = session;
      updateAccountUI();
    });
    updateAccountUI();
    return supabaseClient;
  } catch (err) {
    console.error("Supabase istemcisi yüklenemedi", err);
    return null;
  }
}

function setAuthMessage(msg) {
  const el = $("#auth-error");
  if (el) el.textContent = msg || "";
}

function updateAccountButton(session) {
  const btn = $("#btn-account");
  if (!btn) return;
  if (!session) {
    btn.textContent = "HESAP — giriş yap";
    btn.classList.remove("giris-yapildi");
    return;
  }
  const meta = session.user.user_metadata || {};
  const visible = currentDisplayName || meta.full_name || meta.name || (session.user.email || "").split("@")[0];
  btn.textContent = "HESAP — " + visible;
  btn.classList.add("giris-yapildi");
}

function fetchProfileName() {
  if (!currentSession) return Promise.resolve(null);
  return fetch(
    SUPABASE_URL + "/rest/v1/profiles?user_id=eq." + encodeURIComponent(currentSession.user.id) +
      "&select=display_name&limit=1",
    { headers: { apikey: SUPABASE_ANON, Authorization: "Bearer " + currentSession.access_token } }
  ).then((r) => (r.ok ? r.json() : [])).then((rows) => (rows && rows[0] && rows[0].display_name) || null);
}

function isDisplayNameAllowed(name) {
  return typeof name === "string" && /^[A-Za-zÇĞİÖŞÜçğıöşü0-9 .-]{3,24}$/.test(name.trim());
}

function renderProfileState(name) {
  const form = $("#display-name-form");
  const summary = $("#display-name-summary");
  if (name) {
    form && form.classList.add("hidden");
    summary && summary.classList.remove("hidden");
    const valueNode = $("#display-name-value");
    if (valueNode) valueNode.textContent = name;
  } else {
    summary && summary.classList.add("hidden");
    form && form.classList.remove("hidden");
  }
  updateOfficialButtons();
}

function updateAccountUI() {
  const out = $("#auth-out");
  const inside = $("#auth-in");
  if (!out || !inside) return;
  if (!currentSession) {
    currentDisplayName = "";
    out.classList.remove("hidden");
    inside.classList.add("hidden");
    setAuthMessage("");
    updateAccountButton(null);
    updateOfficialButtons();
    return;
  }
  out.classList.add("hidden");
  inside.classList.remove("hidden");
  const user = currentSession.user;
  const meta = user.user_metadata || {};
  $("#auth-email").textContent = user.email || "";
  $("#auth-name").textContent = meta.full_name || meta.name || (user.email ? user.email.split("@")[0] : "Misafir");
  const av = $("#auth-avatar");
  if (av) av.style.backgroundImage = meta.avatar_url ? 'url("' + String(meta.avatar_url).replace(/"/g, "%22") + '")' : "";
  fetchProfileName().then((name) => {
    currentDisplayName = name || "";
    renderProfileState(name);
    updateAccountButton(currentSession);
  });
  updateAccountButton(currentSession);
}

function signInWithGoogle() {
  const client = getSupabaseClient();
  if (!client) { setAuthMessage("Oturum servisleri yüklenemedi — sayfayı yenile."); return; }
  client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin + window.location.pathname },
  }).then((res) => { if (res.error) setAuthMessage("Google ile giriş yapılamadı: " + res.error.message); });
}

function signOut() {
  const client = getSupabaseClient();
  if (!client) return;
  client.auth.signOut().then(() => {
    currentSession = null;
    currentDisplayName = "";
    updateAccountUI();
    refreshLeaderboardFromApi();
    setAuthMessage("Çıkış yapıldı.");
  });
}

function setDisplayName(name) {
  if (!currentSession) { setAuthMessage("Önce Google ile giriş yap."); return Promise.resolve(); }
  const clean = String(name || "").trim();
  if (!isDisplayNameAllowed(clean)) {
    setAuthMessage("İsim 3-24 karakter, harf/rakam/boşluk, nokta ve tire içerebilir.");
    return Promise.resolve();
  }
  const headers = {
    apikey: SUPABASE_ANON,
    Authorization: "Bearer " + currentSession.access_token,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
  return fetch(SUPABASE_URL + "/rest/v1/profiles", {
    method: "POST", headers, body: JSON.stringify({ user_id: currentSession.user.id, display_name: clean }),
  }).then((res) => {
    if (res.status === 201 || res.status === 200 || res.status === 204) {
      currentDisplayName = clean;
      renderProfileState(clean);
      setAuthMessage("İsim kaydedildi.");
      return;
    }
    return res.json().then((data) => {
      if (data.code === "23505") setAuthMessage("Bu isim zaten alınmış — başka bir isim dene.");
      else setAuthMessage("İsim kaydedilemedi.");
    });
  }).catch(() => setAuthMessage("İsim kaydedilemedi."));
}

function updateDisplayName(name) {
  if (!currentSession) return Promise.resolve();
  const clean = String(name || "").trim();
  if (!isDisplayNameAllowed(clean)) { setAuthMessage("İsim formatı geçersiz."); return Promise.resolve(); }
  const headers = {
    apikey: SUPABASE_ANON,
    Authorization: "Bearer " + currentSession.access_token,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
  return fetch(SUPABASE_URL + "/rest/v1/profiles?user_id=eq." + encodeURIComponent(currentSession.user.id), {
    method: "PATCH", headers, body: JSON.stringify({ display_name: clean }),
  }).then((res) => {
    if (res.status === 204 || res.status === 200) {
      currentDisplayName = clean;
      renderProfileState(clean);
      setAuthMessage("İsim güncellendi.");
    } else {
      res.json().then((data) => {
        setAuthMessage(data.code === "23505" ? "Bu isim zaten alınmış." : "İsim güncellenemedi.");
      });
    }
  }).catch(() => setAuthMessage("İsim güncellenemedi."));
}

function logChallengeAction(type, data) {
  const challenge = G.challenge;
  if (!challenge || !Array.isArray(challenge.log)) return;
  challenge.log.push({ t: G.clock || 0, type: type, ...(data || {}) });
}

function applyOfficialAction(action) {
  if (!action || !action.type) return;
  switch (action.type) {
    case "brifing": {
      const mission = (G.misyonlar || [])[action.index];
      if (mission) { G.brif = mission; G.hedef = mission.gokCisim || HEDEFLER[0]; }
      return;
    }
    case "arac": {
      const arac = ARACLAR.find((x) => x.anahtar === action.anahtar);
      if (arac) G.arac = arac;
      return;
    }
    case "modul": {
      const mod = MODULLER.find((x) => x.anahtar === action.anahtar);
      if (mod) { G.modul = mod; G.yakit = mod.yakit; }
      return;
    }
    case "donanim": {
      G.donanim = new Set(action.keys || []);
      return;
    }
    case "tasarimOnay": {
      firlatmayaGec();
      return;
    }
    case "launchClick": {
      firlatmaTikla();
      return;
    }
    case "seyir": {
      seyirKarar(action.burn === true);
      return;
    }
    case "inisKey": {
      if (typeof inisTuslari === "undefined") return;
      if (action.key === "KeyW" || action.key === "Space" || action.key === "ArrowUp") inisTuslari.itki = !!action.down;
      else if (action.key === "KeyS" || action.key === "ArrowDown") inisTuslari.yarim = !!action.down;
      else if (action.key === "KeyA" || action.key === "ArrowLeft") inisTuslari.sol = !!action.down;
      else if (action.key === "KeyD" || action.key === "ArrowRight") inisTuslari.sag = !!action.down;
      return;
    }
    case "sol": { solYurut(); return; }
    case "veri": { veriIlet(); return; }
    case "roverKey": {
      if (action.key === "KeyA" || action.key === "ArrowLeft") roverTuslari.sol = !!action.down;
      else if (action.key === "KeyD" || action.key === "ArrowRight") roverTuslari.sag = !!action.down;
      return;
    }
    case "transfer": { transferBaslat(action.anahtar); return; }
    case "uretim": { uretimYap(action.anahtar); return; }
    case "yakitUret": { yakitUret(); return; }
    default: return;
  }
}

function runOfficialChallenge(seed, actions) {
  challengeRandom = criarRng(seed);
  setGlobalG(freshState());
  G.clock = 0;
  G.misyonlar = misyonlariUret();
  G.challenge = { seed: seed, official: true };
  const acts = Array.isArray(actions) ? actions.slice().sort((a, b) => ((a && a.t) || 0) - ((b && b.t) || 0)) : [];
  const dt = 1 / 60;
  let t = 0;
  let i = 0;
  while (i < acts.length && t < 720) {
    const target = typeof acts[i].t === "number" ? acts[i].t : t;
    while (t < target) { const step = Math.min(dt, target - t); advanceGame(step); t += step; }
    applyOfficialAction(acts[i]);
    i++;
  }
  while (G.faz !== "rapor" && t < 720) { advanceGame(dt); t += dt; }
  const kaynak = G.raporKaynak || "yuzey";
  const sc = computeScore(kaynak);
  return { ok: G.faz === "rapor", puan: sc.puan, basarili: sc.basarili, faz: G.faz };
}

function fetchLeaderboardFromApi() {
  return fetch("/api/leaderboard", { cache: "no-store" })
    .then((r) => r.json())
    .then((data) => (data && data.rows) || []);
}

function renderLeaderboard(rows) {
  const ol = $("#leaderboard-items");
  if (!ol) return;
  ol.innerHTML = "";
  (rows || []).forEach((row) => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.className = "lb-name";
    name.textContent = String(row.display_name || row.alias || "?");
    const score = document.createElement("span");
    score.className = "lb-score";
    score.textContent = Number(row.score).toFixed(1) + " p";
    li.appendChild(name);
    li.appendChild(score);
    ol.appendChild(li);
  });
  if (ol.children.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = "<span class='lb-name'>Henüz kayıt yok — ilk resmi skoru sen yap.</span>";
    ol.appendChild(li);
  }
}

function refreshLeaderboardFromApi() {
  return fetchLeaderboardFromApi().then(renderLeaderboard).catch(() => {
    const ol = $("#leaderboard-items");
    if (ol) ol.innerHTML = "<li><span class='lb-name'>Sıralama yüklenemedi.</span></li>";
  });
}

function updateOfficialButtons() {
  const btn = $("#btn-save-official");
  if (btn) btn.disabled = !(currentSession && currentDisplayName && pendingLeaderboardToken && G.challenge && G.challenge.official);
  const msg = $("#lb-save-msg");
  if (msg) {
    if (!currentSession) msg.textContent = "Resmi skor için Google ile giriş yap.";
    else if (!currentDisplayName) msg.textContent = "Benzersiz isim seçildiğinde kaydedebilirsin.";
    else if (!pendingLeaderboardToken) msg.textContent = "Captcha doğrulaması gerekiyor.";
    else msg.textContent = "Resmi skoru kaydedebilirsin.";
  }
}

function showLeaderboardPopup(show) {
  const pop = $("#leaderboard-popup");
  if (!pop) return;
  pop.hidden = !show;
  if (show) { mountTurnstile(); refreshLeaderboardFromApi(); updateOfficialButtons(); }
}

function mountTurnstile() {
  const cont = $("#turnstile-container");
  if (!cont) return;
  if (!window.turnstile) { cont.textContent = "Captcha yükleniyor…"; setTimeout(mountTurnstile, 600); return; }
  if (turnstileMounted) { updateOfficialButtons(); return; }
  const node = document.createElement("div");
  cont.textContent = "";
  cont.appendChild(node);
  window.turnstile.render(node, {
    sitekey: TURNSTILE_SITE_KEY,
    theme: "dark",
    callback: (token) => { pendingLeaderboardToken = token; updateOfficialButtons(); },
    "expired-callback": () => { pendingLeaderboardToken = ""; updateOfficialButtons(); },
    "error-callback": () => { setAuthMessage("Captcha doğrulaması alınamadı."); },
  });
  turnstileMounted = true;
}

function startOfficialChallenge() {
  fetch("/api/challenge", { cache: "no-store" }).then((r) => r.json()).then((data) => {
    challengeRandom = criarRng(data.seed);
    setGlobalG(freshState());
    G.clock = 0;
    G.challenge = { official: true, challengeId: data.challengeId, seed: data.seed, log: [] };
    G.misyonlar = misyonlariUret();
    misyonKartlariCiz();
    $("#btn-brif-tasarim").disabled = true;
    ekranAc("brif");
    saatGuncelle("Official Challenge — önce bir brifing seç");
  }).catch(() => { setAuthMessage("Challenge sunucudan yanıt alamadı."); });
}

function updateChallengeReportUI() {
  const block = $("#rapor-challenge");
  if (!block) return;
  const active = Boolean(G.challenge && G.challenge.official);
  block.hidden = !active;
  const msg = $("#rapor-challenge-msg");
  if (active && msg) {
    const sc = computeScore(G.raporKaynak || "yuzey").puan;
    msg.textContent = "Official Challenge — skorun " + Math.round(sc * 10) / 10 + " puan. Resmi sıralamaya gir.";
  }
}

async function saveOfficialScore() {
  setAuthMessage("");
  if (!currentSession) { setAuthMessage("Önce Google ile giriş yap."); return; }
  if (!currentDisplayName) { setAuthMessage("Önce benzersiz isim seç."); return; }
  if (!G.challenge || !G.challenge.challengeId) { setAuthMessage("Bu sonuç Official Challenge sonucu."); return; }
  if (!pendingLeaderboardToken) { setAuthMessage("Captcha doğrulaması gerekli."); return; }
  const token = pendingLeaderboardToken;
  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
        "authorization": "Bearer " + currentSession.access_token,
      },
      body: JSON.stringify({
        challengeId: G.challenge.challengeId,
        actions: G.challenge.log || [],
        durationMs: Math.round((G.clock || 0) * 1000),
        turnstile: token,
      }),
    });
    const data = await res.json();
    if (!res.ok) { setAuthMessage(data.error || "Kayıt reddedildi."); return; }
    setAuthMessage("Skor kaydedildi.");
    pendingLeaderboardToken = "";
    if (window.turnstile) window.turnstile.reset();
    refreshLeaderboardFromApi();
  } catch (err) {
    setAuthMessage("Sunucuya ulaşılamadı.");
  }
}

if (typeof window !== "undefined" && !window.MENSPACE_REPLAY) {
  kur();
}

export { runOfficialChallenge, OFFICIAL_CHALLENGE_SEED, freshState, computeScore };

/* ============ glav/ana döngü ============ */
let sonZaman = 0;
function advanceGame(dt) {
  G.clock = (G.clock || 0) + dt;
  if (G.faz === "firlatma") firlatmaCiz(dt);
  else if (G.faz === "seyir") seyirCiz(dt);
  else if (G.faz === "inis") inisCiz(dt);
  else if (G.faz === "tasarim") tasarimCiz();
  else if (G.faz === "yuzey") { yuzeyGuncelle(dt); yuzeyCiz(); }
}

function dondur(zaman) {
  const dt = Math.min(0.05, (zaman - sonZaman) / 1000 || 0.016);
  sonZaman = zaman;
  advanceGame(dt);
  requestAnimationFrame(dondur);
}

/* ============ kurulum ============ */
function bagla() {
  $("#btn-giris").addEventListener("click", () => {
    sesAc(); ses("onay");
    ekranAc("brif");
  });

  $("#btn-official").addEventListener("click", () => {
    sesAc(); ses("onay");
    startOfficialChallenge();
  });

  $("#btn-account").addEventListener("click", () => {
    sesAc(); ses("tik");
    showLeaderboardPopup(true);
    refreshLeaderboardFromApi();
  });

  $("#btn-leaderboard").addEventListener("click", () => {
    sesAc(); ses("tik");
    showLeaderboardPopup(true);
    refreshLeaderboardFromApi();
  });

  $("#leaderboard-close").addEventListener("click", () => showLeaderboardPopup(false));
  $("#leaderboard-popup").addEventListener("click", (e) => {
    if (e.target.id === "leaderboard-popup") showLeaderboardPopup(false);
  });

  $("#btn-lider-kaydet").addEventListener("click", () => {
    sesAc();
    showLeaderboardPopup(true);
    refreshLeaderboardFromApi();
  });

  $("#btn-google-signin").addEventListener("click", () => { sesAc(); ses("onay"); signInWithGoogle(); });
  $("#btn-signout").addEventListener("click", () => { sesAc(); signOut(); });
  $("#display-name-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#display-name-input");
    setDisplayName(input ? input.value : "");
  });
  $("#btn-displayname-edit").addEventListener("click", () => renderProfileState(""));
  $("#btn-save-official").addEventListener("click", () => { sesAc(); ses("onay"); saveOfficialScore(); });

  $("#btn-brif-menu").addEventListener("click", () => {
    sesAc(); ses("tik");
    ekranAc("baslangic");
  });

  $("#btn-brif-tasarim").addEventListener("click", () => {
    if (!G.brif) return;
    sesAc(); ses("onay");
    ekranAc("tasarim");
    brifKartiGuncelle();
  });

  const pop = (id, kutu) => {
    const k = $(kutu);
    if (!k) return;
    $(id).addEventListener("click", () => { sesAc(); k.hidden = false; });
    k.addEventListener("click", (e) => { if (e.target === k) k.hidden = true; });
  };

  pop("#btn-nasil", "#nasil");
  $("#btn-nasil-kapat").addEventListener("click", () => { $("#nasil").hidden = true; });
  pop("#btn-rekor", "#rekorlar-popup");
  $("#btn-rekorlar-kapat").addEventListener("click", () => { $("#rekorlar-popup").hidden = true; });

  $("#btn-kayit-sil").addEventListener("click", () => {
    try { localStorage.removeItem("menSpace.rekor"); } catch (_) {}
    $("#rekor-satir").hidden = true;
    $("#menu-rekor-deger").textContent = "—";
    sesAc(); ses("tik");
  });

  $("#btn-firlat").addEventListener("click", () => { sesAc(); firlatmaTikla(); });
  $("#firlatma-kanvas").addEventListener("keydown", (e) => {
    if (e.code === "Space") { e.preventDefault(); sesAc(); firlatmaTikla(); }
  });
  $("#firlatma-kanvas").addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    e.preventDefault(); sesAc(); firlatmaTikla();
  });

  $("#btn-seyir-yakit").addEventListener("click", () => { sesAc(); ses("onay"); seyirKarar(true); });
  $("#btn-seyir-risk").addEventListener("click", () => { sesAc(); ses("tik"); seyirKarar(false); });
  $("#btn-sol-basyaz").addEventListener("click", () => { sesAc(); solYurut(); });
  $("#btn-yuzey-veri").addEventListener("click", () => { sesAc(); veriIlet(); });
  $("#btn-gezegen").addEventListener("click", () => { sesAc(); ses("tik"); gezegenPopupAc(true); });
  $("#btn-gezegen-kapat").addEventListener("click", () => { sesAc(); gezegenPopupAc(false); });
  $("#gezegen-popup").addEventListener("click", (e) => {
    if (e.target.id === "gezegen-popup") gezegenPopupAc(false);
  });
  $("#btn-atolye").addEventListener("click", () => { sesAc(); ses("tik"); atolyePopupAc(true); });
  $("#btn-atolye-kapat").addEventListener("click", () => { sesAc(); atolyePopupAc(false); });
  $("#atolye-popup").addEventListener("click", (e) => {
    if (e.target.id === "atolye-popup") atolyePopupAc(false);
  });
  $("#btn-yakit-uret").addEventListener("click", () => { sesAc(); yakitUret(); });
  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      const pop = $("#gezegen-popup");
      if (pop && !pop.hidden) gezegenPopupAc(false);
      const atolye = $("#atolye-popup");
      if (atolye && !atolye.hidden) atolyePopupAc(false);
    }
  });

  $("#btn-yeni-gorev").addEventListener("click", () => {
    G.yakit = G.modul ? G.modul.yakit : 0;
    G.yuzey.bilim = 0;
    G.yuzey.tampon = 0;
    G.yuzey.iletilen = 0;
    G.yuzey.geceler = 0;
    G.yuzey.kesintisiz = 0;
    G.yuzey.kaynaklar = { metal: 0, kristal: 0, buz: 0 };
    G.yuzey.uretimler = new Set();
    G.firlatma.dogruluk = 0;
    G.inis.hassasiyet = 0;
    G.brif = null;
    G.misyonlar = misyonlariUret();
    misyonKartlariCiz();
    $("#btn-brif-tasarim").disabled = true;
    ekranAc("brif");
    saatGuncelle("görev brifingi");
    brifKartiGuncelle();
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && G.faz === "firlatma" && e.target === document.body) {
      e.preventDefault(); sesAc(); firlatmaTikla();
    }
  });
}

function kur() {
  tumResimleriYukle();
  tasarimKur();
  inisTusKur();
  roverTusKur();
  bagla();
  G.misyonlar = misyonlariUret();
  misyonKartlariCiz();
  $("#btn-brif-tasarim").disabled = true;
  getSupabaseClient();
  updateAccountUI();
  try {
    const rekor = localStorage.getItem("menSpace.rekor");
    if (rekor) {
      const v = say(parseFloat(rekor), 0);
      $("#rekor-satir").hidden = false;
      $("#rekor-deger").textContent = v;
      const mr = $("#menu-rekor-deger");
      if (mr) mr.textContent = v;
    }
  } catch (_) {}
  saatGuncelle("görev brifingi");
  kaynakGuncelle();
  requestAnimationFrame(dondur);
}
