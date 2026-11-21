// The kit Terminal, squared off into an instrument readout: same character-by-
// character typing, no rounded card. Commands stay exact so they can be copied.
import { useCurrentFrame } from "remotion";
import { CONTENT_W, mono } from "../../kit";

export const TYPE_DELAY = 16;
const CHARS_PER_FRAME = 1.5;
const LINE_PAUSE = 14;
const PROMPT = "$ ";
const PADDING_X = 20;

export const typingFrames = (cmds: string[]) =>
  Math.ceil(cmds.reduce((sum, c) => sum + c.length + LINE_PAUSE, -LINE_PAUSE) / CHARS_PER_FRAME);

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
  minHeight = 300,
  bg = "rgba(3,8,15,0.82)",
  fg = "#EDF4FF",
  accent = "#C9965C",
}) => {
  const frame = useCurrentFrame();
  const cols = Math.floor((width - 2 * PADDING_X) / (fontSize * 0.6));
  const lineHeight = Math.round(fontSize * 1.42);

  let budget = Math.max(0, frame - TYPE_DELAY) * CHARS_PER_FRAME;
  const typed = cmds.map((c) => {
    const n = Math.max(0, Math.min(c.length, Math.floor(budget)));
    budget -= n + LINE_PAUSE;
    return c.slice(0, n);
  });
  const active = typed.findIndex((t, i) => t.length < cmds[i].length);
  const cursorLine = active === -1 ? cmds.length - 1 : active;
  const cursorOn = Math.floor(frame / 16) % 2 === 0;

  // Wrap on the last space before the column limit; the break space stays at the
  // end of the line, so every character of the command is still on screen.
  const wrap = (t: string, step: number) => {
    const lines: string[] = [];
    let i = 0;
    while (t.length - i > step) {
      const space = t.lastIndexOf(" ", i + step);
      const cut = space > i ? space + 1 : i + step;
      lines.push(t.slice(i, cut));
      i = cut;
    }
    lines.push(t.slice(i));
    return lines;
  };

  const rows: { prompt: boolean; text: string; cursor: boolean }[] = [];
  typed.forEach((t, i) => {
    if (i > cursorLine) return;
    const step = cols - PROMPT.length;
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
        borderRadius: 4,
        borderTop: `2px solid ${accent}`,
        borderBottom: "1px solid rgba(200,220,255,0.16)",
        padding: `22px ${PADDING_X}px 24px`,
        boxSizing: "border-box",
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
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
