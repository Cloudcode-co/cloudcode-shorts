import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Brand, display, easeOut, enter, sans, useIn } from "../../../kit";
import {
  AccentTitle,
  PlainTitle,
  Avatar,
  FootageCard,
  LabelBox,
  LiveCaption,
  PaperGround,
  Pill,
  SceneLayer,
  type Phrase,
} from "../parts";
import { C, SL, SW, clamp, land } from "../palette";

const APPS = ["Sonarr", "Radarr", "Lidarr", "Bazarr", "Prowlarr", "Seerr"];

const DownArrow: React.FC<{ x: number; y1: number; y2: number; at: number }> = ({ x, y1, y2, at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 18], [0, 1], { ...clamp, easing: easeOut });
  const len = y2 - y1;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <path
        d={`M ${x} ${y1} L ${x} ${y2}`}
        stroke={C.coral}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
        opacity={p > 0 ? 1 : 0}
      />
      <path
        d={`M ${x - 18} ${y2 - 22} L ${x} ${y2} L ${x + 18} ${y2 - 22}`}
        fill="none"
        stroke={C.coral}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={p > 0.92 ? Math.min(1, (p - 0.92) * 14) : 0}
      />
    </svg>
  );
};

// s1 — the hook: six app names at 685 MB, one HolyArrs card at 16.1 MB.
export const HookStat: React.FC<{ len: number }> = ({ len }) => {
  const big = useIn(2, 14);
  const sub = useIn(8, 14);
  const card = useIn(26, 16);
  const note = useIn(46, 14);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <PaperGround dark />
      <Brand />
      <div style={{ position: "absolute", top: 334, left: SL, width: SW, textAlign: "center" }}>
        <div
          style={{
            ...enter(big, 28),
            fontFamily: display,
            fontWeight: 800,
            fontSize: 206,
            lineHeight: 0.92,
            letterSpacing: "-0.045em",
            color: C.yellow,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          685 MB
        </div>
        <div
          style={{
            ...enter(sub, 16),
            marginTop: 10,
            fontFamily: display,
            fontWeight: 700,
            fontSize: 42,
            color: C.warmGrey,
          }}
        >
          6 app <span style={{ fontFamily: sans }}>*arr</span> cộng lại
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 640,
          left: 0,
          width: 1080,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 12,
          padding: "0 110px",
          boxSizing: "border-box",
        }}
      >
        {APPS.map((name, i) => {
          const p = useIn(14 + i * 3, 10);
          return (
            <div
              key={name}
              style={{
                ...enter(p, 20),
                width: 232,
                height: 82,
                borderRadius: 14,
                background: "rgba(255,255,255,0.07)",
                border: "2px solid rgba(255,255,255,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: display,
                fontWeight: 700,
                fontSize: 36,
                color: C.white,
              }}
            >
              {name}
            </div>
          );
        })}
      </div>

      <DownArrow x={540} y1={852} y2={944} at={18} />

      <div
        style={{
          position: "absolute",
          top: 958,
          left: 190,
          width: 700,
          height: 172,
          boxSizing: "border-box",
          padding: "22px 28px",
          borderRadius: 26,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          gap: 22,
          ...enter(card, 30),
        }}
      >
        <Avatar file="repos/HolyArrs.png" size={104} radius={22} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: C.ink }}>HolyArrs</div>
          <div style={{ fontFamily: sans, fontSize: 34, color: C.grey }}>đúng phần đó, một container</div>
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 62,
            color: C.coral,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          16.1 MB
        </div>
      </div>

      <div
        style={{
          ...enter(note, 16),
          position: "absolute",
          top: 1160,
          width: "100%",
          textAlign: "center",
          fontFamily: display,
          fontWeight: 700,
          fontSize: 38,
          color: C.greenBright,
        }}
      >
        nhỏ hơn khoảng 43 lần
      </div>
    </AbsoluteFill>
  );
};

