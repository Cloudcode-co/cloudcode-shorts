// Has Claude Code build a video's Video.tsx from its script, in an art
// direction drawn from pipeline/art-directions.json. Falls back to the kit's
// plain FallbackVideo when Claude fails, goes over budget, or leaves code that
// doesn't typecheck.
//
//   node --env-file=.env pipeline/build-video.mjs <slug>
//
// Env: ANTHROPIC_API_KEY, CLAUDE_MODEL (default claude-sonnet-5-5),
// CLAUDE_BUDGET_USD (default 4), CLAUDE_BIN (default "claude").
// Prints a JSON line {direction, pacing, built, costUsd} last.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { readJson } from "./lib.mjs";

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
const typechecks = () => sh("node", ["scripts/register.mjs"]) && sh("npx", ["tsc"]);

// Draw a direction not used in the last 5 videos; same slug, same draw.
const { directions, pacing } = readJson("pipeline/art-directions.json");
const recent = readJson("pipeline/history.json", [])
  .slice(-5)
  .map((h) => h.direction);
const pool = directions.filter((d) => !recent.includes(d.id));
let seed = [...slug].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
const draw = (list) => list[(seed = (seed * 1103515245 + 12345) >>> 0) % list.length];
const direction = draw(pool.length ? pool : directions);
const pace = draw(pacing);

// Start from the fallback so the project always typechecks.
writeFileSync(VIDEO, FALLBACK);
if (!typechecks()) throw new Error("fallback build does not typecheck; check the script");

let built = "fallback";
let costUsd = 0;
const prompt =
  `Build the video "${slug}" following pipeline/BUILDER.md (read it first, then follow it to the end).\n` +
  `Art direction: ${direction.name}. ${direction.brief}\n` +
  `Pacing: ${pace}`;

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
    "Bash(npx tsc)",
    `Bash(npm run qa -- ${slug} *)`,
    `Bash(npm run qa -- ${slug})`,
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
    if (out.result) console.log(out.result.slice(-1500));
  } catch {
    console.log(result.error?.message ?? "", result.stdout?.slice(-3000), result.stderr?.slice(-3000));
  }
} else {
  console.log("ANTHROPIC_API_KEY is not set; using the fallback build.");
}

const changed = readFileSync(VIDEO, "utf8") !== FALLBACK;
if (changed && typechecks()) {
  built = "claude";
} else {
  console.log(changed ? "Claude's build does not typecheck; using the fallback." : "Claude left the placeholder; using the fallback.");
  writeFileSync(VIDEO, FALLBACK);
  if (!typechecks()) throw new Error("fallback build does not typecheck after Claude's run");
}

console.log(JSON.stringify({ direction: direction.id, pacing: pace, built, costUsd }));
