// Starts the "Make video" GitHub workflow from chat, and stores finished
// videos in the media R2 bucket so chat gets a link instead of a size-capped
// upload.
//
//   POST /discord      Discord interactions: the "Gửi nháp TikTok" button under
//                      finished videos, /video [topic] [nguon] [giong] [yeucau],
//                      /sua video [yeucau] [giong], with [phongcach] [dung], and their autocomplete
//   POST /telegram     Telegram bot webhook: any text is the topic, /auto lets
//                      Gemini pick, /id replies with the chat id
//   PUT  /upload/<key> store a video under tiktok-shorts/ in the bucket
//                      (Authorization: Bearer UPLOAD_SECRET); replies with its
//                      public URL on MEDIA_URL. The videos under tiktok-shorts/
//                      stay under VIDEO_BUDGET_MB (default 5120): the oldest are
//                      deleted to make room; the rest of the bucket is not counted
//                      or touched
//   /, /login, /app...   the Cloudcode Shorts website with TikTok login (site.js)
//   POST /tiktok/draft  { key, caption } posts that video to the connected TikTok
//                      account with its caption when it granted Direct Post, else
//                      sends it to the drafts; waits for TikTok (Bearer
//                      UPLOAD_SECRET). The pipeline calls it after uploading
//   POST /ideas        a video idea from an outside researcher (Muse), as JSON
//                      { topic, angle, sources: [urls], notes } with
//                      Authorization: Bearer IDEAS_SECRET; saved to the repo
//                      as ideas/<date>-<slug>.json for the pipeline to pick
//
// Secrets (wrangler secret put): GITHUB_TOKEN, UPLOAD_SECRET, IDEAS_SECRET, plus for Discord
// DISCORD_PUBLIC_KEY and optionally ALLOWED_DISCORD_USER_IDS (comma-separated;
// when set, only those users may use the bot, else any server admin), and for
// Telegram TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, ALLOWED_CHAT_ID.
// Vars: GITHUB_REPO ("owner/name"), MEDIA_URL. R2 binding: MEDIA. For the website:
// secrets TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, KV binding TIKTOK.

import voiceList from "../../pipeline/voices.json";
import { FORMATS } from "../../pipeline/formats.mjs";
import { site } from "./site.js";
import { canPost, directPost, sendToInbox, uploadStatus } from "./tiktok.js";

// Fires repository_dispatch; the workflow reads what to make (topic, voice,
// notes, or revise: a video to rework) and where to send the result (Discord
// channel_id or Telegram chat_id) from client_payload.
const dispatch = (env, job, replyTo) =>
  fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "cloudcode-shorts-bot",
    },
    body: JSON.stringify({ event_type: "make-video", client_payload: { ...job, ...replyTo } }),
  });

const queued = (res, { topic, source, voice, notes, revise, style, builder, format }) => {
  if (!res.ok) return `Không gọi được GitHub (${res.status}). Kiểm tra GITHUB_TOKEN của worker.`;
  const extra = [
    FORMATS[format] && format !== "explainer" && `kiểu: ${FORMATS[format].label}`,
    source && `nguồn: ${source}`,
    style && `phong cách: ${style}`,
    voice && `giọng: ${voice}`,
    notes && `yêu cầu: ${notes}`,
    builder && `dựng: ${builder === "beag" ? "Gemini" : "Claude"}`,
  ]
    .filter(Boolean)
    .join("\n");
  const what = revise ? `sửa video ${revise}` : topic || (source ? "Gemini chọn đề tài từ trang" : "đề tài Muse đã tìm, hoặc Gemini tự chọn");
  return `Đã xếp hàng: ${what}.${extra ? `\n${extra}` : ""}\nXong mình gửi video vào đây.`;
};

// Vietnamese voices on the ElevenLabs account (pipeline/voices.json), offered
// as /video and /sua suggest them; any other name, voice id or voice link can
// be typed instead. Left empty, the script writer picks one per video.
const VOICES = voiceList.voices.map((v) => [`${v.name} - ${v.label}`, v.id]);

const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();

// The finished videos in the repo, for /sua's autocomplete.
const videoSlugs = async (env) => {
  const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/contents/src/videos`, {
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "cloudcode-shorts-bot",
    },
  });
  if (!res.ok) return [];
  return (await res.json()).filter((f) => f.type === "dir").map((f) => f.name);
};

// The art directions in the repo, for the phongcach suggestions.
const styles = async (env) => {
  const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/contents/pipeline/art-directions.json`, {
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.raw",
      "User-Agent": "cloudcode-shorts-bot",
    },
  });
  return res.ok ? (await res.json()).directions : [];
};

