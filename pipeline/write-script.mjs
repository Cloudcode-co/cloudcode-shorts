// Writes a new video's script with Gemini from primary sources: the projects'
// GitHub repos and READMEs (pipeline/research.mjs), plus Hacker News when it
// picks the topic itself. GEMINI_SEARCH=true adds Google Search research,
// which needs a Gemini key with billing (the free tier has no search quota
// for Gemini 3).
//
//   node --env-file=.env pipeline/write-script.mjs "Coolify vs Dokploy"
//   node --env-file=.env pipeline/write-script.mjs            # picks a trending topic
//
// Writes src/videos/<slug>/{script.json,facts.json}, public/videos/<slug>/repos/*.png
// and prints the slug as the last line.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { gemini, pickGeminiModels, readJson, report, slugify, writeJson } from "./lib.mjs";
import { repoBrief, resolveRepos, trendingCandidates } from "./research.mjs";

const VOICE = {
  voiceId: "2ZUpiKo5wCCuypvx2zaS", // Tony Nguyễn
  modelId: "eleven_v3",
  voiceSettings: { stability: 0.0, similarity_boost: 0.75 },
};
const TAGS = ["excited", "curious", "casually", "impressed", "cheerfully", "warmly", "thoughtful", "laughs"];

const S = (type, extra = {}) => ({ type, ...extra });
const json = async (prompt, schema, temperature = 0.7) =>
  JSON.parse(
    await gemini(models, {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", responseSchema: schema, temperature },
    }),
  );

const history = readJson("pipeline/history.json", []);
const pastTopics = history.map((h) => h.topic).filter(Boolean);
// Repos earlier videos already covered, so the picker moves on.
const pastRepos = readdirSync("src/videos", { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) => readJson(`src/videos/${d.name}/facts.json`, { repos: [] }).repos.map((r) => r.repo.toLowerCase()));
const models = await pickGeminiModels();
console.log("Gemini models:", models.join(", "));

let topic = process.argv.slice(2).join(" ").trim();
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
if (topic) {
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
      "to install it. A head-to-head comparison with a well-known alternative works well. Avoid these past " +
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
if (!found.length) throw new Error(`no GitHub repos found for "${topic}"`);
console.log("Research repos:", found.join(", "));
const briefs = (await Promise.all(found.map((r, i) => repoBrief(r, i < 2 ? 12000 : 5000)))).filter(Boolean);
let research = `Primary sources, fetched from GitHub on ${today}:\n\n${briefs.join("\n\n")}`;

if (process.env.GEMINI_SEARCH === "true") {
  const web = await gemini(models, {
    tools: [{ google_search: {} }],
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              `Today is ${today}. For a short video about "${topic}" (repos: ${found.join(", ")}), report in ` +
              "English, with a source URL after every fact, what changed in the last 3 months and how " +
              "people compare these tools. No star counts.",
          },
        ],
      },
    ],
  });
  research += `\n\nWeb research (Google Search):\n${web}`;
}

// 3. The script, as JSON matching a schema.
const schema = S("OBJECT", {
  properties: {
    slug: S("STRING", { description: "short kebab-case ascii id, e.g. coolify-vs-dokploy" }),
    title: S("STRING", { description: "the video's hook question in Vietnamese, under 60 characters" }),
    caption: S("STRING", { description: "TikTok caption in Vietnamese, 1–2 sentences, under 150 characters" }),
    hashtags: S("ARRAY", { items: S("STRING"), description: "exactly 5, with #, 3 niche + 2 broad Vietnamese" }),
    musicPrompt: S("STRING", { description: "ElevenLabs Music prompt for an instrumental bed fitting the topic, ends with 'no vocals'" }),
    repos: S("ARRAY", {
      items: S("OBJECT", {
        properties: { repo: S("STRING", { description: "owner/name" }), name: S("STRING") },
        required: ["repo", "name"],
      }),
    }),
    sources: S("ARRAY", { items: S("STRING") }),
    scenes: S("ARRAY", {
      items: S("OBJECT", {
        properties: {
          id: S("STRING", { description: "s1, s2, ..." }),
          text: S("STRING", { description: "the voiceover line, Vietnamese, with ElevenLabs audio tags" }),
          headline: S("STRING", { description: "short on-screen headline, Vietnamese" }),
          lines: S("ARRAY", { items: S("STRING"), description: "0–4 short on-screen lines" }),
          commands: S("ARRAY", { items: S("STRING"), description: "exact shell commands shown typed, or empty" }),
          repos: S("ARRAY", { items: S("STRING"), description: "owner/name of repos whose logo appears" }),
        },
        required: ["id", "text", "headline", "lines", "commands", "repos"],
      }),
    }),
  },
  required: ["slug", "title", "caption", "hashtags", "musicPrompt", "repos", "sources", "scenes"],
});

const rules =
  `Write a Vietnamese TikTok video script about "${topic}" from the research below.\n` +
  `Voice: a Vietnamese tech presenter talking to "anh em", lively and conversational, like presenting on stage, ` +
  `never like reading a web page. Short sentences. Questions to the viewer. Mix in ElevenLabs v3 audio tags ` +
  `in square brackets, only these: ${TAGS.map((t) => `[${t}]`).join(" ")}, at most one or two per line.\n` +
  `Shape: 8–14 scenes, 60–110 seconds spoken in total (about 14 Vietnamese words per 5 seconds). ` +
  `Scene 1 is a hook question in under 5 seconds. If there is an install, show it as steps with commands ` +
  `copied character for character from a README in the research; never invent or edit a command, and ` +
  `prefer the shortest official way (one-line installer, docker run, or docker compose). ` +
  `The last scene says to save the video to try later ` +
  `and follow for more. No advertising: never pitch a product, hosting or VPS, and never mention Cloudcode.\n` +
  `Facts: use only facts from the research. No star counts or numbers the research does not source. ` +
  `Name tools exactly as their projects do. Headlines are what the scene says in a few words, not a label. ` +
  `Repos: only owner/name pairs from the research. The research is the projects' own READMEs, so it ` +
  `praises them: say plainly what each is good at, without their marketing words.\n\nResearch:\n${research}`;

const script = await json(rules, schema, 0.9);
script.sources = [...new Set([...found.map((r) => `https://github.com/${r}`), ...(script.sources ?? [])])];

// Checks Gemini's output; anything wrong here stops the run before spending
// voice credits.
const problems = [];
if (script.scenes.length < 6 || script.scenes.length > 16) problems.push(`${script.scenes.length} scenes`);
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
if (words < 120 || words > 380) problems.push(`${words} spoken words`);
script.hashtags = script.hashtags.slice(0, 5).map((h) => (h.startsWith("#") ? h : `#${h}`));
if (problems.length) throw new Error(`script rejected: ${problems.join("; ")}`);

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
// Drop logo references to repos that don't exist.
const known = new Set(repos.map((r) => r.asked));
for (const s of script.scenes) s.repos = s.repos.filter((r) => known.has(r));

mkdirSync(`src/videos/${slug}`, { recursive: true });
writeJson(`src/videos/${slug}/script.json`, {
  slug,
  topic,
  title: script.title,
  caption: script.caption,
  hashtags: script.hashtags,
  musicPrompt: script.musicPrompt,
  sources: script.sources,
  ...VOICE,
  scenes: script.scenes,
});
writeJson(`src/videos/${slug}/facts.json`, { topic, models, date: today, repos, research });
report(slug);
