/* MenSpace — görev tasarım simülatörü
   fazlar: tasarım → fırlatma → seyir → iniş → yüzey → rapor        */
"use strict";

/* ============ yardımcılar ============ */
const $ = (s) => document.querySelector(s);
const sinir = (a, x, b) => Math.max(a, Math.min(x, b));
const say = (n, h) => n.toLocaleString("tr-TR", { maximumFractionDigits: h === undefined ? 1 : h });
const rast = (a, b) => a + Math.random() * (b - a);

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

/* ============ hedef gök cisimleri ============ */
const HEDEFLER = [
  { anahtar: "ay", ad: "Ay", img: "assets/ay.png", cekim: 42, zemin: "#8A8D99", atmosfer: "yok",
    not: "1,62 m/s² — hafif çekim, yumuşak iniş." },
  { anahtar: "mars", ad: "Mars", img: "assets/mars.png", cekim: 50, zemin: "#A0522D", atmosfer: "ince CO₂",
    not: "3,72 m/s² — daha ağır çekim, ama ince atmosfer biraz frenliyor." },
  { anahtar: "merkur", ad: "Merkür", img: "assets/merkur.png", cekim: 52, zemin: "#8A8578", atmosfer: "yok",
    not: "3,70 m/s² — atmosfer yok, düşüşü sadece motor kesiyor." },
  { anahtar: "venus", ad: "Venüs", img: "assets/venus.png", cekim: 60, zemin: "#C9A227", atmosfer: "yoğun CO₂",
    not: "8,87 m/s² — ağır çekim, her itki yakıt yakıyor." },
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
const G = {
  faz: "baslangic",
  misyonlar: [],
  brif: null,
  hedef: HEDEFLER[0],
  arac: null,
  modul: null,
  yakit: 0,
  donanim: new Set(),
  firlatma: { durum: "hazir", t: 0, merkez: 0.5, hamle: null, dogruluk: 0 },
  seyir: { durum: "bekleme", t: 0, guvence: false },
  inis: { durum: "bekleme", lander: null, pad: 440, hassasiyet: 0, sayac: 0 },
  yuzey: {
    sol: 1, pil: 0, pilKap: 0, tampon: 0, bilim: 0,
    aktif: new Set(), gunesKesik: false, bitti: false, pilBitti: false,
    bayrakDikildi: false, antenArizasi: false,
    iletilen: 0, geceler: 0, kesintisiz: 0,
  },
};

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

/* ============ ortak kanvas çizimleri ============ */
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

function yuzeySeridi(ctx, y, w, tint) {
  const zemin = resim("ay_yuzeyi");
  for (let x = 0; x < w; x += 86) {
    if (zemin && zemin.complete && zemin.naturalWidth) ctx.drawImage(zemin, x, y, 86, 84);
    else { ctx.fillStyle = "#9BA0AE"; ctx.fillRect(x, y, 86, 84); }
  }
  ctx.fillStyle = "rgba(35,37,47,0.22)";
  ctx.fillRect(0, y, w, 84);
  if (tint) {
    ctx.globalAlpha = 0.4;
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
    const b = adaylar[Math.floor(Math.random() * adaylar.length)];
    secim.push(b);
    havuz.splice(havuz.indexOf(b), 1);
  });
  const modSayisi = { 1: 0, 2: 1, 3: 2 };
  return secim.map((b) => {
    const modHavuz = [...MODIFIYELER];
    const mods = [];
    for (let i = 0; i < modSayisi[b.zorluk]; i++) {
      const m = modHavuz.splice(Math.floor(Math.random() * modHavuz.length), 1)[0];
      mods.push(m);
    }
    let hedef = b.hedef;
    if (mods.some((m) => m.tip === "sakin")) hedef = Math.round(hedef * 1.25);
    const gokCisim = HEDEFLER[Math.floor(Math.random() * HEDEFLER.length)];
    return {
      ...b, hedef, modifiyeler: mods, sols: ZORLUK_SOL[b.zorluk], gokCisim,
      kod: "MS-" + (100 + Math.floor(Math.random() * 899)),
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
  G.brif = m;
  G.hedef = m.gokCisim || HEDEFLER[0];
  G.yuzey.iletilen = 0;
  G.yuzey.geceler = 0;
  G.yuzey.kesintisiz = 0;
  misyonKartlariCiz();
  const giris = $("#btn-giris");
  giris.disabled = false;
  giris.textContent = "Kontrol kabinine gir →";
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
    b.addEventListener("click", () => { sesAc(); ses("tik"); G.arac = a; tasarimSecGuncelle(); tasarimDenetim(); });
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
    b.addEventListener("click", () => { sesAc(); ses("tik"); G.modul = m; G.yakit = m.yakit; tasarimSecGuncelle(); tasarimDenetim(); });
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
        dolap.classList.add("isaretli");
        notP.style.display = "block";
        satir.classList.remove("uyar");
      } else {
        G.donanim.delete(d.anahtar);
        dolap.classList.remove("isaretli");
        notP.style.display = "none";
        satir.classList.add("uyar");
      }
      tasarimDenetim();
    });
    donKap.appendChild(satir);
  });

  $("#btn-tasarim-onay").addEventListener("click", () => { sesAc(); ses("onay"); firlatmayaGec(); });
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
  const tuttu = Math.random() < sanc;
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
      ctx.lineTo(w / 2, zeminY + 62 + Math.random() * 14);
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
        ctx.lineTo(w / 2, y + boy + 30 + Math.random() * 14);
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
      : "Yakıt gergin: iniş için lazım — ama arabulucu atışı yapmazsan Ay sana uzak kalır.";
  $("#seyir-karar").hidden = false;
  saatGuncelle("Dünya–Ay seyri");
  kaynakGuncelle();
}

