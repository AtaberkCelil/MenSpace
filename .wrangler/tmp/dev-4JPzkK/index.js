var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
  }
});

// ../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// app/game.js
var game_exports = {};
__export(game_exports, {
  OFFICIAL_CHALLENGE_SEED: () => OFFICIAL_CHALLENGE_SEED,
  computeScore: () => computeScore,
  freshState: () => freshState,
  runOfficialChallenge: () => runOfficialChallenge
});
function sesAc() {
  if (!sesBaglami) {
    try {
      sesBaglami = new (window.AudioContext || window.webkitAudioContext)();
    } catch (_) {
    }
  }
  if (sesBaglami && sesBaglami.state === "suspended") sesBaglami.resume();
}
function ses(tip) {
  if (!sesBaglami) return;
  const gec = sesBaglami.currentTime;
  const os = sesBaglami.createOscillator();
  const gv = sesBaglami.createGain();
  os.connect(gv);
  gv.connect(sesBaglami.destination);
  if (tip === "tik") {
    os.type = "square";
    os.frequency.value = 660;
    gv.gain.setValueAtTime(0.04, gec);
    gv.gain.exponentialRampToValueAtTime(1e-4, gec + 0.07);
    os.start(gec);
    os.stop(gec + 0.08);
  }
  if (tip === "onay") {
    os.type = "triangle";
    os.frequency.setValueAtTime(520, gec);
    os.frequency.exponentialRampToValueAtTime(880, gec + 0.12);
    gv.gain.setValueAtTime(0.05, gec);
    gv.gain.exponentialRampToValueAtTime(1e-4, gec + 0.25);
    os.start(gec);
    os.stop(gec + 0.26);
  }
  if (tip === "hata") {
    os.type = "sawtooth";
    os.frequency.setValueAtTime(220, gec);
    os.frequency.exponentialRampToValueAtTime(70, gec + 0.3);
    gv.gain.setValueAtTime(0.05, gec);
    gv.gain.exponentialRampToValueAtTime(1e-4, gec + 0.32);
    os.start(gec);
    os.stop(gec + 0.34);
  }
  if (tip === "firlat") {
    os.type = "sawtooth";
    os.frequency.setValueAtTime(90, gec);
    os.frequency.exponentialRampToValueAtTime(30, gec + 1.2);
    gv.gain.setValueAtTime(0.07, gec);
    gv.gain.exponentialRampToValueAtTime(1e-4, gec + 1.3);
    os.start(gec);
    os.stop(gec + 1.32);
  }
}
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
    donanim: /* @__PURE__ */ new Set(),
    challenge: null,
    firlatma: { durum: "hazir", t: 0, merkez: 0.5, hamle: null, dogruluk: 0 },
    seyir: { durum: "bekleme", t: 0, guvence: false },
    inis: { durum: "bekleme", lander: null, pad: 440, hassasiyet: 0, sayac: 0 },
    yuzey: {
      sol: 1,
      pil: 0,
      pilKap: 0,
      tampon: 0,
      bilim: 0,
      aktif: /* @__PURE__ */ new Set(),
      gunesKesik: false,
      bitti: false,
      pilBitti: false,
      bayrakDikildi: false,
      antenArizasi: false,
      iletilen: 0,
      geceler: 0,
      kesintisiz: 0
    }
  };
}
function resimAdi(anahtar) {
  if (anahtar === "kucuk") return "roket_kucuk";
  if (anahtar === "orta") return "roket_orta";
  if (anahtar === "buyuk") return "roket_buyuk";
  if (anahtar === "anten_k") return "anten_kucuk";
  if (anahtar === "anten_b") return "anten_buyuk";
  return anahtar;
}
function resim(anahtar) {
  return resimler[resimAdi(anahtar)];
}
function tumResimleriYukle() {
  const liste = [];
  ARACLAR.forEach((a) => liste.push(a.img));
  liste.push("assets/inis_arac\u0131.png");
  DONANIM.forEach((d) => liste.push(d.img));
  liste.push(
    "assets/patlama.png",
    "assets/dunya.png",
    "assets/ay.png",
    "assets/ay_yuzeyi.png",
    "assets/arkaplan.png"
  );
  HEDEFLER.forEach((h) => {
    if (h.anahtar !== "ay") liste.push(h.img);
  });
  liste.push("assets/venus_bulut.png", "assets/mars_rover.png", "assets/gunes.png", "assets/saturn.png", "assets/inis_basarili.png", "assets/inis_basarisiz.png", "assets/rozet_inis.png", "assets/rozet_sol.png", "assets/rozet_bagis.png", "assets/rozet_s.png");
  liste.forEach((kaynak) => {
    const im = new Image();
    im.src = kaynak;
    resimler[kaynak.replace("assets/", "").replace(".png", "")] = im;
  });
}
function ekranAc(isim) {
  document.querySelectorAll(".ekran").forEach((e) => e.classList.remove("acik"));
  $("#ekran-" + isim).classList.add("acik");
  document.body.classList.toggle("menu-mode", isim === "baslangic" || isim === "brif");
  G.faz = isim;
}
function saatGuncelle(metin) {
  $("#gorev-saat").textContent = metin;
}
function kutleTopla() {
  let k = G.modul ? G.modul.kutle : 0;
  G.donanim.forEach((a) => {
    const d = DONANIM.find((x) => x.anahtar === a);
    if (d) k += d.kutle;
  });
  return k;
}
function butceHarca() {
  let m = G.arac ? G.arac.maliyet : 0;
  if (G.modul) m += G.modul.maliyet;
  G.donanim.forEach((a) => {
    const d = DONANIM.find((x) => x.anahtar === a);
    if (d) m += d.maliyet;
  });
  return m;
}
function gucHesapla() {
  let harca = 0, uretim = 0, link = 0;
  G.donanim.forEach((a) => {
    const d = DONANIM.find((x) => x.anahtar === a);
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
  $("#kn-guc").textContent = say(guc.net) + " /s\xF6l";
  $("#kn-guc").classList.toggle("asr", guc.net < 0);
  $("#kn-yakit").textContent = say(G.yakit);
  $("#kn-bilim").textContent = say(G.yuzey.bilim, 0);
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
    for (let i = 0; i < 40; i++) ctx.fillRect(i * 137 % w, i * 89 % h, 4, 4);
  }
}
function yuzeySeridi(ctx, y, w, tint) {
  const zemin = resim("ay_yuzeyi");
  for (let x = 0; x < w; x += 86) {
    if (zemin && zemin.complete && zemin.naturalWidth) ctx.drawImage(zemin, x, y, 86, 84);
    else {
      ctx.fillStyle = "#9BA0AE";
      ctx.fillRect(x, y, 86, 84);
    }
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
function misyonlariUret() {
  const havuz = [...BRIFLER];
  const secim = [];
  [1, 2, 3].forEach((z) => {
    const adaylar = havuz.filter((b2) => b2.zorluk === z);
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
      ...b,
      hedef,
      modifiyeler: mods,
      sols: ZORLUK_SOL[b.zorluk],
      gokCisim,
      kod: "MS-" + (100 + Math.floor(rng() * 899))
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
    b.innerHTML = '<span class="gorev-ust"><span class="gorev-kod">' + m.kod + '</span><span class="gorev-zorluk z' + m.zorluk + '">' + ZORLUK_AD[m.zorluk] + '</span></span><span class="gorev-ad">' + m.ad + '</span><span class="gorev-hedef"><img src="' + m.gokCisim.img + '" alt="">' + m.gokCisim.ad + " \xB7 " + m.gokCisim.atmosfer + ' atmosfer</span><span class="gorev-metin">' + m.metin + '</span><span class="gorev-modlar">' + (m.modifiyeler.length ? m.modifiyeler.map((x) => x.ad + " \u2014 " + x.metin).join(" \xB7 ") : "Sakin ortam \u2014 meteorit yok, enerji d\xFCzenli.") + '</span><span class="gorev-alt"><span class="gorev-sure">' + m.sols + " s\xF6l \xB7 \xF6d\xFCl +" + m.odul + ' puan</span><span class="gorev-sec">' + (G.brif === m ? "\u2713 se\xE7ildi" : "se\xE7") + '</span></span><span class="gorev-oneri">\xD6neri: ' + (ARACLAR.find((x) => x.anahtar === m.arac) || {}).ad + " + " + (MODULLER.find((x) => x.anahtar === m.modul) || {}).ad + "</span>";
    b.addEventListener("click", () => {
      sesAc();
      ses("tik");
      brifSec(m);
    });
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
  if (!b) {
    kart.hidden = true;
    return;
  }
  kart.hidden = false;
  $("#brif-kod").textContent = b.kod;
  $("#brif-ad").textContent = b.ad;
  const z = $("#brif-zorluk");
  z.textContent = ZORLUK_AD[b.zorluk] + " \xB7 " + b.sols + " s\xF6l";
  z.className = "gorev-zorluk z" + b.zorluk;
  $("#brif-hedef").textContent = b.metin + "  \xD6d\xFCl: +" + b.odul + " puan.";
  const hImg = $("#brif-gok-cisim");
  if (hImg && b.gokCisim) {
    hImg.src = b.gokCisim.img;
    hImg.alt = b.gokCisim.ad;
    hImg.hidden = false;
  }
  const hYazi = $("#brif-gok-cisim-yazi");
  if (hYazi && b.gokCisim) hYazi.textContent = b.gokCisim.ad + " \xB7 " + b.gokCisim.not;
  const modUl = $("#brif-modlar");
  modUl.innerHTML = "";
  if (!b.modifiyeler.length) {
    const li = document.createElement("li");
    li.textContent = "Sakin ortam \u2014 meteorit ya\u011Fmaz, enerji d\xFCzenli gelir.";
    modUl.appendChild(li);
  } else {
    b.modifiyeler.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = m.ad + " \u2014 " + m.metin;
      modUl.appendChild(li);
    });
  }
  onerilenGuncelle();
}
function onerilenGuncelle() {
  const kap = $("#onerilen-liste");
  if (!kap || !G.brif) return;
  kap.innerHTML = "";
  const ekle = /* @__PURE__ */ __name((ad, seciliMi) => {
    const span = document.createElement("span");
    span.className = "onerilen-chip " + (seciliMi ? "var" : "yok");
    span.innerHTML = "<b>" + (seciliMi ? "\u2713" : "\uFF0B") + "</b> " + ad;
    kap.appendChild(span);
  }, "ekle");
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
  if (!b) return { basarili: false, metin: "\u2014" };
  if (b.olcu === "iletilen")
    return { basarili: y.iletilen >= b.hedef, metin: say(y.iletilen, 0) + " / " + b.hedef + " birim iletildi" };
  if (b.olcu === "gece")
    return { basarili: y.geceler >= b.hedef, metin: y.geceler + " / " + b.hedef + " gece atlat\u0131ld\u0131" };
  if (b.olcu === "kesintisiz")
    return { basarili: y.kesintisiz >= b.hedef, metin: y.kesintisiz + " / " + b.hedef + " s\xF6l kesintisiz" };
  if (b.olcu === "hassasiyet")
    return { basarili: G.inis.hassasiyet >= b.hedef, metin: "%" + Math.round(G.inis.hassasiyet * 100) + " hassasiyet (hedef %" + Math.round(b.hedef * 100) + ")" };
  if (b.olcu === "butce")
    return { basarili: BUTCE - butceHarca() >= b.hedef, metin: say(BUTCE - butceHarca()) + " / " + b.hedef + " M$ rezerve" };
  if (b.olcu === "combo")
    return { basarili: y.iletilen >= 80 && y.geceler >= 1, metin: say(y.iletilen, 0) + " / 80 birim \xB7 " + y.geceler + " / 1 gece" };
  return { basarili: false, metin: "\u2014" };
}
function tasarimKur() {
  const aracKap = $("#arac-liste");
  ARACLAR.forEach((a) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "secenek";
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", "false");
    b.innerHTML = '<img src="' + a.img + '" alt=""><span class="sec-metin"><span class="sec-ad">' + a.ad + '</span><span class="sec-ozet tabular">' + a.kapasite + " kg y\xFCk \xB7 " + say(a.maliyet, 0) + " M$ \xB7 g\xFCvenilirlik %" + Math.round(a.guven * 100) + "</span></span>";
    b.addEventListener("click", () => {
      sesAc();
      ses("tik");
      G.arac = a;
      logChallengeAction("arac", { anahtar: a.anahtar });
      tasarimSecGuncelle();
      tasarimDenetim();
    });
    aracKap.appendChild(b);
    a.htm = b;
  });
  const modulKap = $("#modul-liste");
  MODULLER.forEach((m) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "secenek";
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", "false");
    b.innerHTML = '<img src="' + m.img + '" alt=""><span class="sec-metin"><span class="sec-ad">' + m.ad + '</span><span class="sec-ozet tabular">' + m.kutle + " kg \xB7 " + say(m.maliyet, 0) + " M$ \xB7 " + m.yakit + " yak\u0131t \xB7 itki " + m.itus + "</span></span>";
    b.addEventListener("click", () => {
      sesAc();
      ses("tik");
      G.modul = m;
      G.yakit = m.yakit;
      logChallengeAction("modul", { anahtar: m.anahtar });
      tasarimSecGuncelle();
      tasarimDenetim();
    });
    modulKap.appendChild(b);
    m.htm = b;
  });
  const donKap = $("#donanim-liste");
  DONANIM.forEach((d) => {
    const satir = document.createElement("div");
    satir.className = "donanim uyar";
    const ozetler = [];
    if (d.kutle) ozetler.push(d.kutle + " kg");
    if (d.maliyet) ozetler.push(say(d.maliyet, 1) + " M$");
    if (d.guc) ozetler.push("\u2212" + d.guc + "/s\xF6l");
    if (d.uretim) ozetler.push("+" + d.uretim + "/s\xF6l");
    if (d.kapasite) ozetler.push(d.kapasite + " depo");
    if (d.bilim) ozetler.push("+" + d.bilim + " bilim/s\xF6l");
    if (d.sabit) ozetler.push("+" + d.sabit + " bilim");
    const li = document.createElement("label");
    li.className = "donanim-baslik";
    li.innerHTML = '<span class="dolap"><input type="checkbox" data-don="' + d.anahtar + '" aria-label="' + d.ad + '"></span><img src="' + d.img + '" alt=""><span><b>' + d.ad + "</b> <i class='tabular' style='font-size:11px;color:var(--murekkep-2)'>" + ozetler.join(" \xB7 ") + "</i></span>";
    const notP = document.createElement("p");
    notP.className = "donanim-uzgun";
    notP.style.display = "none";
    notP.textContent = d.not || "";
    satir.appendChild(li);
    satir.appendChild(notP);
    const kutu = li.querySelector("input");
    kutu.addEventListener("change", () => {
      sesAc();
      ses("tik");
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
  $("#btn-tasarim-onay").addEventListener("click", () => {
    logChallengeAction("tasarimOnay", {});
    sesAc();
    ses("onay");
    firlatmayaGec();
  });
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
  const set = /* @__PURE__ */ __name((liste, secili) => liste.forEach((x) => {
    x.htm.classList.toggle("secili", x === secili);
    x.htm.setAttribute("aria-checked", x === secili ? "true" : "false");
  }), "set");
  set(ARACLAR, G.arac);
  set(MODULLER, G.modul);
}
function tasarimDenetim() {
  kaynakGuncelle();
  const durum = $("#tasarim-durum");
  const btn = $("#btn-tasarim-onay");
  const sorunlar = [];
  if (!G.arac) sorunlar.push("F\u0131rlatma arac\u0131 se\xE7ilmedi.");
  if (!G.modul) sorunlar.push("\u0130ni\u015F mod\xFCl\xFC se\xE7ilmedi.");
  const harca = butceHarca();
  if (harca > BUTCE) sorunlar.push("B\xFCt\xE7e a\u015F\u0131ld\u0131: " + say(harca) + " / " + BUTCE + " M$.");
  if (G.arac && kutleTopla() > G.arac.kapasite)
    sorunlar.push("K\xFCtle pay\u0131 a\u015F\u0131ld\u0131: " + say(kutleTopla()) + " / " + G.arac.kapasite + " kg.");
  if (G.arac) {
    const guc = gucHesapla();
    if (guc.net < 0 && !G.donanim.has("pil"))
      sorunlar.push("Enerji dengesi negatif ve pil yok: g\xFCnd\xFCz \xFCretimin harcamay\u0131 kar\u015F\u0131lam\u0131yor.");
    else if (guc.net < 0)
      sorunlar.push("G\xFCnl\xFCk g\xFC\xE7 a\xE7\u0131\u011F\u0131 var: g\xFCnd\xFCz \xFCretimi harcamay\u0131 kar\u015F\u0131lam\u0131yor, pil geceyi kurtarmaz.");
    if (!G.donanim.has("anten_k") && !G.donanim.has("anten_b"))
      sorunlar.push("Anten yok: veri D\xFCnya'ya iletemezsin, bu bilimin yar\u0131s\u0131 \xE7\xF6pe gider.");
  }
  if (sorunlar.length === 0) {
    durum.textContent = "Tasar\u0131m onayland\u0131 \u2014 g\xF6rev y\xF6netimi f\u0131rlatmaya izin veriyor.";
    durum.classList.add("tamam");
    durum.classList.remove("uyari");
    btn.disabled = false;
    btn.removeAttribute("title");
  } else {
    durum.innerHTML = sorunlar.join("<br>");
    durum.classList.add("uyari");
    durum.classList.remove("tamam");
    btn.disabled = true;
    btn.title = "Tasar\u0131m onay\u0131 bekliyor: " + sorunlar.join(" ");
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
    etiket(ctx, G.arac.ad.toLowerCase() + " \xB7 " + G.arac.kapasite + " kg pay", aracX, zeminY + 24);
  }
  const modulX = 30, modulBoy = 100;
  let modulG = 0;
  if (G.modul) {
    const im = resim("inis_arac\u0131");
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
    etiket(ctx, G.modul.ad.toLowerCase() + " \xB7 " + G.modul.yakit + " yak\u0131t", modulX + modulG / 2, zeminY + 24);
  }
  const antAnahtar = G.donanim.has("anten_b") ? "anten_b" : G.donanim.has("anten_k") ? "anten_k" : null;
  if (antAnahtar) {
    const im = resim(antAnahtar);
    if (im && im.complete) {
      const antBoy = antAnahtar === "anten_b" ? 86 : 76;
      const antG = antBoy * (im.naturalWidth / im.naturalHeight);
      const ax = modulX + modulG + 12;
      ctx.drawImage(im, ax, zeminY - antBoy, antG, antBoy);
      etiket(ctx, antAnahtar === "anten_b" ? "b\xFCy\xFCk anten" : "k\xFC\xE7\xFCk anten", ax + antG / 2, zeminY + 24);
    }
  }
  const yukler = DONANIM.filter((d) => G.donanim.has(d.anahtar) && !["pil", "panel", "anten_b", "anten_k"].includes(d.anahtar));
  const rafSatir = new Set(yukler.map((d, i) => Math.floor(i / 2)));
  rafSatir.forEach((s) => {
    const y = 300 - s * 88;
    ctx.fillStyle = "rgba(35,37,47,0.55)";
    ctx.fillRect(20, y - 1, 156, 3);
  });
  yukler.forEach((d, i) => {
    const im = resim(d.anahtar);
    if (!im || !im.complete) return;
    const boy = 56, g = Math.min(56, boy * (im.naturalWidth / im.naturalHeight));
    const x = 26 + i % 2 * 74;
    const y = 300 - Math.floor(i / 2) * 88;
    ctx.drawImage(im, x, y - boy, g, boy);
    etiket(ctx, d.ad.toLowerCase(), x + g / 2, y + 18);
  });
  if (!G.arac && !G.modul && yukler.length === 0) {
    ctx.fillStyle = "rgba(237,231,214,0.7)";
    ctx.font = "16px 'IBM Plex Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("K\u0131v\u0131lc\u0131m \xB7 Y\xFCkseli\u015F \xB7 Sefer \u2014 hangisi senin g\xF6revini ta\u015F\u0131yacak?", w / 2, 140);
    ctx.fillText("Se\xE7tik\xE7e ara\xE7 burada kurulur.", w / 2, 166);
  }
}
function firlatmayaGec() {
  ekranAc("firlatma");
  const f = G.firlatma;
  f.durum = "hazir";
  f.t = 0;
  f.hamle = null;
  f.dogruluk = 0;
  f.merkez = rast(0.34, 0.66);
  $("#firlatma-yazi").textContent = "Renkli pencere ara\xE7 g\xFCvenilirli\u011Fi kadar geni\u015F (toplam % " + Math.round(G.arac.pencere * 100) + "). \u0130lk FIRLAT geri say\u0131m\u0131 ba\u015Flat\u0131r; ikincisi pencerede yakalar.";
  saatGuncelle("geri say\u0131m bekleniyor");
  kaynakGuncelle();
}
function firlatmaTikla() {
  const f = G.firlatma;
  logChallengeAction("launchClick", {});
  if (f.durum === "hazir") {
    f.durum = "canli";
    f.t = 0;
    ses("tik");
    return;
  }
  if (f.durum !== "canli") return;
  const hiz = 0.9 / G.arac.pencere;
  const konum = 0.5 + 0.45 * Math.sin(f.t * hiz);
  const yari = G.arac.pencere / 2;
  const fark = Math.abs(konum - f.merkez);
  f.dogruluk = fark <= yari ? 1 - fark / (yari * 1.3) : Math.max(0, 0.25 - fark / 0.4);
  f.hamle = konum;
  const sanc = fark <= yari ? G.arac.guven * (0.88 + 0.12 * f.dogruluk) : G.arac.guven * 0.22 * f.dogruluk;
  const tuttu = rng() < sanc;
  f.durum = tuttu ? "ucus" : "patlak";
  f.t = 0;
  if (tuttu) {
    ses("firlat");
    saatGuncelle("y\xFCkseli\u015F \u2014 burun a\u015Fa\u011F\u0131, tutum iyi");
  } else {
    ses("hata");
    saatGuncelle("f\u0131rlatma kazas\u0131");
  }
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
    etiket(ctx, f.durum === "hazir" ? "geri say\u0131m bekleniyor" : "T\u22120 \u2014 pencereyi yakala", w / 2, zeminY + 14);
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
    if (f.t > 2.8) {
      seyireGec();
      return;
    }
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
      raporaGec(
        "F\u0131rlatma kazas\u0131",
        "Pencere d\u0131\u015F\u0131nda ate\u015Fledin. Ara\xE7 g\xFCvenilirli\u011Fi kadar talih de gerekirdi; k\xFC\xE7\xFCk ara\xE7 h\u0131zl\u0131 pencere ta\u015F\u0131r, b\xFCy\xFCk ara\xE7 affedicidir.",
        "firlatma"
      );
      return;
    }
  }
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
  etiket(ctx, "f\u0131rlatma penceresi", (gX0 + gX1) / 2, gY + 44);
}
function seyireGec() {
  ekranAc("seyir");
  const s = G.seyir;
  s.t = 0;
  s.durum = "bekleme";
  s.guvence = false;
  $("#seyir-karar-metin").textContent = G.yakit > 26 ? "Yak\u0131t tank\u0131n dolu: ini\u015F i\xE7in bolca var; bir at\u0131\u015F\u0131 da seyir i\xE7in ay\u0131rabilirsin." : "Yak\u0131t gergin: ini\u015F i\xE7in laz\u0131m \u2014 ama arabulucu at\u0131\u015F\u0131 yapmazsan Ay sana uzak kal\u0131r.";
  $("#seyir-karar").hidden = false;
  saatGuncelle("D\xFCnya\u2013Ay seyri");
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
  const rizika = s.guvence ? 0.02 : 0.2;
  $("#seyir-karar").hidden = true;
  kaynakGuncelle();
  if (rng() < rizika) {
    s.durum = "patlak";
    ses("hata");
    saatGuncelle("seyir kayb\u0131");
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
      ctx.lineTo(x + g / 2, y + boy + 14 + rng() * 8);
      ctx.fill();
    }
  }
  if (s.durum === "patlak") {
    const p = resim("patlama");
    if (p && p.complete) ctx.drawImage(p, w / 2 - 86, h / 2 - 100, 172, 147);
    if (s.t > 2.4) {
      raporaGec(
        "Seyir kayb\u0131",
        "Yak\u0131t ay\u0131rmad\u0131n; seyir d\xFCzeltmesi yap\u0131lamad\u0131 ve ara\xE7 Ay \xE7ekim alan\u0131nda y\xF6r\xFCngeden \xE7\u0131kt\u0131.",
        "seyir"
      );
      return;
    }
  }
  if (s.durum === "ucus" && s.t > 5.2) iniseGec();
}
function iniseGec() {
  ekranAc("inis");
  const i = G.inis;
  i.durum = "inis";
  i.hassasiyet = 0;
  i.sayac = 0;
  i.pad = rast(180, 700);
  i.lander = {
    x: rast(140, 700),
    y: -70,
    vx: rast(-26, 26),
    vy: rast(12, 28),
    yakit: G.yakit,
    itus: G.modul.itus
  };
  saatGuncelle("Ay ini\u015Fi \u2014 canl\u0131 telemetri");
  kaynakGuncelle();
}
function inisTusKur() {
  const c = $("#inis-kanvas");
  const inisKeyLog = ["Space", "ArrowUp", "KeyW", "KeyS", "ArrowDown", "ArrowLeft", "KeyA", "ArrowRight", "KeyD"];
  document.addEventListener("keydown", (e) => {
    if (G.faz !== "inis") return;
    if (inisKeyLog.includes(e.code)) logChallengeAction("inisKey", { key: e.code, down: true });
    if (e.code === "Space" || e.code === "KeyW" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!e.repeat) {
        sesAc();
        inisTuslari.itki = true;
      }
    } else if (e.code === "KeyS" || e.key === "ArrowDown") {
      e.preventDefault();
      if (!e.repeat) {
        sesAc();
        inisTuslari.yarim = true;
      }
    } else if (e.key === "ArrowLeft" || e.code === "KeyA") {
      e.preventDefault();
      inisTuslari.sol = true;
    } else if (e.key === "ArrowRight" || e.code === "KeyD") {
      e.preventDefault();
      inisTuslari.sag = true;
    }
  });
  document.addEventListener("keyup", (e) => {
    const inisKeyLog2 = ["Space", "ArrowUp", "KeyW", "KeyS", "ArrowDown", "ArrowLeft", "KeyA", "ArrowRight", "KeyD"];
    if (inisKeyLog2.includes(e.code)) logChallengeAction("inisKey", { key: e.code, down: false });
    if (e.code === "Space" || e.code === "KeyW" || e.key === "ArrowUp") inisTuslari.itki = false;
    else if (e.code === "KeyS" || e.key === "ArrowDown") inisTuslari.yarim = false;
    else if (e.key === "ArrowLeft" || e.code === "KeyA") inisTuslari.sol = false;
    else if (e.key === "ArrowRight" || e.code === "KeyD") inisTuslari.sag = false;
  });
  c.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    sesAc();
    const kutu = c.getBoundingClientRect();
    const oran = (e.clientX - kutu.left) / kutu.width;
    inisTuslari.itki = true;
    inisTuslari.yarim = false;
    inisTuslari.sol = inisTuslari.sag = false;
    if (oran < 0.42) inisTuslari.sol = true;
    if (oran > 0.58) inisTuslari.sag = true;
  });
  c.addEventListener("pointerup", () => {
    inisTuslari.itki = inisTuslari.yarim = inisTuslari.sol = inisTuslari.sag = false;
  });
  c.addEventListener("pointercancel", () => {
    inisTuslari.itki = inisTuslari.yarim = inisTuslari.sol = inisTuslari.sag = false;
  });
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
  etiket(ctx, "ini\u015F b\xF6lgesi \xB7 " + G.hedef.ad, i.pad, zeminY + 26);
  const bIm = resim("bayrak");
  if (bIm && bIm.complete) ctx.drawImage(bIm, sinir(0, i.pad + 70, w - 46), zeminY - 58, 44, 46);
  if (!L) return;
  const im = resim("inis_arac\u0131");
  const boy = 66;
  const g = im && im.complete && im.naturalWidth ? boy * (im.naturalWidth / im.naturalHeight) : boy;
  if (i.durum === "inis") {
    const cer = Math.min(dt, 0.05);
    L.vy += G.hedef.cekim * cer;
    let itkiGucu = 0;
    if (inisTuslari.itki && L.yakit > 0) itkiGucu = 1;
    else if (inisTuslari.yarim && L.yakit > 0) itkiGucu = 0.5;
    if (itkiGucu > 0) {
      L.vy -= L.itus * itkiGucu * cer;
      L.yakit = Math.max(0, L.yakit - 7 * itkiGucu * cer);
    }
    if (inisTuslari.sol && L.yakit > 0) {
      L.vx -= L.itus * 0.32 * cer;
      L.yakit = Math.max(0, L.yakit - 2.5 * cer);
    }
    if (inisTuslari.sag && L.yakit > 0) {
      L.vx += L.itus * 0.32 * cer;
      L.yakit = Math.max(0, L.yakit - 2.5 * cer);
    }
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
        saatGuncelle("ini\u015F tamam \u2014 ayakta");
        L.vy = 0;
        L.vx = 0;
      } else {
        i.durum = "kaza";
        i.sayac = 0;
        ses("hata");
        saatGuncelle("ini\u015F kazas\u0131");
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
      if (Math.abs(L.vy) > 62) nedenler.push("d\xFC\u015F\xFC\u015F h\u0131z\u0131 " + Math.abs(Math.round(L.vy * 0.4)) + " m/s (s\u0131n\u0131r 25)");
      if (Math.abs(L.vx) > 26) nedenler.push("yan h\u0131z " + Math.abs(Math.round(L.vx * 0.4)) + " m/s (s\u0131n\u0131r 10)");
      if (L.yakit === 0) nedenler.push("yak\u0131t tamamen bitti \u2014 motor sustu");
      raporaGec("\u0130ni\u015F kazas\u0131", nedenler.join("; ") + ".", "inis");
      return;
    }
  }
  if (i.durum === "basarili") {
    i.sayac += dt;
    if (i.sayac > 1.4) yuzeyeGec();
  }
}
function yuzeyeGec() {
  ekranAc("yuzey");
  const y = G.yuzey;
  y.sol = 1;
  y.tampon = 0;
  y.bilim = 0;
  y.gunesKesik = false;
  y.bitti = false;
  y.pilBitti = false;
  y.bayrakDikildi = false;
  y.antenArizasi = false;
  y.iletilen = 0;
  y.geceler = 0;
  y.kesintisiz = 0;
  y.pilKap = 30;
  G.donanim.forEach((a) => {
    const d = DONANIM.find((x) => x.anahtar === a);
    if (d && d.kapasite) y.pilKap += d.kapasite;
  });
  const kapCarpan = modDeger("kapasiteCarpan");
  if (kapCarpan) y.pilKap = Math.round(y.pilKap * kapCarpan);
  y.pil = y.pilKap * 0.8;
  y.aktif = new Set(
    [...G.donanim].filter((a) => {
      const d = DONANIM.find((x) => x.anahtar === a);
      return d && d.bilim;
    })
  );
  $("#btn-sol-basyaz").disabled = false;
  yuzeyGecisleriKur();
  yuzeyCiz();
  $("#yuzey-gunluk").textContent = "Y\xFCzeye sa\u011F \xE7\u0131kt\u0131n. Cihazlar\u0131 a\xE7, s\xF6l\xFC ba\u015Flat, veriyi zaman\u0131nda ilet.";
  saatGuncelle("S\xF6l 1 / " + misyonSols());
  kaynakGuncelle();
}
function misyonSols() {
  return G.brif ? G.brif.sols : 10;
}
function yuzeyGecisleriKur() {
  const kap = $("#cihaz-gecisleri");
  kap.innerHTML = "";
  const bilimler = DONANIM.filter((d) => d.bilim && G.donanim.has(d.anahtar));
  if (bilimler.length === 0) {
    const p = document.createElement("p");
    p.className = "not";
    p.textContent = "\xC7al\u0131\u015Facak bilim cihaz\u0131 yok \u2014 tasar\u0131m faz\u0131nda bilim y\xFCk\xFC se\xE7melisin.";
    kap.appendChild(p);
    return;
  }
  bilimler.forEach((d) => {
    const li = document.createElement("label");
    li.className = "cihaz-satir";
    li.innerHTML = '<span class="dolap"><input type="checkbox" data-cihaz="' + d.anahtar + '" aria-label="' + d.ad + '"></span><img src="' + d.img + '" alt=""><span>' + d.ad + " <i class='tabular' style='font-size:10px;color:var(--murekkep-2)'>\u2212" + d.guc + "/s\xF6l \xB7 +" + d.bilim + "</i></span>";
    const kutu = li.querySelector("input");
    kutu.checked = y_aktifMi(d.anahtar);
    kutu.parentElement.classList.toggle("isaretli", kutu.checked);
    kutu.addEventListener("change", () => {
      if (kutu.checked) G.yuzey.aktif.add(d.anahtar);
      else G.yuzey.aktif.delete(d.anahtar);
      kutu.parentElement.classList.toggle("isaretli", kutu.checked);
      ses("tik");
    });
    kap.appendChild(li);
  });
}
function y_aktifMi(anahtar) {
  return G.yuzey.aktif.has(anahtar);
}
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
  const m = resim("inis_arac\u0131");
  if (m && m.complete) ctx.drawImage(m, bes - 70, zeminY - 96, 62, 86);
  const bIm = resim("bayrak");
  if (y.bayrakDikildi && bIm && bIm.complete) ctx.drawImage(bIm, bes + 14, zeminY - 62, 38, 40);
  const cihazlar = DONANIM.filter((d) => G.donanim.has(d.anahtar) && !["bayrak", "pil", "panel", "anten_b", "anten_k"].includes(d.anahtar));
  cihazlar.forEach((d, i) => {
    const im = resim(d.anahtar);
    if (!(im && im.complete)) return;
    const boy = 64, g = Math.min(64, boy * (im.naturalWidth / im.naturalHeight));
    const x = bes - 250 + i * 76;
    ctx.globalAlpha = y.aktif.has(d.anahtar) || !d.bilim ? 1 : 0.4;
    ctx.drawImage(im, x, zeminY - boy, g, boy);
    ctx.globalAlpha = 1;
    etiket(ctx, d.ad.toLowerCase() + (y.aktif.has(d.anahtar) ? "" : " \xB7 kapal\u0131"), x + g / 2, zeminY + 24);
  });
  const aIm = resim(G.donanim.has("anten_b") ? "anten_b" : G.donanim.has("anten_k") ? "anten_k" : null);
  if (aIm && aIm.complete) {
    const boy = 74, g = boy * (aIm.naturalWidth / aIm.naturalHeight);
    ctx.drawImage(aIm, bes + 130, zeminY - boy, g, boy);
    etiket(ctx, (G.donanim.has("anten_b") ? "b\xFCy\xFCk" : "k\xFC\xE7\xFCk") + " anten", bes + 150 + g / 2 - 20, zeminY + 24);
  }
  const pIm = resim("panel");
  if (G.donanim.has("panel") && pIm && pIm.complete) {
    ctx.drawImage(pIm, bes - 170, zeminY - 70, 84, 63);
  }
  if (G.hedef.anahtar === "mars") {
    const rIm = resim("mars_rover");
    if (rIm && rIm.complete) {
      const boy = 66, g = boy * (rIm.naturalWidth / rIm.naturalHeight);
      ctx.drawImage(rIm, 18, zeminY - boy, g, boy);
      etiket(ctx, "rover", 18 + g / 2, zeminY + 24);
    }
  }
  if (G.hedef.anahtar === "venus") {
    const vIm = resim("venus_bulut");
    if (vIm && vIm.complete) {
      ctx.globalAlpha = 0.75;
      ctx.drawImage(vIm, 0, 0, w, h * 0.38);
      ctx.globalAlpha = 1;
    }
  }
  yuzeyOzetYaz();
}
function yuzeyOzetYaz() {
  const y = G.yuzey;
  const toplamSol = misyonSols();
  const gunduzMu = (y.sol - 1) % 6 !== 5;
  const calisan = [...y.aktif].map((a) => (DONANIM.find((d) => d.anahtar === a) || {}).ad).join(", ");
  $("#yuzey-gunosu").textContent = "S\xF6l " + Math.min(y.sol, toplamSol) + " / " + toplamSol + (gunduzMu ? " \u2014 g\xFCne\u015F a\xE7\u0131k" : " \u2014 AY GECES\u0130 (panel \xE7al\u0131\u015Fmaz)");
  $("#yuzey-ozet").textContent = "Cihazlar: " + (calisan || "yok") + " \xB7 tampon " + say(y.tampon, 0) + " birim" + (y.gunesKesik ? " \xB7 G\xDCNE\u015E KES\u0130NT\u0130S\u0130" : "") + (y.antenArizasi ? " \xB7 ANTEN ARIZALI" : "");
  const oran = y.pilKap ? sinir(0, y.pil / y.pilKap, 1) : 0;
  const cubuk = $("#yuzey-pil");
  cubuk.style.transform = "scaleX(" + oran.toFixed(3) + ")";
  cubuk.classList.toggle("boscak", oran < 0.25);
  $("#yuzey-pil-yazi").textContent = say(y.pil, 0) + " / " + say(y.pilKap, 0) + " birim";
  const brifSatir = $("#yuzey-brif");
  if (brifSatir && G.brif) {
    const d = brifDurumu();
    brifSatir.textContent = "Brifing \xB7 " + G.brif.ad + " \u2014 " + d.metin + (d.basarili ? " \u2713" : "");
    brifSatir.classList.toggle("tamam", d.basarili);
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
    G.donanim.forEach((a) => {
      const d = DONANIM.find((x) => x.anahtar === a);
      if (d && d.uretim) hasat += d.uretim;
    });
    const carpan = modDeger("hasatCarpan");
    if (carpan) hasat = Math.round(hasat * carpan);
    const eksik = modDeger("hasatEksik");
    if (eksik) hasat = Math.max(0, hasat - eksik);
  }
  if (hasat) {
    y.pil = sinir(0, y.pil + hasat, y.pilKap);
    gunluk.push("Panel +" + hasat + " birim \u015Farj verdi.");
  }
  const cihazSayisi = y.aktif.size;
  let uretilen = 0, calisan = 0;
  [...y.aktif].forEach((a) => {
    const d = DONANIM.find((x) => x.anahtar === a);
    if (!d) return;
    if (y.pil >= d.guc) {
      y.pil -= d.guc;
      y.tampon += d.bilim;
      uretilen += d.bilim;
      calisan++;
    } else {
      gunluk.push(d.ad.toLowerCase() + " enerji yetmedi\u011Finden bu s\xF6l \xE7al\u0131\u015Famad\u0131.");
      y.aktif.delete(a);
      const kutu = document.querySelector('input[data-cihaz="' + a + '"]');
      if (kutu) {
        kutu.checked = false;
        kutu.parentElement.classList.remove("isaretli");
      }
    }
  });
  if (uretilen) gunluk.push("Cihazlar tampona +" + uretilen + " birim veri yazd\u0131.");
  if (cihazSayisi > 0 && calisan === cihazSayisi) y.kesintisiz++;
  else y.kesintisiz = 0;
  const sakinMi = modDeger("sakin") !== null;
  const meteoritSans = sakinMi ? 0 : modDeger("hasatCarpan") === 1.5 ? 0.2 : 0.1;
  const zar = rng();
  if (zar < meteoritSans) {
    y.pil = sinir(0, y.pil - 8, y.pilKap);
    gunluk.push("M\u0130KROMETEOR\u0130T \u2014 pil \u22128 birim.");
  } else if (zar < meteoritSans + 0.07) {
    y.gunesKesik = true;
    gunluk.push("G\xDCNE\u015E PATLAMASI \u2014 hasat bir s\xF6l boyu kesildi.");
  } else if (zar < meteoritSans + 0.13 && y.aktif.has("sismo")) {
    y.tampon += 4;
    gunluk.push("AY DEPREM\u0130 \u2014 sismometre nadir kay\u0131t, tampon +4.");
  } else if (zar < meteoritSans + 0.18) {
    y.pil = sinir(0, y.pil - 4, y.pilKap);
    gunluk.push("TOZ BULUTU \u2014 paneller kirlendi, pil \u22124 birim.");
  } else if (zar < meteoritSans + 0.22) {
    y.antenArizasi = true;
    gunluk.push("ANTEN ARIZASI \u2014 bu s\xF6l veri iletilemiyor.");
  } else if (zar < meteoritSans + 0.26) {
    y.pil = sinir(0, y.pil - 5, y.pilKap);
    gunluk.push("P\u0130L SIZINTISI \u2014 pil \u22125 birim.");
  }
  if (!y.bayrakDikildi) {
    if (G.donanim.has("bayrak")) {
      y.bayrakDikildi = true;
      y.bilim += 2;
      gunluk.push("Bayrak dikildi (+2 bilim).");
    }
  }
  if (!gunduzMu) geceMi = true;
  y.sol++;
  yuzeyCiz();
  $("#yuzey-gunluk").textContent = gunluk.join("\n") || "S\xF6l sessiz ge\xE7ti.";
  kaynakGuncelle();
  const toplamSol = misyonSols();
  if (geceMi && y.pil > 1e-3) y.geceler++;
  if (y.sol > toplamSol) {
    y.bitti = true;
    raporYuzeyden(toplamSol + " s\xF6l tamamland\u0131", "G\xF6rev plan\u0131n\u0131n tamam\u0131 i\u015Fletildi; kaps\xFCl raporu kapatt\u0131.");
  } else if (y.pil <= 1e-3) {
    if (y.tampon > 0) {
      y.pilBitti = true;
      $("#btn-sol-basyaz").disabled = true;
      $("#yuzey-gunluk").textContent += "\nP\u0130L BO\u015E \u2014 enstr\xFCmanlar durdu. Son veriyi ilet; iletmek g\xF6revi kapat\u0131r.";
    } else {
      y.bitti = true;
      raporYuzeyden("Enerji t\xFCkendi", "Pil tamamen bo\u015Fald\u0131, tamponda veri yoktu; kaps\xFCl kendini kapatt\u0131.");
    }
  }
  if (!y.bitti && !y.pilBitti) saatGuncelle("S\xF6l " + y.sol + " / " + toplamSol);
}
function veriIlet() {
  logChallengeAction("veri", {});
  const y = G.yuzey;
  const guc = gucHesapla();
  if (!guc.link) {
    $("#yuzey-gunluk").textContent = "ANTEN YOK \u2014 veri D\xFCnya'ya g\xF6nderilemiyor. Tasar\u0131m faz\u0131nda bu bedel \xF6dendi.";
    ses("hata");
    return;
  }
  if (y.antenArizasi) {
    $("#yuzey-gunluk").textContent = "ANTEN ARIZALI \u2014 bu s\xF6l iletim yok. Bir sonraki s\xF6le kadar bekle.";
    ses("hata");
    return;
  }
  if (y.tampon <= 0) {
    $("#yuzey-gunluk").textContent = "Tampondan veri \xE7\u0131kmaz \u2014 \xF6nce cihazlar\u0131 \xE7al\u0131\u015Ft\u0131r.";
    ses("tik");
    return;
  }
  let limit = guc.link;
  const karartma = modDeger("linkCarpan");
  const karartmaVar = karartma && y.sol % 3 === 0;
  if (karartmaVar) limit = Math.max(1, Math.round(limit * karartma));
  const giden = Math.min(y.tampon, limit);
  y.tampon -= giden;
  y.bilim += giden;
  y.iletilen += giden;
  const anten = G.donanim.has("anten_b") ? DONANIM.find((d) => d.anahtar === "anten_b") : DONANIM.find((d) => d.anahtar === "anten_k");
  if (anten && y.pil >= anten.guc) y.pil -= anten.guc;
  ses("onay");
  yuzeyCiz();
  $("#yuzey-gunluk").textContent = "DER\u0130N UZAY A\u011EI: " + say(giden, 0) + " birim veri D\xFCnya'ya iletildi" + (karartmaVar ? " (radyo karartmas\u0131: yar\u0131 kapasite)" : "") + ". Tampon kalan " + say(y.tampon, 0) + ".";
  kaynakGuncelle();
  if (y.pilBitti && y.tampon <= 0) {
    y.bitti = true;
    raporYuzeyden("Enerji t\xFCkendi", "Pil bitti; son iletim yap\u0131ld\u0131 ve kaps\xFCl kendini kapatt\u0131.");
  }
}
function raporYuzeyden(baslik, ozet) {
  const y = G.yuzey;
  if (y.tampon > 0) y.bilim += Math.round(y.tampon * 0.5);
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
function raporaGec(baslik, ozet, kaynak) {
  ekranAc("rapor");
  G.raporKaynak = kaynak;
  const satirlar = [];
  let puan = 0;
  let basarili;
  let tamaNotu = ozet;
  if (kaynak === "firlatma") {
    basarili = false;
    satirlar.push(["F\u0131rlatma", "pencere d\u0131\u015F\u0131nda ate\u015Flendi, ara\xE7 y\xFCkseli\u015Fte par\xE7aland\u0131", "0"]);
    satirlar.push(["\xD6\u011Fretiler", "k\xFC\xE7\xFCk ara\xE7 h\u0131zl\u0131 pencere ta\u015F\u0131r; b\xFCy\xFCk ara\xE7 affedicidir", "\u2014"]);
  } else if (kaynak === "seyir") {
    basarili = false;
    puan = G.firlatma.dogruluk * 20;
    satirlar.push(["F\u0131rlatma", say(G.firlatma.dogruluk * 100, 0) + " pencere hassasiyeti", "+" + say(G.firlatma.dogruluk * 20, 0)]);
    satirlar.push(["Seyir", "yak\u0131t ay\u0131r\u0131lmad\u0131, arabulucu at\u0131\u015F yap\u0131lamad\u0131, ara\xE7 kayboldu", "0"]);
    satirlar.push(["\xD6\u011Fretiler", "yak\u0131t her faz\u0131n sigortas\u0131d\u0131r \u2014 ini\u015Fe de seyire de pay ay\u0131r", "\u2014"]);
  } else if (kaynak === "inis") {
    basarili = false;
    puan = G.firlatma.dogruluk * 20;
    satirlar.push(["F\u0131rlatma", say(G.firlatma.dogruluk * 100, 0) + " pencere hassasiyeti", "+" + say(G.firlatma.dogruluk * 20, 0)]);
    satirlar.push(["\u0130ni\u015F", "g\xF6vde temas\u0131 emniyet s\u0131n\u0131rlar\u0131n\u0131 a\u015Ft\u0131; mod\xFCl mandallar\u0131 koptu", "0"]);
    satirlar.push(["\xD6\u011Fretiler", "d\xFC\u015F\xFC\u015F h\u0131z\u0131 s\u0131n\u0131r\u0131 25 m/s, yan h\u0131z 10 m/s \u2014 ge\xE7 yak\u0131t yakmak bedel \xF6detir", "\u2014"]);
  } else {
    const y = G.yuzey;
    const guc = gucHesapla();
    satirlar.push(["Hedef", G.hedef.ad + " (" + G.hedef.atmosfer + " atmosfer, \xE7ekim " + G.hedef.cekim + " birim)", "\u2014"]);
    satirlar.push(["F\u0131rlatma", say(G.firlatma.dogruluk * 100, 0) + " pencere hassasiyeti", "+" + say(G.firlatma.dogruluk * 20, 0)]);
    satirlar.push(["\u0130ni\u015F", say(G.inis.hassasiyet * 100, 0) + " b\xF6lge hassasiyeti", "+" + say(G.inis.hassasiyet * 15, 0)]);
    satirlar.push(["Toplanan bilim", say(y.bilim, 0) + " birim", "+" + say(y.bilim, 0)]);
    if (!guc.link) satirlar.push(["Anten yok", "tampon D\xFCnya'ya gidemedi \u2014 bilimin yar\u0131s\u0131 \xF6ld\xFC", "\u2014"]);
    else if (y.tampon > 1e-3) satirlar.push(["Kalan tampon", say(y.tampon, 0) + " birim (yar\u0131s\u0131 say\u0131ld\u0131)", "\u2014"]);
    const kalan = BUTCE - butceHarca();
    satirlar.push(["B\xFCt\xE7e ekonomisi", say(kalan) + " M$ rezerve", "+" + say(kalan * 0.6, 0)]);
    if (G.brif) {
      const d = brifDurumu();
      satirlar.push([
        "G\xF6rev brifingi",
        G.brif.ad + " (" + G.brif.kod + ") \u2014 " + d.metin,
        d.basarili ? "+" + G.brif.odul : "\u2014"
      ]);
    }
    puan = computeScore("yuzey").puan;
    basarili = true;
  }
  let nota;
  if (!basarili) nota = (baslik || "KAYIP").toUpperCase();
  else if (puan >= 150) nota = "S";
  else if (puan >= 110) nota = "A";
  else if (puan >= 70) nota = "B";
  else if (puan >= 35) nota = "C";
  else if (puan >= 15) nota = "D";
  else nota = "F";
  $("#rapor-baslik").textContent = "MenSpace \u2014 G\xF6rev Raporu";
  $("#rapor-nota").textContent = nota;
  const toplam = basarili ? say(puan, 0) : null;
  $("#rapor-ozet").textContent = basarili ? "G\xF6rev tamamland\u0131. Not " + nota + ", toplam puan " + toplam + "." + (G.brif ? brifDurumu().basarili ? " Brifing tutturuldu: " + G.brif.ad + "." : " Brifing tutmad\u0131: " + G.brif.ad + " \u2014 " + brifDurumu().metin + "." : "") : tamaNotu || "G\xF6rev tamamlanamad\u0131 \u2014 m\xFChendislik kurulu seni yeniden tasar\u0131ma davet ediyor.";
  $("#ekran-rapor .rapor").classList.toggle("basarisiz", !basarili);
  const stamp = $("#rapor-stamp");
  const stampIng = $("#rapor-stamp-img");
  stamp.hidden = false;
  stampIng.src = basarili ? "assets/inis_basarili.png" : "assets/inis_basarisiz.png";
  stampIng.alt = basarili ? "g\xF6rev ba\u015Far\u0131l\u0131" : "g\xF6rev kay\u0131p";
  const rozBox = $("#rapor-rozetler");
  rozBox.innerHTML = "";
  const rozetler = [];
  if (basarili) {
    if (G.inis.hassasiyet && G.inis.hassasiyet > 0) rozetler.push(["rozet_inis.png", "ba\u015Far\u0131l\u0131 ini\u015F"]);
    if (G.yuzey.sol > misyonSols()) rozetler.push(["rozet_sol.png", "tam plan"]);
    if (G.yuzey.iletilen >= 100) rozetler.push(["rozet_bagis.png", "100+ veri"]);
    if (nota === "S") rozetler.push(["rozet_s.png", "S s\u0131n\u0131f\u0131"]);
  }
  rozBox.hidden = rozetler.length === 0;
  rozetler.forEach(([src, label]) => {
    const d = document.createElement("div");
    d.className = "rapor-rozet";
    d.innerHTML = '<img src="assets/' + src + '" alt=""><span>' + label + "</span>";
    rozBox.appendChild(d);
  });
  const tb = $("#rapor-govde");
  tb.innerHTML = "";
  satirlar.forEach(([k, v, p]) => {
    const tr2 = document.createElement("tr");
    tr2.innerHTML = "<td>" + k + "</td><td>" + v + "</td><td>" + p + "</td>";
    tb.appendChild(tr2);
  });
  const tr = document.createElement("tr");
  tr.className = "buyuk";
  tr.innerHTML = "<td>TOPLAM</td><td></td><td>" + (basarili ? toplam : "\u2014") + "</td>";
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
  } catch (_) {
  }
  saatGuncelle(basarili ? "g\xF6rev tamamland\u0131" : "g\xF6rev kayb\u0131");
  updateChallengeReportUI();
  if (kaynak === "yuzey") G.yuzey.bitti = true;
}
function mulberry32(seed) {
  return function() {
    seed |= 0;
    seed = seed + 1831565813 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function criarRng(seed) {
  return mulberry32(seed);
}
function logChallengeAction(type, data) {
  if (!G.challenge || !G.challenge.log) return;
  G.challenge.log.push({ t: G.clock || 0, type, ...data || {} });
}
function applyOfficialAction(a) {
  if (!a || !a.type) return;
  switch (a.type) {
    case "brifing": {
      const m = (G.misyonlar || [])[a.index];
      if (m) {
        G.brif = m;
        G.hedef = m.gokCisim || HEDEFLER[0];
      }
      return;
    }
    case "arac": {
      const arac = ARACLAR.find((x) => x.anahtar === a.anahtar);
      if (arac) G.arac = arac;
      return;
    }
    case "modul": {
      const modul = MODULLER.find((x) => x.anahtar === a.anahtar);
      if (modul) {
        G.modul = modul;
        G.yakit = modul.yakit;
      }
      return;
    }
    case "donanim": {
      G.donanim = new Set(a.keys || []);
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
      seyirKarar(a.burn === true);
      return;
    }
    case "inisKey": {
      if (typeof inisTuslari === "undefined") return;
      if (a.key === "KeyW") inisTuslari.itki = !!a.down;
      else if (a.key === "KeyS") inisTuslari.yarim = !!a.down;
      else if (a.key === "KeyA") inisTuslari.sol = !!a.down;
      else if (a.key === "KeyD") inisTuslari.sag = !!a.down;
      return;
    }
    case "sol": {
      solYurut();
      return;
    }
    case "veri": {
      veriIlet();
      return;
    }
    default:
      return;
  }
}
function runOfficialChallenge(seed, actions) {
  challengeRandom = criarRng(seed);
  G = freshState();
  G.clock = 0;
  G.misyonlar = misyonlariUret();
  G.challenge = { seed, official: true };
  const acts = (actions || []).slice().sort((a, b) => (a.t || 0) - (b.t || 0));
  const dt = 1 / 60;
  let t = 0, i = 0;
  while (i < acts.length && t < 720) {
    const target = typeof acts[i].t === "number" ? acts[i].t : t;
    while (t < target) {
      const step = Math.min(dt, target - t);
      advanceGame(step);
      t += step;
    }
    applyOfficialAction(acts[i]);
    i++;
  }
  while (G.faz !== "rapor" && t < 720) {
    advanceGame(dt);
    t += dt;
  }
  if (G.faz !== "rapor") {
    return { ok: false, puan: 0, basarili: false, seconds: Math.round(t * 1e3) / 1e3 };
  }
  const kaynak = G.raporKaynak || "yuzey";
  const sc = computeScore(kaynak);
  const puan = Math.round(sc.puan * 10) / 10;
  return { ok: true, puan, basarili: sc.basarili, faz: G.faz, seconds: Math.round(t * 1e3) / 1e3 };
}
function advanceGame(dt) {
  G.clock = (G.clock || 0) + dt;
  if (G.faz === "firlatma") firlatmaCiz(dt);
  else if (G.faz === "seyir") seyirCiz(dt);
  else if (G.faz === "inis") inisCiz(dt);
  else if (G.faz === "tasarim") tasarimCiz();
  else if (G.faz === "yuzey") yuzeyCiz();
}
function dondur(zaman) {
  const dt = Math.min(0.05, (zaman - sonZaman) / 1e3 || 0.016);
  sonZaman = zaman;
  advanceGame(dt);
  requestAnimationFrame(dondur);
}
function bagla() {
  $("#btn-giris").addEventListener("click", () => {
    sesAc();
    ses("onay");
    ekranAc("brif");
  });
  $("#btn-official").addEventListener("click", () => {
    sesAc();
    ses("onay");
    startOfficialChallenge();
  });
  $("#btn-leaderboard").addEventListener("click", () => {
    sesAc();
    ses("tik");
    showLeaderboardPopup(true);
    refreshLeaderboardPopup();
  });
  $("#leaderboard-cancel").addEventListener("click", () => showLeaderboardPopup(false));
  $("#leaderboard-close").addEventListener("click", () => showLeaderboardPopup(false));
  $("#leaderboard-popup").addEventListener("click", (e) => {
    if (e.target.id === "leaderboard-popup") showLeaderboardPopup(false);
  });
  $("#leaderboard-form").addEventListener("submit", (event) => saveOfficialScore(event));
  $("#btn-lider-kaydet").addEventListener("click", () => {
    sesAc();
    ses("onay");
    showLeaderboardPopup(true);
  });
  $("#btn-brif-menu").addEventListener("click", () => {
    sesAc();
    ses("tik");
    ekranAc("baslangic");
  });
  $("#btn-brif-tasarim").addEventListener("click", () => {
    if (!G.brif) return;
    sesAc();
    ses("onay");
    ekranAc("tasarim");
    brifKartiGuncelle();
  });
  const pop = /* @__PURE__ */ __name((id, kutu) => {
    const k = $(kutu);
    if (!k) return;
    $(id).addEventListener("click", () => {
      sesAc();
      k.hidden = false;
    });
    k.addEventListener("click", (e) => {
      if (e.target === k) k.hidden = true;
    });
  }, "pop");
  pop("#btn-nasil", "#nasil");
  $("#btn-nasil-kapat").addEventListener("click", () => {
    $("#nasil").hidden = true;
  });
  pop("#btn-rekor", "#rekorlar-popup");
  $("#btn-rekorlar-kapat").addEventListener("click", () => {
    $("#rekorlar-popup").hidden = true;
  });
  $("#btn-kayit-sil").addEventListener("click", () => {
    try {
      localStorage.removeItem("menSpace.rekor");
    } catch (_) {
    }
    $("#rekor-satir").hidden = true;
    $("#menu-rekor-deger").textContent = "\u2014";
    sesAc();
    ses("tik");
  });
  $("#btn-firlat").addEventListener("click", () => {
    sesAc();
    firlatmaTikla();
  });
  $("#firlatma-kanvas").addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      sesAc();
      firlatmaTikla();
    }
  });
  $("#firlatma-kanvas").addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    e.preventDefault();
    sesAc();
    firlatmaTikla();
  });
  $("#btn-seyir-yakit").addEventListener("click", () => {
    sesAc();
    ses("onay");
    seyirKarar(true);
  });
  $("#btn-seyir-risk").addEventListener("click", () => {
    sesAc();
    ses("tik");
    seyirKarar(false);
  });
  $("#btn-sol-basyaz").addEventListener("click", () => {
    sesAc();
    solYurut();
  });
  $("#btn-yuzey-veri").addEventListener("click", () => {
    sesAc();
    veriIlet();
  });
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
    $("#btn-brif-tasarim").disabled = true;
    ekranAc("brif");
    saatGuncelle("g\xF6rev brifingi");
    brifKartiGuncelle();
  });
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && G.faz === "firlatma" && e.target === document.body) {
      e.preventDefault();
      sesAc();
      firlatmaTikla();
    }
  });
}
async function startOfficialChallenge() {
  try {
    const cevap = await fetch("/api/challenge", { cache: "no-store" });
    if (!cevap.ok) throw new Error("challenge error " + cevap.status);
    const data = await cevap.json();
    challengeRandom = criarRng(data.seed);
    setGlobalG(freshState());
    G.clock = 0;
    G.challenge = { official: true, challengeId: data.challengeId, seed: data.seed, log: [] };
    G.misyonlar = misyonlariUret();
    misyonKartlariCiz();
    $("#btn-brif-tasarim").disabled = true;
    ekranAc("brif");
    saatGuncelle("Official Challenge \u2014 \xF6nce bir brifing se\xE7");
  } catch (hata) {
    console.error("official challenge ba\u015Flat\u0131lamad\u0131", hata);
    hourDefault("Challenge sunucudan yan\u0131t alamad\u0131 \u2014 biraz sonra tekrar dene.", true);
  }
}
function hourDefault(msg, show) {
  const el = $("#leaderboard-hata");
  if (el) el.textContent = msg || "";
  const pop = $("#leaderboard-popup");
  if (pop && show) pop.hidden = false;
}
async function refreshLeaderboardPopup() {
  const list = $("#leaderboard-list");
  const items = $("#leaderboard-items");
  if (!list || !items) return;
  list.hidden = false;
  $("#leaderboard-form").hidden = true;
  items.innerHTML = "";
  try {
    const cevap = await fetch("/api/leaderboard", { cache: "no-store" });
    const data = await cevap.json();
    (data.rows || []).forEach((row) => {
      const li = document.createElement("li");
      const name = document.createElement("span");
      name.className = "lb-name";
      name.textContent = row.alias;
      const meta = document.createElement("span");
      meta.className = "lb-score";
      meta.textContent = Number(row.score).toFixed(1) + " puan";
      li.appendChild(name);
      li.appendChild(meta);
      items.appendChild(li);
    });
    if (items.children.length === 0) {
      const li = document.createElement("li");
      li.innerHTML = "<span class='lb-name'>Hen\xFCz kay\u0131t yok \u2014 ilk resmi skoru sen yap.</span>";
      items.appendChild(li);
    }
  } catch (hata) {
    const li = document.createElement("li");
    li.innerHTML = "<span class='lb-name'>S\u0131ralama y\xFCklenemedi.</span>";
    items.appendChild(li);
  }
}
function resetLeaderboardForm() {
  const form = $("#leaderboard-form");
  const list = $("#leaderboard-list");
  const alias = $("#leaderboard-alias");
  const hata = $("#leaderboard-hata");
  if (form) form.hidden = false;
  if (list) list.hidden = true;
  if (alias) alias.value = "";
  if (hata) hata.textContent = "";
  const cont = $("#turnstile-container");
  if (cont) {
    cont.innerHTML = "";
    if (window.turnstile) {
      pendingLeaderboardToken = "";
      window.turnstile.render(cont, {
        sitekey: OFFICIAL_CHALLENGE_KEY,
        action: "official-score",
        theme: "dark",
        callback: /* @__PURE__ */ __name((t) => {
          pendingLeaderboardToken = t;
        }, "callback"),
        "expired-callback": /* @__PURE__ */ __name(() => {
          pendingLeaderboardToken = "";
        }, "expired-callback"),
        "error-callback": /* @__PURE__ */ __name(() => {
          hourDefault("Captcha do\u011Frulamas\u0131 al\u0131namad\u0131.", false);
        }, "error-callback")
      });
    }
  }
}
async function saveOfficialScore(event) {
  event.preventDefault();
  const aliasEl = $("#leaderboard-alias");
  const alias = String(aliasEl ? aliasEl.value : "").trim();
  if (!alias) {
    hourDefault("Rumuz yazmal\u0131s\u0131n.", false);
    return;
  }
  if (!/^[A-Za-zÇĞİÖŞÜçğıöşü0-9 ._-]{1,24}$/.test(alias)) {
    hourDefault("Rumuz yaln\u0131zca harf, rakam, nokta ve tire i\xE7ermeli (en fazla 24 karakter).", false);
    return;
  }
  const hata = $("#leaderboard-hata");
  if (!G.challenge || !G.challenge.challengeId) {
    hourDefault("Bu sonu\xE7 challenge de\u011Fil.", false);
    return;
  }
  if (!pendingLeaderboardToken) {
    if (hata) hata.textContent = "Captcha do\u011Frulamas\u0131n\u0131 bekle.";
    return;
  }
  const score = computeScore(G.raporKaynak || "yuzey").puan;
  if (!Number.isFinite(score)) {
    if (hata) hata.textContent = "Skor hesaplanamad\u0131.";
    return;
  }
  const payload = {
    challengeId: G.challenge.challengeId,
    alias,
    actions: G.challenge.log || [],
    turnstile: pendingLeaderboardToken,
    durationMs: Math.round((G.clock || 0) * 1e3)
  };
  try {
    const cevap = await fetch("/api/submit", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload)
    });
    const data = await cevap.json();
    if (!cevap.ok) {
      if (hata) hata.textContent = data.error || "Kay\u0131t reddedildi.";
      return;
    }
    await refreshLeaderboardPopup();
  } catch (err) {
    if (hata) hata.textContent = "Sunucuya ula\u015F\u0131lamad\u0131.";
  }
}
function showLeaderboardPopup(show) {
  const pop = $("#leaderboard-popup");
  if (!pop) return;
  pop.hidden = !show;
  if (show) resetLeaderboardForm();
}
function updateChallengeReportUI() {
  const block = $("#rapor-challenge");
  if (!block) return;
  const active = Boolean(G.challenge && G.challenge.official);
  block.hidden = !active;
  const msg = $("#rapor-challenge-msg");
  if (active && msg) {
    const sc = computeScore(G.raporKaynak || "yuzey").puan;
    msg.textContent = "Official Challenge \u2014 skorun " + Math.round(sc * 10) / 10 + " puan. Resmi s\u0131ralamaya gir.";
  }
}
function kur() {
  tumResimleriYukle();
  tasarimKur();
  inisTusKur();
  bagla();
  G.misyonlar = misyonlariUret();
  misyonKartlariCiz();
  $("#btn-brif-tasarim").disabled = true;
  try {
    const rekor = localStorage.getItem("menSpace.rekor");
    if (rekor) {
      const v = say(parseFloat(rekor), 0);
      $("#rekor-satir").hidden = false;
      $("#rekor-deger").textContent = v;
      const mr = $("#menu-rekor-deger");
      if (mr) mr.textContent = v;
    }
  } catch (_) {
  }
  saatGuncelle("g\xF6rev brifingi");
  kaynakGuncelle();
  requestAnimationFrame(dondur);
}
var challengeRandom, rng, $, sinir, say, rast, sesBaglami, BUTCE, ARACLAR, MODULLER, DONANIM, HEDEFLER, BRIFLER, MODIFIYELER, ZORLUK_SOL, ZORLUK_AD, G, resimler, inisTuslari, OFFICIAL_CHALLENGE_SEED, sonZaman, OFFICIAL_CHALLENGE_KEY, pendingLeaderboardToken;
var init_game = __esm({
  "app/game.js"() {
    "use strict";
    init_modules_watch_stub();
    challengeRandom = Math.random;
    rng = /* @__PURE__ */ __name(() => challengeRandom(), "rng");
    $ = /* @__PURE__ */ __name((s) => document.querySelector(s), "$");
    sinir = /* @__PURE__ */ __name((a, x, b) => Math.max(a, Math.min(x, b)), "sinir");
    say = /* @__PURE__ */ __name((n, h) => n.toLocaleString("tr-TR", { maximumFractionDigits: h === void 0 ? 1 : h }), "say");
    rast = /* @__PURE__ */ __name((a, b) => a + rng() * (b - a), "rast");
    sesBaglami = null;
    __name(sesAc, "sesAc");
    __name(ses, "ses");
    BUTCE = 44;
    ARACLAR = [
      {
        anahtar: "kucuk",
        ad: "K\u0131v\u0131lc\u0131m",
        oz: "k\xFC\xE7\xFCk ara\xE7",
        img: "assets/roket_kucuk.png",
        kapasite: 12,
        maliyet: 8,
        guven: 0.72,
        pencere: 0.13
      },
      {
        anahtar: "orta",
        ad: "Y\xFCkseli\u015F",
        oz: "orta ara\xE7",
        img: "assets/roket_orta.png",
        kapasite: 24,
        maliyet: 16,
        guven: 0.86,
        pencere: 0.21
      },
      {
        anahtar: "buyuk",
        ad: "Sefer",
        oz: "a\u011F\u0131r ara\xE7",
        img: "assets/roket_buyuk.png",
        kapasite: 44,
        maliyet: 26,
        guven: 0.94,
        pencere: 0.3
      }
    ];
    MODULLER = [
      {
        anahtar: "hafif",
        ad: "Kelebek",
        img: "assets/inis_arac\u0131.png",
        kutle: 5,
        maliyet: 4,
        yakit: 34,
        itus: 150
      },
      {
        anahtar: "kasa",
        ad: "Kas\u0131nda",
        img: "assets/inis_arac\u0131.png",
        kutle: 9,
        maliyet: 6,
        yakit: 50,
        itus: 125
      }
    ];
    DONANIM = [
      {
        anahtar: "kamera",
        ad: "Kamera",
        img: "assets/kamera.png",
        kutle: 2,
        maliyet: 3,
        guc: 1,
        bilim: 6,
        not: "g\xF6r\xFCnt\xFC verisi \xFCretir"
      },
      {
        anahtar: "spek",
        ad: "Spektrometre",
        img: "assets/spektrometre.png",
        kutle: 4,
        maliyet: 5,
        guc: 2,
        bilim: 9,
        not: "kaya bile\u015Fimini tarar"
      },
      {
        anahtar: "sismo",
        ad: "Sismometre",
        img: "assets/sismometre.png",
        kutle: 3,
        maliyet: 4,
        guc: 1,
        bilim: 5,
        not: "ay depremlerini dinler"
      },
      {
        anahtar: "anten_k",
        ad: "K\xFC\xE7\xFCk Anten",
        img: "assets/anten_kucuk.png",
        kutle: 2,
        maliyet: 2,
        guc: 1,
        link: 10,
        not: "iletim ba\u015F\u0131na 10 birime kadar g\xF6nderebilir"
      },
      {
        anahtar: "anten_b",
        ad: "B\xFCy\xFCk Anten",
        img: "assets/anten_buyuk.png",
        kutle: 4,
        maliyet: 3,
        guc: 2,
        link: 22,
        not: "iletim ba\u015F\u0131na 22 birime kadar g\xF6nderebilir"
      },
      {
        anahtar: "panel",
        ad: "G\xFCne\u015F Paneli",
        img: "assets/panel.png",
        kutle: 3,
        maliyet: 3,
        uretim: 8,
        not: "g\xFCnd\xFCz s\xF6l ba\u015F\u0131na 8 birim \xFCretir"
      },
      {
        anahtar: "pil",
        ad: "Pil",
        img: "assets/pil.png",
        kutle: 2,
        maliyet: 2,
        kapasite: 60,
        not: "ara\xE7 bataryas\u0131na +60 birim depo \u2014 ay gecesinin tek dayana\u011F\u0131"
      },
      {
        anahtar: "bayrak",
        ad: "Bayrak",
        img: "assets/bayrak.png",
        kutle: 1,
        maliyet: 1,
        sabit: 2,
        not: "y\xFCzeye ini\u015Fte dikilir, +2 bilim"
      }
    ];
    HEDEFLER = [
      {
        anahtar: "ay",
        ad: "Ay",
        img: "assets/ay.png",
        cekim: 42,
        zemin: "#8A8D99",
        atmosfer: "yok",
        yuzey: "ay_yuzeyi",
        not: "1,62 m/s\xB2 \u2014 hafif \xE7ekim, yumu\u015Fak ini\u015F."
      },
      {
        anahtar: "mars",
        ad: "Mars",
        img: "assets/mars.png",
        cekim: 50,
        zemin: "#A0522D",
        atmosfer: "ince CO\u2082",
        yuzey: "mars_yuzey",
        not: "3,72 m/s\xB2 \u2014 daha a\u011F\u0131r \xE7ekim, ama ince atmosfer biraz frenliyor."
      },
      {
        anahtar: "merkur",
        ad: "Merk\xFCr",
        img: "assets/merkur.png",
        cekim: 52,
        zemin: "#8A8578",
        atmosfer: "yok",
        yuzey: "merkur_yuzey",
        not: "3,70 m/s\xB2 \u2014 atmosfer yok, d\xFC\u015F\xFC\u015F\xFC sadece motor kesiyor."
      },
      {
        anahtar: "venus",
        ad: "Ven\xFCs",
        img: "assets/venus.png",
        cekim: 60,
        zemin: "#C9A227",
        atmosfer: "yo\u011Fun CO\u2082",
        yuzey: "venus_yuzey",
        bulut: "venus_bulut",
        not: "8,87 m/s\xB2 \u2014 a\u011F\u0131r \xE7ekim, her itki yak\u0131t yakar."
      }
    ];
    BRIFLER = [
      {
        anahtar: "veri",
        ad: "Derin Veri",
        zorluk: 1,
        olcu: "iletilen",
        hedef: 45,
        odul: 20,
        arac: "orta",
        modul: "hafif",
        metin: "G\xF6rev sonuna kadar 45 birim veriyi D\xFCnya'ya ilet.",
        onerilen: ["kamera", "anten_k", "panel", "pil"]
      },
      {
        anahtar: "gece",
        ad: "Karanl\u0131\u011Fa Dayan\u0131kl\u0131",
        zorluk: 1,
        olcu: "gece",
        hedef: 1,
        odul: 20,
        arac: "orta",
        modul: "kasa",
        metin: "Bir ay gecesini enerjini kesmeden atlat.",
        onerilen: ["panel", "pil", "anten_k", "sismo"]
      },
      {
        anahtar: "cihaz",
        ad: "Tam Enstr\xFCman",
        zorluk: 2,
        olcu: "kesintisiz",
        hedef: 5,
        odul: 30,
        arac: "orta",
        modul: "hafif",
        metin: "T\xFCm bilim enstr\xFCmanlar\u0131n\u0131 5 s\xF6l boyunca kesintisiz \xE7al\u0131\u015Ft\u0131r.",
        onerilen: ["kamera", "spek", "sismo", "panel", "pil"]
      },
      {
        anahtar: "hassas",
        ad: "Nokta At\u0131\u015F\u0131",
        zorluk: 2,
        olcu: "hassasiyet",
        hedef: 0.8,
        odul: 30,
        arac: "buyuk",
        modul: "kasa",
        metin: "\u0130ni\u015F b\xF6lgesine 30 m i\xE7inde in.",
        onerilen: ["anten_k", "panel"]
      },
      {
        anahtar: "ekonomi",
        ad: "Ucuz Misyon",
        zorluk: 2,
        olcu: "butce",
        hedef: 12,
        odul: 30,
        arac: "kucuk",
        modul: "hafif",
        metin: "B\xFCt\xE7eden en az 12 M$ ay\u0131r.",
        onerilen: ["kamera", "anten_k"]
      },
      {
        anahtar: "veri2",
        ad: "Veri Avc\u0131s\u0131",
        zorluk: 3,
        olcu: "iletilen",
        hedef: 95,
        odul: 45,
        arac: "orta",
        modul: "kasa",
        metin: "95 birim veriyi D\xFCnya'ya ilet.",
        onerilen: ["spek", "anten_b", "panel", "pil", "bayrak"]
      },
      {
        anahtar: "cekirdek",
        ad: "\xC7ift Gece",
        zorluk: 3,
        olcu: "gece",
        hedef: 2,
        odul: 45,
        arac: "orta",
        modul: "kasa",
        metin: "\u0130ki ay gecesini sorunsuz atlat.",
        onerilen: ["panel", "pil", "anten_b", "sismo"]
      },
      {
        anahtar: "combo",
        ad: "\xC7ifte Hedef",
        zorluk: 3,
        olcu: "combo",
        hedef: 80,
        odul: 50,
        arac: "orta",
        modul: "hafif",
        metin: "80 birim veri ilet ve bir geceyi enerjisiz atlatma.",
        onerilen: ["kamera", "spek", "anten_b", "panel", "pil"]
      }
    ];
    MODIFIYELER = [
      {
        anahtar: "toz",
        ad: "Toz F\u0131rt\u0131nas\u0131",
        tip: "hasatCarpan",
        deger: 0.5,
        metin: "panel hasad\u0131 yar\u0131ya iner"
      },
      {
        anahtar: "kum",
        ad: "Regolit Tozu",
        tip: "hasatEksik",
        deger: 3,
        metin: "panel hasad\u0131 her s\xF6l 3 birim azal\u0131r"
      },
      {
        anahtar: "karartma",
        ad: "Radyo Karartmas\u0131",
        tip: "linkCarpan",
        deger: 0.5,
        metin: "her 3 s\xF6l\xFCn birinde iletim yar\u0131 kapasitede"
      },
      {
        anahtar: "soguk",
        ad: "So\u011Fuk Gece",
        tip: "kapasiteCarpan",
        deger: 0.7,
        metin: "pil kapasitesi %30 d\xFC\u015Fer"
      },
      {
        anahtar: "parlak",
        ad: "G\xFCne\u015F F\u0131rt\u0131nas\u0131",
        tip: "hasatCarpan",
        deger: 1.5,
        metin: "panel hasad\u0131 %50 artar, meteorit riski iki kat\u0131na \xE7\u0131kar"
      },
      {
        anahtar: "sakin",
        ad: "Sakin Uzay",
        tip: "sakin",
        deger: 0.25,
        metin: "meteorit ya\u011Fmaz ama veri hedefi %25 y\xFCkselir"
      }
    ];
    ZORLUK_SOL = { 1: 8, 2: 10, 3: 12 };
    ZORLUK_AD = { 1: "kolay", 2: "orta", 3: "zor" };
    __name(setGlobalG, "setGlobalG");
    __name(freshState, "freshState");
    G = freshState();
    if (typeof window !== "undefined") window.MENSPACE = G;
    if (typeof window !== "undefined") window.MENSPACE = G;
    resimler = {};
    __name(resimAdi, "resimAdi");
    __name(resim, "resim");
    __name(tumResimleriYukle, "tumResimleriYukle");
    __name(ekranAc, "ekranAc");
    __name(saatGuncelle, "saatGuncelle");
    __name(kutleTopla, "kutleTopla");
    __name(butceHarca, "butceHarca");
    __name(gucHesapla, "gucHesapla");
    __name(kaynakGuncelle, "kaynakGuncelle");
    __name(yildizOrgu, "yildizOrgu");
    __name(yuzeySeridi, "yuzeySeridi");
    __name(etiket, "etiket");
    __name(panelKanatlari, "panelKanatlari");
    __name(misyonlariUret, "misyonlariUret");
    __name(modDeger, "modDeger");
    __name(misyonKartlariCiz, "misyonKartlariCiz");
    __name(brifSec, "brifSec");
    __name(brifKartiGuncelle, "brifKartiGuncelle");
    __name(onerilenGuncelle, "onerilenGuncelle");
    __name(brifDurumu, "brifDurumu");
    __name(tasarimKur, "tasarimKur");
    __name(donanimKaldir, "donanimKaldir");
    __name(tasarimSecGuncelle, "tasarimSecGuncelle");
    __name(tasarimDenetim, "tasarimDenetim");
    __name(tasarimCiz, "tasarimCiz");
    __name(firlatmayaGec, "firlatmayaGec");
    __name(firlatmaTikla, "firlatmaTikla");
    __name(firlatmaCiz, "firlatmaCiz");
    __name(seyireGec, "seyireGec");
    __name(seyirKarar, "seyirKarar");
    __name(seyirCiz, "seyirCiz");
    inisTuslari = { itki: false, yarim: false, sol: false, sag: false };
    __name(iniseGec, "iniseGec");
    __name(inisTusKur, "inisTusKur");
    __name(inisCiz, "inisCiz");
    __name(yuzeyeGec, "yuzeyeGec");
    __name(misyonSols, "misyonSols");
    __name(yuzeyGecisleriKur, "yuzeyGecisleriKur");
    __name(y_aktifMi, "y_aktifMi");
    __name(yuzeyCiz, "yuzeyCiz");
    __name(yuzeyOzetYaz, "yuzeyOzetYaz");
    __name(solYurut, "solYurut");
    __name(veriIlet, "veriIlet");
    __name(raporYuzeyden, "raporYuzeyden");
    __name(computeScore, "computeScore");
    __name(raporaGec, "raporaGec");
    OFFICIAL_CHALLENGE_SEED = 1337;
    __name(mulberry32, "mulberry32");
    __name(criarRng, "criarRng");
    __name(logChallengeAction, "logChallengeAction");
    __name(applyOfficialAction, "applyOfficialAction");
    __name(runOfficialChallenge, "runOfficialChallenge");
    sonZaman = 0;
    __name(advanceGame, "advanceGame");
    __name(dondur, "dondur");
    __name(bagla, "bagla");
    OFFICIAL_CHALLENGE_KEY = "0x4AAAAAAFzihhflQW6bQ3-I";
    pendingLeaderboardToken = "";
    __name(startOfficialChallenge, "startOfficialChallenge");
    __name(hourDefault, "hourDefault");
    __name(refreshLeaderboardPopup, "refreshLeaderboardPopup");
    __name(resetLeaderboardForm, "resetLeaderboardForm");
    __name(saveOfficialScore, "saveOfficialScore");
    __name(showLeaderboardPopup, "showLeaderboardPopup");
    __name(updateChallengeReportUI, "updateChallengeReportUI");
    __name(kur, "kur");
    if (typeof window !== "undefined" && !window.MENSPACE_REPLAY) {
      kur();
    }
  }
});

