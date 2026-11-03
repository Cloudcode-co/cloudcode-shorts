# Cloudcode shorts

TikTok shorts (1080×1920, 60fps) built with Remotion. Every video lives in its
own folder and shares the building blocks in `src/kit`.

## Layout

| Path | What it holds |
| --- | --- |
| `src/kit/` | Shared parts: TikTok safe area (`SAFE`, `Shot`), fonts, `Terminal`, `BrandIcons`, `Voice` / `Sfx` / `Music`, `fit()` timing, the Cloudcode `Brand` lockup, `TikTokGuide` overlay |
| `src/videos/<slug>/Video.tsx` | The video; exports `video: VideoDef` |
| `src/videos/<slug>/script.json` | Voiceover lines per scene (ElevenLabs v3 audio tags allowed), optional `musicPrompt` |
| `src/videos/<slug>/durations.json` | Voice clip lengths in seconds, written by `npm run voice` |
| `src/videos/index.ts` | Generated list of videos (`npm run register`) |
| `public/videos/<slug>/` | That video's images, `voiceover/*.mp3`, `music.mp3` |
| `public/sfx/` | Shared sound effects |
| `pipeline/art-directions.json` | Pool of art directions a new video draws from |
| `pipeline/history.json` | Directions already used, newest last |

## Commands

```bash
npm run dev                              # Studio preview
npm run register                         # after adding/removing a video folder
npm run voice -- <slug>                  # missing voice clips (--force, or scene ids)
npm run music -- <slug>                  # background track sized to the voice
npm run qa -- <slug>                     # stills with TikTok's overlay, out/qa/<slug>/
npm run render:qsv -- <slug>             # MP4 via Intel QuickSync, out/<slug>.mp4
```

Scripts that call ElevenLabs read `ELEVENLABS_API_KEY` from `.env`.

Remotion needs a company license for some entities:
[terms](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

## Automation

`pipeline/run.mjs` makes a whole video unattended; `.github/workflows/make-video.yml`
runs it on GitHub Actions, so nothing runs on the dev machine or Cloudcode's servers.

1. `pipeline/write-script.mjs`: research comes from primary sources, for free
   (`pipeline/research.mjs`): rising GitHub repos and Hacker News links to pick a
   topic, then each repo's README, latest release and metadata. Gemini, through an
   OpenAI-compatible API (default `ag/gemini-3.8-flash-high` on
   `https://be-ag.harumi.io.vn/v1`), writes `script.json` from that, with install
   commands copied from the READMEs; real stars and avatars go into `facts.json`.
2. `scripts/voiceover.mjs`, `scripts/music.mjs`: ElevenLabs voice (Tony Nguyễn) and music.
3. `pipeline/build-video.mjs`: Claude Code draws an art direction and writes
   `Video.tsx` following `pipeline/BUILDER.md`, checking itself with `tsc` and QA
   stills. It may only edit that video's folder and run register / tsc / qa.
   If it fails, the kit's `FallbackVideo` is used so the run still ends with a video.
4. QA stills and render; the MP4 goes to R2 (`media.cloudcode.io.vn/tiktok-shorts/`)
   through the bot worker, and
   Discord and/or Telegram get the stills, a link to the video and the caption.
   The workflow commits the video's source back to the repo.

Run locally (no render unless `--render`):

```bash
node --env-file=.env pipeline/run.mjs "Coolify vs Dokploy"
```

### Setup

Repository secrets: `LLM_API_KEY`, `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`,
for Discord `DISCORD_BOT_TOKEN`, for Telegram `TELEGRAM_BOT_TOKEN` and
`TELEGRAM_CHAT_ID`. Results go back to the chat the command came from.
Optional repository variables: `LLM_BASE_URL`, `LLM_MODEL` (comma-separated
models tried in order), `CLAUDE_MODEL` (default
`claude-sonnet-5-5`), `CLAUDE_BUDGET_USD` (default 4), `AUTO_DAILY` = `true` to
make a video every night at 01:00 Vietnam time with a topic Gemini picks,
`CDN_URL` (the bot worker's URL, with the secret `CDN_UPLOAD_SECRET`; see
`worker/README.md`), `DISCORD_CHANNEL_ID` (where runs not started from Discord report),
`DISCORD_UPLOAD_MB` (default 10; 50 or 100 on boosted servers).

Start a run from the GitHub app (Actions → Make video → Run workflow), or with
`/video` in Discord or a message in Telegram through the bot in `worker/`.

In Discord:

- `/video [topic] [giong] [yeucau]` makes a new video. `giong` is an ElevenLabs
  voice: pick a suggestion, or type a name, a voice id or a voice link (a Voice
  Library voice gets added to the account). `yeucau` is free text for the script
  writer and Claude, such as "nền đen, chữ neon, nhịp nhanh".
- `/sua video [yeucau] [giong]` reworks a finished video: a new voice regenerates
  the voiceover, and `yeucau` has Claude change the existing build (or build a
  fallback video properly). Each version renders to its own file on the CDN.
