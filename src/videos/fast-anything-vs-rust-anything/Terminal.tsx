import { useCurrentFrame } from "remotion";
import { CONTENT_W, mono } from "../../kit";

// A terminal that types its commands character by character. Commands are
// shown exactly as given; lines break at spaces so flags like --agent are
// never split down the middle.
export const TYPE_DELAY = 16;
const CHARS_PER_FRAME = 1.5;
const LINE_PAUSE = 14;
const PROMPT = "$ ";
const PADDING_X = 24;

export const typingFrames = (cmds: string[]) =>
  Math.ceil(
    cmds.reduce((sum, c) => sum + c.length + LINE_PAUSE, -LINE_PAUSE) / CHARS_PER_FRAME,
  );

// Stable word-wrap computed from the full command, so the break does not move
// while the command is being typed.
const wrapWords = (text: string, width: number) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (line.length === 0) line = word;
    else if (line.length + 1 + word.length <= width) line += ` ${word}`;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line.length > 0) lines.push(line);
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
  fontSize = 34,
  minHeight = 330,
  bg = "#1f1f1f",
  fg = "#FFFFFF",
  accent = "#FFC800",
}) => {
  const frame = useCurrentFrame();
  const cols = Math.floor((width - 2 * PADDING_X) / (fontSize * 0.6));
  const step = Math.max(8, cols - PROMPT.length);
  const lineHeight = Math.round(fontSize * 1.41);

  let budget = Math.max(0, frame - TYPE_DELAY) * CHARS_PER_FRAME;
  const typed = cmds.map((c) => {
    const n = Math.max(0, Math.min(c.length, Math.floor(budget)));
    budget -= n + LINE_PAUSE;
    return n;
  });
  const active = typed.findIndex((n, i) => n < cmds[i].length);
  const cursorLine = active === -1 ? cmds.length - 1 : active;
  const cursorOn = Math.floor(frame / 16) % 2 === 0;

  const rows: { prompt: boolean; text: string; cursor: boolean }[] = [];
  cmds.forEach((c, i) => {
    if (i > cursorLine) return;
    const n = typed[i];
    const lines = wrapWords(c, step);
    const starts: number[] = [];
    let pos = 0;
    lines.forEach((line) => {
      starts.push(pos);
      pos += line.length + 1;
    });

    let cursorIdx = -1;
    if (i === cursorLine) {
      cursorIdx = lines.findIndex((line, j) => n <= starts[j] + line.length);
      if (cursorIdx === -1) cursorIdx = lines.length - 1;
    }

    lines.forEach((line, j) => {
      if (i === cursorLine && j > cursorIdx) return;
      const start = starts[j];
      const end = start + line.length;
      rows.push({
        prompt: j === 0,
        text: c.slice(start, Math.min(end, n)),
        cursor: j === cursorIdx,
      });
    });
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
