import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import React from "react";
import {
  AbsoluteFill,
  Img,
  Loop,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { siNvidia } from "simple-icons";
import {
  Brand,
  BRAND_SPACE,
  CONTENT_W,
  FPS,
  Music,
  SAFE,
  Sfx,
  Voice,
  display,
  easeOut,
  sans,
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
const NAVY = "#0B1F4B";
const PANEL = "#15336f";
const DEEP = "#06132f";
const RED = "#E5242B";
const T = 10; // transition frames

const ids = ["s1", "s2", "s3", "s4", "s5"] as const;
const base = ids.map((id) => Math.round(timeline.scenes[id].length * FPS));
const total = base.reduce((a, b) => a + b, 0);
const lens = base.map((n, i) => (i < base.length - 1 ? n + T : n));
const starts = base.map((_, i) => base.slice(0, i).reduce((a, b) => a + b, 0));
const voiceRanges = ids.map((id, i): [number, number] => [
  starts[i],
  starts[i] + Math.round(durations[id] * FPS),
]);

const postman = facts.repos[0];
const stars = postman.stars.toLocaleString("en-US");

const TICKER =
  "Postman 12.33.4 tự cài plugin vào Codex và Claude Code     |     Flipper One: coupon 20 USD giữ giá 379 USD     |     RTX Spark chạy Linux bị khóa xung 780 MHz     |     ";

const asset = (p: string) => videoAsset(SLUG, p);

/* ---------- shared bits ---------- */

const Ticker: React.FC = () => {
  const f = useCurrentFrame();
  const p = useIn(0, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: SAFE.right,
        top: 1360,
        height: 76,
        background: DEEP,
        borderTop: `6px solid ${RED}`,
        overflow: "hidden",
        transform: `translateY(${(1 - p) * 100}px)`,
        fontFamily: display,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          paddingLeft: SAFE.left,
          paddingRight: 28,
          background: DEEP,
          zIndex: 2,
          color: RED,
          fontWeight: 800,
          fontSize: 38,
          whiteSpace: "nowrap",
        }}
      >
        TIN NÓNG
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.left + 260,
          top: 0,
          lineHeight: "70px",
          whiteSpace: "nowrap",
          color: "#fff",
          fontWeight: 600,
          fontSize: 36,
          transform: `translateX(${-f * 3}px)`,
        }}
      >
        {TICKER}
        {TICKER}
      </div>
    </div>
  );
};

const Counter: React.FC<{ n: number; size?: number; delay?: number }> = ({ n, size = 260, delay = 0 }) => {
  const p = useIn(delay, 18);
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.9,
        color: "#fff",
        letterSpacing: -6,
        whiteSpace: "nowrap",
        opacity: p,
        transform: `translateX(${(1 - p) * -160}px)`,
      }}
    >
      {n}
      <span style={{ color: RED }}>/</span>3
    </div>
  );
};

const Star: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 1.8l3 6.9 7.5.7-5.7 5 1.7 7.3L12 17.6 5.5 21.7l1.7-7.3-5.7-5 7.5-.7z" fill={RED} />
  </svg>
);

const NvidiaLogo: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d={siNvidia.path} fill="#fff" />
  </svg>
);

const Logo: React.FC<{ size: number; children: React.ReactNode; bg?: string }> = ({ size, children, bg = PANEL }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.22,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

const PostmanLogo: React.FC<{ size: number }> = ({ size }) => (
  <Logo size={size}>
    <Img src={asset(postman.avatar)} style={{ width: size, height: size, objectFit: "cover" }} />
  </Logo>
);
const FlipperLogo: React.FC<{ size: number }> = ({ size }) => (
  <Logo size={size} bg="#000">
    <Img src={asset("pages/p2-icon.png")} style={{ width: size * 0.8, height: size * 0.8, objectFit: "contain" }} />
  </Logo>
);
const NvLogo: React.FC<{ size: number }> = ({ size }) => (
  <Logo size={size}>
    <NvidiaLogo size={size * 0.62} />
  </Logo>
);

// A lower-third that swaps in place: shows the latest item whose `at` has passed.
const LowerThird: React.FC<{ items: { text: string; at: number }[]; top: number }> = ({ items, top }) => {
  const f = useCurrentFrame();
  const idx = items.reduce((acc, it, i) => (f >= it.at ? i : acc), -1);
  const it = items[idx];
  const p = useIn(it ? it.at : 0, 16);
  if (!it) return null;
  return (
    <div
      key={idx}
      style={{
        position: "absolute",
        left: SAFE.left,
        width: CONTENT_W,
        top,
        minHeight: 130,
        display: "flex",
        alignItems: "center",
        background: "#fff",
        borderLeft: `14px solid ${RED}`,
        padding: "22px 30px",
        boxSizing: "border-box",
        fontFamily: display,
        fontWeight: 800,
        fontSize: 48,
        lineHeight: 1.12,
        color: NAVY,
        textWrap: "balance",
        opacity: p,
        transform: `translateX(${(1 - p) * -90}px)`,
      }}
    >
      {it.text}
      {items.map((x, i) => (
        <Sfx key={i} id="pop" at={x.at} volume={0.25} frames={20} />
      ))}
    </div>
  );
};

const Frame: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = NAVY }) => (
  <AbsoluteFill style={{ background: bg, fontFamily: sans, overflow: "hidden" }}>{children}</AbsoluteFill>
);

