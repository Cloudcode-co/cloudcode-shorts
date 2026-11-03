// Telegram bot webhook: a message from the allowed chat starts the
// "Make video" GitHub workflow with the message as the topic.
//
//   any text      → make a video about it
//   /auto         → let Gemini pick the topic
//   /start, /id   → reply with this chat's id (for TELEGRAM_CHAT_ID)
//
// Secrets (wrangler secret put): TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET,
// ALLOWED_CHAT_ID, GITHUB_TOKEN. Var: GITHUB_REPO ("owner/name").
export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("ok");
    if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.TELEGRAM_WEBHOOK_SECRET) {
      return new Response("forbidden", { status: 403 });
    }
    const update = await request.json();
    const message = update.message;
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
    const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "cloudcode-shorts-bot",
      },
      body: JSON.stringify({ event_type: "make-video", client_payload: { topic } }),
    });
    await reply(
      res.ok
        ? `Đã xếp hàng: ${topic || "Gemini tự chọn đề tài"}. Xong mình gửi video vào đây.`
        : `Không gọi được GitHub (${res.status}). Kiểm tra GITHUB_TOKEN của worker.`,
    );
    return new Response("ok");
  },
};
