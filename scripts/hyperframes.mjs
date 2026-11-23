// Renders a video's HyperFrames clips: every src/videos/<slug>/hf/<name>/
// project (an index.html) to public/videos/<slug>/hf/<name>.mp4, for <HfClip>.
// A clip is rendered again only when its project changed since its MP4 was
// written, or with --force. The MP4s are not committed; the pipeline renders
// them again from the projects.
//
//   node scripts/hyperframes.mjs <slug> [name ...] [--force]
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const force = args.includes("--force");
const [slug, ...names] = args.filter((a) => !a.startsWith("--"));
if (!slug || !/^[a-z0-9-]+$/.test(slug)) throw new Error("usage: hyperframes.mjs <slug> [name ...] [--force]");

const dir = `src/videos/${slug}/hf`;
if (!existsSync(dir)) {
  console.log(`${slug} has no HyperFrames clips.`);
  process.exit(0);
}
const projects = names.length
  ? names
  : readdirSync(dir).filter((n) => existsSync(join(dir, n, "index.html")));

const newest = (path) =>
  readdirSync(path, { recursive: true })
    .map((f) => join(path, String(f)))
    .filter((f) => !f.includes(".hyperframes") && statSync(f).isFile())
    .reduce((t, f) => Math.max(t, statSync(f).mtimeMs), 0);

const npx = (cwd, cmdArgs) =>
  spawnSync("npx", ["hyperframes", ...cmdArgs], { cwd, stdio: "inherit", shell: process.platform === "win32" }).status === 0;

mkdirSync(`public/videos/${slug}/hf`, { recursive: true });
let failed = 0;
for (const name of projects) {
  const project = resolve(dir, name);
  const out = resolve(`public/videos/${slug}/hf/${name}.mp4`);
  if (!existsSync(join(project, "index.html"))) {
    console.log(`${name}: no ${dir}/${name}/index.html`);
    failed++;
    continue;
  }
  if (!force && existsSync(out) && statSync(out).mtimeMs >= newest(project)) {
    console.log(`${name}: up to date`);
    continue;
  }
  console.log(`\n${name}: lint and render`);
  if (!npx(project, ["lint"]) || !npx(project, ["render", "--quality", "looks", "--output", out])) {
    console.log(`${name}: HyperFrames failed`);
    failed++;
  }
}
if (failed) {
  console.error(`${failed} HyperFrames clip(s) failed`);
  process.exit(1);
}