const autocomplete = async (interaction, env) => {
  const focused = interaction.data.options?.find((o) => o.focused);
  const typed = fold(String(focused?.value ?? ""));
  let choices = [];
  if (focused?.name === "phongcach") {
    choices = (await styles(env))
      .filter((d) => fold(`${d.id} ${d.name}`).includes(typed))
      .map((d) => ({ name: d.name.slice(0, 100), value: d.id }));
  } else if (focused?.name === "giong") {
    choices = VOICES.filter(([name]) => fold(name).includes(typed)).map(([name, value]) => ({ name, value }));
  } else if (focused?.name === "video") {
    choices = (await videoSlugs(env))
      .filter((slug) => slug.includes(typed))
      .reverse()
      .map((slug) => ({ name: slug, value: slug }));
  }
  return json({ type: 8, data: { choices: choices.slice(0, 25) } });
};

const json = (body) =>
  new Response(JSON.stringify(body), { headers: { "Content-Type": "application/json" } });

const hexBytes = (hex) => new Uint8Array(hex.match(/../g).map((b) => parseInt(b, 16)));

// Discord signs every interaction with the app's Ed25519 key.
const verifyDiscord = async (request, body, publicKey) => {
  const signature = request.headers.get("X-Signature-Ed25519");
  const timestamp = request.headers.get("X-Signature-Timestamp");
  if (!signature || !timestamp) return false;
  const key = await crypto.subtle.importKey("raw", hexBytes(publicKey), { name: "Ed25519" }, false, [
    "verify",
  ]);
  return crypto.subtle.verify(
    "Ed25519",
    key,
    hexBytes(signature),
    new TextEncoder().encode(timestamp + body),
  );
};

// The "Gửi nháp TikTok" button the pipeline puts under a finished video's
// caption (custom_id "tt:<key>", key under tiktok-shorts/ in the bucket). It
// uploads the video to the drafts of the TikTok account last signed in on the
// website, then marks the button done; errors come back only to the presser.
const draftButton = (interaction, env, ctx) => {
  const [action, key] = String(interaction.data?.custom_id ?? "").split(/:(.*)/s);
  if (action !== "tt" || !KEY.test(key ?? "")) {
    return json({ type: 4, data: { content: "Nút này không còn dùng được.", flags: 64 } });
  }
  const hook = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;
  const button = (label, style, disabled) => [
    { type: 1, components: [{ type: 2, style, label, custom_id: `tt:${key}`, disabled }] },
  ];
  const setButton = (label, style, disabled) =>
    fetch(`${hook}/messages/@original`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ components: button(label, style, disabled) }),
    });
  const tell = (content) =>
    fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, flags: 64 }),
    });
  ctx.waitUntil(
    (async () => {
      try {
        const owner = await env.TIKTOK.get("owner");
        if (!owner) throw new Error("chưa kết nối TikTok; đăng nhập ở https://shorts.cloudcode.io.vn");
        await setButton("Đang gửi lên TikTok…", 2, true);
        const id = await sendToInbox(env, owner, PREFIX + key);
        let status = "PROCESSING_UPLOAD";
        // Workers keep waitUntil work about 30 s, so look only briefly.
        for (let i = 0; i < 5 && status.startsWith("PROCESSING"); i++) {
          await new Promise((r) => setTimeout(r, 4000));
          const s = await uploadStatus(env, owner, id);
          status = s.status ?? status;
          if (status === "FAILED") throw new Error(`TikTok không nhận video: ${s.fail_reason ?? "không rõ lý do"}`);
        }
        await setButton(status === "SEND_TO_USER_INBOX" ? "Đã vào nháp TikTok" : "Đã gửi, TikTok đang xử lý (vài phút là vào nháp)", 3, true);
      } catch (err) {
        await setButton("Gửi nháp TikTok", 1, false);
        await tell(`Chưa gửi được: ${err.message}`);
      }
    })(),
  );
  return json({ type: 6 }); // acknowledged; the button changes when done
};