// .wrangler/tmp/bundle-uRbkMp/middleware-loader.entry.ts
init_modules_watch_stub();

// .wrangler/tmp/bundle-uRbkMp/middleware-insertion-facade.js
init_modules_watch_stub();

// worker/index.mjs
init_modules_watch_stub();
var OFFICIAL_SEED = 1337;
var CHALLENGE_TTL_MS = 15 * 60 * 1e3;
var SCORE_FAZ_MAX = 72e4;
var MAX_ACTION_COUNT = 400;
var MAX_BODY_BYTES = 18e3;
var RATE_LIMIT_PER_HOUR = 8;
var noop = /* @__PURE__ */ __name(() => {
}, "noop");
var classListStub = /* @__PURE__ */ __name(() => ({ add: noop, remove: noop, toggle: noop, contains: /* @__PURE__ */ __name(() => false, "contains") }), "classListStub");
var ctx2dStub = /* @__PURE__ */ __name(() => ({
  fillRect: noop,
  strokeRect: noop,
  clearRect: noop,
  beginPath: noop,
  moveTo: noop,
  lineTo: noop,
  fill: noop,
  stroke: noop,
  drawImage: noop,
  fillText: noop,
  strokeText: noop,
  measureText: /* @__PURE__ */ __name(() => ({ width: 40 }), "measureText"),
  createPattern: /* @__PURE__ */ __name(() => ({}), "createPattern"),
  save: noop,
  restore: noop,
  translate: noop,
  rotate: noop,
  bezierCurveTo: noop,
  quadraticCurveTo: noop,
  arc: noop
}), "ctx2dStub");
var makeElement = /* @__PURE__ */ __name(() => ({
  className: "",
  id: "",
  innerHTML: "",
  textContent: "",
  hidden: false,
  disabled: false,
  type: "button",
  style: {},
  children: [],
  value: "",
  checked: false,
  classList: classListStub(),
  setAttribute: noop,
  removeAttribute: noop,
  appendChild: noop,
  insertBefore: noop,
  addEventListener: noop,
  removeEventListener: noop,
  querySelector: /* @__PURE__ */ __name(() => makeElement(), "querySelector"),
  querySelectorAll: /* @__PURE__ */ __name(() => [], "querySelectorAll"),
  closest: /* @__PURE__ */ __name(() => null, "closest"),
  getBoundingClientRect: /* @__PURE__ */ __name(() => ({ left: 0, top: 0, width: 100, height: 100 }), "getBoundingClientRect"),
  getContext: /* @__PURE__ */ __name(() => ctx2dStub(), "getContext")
}), "makeElement");
var makeDocument = /* @__PURE__ */ __name(() => ({
  querySelector: /* @__PURE__ */ __name(() => makeElement(), "querySelector"),
  querySelectorAll: /* @__PURE__ */ __name(() => [], "querySelectorAll"),
  createElement: /* @__PURE__ */ __name(() => makeElement(), "createElement"),
  addEventListener: noop,
  removeEventListener: noop,
  body: makeElement()
}), "makeDocument");
var makeImage = /* @__PURE__ */ __name(() => ({ src: "", width: 0, height: 0, naturalWidth: 0, naturalHeight: 0, complete: false }), "makeImage");
var gameModule = null;
var loadGame = /* @__PURE__ */ __name(async () => {
  if (!gameModule) {
    globalThis.window = {
      AudioContext: void 0,
      webkitAudioContext: void 0,
      MENSPACE_REPLAY: true
    };
    globalThis.document = makeDocument();
    globalThis.Image = makeImage;
    globalThis.localStorage = { getItem: /* @__PURE__ */ __name(() => null, "getItem"), setItem: noop, removeItem: noop };
    globalThis.performance = globalThis.performance || { now: /* @__PURE__ */ __name(() => 0, "now") };
    globalThis.requestAnimationFrame = (_) => 0;
    globalThis.self = globalThis.self || {};
    gameModule = await Promise.resolve().then(() => (init_game(), game_exports));
  }
  return gameModule;
}, "loadGame");
var encoder = new TextEncoder();
var bytesToHex = /* @__PURE__ */ __name((bytes) => Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join(""), "bytesToHex");
var hexToBytes = /* @__PURE__ */ __name((hex) => {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}, "hexToBytes");
var base64Url = /* @__PURE__ */ __name((bytes) => {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}, "base64Url");
var base64UrlToBytes = /* @__PURE__ */ __name((value) => {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - b64.length % 4) % 4);
  try {
    const binary = atob(padded);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}, "base64UrlToBytes");