function seyirKarar(guvenceSecildi) {
  const s = G.seyir;
  if (s.durum !== "bekleme") return;
  if (guvenceSecildi) {
    s.guvence = true;
    G.yakit = Math.max(0, G.yakit - 3);
  }
  const rizika = s.guvence ? 0.02 : 0.20;
  $("#seyir-karar").hidden = true;
  kaynakGuncelle();
  if (Math.random() < rizika) {
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
  const ilerleme = s.durum === "ucus" ? sinir(0, s.t / 5, 1) : 0.04;

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
    if (s.durum === "ucus") {
      ctx.fillStyle = "#F2C130";
      ctx.beginPath();
      ctx.moveTo(x + g / 2 - 4, y + boy - 6);
      ctx.lineTo(x + g / 2 + 4, y + boy - 6);
      ctx.lineTo(x + g / 2, y + boy + 14 + Math.random() * 8);
      ctx.fill();
    }
  }
  if (s.durum === "patlak") {
    const p = resim("patlama");
    if (p && p.complete) ctx.drawImage(p, w / 2 - 86, h / 2 - 100, 172, 147);
    if (s.t > 2.4) {
      raporaGec("Seyir kaybı",
        "Yakıt ayırmadın; seyir düzeltmesi yapılamadı ve araç Ay çekim alanında yörüngeden çıktı.",
        "seyir");
      return;
    }
  }

  if (s.durum === "ucus" && s.t > 5.2) iniseGec();
}

/* ============ İNİŞ ============ */
const inisTuslari = { itki: false, sol: false, sag: false };

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
  saatGuncelle("Ay inişi — canlı telemetri");
  kaynakGuncelle();
}

function inisTusKur() {
  const c = $("#inis-kanvas");
  document.addEventListener("keydown", (e) => {
    if (G.faz !== "inis") return;
    if (e.code === "Space" || e.key === "ArrowUp") { e.preventDefault(); if (!e.repeat) { sesAc(); inisTuslari.itki = true; } }
    else if (e.key === "ArrowLeft") { e.preventDefault(); inisTuslari.sol = true; }
    else if (e.key === "ArrowRight") { e.preventDefault(); inisTuslari.sag = true; }
  });
  document.addEventListener("keyup", (e) => {
    if (e.code === "Space" || e.key === "ArrowUp") inisTuslari.itki = false;
    else if (e.key === "ArrowLeft") inisTuslari.sol = false;
    else if (e.key === "ArrowRight") inisTuslari.sag = false;
  });
  c.addEventListener("pointerdown", (e) => {
    e.preventDefault(); sesAc();
    const kutu = c.getBoundingClientRect();
    const oran = (e.clientX - kutu.left) / kutu.width;
    inisTuslari.itki = true;
    inisTuslari.sol = inisTuslari.sag = false;
    if (oran < 0.42) inisTuslari.sol = true;
    if (oran > 0.58) inisTuslari.sag = true;
  });
  c.addEventListener("pointerup", () => { inisTuslari.itki = inisTuslari.sol = inisTuslari.sag = false; });
  c.addEventListener("pointercancel", () => { inisTuslari.itki = inisTuslari.sol = inisTuslari.sag = false; });
}