const discord = async (request, env, ctx) => {
  const body = await request.text();
  if (!(await verifyDiscord(request, body, env.DISCORD_PUBLIC_KEY))) {
    return new Response("bad signature", { status: 401 });
  }
  const interaction = JSON.parse(body);
  if (interaction.type === 1) return json({ type: 1 }); // PING
  const command = interaction.data?.name;
  if (interaction.type !== 3 && command !== "video" && command !== "sua") return json({ type: 1 });

  // Only the users in ALLOWED_DISCORD_USER_IDS; server admins when it is unset.
  const user = interaction.member?.user?.id ?? interaction.user?.id;
  const allowed = String(env.ALLOWED_DISCORD_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const ADMINISTRATOR = 1n << 3n;
  const admin = (BigInt(interaction.member?.permissions ?? 0) & ADMINISTRATOR) !== 0n;
  const permitted = allowed.length ? allowed.includes(user) : admin;
  if (interaction.type === 4) return autocomplete(permitted ? interaction : { data: {} }, env);
  if (interaction.type !== 2 && interaction.type !== 3) return json({ type: 1 });
  if (!permitted) {
    return json({ type: 4, data: { content: "Bạn không có quyền dùng lệnh này.", flags: 64 } });
  }
  if (interaction.type === 3) return draftButton(interaction, env, ctx);
  const option = (name, max) =>
    String(interaction.data.options?.find((o) => o.name === name)?.value ?? "").trim().slice(0, max);
  const job = {
    topic: command === "video" ? option("topic", 200) : "",
    source: command === "video" ? option("nguon", 500) : "",
    voice: option("giong", 300),
    notes: option("yeucau", 1000),
    style: option("phongcach", 200),
    revise: command === "sua" ? option("video", 80) : "",
    builder: option("dung", 10),
    format: command === "video" ? option("kieu", 20) : "",
  };
  if (command === "sua" && !job.voice && !job.notes && !job.style && !job.builder) {
    return json({ type: 4, data: { content: "Cho mình biết cần sửa gì: `yeucau`, `phongcach`, `giong` hoặc `dung`.", flags: 64 } });
  }

  // Discord wants an answer within 3s: defer, then edit the reply once
  // GitHub has the run.
  ctx.waitUntil(
    (async () => {
      const res = await dispatch(env, job, { channel_id: interaction.channel_id });
      await fetch(
        `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: queued(res, job) }),
        },
      );
    })(),
  );
  return json({ type: 5 });
};

const telegram = async (request, env) => {
  if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response("forbidden", { status: 403 });
  }
  const message = (await request.json()).message;
  const text = message?.text?.trim();
  if (!text) return new Response("ok");
  const chatId = String(message.chat.id);
  const reply = (body) =>
    fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: body }),
    });

  if (text === "/start" || text === "/id") {
    await reply(`Chat id: ${chatId}`);
    return new Response("ok");
  }
  if (chatId !== String(env.ALLOWED_CHAT_ID)) return new Response("ok");

  const topic = text === "/auto" ? "" : text.replace(/^\/video\s*/, "").slice(0, 200);
  await reply(queued(await dispatch(env, { topic }, { chat_id: chatId }), { topic }));
  return new Response("ok");
};

// "<slug>/<file>", nothing that could climb out of the bucket's layout.
const KEY = /^[a-z0-9-]{1,80}\/[A-Za-z0-9._-]{1,120}$/;
// Every video lives under this prefix; the bucket also serves the site's media.
const PREFIX = "tiktok-shorts/";

// Makes room for `incoming` bytes: deletes the oldest videos until the videos,
// plus the new file, fit the budget. False when the new file alone is too big.
const makeRoom = async (env, incoming) => {
  const budget = (Number(env.VIDEO_BUDGET_MB) || 5120) * 1024 * 1024;
  const videos = [];
  let cursor;
  do {
    const page = await env.MEDIA.list({ prefix: PREFIX, cursor, limit: 1000 });
    videos.push(...page.objects);
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  let total = videos.reduce((n, o) => n + o.size, 0) + incoming;
  videos.sort((a, b) => a.uploaded - b.uploaded);
  const gone = [];
  while (total > budget && videos.length) {
    const old = videos.shift();
    gone.push(old.key);
    total -= old.size;
  }
  if (total > budget) return false;
  if (gone.length) await env.MEDIA.delete(gone);
  return true;
};

const upload = async (request, env, key) => {
  if (!env.UPLOAD_SECRET || request.headers.get("Authorization") !== `Bearer ${env.UPLOAD_SECRET}`) {
    return new Response("forbidden", { status: 403 });
  }
  const size = Number(request.headers.get("Content-Length"));
  if (!size) return new Response("Content-Length required", { status: 411 });
  if (!(await makeRoom(env, size))) return new Response("over the storage budget", { status: 507 });
  await env.MEDIA.put(PREFIX + key, request.body, {
    httpMetadata: { contentType: request.headers.get("Content-Type") ?? "video/mp4" },
  });
  return json({ url: `${env.MEDIA_URL}/${PREFIX}${key}` });
};

// Ideas are content, not instructions: the pipeline reads only the topic and
// the source links, and checks every fact against the sources itself.
const isUrl = (v) => {
  try {
    return ["http:", "https:"].includes(new URL(v).protocol);
  } catch {
    return false;
  }
};
const text = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const ascii = (v) =>
  v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);

const ideas = async (request, env) => {
  if (!env.IDEAS_SECRET || request.headers.get("Authorization") !== `Bearer ${env.IDEAS_SECRET}`) {
    return new Response("unauthorized", { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const idea = {
    topic: text(body?.topic, 200),
    angle: text(body?.angle, 500),
    sources: (Array.isArray(body?.sources) ? body.sources : []).filter(isUrl).slice(0, 8),
    notes: text(body?.notes, 3000),
    from: text(body?.from, 40) || "muse",
    received: new Date().toISOString(),
  };
  if (!idea.topic || !idea.sources.length) {
    return Response.json({ error: "need topic and at least one http(s) source" }, { status: 400 });
  }
  const path = `ideas/${idea.received.slice(0, 10)}-${ascii(idea.topic) || "idea"}.json`;
  const content = btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(idea, null, 2) + "\n")));
  const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "cloudcode-shorts-bot",
    },
    body: JSON.stringify({ message: `Idea: ${idea.topic}`, content }),
  });
  if (res.status === 422) return Response.json({ error: "an idea with this topic already came today" }, { status: 409 });
  if (!res.ok) return Response.json({ error: `GitHub ${res.status}` }, { status: 502 });
  return Response.json({ saved: path });
};

// The pipeline's automatic send: a post with the caption when the account
// granted Direct Post, else a draft; then waits up to about two minutes for
// TikTok. Replies { mode: "post" | "draft", status }.
const autoDraft = async (request, env) => {
  if (!env.UPLOAD_SECRET || request.headers.get("Authorization") !== `Bearer ${env.UPLOAD_SECRET}`) {
    return new Response("forbidden", { status: 403 });
  }
  const { key, caption } = (await request.json().catch(() => ({}))) ?? {};
  if (!KEY.test(key ?? "")) return Response.json({ error: "bad key" }, { status: 400 });
  const owner = await env.TIKTOK.get("owner");
  if (!owner) return Response.json({ error: "chưa kết nối TikTok; đăng nhập ở https://shorts.cloudcode.io.vn" }, { status: 409 });
  try {
    let post = typeof caption === "string" && caption.trim() && (await canPost(env, owner));
    let id;
    if (post) {
      // Until TikTok audits the app it may only post to private accounts;
      // a public account then gets a draft instead.
      id = await directPost(env, owner, PREFIX + key, caption).catch((err) => {
        if (!/unaudited_client/.test(err.message)) throw err;
        post = false;
        return null;
      });
    }
    if (!post) id = await sendToInbox(env, owner, PREFIX + key);
    let status = "PROCESSING_UPLOAD";
    for (let i = 0; i < 30 && status.startsWith("PROCESSING"); i++) {
      await new Promise((r) => setTimeout(r, 4000));
      const s = await uploadStatus(env, owner, id);
      status = s.status ?? status;
      if (status === "FAILED") return Response.json({ error: `TikTok không nhận video: ${s.fail_reason ?? "không rõ lý do"}` }, { status: 502 });
    }
    return Response.json({ publish_id: id, mode: post ? "post" : "draft", status });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 502 });
  }
};

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const [, kind, ...rest] = pathname.split("/");
    const key = decodeURIComponent(rest.join("/"));
    if (kind === "upload" && KEY.test(key) && request.method === "PUT") {
      return upload(request, env, key);
    }
    const page = await site(request, env);
    if (page) return page;
    if (request.method !== "POST") return new Response("not found", { status: 404 });
    if (pathname === "/discord") return discord(request, env, ctx);
    if (pathname === "/telegram") return telegram(request, env);
    if (pathname === "/ideas") return ideas(request, env);
    if (pathname === "/tiktok/draft") return autoDraft(request, env);
    return new Response("not found", { status: 404 });
  },
};
