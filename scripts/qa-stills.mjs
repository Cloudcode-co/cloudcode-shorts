// Renders a handful of stills from a video with TikTok's overlay drawn on top
// (`guide: true`), into out/qa/<slug>/, for checking layout by eye: text under
// the like/follow buttons or the caption, cut-off words, unreadable contrast.
//
//   node scripts/qa-stills.mjs <slug>             # 10 stills spread over the video
//   node scripts/qa-stills.mjs <slug> 120 900     # exact frames
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { glFor } from "./gl.mjs";

const [slug, ...frameArgs] = process.argv.slice(2);
if (!slug) throw new Error("usage: qa-stills.mjs <slug> [frames]");
const COUNT = 10;

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), rspack: true });
const inputProps = { guide: true };
const chromiumOptions = { gl: glFor(slug) };
const composition = await selectComposition({ serveUrl, id: slug, inputProps, chromiumOptions });

// Skip each end's first second, when shots are still animating in.
const last = composition.durationInFrames - 1;
const frames = frameArgs.length
  ? frameArgs.map(Number)
  : Array.from({ length: COUNT }, (_, i) =>
      Math.round(60 + ((last - 120) * i) / (COUNT - 1)),
    );

const dir = `out/qa/${slug}`;
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
for (const frame of frames) {
  const output = `${dir}/frame-${String(frame).padStart(5, "0")}.png`;
  await renderStill({ composition, serveUrl, frame, output, inputProps, chromiumOptions });
  console.log(output);
}
