// Starts the "Make video" GitHub workflow from chat, and stores finished
// videos in the media R2 bucket so chat gets a link instead of a size-capped
// upload.
//
//   POST /discord      Discord interactions: /video [topic] [giong] [yeucau],
//                      /sua video [yeucau] [giong], their autocomplete, /tiktok
//                      (connect a TikTok account) and the Duyệt / Bỏ buttons
//                      under finished videos (Duyệt sends it to TikTok drafts)
//   GET  /tiktok/callback  TikTok's redirect after connecting an account
//   POST /telegram     Telegram bot webhook: any text is the topic, /auto lets
//                      Gemini pick, /id replies with the chat id
//   PUT  /upload/<key> store a video under tiktok-shorts/ in the bucket
//                      (Authorization: Bearer UPLOAD_SECRET); replies with its
//                      public URL on MEDIA_URL
//
// Secrets (wrangler secret put): GITHUB_TOKEN, UPLOAD_SECRET, plus for Discord
// DISCORD_PUBLIC_KEY and optionally ALLOWED_DISCORD_USER_IDS (comma-separated;
// server admins may always run /video), and for
// Telegram TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, ALLOWED_CHAT_ID, and for
// TikTok TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET.
// Vars: GITHUB_REPO ("owner/name"), MEDIA_URL. R2 binding: MEDIA. KV binding:
// TIKTOK (TikTok tokens).
import * as tiktok from "./tiktok.js";

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

const queued = (res, { topic, voice, notes, revise }) => {
  if (!res.ok) return `Không gọi được GitHub (${res.status}). Kiểm tra GITHUB_TOKEN của worker.`;
  const extra = [voice && `giọng: ${voice}`, notes && `yêu cầu: ${notes}`].filter(Boolean).join("\n");
  const what = revise ? `sửa video ${revise}` : topic || "Gemini tự chọn đề tài";
  return `Đã xếp hàng: ${what}.${extra ? `\n${extra}` : ""}\nXong mình gửi video vào đây.`;
};

// Vietnamese voices on the ElevenLabs account, offered as /video and /sua
// suggest them; any other name, voice id or voice link can be typed instead.
const VOICES = [
  ["Tony Nguyễn (mặc định)", "2ZUpiKo5wCCuypvx2zaS"],
  ["Linh Chi - nữ, giọng Bắc", "smHgfqI7ihNDlaBs0X9I"],
  ["Linh - nữ, nhẹ nhàng", "L5c6tGA8OiORYKxez5Zu"],
  ["Quang Toàn - nam, trầm, kể chuyện", "ZsjEJaLQy3sgvwxicmDx"],
  ["Hùng - nam, giọng Bắc", "oeKUzII6QxB7vwV6fpNJ"],
  ["Hiếu Trần - nam, trầm ấm", "WVkYyTxxVgMOsw1IIVL0"],
  ["Xuân Hòa - nam, kể chuyện", "kOiTmIEmO9JLCQDT4Zc3"],
  ["Trung Caha - nam, rõ ràng", "ueSxRO0nLF1bj93J2hVt"],
  ["Nhật - nam, dẫn chuyện", "6adFm46eyy74snVn6YrT"],
];

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

