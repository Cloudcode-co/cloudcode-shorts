// Sends pipeline results to every configured channel: Telegram and/or Discord.
import * as discord from "./discord.mjs";
import * as telegram from "./telegram.mjs";

const channels = [telegram, discord];

export const notifyOn = telegram.telegramOn || discord.discordOn;
export const sendMessage = (text) => Promise.all(channels.map((c) => c.sendMessage(text)));
export const sendPhotos = (files) => Promise.all(channels.map((c) => c.sendPhotos(files)));
export const sendVideo = (file, caption, url) =>
  Promise.all(channels.map((c) => c.sendVideo(file, caption, url)));
// A finished video and everything about it in one message per channel. On
// Discord, with the CDN link, it carries the drafts button (`key`) and the ping.
export const sendResult = (file, url, text, opts) =>
  Promise.all([
    telegram.sendVideo(file, text, url),
    url ? discord.sendResult(`${text}\n${url}`, opts) : discord.sendVideo(file, text),
  ]);
