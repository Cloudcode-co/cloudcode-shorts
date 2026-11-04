// Writes a silent video (no voiceover, music only): a meme skit (FORMAT=meme), or
// a POV messaging thread (FORMAT=chat) with cats reacting. The meme skit is a situation the
// channel's viewers have lived, told in big captions over a still background
// with GIPHY cats reacting, on music with no voiceover. Fetches each beat's
// meme sticker (pipeline/memes.mjs) and each place's photo (pipeline/images.mjs),
// and writes durations.json from the beats' lengths.
//
//   node --env-file=.env pipeline/write-meme.mjs "deploy ngày thứ 6"
//   node --env-file=.env pipeline/write-meme.mjs            # picks its own situation
//   FORMAT=chat node --env-file=.env pipeline/write-meme.mjs "khách hỏi sao web sập"
//
// Writes src/videos/<slug>/{script.json,facts.json,durations.json} and prints
// the slug as the last line.
import { existsSync, mkdirSync } from "node:fs";
import { llmJson, readJson, report, slugify, writeJson } from "./lib.mjs";
import { addImage } from "./images.mjs";
import { addMeme, memesOn } from "./memes.mjs";
import { formatOf } from "./formats.mjs";
import { humanize } from "./humanize.mjs";

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
    musicSections: S("ARRAY", {
      description: "2–5 parts of the music that follow the story (hook, build, reveal or punchline, outro), in order",
      items: S("OBJECT", {
        properties: {
          name: S("STRING", { description: "the part, e.g. Hook, Build, Drop, Outro" }),
          from: S("STRING", { description: "number of the beat or message this part starts on (1 for the first part)" }),
          styles: S("ARRAY", { items: S("STRING"), description: "3–6 English music style tags for this part's energy (sparse, rising tension, big drop, sad violin, triumphant)" }),
        },
        required: ["name", "from", "styles"],
      }),
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
  required: ["slug", "topic", "title", "caption", "hashtags", "musicPrompt", "musicSections", "beats"],
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

// A POV chat: the same, told as messages on a phone.
const chat = formatOf(process.env.FORMAT) === "chat";
const chatSchema = S("OBJECT", {
  properties: {
    ...Object.fromEntries(Object.entries(schema.properties).filter(([k]) => k !== "beats")),
    contact: S("STRING", { description: "the other side's name as saved in the phone, Vietnamese, funny if natural (Sếp, Khách VIP, Nhóm đồ án)" }),
    messages: S("ARRAY", {
      items: S("OBJECT", {
        properties: {
          from: S("STRING", { description: "'me' or 'them'" }),
          text: S("STRING", { description: "the message, Vietnamese, 1–16 words, as people really text" }),
          reaction: S("STRING", { description: "English GIPHY search for a cat reacting to this message ('shocked cat', 'cat crying'), or empty" }),
          seconds: S("NUMBER", { description: "how long until the next message, 1.5–4" }),
        },
        required: ["from", "text", "reaction", "seconds"],
      }),
    }),
  },
  required: [...schema.required.filter((k) => k !== "beats"), "contact", "messages"],
});
const chatRules =
  `You write Vietnamese TikTok "POV" chat videos for a channel about self-hosting, servers, coding and game ` +
  `servers, watched by Vietnamese developers, IT students and gamers: a messaging thread on a phone, read in ` +
  `silence over music, with a cat sticker reacting at the big moments.
` +
  (topic
    ? `The chat is about: "${topic}".
`
    : `Pick one situation yourself, different from these recent videos: ${recent.join("; ") || "none"}.
`) +
  `The title starts with "POV:" and sets the scene ("POV: khách nhắn lúc 2h sáng hỏi sao web sập"). Write 6–12 ` +
  `messages, 15–35 seconds in total, between "me" (the developer or server admin) and "them" (a boss, a ` +
  `customer, a teammate, a friend who wants a Minecraft server). It escalates and ends on a punchline message. ` +
  `Messages read like real Vietnamese texting: short, lowercase is fine, teencode and slang where natural, never ` +
  `cringe, never explaining the joke. Give 2–4 messages a cat "reaction". Never pitch a product or hosting and ` +
  `never mention Cloudcode.
` +
  (notes ? `
The channel owner asked for this video:
${notes}
` : "");

const meme = await llmJson(chat ? chatRules : rules, chat ? chatSchema : schema, 1.0);

// Messages as beats: the message is the caption and the place is the phone.
if (chat) {
  meme.beats = (meme.messages ?? []).map((m) => ({
    caption: m.text,
    from: m.from === "me" ? "me" : "them",
    reaction: m.reaction ?? "",
    place: "",
    seconds: m.seconds,
  }));
}
const beats = (meme.beats ?? []).filter((b) => b.caption?.trim());
const total = beats.reduce((n, b) => n + Number(b.seconds || 0), 0);
const problems = [];
const [fewest, most] = chat ? [5, 14] : [3, 8];
if (beats.length < fewest || beats.length > most) problems.push(`${beats.length} beats`);
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
  lines: chat ? [b.from] : [],
  commands: [],
  repos: [],
  footage: "",
  reaction: (b.reaction ?? "").trim(),
  place: (b.place ?? "").trim(),
}));
const durations = Object.fromEntries(
  beats.map((b, i) => [`s${i + 1}`, Number(Math.min(6, Math.max(chat ? 1.5 : 2.5, Number(b.seconds) || 3)).toFixed(2))]),
);
// The humanizer pass over the captions, title and post caption.
const polished = await humanize({ title: meme.title, caption: meme.caption, scenes }, { voiced: false });
scenes.splice(0, scenes.length, ...polished.scenes);
meme.title = polished.title;
meme.caption = polished.caption;
writeJson(`src/videos/${slug}/script.json`, {
  slug,
  format: chat ? "chat" : "meme",
  topic: topic || meme.topic,
  title: meme.title,
  caption: meme.caption,
  hashtags: meme.hashtags.slice(0, 5).map((h) => (h.startsWith("#") ? h : `#${h}`)),
  musicPrompt: meme.musicPrompt,
  // Parts start on beats; the punchline usually gets the drop.
  musicSections: (meme.musicSections ?? []).map((m) => ({ ...m, from: `s${parseInt(m.from, 10) || 1}` })),
  sources: [],
  scenes,
});
writeJson(`src/videos/${slug}/durations.json`, durations);
writeJson(`src/videos/${slug}/facts.json`, {
  topic: topic || meme.topic,
  date: today,
  repos: [],
  notes: null,
  ...(chat ? { contact: meme.contact } : {}),
});

// The cats and places, fetched now so the builder starts with them.
if (memesOn()) {
  for (const s of scenes.filter((s) => s.reaction)) {
    const found = await addMeme(slug, s.reaction, s.id).catch((err) => console.log(err.message));
    console.log(`Meme for ${s.id} ("${s.reaction}"): ${found?.file ?? "none"}`);
  }
}
for (const place of [...new Set(scenes.map((s) => s.place).filter(Boolean))]) {
  const scene = scenes.find((s) => s.place === place).id;
  const found = await addImage(slug, place, { scene }).catch((err) => console.log(err.message));
  console.log(`Background for "${place}": ${found?.file ?? "none"}`);
}
console.log(scenes.map((s) => `${s.id} (${durations[s.id]}s): ${s.headline}`).join("\n"));
report(slug);
