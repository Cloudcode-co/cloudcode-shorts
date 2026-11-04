// Has Claude Code build a video's Video.tsx from its script, in an art
// direction drawn from pipeline/art-directions.json. Falls back to the kit's
// plain FallbackVideo when Claude fails, goes over budget, or leaves code that
// doesn't typecheck.
//
//   node --env-file=.env pipeline/build-video.mjs <slug>
//   NOTES="dark background" node --env-file=.env pipeline/build-video.mjs <slug> --revise
//
// Env: ANTHROPIC_API_KEY, CLAUDE_MODEL (default claude-sonnet-5-5),
// CLAUDE_BUDGET_USD (default 4), CLAUDE_BIN (default "claude"); for the
// be-ag fallback and the review LLM_API_KEY, LLM_BASE_URL, BUILDER_BEAG_MODEL (default
// ag/gemini-3.8-flash-high), BUILDER_MAX_TURNS (default 150), and BUILDER=beag
// to skip Claude; STYLE (an art direction id or name, or free text); NOTES;
// REVIEW=off skips the review round.
// Prints a JSON line {direction, pacing, built, costUsd} last.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { llmJson, readJson, report } from "./lib.mjs";
import { reviewVideo } from "./review-video.mjs";

const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+$/.test(slug) || !existsSync(`src/videos/${slug}/script.json`)) {
  throw new Error("usage: build-video.mjs <slug> (needs src/videos/<slug>/script.json)");
}
const VIDEO = `src/videos/${slug}/Video.tsx`;

const FALLBACK = `// Plain kinetic-type build straight from script.json (pipeline fallback).
import { makeFallbackVideo, type RepoFact, type ScriptScene } from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";

export const video = makeFallbackVideo({
  slug: script.slug,
  scenes: script.scenes as ScriptScene[],
  durations,
  repos: facts.repos as RepoFact[],
  silent: ["meme", "chat"].includes((script as { format?: string }).format ?? ""),
});
`;

const sh = (cmd, args, opts = {}) =>
  spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32", ...opts })
    .status === 0;
// Unused names don't break a video, so they don't throw Claude's build away.
const typechecks = () =>
  sh("node", ["scripts/register.mjs"]) && sh("npx", ["tsc", "--noUnusedLocals", "false", "--noUnusedParameters", "false"]);

// Draw a direction not used in the last 5 videos; same slug, same draw.
const { directions, pacing } = readJson("pipeline/art-directions.json");
const recent = readJson("pipeline/history.json", [])
  .slice(-5)
  .map((h) => h.direction);
const pool = directions.filter((d) => !recent.includes(d.id));
let seed = [...slug].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
const draw = (list) => list[(seed = (seed * 1103515245 + 12345) >>> 0) % list.length];
// --revise keeps the video's direction and pacing and, when Claude built it,
// its code as the starting point; NOTES are the owner's requests.
const revise = process.argv.includes("--revise");
const notes = (process.env.NOTES ?? "").trim();
const past = readJson("pipeline/history.json", []).findLast((h) => h.slug === slug);
// STYLE picks the direction: an id or name from art-directions.json, or any
// description, used as the direction itself.
const style = (process.env.STYLE ?? "").trim();
const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const custom = (name) => ({
  id: "custom",
  name,
  brief: "Interpret this style boldly and consistently across every shot.",
});
const chosen =
  style &&
  (directions.find((d) => fold(d.id) === fold(style) || fold(d.name) === fold(style)) ?? custom(style));
// With no STYLE, Gemini picks the direction that fits what this video says
// from those not used lately; a random draw if that fails.
const fitting = async (list) => {
  const script = readJson(`src/videos/${slug}/script.json`);
  const answer = await llmJson(
    `Pick the art direction that best fits this TikTok video, so its look matches what each line talks ` +
      `about (a direction about server racks suits hosting and hardware, not a software licence or a phone app).\n` +
      `Video: ${script.title}\nTopic: ${script.topic}\nScenes: ${script.scenes.map((s) => s.headline).join(" | ")}\n\n` +
      `Directions:\n${list.map((d) => `- ${d.id}: ${d.brief}`).join("\n")}`,
    { type: "OBJECT", properties: { id: { type: "STRING" }, why: { type: "STRING" } }, required: ["id", "why"] },
    0.4,
  ).catch((err) => console.log(`Direction pick failed: ${err.message}`));
  const found = list.find((d) => d.id === answer?.id);
  if (found) console.log(`Direction: ${found.id} (${answer.why})`);
  return found ?? draw(list);
};
const direction =
  chosen ||
  (revise && directions.find((d) => d.id === past?.direction)) ||
  (revise && past?.direction?.startsWith("custom: ") && custom(past.direction.slice(8))) ||
  (await fitting(pool.length ? pool : directions));
