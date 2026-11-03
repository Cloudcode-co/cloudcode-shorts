// Registers the bot's /video slash command with Discord. Run once, and again
// after changing the command; the "Register Discord command" workflow runs it
// with the repo's secrets.
//
//   DISCORD_APP_ID=... DISCORD_BOT_TOKEN=... node worker/register-discord.mjs
const app = process.env.DISCORD_APP_ID;
const token = process.env.DISCORD_BOT_TOKEN;
if (!app || !token) throw new Error("set DISCORD_APP_ID and DISCORD_BOT_TOKEN");

// String options; "giong" and "video" suggest values through the worker's
// autocomplete but accept anything typed (a voice link, for one).
const voice = {
  type: 3,
  name: "giong",
  description: "Giọng đọc: chọn gợi ý, hoặc gõ tên, voice id hay dán link giọng ElevenLabs",
  required: false,
  autocomplete: true,
  max_length: 300,
};
const style = {
  type: 3,
  name: "phongcach",
  description: "Phong cách hình: chọn gợi ý hoặc tự mô tả (để trống: bốc ngẫu nhiên)",
  required: false,
  autocomplete: true,
  max_length: 200,
};
const notes = (description) => ({
  type: 3,
  name: "yeucau",
  description,
  required: false,
  max_length: 1000,
});

const commands = [
  {
    name: "video",
    description: "Làm một video TikTok mới",
    options: [
      {
        type: 3, // string
        name: "topic",
        description: "Đề tài; để trống để Gemini tự chọn",
        required: false,
        max_length: 200,
      },
      style,
      voice,
      notes("Yêu cầu thêm: nền, màu, nhịp, độ dài..."),
    ],
  },
  {
    name: "sua",
    description: "Sửa một video đã làm: đổi giọng, đổi nền, đổi phong cách...",
    options: [
      {
        type: 3,
        name: "video",
        description: "Video cần sửa",
        required: true,
        autocomplete: true,
        max_length: 80,
      },
      notes("Cần sửa gì, ví dụ: nền đen, chữ to hơn, bỏ hiệu ứng rung"),
      style,
      voice,
    ],
  },
];

const res = await fetch(`https://discord.com/api/v10/applications/${app}/commands`, {
  method: "PUT",
  headers: { Authorization: `Bot ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify(commands),
});
const body = await res.text();
console.log(res.status, body);
if (!res.ok) process.exit(1);
