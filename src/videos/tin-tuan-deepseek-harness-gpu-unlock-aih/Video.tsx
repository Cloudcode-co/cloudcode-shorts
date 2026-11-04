import { OffthreadVideo, AbsoluteFill, Img, Sequence, interpolate, useCurrentFrame } from "remotion";
import {
  Brand,
  BRAND_SPACE,
  CONTENT_W,
  FPS,
  Music,
  SAFE,
  Sfx,
  Terminal,
  TYPE_DELAY,
  TikTokGuide,
  Voice,
  display,
  easeOut,
  enter,
  sans,
  typingFrames,
  useIn,
  videoAsset,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const NAVY = "#0B1F3F";
const NAVY_DEEP = "#071530";
const RED = "#E5252D";
const RED_LIGHT = "#FF5A60";
const WHITE = "#FFFFFF";
const MUTED = "#9DB0CF";

type SceneId = keyof typeof timeline.scenes;
const S = (id: SceneId) => Math.round(timeline.scenes[id].start * FPS);
const TOTAL = Math.round(timeline.total * FPS);
const lines = (id: string) => script.scenes.find((s) => s.id === id)!.lines;
const cmds = (id: string) => script.scenes.find((s) => s.id === id)!.commands;
const repo = (i: number) => facts.repos[i];
const stars = (i: number) => repo(i).stars;

const SHOTS = [0, S("s2"), S("s4"), S("s6"), S("s8")];

// ---------- shared broadcast pieces ----------

const Bar: React.FC<{ top: number }> = ({ top }) => {
  const p = useIn(0, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: CONTENT_W,
        top,
        height: 64,
        display: "flex",
        alignItems: "stretch",
        fontFamily: display,
        fontWeight: 800,
        fontSize: 36,
        whiteSpace: "nowrap",
        opacity: p,
        transform: `translateX(${(1 - p) * -60}px)`,
      }}
    >
      <div style={{ background: RED, color: WHITE, padding: "0 24px", display: "flex", alignItems: "center" }}>
        TIN NÓNG
      </div>
      <div style={{ background: WHITE, color: NAVY, flex: 1, padding: "0 24px", display: "flex", alignItems: "center" }}>
        Tin tuần mã nguồn mở
      </div>
    </div>
  );
};

const TICKER_TEXT = facts.repos
  .map((r, i) => `${["DeepSeek Harness", "gpu-unlock", "AIHOT"][i]}: ${r.stars.toLocaleString("en-US")} sao GitHub`)
  .join("   |   ");

