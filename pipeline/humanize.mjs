// One more pass over a finished script with the humanizer skill's rules
// (.claude/skills/humanizer), adapted to spoken Vietnamese: the words keep
// their facts but lose the tells of AI writing. A scene the pass breaks (a
// tag, a name or number added or lost, the length) keeps its original words;
// when the pass fails outright the script comes back unchanged.
import { llmJson } from "./lib.mjs";

const RULES =
  "Edit the Vietnamese lines below so they read like a real Vietnamese creator talking to friends, not an AI. " +
  "This is an edit, not a rewrite: change only the words that show one of these tells, and copy everything else " +
  "word for word. The tells: a 'không phải X mà là Y' contrast that only adds weight; a one-line dramatic " +
  "closer that repeats the point; a saying that sounds deep but says nothing; a staged run-up before the point " +
  "('Bạn có biết…', 'Hãy cùng tìm hiểu', 'Điều thú vị là'); arguing with nobody ('nhiều người nghĩ… nhưng'); " +
  "stacked adjectives and hype ('tuyệt vời', 'mạnh mẽ', 'đột phá', 'cách mạng', 'siêu xịn', 'đỉnh cao') and " +
  "sales language; vague importance ('đóng vai trò quan trọng', 'thay đổi cuộc chơi'); dashes used as glue. " +
  "Replace a tell with the plain, concrete thing it was standing in for, or cut it when it says nothing.\n" +
  "Never add a fact, claim, product, name, number or event that is not already in that same scene, never move " +
  "anything to another scene, and never drop a fact. Keep the [audio tags] in square brackets where they are. " +
  "A line with no tell comes back exactly as it was. Jokes stay jokes: keep the setup and the whole punchline. " +
  "The title keeps its subject; the caption keeps its closing question.";

const S = (type, extra = {}) => ({ type, ...extra });

// The audio tags of a line, in order.
const tags = (t) => (t.match(/\[[^\]]+\]/g) ?? []).join("");

// Numbers and names in a text: words with a digit, and capitalized words that
// do not start a sentence ("Coolify", "VPS", "2GB"), lowercased.
const names = (t) => {
  const found = new Set();
  const words = t.replace(/\[[^\]]+\]/g, " ").split(/\s+/).filter(Boolean);
  words.forEach((w, i) => {
    const word = w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
    if (!word) return;
    const first = i === 0 || /[.!?…:]$/.test(words[i - 1]);
    if (/\p{N}/u.test(word) || (!first && /\p{Lu}/u.test(word))) found.add(word.toLowerCase());
  });
  return found;
};

export const humanize = async (script, { voiced }) => {
  // A silent video's scenes are their headline alone (a chat's lines only say who sends it).
  const scenes = script.scenes.map((s) =>
    voiced ? { id: s.id, text: s.text, headline: s.headline, lines: s.lines } : { id: s.id, headline: s.headline },
  );
  const schema = S("OBJECT", {
    properties: {
      title: S("STRING"),
      caption: S("STRING"),
      scenes: S("ARRAY", {
        items: S("OBJECT", {
          properties: {
            id: S("STRING"),
            ...(voiced ? { text: S("STRING") } : {}),
            headline: S("STRING"),
            ...(voiced ? { lines: S("ARRAY", { items: S("STRING") }) } : {}),
          },
          required: ["id", ...(voiced ? ["text"] : []), "headline", ...(voiced ? ["lines"] : [])],
        }),
      }),
    },
    required: ["title", "caption", "scenes"],
  });
  try {
    const out = await llmJson(
      `${RULES}\n\n${JSON.stringify({ title: script.title, caption: script.caption, scenes }, null, 1)}`,
      schema,
      0.2,
    );
    if (out.scenes?.length !== scenes.length) {
      console.log("Humanizer pass lost scenes; keeping the original.");
      return script;
    }
    // Why a reworded text can't be used, or null.
    const drift = (now, was, least = 0.7) => {
      now = (now ?? "").trim();
      if (!now) return "came back empty";
      if (tags(now) !== tags(was)) return "changed its audio tags";
      const a = names(now);
      const b = names(was);
      const added = [...a].filter((n) => !b.has(n));
      const lost = [...b].filter((n) => !a.has(n));
      if (added.length || lost.length) return `changed names (${[...added.map((n) => `+${n}`), ...lost.map((n) => `-${n}`)].join(" ")})`;
      const ratio = now.length / Math.max(1, was.length);
      // Short lines may lose a whole staged run-up ("Bạn có biết?").
      if (ratio < (was.length < 80 ? least - 0.2 : least) || ratio > 1.3) return `went from ${was.length} to ${now.length} characters`;
      return null;
    };
    const broken = (s, was) => {
      if (s.id !== was.id) return "lost its id";
      // A silent video's headline is its whole line, punchline included.
      const head = drift(s.headline, was.headline, voiced ? 0.5 : 0.7);
      if (head) return `headline ${head}`;
      if (!voiced) return null;
      if ((s.lines ?? []).length !== was.lines.length) return `has ${(s.lines ?? []).length} lines instead of ${was.lines.length}`;
      // Cutting a staged run-up or a "không phải X mà là Y" can halve a line;
      // the names check keeps its facts.
      return drift(s.text, was.text, 0.5);
    };
    let changed = 0;
    const next = script.scenes.map((orig, i) => {
      const s = out.scenes[i];
      const why = broken(s, scenes[i]);
      if (why) {
        console.log(`Humanizer pass: ${scenes[i].id} ${why}, keeping its original words.`);
        return orig;
      }
      if (JSON.stringify(s) !== JSON.stringify(scenes[i])) changed++;
      return {
        ...orig,
        ...(voiced ? { text: s.text.trim() } : {}),
        headline: s.headline.trim(),
        ...(voiced ? { lines: s.lines.map((l) => l.trim()) } : {}),
      };
    });
    const title = drift(out.title, script.title, 0.5) ? script.title : out.title.trim();
    const asks = (t) => /\?\s*\S{0,4}$/.test(t.trim());
    const caption =
      drift(out.caption, script.caption, 0.5) || (asks(script.caption) && !asks(out.caption)) ? script.caption : out.caption.trim();
    console.log(
      `Humanizer pass: ${changed} of ${scenes.length} scenes reworded` +
        `${title !== script.title ? ", title" : ""}${caption !== script.caption ? ", caption" : ""}.`,
    );
    return { ...script, title, caption, scenes: next };
  } catch (err) {
    console.log(`Humanizer pass skipped: ${err.message}`);
    return script;
  }
};
