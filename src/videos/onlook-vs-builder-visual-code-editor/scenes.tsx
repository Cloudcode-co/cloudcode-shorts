import type { FC, ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { siApple, siClaudecode, siReact } from "simple-icons";
import {
  BRAND_SPACE,
  Brand,
  CONTENT_W,
  SAFE,
  Sfx,
  display,
  easeOut,
  hit,
  sans,
  snap,
  useIn,
  videoAsset,
} from "../../kit";
import { BUILDER, CLIP, MAP, ONLOOK, scene, SLUG } from "./data";
import {
  ArrowDown,
  Backdrop,
  BookmarkIcon,
  ChapterCard,
  ChatIcon,
  CloudIcon,
  CursorIcon,
  DocIcon,
  Kicker,
  LowerThird,
  MetaLine,
  MonoPath,
  PlusIcon,
  ProjectPanel,
  SceneHead,
  ScreenIcon,
  StarIcon,
} from "./parts";
import { C, fmt } from "./theme";

export type SceneProps = { start: number; len: number };

const onDownbeat = (start: number, local: number) => Math.max(0, snap(MAP.downbeats, start + local) - start);
const onBeat = (start: number, local: number) => Math.max(0, snap(MAP.beats, start + local) - start);

const usePump = (start: number, amount = 1) => {
  const f = useCurrentFrame();
  const g = start + f;
  return amount * (0.013 * hit(MAP.beats, g, 9) + 0.008 * hit(MAP.downbeats, g, 14));
};

const ReactMark: FC<{ at: number }> = ({ at }) => {
  const p = useIn(at, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: 748,
        display: "flex",
        alignItems: "center",
        gap: 26,
        opacity: p,
        transform: `translateX(${(1 - p) * -50}px)`,
      }}
    >
      <div
        style={{
          width: 138,
          height: 138,
          backgroundColor: "rgba(6, 15, 32, 0.88)",
          border: `3px solid ${C.blue}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <svg width={82} height={82} viewBox="0 0 24 24">
          <path d={siReact.path} fill={C.blue} />
        </svg>
      </div>
      <div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 118,
            lineHeight: 0.86,
            letterSpacing: -4,
            color: C.paper,
            textShadow: "0 4px 30px rgba(4, 10, 22, 0.6)",
          }}
        >
          React
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: C.paper, marginTop: 12 }}>
          code thật, sửa trực tiếp
        </div>
      </div>
    </div>
  );
};

/* ================= s1 — opening title card + hook ================= */

export const S1: FC<SceneProps> = ({ start, len }) => {
  const f = useCurrentFrame();
  const pump = usePump(start, 0.4);
  const cut = onBeat(start, 60);
  if (f < cut) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <ChapterCard
          n={1}
          title="ĐIỂM XUẤT PHÁT"
          kicker="BẢN TIN CÔNG NGHỆ"
          clip={CLIP.editor}
          len={len}
          trim={1}
          stats={[scene("s1").lines[0], scene("s1").lines[1]]}
          brandSpace
        />
        <Brand />
        <Sfx id="thud" volume={0.4} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop clip={CLIP.editor} len={len} trim={2} dim={0.62} pos="50% 50%" zoom={[1.05, 1.16]} pump={pump} />
      <Brand />
      <SceneHead
        kicker="BẢN TIN CÔNG NGHỆ"
        headline="Sửa code trực quan không cần CMS?"
        n={1}
        top={SAFE.top + BRAND_SPACE}
        at={cut + 2}
        size={74}
      />
      <ReactMark at={cut + 12} />
      <LowerThird lines={scene("s1").lines} at={cut + 10} top={1082} gap={22} />
      <Sfx id="pop" at={cut + 12} volume={0.25} frames={24} />
    </AbsoluteFill>
  );
};

/* ================= s2 — Builder.io, the old way ================= */

const FlowRow: FC<{ icon: ReactNode; title: string; sub: string; at: number; top: number }> = ({
  icon,
  title,
  sub,
  at,
  top,
}) => {
  const p = useIn(at, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        width: CONTENT_W,
        height: 108,
        backgroundColor: "rgba(7, 17, 35, 0.93)",
        borderLeft: `8px solid ${C.red}`,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 24px",
        boxSizing: "border-box",
        opacity: p,
        transform: `translateX(${(1 - p) * -44}px)`,
      }}
    >
      <div style={{ width: 46, display: "flex", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 46,
            lineHeight: 1,
            letterSpacing: -1,
            color: C.paper,
          }}
        >
          {title}
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.muted, marginTop: 7 }}>{sub}</div>
      </div>
    </div>
  );
};

export const S2: FC<SceneProps> = ({ start, len }) => {
  const f = useCurrentFrame();
  const pump = usePump(start, 0.8);
  const cut = onDownbeat(start, 260);
  if (f < cut) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Backdrop clip={CLIP.cloud} len={len} dim={0.62} pos="50% 50%" zoom={[1.04, 1.13]} pump={pump} />
        <SceneHead kicker="SO SÁNH" headline="Cách tiếp cận của Builder.io" n={1} at={2} />
        <ProjectPanel
          logo={BUILDER.avatar}
          name="Builder.io"
          stars={BUILDER.stars}
          meta={BUILDER.license}
          role="Headless visual CMS"
          at={26}
          top={706}
        />
        <div style={{ position: "absolute", left: SAFE.left, top: 1010, width: CONTENT_W }}>
          <MetaLine at={40} size={38} color={C.paper}>
            Layout lưu trên đám mây
          </MetaLine>
        </div>
        <LowerThird lines={[scene("s2").lines[0]]} at={34} top={1104} />
        <Sfx id="pop" at={26} volume={0.25} frames={24} />
        <Sfx id="ding" at={44} volume={0.22} frames={30} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop clip={CLIP.cloud} len={len} trim={2} dim={0.68} pos="50% 56%" zoom={[1.1, 1.19]} pump={pump} />
      <SceneHead kicker="SO SÁNH" headline="Block nằm trên đám mây" n={1} at={cut + 2} />
      <FlowRow
        icon={<CloudIcon size={40} />}
        title="Blocks"
        sub="danh sách component và options"
        at={cut + 8}
        top={690}
      />
      <div style={{ position: "absolute", left: SAFE.left + 42, top: 798, width: 3, height: 30, backgroundColor: C.red }} />
      <FlowRow
        icon={<ArrowDown size={34} color={C.paper} />}
        title="API / SDK"
        sub="kéo dữ liệu về app"
        at={cut + 16}
        top={828}
      />
      <div style={{ position: "absolute", left: SAFE.left + 42, top: 936, width: 3, height: 30, backgroundColor: C.red }} />
      <FlowRow
        icon={<ScreenIcon size={40} color={C.paper} />}
        title="App render"
        sub="theo danh sách block"
        at={cut + 24}
        top={966}
      />
      <LowerThird lines={[scene("s2").lines[1]]} at={cut + 14} top={1104} />
      <Sfx id="whoosh" at={cut} volume={0.24} frames={30} />
      <Sfx id="pop" at={cut + 8} volume={0.22} frames={24} />
    </AbsoluteFill>
  );
};

/* ================= s3 — chapter 2, Onlook ================= */

export const S3: FC<SceneProps> = ({ start, len }) => {
  const f = useCurrentFrame();
  const pump = usePump(start, 1.1);
  const card = onBeat(start, 66);
  const cut = onDownbeat(start, 260);
  if (f < card) {
    const flash = interpolate(f, [0, 13], [0.55, 0], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <ChapterCard
          n={2}
          title="ONLOOK"
          kicker="HỒ SƠ 02"
          clip={CLIP.devcode}
          len={len}
          logo={ONLOOK.avatar}
          stats={[`${fmt(ONLOOK.stars)} sao GitHub`, "Giấy phép Apache 2.0"]}
        />
        <AbsoluteFill style={{ backgroundColor: C.red, opacity: flash }} />
        <Sfx id="thud" volume={0.5} />
        <Sfx id="ding" at={8} volume={0.26} frames={30} />
      </AbsoluteFill>
    );
  }
  if (f < cut) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Backdrop clip={CLIP.devcode} len={len} trim={1} dim={0.62} pos="50% 42%" zoom={[1.04, 1.14]} pump={pump} />
        <SceneHead kicker="MÃ NGUỒN MỞ" headline="Onlook: desktop mã nguồn mở" n={2} at={card} />
        <div
          style={{
            position: "absolute",
            left: SAFE.left,
            top: 742,
            width: CONTENT_W,
            backgroundColor: "rgba(7, 17, 35, 0.92)",
            borderLeft: `12px solid ${C.red}`,
            padding: "26px 30px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Kicker label="GIẤY PHÉP" at={card + 8} />
          </div>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 112,
              lineHeight: 1,
              letterSpacing: -4,
              color: C.paper,
              marginTop: 12,
            }}
          >
            Apache <span style={{ color: C.red }}>2.0</span>
          </div>
          <MetaLine at={card + 16} size={36}>
            Đọc, fork và tự chỉnh sửa mã nguồn
          </MetaLine>
        </div>
        <LowerThird lines={[scene("s3").lines[0]]} at={card + 12} top={1090} />
        <Sfx id="pop" at={card + 8} volume={0.22} frames={24} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop clip={CLIP.devcode} len={len} trim={4} dim={0.68} pos="50% 58%" zoom={[1.12, 1.2]} pump={pump} />
      <SceneHead kicker="MÃ NGUỒN MỞ" headline="Chạy thẳng trên Git repo" n={2} at={cut + 2} />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 658,
          width: CONTENT_W,
          backgroundColor: "rgba(7, 17, 35, 0.94)",
          borderTop: `6px solid ${C.red}`,
          padding: "28px 30px 30px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width={40} height={40} viewBox="0 0 24 24">
            <path
              d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.5 9.5 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .3.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z"
              fill={C.paper}
            />
          </svg>
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.muted }}>
            Repository trên máy của bạn
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <MonoPath at={cut + 8}>onlook-dev/onlook</MonoPath>
        </div>
        <div style={{ display: "flex", gap: 26, marginTop: 18, alignItems: "center" }}>
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.paper }}>TypeScript</div>
          <div style={{ width: 5, height: 5, backgroundColor: C.red }} />
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.paper }}>Apache-2.0</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: SAFE.left, top: 968, width: CONTENT_W }}>
        <MetaLine at={cut + 16} size={38} color={C.paper}>
          Không mockup, không CMS trung gian
        </MetaLine>
      </div>
      <LowerThird lines={[scene("s3").lines[1]]} at={cut + 12} top={1100} />
      <Sfx id="whoosh" at={cut} volume={0.24} frames={30} />
      <Sfx id="pop" at={cut + 8} volume={0.22} frames={24} />
    </AbsoluteFill>
  );
};

/* ================= s4 — dev server + worktree ================= */

const Pip: FC<{ k: string; v: string; at: number; top: number }> = ({ k, v, at, top }) => {
  const p = useIn(at, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        width: CONTENT_W,
        borderTop: "3px solid rgba(246, 248, 252, 0.35)",
        paddingTop: 18,
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px)`,
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: 84,
          lineHeight: 0.98,
          letterSpacing: -3,
          color: C.paper,
          textShadow: "0 3px 24px rgba(4, 10, 22, 0.65)",
        }}
      >
        {k}
      </div>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, color: C.paper, marginTop: 8 }}>{v}</div>
    </div>
  );
};