const Ticker: React.FC = () => {
  const frame = useCurrentFrame();
  const unit = TICKER_TEXT.length * 21 + 120;
  const x = -((frame * 3.2) % unit);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: CONTENT_W,
        top: 1370,
        height: 68,
        background: WHITE,
        display: "flex",
        overflow: "hidden",
        fontFamily: display,
        fontWeight: 600,
        fontSize: 36,
      }}
    >
      <div style={{ background: RED, width: 14, flexShrink: 0 }} />
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 68,
            lineHeight: "68px",
            whiteSpace: "pre",
            color: NAVY,
            transform: `translateX(${x}px)`,
          }}
        >
          {[0, 1, 2].map((k) => (
            <span key={k} style={{ display: "inline-block", width: unit }}>
              {TICKER_TEXT}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const LowerThird: React.FC<{ rows: string[]; fontSize?: number }> = ({ rows, fontSize = 46 }) => {
  const p = useIn(0, 16);
  return (
    <div
      style={{
        width: CONTENT_W,
        background: WHITE,
        borderLeft: `16px solid ${RED}`,
        boxSizing: "border-box",
        padding: "22px 28px",
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {rows.map((r, i) => (
        <div
          key={r}
          style={{
            ...enter(useIn(8 + i * 10, 14), 14),
            fontFamily: display,
            fontWeight: 800,
            fontSize,
            lineHeight: 1.12,
            color: i === 0 ? NAVY : "#33486E",
            textWrap: "balance",
          }}
        >
          {r}
        </div>
      ))}
    </div>
  );
};

const Footage: React.FC<{ file: string; pos?: string; dim?: number; from?: number }> = ({
  file,
  pos = "50% 50%",
  dim = 0.8,
  from = 0,
}) => (
  <AbsoluteFill>
    <OffthreadVideo
      src={videoAsset(SLUG, file)}
      muted
      trimBefore={from}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }}
    />
    <AbsoluteFill style={{ background: NAVY, opacity: dim }} />
  </AbsoluteFill>
);

const Logo: React.FC<{ i: number; size: number }> = ({ i, size }) => (
  <Img
    src={videoAsset(SLUG, repo(i).avatar as string)}
    style={{ width: size, height: size, borderRadius: size * 0.2, background: WHITE, flexShrink: 0 }}
  />
);

const CountStars: React.FC<{ i: number; delay: number }> = ({ i, delay }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return <>{Math.round(stars(i) * t).toLocaleString("en-US")}</>;
};

// ---------- a story shot (1/3, 2/3, 3/3) ----------

const Progress: React.FC<{ n: number }> = ({ n }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flex: 1, height: 150, justifyContent: "flex-end" }}>
    {[1, 2, 3].map((k) => (
      <div
        key={k}
        style={{
          width: 40,
          height: k === n ? 150 : 70,
          background: k === n ? RED : "rgba(255,255,255,0.28)",
        }}
      />
    ))}
  </div>
);

const Story: React.FC<{
  n: 1 | 2 | 3;
  name: string;
  split: number;
  slotA: React.ReactNode;
  slotB: React.ReactNode;
  rowsA: string[];
  rowsB: string[];
  bg: React.ReactNode;
  len: number;
}> = ({ n, name, split, slotA, slotB, rowsA, rowsB, bg, len }) => {
  const counter = useIn(4, 18);
  const card = useIn(14, 18);
  const swap = useIn(split, 14);
  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      {bg}
      <Bar top={SAFE.top} />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: CONTENT_W,
          top: SAFE.top + 90,
          height: 1370 - 28 - (SAFE.top + 90),
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", height: 160 }}>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 210,
              lineHeight: 0.8,
              color: WHITE,
              opacity: counter,
              transform: `translateX(${(1 - counter) * -80}px)`,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: RED_LIGHT }}>{n}</span>/3
          </div>
          <Progress n={n} />
        </div>
        <div
          style={{
            background: WHITE,
            display: "flex",
            alignItems: "center",
            gap: 26,
            padding: "20px 24px",
            clipPath: `inset(0 0 ${(1 - card) * 100}% 0)`,
          }}
        >
          <Logo i={n - 1} size={128} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 60, lineHeight: 1, color: NAVY }}>{name}</div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 46, marginTop: 8, color: RED }}>
              <CountStars i={n - 1} delay={14} /> <span style={{ color: "#33486E", fontWeight: 600 }}>sao GitHub</span>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <Sequence from={0} durationInFrames={split} layout="none">
            <div style={{ position: "absolute", inset: 0 }}>{slotA}</div>
          </Sequence>
          <Sequence from={split} durationInFrames={len - split} layout="none">
            <div style={{ position: "absolute", inset: 0, opacity: swap, transform: `translateY(${(1 - swap) * 40}px)` }}>
              {slotB}
            </div>
          </Sequence>
        </div>
        <div>
          <Sequence from={0} durationInFrames={split} layout="none">
            <LowerThird rows={rowsA} />
          </Sequence>
          <Sequence from={split} durationInFrames={len - split} layout="none">
            <LowerThird rows={rowsB} />
          </Sequence>
        </div>
      </div>
      <Ticker />
    </AbsoluteFill>
  );
};

const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string; delay?: number }> = ({
  children,
  size = 110,
  color = WHITE,
  delay = 0,
}) => (
  <div
    style={{
      ...enter(useIn(delay, 16), 30),
      fontFamily: display,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1,
      color,
      textWrap: "balance",
    }}
  >
    {children}
  </div>
);

const Underlined: React.FC<{ children: React.ReactNode; size: number; delay: number }> = ({ children, size, delay }) => {
  const u = useIn(delay + 10, 20);
  return (
    <div style={{ display: "inline-block", paddingBottom: 10, position: "relative" }}>
      <Big size={size} delay={delay}>
        {children}
      </Big>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 10, width: `${u * 100}%`, background: RED }} />
    </div>
  );
};

const TermBox: React.FC<{ id: string; fontSize: number }> = ({ id, fontSize }) => (
  <>
    <Terminal cmds={cmds(id)} fontSize={fontSize} minHeight={0} bg={NAVY_DEEP} accent={RED_LIGHT} />
    <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(cmds(id))} volume={0.25} />
  </>
);

// ---------- shots ----------

