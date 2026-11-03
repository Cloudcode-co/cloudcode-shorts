# Telegram bot worker

Lets you start a video from Telegram: send the bot a topic and it runs the
"Make video" workflow; the finished video comes back to the same chat.

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy its token.
2. Create a fine-grained GitHub token for this repository only, with
   **Contents: Read and write** (needed for repository_dispatch).
3. Deploy, from this folder:

   ```bash
   npx wrangler deploy
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   npx wrangler secret put TELEGRAM_WEBHOOK_SECRET   # any long random string
   npx wrangler secret put GITHUB_TOKEN
   ```

4. Point Telegram at the worker (use the URL `wrangler deploy` printed):

   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=<WORKER_URL>&secret_token=<WEBHOOK_SECRET>"
   ```

5. Send `/id` to the bot, then `npx wrangler secret put ALLOWED_CHAT_ID` with that
   number. Put the same number in the repo secret `TELEGRAM_CHAT_ID`.

Messages: any text makes a video about it, `/auto` lets Gemini pick the topic.