const Abs: React.FC<{ top: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  top,
  children,
  style,
}) => (
  <div style={{ position: "absolute", left: SAFE.left, width: CONTENT_W, top, ...style }}>{children}</div>
);

/* ---------- scene 1: the rundown ---------- */

const RundownRow: React.FC<{ n: number; name: string; logo: React.ReactNode; at: number }> = ({
  n,
  name,
  logo,
  at,
}) => {
  const p = useIn(at, 18);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        height: 170,
        padding: "0 28px",
        background: PANEL,
        borderLeft: `12px solid ${RED}`,
        opacity: p,
        transform: `translateX(${(1 - p) * 140}px)`,
      }}
    >
      <Sfx id="whoosh" at={at} volume={0.2} frames={30} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 72, color: "#fff", width: 150, letterSpacing: -2 }}>
        {n}
        <span style={{ color: RED }}>/</span>3
      </div>
      {logo}
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 52, color: "#fff", lineHeight: 1.05 }}>{name}</div>
    </div>
  );
};

const S1: React.FC = () => {
  const p = useIn(4, 20);
  const p2 = useIn(40, 16);
  return (
    <Frame bg={DEEP}>
      <Brand />
      <Abs top={SAFE.top + BRAND_SPACE + 20}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 104,
            lineHeight: 1,
            color: "#fff",
            letterSpacing: -3,
            whiteSpace: "nowrap",
            opacity: p,
            transform: `translateY(${(1 - p) * 50}px)`,
          }}
        >
          Điểm tin sáng<br /><span style={{ color: RED }}>công nghệ</span>
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 48,
            color: "#fff",
            opacity: p2,
            borderBottom: `6px solid ${RED}`,
            display: "inline-block",
            paddingBottom: 8,
          }}
        >
          3 tin nóng sáng nay
        </div>
      </Abs>
      <Abs top={790} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <RundownRow n={1} name="Postman" logo={<PostmanLogo size={116} />} at={140} />
        <RundownRow n={2} name="Flipper One" logo={<FlipperLogo size={116} />} at={250} />
        <RundownRow n={3} name="Nvidia RTX Spark" logo={<NvLogo size={116} />} at={350} />
      </Abs>
      <Ticker />
      <Sfx id="thud" volume={0.4} />
    </Frame>
  );
};

/* ---------- scene 2: Postman ---------- */

const ShotPanel: React.FC<{
  src: string;
  top: number;
  height: number;
  from: number;
  to: number;
  dur: number;
  width?: number;
}> = ({ src, top, height, from, to, dur, width = CONTENT_W }) => {
  const f = useCurrentFrame();
  const y = interpolate(f, [0, dur], [from, to], { extrapolateRight: "clamp", easing: (t) => t });
  const p = useIn(20, 20);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width,
        top,
        height,
        overflow: "hidden",
        borderRadius: 24,
        border: `4px solid #fff`,
        boxSizing: "border-box",
        opacity: p,
        transform: `translateY(${(1 - p) * 60}px)`,
      }}
    >
      <Img src={asset(src)} style={{ position: "absolute", left: 0, top: -y, width }} />
    </div>
  );
};

