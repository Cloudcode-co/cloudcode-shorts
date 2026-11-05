// Test build of the breakcore-swiss edit style (.claude/skills/edit-styles)
// on Dossier's first four scenes, cut on a 150 BPM grid (24 frames a beat).
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, Sequence, interpolate, useCurrentFrame } from "remotion";
import * as THREE from "three";
import {
  Brand,
  FPS,
  Music,
  SAFE,
  Sfx,
  TikTokGuide,
  Voice,
  mono,
  sans,
  videoAsset,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import timeline from "./timeline.json";

const SLUG = "dossier-breakcore-test";
const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin", "vietnamese"] }).fontFamily;

// The grid: 150 BPM at 60 fps. Every cut, insert and regrade lands on beat(n) or beat(n) + 12.
const BEAT = 24;
const beat = (n: number) => n * BEAT;

const INK = "#0B0B0C";
const PAPER = "#FAFAF7";
const CYAN = "#19C6E6";
const RED = "#FF2E4D";
const BLUE = "#2340FF";

type Id = "s1" | "s2" | "s3" | "s4";
const IDS: Id[] = ["s1", "s2", "s3", "s4"];
const START = (id: Id) => Math.round(timeline.scenes[id].start * FPS);
const LEN = (id: Id) => Math.round(timeline.scenes[id].length * FPS);
const CLIP = (id: Id) => durations[id] * FPS;
const TOTAL = Math.round(timeline.total * FPS);
const DOSSIER = facts.repos[0];

// One-frame inserts on the snare (2 frames at 60 fps), applied to the whole frame.
type Insert = "invert" | "mirror" | "smear" | "rgb";
const KINDS: Insert[] = ["invert", "rgb", "mirror", "smear"];
const INSERTS = Array.from({ length: Math.floor(TOTAL / beat(2)) }, (_, k) => ({
  at: beat(2 * k + 1) + 12,
  kind: KINDS[k % KINDS.length],
})).filter((i) => i.at > beat(2) && i.at < TOTAL - beat(1));
const insertStyle = (f: number): CSSProperties => {
  const hit = INSERTS.find((i) => f >= i.at && f < i.at + 2);
  if (!hit) return {};
  if (hit.kind === "invert") return { filter: "invert(1)" };
  if (hit.kind === "mirror") return { transform: "scaleX(-1)" };
  if (hit.kind === "smear") return { transform: "scaleX(1.9) skewX(-14deg)", transformOrigin: "50% 50%" };
  return { filter: `drop-shadow(14px 0 0 ${RED}) drop-shadow(-14px 0 0 ${CYAN})` };
};

// Per-beat regrade for images: natural, acid, pink-violet, sepia.
const GRADES = ["none", "invert(1) hue-rotate(90deg) saturate(3)", "hue-rotate(250deg) saturate(2)", "sepia(0.9)"];
const grade = (f: number) => GRADES[Math.floor(f / BEAT) % 4];

// --- Poster parts.
const lerp = (f: number, at: number, dur: number) =>
  f < at ? 0 : interpolate(f - at, [0, dur], [0, 1], { extrapolateRight: "clamp" });

const Stroke: React.FC<{ d: string; at: number; len: number; dur?: number; w?: number; color?: string }> = ({
  d,
  at,
  len,
  dur = 12,
  w = 4,
  color = INK,
}) => {
  const f = useCurrentFrame();
  const p = lerp(f, at, dur);
  if (p === 0) return null;
  return <path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />;
};
const Lines: React.FC<{ children: ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

// The key word slams in: one frame big, then set; hard, no fade.
const Slam: React.FC<{ at: number; children: ReactNode; style: CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = f - at < 2 ? 1.25 : f - at < 4 ? 1.06 : 1;
  return (
    <div style={{ position: "absolute", fontFamily: anton, color: INK, lineHeight: 0.86, transform: `scale(${s})`, transformOrigin: "left top", ...style }}>
      {children}
    </div>
  );
};

// Appears on its beat, no tween: the cut is the motion.
const At: React.FC<{ at: number; children: ReactNode; style?: CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return <div style={{ position: "absolute", ...style }}>{children}</div>;
};

const Dots: React.FC<{ n: number; style: CSSProperties }> = ({ n, style }) => (
  <div style={{ position: "absolute", display: "flex", gap: 14, ...style }}>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: INK }} />
    ))}
  </div>
);

