// Writes a new video's script with an LLM (Gemini through an OpenAI-compatible
// API, see llmJson in lib.mjs) from primary sources: the projects' GitHub
// repos and READMEs (pipeline/research.mjs), plus Hacker News when it picks
// the topic itself, unless an outside researcher (Muse, through the worker's
// /ideas) left an idea in ideas/: then the oldest unused one. With SOURCE (one or more web page links), the video is
// about those pages instead: it reads them and a few linked pages on the same
// site (pipeline/web.mjs) and screenshots them for the builder.
//
//   node --env-file=.env pipeline/write-script.mjs "Coolify vs Dokploy"
//   node --env-file=.env pipeline/write-script.mjs            # picks a trending topic
//   SOURCE=https://cloudcode.io.vn node --env-file=.env pipeline/write-script.mjs
//
// Writes src/videos/<slug>/{script.json,facts.json}, public/videos/<slug>/repos/*.png,
// public/videos/<slug>/pages/*.jpg and prints the slug as the last line.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { llmJson, llmModels, readJson, report, slugify, writeJson } from "./lib.mjs";
import { FORMATS, formatOf } from "./formats.mjs";
import { humanize } from "./humanize.mjs";
import { newsCandidates, repoBrief, resolveRepos, storyCandidates, trendingCandidates } from "./research.mjs";
import { resolveVoice } from "./voices.mjs";
import { isWebUrl, pageBrief, webReader } from "./web.mjs";
import { addFootage, footageOn } from "./footage.mjs";
import { addSatellite } from "./satellite.mjs";

// The voices the script writer picks from (pipeline/voices.json); the first
// is the default.
const { voices } = readJson("pipeline/voices.json");
const VOICE = {
  voiceId: voices[0].id,
  modelId: "eleven_v3",
  // Natural: v3 at stability 0 (Creative) repeats words, stutters and adds sounds.
  voiceSettings: { stability: 0.5, similarity_boost: 0.75 },
};
// VOICE (an ElevenLabs voice id, name or link) replaces the writer's pick;
// NOTES are the channel owner's requests for this video.
const voiceAsked = Boolean(process.env.VOICE?.trim());
if (voiceAsked) {
  const voice = await resolveVoice(process.env.VOICE.trim());
  console.log(`Voice: ${voice.name}`);
  VOICE.voiceId = voice.voiceId;
}
const notes = (process.env.NOTES ?? "").trim();
const sourceUrls = (process.env.SOURCE ?? "").split(/\s+/).filter(isWebUrl).slice(0, 4);
if (process.env.SOURCE?.trim() && !sourceUrls.length) throw new Error(`SOURCE has no http(s) link: ${process.env.SOURCE}`);

const TAGS = ["excited", "curious", "casually", "impressed", "cheerfully", "warmly", "thoughtful", "laughs"];

const S = (type, extra = {}) => ({ type, ...extra });
const json = llmJson;