const pace = (revise && past?.pacing) || draw(pacing);

// The video's code files, to put back if Claude leaves them broken.
const DIR = `src/videos/${slug}`;
const snapshot = () =>
  new Map(
    readdirSync(DIR, { recursive: true })
      .map((f) => `${DIR}/${String(f).replaceAll("\\", "/")}`)
      .filter((f) => /\.tsx?$/.test(f))
      .map((f) => [f, readFileSync(f, "utf8")]),
  );
const restore = (files) => {
  for (const f of snapshot().keys()) if (!files.has(f)) rmSync(f);
  for (const [f, text] of files) writeFileSync(f, text);
};

// Start from code that typechecks: the current build when revising one of
// Claude's, else the fallback.
// A new style is a rebuild, not an edit of the old look.
const keep = revise && !chosen && existsSync(VIDEO) && readFileSync(VIDEO, "utf8").replaceAll("\r\n", "\n") !== FALLBACK;
if (!keep) writeFileSync(VIDEO, FALLBACK);
if (!typechecks()) {
  if (!keep) throw new Error("fallback build does not typecheck; check the script");
  throw new Error(`${slug} does not typecheck before the revision`);
}
const start = snapshot();

let built = "fallback";
let costUsd = 0;
const prompt =
  (keep
    ? `Revise the video "${slug}" following pipeline/BUILDER.md (read it first, then follow it to the end). ` +
      `Its current code is your starting point: change what the requests below ask for and keep the rest.\n`
    : `Build the video "${slug}" following pipeline/BUILDER.md (read it first, then follow it to the end).\n`) +
  // A revised video keeps its own look; only a past draw is worth repeating.
  (keep && !past?.direction ? "" : `Art direction: ${direction.name}. ${direction.brief}\nPacing: ${pace}`) +
  (notes ? `\n\nRequests from the channel owner, which win over the art direction and pacing:\n${notes}` : "");

// Who builds, in order: Claude on Anthropic's API, then the same Claude Code
// running Gemini through the be-ag gateway (LLM_*), for when Anthropic fails
// or the credit runs out. BUILDER=beag skips Claude.
const gateway = (process.env.LLM_BASE_URL || "https://be-ag.harumi.io.vn/v1").replace(/\/v1\/?$/, "");
const beagModel = process.env.BUILDER_BEAG_MODEL || "ag/gemini-3.8-flash-high";
const agents = [
  process.env.ANTHROPIC_API_KEY &&
    process.env.BUILDER !== "beag" && {
      id: "claude",
      label: "Claude",
      env: { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY },
      args: ["--model", process.env.CLAUDE_MODEL || "claude-sonnet-5-5", "--max-budget-usd", process.env.CLAUDE_BUDGET_USD || "4"],
    },
  process.env.LLM_API_KEY && {
    id: "beag",
    label: `Gemini (${beagModel})`,
    env: {
      ANTHROPIC_BASE_URL: gateway,
      ANTHROPIC_AUTH_TOKEN: process.env.LLM_API_KEY,
      // Claude Code's own side calls go to the gateway's models too.
      ANTHROPIC_DEFAULT_OPUS_MODEL: beagModel,
      ANTHROPIC_DEFAULT_SONNET_MODEL: beagModel,
      ANTHROPIC_DEFAULT_HAIKU_MODEL: beagModel.replace(/-high$/, "-low"),
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
    },
    // The gateway's prices are not Anthropic's, so cap turns instead of dollars.
    args: ["--model", beagModel, "--max-turns", process.env.BUILDER_MAX_TURNS || "150"],
  },
].filter(Boolean);

// The builder may run any command and edit any file it needs, since only a
// build that typechecks is kept. What stays off: the web and subagents (cost,
// and research text from the web is in its context), the pipeline, workflows,
// worker and shared kit, and the usual ways to print or send its keys. Its env
// holds no secret besides its own API key and the free media search keys.
const allowed = ["Skill", "Read", "Glob", "Grep", "Edit", "Write", "Bash", "TodoWrite"];
const denied = [
  "WebFetch",
  "WebSearch",
  "Agent",
  ...["pipeline", ".github", "worker", "src/kit", ".claude"].flatMap((d) => [`Edit(${d}/**)`, `Write(${d}/**)`]),
  ...["curl", "wget", "nc", "ssh", "scp", "env", "printenv", "set", "export", "git push", "git remote", "npm publish", "npm install", "npm i", "npx -y"]
    .flatMap((c) => [`Bash(${c})`, `Bash(${c} *)`]),
  "Bash(*ANTHROPIC*)",
  "Bash(*_API_KEY*)",
  "Bash(*AUTH_TOKEN*)",
  "Bash(*/proc/*)",
  "Read(/proc/**)",
];
const baseEnv = { CI: "1" };
for (const k of ["PIXABAY_API_KEY", "PEXELS_API_KEY", "GIPHY_API_KEY"]) if (process.env[k]) baseEnv[k] = process.env[k];
for (const k of ["PATH", "Path", "HOME", "USERPROFILE", "APPDATA", "LOCALAPPDATA", "TEMP", "TMP", "SystemRoot", "ComSpec", "PATHEXT"]) {
  if (process.env[k]) baseEnv[k] = process.env[k];
}

