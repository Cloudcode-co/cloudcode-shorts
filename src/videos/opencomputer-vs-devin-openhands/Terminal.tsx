import { useCurrentFrame } from "remotion";
import { mono } from "../../kit";

// Copy of the kit Terminal with one change: commands wrap at spaces or after
// / - _ instead of at a fixed column, so a copied command never splits
// mid-token. Typing speed, delays and look match the kit exactly.

export const TYPE_DELAY = 16;
const CHARS_PER_FRAME = 1.5;
const LINE_PAUSE = 14;
const PROMPT = "$ ";
const PADDING_X = 32;

type Line = { text: string; start: number };

const wrap = (text: string, cols: number): Line[] => {
  const lines: Line[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(text.length, start + cols);
    if (end < text.length) {
      const window = text.slice(start, end);
      const space = window.lastIndexOf(" ");
      const token = Math.max(
        window.lastIndexOf("/"),
        window.lastIndexOf("-"),
        window.lastIndexOf("_"),
      );
      if (space > 0) end = start + space;
      else if (token > 0) end = start + token + 1;
    }
    lines.push({ text: text.slice(start, end), start });
    start = end;
    while (text[start] === " ") start++;
  }
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
  width = 729,
  fontSize = 34,
  minHeight = 300,
  bg = "#120933",
  fg = "#FFF4D8",
  accent = "#FFC94A",
}) => {
  const frame = useCurrentFrame();
  const cols = Math.floor((width - 2 * PADDING_X) / (fontSize * 0.6));
  const lineHeight = Math.round(fontSize * 1.41);

  let budget = Math.max(0, frame - TYPE_DELAY) * CHARS_PER_FRAME;
  const typed = cmds.map((c) => {
    const n = Math.max(0, Math.min(c.length, Math.floor(budget)));
    budget -= n + LINE_PAUSE;
    return n;
  });
  const active = typed.findIndex((n, i) => n < cmds[i].length);
  const cursorOn = Math.floor(frame / 16) % 2 === 0;

  const rows: { prompt: boolean; text: string; cursor: boolean }[] = [];
  typed.forEach((n, i) => {
    if (active !== -1 && i > active) return;
    const lines = wrap(cmds[i], cols);
    let cursorLine = 0;
    for (let j = 0; j < lines.length; j++) {
      if (n > lines[j].start + lines[j].text.length) cursorLine = j + 1;
      else {
        cursorLine = j;
        break;
      }
    }
    cursorLine = Math.min(cursorLine, lines.length - 1);
    lines.forEach((line, j) => {
      const shown = cmds[i].slice(line.start, Math.min(n, line.start + line.text.length));
      rows.push({
        prompt: j === 0,
        text: shown,
        cursor: i === active && j === cursorLine,
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
