// Sends pipeline results to every configured channel: Telegram and/or Discord.
import * as discord from "./discord.mjs";
import * as telegram from "./telegram.mjs";

const channels = [telegram, discord];

export const notifyOn = telegram.telegramOn || discord.discordOn;
export const sendMessage = (text) => Promise.all(channels.map((c) => c.sendMessage(text)));
export const sendPhotos = (files) => Promise.all(channels.map((c) => c.sendPhotos(files)));
export const sendVideo = (file, caption, url) =>
  Promise.all(channels.map((c) => c.sendVideo(file, caption, url)));