const S2: React.FC = () => {
  const p = useIn(26, 18);
  return (
    <Frame>
      <Abs top={SAFE.top} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Counter n={1} size={250} />
        <div style={{ opacity: p, transform: `translateX(${(1 - p) * 80}px)`, width: 330 }}>
          <PostmanLogo size={130} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 50, color: "#fff", marginTop: 14 }}>Postman</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: sans, fontWeight: 700, fontSize: 40, color: "#fff" }}>
            <Star size={38} />
            {stars} stars
          </div>
        </div>
      </Abs>
      <ShotPanel src="pages/p1-1.jpg" top={580} height={530} from={340} to={760} dur={lens[1]} />
      <LowerThird
        top={1140}
        items={[
          { text: "Postman 12.33.4 tự sửa config", at: 20 },
          { text: "Cài plugin vào Codex và Claude Code", at: 400 },
          { text: "Dev kiểm tra lại ~/.codex", at: 830 },
        ]}
      />
      <Ticker />
      <Sfx id="whoosh" volume={0.3} frames={30} />
    </Frame>
  );
};

/* ---------- scene 3: Flipper One ---------- */

const S3: React.FC = () => {
  const f = useCurrentFrame();
  const p = useIn(10, 18);
  const pr = useIn(200, 18);
  const pr2 = useIn(330, 18);
  const pan = interpolate(f, [0, lens[2]], [1, 1.1], { extrapolateRight: "clamp" });
  return (
    <Frame>
      <Abs top={SAFE.top} style={{ display: "flex", alignItems: "center", gap: 28, opacity: p, transform: `translateX(${(1 - p) * 80}px)` }}>
        <FlipperLogo size={130} />
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 86, color: "#fff", letterSpacing: -2 }}>Flipper One</div>
      </Abs>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: CONTENT_W,
          top: 420,
          height: 520,
          overflow: "hidden",
          borderRadius: 24,
          border: "4px solid #fff",
          boxSizing: "border-box",
        }}
      >
        <Img
          src={asset("pages/p4-1.jpg")}
          style={{
            position: "absolute",
            left: 0,
            top: -480,
            width: CONTENT_W,
            transform: `scale(${pan})`,
            transformOrigin: "50% 40%",
          }}
        />
      </div>
      <Abs top={970} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <Counter n={2} size={250} delay={6} />
        <div style={{ width: 320, fontFamily: display, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
          <div style={{ opacity: pr, transform: `translateY(${(1 - pr) * 30}px)`, fontSize: 40, color: "#cfd8ee", whiteSpace: "nowrap" }}>
            Coupon 20 USD
          </div>
          <div style={{ opacity: pr2, transform: `translateY(${(1 - pr2) * 40}px)`, fontSize: 104, marginTop: 10 }}>
            <span style={{ color: RED }}>379</span>
            <span style={{ fontSize: 48 }}> USD</span>
          </div>
          <Sfx id="ding" at={330} volume={0.3} frames={30} />
        </div>
      </Abs>
      <LowerThird
        top={1215}
        items={[
          { text: "Flipper One mở đặt trước", at: 20 },
          { text: "Coupon 20 USD giữ giá 379 USD", at: 150 },
          { text: "Chip Rockchip RK3576 8 nhân", at: 560 },
          { text: "Wi-Fi 6E và khe cắm M.2", at: 780 },
        ]}
      />
      <Ticker />
      <Sfx id="whoosh" volume={0.3} frames={30} />
    </Frame>
  );
};

/* ---------- scene 4: Nvidia ---------- */

const Bar: React.FC<{ label: string; value: string; frac: number; at: number; color: string; top: number }> = ({
  label,
  value,
  frac,
  at,
  color,
  top,
}) => {
  const f = useCurrentFrame();
  const grow = interpolate(f, [at, at + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const p = useIn(at, 14);
  return (
    <Abs top={top} style={{ opacity: p }}>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 44, color: "#fff", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: Math.max(8, (CONTENT_W - 260) * frac * grow), height: 84, background: color }} />
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 64, color: "#fff", whiteSpace: "nowrap" }}>{value}</div>
      </div>
      <Sfx id="pop" at={at} volume={0.25} frames={20} />
    </Abs>
  );
};

