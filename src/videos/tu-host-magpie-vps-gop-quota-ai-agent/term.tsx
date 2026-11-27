import { useCurrentFrame } from "remotion";
import { CONTENT_W, mono } from "../../kit";

// Copy of the kit Terminal with word-aware wrapping: commands stay copyable
// instead of breaking in the middle of "magpie" or a URL.
export const TYPE_DELAY = 16;
const CHARS_PER_FRAME = 1.5;
const LINE_PAUSE = 14;
const PROMPT = "$ ";
const PADDING_X = 32;

// Prefer a space, then a path separator, then the weaker punctuation, so a
// URL breaks after a slash rather than before its file extension.
const BREAK_ORDER = ["/", "-", "_", "|", ":", "."];

const wrap = (text: string, width: number): string[] => {
  const out: string[] = [];
  let rest = text;
  while (rest.length > width) {
    const limit = Math.min(width, rest.length - 1);
    let cut = -1;
    for (let i = limit; i > 0; i--) {
      if (rest[i] === " ") {
        cut = i;
        break;
      }
    }
    if (cut < 0) {
      for (const ch of BREAK_ORDER) {
        for (let i = limit; i > 0; i--) {
          if (rest[i] === ch) {
            cut = i + 1;
            break;
          }
        }
        if (cut > 0) break;
      }
    }
    if (cut <= 0) cut = width;
    out.push(rest.slice(0, cut).trimEnd());
    rest = rest.slice(cut).replace(/^ +/, "");
  }
  out.push(rest);
  return out;
};

export const Terminal: React.FC<{
  cmds: string[];
  width?: number;
  fontSize?: number;
  minHeight?: number;
  bg?: string;
  fg?: string;
  accent?: string;
}> = ({
  cmds,
  width = CONTENT_W,
  fontSize = 44,
  minHeight = 330,
  bg = "#1f1f1f",
  fg = "#FFFFFF",
  accent = "#FFC800",
}) => {
  const frame = useCurrentFrame();
  const cols = Math.floor((width - 2 * PADDING_X) / (fontSize * 0.6));
  const lineHeight = Math.round(fontSize * 1.41);
  const step = Math.max(8, cols - PROMPT.length);

  let budget = Math.max(0, frame - TYPE_DELAY) * CHARS_PER_FRAME;
  const typed = cmds.map((c) => {
    const n = Math.max(0, Math.min(c.length, Math.floor(budget)));
    budget -= n + LINE_PAUSE;
    return c.slice(0, n);
  });
  const active = typed.findIndex((t, i) => t.length < cmds[i].length);
  const cursorLine = active === -1 ? cmds.length - 1 : active;
  const cursorOn = Math.floor(frame / 16) % 2 === 0;

  const rows: { prompt: boolean; text: string; cursor: boolean }[] = [];
  typed.forEach((t, i) => {
    if (i > cursorLine) return;
    const lines = wrap(t, step);
    lines.forEach((text, j) =>
      rows.push({ prompt: j === 0, text, cursor: i === cursorLine && j === lines.length - 1 }),
    );
  });

  return (
    <div
      style={{
        width,
        fontFamily: mono,
        fontSize,
        lineHeight: `${lineHeight}px`,
        minHeight,
        background: bg,
        borderRadius: 20,
        padding: `28px ${PADDING_X}px`,
        boxSizing: "border-box",
      }}
    >
      {rows.map((row, k) => (
        <div key={k} style={{ height: lineHeight, whiteSpace: "pre", color: fg }}>
          <span style={{ color: accent }}>{row.prompt ? PROMPT : " ".repeat(PROMPT.length)}</span>
          {row.text}
          {row.cursor && (
            <span
              style={{
                display: "inline-block",
                width: "0.55em",
                height: "1em",
                marginLeft: 4,
                verticalAlign: "-0.15em",
                background: cursorOn ? accent : "transparent",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
