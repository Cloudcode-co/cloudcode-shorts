# Chat bot worker

A Cloudflare Worker that starts the "Make video" workflow from chat:
`/video <topic>` in Discord, or any message to the Telegram bot. The finished
video comes back to the same channel or chat as a link to R2. Set up either
chat or both.

## Common

1. Create a fine-grained GitHub token for `Cloudcode-co/cloudcode-shorts` only,
   with **Contents: Read and write** (needed to start the workflow).
2. From this folder:

   ```bash
   npx wrangler deploy
   npx wrangler secret put GITHUB_TOKEN
   npx wrangler secret put UPLOAD_SECRET    # any long random string
   ```

3. In the GitHub repo, set the variable `CDN_URL` to the worker URL
   `wrangler deploy` printed, and the secret `CDN_UPLOAD_SECRET` to the same
   string as `UPLOAD_SECRET`. Finished videos are then stored in the `cloudcode`
   R2 bucket under `tiktok-shorts/`, and chats get a link
   (`https://media.cloudcode.io.vn/tiktok-shorts/<slug>/<slug>.mp4`) that Discord
   plays inline, instead of an upload capped at 10 MB. Worker requests are capped
   at 100 MB, plenty for a short.

## Discord

One bot takes `/video` and posts the result back into the same channel.

1. In the [Developer Portal](https://discord.com/developers/applications), create
   an application. Copy its **Application ID** and **Public Key**; under **Bot**,
   reset and copy the bot token.
2. Invite it: **Installation** → Guild Install, scopes `bot` and
   `applications.commands`, permissions **Send Messages** and **Attach Files**;
   open the install link and pick the server.
3. Put the bot token in the repo secret `DISCORD_BOT_TOKEN`.
4. Set the worker secret `DISCORD_PUBLIC_KEY`. Server admins can run `/video`;
   to let others, also set `ALLOWED_DISCORD_USER_IDS` to their user ids
   (comma-separated; Developer Mode, right-click a user, Copy User ID).

   ```bash
   npx wrangler secret put DISCORD_PUBLIC_KEY
   npx wrangler secret put ALLOWED_DISCORD_USER_IDS   # optional
   ```

5. Set **Interactions Endpoint URL** to `<WORKER_URL>/discord` and save (Discord
   checks it right away).
6. Register the command once:

   ```bash
   DISCORD_APP_ID=<app id> DISCORD_BOT_TOKEN=<bot token> node register-discord.mjs
   ```

7. Optional: the repo variable `DISCORD_CHANNEL_ID` is where runs started from
   GitHub or the nightly schedule report.

## Telegram

1. Create a bot with [@BotFather](https://t.me/BotFather).
2. `npx wrangler secret put TELEGRAM_BOT_TOKEN` and `TELEGRAM_WEBHOOK_SECRET`
   (any long random string).
3. Point Telegram at the worker:

   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=<WORKER_URL>/telegram&secret_token=<WEBHOOK_SECRET>"
   ```

4. Send `/id` to the bot, then `npx wrangler secret put ALLOWED_CHAT_ID` with
   that number. Put the bot token in the repo secret `TELEGRAM_BOT_TOKEN`, and
   the number in `TELEGRAM_CHAT_ID` (where runs not started from Telegram report).
