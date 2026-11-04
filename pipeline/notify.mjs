// Sends pipeline results to every configured channel: Telegram and/or Discord.
import * as discord from "./discord.mjs";
import * as telegram from "./telegram.mjs";

const channels = [telegram, discord];

export const notifyOn = telegram.telegramOn || discord.discordOn;
export const sendMessage = (text) => Promise.all(channels.map((c) => c.sendMessage(text)));
export const sendPhotos = (files) => Promise.all(channels.map((c) => c.sendPhotos(files)));
export const sendVideo = (file, caption, url) =>
  Promise.all(channels.map((c) => c.sendVideo(file, caption, url)));
// A finished video: one message about it, then its caption on its own so Copy
// Text copies just the caption. On Discord, with the CDN link, the first
// message carries the ping and the caption the drafts button (`key`).
export const sendResult = async (file, url, text, caption, { key, ping } = {}) => {
  await Promise.all([
    telegram.sendVideo(file, text, url),
    url ? discord.sendResult(`${text}\n${url}`, { ping }) : discord.sendVideo(file, text),
  ]);
  await Promise.all([telegram.sendMessage(caption), discord.sendResult(caption, { key })]);
};
