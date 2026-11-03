// Sends pipeline results to Telegram when TELEGRAM_BOT_TOKEN and
// TELEGRAM_CHAT_ID are set; otherwise every call is a no-op.
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { runUrl } from "./lib.mjs";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chat = process.env.TELEGRAM_CHAT_ID;
export const telegramOn = Boolean(token && chat);

// Bots can upload files up to 50 MB.
const UPLOAD_LIMIT = 49 * 1024 * 1024;

const call = async (method, form) => {
  if (!telegramOn) return;
  form.append("chat_id", chat);
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) console.log(`telegram ${method}: ${res.status} ${await res.text()}`);
};

const fileBlob = (file) => new Blob([readFileSync(file)]);

export const sendMessage = (text) => {
  const form = new FormData();
  form.append("text", text.slice(0, 4000));
  form.append("disable_web_page_preview", "true");
  return call("sendMessage", form);
};

// Uploads the file when it fits; otherwise sends `url` (the video on the CDN)
// or points at the run's artifacts.
export const sendVideo = async (file, caption, url) => {
  if (!telegramOn) return;
  if (statSync(file).size > UPLOAD_LIMIT) {
    if (url) return sendMessage(`${caption}
${url}`);
    return sendMessage(
      `${caption}
Video lớn hơn 50 MB nên bot không gửi được; tải ở mục Artifacts${runUrl ? `: ${runUrl}` : "."}`,
    );
  }
  const form = new FormData();
  form.append("video", fileBlob(file), path.basename(file));
  form.append("caption", caption.slice(0, 1000));
  form.append("supports_streaming", "true");
  await call("sendVideo", form);
};

export const sendPhotos = (files) => {
  if (!files.length) return;
  const form = new FormData();
  form.append(
    "media",
    JSON.stringify(files.map((_, i) => ({ type: "photo", media: `attach://p${i}` }))),
  );
  files.forEach((f, i) => form.append(`p${i}`, fileBlob(f), path.basename(f)));
  return call("sendMediaGroup", form);
};
