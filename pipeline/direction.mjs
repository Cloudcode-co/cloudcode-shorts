// A video's art direction from pipeline/art-directions.json, picked once and
// saved to src/videos/<slug>/direction.json, so the music (which follows a
// direction's `bpm` when it has one) and the build use the same one.
//
// STYLE (an id or name, or any description used as the direction itself)
// wins; a revision keeps the video's past direction; else Gemini picks the one
// that fits the script from those not used in the last 5 videos, or a seeded
// draw when that fails.
import { existsSync } from "node:fs";
import { llmJson, readJson, writeJson } from "./lib.mjs";

const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const custom = (name) => ({
  id: "custom",
  name,
  brief: "Interpret this style boldly and consistently across every shot.",
});

export const pickDirection = async (slug, { revise = false } = {}) => {
  const file = `src/videos/${slug}/direction.json`;
  const { directions } = readJson("pipeline/art-directions.json");
  const history = readJson("pipeline/history.json", []);
  const past = history.findLast((h) => h.slug === slug);
  const style = (process.env.STYLE ?? "").trim();
  const chosen =
    style && (directions.find((d) => fold(d.id) === fold(style) || fold(d.name) === fold(style)) ?? custom(style));
  const recent = history.slice(-5).map((h) => h.direction);
  const pool = directions.filter((d) => !recent.includes(d.id));
  let seed = [...slug].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
  const draw = (list) => list[(seed = (seed * 1103515245 + 12345) >>> 0) % list.length];
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
    (existsSync(file) && readJson(file)) ||
    (await fitting(pool.length ? pool : directions));
  writeJson(file, direction);
  return direction;
};