const WorkNode: FC<{ label: string; sub: string; at: number; accent?: string }> = ({
  label,
  sub,
  at,
  accent = C.red,
}) => {
  const p = useIn(at, 18);
  return (
    <div
      style={{
        width: 209,
        height: 190,
        backgroundColor: "rgba(7, 17, 35, 0.94)",
        borderTop: `7px solid ${accent}`,
        padding: "20px 18px",
        boxSizing: "border-box",
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: 38,
          lineHeight: 1.05,
          color: C.paper,
          letterSpacing: -1,
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, lineHeight: 1.15, color: C.muted, marginTop: 12 }}>
        {sub}
      </div>
    </div>
  );
};

export const S4: FC<SceneProps> = ({ start, len }) => {
  const f = useCurrentFrame();
  const pump = usePump(start, 1.2);
  const cut = onDownbeat(start, 300);
  if (f < cut) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Backdrop clip={CLIP.code} len={len} trim={1} dim={0.62} pos="50% 46%" zoom={[1.04, 1.15]} pump={pump} />
        <SceneHead kicker="CƠ CHẾ" headline="Chạy dev server và Git worktree" n={2} at={2} size={72} />
        <Pip k="Dev server" v="tự khởi chạy cục bộ" at={34} top={700} />
        <Pip k="Git worktree" v="bản sao an toàn cho thư mục gốc" at={70} top={880} />
        <Sfx id="pop" at={34} volume={0.22} frames={24} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop clip={CLIP.code} len={len} trim={5} dim={0.7} pos="50% 52%" zoom={[1.12, 1.21]} pump={pump} />
      <SceneHead kicker="CƠ CHẾ" headline="Thư mục gốc không bị chạm" n={2} at={cut + 2} size={72} />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 706,
          width: CONTENT_W,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <WorkNode label="GIT REPO" sub="thư mục gốc" at={cut + 6} accent={C.paper} />
        <WorkNode label="WORKTREE" sub="bản sao riêng" at={cut + 14} />
        <WorkNode label="DEV SERVER" sub="app đang chạy" at={cut + 22} />
      </div>
      <svg
        style={{ position: "absolute", left: SAFE.left, top: 780, width: CONTENT_W, height: 30 }}
        viewBox={`0 0 ${CONTENT_W} 30`}
      >
        {[0, 1].map((i) => {
          const x = 209 + i * 284;
          const p = interpolate(f, [cut + 18 + i * 8, cut + 34 + i * 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          });
          return (
            <g key={i} opacity={p}>
              <line x1={x} y1="15" x2={x + 34 * p} y2="15" stroke={C.red} strokeWidth="4" />
              <path d={`M${x + 34 * p} 8 L${x + 46 * p} 15 L${x + 34 * p} 22 Z`} fill={C.red} />
            </g>
          );
        })}
      </svg>
      <LowerThird lines={[scene("s4").lines[1]]} at={cut + 12} top={1112} />
      <Sfx id="whoosh" at={cut} volume={0.24} frames={30} />
      <Sfx id="pop" at={cut + 14} volume={0.22} frames={24} />
    </AbsoluteFill>
  );
};