const Sphere: React.FC<{ x: number; y: number; d: number }> = ({ x, y, d }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #6A6A70, ${INK} 62%)` }} />
      {[1.25, 1.5, 1.8].map((k, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: (d - d * k) / 2,
            top: (d - d * k) / 2,
            width: d * k,
            height: d * k,
            borderRadius: "50%",
            border: `3px ${i === 1 ? "dashed" : "solid"} ${INK}`,
            transform: `rotate(${f * (i % 2 ? -1.5 : 1) * (i + 1)}deg)`,
          }}
        />
      ))}
    </div>
  );
};

const Fact: React.FC<{ at: number; top: number; size?: number; children: ReactNode; font?: string }> = ({
  at,
  top,
  size = 46,
  children,
  font = sans,
}) => (
  <At at={at} style={{ left: SAFE.left, right: SAFE.right, top, fontFamily: font, fontWeight: 700, fontSize: size, color: INK, lineHeight: 1.1, textWrap: "balance" }}>
    {children}
  </At>
);

const Pill: React.FC<{ at: number; x: number; y: number; w?: number }> = ({ at, x, y, w = 70 }) => (
  <At at={at} style={{ left: x, top: y, width: w, height: 18, borderRadius: 9, background: CYAN }}>
    {null}
  </At>
);

// --- s1 Hook: the void, a hairline, then CV slams in on beat 1.
const S1: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }}>
    {/* A black Swiss block carries the lockup (its logo is white). */}
    <div style={{ position: "absolute", left: 0, top: 226, width: 560, height: 96, background: INK }} />
    <Brand />
    <Lines>
      <Stroke d="M0 410 H1080" len={1080} at={0} w={3} />
      <Stroke d="M640 410 V930" len={520} at={beat(2)} w={3} />
    </Lines>
    <Slam at={beat(1)} style={{ left: SAFE.left - 12, top: 430, fontSize: 600 }}>
      CV
    </Slam>
    <At at={beat(2) + 12}>
      <Sphere x={770} y={700} d={200} />
    </At>
    <At at={beat(3)} style={{ left: 860, top: 460, writingMode: "vertical-rl", fontFamily: anton, fontSize: 40, color: INK }}>
      THEO TỪNG JD
    </At>
    <Fact at={beat(4)} top={960} size={100} font={anton}>
      AI viết CV theo từng JD
    </Fact>
    <Pill at={beat(6)} x={SAFE.left} y={1222} />
    <Fact at={beat(6)} top={1200} size={46}>
      <span style={{ paddingLeft: 92 }}>Chuẩn từng tin tuyển dụng</span>
    </Fact>
    <Pill at={beat(7)} x={SAFE.left} y={1292} />
    <Fact at={beat(7)} top={1270} size={46}>
      <span style={{ paddingLeft: 92 }}>Không bịa kinh nghiệm</span>
    </Fact>
    <Dots n={22} style={{ left: SAFE.left, top: 1390 }} />
    <Sfx id="thud" at={beat(1)} volume={0.4} />
    <Voice slug={SLUG} id="s1" />
  </AbsoluteFill>
);

