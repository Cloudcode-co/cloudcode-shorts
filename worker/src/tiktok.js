// TikTok Login Kit and Content Posting API: a signed-in TikTok account sends a
// finished video from the media bucket to its own TikTok inbox (drafts), where
// the owner adds the caption and posts it from the app.
//
// Tokens are kept per account (open_id) in the TIKTOK KV namespace: the access
// token lasts a day and is refreshed here; the refresh token lasts about a year.
//
// Secrets: TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET. KV binding: TIKTOK.
const API = "https://open.tiktokapis.com/v2";
const SCOPES = "user.info.basic,video.upload";
const MB = 1024 * 1024;

export const redirectUri = (request) => `${new URL(request.url).origin}/tiktok/callback`;

// A login link, valid for 10 minutes.
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

export const checkState = async (env, state) => {
  if (!state || !(await env.TIKTOK.get(`state:${state}`))) return false;
  await env.TIKTOK.delete(`state:${state}`);
  return true;
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
  await env.TIKTOK.put(`token:${token.open_id}`, JSON.stringify(token));
  return token;
};

// Exchanges the login code; returns the account's open_id.
export const connect = async (request, env, code) =>
  (await tokenRequest(env, { code, grant_type: "authorization_code", redirect_uri: redirectUri(request) })).open_id;

// A valid access token for the account, refreshed when it is about to expire.
const accessToken = async (env, openId) => {
  const token = JSON.parse((await env.TIKTOK.get(`token:${openId}`)) ?? "null");
  if (!token) throw new Error("TikTok account not connected");
  if (Date.now() < token.expires_at) return token.access_token;
  if (Date.now() >= token.refresh_expires_at) throw new Error("TikTok session expired; log in again");
  return (await tokenRequest(env, { grant_type: "refresh_token", refresh_token: token.refresh_token })).access_token;
};

const api = async (env, openId, method, path, body) => {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${await accessToken(env, openId)}`,
      ...(body ? { "Content-Type": "application/json; charset=UTF-8" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || (data.error?.code && data.error.code !== "ok")) {
    throw new Error(`TikTok ${path}: ${res.status} ${data.error?.code ?? ""} ${data.error?.message ?? ""}`.trim());
  }
  return data.data;
};

// The account's public profile (user.info.basic).
export const userInfo = async (env, openId) =>
  (await api(env, openId, "GET", "/user/info/?fields=open_id,avatar_url,display_name")).user;

// Revokes the app's access and forgets the account.
export const disconnect = async (env, openId) => {
  const token = JSON.parse((await env.TIKTOK.get(`token:${openId}`)) ?? "null");
  if (token) {
    await fetch(`${API}/oauth/revoke/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: env.TIKTOK_CLIENT_KEY,
        client_secret: env.TIKTOK_CLIENT_SECRET,
        token: token.access_token,
      }),
    }).catch(() => {});
  }
  await env.TIKTOK.delete(`token:${openId}`);
};

// TikTok's chunk rules: one chunk up to 64 MB, else 10 MB chunks with the
// remainder added to the last one.
const chunking = (size) => {
  const chunk = size <= 64 * MB ? size : 10 * MB;
  return { chunk, count: Math.floor(size / chunk) };
};

// Uploads `key` from the bucket to the account's TikTok inbox (video.upload)
// and returns the publish id.
export const sendToInbox = async (env, openId, key) => {
  const head = await env.MEDIA.head(key);
  if (!head) throw new Error(`no video ${key} in the bucket`);
  const size = head.size;
  const { chunk, count } = chunking(size);
  const { publish_id, upload_url } = await api(env, openId, "POST", "/post/publish/inbox/video/init/", {
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

// Where an upload stands: SEND_TO_USER_INBOX once it reached the inbox.
export const uploadStatus = async (env, openId, publishId) =>
  api(env, openId, "POST", "/post/publish/status/fetch/", { publish_id: publishId });
