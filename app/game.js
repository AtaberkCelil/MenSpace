/* Ay Görevi — görev tasarım simülatörü
   fazlar: tasarım → fırlatma → seyir → iniş → yüzey → rapor      */
"use strict";

/* ---------- kısayollar ---------- */
const $ = (s) => document.querySelector(s);
const tutSayi = (n, h) => n.toLocaleString("tr-TR", { maximumFractionDigits: h ?? 1 });
const sinir = (a, x, b) => Math.max(a, Math.min(x, b));

/* ---------- ses ---------- */
let sesBaglami = null;
function sesAd prejudices() {}