const history = readJson("pipeline/history.json", []);
const pastTopics = history.map((h) => h.topic).filter(Boolean);
// Repos earlier videos already covered, so the picker moves on.
const pastRepos = readdirSync("src/videos", { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) => readJson(`src/videos/${d.name}/facts.json`, { repos: [] }).repos.map((r) => r.repo.toLowerCase()));
// Ideas earlier videos already used.
const usedIdeas = new Set(
  readdirSync("src/videos", { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => readJson(`src/videos/${d.name}/facts.json`, {}).idea)
    .filter(Boolean),
);
const models = llmModels();
console.log("LLM models:", models.join(", "));

let topic = process.argv.slice(2).join(" ").trim();
// FORMAT picks the kind of video (pipeline/formats.mjs): its shape and limits.
const formatId = formatOf(process.env.FORMAT);
const format = FORMATS[formatId];
if (!format.voiced) throw new Error(`${formatId} is written by pipeline/write-meme.mjs`);
console.log(`Format: ${format.label}`);
// A story with nothing given: Gemini picks one Hacker News story to tell, and
// the video is about that page.
if (formatId === "story" && !topic && !sourceUrls.length) {
  const stories = await storyCandidates();
  if (!stories.length) throw new Error("no stories from Hacker News");
  const chosen = await llmJson(
    `Pick the best true story for a Vietnamese developer TikTok channel to retell, from these Hacker News posts: ` +
      `an outage or postmortem, a startup or side project's rise or fall, a security incident, a big bill, a hard ` +
      `bug. It must be a first-hand account with concrete events and numbers, not news, an opinion piece or a ` +
      `product launch. Skip these past topics: ${JSON.stringify(pastTopics)}.\n${JSON.stringify(stories, null, 1)}`,
    S("OBJECT", { properties: { url: S("STRING") }, required: ["url"] }),
    0.7,
  );
  const story = stories.find((s) => s.url === chosen.url) ?? stories[0];
  console.log(`Story: ${story.title} (${story.url})`);
  sourceUrls.push(story.url);
}
// The morning brief with nothing given: Gemini picks the day's 3 stories from
// Hacker News, and the video is about those pages.
if (formatId === "brief" && !topic && !sourceUrls.length) {
  const news = await newsCandidates();
  if (news.length < 3) throw new Error(`only ${news.length} news stories from Hacker News`);
  const chosen = await llmJson(
    `Pick 3 stories for this morning's tech news brief on a Vietnamese TikTok channel for developers, ` +
      `self-hosters and gamers, from the last day's top Hacker News posts below. Pick news a developer would ` +
      `tell a friend about: a release, a launch, an outage, a security problem, a price or licence change, a ` +
      `big company's move in software, AI or hosting. Three different subjects. Skip essays, opinion pieces, ` +
      `"Ask HN", politics, crime, deaths and anything a general TikTok audience shouldn't see. Then write the ` +
      `topic in Vietnamese as "Điểm tin sáng: <the three subjects in a few words each>". Skip stories already ` +
      `covered: ${JSON.stringify(pastTopics.slice(-30))}.\n${JSON.stringify(news.slice(0, 40), null, 1)}`,
    S("OBJECT", {
      properties: { urls: S("ARRAY", { items: S("STRING") }), topic: S("STRING") },
      required: ["urls", "topic"],
    }),
    0.5,
  );
  const urls = [...new Set(chosen.urls)].filter((u) => news.some((n) => n.url === u)).slice(0, 3);
  for (const n of news) if (urls.length < 3 && !urls.includes(n.url)) urls.push(n.url);
  for (const url of urls) console.log(`News: ${news.find((n) => n.url === url).title} (${url})`);
  sourceUrls.push(...urls);
  topic = chosen.topic?.trim() || "Điểm tin sáng";
}
// A what-if: Gemini picks the scenario (science and tech by turns) unless one is
// given, and the Wikipedia articles that carry its numbers become the pages to
// read. A fall or flight over a real place gets satellite imagery of it.
let whatifPlace = null;
if (formatId === "whatif" && !sourceUrls.length) {
  const kind = history.filter((h) => h.format === "whatif").length % 2 ? "tech" : "science";
  const plan = await llmJson(
    (topic
      ? `The next what-if video is about: "${topic}". Keep it as the topic.`
      : kind === "science"
        ? "Pick the next what-if video: a science or everyday-physics scenario a general TikTok audience would " +
          "watch to the end (falling from the edge of space, a city with no power for a week, the deepest dive, " +
          "standing on Mars), with real numbers that change along the way."
        : "Pick the next what-if video about computers, the internet or servers, for Vietnamese developers and " +
          "gamers (a server taking a million requests a second, every undersea cable cut, a data centre losing " +
          "cooling, a hard drive running for 100 years), with real numbers that change along the way.") +
      ` Write the topic in Vietnamese as "Nếu …". Name 1–3 English Wikipedia articles whose facts carry the ` +
      `numbers, exact titles. When it moves over a real place (a fall, a flight, a dive), give that place's ` +
      `latitude and longitude; the closest views exist only over the United States, so prefer a US place when ` +
      `the story allows (Baumgartner jumped over Roswell, New Mexico). Otherwise leave place empty. Skip these ` +
      `past topics: ${JSON.stringify(pastTopics.slice(-40))}.`,
    S("OBJECT", {
      properties: {
        topic: S("STRING"),
        wikipedia: S("ARRAY", { items: S("STRING") }),
        place: S("STRING", { description: "the place's name, or empty" }),
        lat: S("NUMBER", { description: "latitude, or 0 with no place" }),
        lon: S("NUMBER", { description: "longitude, or 0 with no place" }),
      },
      required: ["topic", "wikipedia", "place", "lat", "lon"],
    }),
    0.9,
  );
  for (const title of (plan.wikipedia ?? []).slice(0, 3)) {
    const page = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`, {
      signal: AbortSignal.timeout(20_000),
    })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
    const url = page?.type === "standard" ? page.content_urls?.desktop?.page : null;
    if (url) sourceUrls.push(url);
    console.log(`Wikipedia "${title}": ${url ?? "not found"}`);
  }
  if (!sourceUrls.length) throw new Error(`no Wikipedia article found for "${plan.topic}"`);
  topic = topic || plan.topic?.trim();
  if (plan.place?.trim() && (plan.lat || plan.lon)) whatifPlace = { name: plan.place.trim(), lat: plan.lat, lon: plan.lon };
  console.log(`What-if (${kind}): ${topic}${whatifPlace ? ` over ${whatifPlace.name}` : ""}`);
}
// With no topic and no SOURCE, the oldest idea from ideas/ that no video used.
// Only its topic, angle and source links are used: its facts are checked
// against the sources like any other research.
let idea = null;
if (!topic && !sourceUrls.length && existsSync("ideas")) {
  const file = readdirSync("ideas")
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => `ideas/${f}`)
    .find((f) => !usedIdeas.has(f));
  if (file) {
    idea = { file, ...readJson(file) };
    topic = idea.topic;
    console.log(`Idea from ${idea.from ?? "outside"}: ${topic} (${file})`);
  }
}
const today = new Date().toISOString().slice(0, 10);
const channel =
  "a Vietnamese TikTok channel for developers and self-hosters, run by a Vietnamese VPS and " +
  "game-server host, making 60–110 second videos";

// 1. Topic and the repos it is about.
const plan = S("OBJECT", {
  properties: {
    topic: S("STRING", { description: "the video's topic in Vietnamese, naming the tools exactly" }),
    repos: S("ARRAY", { items: S("STRING"), description: "owner/name of the main repos" }),
    queries: S("ARRAY", {
      items: S("STRING"),
      description: "GitHub repository search queries for close alternatives or the other side of a comparison",
    }),
  },
  required: ["topic", "repos", "queries"],
});
let picked;
// Pages read, from SOURCE and the links the planner picks on them.
const pages = [];
if (sourceUrls.length) {
  console.log("Reading pages:", sourceUrls.join(" "));
  const web = await webReader();
  for (const url of sourceUrls) {
    const page = await web.read(url);
    if (page) pages.push(page);
  }
  if (!pages.length) throw new Error(`could not read ${sourceUrls.join(" ")}`);
  const links = [...new Map(pages.flatMap((p) => p.links).map((l) => [l.href, l])).values()]
    .filter((l) => !pages.some((p) => p.url === l.href))
    .slice(0, 60);
  picked = await json(
    `For ${channel}, the next video is about the website below` +
      (topic ? `, on this topic: "${topic}"` : "") +
      `. Pages read:\n\n${pages.map(pageBrief).join("\n\n")}\n\nLinks on these pages:\n` +
      links.map((l) => `- ${l.href} ${l.text}`).join("\n") +
      "\n\n" +
      (topic
        ? "Keep the topic as given. "
        : "Pick one topic the pages can carry well for this audience, such as what the site offers and " +
          "for whom, or how to do one thing with it. Write it in Vietnamese. ") +
      'In "pages", list up to 3 of the links above worth reading for this topic (prices, plans, features, ' +
      'how-to), never sign-in, cart or legal pages. "repos" and "queries" only when the topic is about ' +
      "open-source projects on GitHub; otherwise leave them empty.",
    S("OBJECT", {
      properties: { ...plan.properties, pages: S("ARRAY", { items: S("STRING") }) },
      required: [...plan.required, "pages"],
    }),
  );
  if (topic) picked.topic = topic;
  topic = picked.topic;
  console.log("Topic:", topic);
  const linked = new Set(links.map((l) => l.href));
  for (const url of (picked.pages ?? []).filter((u) => linked.has(u)).slice(0, 3)) {
    console.log("Reading", url);
    const page = await web.read(url);
    if (page) pages.push(page);
  }
  await web.close();
} else if (topic) {
  picked = await json(
    `For ${channel}, the next video is about: "${topic}". List the GitHub repositories (owner/name) of ` +
      "the tools it is about, and up to 3 GitHub search queries that find close alternatives worth naming. " +
      "Keep the topic as given.",
    plan,
  );
  picked.topic = topic;
} else {
  console.log("Collecting trending repos from GitHub and Hacker News...");
  const candidates = await trendingCandidates(pastRepos);
  console.log(`${candidates.length} candidates`);
  if (!candidates.length) throw new Error("no trending candidates from GitHub or Hacker News");
  picked = await json(
    `Today is ${today}. Pick the next topic for ${channel}, from these real repos that are new, rising, or ` +
      `discussed on Hacker News right now:\n${JSON.stringify(candidates, null, 1)}\n\n` +
      "Pick something Vietnamese developers and self-hosters would want to try on a Linux server, with a way " +
      "to install it, and that a general TikTok audience can see: skip tools made for adult content, for " +
      "piracy or torrent and magnet downloads, for cheating, scraping people, or evading the law, even when the " +
      `README words it neutrally (signs: video codes, performers, magnet links). ${format.pick} Avoid these past ` +
      `topics: ${JSON.stringify(pastTopics)}. "repos" must come from the list above; "queries" find the ` +
      "alternatives to compare with.",
    plan,
    0.9,
  );
  topic = picked.topic;
  console.log("Topic picked:", topic);
}

// 2. Research: each repo's README, release and metadata, from GitHub itself.
console.log("Looking up repos:", JSON.stringify({ repos: picked.repos, queries: picked.queries }));
const found = await resolveRepos(picked);
if (!found.length && !pages.length) throw new Error(`no GitHub repos found for "${topic}"`);
if (found.length) console.log("Research repos:", found.join(", "));
const briefs = (await Promise.all(found.map((r, i) => repoBrief(r, i < 2 ? 12000 : 5000)))).filter(Boolean);
// Pages read for research only (docs, pricing), without screenshots: for a
// GitHub topic, or past the site's own pages.
const docs = [];
const sourcesText = () =>
  [
    pages.length && `Web pages, read on ${today}:\n\n${pages.map(pageBrief).join("\n\n")}`,
    briefs.length && `Primary sources, fetched from GitHub on ${today}:\n\n${briefs.join("\n\n")}`,
    docs.length && `More pages, read on ${today}:\n\n${docs.map(pageBrief).join("\n\n")}`,
  ]
    .filter(Boolean)
    .join("\n\n");
// The idea's own source links are read first.
const ideaSources = (idea?.sources ?? []).filter(isWebUrl).slice(0, 6);
if (ideaSources.length) {
  const web = await webReader();
  for (const url of ideaSources) {
    console.log("Idea source", url);
    const page = await web.read(url);
    if (page) docs.push(page);
  }
  await web.close();
}
let research = sourcesText();

// 3. Research notes. Gemini reads the sources closely, may ask for up to 4
// more pages linked from them (docs, pricing, comparisons), then writes notes
// in which every fact carries a verbatim quote. Facts and commands not found
// in the sources are dropped, so the script stands on checked ground.
const fold = (text) => text.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/\s+/g, " ").trim();
const linkList = () => {
  const read = new Set([...pages, ...docs].map((p) => p.url));
  const fromPages = [...pages, ...docs].flatMap((p) => p.links.map((l) => `${l.href} ${l.text}`));
  const fromText = briefs.join("\n").match(/https?:\/\/[^\s)<>"'\]]+/g) ?? [];
  return [...new Set([...fromPages, ...fromText])].filter((l) => !read.has(l.split(" ")[0])).slice(0, 80);
};
const notesSchema = S("OBJECT", {
  properties: {
    audience: S("STRING", { description: "who this is for, one sentence" }),
    angle: S("STRING", { description: "the strongest angle for a short video, one sentence" }),
    facts: S("ARRAY", {
      description: "12–30 specific facts: what it does and how, requirements, prices and limits, setup, how it differs from alternatives",
      items: S("OBJECT", {
        properties: {
          fact: S("STRING"),
          quote: S("STRING", { description: "the exact words in the sources that back the fact, copied verbatim, under 200 characters" }),
          source: S("STRING", { description: "URL of the page or repo the quote is from" }),
        },
        required: ["fact", "quote", "source"],
      }),
    }),
    install: S("ARRAY", { items: S("STRING"), description: "setup commands copied verbatim from the sources, shortest official way first; empty if none" }),
    caveats: S("ARRAY", { items: S("STRING"), description: "limits and gotchas the sources state" }),
    gaps: S("ARRAY", { items: S("STRING"), description: "what a viewer would ask that the sources do not answer" }),
    morePages: S("ARRAY", { items: S("STRING"), description: "up to 4 URLs from the link list worth reading to fill the gaps; empty when the sources are enough" }),
  },
  required: ["audience", "angle", "facts", "install", "caveats", "gaps", "morePages"],
});
const takeNotes = (links) =>
  json(
    `You research the next video for ${channel}, about "${topic}". Read the sources below closely and write ` +
      "notes for the script writer: who it is for, the angle, the specific facts with a verbatim quote for each, " +
      "setup commands, caveats and open questions. Prefer concrete facts (numbers, names, steps) over general " +
      "praise; leave out what the sources do not say.\n" +
      (idea?.angle ? `An outside researcher suggested this angle; keep it only if the sources bear it out: ${idea.angle}\n` : "") +
      (links.length
        ? `If something important is missing, name pages to read in "morePages", only from this list:\n${links.join("\n")}\n`
        : 'Leave "morePages" empty.\n') +
      `\nSources:\n${research}`,
    notesSchema,
    0.3,
  );
let researchNotes = await takeNotes(linkList());
const wantedPages = new Set(linkList().map((l) => l.split(" ")[0]));
const more = (researchNotes.morePages ?? []).filter((u) => wantedPages.has(u) && isWebUrl(u)).slice(0, 4);
if (more.length) {
  const web = await webReader();
  for (const url of more) {
    console.log("Research reads", url);
    const page = await web.read(url);
    // Pages on the subject's own site can be shown; the rest are only read.
    if (page) (pages.length && new URL(url).origin === new URL(pages[0].url).origin ? pages : docs).push(page);
  }
  await web.close();
  research = sourcesText();
  researchNotes = await takeNotes([]);
}
const sourceText = fold(research);
const factCount = researchNotes.facts.length;
researchNotes.facts = researchNotes.facts.filter((f) => f.quote && sourceText.includes(fold(f.quote).replace(/(\.\.\.|…)$/, "")));
researchNotes.install = researchNotes.install.filter((c) => sourceText.includes(fold(c)));
delete researchNotes.morePages;
console.log(`Research notes: ${researchNotes.facts.length} of ${factCount} facts found in the sources, ${researchNotes.install.length} commands`);

// 4. The script, as JSON matching a schema.
const schema = S("OBJECT", {
  properties: {
    slug: S("STRING", { description: "short kebab-case ascii id, e.g. coolify-vs-dokploy" }),
    title: S("STRING", { description: "the video's hook question in Vietnamese, under 60 characters" }),
    caption: S("STRING", { description: "TikTok caption in Vietnamese, 1–2 sentences, under 150 characters" }),
    hashtags: S("ARRAY", { items: S("STRING"), description: "exactly 5, with #, 3 niche + 2 broad Vietnamese" }),
    musicPrompt: S("STRING", { description: "ElevenLabs Music prompt for an instrumental bed fitting the topic, ends with 'no vocals'" }),
    musicSections: S("ARRAY", {
      description: "2–5 parts of the music that follow the story (hook, build, reveal or punchline, outro), in order",
      items: S("OBJECT", {
        properties: {
          name: S("STRING", { description: "the part, e.g. Hook, Build, Drop, Outro" }),
          from: S("STRING", { description: "id of the scene this part starts on (s1 for the first part)" }),
          styles: S("ARRAY", { items: S("STRING"), description: "3–6 English music style tags for this part's energy (sparse, rising tension, big drop, sad violin, triumphant)" }),
        },
        required: ["name", "from", "styles"],
      }),
    }),
    repos: S("ARRAY", {
      items: S("OBJECT", {
        properties: { repo: S("STRING", { description: "owner/name" }), name: S("STRING") },
        required: ["repo", "name"],
      }),
    }),
    sources: S("ARRAY", { items: S("STRING") }),
    voice: S("STRING", {
      description: "id of the voice that fits this video best, from: " + voices.map((v) => `${v.id} (${v.name}: ${v.fits})`).join("; "),
    }),
    scenes: S("ARRAY", {
      items: S("OBJECT", {
        properties: {
          id: S("STRING", { description: "s1, s2, ..." }),
          text: S("STRING", { description: "the voiceover line, Vietnamese, with ElevenLabs audio tags" }),
          headline: S("STRING", { description: "short on-screen headline, Vietnamese" }),
          lines: S("ARRAY", { items: S("STRING"), description: "0–4 short on-screen lines" }),
          commands: S("ARRAY", { items: S("STRING"), description: "exact shell commands shown typed, or empty" }),
          repos: S("ARRAY", { items: S("STRING"), description: "owner/name of repos whose logo appears" }),
          footage: S("STRING", {
            description: "English stock-video search of 2–5 words for real footage of people or places in this scene, or empty",
          }),
        },
        required: ["id", "text", "headline", "lines", "commands", "repos", "footage"],
      }),
    }),
  },
  required: ["slug", "title", "caption", "hashtags", "musicPrompt", "musicSections", "repos", "sources", "scenes"],
});

const rules =
  `Write a Vietnamese TikTok video script about "${topic}" from the research below.\n` +
  `Voice: a Vietnamese tech presenter talking to "anh em", lively and conversational, like presenting on stage, ` +
  `never like reading a web page. Short sentences. Questions to the viewer. Mix in ElevenLabs v3 audio tags ` +
  `in square brackets, only these: ${TAGS.map((t) => `[${t}]`).join(" ")}, at most one or two per line.\n` +
  `${format.shape} (About 14 Vietnamese words per 5 seconds spoken.) ` +
  (pages.length
    ? `The video is about what the web pages show: name the site or product as it names itself and say ` +
      `plainly what it offers and for whom. Prices, limits and specs only exactly as the pages write them. ` +
      `No hype words, no invented reviews, discounts, deadlines or urgency.\n`
    : `No advertising: never pitch a product, hosting or VPS, and never mention Cloudcode.\n`) +
  `Facts: use only facts from the research. No star counts or numbers the research does not source. ` +
  `Never invent example data: no made-up codes, file names, IDs, URLs or names on screen. ` +
  `Name tools exactly as their projects do. Headlines are what the scene says in a few words, not a label. ` +
  `Repos: only owner/name pairs from the research. The research is the projects' own READMEs and pages, so it ` +
  `praises them: say plainly what each is good at, without their marketing words.\n` +
  `Footage: in up to 4 scenes where real people or places carry the line better than graphics (someone ` +
  `gaming with friends, a developer at a desk at night, a server room), put a short English stock-video ` +
  `search in "footage"; leave it empty everywhere else.\n` +
  (notes
    ? `\nThe channel owner asked for this video (follow what is about the script, the voiceover or the ` +
      `music; requests about visuals are for the video builder, not you):\n${notes}\n`
    : "") +
  `\nResearch notes, checked against the sources (build the video on these facts and this angle):\n` +
  `${JSON.stringify(researchNotes, null, 1)}\n\nSources:\n${research}`;

const script = await json(rules, schema, 0.9);
if (!voiceAsked) {
  const picked = voices.find((v) => v.id === script.voice) ?? voices[0];
  VOICE.voiceId = picked.id;
  console.log(`Voice: ${picked.name} (picked for this video)`);
}
script.sources = [
  ...new Set([...pages.map((p) => p.url), ...found.map((r) => `https://github.com/${r}`), ...(script.sources ?? [])]),
];

// Checks the model's output; anything wrong here stops the run before spending
// voice credits.
const problems = [];
const [minScenes, maxScenes] = format.scenes;
if (script.scenes.length < minScenes || script.scenes.length > maxScenes) problems.push(`${script.scenes.length} scenes`);
const ids = new Set(script.scenes.map((s) => s.id));
if (ids.size !== script.scenes.length) problems.push("duplicate scene ids");
for (const s of script.scenes) {
  for (const tag of s.text.match(/\[[^\]]+\]/g) ?? []) {
    if (!TAGS.includes(tag.slice(1, -1))) s.text = s.text.replace(tag, "");
  }
  s.text = s.text.replace(/\s{2,}/g, " ").trim();
  if (s.commands.some((c) => /[^\x20-\x7e]/.test(c))) problems.push(`${s.id}: non-ascii command`);
}
const words = script.scenes.reduce((n, s) => n + s.text.replace(/\[[^\]]+\]/g, "").split(/\s+/).length, 0);
if (words < format.words[0] || words > format.words[1]) problems.push(`${words} spoken words`);
script.hashtags = script.hashtags.slice(0, 5).map((h) => (h.startsWith("#") ? h : `#${h}`));
if (problems.length) throw new Error(`script rejected: ${problems.join("; ")}`);
// The humanizer pass over the voice lines, on-screen words and post caption.
Object.assign(script, await humanize(script, { voiced: true }));

let slug = slugify(script.slug || topic) || `video-${today}`;
for (let n = 2; existsSync(`src/videos/${slug}`); n++) slug = `${slugify(script.slug || topic)}-${n}`;

// Real numbers and logos straight from GitHub.
const gh = { "User-Agent": "cloudcode-shorts", ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) };
mkdirSync(`public/videos/${slug}/repos`, { recursive: true });
const repos = [];
const wanted = new Set([...script.repos.map((r) => r.repo), ...script.scenes.flatMap((s) => s.repos)]);
for (const full of wanted) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(full)) continue;
  const res = await fetch(`https://api.github.com/repos/${full}`, { headers: gh });
  if (!res.ok) {
    console.log(`skip ${full}: ${res.status}`);
    continue;
  }
  const r = await res.json();
  const avatar = `repos/${r.owner.login}.png`;
  const img = await fetch(`${r.owner.avatar_url}&s=400`);
  if (img.ok) writeFileSync(`public/videos/${slug}/${avatar}`, Buffer.from(await img.arrayBuffer()));
  repos.push({
    repo: r.full_name,
    asked: full,
    name: script.repos.find((x) => x.repo === full)?.name ?? r.name,
    stars: r.stargazers_count,
    description: r.description,
    license: r.license?.spdx_id ?? null,
    language: r.language,
    pushedAt: r.pushed_at,
    url: r.html_url,
    avatar: img.ok ? avatar : null,
  });
}
// The pages' screenshots, icon and share image, for the builder to show.
const pageFacts = [];
if (pages.length) mkdirSync(`public/videos/${slug}/pages`, { recursive: true });
const IMAGE_EXT = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg" };
for (const [n, p] of pages.entries()) {
  const shots = p.shots.map((buf, i) => {
    const file = `pages/p${n + 1}-${i + 1}.jpg`;
    writeFileSync(`public/videos/${slug}/${file}`, buf);
    return file;
  });
  const download = async (url, name) => {
    if (!url) return null;
    const res = await fetch(url, { signal: AbortSignal.timeout(20_000) }).catch(() => null);
    const ext = res?.ok ? IMAGE_EXT[(res.headers.get("content-type") ?? "").split(";")[0]] : null;
    if (!ext) return null;
    const file = `pages/p${n + 1}-${name}.${ext}`;
    writeFileSync(`public/videos/${slug}/${file}`, Buffer.from(await res.arrayBuffer()));
    return file;
  };
  pageFacts.push({
    url: p.url,
    title: p.title,
    description: p.description,
    shots,
    icon: await download(p.icon, "icon"),
    image: await download(p.image, "share"),
  });
}

