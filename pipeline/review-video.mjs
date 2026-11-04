// A second pair of eyes on a built video, the same for every builder: renders
// the opening and the middle of each scene (with TikTok's overlay drawn on top),
// and has a vision model check them against BUILDER.md's checklist. Returns the
// problems worth a fix, [] when it looks right, or null when it could not look.
//
//   node --env-file=.env pipeline/review-video.mjs <slug>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { glFor } from "../scripts/gl.mjs";
import { llmJson, readJson } from "./lib.mjs";

const stills = async (slug, script) => {
  const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), rspack: true });
  const inputProps = { guide: true };
  const chromiumOptions = { gl: glFor(slug) };
  const composition = await selectComposition({ serveUrl, id: slug, inputProps, chromiumOptions });
  const { fps, durationInFrames } = composition;
  const durations = readJson(`src/videos/${slug}/durations.json`);
  const last = durationInFrames - 1;
  // Shots follow the voice, so a scene's middle is where its clip's middle is.
  let at = 0;
  const picks = [{ frame: Math.min(30, last), what: "the opening shot, with the Cloudcode lockup", scene: script.scenes[0] }];
  for (const scene of script.scenes) {
    const length = (durations[scene.id] ?? 0) * fps;
    picks.push({ frame: Math.min(last, Math.round(at + length / 2)), what: `the middle of scene ${scene.id}`, scene });
    at += length;
  }
  // At most 8 stills (the opening and scenes spread evenly), so the request stays
  // well inside the gateway's 100 s limit.
  const MAX = 8;
  const step = (picks.length - 1) / (MAX - 1);
  const chosen = picks.length <= MAX ? picks : Array.from({ length: MAX }, (_, i) => picks[Math.round(i * step)]);
  const dir = `out/review/${slug}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const pick of chosen) {
    pick.file = `${dir}/frame-${String(pick.frame).padStart(5, "0")}.jpeg`;
    // A third of full size is enough to read layout and text.
    await renderStill({
      composition,
      serveUrl,
      frame: pick.frame,
      output: pick.file,
      inputProps,
      chromiumOptions,
      imageFormat: "jpeg",
      jpegQuality: 70,
      scale: 0.36,
    });
  }
  return chosen;
};

const schema = {
  type: "OBJECT",
  properties: {
    issues: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          scene: { type: "STRING", description: "scene id, or 'opening'" },
          problem: { type: "STRING", description: "what is wrong in the still, concretely" },
          fix: { type: "STRING", description: "what to change in the code" },
        },
        required: ["scene", "problem", "fix"],
      },
    },
  },
  required: ["issues"],
};

export const reviewVideo = async (slug, direction) => {
  const script = readJson(`src/videos/${slug}/script.json`);
  try {
    const picks = await stills(slug, script);
    const listed = picks
      .map(
        (p, i) =>
          `Image ${i + 1}: ${p.what}. ` +
          (p.scene.text ? `Voice: "${p.scene.text.replace(/\[[^\]]*\]/g, "").trim()}" ` : "") +
          `Headline: "${p.scene.headline}".${p.scene.lines?.length ? ` Lines: ${p.scene.lines.join(" / ")}.` : ""}`,
      )
      .join("\n");
    const answer = await llmJson(
      `You review stills from a Vietnamese TikTok short (1080×1920, shown at a third of full size) before it is posted. ` +
        `Its art direction: ${direction}. The tinted purple bands at the top and bottom, the red-edged side strips and the round grey buttons on the right are TikTok's ` +
        `tabs, buttons and caption area drawn for checking; they are not part of the video, and content under them is a problem.\n\n${listed}\n\n` +
        `List only clear problems a viewer would notice, the ones worth rebuilding for:\n` +
        `- text touching, under or overlapping the Cloudcode logo lockup in the top-left of the opening shot\n` +
        `- text cut off, overflowing its box, or under TikTok's buttons or caption area\n` +
        `- an empty bullet, row, card or placeholder; a broken image; a blank or near-empty frame\n` +
        `- a sticker or image squeezed, stretched or sliced off by another element\n` +
        `- a background or main visual unrelated to what the voice says at that moment ` +
        `(server racks behind a software licence, say)\n` +
        `- text hard to read against its background; text that is too small to read on a phone\n` +
        `- corner chrome or anything that looks like a watermark; decoration covering text\n` +
        `- Vietnamese text with broken or missing diacritics (a font without Vietnamese glyphs)\n` +
        `Do not list taste preferences. When the stills look right, answer with no issues.`,
      schema,
      0.2,
      picks.map((p) => `data:image/jpeg;base64,${readFileSync(p.file).toString("base64")}`),
    );
    return answer.issues;
  } catch (err) {
    console.log(`Review skipped: ${err.message}`);
    return null;
  }
};

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve("pipeline/review-video.mjs")) {
  const slug = process.argv[2];
  console.log(JSON.stringify(await reviewVideo(slug, process.env.STYLE || "as built"), null, 2));
}