const S4: React.FC = () => {
  const p = useIn(120, 18);
  const p2 = useIn(20, 16);
  return (
    <Frame bg={DEEP}>
      <AbsoluteFill style={{ opacity: 0.35 }}>
        <Loop durationInFrames={600}>
          <OffthreadVideo
            src={asset("footage/laptop-motherboard-and-gpu-chip-pixabay-267058.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%", filter: "grayscale(1)" }}
          />
        </Loop>
      </AbsoluteFill>
      <Abs top={SAFE.top} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Counter n={3} size={250} />
        <div style={{ width: 330, opacity: p, transform: `scale(${0.9 + p * 0.1})`, transformOrigin: "left center" }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 104, lineHeight: 0.95, color: RED }}>780</div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 56, color: "#fff" }}>MHz</div>
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, color: "#fff" }}>cắm sạc tụt xung</div>
        </div>
      </Abs>
      <Abs top={590} style={{ display: "flex", alignItems: "center", gap: 24, opacity: p2 }}>
        <NvLogo size={110} />
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 62, color: "#fff", lineHeight: 1 }}>Nvidia RTX Spark</div>
      </Abs>
      <Abs top={770}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 48, color: "#fff", opacity: useIn(200, 14) }}>
          GPT-OSS-120B, token mỗi giây
        </div>
      </Abs>
      <Bar label="Linux" value="13.9" frac={13.9 / 65.4} at={390} color={RED} top={860} />
      <Bar label="Windows" value="65.4" frac={1} at={640} color="#fff" top={1040} />
      <LowerThird
        top={1215}
        items={[
          { text: "Nvidia bóp hiệu năng trên Linux", at: 20 },
          { text: "Thiếu driver Platform Controllers", at: 820 },
          { text: "Tạm thời cứ dùng WSL", at: 1020 },
        ]}
      />
      <Ticker />
      <Sfx id="thud" volume={0.45} />
    </Frame>
  );
};

/* ---------- scene 5: question ---------- */

const Option: React.FC<{ n: number; name: string; logo: React.ReactNode; at: number }> = ({ n, name, logo, at }) => {
  const p = useIn(at, 16);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        paddingBottom: 22,
        borderBottom: "4px solid rgba(255,255,255,0.35)",
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 84, color: "#fff", width: 170, letterSpacing: -2 }}>
        {n}
        <span style={{ color: RED }}>/</span>3
      </div>
      {logo}
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 46, color: "#fff", whiteSpace: "nowrap" }}>{name}</div>
    </div>
  );
};

const S5: React.FC = () => {
  const p = useIn(0, 20);
  return (
    <Frame bg={DEEP}>
      <Abs top={SAFE.top}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 126,
            lineHeight: 1,
            color: "#fff",
            letterSpacing: -3,
            textWrap: "balance",
            opacity: p,
            transform: `translateY(${(1 - p) * 50}px)`,
          }}
        >
          Anh em quan tâm tin nào <span style={{ color: RED }}>nhất?</span>
        </div>
      </Abs>
      <Abs top={720} style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        <Option n={1} name="Postman" logo={<PostmanLogo size={96} />} at={50} />
        <Option n={2} name="Flipper One" logo={<FlipperLogo size={96} />} at={80} />
        <Option n={3} name="Nvidia RTX Spark" logo={<NvLogo size={96} />} at={110} />
      </Abs>
      <LowerThird top={1230} items={[{ text: "Bình luận thảo luận bên dưới", at: 120 }, { text: "Follow đón điểm tin sáng mai", at: 190 }]} />
      <Ticker />
      <Sfx id="whoosh" volume={0.3} frames={30} />
    </Frame>
  );
};

/* ---------- assembly ---------- */

const scenes = [S1, S2, S3, S4, S5];

const Comp: React.FC<VideoProps> = ({ guide }) => {
  return (
    <AbsoluteFill style={{ background: DEEP }}>
      <TransitionSeries>
        {scenes.flatMap((S, i) => {
          const parts = [
            <TransitionSeries.Sequence key={ids[i]} durationInFrames={lens[i]} name={ids[i]}>
              <S />
              <Voice slug={SLUG} id={ids[i]} />
            </TransitionSeries.Sequence>,
          ];
          if (i < scenes.length - 1) {
            parts.push(
              <TransitionSeries.Transition
                key={`t${i}`}
                presentation={wipe({ direction: i % 2 === 0 ? "from-left" : "from-right" })}
                timing={linearTiming({ durationInFrames: T })}
              />,
            );
          }
          return parts;
        })}
      </TransitionSeries>
      <Music slug={SLUG} total={total} voiceRanges={voiceRanges} />
      {guide && <TikTokGuideLazy />}
    </AbsoluteFill>
  );
};

import { TikTokGuide as TikTokGuideLazy } from "../../kit";

export const video: VideoDef = {
  id: SLUG,
  component: Comp,
  durationInFrames: total,
};