// Drop logo references to repos that don't exist.
const known = new Set(repos.map((r) => r.asked));
for (const s of script.scenes) s.repos = s.repos.filter((r) => known.has(r));

mkdirSync(`src/videos/${slug}`, { recursive: true });
writeJson(`src/videos/${slug}/script.json`, {
  slug,
  format: formatId,
  topic,
  title: script.title,
  caption: script.caption,
  hashtags: script.hashtags,
  musicPrompt: script.musicPrompt,
  musicSections: script.musicSections ?? [],
  sources: script.sources,
  ...VOICE,
  scenes: script.scenes,
});
writeJson(`src/videos/${slug}/facts.json`, {
  topic,
  models,
  date: today,
  repos,
  pages: pageFacts,
  idea: idea?.file ?? null,
  notes: researchNotes,
  research,
});

// Satellite imagery for a what-if over a real place.
if (whatifPlace) {
  const sat = await addSatellite(slug, whatifPlace.lat, whatifPlace.lon, 3, 16).catch((err) => console.log(err.message));
  if (sat) console.log(`Satellite over ${whatifPlace.name}: zoom ${sat.from}–${sat.to}, ${sat.tiles - sat.missing} tiles`);
}
// Stock footage for the scenes that asked for it.
if (footageOn()) {
  for (const s of script.scenes.filter((s) => s.footage?.trim()).slice(0, 4)) {
    const clip = await addFootage(slug, s.footage.trim().slice(0, 100), s.id).catch((err) => console.log(err.message));
    console.log(`Footage for ${s.id} ("${s.footage}"): ${clip?.file ?? "none"}`);
  }
}
report(slug);
