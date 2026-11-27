import { useCurrentFrame } from "remotion";
import { mono } from "../../kit";
import { C } from "./theme";

// The kit terminal, copied so long commands wrap between words instead of
// splitting a package name in half. The command is still typed out character
// for character and nothing is added or removed.
export const TYPE_DELAY = 16;
const CHARS_PER_FRAME = 1.5;
const LINE_PAUSE = 14;
const PROMPT = "$ ";
const PADDING_X = 32;

export const typingFrames = (cmds: string[]) =>
  Math.ceil(
    cmds.reduce((sum, c) => sum + c.length + LINE_PAUSE, -LINE_PAUSE) / CHARS_PER_FRAME,
  );

const wrapWords = (text: string, width: number): string[] => {
  if (!text) return [""];
  const lines: string[] = [];
  let line = "";
  for (const raw of text.split(" ")) {
    let word = raw;
    if (line === "" && word.length > width) {
      while (word.length > width) {
        lines.push(word.slice(0, width));
        word = word.slice(width);
      }
      line = word;
      continue;
    }
    if (line === "") {
      line = word;
    } else if (line.length + 1 + word.length <= width) {
      line = `${line} ${word}`;
    } else if (word.length > width) {
      lines.push(line);
      while (word.length > width) {
        lines.push(word.slice(0, width));
        word = word.slice(width);
      }
      line = word;
    } else {
      lines.push(line);
      line = word;
    }
  }
  lines.push(line);
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
  delay?: number;
}> = ({
  cmds,
  width = 777,
  fontSize = 40,
  minHeight = 330,
  bg = C.ink2,
  fg = C.paper,
  accent = C.blue,
  delay = TYPE_DELAY,
}) => {
  const frame = useCurrentFrame();
  const cols = Math.floor((width - 2 * PADDING_X) / (fontSize * 0.6));
  const lineHeight = Math.round(fontSize * 1.45);

  let budget = Math.max(0, frame - delay) * CHARS_PER_FRAME;
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
    const lines = wrapWords(t, cols - PROMPT.length);
    lines.forEach((text, j) =>
      rows.push({
        prompt: j === 0,
        text,
        cursor: i === cursorLine && j === lines.length - 1,
      }),
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
        border: `1px solid ${C.line}`,
        borderRadius: 12,
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
