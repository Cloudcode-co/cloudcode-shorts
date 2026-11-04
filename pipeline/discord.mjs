// Posts pipeline results as the Discord bot into DISCORD_CHANNEL_ID (the
// channel /video was run in, or a default) when DISCORD_BOT_TOKEN is set;
// otherwise every call is a no-op. The bot needs Send Messages and Attach
// Files there.
import { spawnSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { runUrl } from "./lib.mjs";

const token = process.env.DISCORD_BOT_TOKEN;
const channel = process.env.DISCORD_CHANNEL_ID;
export const discordOn = Boolean(token && channel);

// The full video is always tried first; when Discord rejects it as too big,
// a preview is sized to DISCORD_UPLOAD_MB (default 10, the smallest cap).
const LIMIT = (Number(process.env.DISCORD_UPLOAD_MB) || 10) * 1024 * 1024 * 0.95;
const TOO_LARGE = 413;

const post = async (content, files = [], components, mention = []) => {
  if (!discordOn) return;
  const form = new FormData();
  form.append(
    "payload_json",
    JSON.stringify({ content: content.slice(0, 2000), allowed_mentions: { parse: [], users: mention }, components }),
  );
  files.forEach((f, i) => form.append(`files[${i}]`, new Blob([readFileSync(f)]), path.basename(f)));
  const res = await fetch(`https://discord.com/api/v10/channels/${channel}/messages`, {
    method: "POST",
    headers: { Authorization: `Bot ${token}` },
    body: form,
  });
  if (!res.ok) console.log(`discord: ${res.status} ${await res.text()}`);
  return res.status;
};

export const sendMessage = (text) => post(text);

// A message that pings DISCORD_NOTIFY_USER_ID, so their phone gets a push.
export const sendPing = (text) => {
  const user = process.env.DISCORD_NOTIFY_USER_ID;
  return user ? post(`<@${user}> ${text}`, [], undefined, [user]) : post(text);
};

// The caption alone (so Copy Text copies just it) with a button the bot worker
// handles: it sends the video to the connected TikTok account's drafts. `key`
// is "<slug>/<file>.mp4" under tiktok-shorts/ in the bucket.
export const sendDraftButton = (key, caption) =>
  post(caption, [], [
    { type: 1, components: [{ type: 2, style: 1, label: "Gửi nháp TikTok", custom_id: `tt:${key}` }] },
  ]);

// A finished video as one message: `text` (with the video's CDN link, which
// Discord plays inline), the drafts button when `key` is given, and a ping to
// DISCORD_NOTIFY_USER_ID when `ping` is set.
export const sendResult = (text, { key, ping } = {}) => {
  const user = ping ? process.env.DISCORD_NOTIFY_USER_ID : null;
  const button = key && [
    { type: 1, components: [{ type: 2, style: 1, label: "Gửi nháp TikTok", custom_id: `tt:${key}` }] },
  ];
  return post(user ? `<@${user}> ${text}` : text, [], button || undefined, user ? [user] : []);
};

export const sendPhotos = (files) =>
  files.length ? post("Ảnh chụp thử (có lớp giao diện TikTok):", files.slice(0, 10)) : undefined;

// Shrinks a video to a 540p preview that fits the upload cap.
const preview = (file) => {
  const probe = spawnSync(
    "npx",
    ["remotion", "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
    { encoding: "utf8", shell: process.platform === "win32" },
  );
  const seconds = Number(probe.stdout.trim()) || 120;
  // Leave room for 64 kbps audio and container overhead.
  const videoKbps = Math.max(200, Math.floor((LIMIT * 8) / 1000 / seconds) - 64 - 40);
  const out = file.replace(/\.mp4$/, "-preview.mp4");
  const r = spawnSync(
    "npx",
    [
      "remotion", "ffmpeg", "-y", "-v", "error", "-i", file,
      // Separate flags, not one "-vf a,b": cmd.exe splits arguments on commas.
      "-vf", "scale=540:-2", "-r", "30",
      "-c:v", "libx264", "-b:v", `${videoKbps}k`, "-maxrate", `${videoKbps}k`, "-bufsize", `${videoKbps * 2}k`,
      "-c:a", "aac", "-b:a", "64k",
      "-movflags", "+faststart",
      out,
    ],
    { stdio: "inherit", shell: process.platform === "win32" },
  );
  return r.status === 0 && statSync(out).size <= LIMIT ? out : null;
};

// With `url` (the video on the CDN) Discord gets the link, which it plays
// inline; otherwise the file itself, shrunk to a preview if it's too big.
export const sendVideo = async (file, caption, url) => {
  if (!discordOn) return;
  if (url) return post(`${caption}
${url}`);
  if ((await post(caption, [file])) !== TOO_LARGE) return;
  const small = preview(file);
  const full = runUrl ? `Bản đầy đủ: mục Artifacts ở ${runUrl}` : "Bản đầy đủ nằm ở mục Artifacts.";
  if (small) return post(`${caption}\nBản xem trước 540p. ${full}`, [small]);
  return post(`${caption}\nVideo quá lớn để gửi lên Discord. ${full}`);
};