/* ================= s5 — canvas + inline chat ================= */

const Ripple: FC<{ at: number; left: number; top: number }> = ({ at, left, top }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const d = (f - at) / 34;
  return (
    <>
      {[0, 12].map((delay) => {
        const t = Math.max(0, f - at - delay) / 34;
        if (t <= 0 || t > 1) return null;
        return (
          <div
            key={delay}
            style={{
              position: "absolute",
              left: left - 40,
              top: top - 40,
              width: 80,
              height: 80,
              border: `3px solid ${C.red}`,
              borderRadius: 40,
              scale: 1 + t * 1.6,
              opacity: 0.85 * (1 - t),
            }}
          />
        );
      })}
      <div style={{ position: "absolute", left: left - 23, top: top - 34, opacity: Math.min(1, d * 2) }}>
        <CursorIcon size={46} />
      </div>
    </>
  );
};

export const S5: FC<SceneProps> = ({ start, len }) => {
  const f = useCurrentFrame();
  const pump = usePump(start, 1);
  const cut = onDownbeat(start, 219);
  if (f < cut) {
    const targetX = 470;
    const targetY = 820;
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Backdrop clip={CLIP.devcode} len={len} trim={5} dim={0.66} pos="50% 46%" zoom={[1.12, 1.2]} pump={pump} />
        <SceneHead kicker="TRÊN CANVAS" headline="Sửa phần tử bằng inline chat" n={2} at={2} size={72} />
        <div style={{ position: "absolute", left: SAFE.left, top: 650, width: CONTENT_W }}>
          <Kicker label="APP ĐANG CHẠY" at={18} />
        </div>
        <div
          style={{
            position: "absolute",
            left: SAFE.left,
            top: 706,
            width: CONTENT_W,
            height: 330,
            border: "4px solid rgba(246, 248, 252, 0.92)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 92,
              top: 76,
              width: 330,
              height: 156,
              border: `4px solid ${C.red}`,
              backgroundColor: "rgba(224, 27, 46, 0.08)",
            }}
          />
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: i % 2 === 0 ? 82 : 412,
                top: i < 2 ? 66 : 222,
                width: 20,
                height: 20,
                backgroundColor: C.red,
              }}
            />
          ))}
          <div style={{ position: "absolute", left: 92, top: 250, fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.paper }}>
            phần tử đã chọn
          </div>
          <Ripple at={onBeat(start, 120)} left={targetX - SAFE.left} top={targetY - 706} />
        </div>
        <LowerThird lines={[scene("s5").lines[0]]} at={30} top={1106} />
        <Sfx id="pixel" at={onBeat(start, 120)} volume={0.24} frames={30} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop clip={CLIP.devcode} len={len} trim={2} dim={0.7} pos="50% 58%" zoom={[1.22, 1.3]} pump={pump} />
      <SceneHead kicker="TRÊN CANVAS" headline="Chat ngay trên phần tử" n={2} at={cut + 2} size={72} />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 648,
          width: CONTENT_W,
          backgroundColor: "rgba(7, 17, 35, 0.94)",
          borderLeft: `12px solid ${C.red}`,
          padding: "28px 30px 30px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <ChatIcon size={46} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 62, color: C.paper, letterSpacing: -1 }}>
            Chat nội dòng
          </div>
        </div>
        <div style={{ height: 3, backgroundColor: "rgba(246, 248, 252, 0.28)", margin: "20px 0 18px" }} />
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, lineHeight: 1.3, color: C.paper }}>
          Điều hướng AI sửa đúng phần tử trong code
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 22 }}>
          <div style={{ width: 30, height: 3, backgroundColor: C.red }} />
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.muted }}>
            không rời khỏi canvas
          </div>
        </div>
      </div>
      <LowerThird lines={[scene("s5").lines[1]]} at={cut + 10} top={1100} />
      <Sfx id="whoosh" at={cut} volume={0.24} frames={30} />
      <Sfx id="pop" at={cut + 10} volume={0.22} frames={24} />
    </AbsoluteFill>
  );
};