function inisCiz(dt) {
  const c = $("#inis-kanvas");
  const ctx = c.getContext("2d");
  const w = c.width, h = c.height;
  const i = G.inis;
  const L = i.lander;
  yildizOrgu(ctx, w, h);
  const zeminY = h - 64;
  yuzeySeridi(ctx, zeminY, w, G.hedef.zemin);
  ctx.fillStyle = "#177E89";
  ctx.fillRect(i.pad - 60, zeminY - 5, 120, 5);
  etiket(ctx, "iniş bölgesi · " + G.hedef.ad, i.pad, zeminY + 26);
  const bIm = resim("bayrak");
  if (bIm && bIm.complete) ctx.drawImage(bIm, sinir(0, i.pad + 70, w - 46), zeminY - 58, 44, 46);

  if (!L) return;
  const im = resim("inis_aracı");
  const boy = 66, g = boy * (im.naturalWidth / im.naturalHeight);

  if (i.durum === "inis") {
    const cer = Math.min(dt, 0.05);
    L.vy += G.hedef.cekim * cer;            // hedef gök cisminin çekimi
    if (inisTuslari.itki && L.yakit > 0) {
      L.vy -= L.itus * cer;
      L.yakit = Math.max(0, L.yakit - 7 * cer);
    }
    if (inisTuslari.sol && L.yakit > 0) { L.vx -= L.itus * 0.32 * cer; L.yakit = Math.max(0, L.yakit - 2.5 * cer); }
    if (inisTuslari.sag && L.yakit > 0) { L.vx += L.itus * 0.32 * cer; L.yakit = Math.max(0, L.yakit - 2.5 * cer); }
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

  if (i.durum !== "kaza" && im.complete) {
    ctx.drawImage(im, L.x, L.y, g, boy);
    if (i.durum === "inis" && inisTuslari.itki && L.yakit > 0) {
      ctx.fillStyle = "#F2C130";
      ctx.beginPath();
      ctx.moveTo(L.x + g / 2 - 7, L.y + boy - 18);
      ctx.lineTo(L.x + g / 2 + 7, L.y + boy - 18);
      ctx.lineTo(L.x + g / 2, L.y + boy + 16 + Math.random() * 10);
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

/* ============ YÜZEY ============ */
function yuzeyeGec() {
  ekranAc("yuzey");
  const y = G.yuzey;
  y.sol = 1; y.tampon = 0; y.bilim = 0; y.gunesKesik = false;
  y.bitti = false; y.pilBitti = false; y.bayrakDikildi = false;
  y.antenArizasi = false; y.iletilen = 0; y.geceler = 0; y.kesintisiz = 0;
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
  $("#btn-sol-basyaz").disabled = false;
  yuzeyGecisleriKur();
  yuzeyCiz();
  $("#yuzey-gunluk").textContent = "Yüzeye sağ çıktın. Cihazları aç, sölü başlat, veriyi zamanında ilet.";
  saatGuncelle("Söl 1 / " + misyonSols());
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
  yildizOrgu(ctx, w, h);
  const zeminY = h - 62;
  yuzeySeridi(ctx, zeminY, w, G.hedef.zemin);
  const dIm = resim("dunya");
  if (dIm && dIm.complete) ctx.drawImage(dIm, 56, 26, 48, 48);

  const bes = w / 2;
  const m = resim("inis_aracı");
  if (m && m.complete) ctx.drawImage(m, bes - 70, zeminY - 96, 62, 86);

  const bIm = resim("bayrak");
  if (y.bayrakDikildi && bIm && bIm.complete) ctx.drawImage(bIm, bes + 14, zeminY - 62, 38, 40);

  const cihazlar = DONANIM.filter(d =>
    G.donanim.has(d.anahtar) && !["bayrak", "pil", "panel", "anten_b", "anten_k"].includes(d.anahtar));
  cihazlar.forEach((d, i) => {
    const im = resim(d.anahtar);
    if (!(im && im.complete)) return;
    const boy = 64, g = Math.min(64, boy * (im.naturalWidth / im.naturalHeight));
    const x = bes - 250 + i * 76;
    ctx.globalAlpha = (y.aktif.has(d.anahtar) || !d.bilim) ? 1 : 0.4;
    ctx.drawImage(im, x, zeminY - boy, g, boy);
    ctx.globalAlpha = 1;
    etiket(ctx, d.ad.toLowerCase() + (y.aktif.has(d.anahtar) ? "" : " · kapalı"), x + g / 2, zeminY + 24);
  });

  const aIm = resim(G.donanim.has("anten_b") ? "anten_b" : (G.donanim.has("anten_k") ? "anten_k" : null));
  if (aIm && aIm.complete) {
    const boy = 74, g = boy * (aIm.naturalWidth / aIm.naturalHeight);
    ctx.drawImage(aIm, bes + 130, zeminY - boy, g, boy);
    etiket(ctx, (G.donanim.has("anten_b") ? "büyük" : "küçük") + " anten", bes + 150 + g / 2 - 20, zeminY + 24);
  }
  const pIm = resim("panel");
  if (G.donanim.has("panel") && pIm && pIm.complete) {
    ctx.drawImage(pIm, bes - 170, zeminY - 70, 84, 63);
  }
  yuzeyOzetYaz();
}

function yuzeyOzetYaz() {
  const y = G.yuzey;
  const toplamSol = misyonSols();
  const gunduzMu = (y.sol - 1) % 6 !== 5;
  const calisan = [...y.aktif].map(a => (DONANIM.find(d => d.anahtar === a) || {}).ad).join(", ");
  $("#yuzey-gunosu").textContent = "Söl " + Math.min(y.sol, toplamSol) + " / " + toplamSol +
    (gunduzMu ? " — güneş açık" : " — AY GECESİ (panel çalışmaz)");
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
}

function solYurut() {
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
  const zar = Math.random();
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
  yuzeyCiz();
  $("#yuzey-gunluk").textContent = gunluk.join("\n") || "Söl sessiz geçti.";
  kaynakGuncelle();

  const toplamSol = misyonSols();
  if (geceMi && y.pil > 0.001) y.geceler++;
  if (y.sol > toplamSol) {
    y.bitti = true;
    raporYuzeyden(toplamSol + " söl tamamlandı", "Görev planının tamamı işletildi; kapsül raporu kapattı.");
  } else if (y.pil <= 0.001) {
    if (y.tampon > 0) {
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

function raporYuzeyden(baslik, ozet) {
  const y = G.yuzey;
  if (y.tampon > 0) y.bilim += Math.round(y.tampon * 0.5); // iletilmeyen verinin yarısı sayılır
  G.inis.durum = "bekleme";
  raporaGec(baslik, ozet, "yuzey");
}

/* ============ RAPOR ============ */
function raporaGec(baslik, ozet, kaynak) {
  ekranAc("rapor");
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
    satirlar.push(["Fırlatma", say(G.firlatma.dogruluk * 100, 0) + " pencere hassasiyeti", "+" + say(G.firlatma.dogruluk * 20, 0)]);
    satirlar.push(["Seyir", "yakıt ayırılmadı, arabulucu atış yapılamadı, araç kayboldu", "0"]);
    satirlar.push(["Öğretiler", "yakıt her fazın sigortasıdır — inişe de seyire de pay ayır", "—"]);
  } else if (kaynak === "inis") {
    basarili = false;
    satirlar.push(["Fırlatma", say(G.firlatma.dogruluk * 100, 0) + " pencere hassasiyeti", "+" + say(G.firlatma.dogruluk * 20, 0)]);
    satirlar.push(["İniş", "gövde teması emniyet sınırlarını aştı; modül mandalları koptu", "0"]);
    satirlar.push(["Öğretiler", "düşüş hızı sınırı 25 m/s, yan hız 10 m/s — geç yakıt yakmak bedel ödetir", "—"]);
  } else {
    const y = G.yuzey;
    const guc = gucHesapla();
    satirlar.push(["Hedef", G.hedef.ad + " (" + G.hedef.atmosfer + " atmosfer, çekim " + G.hedef.cekim + " birim)", "—"]);
    satirlar.push(["Fırlatma", say(G.firlatma.dogruluk * 100, 0) + " pencere hassasiyeti", "+" + say(G.firlatma.dogruluk * 20, 0)]);
    puan += G.firlatma.dogruluk * 20;
    satirlar.push(["İniş", say(G.inis.hassasiyet * 100, 0) + " bölge hassasiyeti", "+" + say(G.inis.hassasiyet * 15, 0)]);
    puan += G.inis.hassasiyet * 15;
    satirlar.push(["Toplanan bilim", say(y.bilim, 0) + " birim", "+" + say(y.bilim, 0)]);
    puan += y.bilim;
    if (!guc.link) satirlar.push(["Anten yok", "tampon Dünya'ya gidemedi — bilimin yarısı öldü", "—"]);
    else if (y.tampon > 0.001) satirlar.push(["Kalan tampon", say(y.tampon, 0) + " birim (yarısı sayıldı)", "—"]);
    const kalan = BUTCE - butceHarca();
    satirlar.push(["Bütçe ekonomisi", say(kalan) + " M$ rezerve", "+" + say(kalan * 0.6, 0)]);
    puan += kalan * 0.6;
    if (G.brif) {
      const d = brifDurumu();
      satirlar.push(["Görev brifingi", G.brif.ad + " (" + G.brif.kod + ") — " + d.metin,
        d.basarili ? "+" + G.brif.odul : "—"]);
      if (d.basarili) puan += G.brif.odul;
    }
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
      $("#rekor-satir").hidden = false;
      $("#rekor-deger").textContent = say(puan, 0);
    }
  } catch (_) { /* yalnız modda rekor yok */ }

  saatGuncelle(basarili ? "görev tamamlandı" : "görev kaybı");
  if (kaynak === "yuzey") G.yuzey.bitti = true;
}

/* ============ ana döngü ============ */
let sonZaman = 0;
function dondur(zaman) {
  const dt = Math.min(0.05, (zaman - sonZaman) / 1000 || 0.016);
  sonZaman = zaman;
  if (G.faz === "firlatma") firlatmaCiz(dt);
  else if (G.faz === "seyir") seyirCiz(dt);
  else if (G.faz === "inis") inisCiz(dt);
  else if (G.faz === "tasarim") tasarimCiz();
  requestAnimationFrame(dondur);
}

/* ============ kurulum ============ */
function bagla() {
  $("#btn-giris").addEventListener("click", () => {
    if (!G.brif) return;
    sesAc(); ses("onay");
    ekranAc("tasarim");
    brifKartiGuncelle();
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
  $("#btn-yeni-gorev").addEventListener("click", () => {
    G.yakit = G.modul ? G.modul.yakit : 0;
    G.yuzey.bilim = 0;
    G.yuzey.tampon = 0;
    G.yuzey.iletilen = 0;
    G.yuzey.geceler = 0;
    G.yuzey.kesintisiz = 0;
    G.firlatma.dogruluk = 0;
    G.inis.hassasiyet = 0;
    G.brif = null;
    G.misyonlar = misyonlariUret();
    misyonKartlariCiz();
    const giris = $("#btn-giris");
    giris.disabled = true;
    giris.textContent = "Önce bir görev seç";
    ekranAc("baslangic");
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
  bagla();
  G.misyonlar = misyonlariUret();
  misyonKartlariCiz();
  $("#btn-giris").disabled = true;
  $("#btn-giris").textContent = "Önce bir görev seç";
  try {
    const rekor = localStorage.getItem("menSpace.rekor");
    if (rekor) {
      $("#rekor-satir").hidden = false;
      $("#rekor-deger").textContent = say(parseFloat(rekor), 0);
    }
  } catch (_) {}
  saatGuncelle("görev brifingi");
  kaynakGuncelle();
  requestAnimationFrame(dondur);
}

kur();