// --- s2 Poster build: DOSSIER, a portal holding its logo, a cone sweep, then zoom through.
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const len = LEN("s2");
  const through = f < len - beat(1) ? 1 : interpolate(f, [len - beat(1), len], [1, 9]);
  const cone = lerp(f, beat(2), beat(4));
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      {cone > 0 && cone < 1 && (
        <div
          style={{
            position: "absolute",
            left: -200,
            top: 300,
            width: 1500,
            height: 900,
            background: "linear-gradient(90deg, #8A3FFC, #19C6E6, #FF3EA5)",
            clipPath: "polygon(100% 0, 0 40%, 0 60%)",
            opacity: 0.85,
            transform: `rotate(${-30 + cone * 60}deg)`,
            transformOrigin: "100% 0",
          }}
        />
      )}
      <Lines>
        <Stroke d="M0 520 H1080" len={1080} at={0} w={3} />
        <Stroke d="M103 1215 C 300 1180, 500 1250, 880 1205" len={820} at={beat(6)} dur={16} w={5} />
      </Lines>
      <Slam at={0} style={{ left: SAFE.left - 6, top: 290, fontSize: 250 }}>
        DOSSIER
      </Slam>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${through})`, transformOrigin: "491px 760px" }}>
        <At at={beat(1)}>
          <Portal x={491} y={760} r={170} />
        </At>
      </div>
      <At at={beat(3)} style={{ left: 820, top: 560, writingMode: "vertical-rl", fontFamily: anton, fontSize: 40, color: INK }}>
        TỰ HOST
      </At>
      {through < 2 && (
        <>
          <Fact at={beat(4)} top={1050} size={74} font={anton}>
            Dossier tự host trên máy chủ
          </Fact>
          <Fact at={beat(8)} top={1230} size={44}>
            Mã nguồn mở {DOSSIER.license}
          </Fact>
          <Fact at={beat(9)} top={1290} size={44}>
            Quản lý tìm việc trọn gói
          </Fact>
          <At at={beat(10)} style={{ left: SAFE.left, top: 1365, fontFamily: mono, fontSize: 34, color: INK }}>
            [{DOSSIER.stars.toLocaleString("de-DE")} stars · {DOSSIER.language}]
          </At>
        </>
      )}
      <Sfx id="whoosh" at={len - beat(1)} volume={0.25} />
      <Voice slug={SLUG} id="s2" />
    </AbsoluteFill>
  );
};
const Portal: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => {
  const f = useCurrentFrame();
  return (
    <>
      {[1.18, 1.36, 1.56].map((k, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x - r * k,
            top: y - r * k,
            width: 2 * r * k,
            height: 2 * r * k,
            borderRadius: "50%",
            border: `${i === 0 ? 10 : 3}px ${i === 2 ? "dashed" : "solid"} ${INK}`,
            transform: `rotate(${f * (i + 1) * (i % 2 ? -0.8 : 1.2)}deg)`,
          }}
        />
      ))}
      <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", overflow: "hidden", background: INK }}>
        <Img src={videoAsset(SLUG, DOSSIER.avatar)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: grade(f) }} />
      </div>
    </>
  );
};

// --- s3 One profile, matched to the JD; what's missing becomes a GAP, never made up.
const S3: React.FC = () => {
  const gapAt = beat(11); // "khoảng trống"
  const rows = [0, 1, 2, 3];
  const card = (x: number, title: string, at: number, gap?: boolean) => (
    <At at={at} style={{ left: x, top: 330, width: 340, height: 420, border: `5px solid ${INK}`, background: "#FFFFFF" }}>
      <div style={{ fontFamily: anton, fontSize: 52, color: INK, padding: "18px 24px" }}>{title}</div>
      {rows.map((r) => (
        <div
          key={r}
          style={{
            margin: "0 24px 30px",
            height: 26,
            width: [260, 200, 240, 180][r],
            background: gap && r === 2 ? "transparent" : INK,
            border: gap && r === 2 ? `4px dashed ${RED}` : undefined,
          }}
        />
      ))}
    </At>
  );
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {card(SAFE.left, "HỒ SƠ GỐC", 0)}
      {card(540, "JD", beat(1), true)}
      <Lines>
        <Stroke d="M383 460 C 450 430, 480 500, 564 460" len={210} at={beat(3)} w={5} />
        <Stroke d="M343 516 C 430 560, 470 470, 564 516" len={240} at={beat(4)} w={5} />
        <Stroke d="M363 628 C 440 600, 480 660, 564 628" len={220} at={beat(5)} w={5} />
        <Stroke d="M103 1020 q 40 -50 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0" len={1000} at={gapAt} dur={16} w={6} color={BLUE} />
      </Lines>
      <Slam at={gapAt} style={{ left: 470, top: 740, fontSize: 250, color: RED }}>
        GAP
      </Slam>
      <At at={beat(2) + 12} style={{ left: SAFE.left, top: 790, fontFamily: sans, fontWeight: 700, fontSize: 36, color: INK }}>
        so khớp
      </At>
      <Fact at={beat(6)} top={1060} size={74} font={anton}>
        Một hồ sơ gốc duy nhất
      </Fact>
      <Fact at={beat(7)} top={1170} size={42}>
        So khớp kỹ năng với JD
      </Fact>
      <Fact at={gapAt} top={1230} size={42}>
        Yêu cầu thiếu tính là gap
      </Fact>
      <Fact at={beat(14)} top={1290} size={42}>
        Không bao giờ bịa kinh nghiệm
      </Fact>
      <Dots n={18} style={{ left: SAFE.left, top: 1390 }} />
      <Sfx id="thud" at={gapAt} volume={0.4} />
      <Voice slug={SLUG} id="s3" />
    </AbsoluteFill>
  );
};

// --- s4 Drop: the logo regraded every beat, ribbons through it, LOCAL extruded in steep perspective.
const Ribbon: React.FC<{ points: [number, number, number][]; color: string; delay: number }> = ({ points, color, delay }) => {
  const f = useCurrentFrame();
  const t = interpolate(f - delay, [0, beat(3)], [0.02, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    const n = 40;
    const part = new THREE.CatmullRomCurve3(Array.from({ length: n + 1 }, (_, i) => curve.getPoint((i / n) * t)));
    return new THREE.TubeGeometry(part, 80, 0.09, 10, false);
  }, [points, t]);
  if (f < delay) return null;
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={color} />
    </mesh>
  );
};
const RIBBONS: { points: [number, number, number][]; color: string; delay: number }[] = [
  { points: [[-4, -0.6, 0], [-1, 1.8, 1], [1, 0.2, 0.5], [4, 2.6, -1]], color: "#FFD60A", delay: beat(1) },
  { points: [[4, -0.7, -1], [1, 0.4, 1], [-1, 1.9, 0], [-4, 2.8, 1]], color: "#FF3EA5", delay: beat(2) },
  { points: [[-4, 2, -1], [-1, 0, 0.5], [2, 1.6, 1], [4, -0.5, 0]], color: BLUE, delay: beat(3) },
];
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const len = LEN("s4");
  const loop = f >= len - beat(1); // rebuild the opening frame so the short loops
  const word = lerp(f, beat(4), 10);
  return (
    <AbsoluteFill style={{ background: loop ? PAPER : INK }}>
      {!loop && (
        <>
          <div style={{ position: "absolute", left: 190, top: 380, width: 700, height: 700, overflow: "hidden" }}>
            <Img src={videoAsset(SLUG, DOSSIER.avatar)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: grade(f) }} />
          </div>
          <ThreeCanvas width={1080} height={1920} camera={{ position: [0, 0, 9], fov: 40 }} style={{ position: "absolute", inset: 0 }}>
            {RIBBONS.map((r, i) => (
              <Ribbon key={i} {...r} />
            ))}
          </ThreeCanvas>
          <At at={beat(6)} style={{ left: 600, top: 420, width: 260, height: 150, display: "flex", transform: `perspective(900px) rotateY(${-35 + Math.sin(f / 12) * 10}deg)` }}>
            {["#C0C0C0", "#C0C000", "#00C0C0", "#00C000", "#C000C0", "#C00000", "#0000C0"].map((c) => (
              <div key={c} style={{ flex: 1, background: c }} />
            ))}
          </At>
          {word > 0 && (
            <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: 1010, height: 200, perspective: 700 }}>
              <div style={{ position: "relative", transform: `rotateX(52deg) rotateZ(-8deg) scale(${0.7 + 0.3 * word})`, transformStyle: "preserve-3d" }}>
                {Array.from({ length: 16 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      fontFamily: anton,
                      fontSize: 210,
                      lineHeight: 1,
                      color: i === 15 ? "#FFFFFF" : `hsl(${190 + i * 6}, 90%, ${30 + i * 2}%)`,
                      transform: `translateZ(${i * 3}px)`,
                    }}
                  >
                    LOCAL
                  </div>
                ))}
              </div>
            </div>
          )}
          <At at={0} style={{ left: SAFE.left, right: SAFE.right, top: 270, fontFamily: anton, fontSize: 82, color: "#FFFFFF", lineHeight: 1 }}>
            Bảo mật với AI local
          </At>
          <Fact at={beat(7)} top={1250} size={44}>
            <span style={{ color: "#FFFFFF" }}>Hỗ trợ Ollama và LM Studio</span>
          </Fact>
          <Fact at={beat(10)} top={1320} size={44}>
            <span style={{ color: "#FFFFFF" }}>Dữ liệu không bao giờ rò rỉ</span>
          </Fact>
        </>
      )}
      {loop && (
        <>
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            <line x1={0} y1={410} x2={1080} y2={410} stroke={INK} strokeWidth={3} />
          </svg>
          <div style={{ position: "absolute", left: SAFE.left - 12, top: 430, fontFamily: anton, fontSize: 600, lineHeight: 0.86, color: INK }}>CV</div>
        </>
      )}
      <Voice slug={SLUG} id="s4" />
    </AbsoluteFill>
  );
};

const PARTS: Record<Id, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4 };

const Main: React.FC<VideoProps> = ({ guide }) => {
  const f = useCurrentFrame();
  const ranges: [number, number][] = IDS.map((id) => [START(id), START(id) + Math.round(CLIP(id))]);
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {/* Hard cuts only: the inserts and the portal are the transitions. */}
      <AbsoluteFill style={insertStyle(f)}>
        {IDS.map((id) => {
          const Part = PARTS[id];
          return (
            <Sequence key={id} from={START(id)} durationInFrames={LEN(id)} name={id}>
              <Part />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Music slug={SLUG} total={TOTAL} voiceRanges={ranges} />
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: Main,
  durationInFrames: TOTAL,
};
