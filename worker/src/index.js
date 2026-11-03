// Starts the "Make video" GitHub workflow from chat, and stores finished
// videos in the media R2 bucket so chat gets a link instead of a size-capped
// upload.
//
//   POST /discord      Discord interactions: /video [topic]
//   POST /telegram     Telegram bot webhook: any text is the topic, /auto lets
//                      Gemini pick, /id replies with the chat id
//   PUT  /upload/<key> store a video under tiktok-shorts/ in the bucket
//                      (Authorization: Bearer UPLOAD_SECRET); replies with its
//                      public URL on MEDIA_URL
//
// Secrets (wrangler secret put): GITHUB_TOKEN, UPLOAD_SECRET, plus for Discord
// DISCORD_PUBLIC_KEY and ALLOWED_DISCORD_USER_IDS (comma-separated), and for
// Telegram TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, ALLOWED_CHAT_ID.
// Vars: GITHUB_REPO ("owner/name"), MEDIA_URL. R2 binding: MEDIA.

// Fires repository_dispatch; the workflow reads the topic and where to send
// the result (Discord channel_id or Telegram chat_id) from client_payload.
const dispatch = (env, topic, replyTo) =>
  fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "cloudcode-shorts-bot",
    },
    body: JSON.stringify({ event_type: "make-video", client_payload: { topic, ...replyTo } }),
  });

const queued = (res, topic) =>
  res.ok
    ? `Đã xếp hàng: ${topic || "Gemini tự chọn đề tài"}. Xong mình gửi video vào đây.`
    : `Không gọi được GitHub (${res.status}). Kiểm tra GITHUB_TOKEN của worker.`;

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

const discord = async (request, env, ctx) => {
  const body = await request.text();
  if (!(await verifyDiscord(request, body, env.DISCORD_PUBLIC_KEY))) {
    return new Response("bad signature", { status: 401 });
  }
  const interaction = JSON.parse(body);
  if (interaction.type === 1) return json({ type: 1 }); // PING
  if (interaction.type !== 2 || interaction.data.name !== "video") return json({ type: 1 });

  const user = interaction.member?.user?.id ?? interaction.user?.id;
  const allowed = String(env.ALLOWED_DISCORD_USER_IDS ?? "").split(",").map((s) => s.trim());
  if (!allowed.includes(user)) {
    return json({ type: 4, data: { content: "Bạn không có quyền dùng lệnh này.", flags: 64 } });
  }
  const topic = String(
    interaction.data.options?.find((o) => o.name === "topic")?.value ?? "",
  ).slice(0, 200);

  // Discord wants an answer within 3s: defer, then edit the reply once
  // GitHub has the run.
  ctx.waitUntil(
    (async () => {
      const res = await dispatch(env, topic, { channel_id: interaction.channel_id });
      await fetch(
        `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: queued(res, topic) }),
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
  await reply(queued(await dispatch(env, topic, { chat_id: chatId }), topic));
  return new Response("ok");
};

// "<slug>/<file>", nothing that could climb out of the bucket's layout.
const KEY = /^[a-z0-9-]{1,80}\/[A-Za-z0-9._-]{1,120}$/;
// Every video lives under this prefix; the bucket also serves the site's media.
const PREFIX = "tiktok-shorts/";

const upload = async (request, env, key) => {
  if (!env.UPLOAD_SECRET || request.headers.get("Authorization") !== `Bearer ${env.UPLOAD_SECRET}`) {
    return new Response("forbidden", { status: 403 });
  }
  await env.MEDIA.put(PREFIX + key, request.body, {
    httpMetadata: { contentType: request.headers.get("Content-Type") ?? "video/mp4" },
  });
  return json({ url: `${env.MEDIA_URL}/${PREFIX}${key}` });
};

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const [, kind, ...rest] = pathname.split("/");
    const key = decodeURIComponent(rest.join("/"));
    if (kind === "upload" && KEY.test(key) && request.method === "PUT") {
      return upload(request, env, key);
    }
    if (request.method !== "POST") return new Response("not found", { status: 404 });
    if (pathname === "/discord") return discord(request, env, ctx);
    if (pathname === "/telegram") return telegram(request, env);
    return new Response("not found", { status: 404 });
  },
};
