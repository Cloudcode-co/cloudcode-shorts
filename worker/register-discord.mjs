// Registers the bot's /video slash command with Discord. Run once, and again
// after changing the command.
//
//   DISCORD_APP_ID=... DISCORD_BOT_TOKEN=... node worker/register-discord.mjs
const app = process.env.DISCORD_APP_ID;
const token = process.env.DISCORD_BOT_TOKEN;
if (!app || !token) throw new Error("set DISCORD_APP_ID and DISCORD_BOT_TOKEN");

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
    ],
  },
];

const res = await fetch(`https://discord.com/api/v10/applications/${app}/commands`, {
  method: "PUT",
  headers: { Authorization: `Bot ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify(commands),
});
console.log(res.status, await res.text());
