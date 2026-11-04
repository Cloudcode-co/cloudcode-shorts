// Uploads a finished video to R2 through the bot worker (worker/), so chats get
// a link to the full video instead of a size-capped upload. Needs CDN_URL (the
// worker's URL) and CDN_UPLOAD_SECRET; returns the public URL, or null.
import { readFileSync } from "node:fs";
import path from "node:path";

export const uploadVideo = async (file, slug) => {
  const base = process.env.CDN_URL?.replace(/\/+$/, "");
  const secret = process.env.CDN_UPLOAD_SECRET;
  if (!base || !secret) return null;
  const res = await fetch(`${base}/upload/${slug}/${path.basename(file)}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "video/mp4" },
    body: readFileSync(file),
  });
  if (!res.ok) {
    console.log(`cdn upload: ${res.status} ${await res.text()}`);
    return null;
  }
  return (await res.json()).url;
};

// Sends a video already on the CDN to the connected TikTok account through the
// same worker: posted with the caption when the account granted Direct Post,
// else to the drafts. Returns { mode: "post" | "draft", status } or { error }.
export const sendToDrafts = async (slug, file, caption) => {
  const base = process.env.CDN_URL?.replace(/\/+$/, "");
  const secret = process.env.CDN_UPLOAD_SECRET;
  if (!base || !secret) return { error: "no CDN_URL or CDN_UPLOAD_SECRET" };
  const res = await fetch(`${base}/tiktok/draft`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify({ key: `${slug}/${path.basename(file)}`, caption }),
    signal: AbortSignal.timeout(180_000),
  }).catch((err) => ({ ok: false, status: 0, json: async () => ({ error: err.message }) }));
  const data = await res.json().catch(() => ({}));
  return res.ok ? data : { error: data.error ?? `worker ${res.status}` };
};