const S2_PHRASES: Phrase[] = [
  { t: "Sáu login" },
  { t: "sáu port" },
  { t: "sáu vòng update" },
  { t: "sáu API key" },
  { t: "Show không về" },
  { t: "mở sáu chỗ" },
];

// s2 — split screen: the six-app cost on paper, a person clip under it.
export const SixPlaces: React.FC<{ len: number; voice: number }> = ({ voice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = land(frame, 20, fps);
  const head = useIn(6, 14);
  const table = useIn(22, 16);
  return (
    <AbsoluteFill>
      <SceneLayer>
        <PaperGround style={{ height: 1000 }} />
      </SceneLayer>

      <div style={{ position: "absolute", top: 286, left: SL, width: SW, textAlign: "center" }}>
        <div style={{ ...enter(useIn(2, 10), 12) }}>
          <Pill label="SÁU APP" />
        </div>
        <div style={{ ...enter(head, 18), marginTop: 18 }}>
          <AccentTitle before="Sáu chỗ để" accent="kiểm" after="tra" size={72} />
        </div>
      </div>

      <div
        style={{
          ...enter(table, 18),
          position: "absolute",
          top: 468,
          left: SL,
          width: SW,
          boxSizing: "border-box",
          background: C.white,
          border: `3px solid ${C.ink}`,
          borderRadius: 20,
          padding: "16px 18px 14px",
        }}
      >
        <div style={{ display: "flex", fontFamily: display, fontWeight: 700, fontSize: 34, color: C.grey, paddingBottom: 8 }}>
          <div style={{ width: 158 }} />
          <div style={{ width: 145, textAlign: "center" }}>Login</div>
          <div style={{ width: 145, textAlign: "center" }}>Port</div>
          <div style={{ width: 145, textAlign: "center" }}>Update</div>
          <div style={{ flex: 1, textAlign: "center", whiteSpace: "nowrap" }}>API key</div>
        </div>
        {APPS.map((name, row) => (
          <div
            key={name}
            style={{
              display: "flex",
              alignItems: "center",
              height: 62,
              borderTop: "2px solid #E9E2D8",
            }}
          >
            <div style={{ width: 158, fontFamily: display, fontWeight: 800, fontSize: 35, color: C.ink }}>{name}</div>
            {[0, 1, 2, 3].map((col) => {
              const p = useIn(40 + row * 6 + col * 4, 10);
              return (
                <div key={col} style={{ width: col === 3 ? undefined : 145, flex: col === 3 ? 1 : undefined, textAlign: "center" }}>
                  <div
                    style={{
                      display: "inline-block",
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      background: C.coral,
                      opacity: p,
                      transform: `scale(${0.6 + 0.4 * p})`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <LabelBox text="SÁU CHỖ" top={1000} scale={0.8 + 0.2 * pop} opacity={Math.min(1, pop * 2)} />

      <FootageCard
        file="footage/man-working-at-computer-night-pixabay-215751.mp4"
        x={70}
        y={1010}
        w={940}
        h={840}
        objectPosition="38% 34%"
        dim={0.18}
        scrim
      />
      <LiveCaption phrases={S2_PHRASES} totalFrames={voice} y={1235} size={66} />
    </AbsoluteFill>
  );
};

const FLOW = [
  { label: "Request", sub: "" },
  { label: "Sources", sub: "Torznab, Newznab\nProwlarr, Jackett" },
  { label: "Pick rules", sub: "" },
  { label: "Downloader", sub: "qBittorrent\nSABnzbd, NZBGet" },
  { label: "Library", sub: "" },
];

const S3_PHRASES: Phrase[] = [
  { t: "Gom lại một" },
  { t: "người request" },
  { t: "tìm trong Sources" },
  { t: "chọn theo Pick rules" },
  { t: "qua downloader" },
  { t: "xếp vào Library" },
];

// s3 — explainer: six apps on the left, a coral arrow into one flow card.
export const OneFlow: React.FC<{ len: number; voice: number }> = ({ voice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = useIn(4, 14);
  const left = useIn(16, 14);
  const fill = land(frame, 150, fps);
  return (
    <AbsoluteFill>
      <SceneLayer>
        <PaperGround />
      </SceneLayer>

      <div style={{ position: "absolute", top: 286, left: SL, width: SW, textAlign: "center", ...enter(title, 20) }}>
        <PlainTitle size={80}>Tìm, tải,</PlainTitle>
        <AccentTitle before="" accent="xếp" after="thư viện" size={80} />
      </div>

      <div
        style={{
          ...enter(left, 22),
          position: "absolute",
          top: 512,
          left: 103,
          width: 340,
          height: 496,
          boxSizing: "border-box",
          background: C.white,
          border: `3px solid ${C.ink}`,
          borderRadius: 18,
          padding: "18px 16px",
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignContent: "flex-start",
        }}
      >
        {APPS.map((name) => (
          <div
            key={name}
            style={{
              width: "47.5%",
              height: 62,
              borderRadius: 10,
              background: C.paperDim,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: display,
              fontWeight: 800,
              fontSize: 34,
              color: C.ink,
            }}
          >
            {name}
          </div>
        ))}
        <div style={{ width: "100%", marginTop: 8, fontFamily: sans, fontSize: 34, lineHeight: 1.2, color: C.grey, textAlign: "center" }}>
          sáu login, sáu port
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 512,
          left: 540,
          width: 340,
          height: 496,
          boxSizing: "border-box",
          borderRadius: 18,
          border: "3px dashed rgba(20,17,16,0.3)",
          background: "rgba(255,255,255,0.45)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: display,
            fontWeight: 800,
            fontSize: 116,
            color: "rgba(20,17,16,0.22)",
            opacity: Math.max(0, 1 - fill * 2),
          }}
        >
          ?
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 512,
          left: 540,
          width: 340,
          height: 496,
          boxSizing: "border-box",
          borderRadius: 18,
          background: C.ink,
          padding: "18px 20px",
          opacity: frame < 140 ? 0 : Math.min(1, fill * 1.8),
          transform: `scale(${0.86 + 0.14 * Math.min(1, fill)})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 8 }}>
          <Avatar file="repos/HolyArrs.png" size={56} radius={12} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: C.white }}>HolyArrs</div>
        </div>
        {FLOW.map((row, i) => {
          const p = useIn(170 + i * 62, 12);
          return (
            <div key={row.label} style={{ opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, lineHeight: 1.05 }}>
                <span style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: C.coral }}>{i + 1}</span>
                <span style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: C.white }}>{row.label}</span>
              </div>
              {row.sub ? (
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: 34,
                    lineHeight: 1.05,
                    color: C.warmGrey,
                    whiteSpace: "pre-line",
                  }}
                >
                  {row.sub}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {(() => {
          const p = interpolate(frame, [110, 132], [0, 1], { ...clamp, easing: easeOut });
          const len = 120;
          return (
            <path
              d="M 450 770 Q 494 690 534 770"
              fill="none"
              stroke={C.coral}
              strokeWidth={9}
              strokeLinecap="round"
              strokeDasharray={len}
              strokeDashoffset={len * (1 - p)}
              opacity={p > 0 ? 1 : 0}
            />
          );
        })()}
        <path
          d="M 515 754 L 534 770 L 512 783"
          fill="none"
          stroke={C.coral}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={frame > 126 ? 1 : 0}
        />
      </svg>

      <FootageCard
        file="footage/developer-coding-pixabay-348042.mp4"
        x={70}
        y={1040}
        w={940}
        h={800}
        objectPosition="50% 34%"
        dim={0.16}
        scrim
      />
      <LiveCaption phrases={S3_PHRASES} totalFrames={voice} y={1270} size={64} />

      <AbsoluteFill
        style={{
          background: C.white,
          opacity: interpolate(frame, [520, 528, 540], [0, 0.32, 0], clamp),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