/* ================= s6 — bring your own agent ================= */

const Provider: FC<{ icon: ReactNode; name: string; note: string; at: number; left: number }> = ({
  icon,
  name,
  note,
  at,
  left,
}) => {
  const p = useIn(at, 18);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: 670,
        width: 348,
        height: 240,
        backgroundColor: "rgba(7, 17, 35, 0.93)",
        borderTop: `6px solid ${C.red}`,
        padding: "24px 24px",
        boxSizing: "border-box",
        opacity: p,
        transform: `translateY(${(1 - p) * 28}px)`,
      }}
    >
      <div style={{ height: 64, display: "flex", alignItems: "center" }}>{icon}</div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: 36,
          lineHeight: 1.04,
          color: C.paper,
          marginTop: 16,
          letterSpacing: -1,
        }}
      >
        {name}
      </div>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.muted, marginTop: 8 }}>{note}</div>
    </div>
  );
};

const PipeRow: FC<{ n: string; k: string; v: string; at: number; top: number }> = ({ n, k, v, at, top }) => {
  const p = useIn(at, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        width: CONTENT_W,
        height: 108,
        display: "flex",
        alignItems: "center",
        gap: 22,
        borderBottom: "3px solid rgba(246, 248, 252, 0.25)",
        opacity: p,
        transform: `translateX(${(1 - p) * 36}px)`,
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: 62,
          color: C.red,
          width: 92,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {n}
      </div>
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 48, lineHeight: 1, color: C.paper, letterSpacing: -1 }}>
          {k}
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.muted, marginTop: 8 }}>{v}</div>
      </div>
    </div>
  );
};

