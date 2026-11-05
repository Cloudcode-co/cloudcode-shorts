// Gemini writes a video's score for scripts/compose.mjs to play: the style,
// tempo and key, each music section's chords, energy, drums and whether the
// lead plays, and a two-bar motif. It reads the script's music prompt and the
// sections of src/videos/<slug>/timeline.json; the result is checked and
// clamped, then saved as src/videos/<slug>/score.json.
//
// The rules below are distilled from the music-composition skill (media
// underscore, energy and dynamics, progressions) and generative-music-composer
// (chord tones on strong beats, stepwise motifs).
import { readFileSync, writeFileSync } from "node:fs";
import { llmJson } from "./lib.mjs";

const S = (type, extra = {}) => ({ type, ...extra });
export const STYLE_NAMES = ["lofi", "synthwave", "chiptune"];
const NOTES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const BPM = { lofi: [72, 90], synthwave: [84, 110], chiptune: [104, 140], breakcore: [150, 150] };

const RULES = `You are scoring the background music of a short vertical video (TikTok) that
has a voice-over. Write a score that a simple synth engine will play.

The music sits under the voice: it supports, never competes.
- Pick the style that fits the mood: lofi (calm, warm, jazzy 7th chords; explainers,
  homelab, chill tech), synthwave (driving, retro, minor key; security, suspense, space,
  documentary), chiptune (bright, playful 8-bit; games, memes, fun facts, quizzes).
- One chord per bar. Use scale degrees 1-7 of the key (1 = tonic). Use functional,
  idiomatic loops: major keys like 1-5-6-4, 6-4-1-5, 2-5-1-6 (lofi), 4-5-3-6; minor keys like
  1-6-3-7, 1-4-6-5, 6-7-1-1. 2 to 4 chords per section, looped.
- Energy 0-1 per section follows the story: a hook about 0.4-0.5, building 0.6-0.7,
  the drop or reveal 0.9-1, the outro 0.3-0.4. Neighbouring sections should differ.
- drums: "none" (pads and chords only), "light" (bass and hats), "full" (kick and snare too).
  The calm opening usually has no full drums; the drop does.
- lead: true only in the loudest one or two sections; the voice talks everywhere else.
- motif: a two-bar melody (beats 0 to 8) of 4-8 notes for the lead. Degrees are scale
  degrees from 1 (tonic) to 13 (an octave and a sixth up). Mostly steps, a leap or two,
  chord tones (1, 3, 5) on beats 0, 2, 4, 6, and it ends on 1, 3 or 5. Leave some space.`;

// `forced` ({style, bpm}) fixes both, for an art direction cut on a beat grid.
export const writeScore = async (slug, script, forced) => {
  const timeline = JSON.parse(readFileSync(`src/videos/${slug}/timeline.json`, "utf8"));
  const sections = timeline.sections?.length ? timeline.sections : [{ name: "Build", start: 0, length: timeline.total, scenes: [] }];
  const scene = Object.fromEntries((script.scenes ?? []).map((s) => [s.id, s.headline ?? s.text ?? ""]));
  const brief = {
    title: script.title,
    musicPrompt: script.musicPrompt ?? "",
    sections: sections.map((s) => ({
      name: s.name,
      seconds: Number((s.length ?? 0).toFixed(1)),
      scenes: (s.scenes ?? []).map((id) => scene[id]).filter(Boolean).slice(0, 4),
    })),
  };
  const schema = S("OBJECT", {
    properties: {
      style: S("STRING", { description: STYLE_NAMES.join(" | ") }),
      bpm: S("NUMBER"),
      key: S("STRING", { description: NOTES.join(" | ") }),
      mode: S("STRING", { description: "major | minor" }),
      sections: S("ARRAY", {
        items: S("OBJECT", {
          properties: {
            name: S("STRING"),
            energy: S("NUMBER"),
            chords: S("ARRAY", { items: S("INTEGER") }),
            drums: S("STRING", { description: "none | light | full" }),
            lead: S("BOOLEAN"),
          },
        }),
      }),
      motif: S("ARRAY", {
        items: S("OBJECT", { properties: { beat: S("NUMBER"), length: S("NUMBER"), degree: S("INTEGER") } }),
      }),
    },
  });
  const fixed = forced
    ? `\n\nThis video's style is fixed: ${forced.style} (chopped amen breaks, reese bass, minor key) at exactly ${forced.bpm} BPM. ` +
      `Answer with that style and tempo; drums "full" everywhere but the opening.`
    : "";
  const out = await llmJson(`${RULES}${fixed}\n\nThe video, its music sections in order:\n${JSON.stringify(brief, null, 1)}`, schema, 0.8);

  // Checked and clamped, so the engine never gets anything it can't play.
  const clamp = (v, lo, hi, d) => (Number.isFinite(Number(v)) ? Math.min(hi, Math.max(lo, Number(v))) : d);
  const style = forced?.style ?? (STYLE_NAMES.includes(out.style) ? out.style : "lofi");
  const score = {
    style,
    bpm: forced?.bpm ?? Math.round(clamp(out.bpm, ...BPM[style], (BPM[style][0] + BPM[style][1]) / 2)),
    key: NOTES.includes(out.key) ? out.key : "C",
    mode: out.mode === "minor" ? "minor" : "major",
    sections: sections.map((s, i) => {
      const g = out.sections?.[i] ?? {};
      const chords = (g.chords ?? []).map((c) => Math.round(clamp(c, 1, 7, 1))).slice(0, 8);
      return {
        name: s.name,
        energy: clamp(g.energy, 0, 1, 0.6),
        chords: chords.length ? chords : [1, 5, 6, 4],
        drums: ["none", "light", "full"].includes(g.drums) ? g.drums : "light",
        lead: Boolean(g.lead),
      };
    }),
    motif: (out.motif ?? [])
      .map((n) => ({ beat: clamp(n.beat, 0, 7.5, 0), length: clamp(n.length, 0.25, 4, 1), degree: Math.round(clamp(n.degree, 1, 13, 5)) }))
      .filter((n) => n.beat + n.length <= 8.01)
      .sort((a, b) => a.beat - b.beat)
      .slice(0, 12),
  };
  writeFileSync(`src/videos/${slug}/score.json`, JSON.stringify(score, null, 2) + "\n");
  console.log(
    `score: ${score.style} ${score.bpm} BPM ${score.key} ${score.mode}; ` +
      score.sections.map((s) => `${s.name} [${s.chords.join("-")}] e${s.energy} ${s.drums}${s.lead ? " lead" : ""}`).join(", "),
  );
  return score;
};