const Hook: React.FC = () => {
  const three = useIn(6, 20);
  const cards = [0, 1, 2];
  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      <Footage file="footage/excited-young-man-working-computer-pixabay-3174.mp4" pos="40% 50%" dim={0.82} />
      <Bar top={SAFE.top + BRAND_SPACE} />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: CONTENT_W,
          top: SAFE.top + BRAND_SPACE + 90,
          height: 1370 - 28 - (SAFE.top + BRAND_SPACE + 90),
          display: "flex",
          flexDirection: "column",
          gap: 28,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 400,
              lineHeight: 0.8,
              color: RED_LIGHT,
              opacity: three,
              transform: `scale(${0.85 + three * 0.15})`,
              transformOrigin: "left center",
            }}
          >
            3
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, whiteSpace: "nowrap" }}>
            <Big size={72} delay={10}>dự án</Big>
            <Big size={72} delay={16}>mã nguồn mở</Big>
            <Big size={72} delay={22} color={RED_LIGHT}>tuần này</Big>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {cards.map((i) => {
            const p = useIn(40 + i * 8, 16);
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: WHITE,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 60}px)`,
                }}
              >
                <Logo i={i} size={150} />
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, lineHeight: 1.05, color: NAVY }}>
                  {["DeepSeek Harness", "gpu-unlock", "AIHOT"][i]}
                </div>
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: RED }}>
                  {(stars(i) / 1000).toFixed(1)}k sao
                </div>
              </div>
            );
          })}
        </div>
        <LowerThird rows={lines("s1")} />
      </div>
      <Ticker />
    </AbsoluteFill>
  );
};

const LEN = (a: number, b: number) => (b ?? TOTAL) - a;

const Shot2: React.FC = () => {
  const len = LEN(SHOTS[1], SHOTS[2]);
  return (
    <Story
      n={1}
      name="DeepSeek Harness"
      len={len}
      split={S("s3") - S("s2")}
      bg={
        <AbsoluteFill style={{ opacity: 0.1 }}>
          <Img
            src={videoAsset(SLUG, repo(0).avatar as string)}
            style={{ position: "absolute", width: 1100, right: -420, top: 500 }}
          />
        </AbsoluteFill>
      }
      slotA={
        <div style={{ display: "flex", flexDirection: "column", gap: 24, justifyContent: "center", height: "100%" }}>
          <Underlined size={128} delay={26}>Everything is a plugin</Underlined>
          <Big size={44} color={MUTED} delay={40}>{`${repo(0).license} · ${repo(0).language}`}</Big>
          <Sfx id="pop" at={14} volume={0.3} />
        </div>
      }
      slotB={
        <div style={{ display: "flex", flexDirection: "column", gap: 28, justifyContent: "center", height: "100%" }}>
          <TermBox id="s3" fontSize={44} />
          <Underlined size={104} delay={30}>Không cần restart</Underlined>
          <Sfx id="ding" at={80} volume={0.25} />
        </div>
      }
      rowsA={lines("s2")}
      rowsB={lines("s3")}
    />
  );
};

const Shot3: React.FC = () => {
  const len = LEN(SHOTS[2], SHOTS[3]);
  const a = useIn(22, 24);
  return (
    <Story
      n={2}
      name="gpu-unlock"
      len={len}
      split={S("s5") - S("s4")}
      bg={<Footage file="footage/datacenter-server-racks-glowing-blue-pixabay-171185.mp4" pos="50% 40%" dim={0.84} />}
      slotA={
        <div style={{ display: "flex", alignItems: "center", gap: 30, height: "100%" }}>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 440,
              lineHeight: 0.85,
              color: RED_LIGHT,
              opacity: a,
              transform: `translateX(${(1 - a) * -60}px)`,
            }}
          >
            ½
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Big size={74} delay={30}>tốc độ nhân tensor</Big>
            <Big size={74} delay={38} color={MUTED}>FP16 và BF16</Big>
          </div>
          <Sfx id="pop" at={22} volume={0.3} />
        </div>
      }
      slotB={
        <div style={{ display: "flex", flexDirection: "column", gap: 20, justifyContent: "center", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
            <div
              style={{
                fontFamily: display,
                fontWeight: 600,
                fontSize: 80,
                color: MUTED,
                textDecoration: "line-through",
                textDecorationColor: RED,
              }}
            >
              165
            </div>
            <Big size={200} color={WHITE} delay={10}>329</Big>
            <Big size={50} color={MUTED} delay={16}>TFLOPS</Big>
          </div>
          <Big size={56} color={RED_LIGHT} delay={24}>RTX 4090 tăng gấp đôi MMA</Big>
          <TermBox id="s5" fontSize={34} />
          <Sfx id="ding" at={12} volume={0.3} />
        </div>
      }
      rowsA={lines("s4")}
      rowsB={lines("s5")}
    />
  );
};

const STEPS = ["Cào tin đa nguồn", "LLM lọc thô", "Chấm điểm độc lập", "Tóm tắt", "Nhật báo tự xuất bản"];

const Shot4: React.FC = () => {
  const len = LEN(SHOTS[3], SHOTS[4]);
  return (
    <Story
      n={3}
      name="AIHOT"
      len={len}
      split={S("s7") - S("s6")}
      bg={<Footage file="footage/developer-coding-at-desk-night-pixabay-32767.mp4" pos="35% 50%" dim={0.84} from={60} />}
      slotA={
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, height: "100%" }}>
          {[STEPS[0], STEPS[4]].map((t, k) => {
            const p = useIn(24 + k * 30, 16);
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 24, ...enter(p, 30) }}>
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 70, color: RED_LIGHT, width: 60 }}>{k + 1}</div>
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 62, color: WHITE, lineHeight: 1.05, whiteSpace: "nowrap" }}>{t}</div>
              </div>
            );
          })}
          <div style={{ height: 8, background: RED, width: `${useIn(40, 40) * 100}%`, marginTop: 8 }} />
          <Sfx id="pop" at={24} volume={0.3} />
          <Sfx id="pop" at={54} volume={0.3} />
        </div>
      }
      slotB={
        <div style={{ display: "flex", flexDirection: "column", gap: 24, justifyContent: "center", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <Big size={260} color={RED_LIGHT} delay={6}>2×</Big>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Big size={70} delay={14}>chấm điểm</Big>
              <Big size={70} delay={20} color={MUTED}>độc lập</Big>
            </div>
          </div>
          <TermBox id="s7" fontSize={34} />
          <Sfx id="ding" at={8} volume={0.3} />
        </div>
      }
      rowsA={lines("s6")}
      rowsB={lines("s7")}
    />
  );
};

const Outro: React.FC = () => {
  const names = ["DeepSeek Harness", "gpu-unlock", "AIHOT"];
  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      <Bar top={SAFE.top} />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: CONTENT_W,
          top: SAFE.top + 90,
          height: 1370 - 28 - (SAFE.top + 90),
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: CONTENT_W }}><Big size={104} delay={4}>Anh em sẽ thử dự án nào?</Big></div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {names.map((nm, i) => {
            const p = useIn(26 + i * 12, 16);
            return (
              <div
                key={nm}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  padding: "22px 0",
                  borderTop: "4px solid rgba(255,255,255,0.25)",
                  opacity: p,
                  transform: `translateX(${(1 - p) * -60}px)`,
                }}
              >
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 130, lineHeight: 0.8, color: RED_LIGHT, width: 110 }}>
                  {i + 1}
                </div>
                <Logo i={i} size={110} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: display, fontWeight: 800, fontSize: 56, lineHeight: 1, color: WHITE }}>{nm}</div>
                  <div style={{ fontFamily: display, fontWeight: 600, fontSize: 40, color: MUTED, marginTop: 6 }}>
                    {stars(i).toLocaleString("en-US")} sao
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <LowerThird rows={lines("s8")} />
      </div>
      <Ticker />
      <Sfx id="pop" at={26} volume={0.25} />
      <Sfx id="pop" at={38} volume={0.25} />
      <Sfx id="pop" at={50} volume={0.25} />
    </AbsoluteFill>
  );
};

// ---------- wipes between stories ----------

const WIPE = 20;
const Wipe: React.FC<{ label?: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, WIPE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
  });
  const x = -110 + t * 220;
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}%)` }}>
      <AbsoluteFill style={{ background: RED }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 48, background: WHITE }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {label && (
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 420, color: WHITE, lineHeight: 1 }}>{label}</div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const WIPE_LABELS = ["1/3", "2/3", "3/3", undefined];