export const S6: FC<SceneProps> = ({ start, len }) => {
  const f = useCurrentFrame();
  const pump = usePump(start, 1.1);
  const cut = onDownbeat(start, 249);
  if (f < cut) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Backdrop clip={CLIP.brain} len={len} trim={0} dim={0.6} pos="50% 42%" zoom={[1.03, 1.12]} pump={pump} />
        <SceneHead kicker="AGENT" headline="Cơ chế Bring Your Own Agent" n={2} at={2} size={72} />
        <Provider
          icon={
            <svg width={62} height={62} viewBox="0 0 24 24">
              <path d={siClaudecode.path} fill={C.paper} />
            </svg>
          }
          name="Claude Code"
          note="tài khoản có sẵn"
          at={28}
          left={SAFE.left}
        />
        <Provider
          icon={<ChatIcon size={58} />}
          name="ChatGPT / Codex"
          note="tài khoản có sẵn"
          at={44}
          left={SAFE.left + 379}
        />
        <div style={{ position: "absolute", left: SAFE.left, top: 946, width: CONTENT_W }}>
          <MetaLine at={64} size={42} color={C.paper}>
            Không kèm model riêng
          </MetaLine>
          <MetaLine at={72} size={35}>
            Agent của bạn làm việc trong dự án
          </MetaLine>
        </div>
        <LowerThird lines={[scene("s6").lines[0]]} at={58} top={1100} />
        <Sfx id="pop" at={28} volume={0.22} frames={24} />
        <Sfx id="pop" at={44} volume={0.22} frames={24} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop clip={CLIP.brain} len={len} trim={2} dim={0.7} pos="50% 58%" zoom={[1.12, 1.2]} pump={pump} />
      <SceneHead kicker="QUY TRÌNH" headline="Tài khoản AI sửa file trong repo" n={2} at={cut + 2} size={70} />
      <PipeRow n="01" k="TÀI KHOẢN AI" v="Claude Code hoặc ChatGPT / Codex" at={cut + 10} top={700} />
      <PipeRow n="02" k="ONLOOK" v="gửi yêu cầu vào đúng dự án" at={cut + 18} top={826} />
      <PipeRow n="03" k="FILE TRONG REPO" v="agent sửa code thật" at={cut + 26} top={952} />
      <LowerThird lines={[scene("s6").lines[1]]} at={cut + 14} top={1090} />
      <Sfx id="whoosh" at={cut} volume={0.24} frames={30} />
      <Sfx id="pop" at={cut + 10} volume={0.22} frames={24} />
    </AbsoluteFill>
  );
};

