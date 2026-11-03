// Has Claude Code build a video's Video.tsx from its script, in an art
// direction drawn from pipeline/art-directions.json. Falls back to the kit's
// plain FallbackVideo when Claude fails, goes over budget, or leaves code that
// doesn't typecheck.
//
//   node --env-file=.env pipeline/build-video.mjs <slug>
//   NOTES="dark background" node --env-file=.env pipeline/build-video.mjs <slug> --revise
//
// Env: ANTHROPIC_API_KEY, CLAUDE_MODEL (default claude-sonnet-5-5),
// CLAUDE_BUDGET_USD (default 4), CLAUDE_BIN (default "claude").
// Prints a JSON line {direction, pacing, built, costUsd} last.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { readJson, report } from "./lib.mjs";

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
const direction =
  (revise && directions.find((d) => d.id === past?.direction)) || draw(pool.length ? pool : directions);
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
const keep = revise && existsSync(VIDEO) && readFileSync(VIDEO, "utf8").replaceAll("\r\n", "\n") !== FALLBACK;
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

if (process.env.ANTHROPIC_API_KEY) {
  // Claude gets its skills, file tools and exactly the three check commands
  // BUILDER.md names: no other shell commands, no web access. Research text from the web is
  // in its context, so it also gets no secret besides its own API key.
  const allowed = [
    "Skill",
    "Read",
    "Glob",
    "Grep",
    `Edit(src/videos/${slug}/**)`,
    `Write(src/videos/${slug}/**)`,
    "Bash(npm run register)",
    "Bash(npm run register *)",
    "Bash(npx tsc)",
    "Bash(npx tsc *)",
    `Bash(npm run qa -- ${slug})`,
    `Bash(npm run qa -- ${slug} *)`,
  ];
  const env = { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY, CI: "1" };
  for (const k of ["PATH", "Path", "HOME", "USERPROFILE", "APPDATA", "LOCALAPPDATA", "TEMP", "TMP", "SystemRoot", "ComSpec", "PATHEXT"]) {
    if (process.env[k]) env[k] = process.env[k];
  }
  const result = spawnSync(
    process.env.CLAUDE_BIN || "claude",
    [
      "-p",
      prompt,
      "--model",
      process.env.CLAUDE_MODEL || "claude-sonnet-5-5",
      "--permission-mode",
      "dontAsk",
      "--allowedTools",
      allowed.join(","),
      "--disallowedTools",
      "WebFetch,WebSearch,Agent",
      "--max-budget-usd",
      process.env.CLAUDE_BUDGET_USD || "4",
      "--output-format",
      "json",
    ],
    {
      env,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      timeout: 90 * 60 * 1000,
    },
  );
  try {
    const out = JSON.parse(result.stdout.trim().split("\n").pop());
    costUsd = out.total_cost_usd ?? 0;
    console.log(`Claude: ${out.subtype ?? "done"}, ${out.num_turns ?? "?"} turns, $${costUsd.toFixed(2)}`);
    for (const d of out.permission_denials ?? []) {
      console.log(`Claude was denied ${d.tool_name}: ${JSON.stringify(d.tool_input).slice(0, 200)}`);
    }
    if (out.result) console.log(out.result.slice(-1500));
  } catch {
    console.log(result.error?.message ?? "", result.stdout?.slice(-3000), result.stderr?.slice(-3000));
  }
} else {
  console.log("ANTHROPIC_API_KEY is not set; using the fallback build.");
}

const now = snapshot();
const changed = now.size !== start.size || [...now].some(([f, text]) => start.get(f) !== text);
if (changed && typechecks()) {
  built = "claude";
} else {
  const before = keep ? "the previous build" : "the fallback";
  console.log(changed ? `Claude's build does not typecheck; using ${before}.` : `Claude changed nothing; using ${before}.`);
  restore(start);
  if (!typechecks()) throw new Error(`${before} does not typecheck after Claude's run`);
  built = keep ? "claude" : "fallback";
}

report({ direction: direction.id, pacing: pace, built, costUsd });
