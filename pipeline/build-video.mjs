// Has Claude Code build a video's Video.tsx from its script, in an art
// direction drawn from pipeline/art-directions.json. Falls back to the kit's
// plain FallbackVideo when Claude fails, goes over budget, or leaves code that
// doesn't typecheck.
//
//   node --env-file=.env pipeline/build-video.mjs <slug>
//   NOTES="dark background" node --env-file=.env pipeline/build-video.mjs <slug> --revise
//
// Env: ANTHROPIC_API_KEY, CLAUDE_MODEL (default claude-sonnet-5-5),
// CLAUDE_BUDGET_USD (default 4), CLAUDE_BIN (default "claude"); for a `heavy`
// art direction CLAUDE_HEAVY_MODEL (default claude-opus-5-5) and
// CLAUDE_HEAVY_BUDGET_USD (default 10); for the
// be-ag fallback and the review LLM_API_KEY, LLM_BASE_URL, BUILDER_BEAG_MODEL (default
// ag/gemini-3.8-flash-high), BUILDER_HEAVY_BEAG_MODEL (the heavy backup's
// model, default oc/glm-5.3-flash-free), BUILDER_CMC_MODELS (Command Code models
// through be-ag, tried after Gemini; "off" turns them off), BUILDER_LAST_MODELS (free
// models tried last), BUILDER_MAX_TURNS (default 150), and BUILDER=beag
// to skip Claude; STYLE (an art direction id or name, or free text); NOTES;
// REVIEW=off skips the review round.
// Prints a JSON line {direction, pacing, built, costUsd} last.
import { spawn, spawnSync } from "node:child_process";
import { createInterface } from "node:readline";
import { createWriteStream, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { readJson, report } from "./lib.mjs";
import { pickDirection } from "./direction.mjs";
import { reviewVideo } from "./review-video.mjs";
import { FORMATS, formatOf } from "./formats.mjs";

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

// The direction (pipeline/direction.mjs: STYLE, the past one when revising,
// the one music.mjs already picked, or Gemini's pick); pacing drawn per slug.
const { pacing } = readJson("pipeline/art-directions.json");
let seed = [...slug].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
const draw = (list) => list[(seed = (seed * 1103515245 + 12345) >>> 0) % list.length];
// --revise keeps the video's direction and pacing and, when Claude built it,
// its code as the starting point; NOTES are the owner's requests.
const revise = process.argv.includes("--revise");
const notes = (process.env.NOTES ?? "").trim();
const past = readJson("pipeline/history.json", []).findLast((h) => h.slug === slug);
// STYLE asks for a new look: a rebuild, not an edit of the old one.
const chosen = Boolean((process.env.STYLE ?? "").trim());
const direction = await pickDirection(slug, { revise });
const pace = (revise && past?.pacing) || draw(pacing);

// The video's code files, to put back if Claude leaves them broken.
const DIR = `src/videos/${slug}`;
const snapshot = () =>
  new Map(
    readdirSync(DIR, { recursive: true })
      .map((f) => `${DIR}/${String(f).replaceAll("\\", "/")}`)
      // Also the HyperFrames projects under hf/, not their .hyperframes caches.
      .filter((f) => /\.tsx?$/.test(f) || (/\/hf\/.+\.(html|css|js)$/.test(f) && !f.includes("/.hyperframes/")))
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
// A heavy direction (a demanding edit like breakcore-swiss) is always built by
// Opus, with Claude first and a bigger budget, whatever CLAUDE_MODEL says. Its
// backup runs an opencode model (oc/*) through be-ag, then Gemini: the oc free
// quota is small and runs out within a build or two.
const heavy = direction.heavy === true;
const claudeModel = heavy ? process.env.CLAUDE_HEAVY_MODEL || "claude-opus-5-5" : process.env.CLAUDE_MODEL || "claude-sonnet-5-5";
const claudeBudget = heavy ? process.env.CLAUDE_HEAVY_BUDGET_USD || "10" : process.env.CLAUDE_BUDGET_USD || "4";
if (heavy) console.log(`Heavy direction ${direction.id}: building with ${claudeModel}, budget $${claudeBudget}`);
const gateway = (process.env.LLM_BASE_URL || "https://be-ag.harumi.io.vn/v1").replace(/\/v1\/?$/, "");
const geminiModel = process.env.BUILDER_BEAG_MODEL || "ag/gemini-3.8-flash-high";
// The gateway locks its accounts per model, so the other tiers of the same
// Gemini still answer when one is locked (the script writer uses the plain and
// medium ones last, so they are usually fresh), and the oc model (not on those
// accounts) after them.
const geminiTiers = [geminiModel, ...["-low", "-medium", ""].map((tier) => geminiModel.replace(/-high$/, tier))];
const ocModel = process.env.BUILDER_HEAVY_BEAG_MODEL || "oc/deepseek-v4.1-flash-free";
// Paid models behind be-ag, tried when every free Gemini tier failed:
// DeepSeek's own API (ds/*, a small prepaid credit, so its cheapest model) and
// the owner's Command Code plan (cmc/*; one Kimi K3.1 Pro build used the whole
// 5-hour plan window).
const cmcModels = (process.env.BUILDER_CMC_MODELS || "ds/deepseek-v4.1-flash,cmc/deepseek/deepseek-v4-pro,cmc/zai-org/GLM-5.3")
  .split(",")
  .map((m) => m.trim())
  .filter((m) => m && m !== "off");
// Free models on other providers behind be-ag, the last tries before the
// fallback template: weaker, but a build that typechecks beats the template.
const lastModels = (process.env.BUILDER_LAST_MODELS || "nvidia/minimaxai/minimax-m3.1-flash,ag/gpt-oss-120b-medium,nous/stepfun/step-3.7-flash:free,cf/@cf/zai-org/glm-4.7-flash")
  .split(",")
  .map((m) => m.trim())
  .filter((m) => m && m !== "off");
const beagModels = [
  ...new Set([...(heavy ? [ocModel] : []), ...geminiTiers, ...cmcModels, ocModel, ...lastModels]),
];
const agents = [
  process.env.ANTHROPIC_API_KEY &&
    process.env.BUILDER !== "beag" && {
      id: "claude",
      label: "Claude",
      env: { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY },
      args: ["--model", claudeModel, "--max-budget-usd", claudeBudget],
    },
  ...(process.env.LLM_API_KEY ? beagModels : []).map((beagModel) => ({
    id: "beag",
    label: `be-ag (${beagModel})`,
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
  })),
].filter(Boolean);
// Simple formats (FORMATS[...].builder "beag") go to Gemini first, unless the
// run asked for a builder.
const format = FORMATS[formatOf(readJson(`src/videos/${slug}/script.json`, {}).format)];
if (format.builder === "beag" && !heavy && !(process.env.BUILDER_CHOSEN ?? "").trim()) {
  agents.sort((a, b) => (b.id === "beag") - (a.id === "beag"));
}

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
// archify (.claude/skills/archify) checks for its own updates unless told not to.
const baseEnv = { CI: "1", ARCHIFY_UPDATE_CHECK_DISABLED: "1" };
for (const k of ["PIXABAY_API_KEY", "PEXELS_API_KEY", "GIPHY_API_KEY"]) if (process.env[k]) baseEnv[k] = process.env[k];
for (const k of ["PATH", "Path", "HOME", "USERPROFILE", "APPDATA", "LOCALAPPDATA", "TEMP", "TMP", "SystemRoot", "ComSpec", "PATHEXT"]) {
  if (process.env[k]) baseEnv[k] = process.env[k];
}

const changedSince = (files) => {
  const now = snapshot();
  return now.size !== files.size || [...now].some(([f, text]) => files.get(f) !== text);
};

// Runs one builder on `text` in this checkout; what it changed is on disk.
// Every builder run's full event stream, kept as a workflow artifact
// (out/build-logs/) for reading the model's reasoning after the run.
let runCount = 0;
const LOGS = "out/build-logs";
const short = (v, n) => {
  const t = String(v ?? "").replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
};
// One line per tool call: what it touched, not its whole input.
const toolLine = (name, input = {}) => {
  const target = input.file_path ?? input.path ?? input.command ?? input.pattern ?? input.skill ?? input.description ?? "";
  return name + " " + short(String(target).replace(process.cwd() + "/", ""), 160);
};

// Runs one builder on `text` in this checkout; what it changed is on disk. Its
// thinking, messages and tool calls print live to the log as they happen.
const runAgent = (next, text) =>
  new Promise((resolve) => {
    mkdirSync(LOGS, { recursive: true });
    const file = `${LOGS}/${slug}-${String(++runCount).padStart(2, "0")}-${next.label.replace(/[^a-z0-9.]+/gi, "_")}.jsonl`;
    const log = createWriteStream(file);
    const child = spawn(
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
        "stream-json",
        "--verbose",
      ],
      { env: { ...baseEnv, ...next.env }, stdio: ["ignore", "pipe", "pipe"] },
    );
    const timer = setTimeout(() => child.kill("SIGTERM"), 90 * 60 * 1000);
    let out = null;
    let stderr = "";
    let turn = 0;
    child.stderr.on("data", (d) => (stderr = (stderr + d).slice(-4000)));
    createInterface({ input: child.stdout }).on("line", (line) => {
      log.write(line + "\n");
      let ev;
      try {
        ev = JSON.parse(line);
      } catch {
        return;
      }
      if (ev.type === "result") out = ev;
      if (ev.type === "assistant") {
        turn++;
        for (const c of ev.message?.content ?? []) {
          if (c.type === "thinking" && c.thinking) console.log(`  [${turn}] thinks: ${short(c.thinking, 700)}`);
          if (c.type === "text" && c.text) console.log(`  [${turn}] says: ${short(c.text, 700)}`);
          if (c.type === "tool_use") console.log(`  [${turn}] ${toolLine(c.name, c.input)}`);
        }
      }
      if (ev.type === "user") {
        for (const c of ev.message?.content ?? []) {
          if (c.type === "tool_result" && c.is_error) {
            const body = Array.isArray(c.content) ? c.content.map((x) => x.text ?? "").join(" ") : c.content;
            console.log(`      error: ${short(body, 300)}`);
          }
        }
      }
    });
    child.on("error", (err) => console.log(`${next.label} did not start: ${err.message}`));
    child.on("close", (code) => {
      clearTimeout(timer);
      log.end();
      if (!out) {
        console.log(`${next.label} exited with ${code} and no result.`, stderr);
        resolve({ error: true, text: stderr });
        return;
      }
      // Only Anthropic's own price is real; the gateway bills separately.
      const cost = next.id === "claude" ? out.total_cost_usd ?? 0 : 0;
      costUsd += cost;
      console.log(`${next.label}: ${out.terminal_reason ?? out.subtype ?? "done"}, ${out.num_turns ?? "?"} turns, $${cost.toFixed(2)} (log: ${file})`);
      for (const d of out.permission_denials ?? []) {
        console.log(`${next.label} was denied ${d.tool_name}: ${JSON.stringify(d.tool_input).slice(0, 200)}`);
      }
      if (out.result) console.log(out.result.slice(-1500));
      resolve({ error: out.is_error === true || out.terminal_reason === "api_error", text: String(out.result ?? "") });
    });
  });

let agent = null;
// Typechecking misses code that only breaks at render time, like a builder
// that wraps its video in its own <Composition> (Root.tsx already does), which
// failed a whole run in the QA stills.
const rendersAlone = () => {
  const bad = [...snapshot()].find(([, text]) => /<Composition\b|registerRoot\(/.test(text));
  if (bad) {
    console.log(`${bad[0]} mounts its own <Composition> or root; the kit's Root.tsx does that.`);
    return false;
  }
  // An <HfClip> plays an MP4 HyperFrames renders from src/videos/<slug>/hf/:
  // a project that does not render would fail the whole video later.
  if (existsSync(`${DIR}/hf`) && !sh("node", ["scripts/hyperframes.mjs", slug])) {
    console.log("A HyperFrames clip does not render.");
    return false;
  }
  return true;
};
// Tries one builder; ok when it left a build that typechecks, else its API error.
const tryAgent = async (next) => {
  console.log(`\nBuilder: ${next.label}`);
  const run = await runAgent(next, prompt);
  if (changedSince(start) && typechecks() && rendersAlone()) return { ok: true };
  // A build that doesn't typecheck goes to the next builder from the start.
  console.log(changedSince(start) ? `${next.label}'s build does not typecheck.` : `${next.label} changed nothing.`);
  restore(start);
  return { ok: false, ...run };
};
// The gateway locks a model's accounts for a minute or two at a time ("HTTP 403
// (reset after 1m 39s)", or Gemini's 429 "Resource has been exhausted"), while
// no credit and the oc free tier's daily limit stay until topped up. So when
// every builder failed on the API, the ones that may come back get more rounds,
// each after the longest reset the gateway named, before the fallback.
const waitsOut = (text) => !/credit balance|FreeUsageLimit|insufficient|no balance|MODEL_NOT_IN_PLAN|usage limit/i.test(text);
const resetSeconds = (text) => {
  const m = text.match(/reset after (?:(\d+)m)?\s*(?:(\d+)s)?/);
  return m && (m[1] || m[2]) ? Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0) : 90;
};
let retryable = [];
for (const next of agents) {
  const r = await tryAgent(next);
  if (r.ok) {
    agent = next;
    break;
  }
  if (next.id === "beag" && r.error && waitsOut(r.text)) retryable.push({ next, wait: resetSeconds(r.text) });
}
for (let round = 1; !agent && retryable.length && round <= 3; round++) {
  const seconds = Math.min(300, Math.max(...retryable.map((r) => r.wait)) + 20);
  console.log(`\nEvery builder failed on the API; round ${round}/3 of ${retryable.map((r) => r.next.label).join(", ")} in ${seconds}s`);
  await new Promise((r) => setTimeout(r, seconds * 1000));
  const again = [];
  for (const { next } of retryable) {
    const r = await tryAgent(next);
    if (r.ok) {
      agent = next;
      break;
    }
    if (r.error && waitsOut(r.text)) again.push({ next, wait: resetSeconds(r.text) });
  }
  retryable = again;
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
    await runAgent(
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