/* ================= s7 — MCP context ================= */

const CtxRow: FC<{ n: string; k: string; at: number }> = ({ n, k, at }) => {
  const p = useIn(at, 16);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        height: 96,
        borderBottom: "3px solid rgba(246, 248, 252, 0.28)",
        opacity: p,
        transform: `translateX(${(1 - p) * -34}px)`,
      }}
    >
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 54, color: C.red, width: 76 }}>{n}</div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 52, color: C.paper, letterSpacing: -1 }}>{k}</div>
    </div>
  );
};

export const S7: FC<SceneProps> = ({ start, len }) => {
  const f = useCurrentFrame();
  const pump = usePump(start, 0.9);
  const cut = onDownbeat(start, 275);
  const line = interpolate(f, [24, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  if (f < cut) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Backdrop clip={CLIP.rack} len={len} trim={1} dim={0.64} pos="50% 40%" zoom={[1.04, 1.14]} pump={pump} />
        <SceneHead kicker="KẾT NỐI" headline="Mở rộng ngữ cảnh qua MCP" n={2} at={2} size={72} />
        <div style={{ position: "absolute", left: SAFE.left, top: 700, width: CONTENT_W, height: 340 }}>
          <svg width={CONTENT_W} height={340} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1="253" y1="150" x2={253 - 63 * line} y2="150" stroke={C.red} strokeWidth="5" />
            <line x1="473" y1="150" x2={473 + 114 * line} y2="150" stroke={C.red} strokeWidth="5" />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 100,
              width: 190,
              height: 100,
              backgroundColor: "rgba(7, 17, 35, 0.95)",
              borderTop: `5px solid ${C.paper}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              opacity: line,
            }}
          >
            <div
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: 36,
                lineHeight: 1,
                letterSpacing: -1,
                color: C.paper,
                whiteSpace: "nowrap",
              }}
            >
              CÔNG CỤ
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 253,
              top: 70,
              width: 220,
              height: 160,
              backgroundColor: C.navy,
              border: `5px solid ${C.red}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 86, color: C.paper, lineHeight: 1 }}>MCP</div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 587,
              top: 100,
              width: 190,
              height: 100,
              backgroundColor: "rgba(7, 17, 35, 0.95)",
              borderTop: `5px solid ${C.paper}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              opacity: line,
            }}
          >
            <div
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: 36,
                lineHeight: 1,
                letterSpacing: -1,
                color: C.paper,
                whiteSpace: "nowrap",
              }}
            >
              NGỮ CẢNH
            </div>
          </div>
        </div>
        <LowerThird lines={[scene("s7").lines[0]]} at={30} top={1088} />
        <Sfx id="ding" at={36} volume={0.24} frames={30} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop clip={CLIP.rack} len={len} trim={5} dim={0.72} pos="50% 60%" zoom={[1.12, 1.2]} pump={pump} />
      <SceneHead kicker="KẾT NỐI" headline="Cấp đủ ngữ cảnh cho AI" n={2} at={cut + 2} size={72} />
      <div style={{ position: "absolute", left: SAFE.left, top: 760, width: CONTENT_W }}>
        <CtxRow n="01" k="Công cụ bổ sung" at={cut + 10} />
        <CtxRow n="02" k="Ngữ cảnh dự án" at={cut + 18} />
        <CtxRow n="03" k="Quy trình sáng tạo" at={cut + 26} />
      </div>
      <LowerThird lines={[scene("s7").lines[1]]} at={cut + 12} top={1090} />
      <Sfx id="whoosh" at={cut} volume={0.24} frames={30} />
      <Sfx id="pop" at={cut + 10} volume={0.22} frames={24} />
    </AbsoluteFill>
  );
};

/* ================= s8 — export artifacts ================= */

const FormatTile: FC<{ name: string; at: number; topBorder: boolean }> = ({ name, at, topBorder }) => {
  const p = useIn(at, 16);
  return (
    <div
      style={{
        width: "50%",
        display: "flex",
        alignItems: "center",
        gap: 16,
        height: 104,
        borderTop: topBorder ? "2px solid rgba(246, 248, 252, 0.22)" : "none",
        boxSizing: "border-box",
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`,
      }}
    >
      <DocIcon size={40} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 56, color: C.paper, letterSpacing: -1 }}>{name}</div>
    </div>
  );
};

