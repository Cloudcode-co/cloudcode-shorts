// Writes a meme skit (FORMAT=meme) instead of an explainer: a situation the
// channel's viewers have lived, told in big captions over a still background
// with GIPHY cats reacting, on music with no voiceover. Fetches each beat's
// meme sticker (pipeline/memes.mjs) and each place's photo (pipeline/images.mjs),
// and writes durations.json from the beats' lengths.
//
//   node --env-file=.env pipeline/write-meme.mjs "deploy ngày thứ 6"
//   node --env-file=.env pipeline/write-meme.mjs            # picks its own situation
//
// Writes src/videos/<slug>/{script.json,facts.json,durations.json} and prints
// the slug as the last line.
import { existsSync, mkdirSync } from "node:fs";
import { llmJson, readJson, report, slugify, writeJson } from "./lib.mjs";
import { addImage } from "./images.mjs";
import { addMeme, memesOn } from "./memes.mjs";

const S = (type, extra = {}) => ({ type, ...extra });
const topic = (process.argv.slice(2).join(" ") || process.env.TOPIC || "").trim();
const notes = (process.env.NOTES ?? "").trim();
const today = new Date().toISOString().slice(0, 10);
const recent = readJson("pipeline/history.json", [])
  .slice(-20)
  .map((h) => h.topic)
  .filter(Boolean);

const schema = S("OBJECT", {
  properties: {
    slug: S("STRING", { description: "short kebab-case ascii id" }),
    topic: S("STRING", { description: "the situation in a few Vietnamese words" }),
    title: S("STRING", { description: "the skit's hook in Vietnamese, under 60 characters" }),
    caption: S("STRING", { description: "TikTok caption in Vietnamese: one line, then a question that makes viewers comment; under 150 characters" }),
    hashtags: S("ARRAY", { items: S("STRING"), description: "exactly 5, with #, 3 niche + 2 broad Vietnamese" }),
    musicPrompt: S("STRING", {
      description: "ElevenLabs Music prompt: a catchy meme track for the skit's mood (bouncy, dramatic, sad violin...), ends with 'no vocals'",
    }),
    beats: S("ARRAY", {
      items: S("OBJECT", {
        properties: {
          caption: S("STRING", { description: "the on-screen line, Vietnamese, 6–18 words" }),
          reaction: S("STRING", { description: "English GIPHY sticker search for the cats' reaction, 2–4 words starting with 'cat'" }),
          place: S("STRING", { description: "English photo search for where it happens, 2–4 words" }),
          seconds: S("NUMBER", { description: "how long the line stays, 2.5–5" }),
        },
        required: ["caption", "reaction", "place", "seconds"],
      }),
    }),
  },
  required: ["slug", "topic", "title", "caption", "hashtags", "musicPrompt", "beats"],
});

const rules =
  `You write Vietnamese TikTok meme skits for a channel about self-hosting, servers, coding and game servers ` +
  `(Minecraft, Discord bots, VPS), watched by Vietnamese developers, IT students and gamers.\n` +
  `The format is the one popular on Vietnamese TikTok: a still photo of a place as the background, one or two ` +
  `dancing or reacting cat stickers, and a big caption at the top telling the situation. No voiceover, music only.\n` +
  (topic
    ? `The skit is about: "${topic}". When that is a tool or a product, joke about the situations around using it, ` +
      `and state nothing about it that is not common knowledge.\n`
    : `Pick one situation yourself, different from these recent videos: ${recent.join("; ") || "none"}.\n`) +
  `Write 4–7 beats, 14–28 seconds in total. Beat 1 sets up a specific situation the viewers have lived, with ` +
  `who and what, the way these memes do: "2 nhỏ intern phòng Marketing quay content cho kênh TikTok vài chục ` +
  `followers", "dev 3 giờ sáng fix xong bug production rồi đi ngủ". The next beats escalate or twist it; the ` +
  `last beat is the punchline. Captions are plain spoken Vietnamese the way Gen Z writes on TikTok: short, ` +
  `concrete, a little self-mocking, slang where natural (anh em, toang, căng, ảo thật đấy), never cringe, never ` +
  `explaining the joke, no hashtags. Never pitch a product or hosting and never mention Cloudcode. ` +
  `Each beat names the cats' reaction (a GIPHY sticker search: "cat dancing", "cat vibing", "cat crying", ` +
  `"shocked cat", "cat typing laptop", "cat panic", "cat facepalm"), the place (a photo search: "open office", ` +
  `"bedroom at night computer", "server room", "coffee shop laptop", "internet cafe gaming"), and how many ` +
  `seconds it stays (about 0.3 s per word plus 1.2 s). Keep the same place across beats unless the story moves.\n` +
  (notes ? `\nThe channel owner asked for this video:\n${notes}\n` : "");

const meme = await llmJson(rules, schema, 1.0);

const beats = (meme.beats ?? []).filter((b) => b.caption?.trim());
const total = beats.reduce((n, b) => n + Number(b.seconds || 0), 0);
const problems = [];
if (beats.length < 3 || beats.length > 8) problems.push(`${beats.length} beats`);
if (total < 10 || total > 40) problems.push(`${total.toFixed(1)}s in total`);
if (problems.length) throw new Error(`meme rejected: ${problems.join("; ")}`);

let slug = slugify(meme.slug || meme.topic) || `meme-${today}`;
for (let n = 2; existsSync(`src/videos/${slug}`); n++) slug = `${slugify(meme.slug || meme.topic)}-${n}`;
mkdirSync(`src/videos/${slug}`, { recursive: true });

// Scenes in the explainer's shape, so the kit, QA and review read them as usual:
// the caption is the headline and there is no voice line.
const scenes = beats.map((b, i) => ({
  id: `s${i + 1}`,
  text: "",
  headline: b.caption.trim(),
  lines: [],
  commands: [],
  repos: [],
  footage: "",
  reaction: b.reaction.trim(),
  place: b.place.trim(),
}));
const durations = Object.fromEntries(
  beats.map((b, i) => [`s${i + 1}`, Number(Math.min(6, Math.max(2.5, Number(b.seconds) || 3)).toFixed(2))]),
);
writeJson(`src/videos/${slug}/script.json`, {
  slug,
  format: "meme",
  topic: topic || meme.topic,
  title: meme.title,
  caption: meme.caption,
  hashtags: meme.hashtags.slice(0, 5).map((h) => (h.startsWith("#") ? h : `#${h}`)),
  musicPrompt: meme.musicPrompt,
  sources: [],
  scenes,
});
writeJson(`src/videos/${slug}/durations.json`, durations);
writeJson(`src/videos/${slug}/facts.json`, { topic: topic || meme.topic, date: today, repos: [], notes: null });

// The cats and places, fetched now so the builder starts with them.
if (memesOn()) {
  for (const s of scenes) {
    const found = await addMeme(slug, s.reaction, s.id).catch((err) => console.log(err.message));
    console.log(`Meme for ${s.id} ("${s.reaction}"): ${found?.file ?? "none"}`);
  }
}
for (const place of [...new Set(scenes.map((s) => s.place))]) {
  const scene = scenes.find((s) => s.place === place).id;
  const found = await addImage(slug, place, { scene }).catch((err) => console.log(err.message));
  console.log(`Background for "${place}": ${found?.file ?? "none"}`);
}
console.log(scenes.map((s) => `${s.id} (${durations[s.id]}s): ${s.headline}`).join("\n"));
report(slug);
