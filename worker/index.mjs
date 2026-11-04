// MenSpace Official Challenge backend: static assets + secure score endpoints.

const OFFICIAL_SEED = 1337;
const CHALLENGE_TTL_MS = 15 * 60 * 1000;
const SCORE_FAZ_MAX = 720000; // 12 minutes, defensive
const MAX_ACTION_COUNT = 400;
const MAX_BODY_BYTES = 18000;
const RATE_LIMIT_PER_HOUR = 8;
const TURNSTILE_SITE_KEY = "0x4AAAAAAFzihhflQW6bQ3-I";

const noop = () => {};
const classListStub = () => ({ add: noop, remove: noop, toggle: noop, contains: () => false });
const ctx2dStub = () => ({
  fillRect: noop, strokeRect: noop, clearRect: noop, beginPath: noop, moveTo: noop,
  lineTo: noop, fill: noop, stroke: noop, drawImage: noop, fillText: noop, strokeText: noop,
  measureText: () => ({ width: 40 }), createPattern: () => ({}), save: noop, restore: noop,
  translate: noop, rotate: noop, bezierCurveTo: noop, quadraticCurveTo: noop, arc: noop,
});
const makeElement = () => ({
  className: "", id: "", innerHTML: "", textContent: "", hidden: false, disabled: false, type: "button",
  style: {}, children: [], value: "", checked: false,
  classList: classListStub(),
  setAttribute: noop, removeAttribute: noop, appendChild: noop, insertBefore: noop,
  addEventListener: noop, removeEventListener: noop,
  querySelector: () => makeElement(), querySelectorAll: () => [], closest: () => null,
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }),
  getContext: () => ctx2dStub(),
});
const makeDocument = () => ({
  querySelector: () => makeElement(), querySelectorAll: () => [], createElement: () => makeElement(),
  addEventListener: noop, removeEventListener: noop, body: makeElement(),
});
const makeImage = () => ({ src: "", width: 0, height: 0, naturalWidth: 0, naturalHeight: 0, complete: false });

let gameModule = null;
const loadGame = async () => {
  if (!gameModule) {
    globalThis.window = {
      AudioContext: undefined,
      webkitAudioContext: undefined,
      MENSPACE_REPLAY: true,
    };
    globalThis.document = makeDocument();
    globalThis.Image = makeImage;
    globalThis.localStorage = { getItem: () => null, setItem: noop, removeItem: noop };
    globalThis.performance = globalThis.performance || { now: () => 0 };
    globalThis.requestAnimationFrame = (_) => 0;
    globalThis.self = globalThis.self || {};
    gameModule = await import("../app/game.js");
  }
  return gameModule;
};

const encoder = new TextEncoder();
const bytesToHex = (bytes) =>
  Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
const hexToBytes = (hex) => {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
};
const base64Url = (bytes) => {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};
const base64UrlToBytes = (value) => {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  try {
    const binary = atob(padded);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
};
const hmacSha256 = async (secret, msg) => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(msg));
  return new Uint8Array(sig);
};
const sha256 = async (msg) => {
  const buf = await crypto.subtle.digest("SHA-256", encoder.encode(msg));
  return bytesToHex(new Uint8Array(buf));
};
const constantTimeEqual = (a, b) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};
const makeChallenge = async (secret) => {
  const nonce = crypto.getRandomValues(new Uint8Array(24));
  const expiresAt = Date.now() + CHALLENGE_TTL_MS;
  const payload = `${bytesToHex(nonce)}.${expiresAt}`;
  const sig = await hmacSha256(secret, payload);
  return `${bytesToHex(nonce)}.${expiresAt}.${base64Url(sig)}`;
};
const verifyChallenge = async (secret, challengeId) => {
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
};
const sanitizeAlias = (value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.replace(/[<>&"'`]/g, "").trim().replace(/\s+/g, " ");
  const safe = trimmed.slice(0, 24);
  if (safe.length < 1) return null;
  // allow Turkish letters, digits, spaces, dot, dash, underscore
  if (!/^[A-Za-zÇĞİÖŞÜçğıöşü0-9 ._-]{1,24}$/.test(safe)) return null;
  return safe;
};
const json = (body, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extraHeaders },
  });
const errorJson = (message, status = 400) => json({ error: message }, status);

const verifyTurnstile = async (secret, token, remoteIp) => {
  const body = new URLSearchParams({ secret, response: token, remoteip: remoteIp });
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data && data.success === true;
};
const countRateLimit = async (env, ipHash, bucket) => {
  const row = await env.DB.prepare(
    "SELECT count FROM official_rate_limit WHERE ip_hash = ? AND bucket = ?"
  ).bind(ipHash, bucket).first();
  return row?.count ?? 0;
};
const bumpRateLimit = async (env, ipHash, bucket) => {
  await env.DB.prepare(
    "INSERT INTO official_rate_limit(ip_hash, bucket, count) VALUES (?, ?, 1) " +
    "ON CONFLICT(ip_hash, bucket) DO UPDATE SET count = count + 1"
  ).bind(ipHash, bucket).run();
};

export default {
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
      const turnstileOk = env.TURNSTILE_BYPASS === "true"
        ? true
        : await verifyTurnstile(env.TURNSTILE_SECRET_KEY, turnstile, remoteIp);
      if (!turnstileOk) return errorJson("turnstile rejected", 403);

      const ipHash = await sha256(`${remoteIp}:${env.CHALLENGE_SECRET}`);
      const bucket = Math.floor(Date.now() / 3_600_000);
      const count = await countRateLimit(env, ipHash, bucket);
      if (count >= RATE_LIMIT_PER_HOUR) return errorJson("rate limited", 429);
      await bumpRateLimit(env, ipHash, bucket);

      // actions intentionally replayed server-side only
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

    // static assets + fallback
    return env.ASSETS.fetch(request);
  },
};