export const S8: FC<SceneProps> = ({ start, len }) => {
  const f = useCurrentFrame();
  const pump = usePump(start, 0.9);
  const cut = onDownbeat(start, 208);
  const formats = ["HTML", "PNG", "JPEG", "PDF"];
  if (f < cut) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Backdrop clip={CLIP.editor} len={len} trim={8} dim={0.62} pos="50% 50%" zoom={[1.02, 1.1]} pump={pump} />
        <SceneHead kicker="XUẤT FILE" headline="Xuất artifact độc lập" n={2} at={2} size={74} />
        <div
          style={{
            position: "absolute",
            left: SAFE.left,
            top: 650,
            width: CONTENT_W,
            backgroundColor: "rgba(7, 17, 35, 0.94)",
            borderTop: `6px solid ${C.red}`,
            padding: "22px 28px 26px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {formats.map((name, i) => (
              <FormatTile key={name} name={name} at={20 + i * 9} topBorder={i > 1} />
            ))}
          </div>
        </div>
        <LowerThird lines={[scene("s8").lines[0]]} at={50} top={1090} />
        <Sfx id="pop" at={20} volume={0.22} frames={24} />
        <Sfx id="pop" at={29} volume={0.2} frames={24} />
        <Sfx id="pop" at={38} volume={0.2} frames={24} />
        <Sfx id="pop" at={47} volume={0.2} frames={24} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop clip={CLIP.editor} len={len} trim={4} dim={0.68} pos="50% 50%" zoom={[1.06, 1.14]} pump={pump} />
      <SceneHead kicker="XUẤT FILE" headline="Một artifact, bàn giao ngay" n={2} at={cut + 2} size={70} />
      <div style={{ position: "absolute", left: SAFE.left, top: 648, width: CONTENT_W }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 160,
            lineHeight: 0.86,
            letterSpacing: -6,
            color: C.red,
            textShadow: "0 4px 30px rgba(4, 10, 22, 0.6)",
          }}
        >
          HTML
        </div>
        <MetaLine at={cut + 10} size={38} color={C.paper}>
          self-contained, gọn một file
        </MetaLine>
        <div
          style={{
            marginTop: 26,
            fontFamily: display,
            fontWeight: 800,
            fontSize: 66,
            letterSpacing: -2,
            color: C.paper,
            lineHeight: 1.1,
          }}
        >
          PDF · PNG · JPEG
        </div>
      </div>
      <LowerThird lines={[scene("s8").lines[1]]} at={cut + 10} top={1090} />
      <Sfx id="whoosh" at={cut} volume={0.24} frames={30} />
      <Sfx id="pop" at={cut + 8} volume={0.22} frames={24} />
    </AbsoluteFill>
  );
};

/* ================= s9 — requirements ================= */

export const S9: FC<SceneProps> = ({ start, len }) => {
  const f = useCurrentFrame();
  const pump = usePump(start, 0.5);
  const card = onDownbeat(start, 100);
  const cut = onDownbeat(start, 230);
  if (f < card) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <ChapterCard
          n={3}
          title="DÙNG THỬ"
          kicker="PHẦN 03"
          clip={CLIP.macbook}
          len={len}
          trim={1}
          stats={["macOS 13 trở lên", "~1 GB ổ đĩa", "Miễn phí sử dụng"]}
        />
        <Sfx id="thud" volume={0.4} />
      </AbsoluteFill>
    );
  }
  if (f < cut) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Backdrop clip={CLIP.macbook} len={len} trim={2} dim={0.62} pos="50% 50%" zoom={[1.04, 1.14]} pump={pump} />
        <SceneHead kicker="CHI PHÍ" headline="Bạn trả bao nhiêu?" n={3} at={card} size={76} />
        <div
          style={{
            position: "absolute",
            left: SAFE.left,
            top: 720,
            width: CONTENT_W,
            fontFamily: display,
            fontWeight: 800,
            fontSize: 132,
            lineHeight: 0.9,
            letterSpacing: -8,
            color: C.red,
            textShadow: "0 6px 34px rgba(4, 10, 22, 0.8)",
          }}
        >
          MIỄN PHÍ
        </div>
        <div style={{ position: "absolute", left: SAFE.left, top: 990, width: CONTENT_W }}>
          <MetaLine at={card + 12} size={40} color={C.paper}>
            Không tính phí riêng cho ứng dụng
          </MetaLine>
        </div>
        <div style={{ position: "absolute", left: SAFE.left, top: 1062, width: CONTENT_W }}>
          <MetaLine at={card + 16} size={36} color={C.paper}>
            Bạn trả chi phí AI cho tài khoản mình dùng
          </MetaLine>
        </div>
        <Sfx id="ding" at={card + 8} volume={0.24} frames={30} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop clip={CLIP.macbook} len={len} trim={6} dim={0.68} pos="50% 50%" zoom={[1.12, 1.2]} pump={pump} />
      <SceneHead kicker="YÊU CẦU" headline="Yêu cầu hệ thống" n={3} at={cut + 2} size={74} />
      <div style={{ position: "absolute", left: SAFE.left, top: 694, width: CONTENT_W }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width={62} height={62} viewBox="0 0 24 24">
            <path d={siApple.path} fill={C.paper} />
          </svg>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 128,
              lineHeight: 0.9,
              letterSpacing: -6,
              color: C.paper,
              textShadow: "0 4px 30px rgba(4, 10, 22, 0.6)",
            }}
          >
            macOS 13+
          </div>
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, color: C.muted, marginTop: 12 }}>
          Apple Silicon hoặc Intel x64
        </div>
        <div style={{ height: 3, backgroundColor: "rgba(246, 248, 252, 0.3)", margin: "28px 0" }} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 118,
              lineHeight: 0.9,
              letterSpacing: -5,
              color: C.red,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ~1 GB
          </div>
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: C.paper }}>dung lượng ổ đĩa</div>
        </div>
      </div>
      <LowerThird lines={[scene("s9").lines[1]]} at={cut + 10} top={1090} />
      <Sfx id="whoosh" at={cut} volume={0.24} frames={30} />
      <Sfx id="pop" at={cut + 8} volume={0.22} frames={24} />
    </AbsoluteFill>
  );
};

