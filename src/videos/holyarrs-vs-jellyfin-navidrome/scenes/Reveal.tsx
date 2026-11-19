import { siEmby, siPlex } from "simple-icons";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { display, enter, mono, sans, useIn } from "../../../kit";
import {
  AccentTitle,
  ArrowArc,
  Avatar,
  Counter,
  FootageCard,
  FullFootage,
  LiveCaption,
  PaperGround,
  PlainTitle,
  ProfileCard,
  SceneLayer,
  SiTile,
  type Phrase,
} from "../parts";
import { C, SL, SW, clamp, land } from "../palette";

// s9 — behind the person: the port counter and Jellyfin's profile card.
export const JellyfinPlay: React.FC<{ len: number; voice: number }> = () => {
  const chips = useIn(560, 14);
  return (
    <AbsoluteFill>
      <FullFootage file="footage/cinema-movie-theater-pixabay-320.mp4" objectPosition="50% 50%" dim={0.5} rate={0.84} />

      <div style={{ position: "absolute", top: 256, left: SL, width: SW, textAlign: "center" }}>
        <div style={{ ...enter(useIn(2, 12), 20) }}>
          <PlainTitle size={62} color={C.white}>
            Jellyfin lo phát,
          </PlainTitle>
          <AccentTitle before="HolyArrs lo" accent="tìm" size={62} color={C.white} accentColor={C.coralSoft} />
        </div>
      </div>

      <div
        style={{
          ...enter(useIn(10, 16), 26),
          position: "absolute",
          top: 418,
          left: 103,
          width: SW,
          height: 470,
          boxSizing: "border-box",
          background: "rgba(14,14,16,0.94)",
          borderRadius: 34,
          padding: "16px 26px",
          border: "2px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: 58 }}>
          {["Plex", "Jellyfin", "Emby"].map((t) => (
            <div
              key={t}
              style={{
                fontFamily: display,
                fontWeight: 700,
                fontSize: 34,
                color: t === "Jellyfin" ? C.white : "rgba(255,255,255,0.45)",
                borderBottom: t === "Jellyfin" ? `4px solid ${C.coralSoft}` : "4px solid transparent",
                paddingBottom: 5,
              }}
            >
              {t}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 18 }}>
          <div style={{ width: 150, textAlign: "center" }}>
            <SiTile icon={siPlex} size={150} />
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.white, marginTop: 8 }}>Plex</div>
          </div>
          <div style={{ width: 150, textAlign: "center" }}>
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: 32,
                background: "#0B1230",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar file="repos/jellyfin.png" size={124} radius={18} bg="#0B1230" />
            </div>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.white, marginTop: 8 }}>Jellyfin</div>
          </div>
          <div style={{ width: 150, textAlign: "center" }}>
            <SiTile icon={siEmby} size={150} />
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.white, marginTop: 8 }}>Emby</div>
          </div>
        </div>
        <div style={{ marginTop: 16, textAlign: "center", fontFamily: display, fontWeight: 700, fontSize: 36, color: C.white }}>
          Media server · không có bản premium
        </div>
        <div style={{ marginTop: 6, textAlign: "center", fontFamily: sans, fontSize: 34, color: C.warmGrey }}>
          Phát phim, show tới TV và điện thoại
        </div>
      </div>

      <Counter value={8096} start={70} y={944} size={140} label="PORT MẶC ĐỊNH" group={false} />

      <ProfileCard
        avatar="repos/jellyfin.png"
        name="Jellyfin"
        sub="59,543 sao GitHub"
        pill="Không premium"
        pillBg={C.green}
        start={200}
        y={1178}
        width={777}
        x={103}
      />

      <div
        style={{
          ...enter(chips, 20),
          position: "absolute",
          top: 1352,
          left: SL,
          width: SW,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {["Jellyfin :8096", "HolyArrs :6262"].map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {i === 1 ? <span style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: C.white }}>+</span> : null}
            <div
              style={{
                background: C.white,
                color: C.ink,
                fontFamily: mono,
                fontSize: 34,
                padding: "8px 16px",
                borderRadius: 10,
                whiteSpace: "nowrap",
              }}
            >
              {t}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const S10_PHRASES: Phrase[] = [
  { t: "Navidrome từ 2016" },
  { t: "thư viện lớn" },
  { t: "client Subsonic" },
  { t: "transcode từng user" },
  { t: "HolyArrs: vẫn đang xây" },
];

// s10 — explainer: Navidrome on the left, the still-empty HolyArrs music slot.
export const MusicGap: React.FC<{ len: number; voice: number }> = ({ voice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fill = land(frame, 400, fps);
  return (
    <AbsoluteFill>
      <SceneLayer>
        <PaperGround />
      </SceneLayer>

      <div style={{ position: "absolute", top: 258, left: SL, width: SW, textAlign: "center" }}>
        <div style={{ ...enter(useIn(2, 12), 20) }}>
          <AccentTitle before="Nhạc vẫn" accent="đang" after="xây" size={78} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 456,
          left: 103,
          width: 340,
          textAlign: "center",
          fontFamily: display,
          fontWeight: 800,
          fontSize: 36,
          color: C.ink,
        }}
      >
        Navidrome
      </div>
      <div
        style={{
          position: "absolute",
          top: 456,
          left: 540,
          width: 340,
          textAlign: "center",
          fontFamily: display,
          fontWeight: 800,
          fontSize: 36,
          color: C.ink,
        }}
      >
        HolyArrs
      </div>

      <div
        style={{
          ...enter(useIn(12, 14), 22),
          position: "absolute",
          top: 508,
          left: 103,
          width: 340,
          height: 480,
          boxSizing: "border-box",
          background: C.white,
          border: `3px solid ${C.ink}`,
          borderRadius: 20,
          padding: "22px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar file="repos/navidrome.png" size={82} radius={18} />
          <div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 38, color: C.ink }}>Navidrome</div>
            <div style={{ fontFamily: sans, fontSize: 34, color: C.grey }}>từ 2016</div>
          </div>
        </div>
        <div style={{ marginTop: 10, fontFamily: display, fontWeight: 700, fontSize: 36, color: C.green }}>
          24,851 sao GitHub
        </div>
        {["Thư viện lớn", "Client Subsonic", "Transcode từng user"].map((t, i) => (
          <div key={t} style={{ display: "flex", gap: 10, marginTop: i === 0 ? 18 : 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: C.navidrome, marginTop: 12, flexShrink: 0 }} />
            <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 35, lineHeight: 1.2, color: C.ink }}>{t}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: 508,
          left: 540,
          width: 340,
          height: 480,
          boxSizing: "border-box",
          border: "3px dashed rgba(20,17,16,0.3)",
          borderRadius: 20,
          background: "rgba(255,255,255,0.42)",
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
            fontSize: 124,
            color: "rgba(20,17,16,0.34)",
            opacity: Math.max(0, 1 - fill * 2),
          }}
        >
          ?
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 508,
          left: 540,
          width: 340,
          height: 480,
          boxSizing: "border-box",
          background: C.white,
          border: `3px dashed ${C.coral}`,
          borderRadius: 20,
          padding: "24px 20px",
          overflow: "hidden",
          opacity: frame < 390 ? 0 : Math.min(1, fill * 1.8),
          transform: `scale(${0.86 + 0.14 * Math.min(1, fill)})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar file="repos/HolyArrs.png" size={68} radius={14} />
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: C.ink }}>HolyArrs</div>
        </div>
        <div style={{ marginTop: 18, fontFamily: sans, fontSize: 34, lineHeight: 1.2, color: C.ink }}>Music in Explore</div>
        <div style={{ marginTop: 8, fontFamily: display, fontWeight: 800, fontSize: 54, color: C.coral }}>đang xây</div>
        <div style={{ marginTop: 8, fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.grey }}>chưa gộp được</div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 18,
            background: "repeating-linear-gradient(45deg, #D2352A 0 12px, #F2EEE7 12px 24px)",
          }}
        />
      </div>

      <ArrowArc x1={450} y1={760} x2={532} y2={760} start={352} dur={18} />

      <FootageCard
        file="footage/music-headphones-pixabay-161062.mp4"
        x={70}
        y={1040}
        w={940}
        h={800}
        objectPosition="50% 26%" rate={0.8}
        dim={0.14}
        scrim
      />
      <LiveCaption phrases={S10_PHRASES} totalFrames={voice} y={1270} size={62} />
    </AbsoluteFill>
  );
};

const S11_PHRASES: Phrase[] = [
  { t: "repo tạo 2026-11-09" },
  { t: "bản 1.2.0" },
  { t: "ra 2026-11-17" },
  { t: "import chỉ đọc" },
  { t: "undo được" },
  { t: "formats, tags" },
  { t: "history không sang" },
];

const Row: React.FC<{ ok: boolean; title: string; sub?: string; start: number }> = ({ ok, title, sub, start }) => {
  const p = useIn(start, 14);
  return (
    <div
      style={{
        ...enter(p, 18),
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 18px",
        minHeight: 86,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          background: ok ? C.green : C.coral,
          color: C.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: display,
          fontWeight: 800,
          fontSize: 34,
          flexShrink: 0,
        }}
      >
        {ok ? "✓" : "×"}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 37, lineHeight: 1.15, color: C.white }}>{title}</div>
        {sub ? <div style={{ fontFamily: sans, fontSize: 34, color: C.coralSoft }}>{sub}</div> : null}
      </div>
    </div>
  );
};

// s11 — the project's age, and what import does not carry over.
export const FreshProject: React.FC<{ len: number; voice: number }> = ({ voice }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <SceneLayer dur={6}>
        <PaperGround dark />
      </SceneLayer>

      <div style={{ position: "absolute", top: 250, left: SL, width: SW, textAlign: "center" }}>
        <div style={{ ...enter(useIn(2, 12), 20) }}>
          <AccentTitle before="Dự án mới" accent="vài" after="ngày" size={72} color={C.white} accentColor={C.yellow} />
        </div>
      </div>

      <div
        style={{
          ...enter(useIn(14, 14), 24),
          position: "absolute",
          top: 390,
          left: 103,
          width: SW,
          height: 232,
          boxSizing: "border-box",
          background: C.white,
          borderRadius: 22,
          padding: "22px 26px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 38, color: C.ink }}>2026-11-09</div>
            <div style={{ fontFamily: sans, fontSize: 34, color: C.grey }}>repo tạo</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 38, color: C.ink }}>2026-11-17</div>
            <div style={{ fontFamily: sans, fontSize: 34, color: C.grey }}>bản 1.2.0</div>
          </div>
        </div>
        <svg width={SW - 52} height={44} style={{ display: "block", marginTop: 10 }}>
          <line x1={0} y1={18} x2={SW - 52} y2={18} stroke={C.coral} strokeWidth={4} strokeDasharray="8 8" />
          <circle cx={0} cy={18} r={8} fill={C.coral} />
          <circle cx={SW - 52} cy={18} r={8} fill={C.coral} />
        </svg>
        <div style={{ marginTop: 4, fontFamily: sans, fontSize: 34, color: C.coral }}>
          1.2.0: hơn 30 bản sửa lỗi
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 664,
          left: 103,
          width: SW,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 20,
          padding: "6px 0",
        }}
      >
        <Row ok title="Import: chỉ đọc app cũ" start={320} />
        <Row ok title="Undo được" start={450} />
        <Row ok={false} title="Custom formats, tags, history" sub="không đi theo" start={440} />
      </div>

      <FootageCard
        file="footage/man-working-at-computer-night-pixabay-215751.mp4"
        x={70}
        y={1100}
        w={940}
        h={720}
        objectPosition="34% 34%"
        dim={0.3}
        scrim
      />
      <LiveCaption phrases={S11_PHRASES} totalFrames={voice} y={1284} size={58} />

      <AbsoluteFill
        style={{
          background: C.white,
          opacity: interpolate(frame, [0, 4, 12], [0.28, 0.22, 0], clamp),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

const S12_PHRASES: Phrase[] = [
  { t: "low-memory tự bật" },
  { t: "khoảng 2.5 GiB" },
  { t: "HTTP_PROXY bị bỏ qua" },
  { t: "proxy từng Source" },
];

// s12 — the small-VPS threshold and the proxy gotcha.
export const SmallVps: React.FC<{ len: number; voice: number }> = ({ voice }) => (
  <AbsoluteFill>
    <FullFootage file="footage/server-room-pixabay-345428.mp4" objectPosition="50% 58%" dim={0.58} rate={0.8} />

    <div style={{ position: "absolute", top: 246, left: SL, width: SW, textAlign: "center" }}>
      <div style={{ ...enter(useIn(2, 12), 20) }}>
        <PlainTitle size={66} color={C.white}>
          VPS nhỏ:
        </PlainTitle>
        <AccentTitle before="mốc" accent="2.5" after="GiB RAM" size={66} color={C.white} accentColor={C.yellow} />
      </div>
    </div>

    <Counter value={2.5} start={40} y={404} size={168} decimals={1} label="NGƯỠNG LOW-MEMORY" unit="GiB" />

    <div
      style={{
        ...enter(useIn(110, 14), 16),
        position: "absolute",
        top: 646,
        left: SL,
        width: SW,
        textAlign: "center",
        fontFamily: display,
        fontWeight: 700,
        fontSize: 37,
        lineHeight: 1.2,
        color: C.white,
        textShadow: "0 3px 14px rgba(0,0,0,0.7)",
      }}
    >
      <div>máy khoảng 2.5 GiB trở xuống</div>
      <div>low-memory tự bật</div>
    </div>

    <div
      style={{
        ...enter(useIn(160, 14), 22),
        position: "absolute",
        top: 776,
        left: 103,
        width: SW,
        boxSizing: "border-box",
        background: "rgba(14,14,16,0.94)",
        border: "2px solid rgba(255,255,255,0.12)",
        borderRadius: 24,
        padding: "18px 24px 20px",
      }}
    >
      <div style={{ display: "flex", gap: 16, fontFamily: mono, fontSize: 34, color: C.coralSoft }}>
        {["HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY"].map((v) => (
          <span key={v} style={{ position: "relative", display: "inline-block" }}>
            {v}
            <span
              style={{
                position: "absolute",
                left: -2,
                right: -2,
                top: "54%",
                height: 4,
                background: C.yellow,
                borderRadius: 2,
              }}
            />
          </span>
        ))}
      </div>
      <div style={{ marginTop: 8, fontFamily: display, fontWeight: 700, fontSize: 36, color: C.white }}>
        bị bỏ qua có chủ đích
      </div>
      <div style={{ marginTop: 8, fontFamily: display, fontWeight: 800, fontSize: 38, color: C.yellow }}>
        set proxy riêng từng Source
      </div>
    </div>

    <ProfileCard
      avatar="repos/HolyArrs.png"
      name="HolyArrs"
      sub="95 MiB RAM idle"
      pill="2.5 GiB"
      pillBg={C.coral}
      start={260}
      y={1042}
      width={740}
      x={103}
    />

    <LiveCaption phrases={S12_PHRASES} totalFrames={voice} y={1290} size={58} />
  </AbsoluteFill>
);
