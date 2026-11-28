import { useCurrentFrame } from "remotion";
import { CONTENT_W, mono } from "../../kit";

// The kit Terminal, copied here for one reason: long commands wrap at the last
// space or slash inside the column window instead of slicing a URL or an
// option mid-word. Typing, prompt, cursor and timing are unchanged, and every
// character of each command is still on screen.
export const TYPE_DELAY = 16;
const CHARS_PER_FRAME = 1.5;
const LINE_PAUSE = 14;
const PROMPT = "$ ";
const PADDING_X = 32;

export const typingFrames = (cmds: string[]) =>
  Math.ceil(
    cmds.reduce((sum, c) => sum + c.length + LINE_PAUSE, -LINE_PAUSE) / CHARS_PER_FRAME,
  );

const wrapCommand = (text: string, step: number) => {
  const lines: string[] = [];
  let rest = text;
  while (rest.length > step) {
    const space = rest.lastIndexOf(" ", step);
    const slash = rest.lastIndexOf("/", step);
    let cut = Math.max(space, slash);
    if (cut <= 0) cut = step - 1;
    lines.push(rest.slice(0, cut + 1));
    rest = rest.slice(cut + 1);
  }
  lines.push(rest);
  return lines;
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
  fontSize = 35,
  minHeight = 0,
  bg = "#1f1f1f",
  fg = "#FFFFFF",
  accent = "#FFC800",
}) => {
  const frame = useCurrentFrame();
  const cols = Math.floor((width - 2 * PADDING_X) / (fontSize * 0.6));
  const lineHeight = Math.round(fontSize * 1.41);

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
    const step = cols - PROMPT.length;
    const lines = wrapCommand(t, step);
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
        borderRadius: 28,
        padding: `30px ${PADDING_X}px`,
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