/* ================= s10 — sign-off ================= */

export const S10: FC<SceneProps> = ({ start, len }) => {
  const f = useCurrentFrame();
  const pump = usePump(start, 0.4);
  const cut = onDownbeat(start, 255);
  const logoP = useIn(cut + 18, 18);
  if (f < cut) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Backdrop clip={CLIP.smile} len={len} trim={2} dim={0.6} pos="50% 40%" zoom={[1.04, 1.14]} pump={pump} />
        <SceneHead kicker="KẾT" headline="Lưu lại và trải nghiệm" n={3} at={2} size={76} />
        <div style={{ position: "absolute", left: SAFE.left, top: 736, display: "flex", alignItems: "center", gap: 26 }}>
          <BookmarkIcon size={92} color={C.red} />
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 108,
              lineHeight: 0.9,
              letterSpacing: -5,
              color: C.paper,
              textShadow: "0 4px 30px rgba(4, 10, 22, 0.6)",
            }}
          >
            LƯU VIDEO
          </div>
        </div>
        <LowerThird lines={[scene("s10").lines[0]]} at={34} top={1080} />
        <Sfx id="pop" at={30} volume={0.25} frames={24} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop clip={CLIP.smile} len={len} trim={8} dim={0.68} pos="50% 55%" zoom={[1.12, 1.2]} pump={pump} />
      <SceneHead kicker="KẾT" headline="Hẹn gặp lại" n={3} at={cut + 2} size={76} />
      <div style={{ position: "absolute", left: SAFE.left, top: 730, display: "flex", alignItems: "center", gap: 24 }}>
        <PlusIcon size={84} color={C.red} />
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 130,
            lineHeight: 0.9,
            letterSpacing: -5,
            color: C.paper,
            textShadow: "0 4px 30px rgba(4, 10, 22, 0.6)",
          }}
        >
          FOLLOW
        </div>
      </div>
      <div style={{ position: "absolute", left: SAFE.left, top: 894, width: CONTENT_W }}>
        <MetaLine at={cut + 10} size={42} color={C.paper}>
          Video công cụ tiếp theo
        </MetaLine>
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 986,
          width: CONTENT_W,
          display: "flex",
          alignItems: "center",
          gap: 22,
          opacity: logoP,
        }}
      >
        <div style={{ width: 96, height: 96, backgroundColor: "#000", flexShrink: 0 }}>
          <Img
            src={videoAsset(SLUG, ONLOOK.avatar)}
            style={{ width: 96, height: 96, objectFit: "cover", display: "block" }}
          />
        </div>
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 48, lineHeight: 1, color: C.paper }}>Onlook</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.muted, marginTop: 8 }}>
            <StarIcon size={26} />
            {fmt(ONLOOK.stars)} sao GitHub
          </div>
        </div>
      </div>
      <LowerThird lines={[scene("s10").lines[1]]} at={cut + 10} top={1120} />
      <Sfx id="whoosh" at={cut} volume={0.24} frames={30} />
      <Sfx id="pop" at={cut + 10} volume={0.22} frames={24} />
    </AbsoluteFill>
  );
};

