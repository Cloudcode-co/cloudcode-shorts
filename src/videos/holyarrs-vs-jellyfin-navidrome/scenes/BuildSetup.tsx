import { AbsoluteFill, Sequence } from "remotion";
import { display, enter, mono, sans, Terminal, useIn } from "../../../kit";
import { AccentTitle, FullFootage, LiveCaption, PaperGround, SceneLayer, type Phrase } from "../parts";
import { C, SL, SW } from "../palette";

const TREE = [
  ["/srv/data", 0],
  ["downloads/", 0],
  ["torrents", 1],
  ["usenet", 1],
  ["media/", 0],
  ["movies · tv", 1],
  ["music", 1],
] as const;

// s7 — explainer: one parent folder hardlinks, separate mounts copy.
export const OneParent: React.FC<{ len: number; voice: number }> = () => {
  const term = useIn(150, 14);
  return (
    <AbsoluteFill>
      <SceneLayer>
        <PaperGround />
      </SceneLayer>

      <div style={{ position: "absolute", top: 264, left: SL, width: SW, textAlign: "center" }}>
        <div style={{ ...enter(useIn(2, 12), 18) }}>
          <AccentTitle before="Một thư mục cha," accent="hardlink" after="tức thì" size={70} />
        </div>
      </div>

      <div
        style={{
          ...enter(useIn(12, 14), 22),
          position: "absolute",
          top: 452,
          left: 103,
          width: 370,
          height: 430,
          boxSizing: "border-box",
          background: C.white,
          border: `3px solid ${C.ink}`,
          borderRadius: 18,
          padding: "20px 22px",
        }}
      >
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 38, color: C.ink, marginBottom: 8 }}>
          Một ổ đĩa
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {TREE.map(([line, depth]) => (
            <div
              key={line}
              style={{
                fontFamily: mono,
                fontWeight: depth === 0 ? 700 : 500,
                fontSize: 34,
                lineHeight: 1.12,
                color: depth === 0 ? C.ink : C.ink3,
                paddingLeft: depth === 0 ? 0 : 18,
              }}
            >
              {line}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontFamily: sans, fontWeight: 700, fontSize: 34, lineHeight: 1.1, color: C.green }}>
          cùng đường dẫn
        </div>
      </div>

      <div
        style={{
          ...enter(useIn(22, 14), 22),
          position: "absolute",
          top: 452,
          left: 507,
          width: 373,
          height: 430,
          boxSizing: "border-box",
          background: C.white,
          border: `3px solid ${C.coral}`,
          borderRadius: 18,
          padding: "20px 22px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 38, color: C.ink }}>Mount rời</div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: C.coral }}>copy</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {["/movies", "/tv", "/music", "/downloads"].map((line) => (
            <div
              key={line}
              style={{
                fontFamily: mono,
                fontSize: 34,
                color: C.ink3,
                border: "2px solid #DCD4C8",
                borderRadius: 8,
                padding: "3px 10px",
              }}
            >
              {line}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontFamily: sans, fontWeight: 700, fontSize: 34, lineHeight: 1.15, color: C.coral }}>
          mỗi import là copy toàn bộ
        </div>
      </div>

      <div style={{ position: "absolute", top: 930, left: 103, width: SW, ...enter(term, 20) }}>
        <Sequence from={170} layout="none">
          <Terminal
            cmds={[
              "mkdir -p /srv/data/downloads/{torrents,usenet} /srv/data/media/{movies,tv,music}",
              "chown -R 1000:1000 /srv/data",
            ]}
            width={SW}
            fontSize={34}
            minHeight={0}
            bg="#171311"
            fg="#F7F2EA"
            accent={C.coralSoft}
          />
        </Sequence>
      </div>

      <div
        style={{
          ...enter(useIn(120, 14), 16),
          position: "absolute",
          top: 1308,
          left: SL,
          width: SW,
          textAlign: "center",
          fontFamily: display,
          fontWeight: 700,
          fontSize: 38,
          color: C.green,
        }}
      >
        Hardlink: không tốn thêm dung lượng
      </div>
    </AbsoluteFill>
  );
};

const S8_PHRASES: Phrase[] = [
  { t: "/config phải local" },
  { t: "không network share" },
  { t: "holyarrs.key" },
  { t: "backup không có" },
  { t: "tải key kit riêng" },
];

// s8 — two cards over a server-room clip: local config, separate key kit.
export const LocalConfig: React.FC<{ len: number; voice: number }> = ({ voice }) => {
  return (
    <AbsoluteFill>
      <FullFootage file="footage/server-room-pixabay-345428.mp4" objectPosition="50% 50%" dim={0.55} rate={0.98} />

      <div style={{ position: "absolute", top: 272, left: SL, width: SW, textAlign: "center" }}>
        <div style={{ ...enter(useIn(2, 14), 22) }}>
          <AccentTitle before="/config local," accent="key" after="kit tải riêng" size={70} color={C.white} accentColor={C.coralSoft} />
        </div>
      </div>

      <div
        style={{
          ...enter(useIn(14, 14), 24),
          position: "absolute",
          top: 442,
          left: 103,
          width: 370,
          height: 410,
          boxSizing: "border-box",
          background: C.white,
          borderRadius: 22,
          padding: "24px 24px",
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 34, lineHeight: 1, color: C.grey }}>CONFIG</div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 54, color: C.ink, marginTop: 22 }}>Ổ local</div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 38, lineHeight: 1.18, color: C.coral, marginTop: 10 }}>
          không dùng network share
        </div>
        <div
          style={{
            marginTop: 22,
            height: 74,
            borderRadius: 12,
            border: `3px solid ${C.ink}`,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 12,
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: 9, background: C.green }} />
          <span style={{ fontFamily: mono, fontSize: 34, color: C.ink }}>local disk</span>
        </div>
      </div>

      <div
        style={{
          ...enter(useIn(24, 14), 24),
          position: "absolute",
          top: 442,
          left: 507,
          width: 357,
          height: 410,
          boxSizing: "border-box",
          background: C.white,
          borderRadius: 22,
          padding: "24px 22px 30px",
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 34, lineHeight: 1, color: C.grey }}>HOLYARRS.KEY</div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, lineHeight: 1.2, color: C.ink, marginTop: 22 }}>
          mở toàn bộ key
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 36,
            lineHeight: 1.4,
            color: C.coral,
            marginTop: 16,
          }}
        >
          backup không gồm file này
        </div>
      </div>

      <div
        style={{
          ...enter(useIn(40, 14), 20),
          position: "absolute",
          top: 880,
          left: 103,
          width: 741,
          boxSizing: "border-box",
          background: C.ink,
          borderRadius: 20,
          padding: "18px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 34, color: C.warmGrey }}>Settings / Backups</div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 42, color: C.yellow }}>Download key kit</div>
      </div>

      <LiveCaption phrases={S8_PHRASES} totalFrames={voice} y={1200} size={62} />
    </AbsoluteFill>
  );
};