// ---------- video ----------

const IDS = script.scenes.map((s) => s.id as SceneId);
const VOICE_RANGES: [number, number][] = IDS.map((id) => [S(id), S(id) + Math.round((durations as Record<string, number>)[id] * FPS)]);

const Component: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ fontFamily: sans, background: NAVY }}>
    <Sequence from={SHOTS[0]} durationInFrames={LEN(SHOTS[0], SHOTS[1])} name="Hook">
      <Hook />
      <Brand />
      <Sfx id="thud" volume={0.5} />
    </Sequence>
    <Sequence from={SHOTS[1]} durationInFrames={LEN(SHOTS[1], SHOTS[2])} name="1/3 DeepSeek Harness">
      <Shot2 />
    </Sequence>
    <Sequence from={SHOTS[2]} durationInFrames={LEN(SHOTS[2], SHOTS[3])} name="2/3 gpu-unlock">
      <Shot3 />
    </Sequence>
    <Sequence from={SHOTS[3]} durationInFrames={LEN(SHOTS[3], SHOTS[4])} name="3/3 AIHOT">
      <Shot4 />
    </Sequence>
    <Sequence from={SHOTS[4]} durationInFrames={LEN(SHOTS[4], TOTAL)} name="Outro">
      <Outro />
    </Sequence>
    {SHOTS.slice(1).map((b, i) => (
      <Sequence key={b} from={b - WIPE / 2} durationInFrames={WIPE} name={`wipe ${i + 1}`}>
        <Wipe label={WIPE_LABELS[i]} />
        <Sfx id="whoosh" volume={0.35} />
      </Sequence>
    ))}
    {IDS.map((id) => (
      <Sequence key={id} from={S(id)} layout="none" name={`voice ${id}`}>
        <Voice slug={SLUG} id={id} />
      </Sequence>
    ))}
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = { id: SLUG, component: Component, durationInFrames: TOTAL };
