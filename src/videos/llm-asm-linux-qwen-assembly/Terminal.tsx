import { useCurrentFrame } from "remotion";
import { mono } from "../../kit";

// Copied from the kit's Terminal with narrower side padding (20 instead of 32)
// so the three install commands get 33 columns: "sudo apt install nasm
// binutils" stays whole and "-t 16" is not split. Typing is unchanged.
export const TYPE_DELAY = 16;
const CHARS_PER_FRAME = 1.5;
const LINE_PAUSE = 14;
const PROMPT = "$ ";
const PADDING_X = 20;

// How long the terminal keeps typing `cmds`, from TYPE_DELAY on.
export const typingFrames = (cmds: string[]) =>
  Math.ceil(
    cmds.reduce((sum, c) => sum + c.length + LINE_PAUSE, -LINE_PAUSE) / CHARS_PER_FRAME,
  );

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
  width = 720,
  fontSize = 34,
  minHeight = 330,
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
    const lines = [t.slice(0, step)];
    for (let at = step; at < t.length; at += step) lines.push(t.slice(at, at + step));
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
