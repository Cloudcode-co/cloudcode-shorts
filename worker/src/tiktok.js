// TikTok Content Posting API: sends a finished video from the media bucket to
// the connected account's TikTok inbox (drafts), where the owner adds the
// caption and posts it from the app. Inbox uploads need no app audit.
//
// One-time connection: /tiktok in Discord replies with a login link; TikTok
// redirects to /tiktok/callback, and the tokens are kept in the TIKTOK KV
// namespace (the access token lasts a day and is refreshed here; the refresh
// token lasts about a year).
//
// Secrets: TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET. KV binding: TIKTOK.
const API = "https://open.tiktokapis.com/v2";
const SCOPES = "user.info.basic,video.upload";
const MB = 1024 * 1024;

export const redirectUri = (request) => `${new URL(request.url).origin}/tiktok/callback`;

// A login link for the account to connect, valid for 10 minutes.
export const loginUrl = async (request, env) => {
  const state = crypto.randomUUID();
  await env.TIKTOK.put(`state:${state}`, "1", { expirationTtl: 600 });
  const params = new URLSearchParams({
    client_key: env.TIKTOK_CLIENT_KEY,
    scope: SCOPES,
    response_type: "code",
    redirect_uri: redirectUri(request),
    state,
  });
  return `https://www.tiktok.com/v2/auth/authorize/?${params}`;
};

const tokenRequest = async (env, fields) => {
  const res = await fetch(`${API}/oauth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: env.TIKTOK_CLIENT_KEY,
      client_secret: env.TIKTOK_CLIENT_SECRET,
      ...fields,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new Error(`TikTok token: ${res.status} ${data.error_description ?? data.error ?? ""}`.trim());
  }
  const now = Date.now();
  const token = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    open_id: data.open_id,
    scope: data.scope,
    expires_at: now + (data.expires_in - 300) * 1000,
    refresh_expires_at: now + data.refresh_expires_in * 1000,
  };
  await env.TIKTOK.put("token", JSON.stringify(token));
  return token;
};

const page = (text, status = 200) =>
  new Response(`<!doctype html><meta charset="utf-8"><title>TikTok</title><p style="font:18px system-ui;margin:40px">${text}</p>`, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });

// TikTok's redirect after login: checks the state from loginUrl, then keeps
// the tokens.
export const callback = async (request, env) => {
  const url = new URL(request.url);
  const state = url.searchParams.get("state") ?? "";
  if (!state || !(await env.TIKTOK.get(`state:${state}`))) {
    return page("Link đăng nhập đã hết hạn hoặc không hợp lệ. Gõ /tiktok trong Discord để lấy link mới.", 400);
  }
  await env.TIKTOK.delete(`state:${state}`);
  const code = url.searchParams.get("code");
  if (!code) return page(`TikTok không cho phép: ${url.searchParams.get("error_description") ?? "đã huỷ"}.`, 400);
  try {
    await tokenRequest(env, { code, grant_type: "authorization_code", redirect_uri: redirectUri(request) });
  } catch (err) {
    return page(`Không lấy được token: ${err.message}`, 502);
  }
  return page("Đã kết nối TikTok. Từ giờ bấm Duyệt trong Discord là video vào hộp nháp TikTok.");
};

// A valid access token, refreshed when it is about to expire.
const accessToken = async (env) => {
  const token = JSON.parse((await env.TIKTOK.get("token")) ?? "null");
  if (!token) throw new Error("chưa kết nối TikTok; gõ /tiktok để kết nối");
  if (Date.now() < token.expires_at) return token.access_token;
  if (Date.now() >= token.refresh_expires_at) throw new Error("phiên TikTok đã hết hạn; gõ /tiktok để kết nối lại");
  return (await tokenRequest(env, { grant_type: "refresh_token", refresh_token: token.refresh_token })).access_token;
};

export const connected = async (env) => Boolean(await env.TIKTOK?.get("token"));

const api = async (env, path, body) => {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await accessToken(env)}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || (data.error?.code && data.error.code !== "ok")) {
    throw new Error(`TikTok ${path}: ${res.status} ${data.error?.code ?? ""} ${data.error?.message ?? ""}`.trim());
  }
  return data.data;
};

// TikTok's chunk rules: one chunk up to 64 MB, else 10 MB chunks with the
// remainder added to the last one.
const chunking = (size) => {
  const chunk = size <= 64 * MB ? size : 10 * MB;
  return { chunk, count: Math.floor(size / chunk) };
};

// Uploads `key` (under tiktok-shorts/ in the bucket) to the TikTok inbox and
// returns the publish id.
export const sendToInbox = async (env, key) => {
  const head = await env.MEDIA.head(key);
  if (!head) throw new Error(`không thấy video ${key} trên CDN`);
  const size = head.size;
  const { chunk, count } = chunking(size);
  const { publish_id, upload_url } = await api(env, "/post/publish/inbox/video/init/", {
    source_info: { source: "FILE_UPLOAD", video_size: size, chunk_size: chunk, total_chunk_count: count },
  });
  for (let i = 0; i < count; i++) {
    const start = i * chunk;
    const end = i === count - 1 ? size - 1 : start + chunk - 1;
    const part = await env.MEDIA.get(key, { range: { offset: start, length: end - start + 1 } });
    const res = await fetch(upload_url, {
      method: "PUT",
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${size}`,
      },
      body: part.body,
    });
    if (!res.ok) throw new Error(`TikTok upload part ${i + 1}/${count}: ${res.status} ${await res.text()}`);
  }
  return publish_id;
};

// Where an upload stands: SEND_TO_USER_INBOX when it reached the inbox.
export const uploadStatus = async (env, publishId) =>
  api(env, "/post/publish/status/fetch/", { publish_id: publishId });
