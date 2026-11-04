// MenSpace Official Challenge secured API — Supabase auth + D1 rate limiting
const OFFICIAL_CHALLENGE_SEED = 1337;
const MAX_ACTION_COUNT = 1500;
const MAX_BODY_BYTES = 262144;
const SCORE_FAZ_MAX = 1200000;
const RATE_LIMIT_PER_HOUR = 8;
const CHALLENGE_TTL_MS = 15 * 60 * 1000;

const noop = () => {};
const classListStub = () => ({ add: noop, remove: noop, toggle: noop, contains: () => false });
const ctx2dStub = () => ({
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
  measureText: () => ({ width: 40 }),
  createPattern: () => ({}),
  save: noop,
  restore: noop,
  translate: noop,
  rotate: noop,
  bezierCurveTo: noop,
  quadraticCurveTo: noop,
  arc: noop,
});
const makeElement = () => ({
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
  querySelector: () => makeElement(),
  querySelectorAll: () => [],
  closest: () => null,
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }),
  getContext: () => ctx2dStub(),
});
const makeDocument = () => ({
  querySelector: () => makeElement(),
  querySelectorAll: () => [],
  createElement: () => makeElement(),
  addEventListener: noop,
  removeEventListener: noop,
  body: makeElement(),
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
    globalThis.requestAnimationFrame = () => 0;
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
  const b64 = String(value).replace(/-/g, "+").replace(/_/g, "/");
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
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(msg)));
};
const sha256 = async (msg) => bytesToHex(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(msg))));
const constantTimeEqual = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};
const makeChallenge = async (secret) => {
  const nonceBytes = crypto.getRandomValues(new Uint8Array(24));
  const nonce = bytesToHex(nonceBytes);
  const expiresAt = Date.now() + CHALLENGE_TTL_MS;
  const payload = `${nonce}.${expiresAt}`;
  const sig = base64Url(await hmacSha256(secret, payload));
  return `${nonce}.${expiresAt}.${sig}`;
};
const verifyChallenge = async (secret, challengeId) => {
  if (typeof challengeId !== "string") return null;
  const parts = challengeId.split(".");
  if (parts.length !== 3) return null;
  const [nonce, expiresAtText, sig] = parts;
  const expiresAt = parseInt(expiresAtText, 10);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
  if (!hexToBytes(nonce)) return null;
  const payload = `${nonce}.${expiresAt}`;
  const expected = base64Url(await hmacSha256(secret, payload));
  if (!constantTimeEqual(expected, sig)) return null;
  return { seed: OFFICIAL_CHALLENGE_SEED, expiresAt };
};
const json = (body, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
const errorJson = (message, status = 400) => json({ error: message }, status);

const verifyTurnstile = async (secret, token, remoteIp) => {
  if (!token || !secret) return false;
  const body = new URLSearchParams({ secret, response: token, remoteip: remoteIp || "" });
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) return false;
  const data = await res.json().catch(() => ({}));
  return Boolean(data && data.success);
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
const supabaseFetch = async (env, path, opts = {}) => {
  const SUPABASE_URL = env.SUPABASE_URL;
  const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY;
  const headers = {
    "content-type": "application/json",
    apikey: SERVICE,
    Authorization: `Bearer ${opts.bearer || SERVICE}`,
    ...(opts.headers || {}),
  };
  return fetch(`${SUPABASE_URL}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
};
const fetchProfile = async (env, userId, bearer) => {
  const res = await supabaseFetch(env, `/rest/v1/profiles?user_id=eq.${encodeURIComponent(userId)}&select=display_name&limit=1`, { bearer: bearer || env.SUPABASE_SERVICE_ROLE_KEY });
  const rows = await res.json().catch(() => []);
  return rows && rows[0] && rows[0].display_name ? String(rows[0].display_name) : null;
};
const fetchLeaderboard = async (env, limit = 20) => {
  const res = await supabaseFetch(env, `/rest/v1/official_scores?select=display_name,score,created_at&order=score.desc&order=created_at.asc&limit=${limit}`, { bearer: env.SUPABASE_SERVICE_ROLE_KEY });
  const rows = await res.json().catch(() => []);
  return Array.isArray(rows) ? rows : [];
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/challenge" && request.method === "GET") {
      return json({ challengeId: await makeChallenge(env.CHALLENGE_SECRET), seed: OFFICIAL_CHALLENGE_SEED, expiresAt: Date.now() + CHALLENGE_TTL_MS, official: true });
    }

    if (url.pathname === "/api/leaderboard" && request.method === "GET") {
      const rows = await fetchLeaderboard(env, 20);
      return json({ rows: rows.map((row) => ({ display_name: row.display_name, score: row.score, createdAt: row.created_at })) });
    }

    if (url.pathname === "/api/submit" && request.method === "POST") {
      const contentLength = Number(request.headers.get("content-length") || "0");
      if (contentLength > MAX_BODY_BYTES) return errorJson("payload too large", 413);
      const contentType = request.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) return errorJson("application/json required", 415);

      let body;
      try { body = await request.json(); } catch { return errorJson("invalid JSON", 400); }

      const challengeId = String(body.challengeId || "");
      const actions = body.actions;
      const turnstile = String(body.turnstile || "");
      const durationMs = Number(body.durationMs);
      if (!challengeId || !Array.isArray(actions) || !turnstile) return errorJson("missing fields", 400);
      if (actions.length > MAX_ACTION_COUNT) return errorJson("too many actions", 400);
      if (Number.isFinite(durationMs) && durationMs > SCORE_FAZ_MAX) return errorJson("suspiciously long session", 400);

      const authHeader = request.headers.get("authorization") || "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
      if (!token) return errorJson("authorization required", 401);

      const verifiedChallenge = await verifyChallenge(env.CHALLENGE_SECRET, challengeId);
      if (!verifiedChallenge) return errorJson("invalid challenge", 403);

      const remoteIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "";
      const turnstileOk = env.TURNSTILE_BYPASS === "true" ? true : await verifyTurnstile(env.TURNSTILE_SECRET_KEY, turnstile, remoteIp);
      if (!turnstileOk) return errorJson("turnstile rejected", 403);

      const ipHash = await sha256(`${remoteIp}:${env.CHALLENGE_SECRET}`);
      const bucket = Math.floor(Date.now() / 3_600_000);
      if ((await countRateLimit(env, ipHash, bucket)) >= RATE_LIMIT_PER_HOUR) return errorJson("rate limited", 429);
      await bumpRateLimit(env, ipHash, bucket);

      let user;
      try {
        const userRes = await supabaseFetch(env, "/auth/v1/user", { bearer: token });
        user = await userRes.json();
      } catch {
        return errorJson("auth verification failed", 502);
      }
      const userId = user && user.id ? String(user.id) : null;
      if (!userId) return errorJson("authentication failed", 401);

      const displayName = await fetchProfile(env, userId, token);
      if (!displayName) return errorJson("choose a display name before saving", 403);

      const game = await loadGame();
      let replay;
      try {
        replay = game.runOfficialChallenge(OFFICIAL_CHALLENGE_SEED, actions);
      } catch (err) {
        console.error("official challenge replay failed", err);
        return errorJson("replay failed", 500);
      }
      if (!replay || replay.ok !== true) return errorJson("challenge did not complete", 403);
      const score = Math.round(replay.puan * 100) / 100;
      if (!Number.isFinite(score) || score < 0 || score > 400) return errorJson("invalid score", 400);

      const insertRes = await supabaseFetch(env, "/rest/v1/official_scores", {
        method: "POST",
        bearer: env.SUPABASE_SERVICE_ROLE_KEY,
        headers: { Prefer: "return=minimal" },
        body: {
          user_id: userId,
          display_name: displayName,
          score,
          seconds: Math.max(0, Math.round((Number(durationMs) || 0) / 1000)),
        },
      });
      if (!insertRes.ok) {
        const text = await insertRes.text().catch(() => "");
        console.error("supabase insert failed", insertRes.status, text);
        return errorJson("could not save score", 502);
      }
      const rows = await fetchLeaderboard(env, 20);
      return json({ ok: true, score, rows });
    }

    return env.ASSETS.fetch(request);
  },
};