const autocomplete = async (interaction, env) => {
  const focused = interaction.data.options?.find((o) => o.focused);
  const typed = fold(String(focused?.value ?? ""));
  let choices = [];
  if (focused?.name === "giong") {
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

// The Duyệt / Bỏ buttons the pipeline puts under a finished video. Their
// custom_id is "tt:<key>" or "skip:<key>", key being the video under
// tiktok-shorts/ in the bucket.
const STATUS = "\n\nTikTok: ";
const button = (interaction, env, ctx) => {
  const [action, key] = String(interaction.data.custom_id ?? "").split(/:(.*)/s);
  // The message without the status line an earlier press added.
  const original = (interaction.message?.content ?? "").split(STATUS)[0];
  if (!KEY.test(key ?? "")) return json({ type: 4, data: { content: "Nút này không còn dùng được.", flags: 64 } });
  if (action === "skip") {
    return json({ type: 7, data: { content: `${original}${STATUS}đã bỏ qua, không gửi lên TikTok.`, components: [] } });
  }
  if (action !== "tt") return json({ type: 6 });

  const edit = (content, components = []) =>
    fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `${original}${STATUS}${content}`, components }),
    });
  ctx.waitUntil(
    (async () => {
      try {
        const id = await tiktok.sendToInbox(env, PREFIX + key);
        // Usually reaches the inbox within seconds; look a few times.
        let status = "PROCESSING_UPLOAD";
        for (let i = 0; i < 4 && status.startsWith("PROCESSING"); i++) {
          await new Promise((r) => setTimeout(r, 4000));
          const s = await tiktok.uploadStatus(env, id);
          status = s.status ?? status;
          if (status === "FAILED") throw new Error(`TikTok không nhận video: ${s.fail_reason ?? "không rõ lý do"}`);
        }
        await edit(
          status === "SEND_TO_USER_INBOX"
            ? "đã vào hộp nháp. Mở thông báo trong app TikTok, dán caption ở trên rồi đăng."
            : `đã gửi, TikTok đang xử lý (${status}). Lát nữa xem thông báo trong app TikTok.`,
        );
      } catch (err) {
        await edit(`lỗi: ${err.message}. Bấm Duyệt để thử lại.`, interaction.message?.components ?? []);
      }
    })(),
  );
  return json({ type: 6 }); // acknowledge; the message is edited when done
};

const discord = async (request, env, ctx) => {
  const body = await request.text();
  if (!(await verifyDiscord(request, body, env.DISCORD_PUBLIC_KEY))) {
    return new Response("bad signature", { status: 401 });
  }
  const interaction = JSON.parse(body);
  if (interaction.type === 1) return json({ type: 1 }); // PING
  if (interaction.type === 4) return autocomplete(interaction, env);

  // Server admins, plus anyone listed in ALLOWED_DISCORD_USER_IDS.
  const user = interaction.member?.user?.id ?? interaction.user?.id;
  const allowed = String(env.ALLOWED_DISCORD_USER_IDS ?? "").split(",").map((s) => s.trim());
  const ADMINISTRATOR = 1n << 3n;
  const admin = (BigInt(interaction.member?.permissions ?? 0) & ADMINISTRATOR) !== 0n;
  if (!admin && !allowed.includes(user)) {
    return json({ type: 4, data: { content: "Bạn không có quyền dùng lệnh này.", flags: 64 } });
  }

  if (interaction.type === 3) return button(interaction, env, ctx);
  const command = interaction.data?.name;
  if (interaction.type !== 2) return json({ type: 1 });
  if (command === "tiktok") {
    if (!env.TIKTOK_CLIENT_KEY || !env.TIKTOK_CLIENT_SECRET || !env.TIKTOK) {
      return json({ type: 4, data: { content: "Worker chưa có TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET.", flags: 64 } });
    }
    const status = (await tiktok.connected(env)) ? "Đang kết nối một tài khoản TikTok." : "Chưa kết nối TikTok.";
    const link = await tiktok.loginUrl(request, env);
    return json({
      type: 4,
      data: { content: `${status}\n[Đăng nhập TikTok để kết nối](${link}) (link dùng một lần, hết hạn sau 10 phút).`, flags: 64 },
    });
  }
  if (command !== "video" && command !== "sua") return json({ type: 1 });
  const option = (name, max) =>
    String(interaction.data.options?.find((o) => o.name === name)?.value ?? "").trim().slice(0, max);
  const job = {
    topic: command === "video" ? option("topic", 200) : "",
    voice: option("giong", 300),
    notes: option("yeucau", 1000),
    revise: command === "sua" ? option("video", 80) : "",
  };
  if (command === "sua" && !job.voice && !job.notes) {
    return json({ type: 4, data: { content: "Cho mình biết cần sửa gì: `yeucau`, `giong`, hoặc cả hai.", flags: 64 } });
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
    if (pathname === "/tiktok/callback" && request.method === "GET") return tiktok.callback(request, env);
    if (request.method !== "POST") return new Response("not found", { status: 404 });
    if (pathname === "/discord") return discord(request, env, ctx);
    if (pathname === "/telegram") return telegram(request, env);
    return new Response("not found", { status: 404 });
  },
};