const changedSince = (files) => {
  const now = snapshot();
  return now.size !== files.size || [...now].some(([f, text]) => files.get(f) !== text);
};

// Runs one builder on `text` in this checkout; what it changed is on disk.
const runAgent = (next, text) => {
  const result = spawnSync(
    process.env.CLAUDE_BIN || "claude",
    [
      "-p",
      text,
      ...next.args,
      "--permission-mode",
      "dontAsk",
      "--allowedTools",
      allowed.join(","),
      "--disallowedTools",
      denied.join(","),
      "--output-format",
      "json",
    ],
    {
      env: { ...baseEnv, ...next.env },
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      timeout: 90 * 60 * 1000,
    },
  );
  try {
    const out = JSON.parse(result.stdout.trim().split("\n").pop());
    // Only Anthropic's own price is real; the gateway bills separately.
    const cost = next.id === "claude" ? out.total_cost_usd ?? 0 : 0;
    costUsd += cost;
    console.log(`${next.label}: ${out.terminal_reason ?? out.subtype ?? "done"}, ${out.num_turns ?? "?"} turns, $${cost.toFixed(2)}`);
    for (const d of out.permission_denials ?? []) {
      console.log(`${next.label} was denied ${d.tool_name}: ${JSON.stringify(d.tool_input).slice(0, 200)}`);
    }
    if (out.result) console.log(out.result.slice(-1500));
  } catch {
    console.log(result.error?.message ?? "", result.stdout?.slice(-3000), result.stderr?.slice(-3000));
  }
};

let agent = null;
for (const next of agents) {
  console.log(`\nBuilder: ${next.label}`);
  runAgent(next, prompt);
  if (changedSince(start)) {
    agent = next;
    break;
  }
  console.log(`${next.label} changed nothing.`);
}
if (!agents.length) console.log("Neither ANTHROPIC_API_KEY nor LLM_API_KEY is set; using the fallback build.");

if (agent && typechecks()) {
  built = agent.id;
} else {
  const before = keep ? "the previous build" : "the fallback";
  console.log(agent ? `${agent.label}'s build does not typecheck; using ${before}.` : `Nothing was built; using ${before}.`);
  restore(start);
  if (!typechecks()) throw new Error(`${before} does not typecheck after the build`);
  built = keep ? past?.built ?? "claude" : "fallback";
}

// One review round, the same for every builder: a vision model checks stills
// against BUILDER.md's checklist, and the builder that made the video fixes
// what it found. A fix that breaks the typecheck is thrown away.
let reviewed = null;
if (agent && built === agent.id && process.env.REVIEW !== "off") {
  console.log("\nReviewing the stills");
  reviewed = await reviewVideo(slug, `${direction.name}. ${direction.brief}`);
  if (reviewed?.length) {
    const list = reviewed.map((r) => `- ${r.scene}: ${r.problem} Fix: ${r.fix}`).join("\n");
    console.log(`Review found ${reviewed.length}:\n${list}`);
    const before = snapshot();
    runAgent(
      agent,
      `A reviewer looked at stills of the video "${slug}" you built and found the problems below. ` +
        `pipeline/BUILDER.md still applies. Check each one with npm run qa, fix the real ones, keep everything ` +
        `else as it is, and finish with its QA loop.\n\n${list}`,
    );
    if (!changedSince(before)) console.log(`${agent.label} changed nothing in the fix round.`);
    else if (!typechecks()) {
      console.log(`${agent.label}'s fixes do not typecheck; keeping the build before them.`);
      restore(before);
      if (!typechecks()) throw new Error("the reviewed build does not typecheck after restoring it");
    }
  } else if (reviewed) console.log("Review: no problems found.");
}

report({
  direction: direction.id === "custom" ? `custom: ${direction.name}` : direction.id,
  pacing: pace,
  built,
  costUsd,
  reviewIssues: reviewed?.length ?? null,
});