var hmacSha256 = /* @__PURE__ */ __name(async (secret, msg) => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(msg));
  return new Uint8Array(sig);
}, "hmacSha256");
var sha256 = /* @__PURE__ */ __name(async (msg) => {
  const buf = await crypto.subtle.digest("SHA-256", encoder.encode(msg));
  return bytesToHex(new Uint8Array(buf));
}, "sha256");
var constantTimeEqual = /* @__PURE__ */ __name((a, b) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}, "constantTimeEqual");
var makeChallenge = /* @__PURE__ */ __name(async (secret) => {
  const nonce = crypto.getRandomValues(new Uint8Array(24));
  const expiresAt = Date.now() + CHALLENGE_TTL_MS;
  const payload = `${bytesToHex(nonce)}.${expiresAt}`;
  const sig = await hmacSha256(secret, payload);
  return `${bytesToHex(nonce)}.${expiresAt}.${base64Url(sig)}`;
}, "makeChallenge");
var verifyChallenge = /* @__PURE__ */ __name(async (secret, challengeId) => {
  if (typeof challengeId !== "string") return null;
  const parts = challengeId.split(".");
  if (parts.length !== 3) return null;
  const [nonceHex, expiresAtText, sigB64] = parts;
  const expiresAt = parseInt(expiresAtText, 10);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
  const nonce = hexToBytes(nonceHex);
  if (!nonce) return null;
  const payload = `${nonceHex}.${expiresAt}`;
  const expected = await hmacSha256(secret, payload);
  const provided = base64UrlToBytes(sigB64);
  if (!provided || expected.length !== provided.length) return null;
  if (!constantTimeEqual(base64Url(expected), sigB64)) return null;
  return { seed: OFFICIAL_SEED, expiresAt };
}, "verifyChallenge");
var sanitizeAlias = /* @__PURE__ */ __name((value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.replace(/[<>&"'`]/g, "").trim().replace(/\s+/g, " ");
  const safe = trimmed.slice(0, 24);
  if (safe.length < 1) return null;
  if (!/^[A-Za-zÇĞİÖŞÜçğıöşü0-9 ._-]{1,24}$/.test(safe)) return null;
  return safe;
}, "sanitizeAlias");
var json = /* @__PURE__ */ __name((body, status = 200, extraHeaders = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", ...extraHeaders }
}), "json");
var errorJson = /* @__PURE__ */ __name((message, status = 400) => json({ error: message }, status), "errorJson");
var verifyTurnstile = /* @__PURE__ */ __name(async (secret, token, remoteIp) => {
  const body = new URLSearchParams({ secret, response: token, remoteip: remoteIp });
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data && data.success === true;
}, "verifyTurnstile");
var countRateLimit = /* @__PURE__ */ __name(async (env, ipHash, bucket) => {
  const row = await env.DB.prepare(
    "SELECT count FROM official_rate_limit WHERE ip_hash = ? AND bucket = ?"
  ).bind(ipHash, bucket).first();
  return row?.count ?? 0;
}, "countRateLimit");
var bumpRateLimit = /* @__PURE__ */ __name(async (env, ipHash, bucket) => {
  await env.DB.prepare(
    "INSERT INTO official_rate_limit(ip_hash, bucket, count) VALUES (?, ?, 1) ON CONFLICT(ip_hash, bucket) DO UPDATE SET count = count + 1"
  ).bind(ipHash, bucket).run();
}, "bumpRateLimit");
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/challenge" && request.method === "GET") {
      const challengeId = await makeChallenge(env.CHALLENGE_SECRET);
      return json({ challengeId, seed: OFFICIAL_SEED, expiresAt: Date.now() + CHALLENGE_TTL_MS, official: true });
    }
    if (url.pathname === "/api/leaderboard" && request.method === "GET") {
      const rows = await env.DB.prepare(
        "SELECT alias, score, created_at AS createdAt FROM official_scores ORDER BY score DESC, created_at ASC LIMIT 20"
      ).all();
      return json({ rows: rows.results || [] });
    }
    if (url.pathname === "/api/submit" && request.method === "POST") {
      const contentLength = Number(request.headers.get("content-length") || "0");
      if (contentLength > MAX_BODY_BYTES) return errorJson("payload too large", 413);
      const contentType = request.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) return errorJson("content-type required", 415);
      let body;
      try {
        body = await request.json();
      } catch {
        return errorJson("invalid JSON", 400);
      }
      const { challengeId, alias, actions, turnstile, durationMs } = body || {};
      if (!challengeId || !alias || !actions || !turnstile) {
        return errorJson("missing fields", 400);
      }
      if (typeof actions !== "object" || Array.isArray(actions) === false) {
        return errorJson("actions must be an array", 400);
      }
      if (actions.length > MAX_ACTION_COUNT) return errorJson("too many actions", 400);
      if (Number(durationMs) > SCORE_FAZ_MAX) return errorJson("too slow", 400);
      const verifiedChallenge = await verifyChallenge(env.CHALLENGE_SECRET, challengeId);
      if (!verifiedChallenge) return errorJson("invalid challenge", 403);
      const remoteIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "";
      const turnstileOk = env.TURNSTILE_BYPASS === "true" ? true : await verifyTurnstile(env.TURNSTILE_SECRET_KEY, turnstile, remoteIp);
      if (!turnstileOk) return errorJson("turnstile rejected", 403);
      const ipHash = await sha256(`${remoteIp}:${env.CHALLENGE_SECRET}`);
      const bucket = Math.floor(Date.now() / 36e5);
      const count = await countRateLimit(env, ipHash, bucket);
      if (count >= RATE_LIMIT_PER_HOUR) return errorJson("rate limited", 429);
      await bumpRateLimit(env, ipHash, bucket);
      const game = await loadGame();
      let result;
      try {
        result = game.runOfficialChallenge(OFFICIAL_SEED, actions);
      } catch (error) {
        console.error("official challenge replay failed", error);
        return errorJson("replay failed", 500);
      }
      if (!result || result.ok !== true) return errorJson("challenge did not complete", 403);
      const score = Math.round((result.puan || 0) * 100) / 100;
      if (!Number.isFinite(score) || score < 0 || score > 400) {
        return errorJson("invalid score", 400);
      }
      const safeAlias = sanitizeAlias(alias);
      if (!safeAlias) return errorJson("invalid alias", 400);
      await env.DB.prepare(
        "INSERT INTO official_scores(alias, score, duration_ms, created_at, seed) VALUES (?, ?, ?, ?, ?)"
      ).bind(safeAlias, score, Math.max(0, Math.round(Number(durationMs) || 0)), Date.now(), OFFICIAL_SEED).run();
      return json({ ok: true, score, rows: (await env.DB.prepare(
        "SELECT alias, score, created_at AS createdAt FROM official_scores ORDER BY score DESC, created_at ASC LIMIT 20"
      ).all()).results || [] });
    }
    return env.ASSETS.fetch(request);
  }
};

// ../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-uRbkMp/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-uRbkMp/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
