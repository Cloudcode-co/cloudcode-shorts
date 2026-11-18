import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { CONTENT_W, SAFE, Terminal, display, easeOut, sans, videoAsset } from "../../kit";
import script from "./script.json";
import { C, progress } from "./Stage";

export const SCENES = Object.fromEntries(script.scenes.map((s) => [s.id, s]));

const Entry: React.FC<{ at: number; children: React.ReactNode; dy?: number }> = ({
  at,
  children,
  dy = 28,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return <div style={{ opacity: p, translate: `0 ${(1 - p) * dy}px` }}>{children}</div>;
};

export const Headline: React.FC<{
  id: string;
  at?: number;
  top?: number;
  size?: number;
  color?: string;
  align?: "left" | "center";
}> = ({ id, at = 0, top = 340, size = 76, color = C.white, align = "left" }) => {
  const s = SCENES[id];
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        width: CONTENT_W,
        textAlign: align,
        fontFamily: display,
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1.08,
        letterSpacing: "-0.035em",
        textWrap: "balance",
        color,
        textShadow: `0 3px 24px ${C.bg}`,
      }}
    >
      <Entry at={at}>{s.headline}</Entry>
    </div>
  );
};

export const Lines: React.FC<{
  id: string;
  at: number;
  top: number;
  gap?: number;
  size?: number;
  width?: number;
  color?: string;
  indices?: number[];
}> = ({ id, at, top, gap = 92, size = 43, width = CONTENT_W, color = C.mint, indices }) => {
  const s = SCENES[id];
  const lines = indices ? indices.map((i) => s.lines[i]) : s.lines;
  return (
    <div style={{ position: "absolute", left: SAFE.left, top, width, fontFamily: sans }}>
      {lines.map((line, i) => (
        <div key={line} style={{ position: "absolute", top: i * gap, width }}>
          <Entry at={at + i * 62} dy={18}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <svg width="34" height="34" viewBox="0 0 34 34" style={{ flex: "none" }}>
                <path d="M7 17 14 24 28 9" fill="none" stroke={color} strokeWidth="4" strokeLinecap="square" />
              </svg>
              <span
                style={{
                  color: C.white,
                  fontSize: size,
                  lineHeight: 1.25,
                  fontWeight: 500,
                  textShadow: `0 3px 18px ${C.bg}`,
                }}
              >
                {line}
              </span>
            </div>
          </Entry>
        </div>
      ))}
    </div>
  );
};

export const DiagramLabel: React.FC<{
  text: string;
  sub?: string;
  x: number;
  y: number;
  at: number;
  color?: string;
  width?: number;
  align?: "left" | "right";
  exitAt?: number;
}> = ({ text, sub, x, y, at, color = C.violet, width = 400, align = "left", exitAt }) => {
  const f = useCurrentFrame();
  const p = progress(f, at, 16) * (exitAt === undefined ? 1 : 1 - progress(f, exitAt, 20));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        fontFamily: sans,
        textAlign: align,
        opacity: p,
        translate: `0 ${(1 - p) * 14}px`,
        textShadow: `0 3px 18px ${C.bg}, 0 0 10px ${C.bg}`,
      }}
    >
      <div style={{ width: 54, height: 5, background: color, marginLeft: align === "right" ? "auto" : 0, marginBottom: 12 }} />
      <div style={{ fontSize: 43, lineHeight: 1.12, fontWeight: 700, color: C.white, textWrap: "balance" }}>{text}</div>
      {sub && <div style={{ fontSize: 34, lineHeight: 1.3, color: C.muted, marginTop: 8 }}>{sub}</div>}
    </div>
  );
};

export const Command: React.FC<{
  id: string;
  at: number;
  top: number;
  width?: number;
  fontSize?: number;
  minHeight?: number;
}> = ({ id, at, top, width = CONTENT_W, fontSize = 38, minHeight = 180 }) => {
  const f = useCurrentFrame();
  const p = progress(f, at, 16);
  const cmds = SCENES[id].commands;
  return (
    <div style={{ position: "absolute", left: SAFE.left, top, opacity: p, translate: `0 ${(1 - p) * 24}px` }}>
      <Terminal
        cmds={cmds}
        width={width}
        fontSize={fontSize}
        minHeight={minHeight}
        bg="#202032"
        fg={C.white}
        accent={C.orange}
      />
    </div>
  );
};
export const RepoMark: React.FC<{ avatar: string; at: number; x: number; y: number; size?: number }> = ({
  avatar,
  at,
  x,
  y,
  size = 112,
}) => {
  const f = useCurrentFrame();
  const p = progress(f, at, 18);
  return (
    <Img
      src={videoAsset("zeabur-oss-vps-alternative", avatar)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: 22,
        opacity: p,
        scale: 0.94 + p * 0.06,
      }}
    />
  );
};

export const Question: React.FC = () => {
  const f = useCurrentFrame();
  const p = progress(f, 18, 20);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 1240,
          width: CONTENT_W,
          fontFamily: sans,
          fontSize: 42,
          lineHeight: 1.35,
          color: C.muted,
          opacity: p,
        }}
      >
        Zeabur OSS
        <br />
        <span style={{ color: C.orange, fontWeight: 700 }}>Không database riêng</span>
        <br />
        Không custom resource
      </div>
    </AbsoluteFill>
  );
};
