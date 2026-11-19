import { siEmby, siPlex, siQbittorrent } from "simple-icons";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { display, enter, mono, sans, Terminal, useIn } from "../../../kit";
import {
  AccentTitle,
  Avatar,
  BoxedLine,
  FootageCard,
  FullFootage,
  LabelBox,
  LiveCaption,
  PaperGround,
  Pill,
  SceneLayer,
  TierBoard,
  type Phrase,
  type TierItem,
} from "../parts";
import { C, SL, SW, serif } from "../palette";

const TIER_ITEMS: TierItem[] = [
  { tier: "F", name: "6 app *arr", start: 22, wide: true },
  { tier: "S", name: "Plex", icon: siPlex, start: 70 },
  { tier: "S", name: "Jellyfin", avatar: "repos/jellyfin.png", start: 118 },
  { tier: "S", name: "Emby", icon: siEmby, start: 166 },
  { tier: "A", name: "qBittorrent", icon: siQbittorrent, start: 330 },
  { tier: "A", name: "SABnzbd", start: 372 },
];

const S4_PHRASES: Phrase[] = [
  { t: "Không phát phim" },
  { t: "đẩy sang Plex" },
  { t: "Jellyfin" },
  { t: "Emby" },
  { t: "vẫn nhờ app cũ" },
];

const RankTitle: React.FC<{ lines: string[] }> = ({ lines }) => {
  const p = useIn(2, 14);
  return (
    <div
      style={{
        ...enter(p, 26),
        position: "absolute",
        top: 266,
        left: SL,
        width: SW,
        textAlign: "center",
      }}
    >
      {lines.map((l) => (
        <div key={l} style={{ display: "block", textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              transform: "skewX(-8deg)",
              fontFamily: display,
              fontWeight: 800,
              fontSize: 94,
              lineHeight: 0.98,
              color: "#FFB547",
              WebkitTextStroke: "4px rgba(0,0,0,0.34)",
              paintOrder: "stroke fill",
              textShadow: "0 8px 24px rgba(0,0,0,0.45)",
            }}
          >
            {l}
          </span>
        </div>
      ))}
    </div>
  );
};

// s4 — ranking list: what still has to stay once HolyArrs is in.
export const StillNeed: React.FC<{ len: number; voice: number }> = ({ voice }) => {
  const sub = useIn(22, 14);
  const legend = useIn(30, 14);
  return (
    <AbsoluteFill>
      <FullFootage
        file="footage/couple-watching-tv-pixabay-245932.mp4"
        objectPosition="50% 40%"
        dim={0.48}
        rate={0.87}
      />
      <RankTitle lines={["KHÔNG THAY", "PHẦN PHÁT"]} />
      <div
        style={{
          ...enter(sub, 18),
          position: "absolute",
          top: 500,
          left: SL,
          width: SW,
          textAlign: "center",
          fontFamily: display,
          fontWeight: 700,
          fontSize: 38,
          lineHeight: 1.2,
          color: C.white,
          textShadow: "0 3px 14px rgba(0,0,0,0.7)",
        }}
      >
        <div>
          Đẩy thư viện <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 600 }}>sang</span>
        </div>
        <div>Plex · Jellyfin · Emby</div>
      </div>

      <TierBoard items={TIER_ITEMS} y={690} />

      <div
        style={{
          ...enter(legend, 12),
          position: "absolute",
          top: 1176,
          left: 148,
          width: 688,
          boxSizing: "border-box",
          padding: "12px 18px",
          borderRadius: 14,
          background: "rgba(14,14,16,0.9)",
          border: "2px solid rgba(255,255,255,0.18)",
          textAlign: "center",
          fontFamily: display,
          fontWeight: 700,
          fontSize: 38,
          lineHeight: 1.12,
          color: C.white,
          whiteSpace: "nowrap",
        }}
      >
        S giữ · A cần · F HolyArrs thay
      </div>

      <LiveCaption phrases={S4_PHRASES} totalFrames={voice} y={1300} size={62} />
    </AbsoluteFill>
  );
};

const S5_PHRASES: Phrase[] = [
  { t: "một file compose" },
  { t: "image holyarrs" },
  { t: "port 6262" },
  { t: "một lệnh là lên" },
];

// s5 — split screen: compose file and terminal on paper, a coder clip below.
export const ComposeInstall: React.FC<{ len: number; voice: number }> = ({ voice }) => {
  const frame = useCurrentFrame();
  const pop = Math.min(1, frame / 12);
  return (
    <AbsoluteFill>
      <SceneLayer>
        <PaperGround style={{ height: 1000 }} />
      </SceneLayer>

      <div style={{ position: "absolute", top: 280, left: SL, width: SW, textAlign: "center" }}>
        <div style={{ ...enter(useIn(2, 10), 12) }}>
          <Pill label="CÀI ĐẶT" />
        </div>
        <div style={{ marginTop: 16 }}>
          <AccentTitle before="Một file," accent="một" after="port" size={76} />
        </div>
      </div>

      <div
        style={{
          ...enter(useIn(14, 14), 22),
          position: "absolute",
          top: 500,
          left: 120,
          width: 840,
          boxSizing: "border-box",
          background: C.ink2,
          borderRadius: 20,
          padding: "22px 28px",
          fontFamily: mono,
          fontSize: 36,
          lineHeight: 1.5,
          color: "#F7F2EA",
          whiteSpace: "pre",
        }}
      >
        <div>
          <span style={{ color: C.coralSoft }}>image:</span> holyarrs/holyarrs:latest
        </div>
        <div>
          <span style={{ color: C.coralSoft }}>ports:</span> 6262:6262
        </div>
      </div>

      <div style={{ position: "absolute", top: 690, left: 120, width: 840 }}>
        <Sequence from={240} layout="none">
          <Terminal
            cmds={["docker compose up -d"]}
            width={840}
            fontSize={40}
            minHeight={150}
            bg="#171311"
            fg="#F7F2EA"
            accent={C.coralSoft}
          />
        </Sequence>
      </div>

      <LabelBox text="MỘT LỆNH" top={1000} scale={0.8 + 0.2 * pop} opacity={pop} />

      <FootageCard
        file="footage/developer-coding-pixabay-348042.mp4"
        x={70}
        y={1010}
        w={940}
        h={840}
        objectPosition="50% 32%"
        dim={0.16}
        scrim
      />
      <LiveCaption phrases={S5_PHRASES} totalFrames={voice} y={1240} size={66} />
    </AbsoluteFill>
  );
};

const S6_PHRASES: Phrase[] = [
  { t: "Mở cổng 6262" },
  { t: "tạo owner ngay" },
  { t: "không mật khẩu mặc định" },
  { t: "ai mở trước" },
  { t: "thành owner" },
];

// s6 — two big first-run facts over the phone clip, the owner rule below.
export const OwnerFirst: React.FC<{ len: number; voice: number }> = ({ voice }) => {
  const cardA = useIn(0, 10);
  const cardB = useIn(3, 10);
  const bigB = useIn(8, 12);
  const url = useIn(26, 12);
  return (
    <AbsoluteFill>
      <FullFootage
        file="footage/person-using-smartphone-pixabay-3135.mp4"
        objectPosition="48% 46%"
        dim={0.55}
      />

      <div
        style={{
          position: "absolute",
          top: 296,
          left: SL,
          width: SW,
          display: "flex",
          gap: 25,
        }}
      >
        <div
          style={{
            ...enter(cardA, 18),
            width: 376,
            height: 356,
            boxSizing: "border-box",
            padding: "24px 24px 26px",
            borderRadius: 26,
            background: C.white,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, lineHeight: 1.15, color: C.grey }}>
            Mật khẩu mặc định
          </div>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 126,
              lineHeight: 0.95,
              color: C.ink,
              marginTop: 10,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            0
          </div>
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, lineHeight: 1.2, color: C.coral, marginTop: 10 }}>
            Owner đầu tiên phải tạo liền
          </div>
        </div>
        <div
          style={{
            ...enter(cardB, 18),
            width: 376,
            height: 356,
            boxSizing: "border-box",
            padding: "24px 24px 26px",
            borderRadius: 26,
            background: C.white,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar file="repos/HolyArrs.png" size={72} radius={16} />
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: C.ink }}>HolyArrs</div>
          </div>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 112,
              lineHeight: 0.95,
              color: C.coral,
              marginTop: 16,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            6262
          </div>
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, lineHeight: 1.2, color: C.ink, marginTop: 6 }}>
            mở cổng, tạo owner ngay
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 700, left: SL, width: SW, display: "flex", flexDirection: "column", gap: 10 }}>
        <BoxedLine text="Ai mở trước" start={4} size={74} />
        <div
          style={{
            ...enter(bigB, 24),
            alignSelf: "center",
            background: C.ink,
            color: C.white,
            fontFamily: display,
            fontWeight: 800,
            fontSize: 74,
            lineHeight: 1.16,
            padding: "0.18em 0.4em",
            borderRadius: 14,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          người đó làm{" "}
          <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 600 }}>chủ</span>
        </div>
      </div>

      <div
        style={{
          ...enter(url, 16),
          position: "absolute",
          top: 958,
          left: 190,
          width: 690,
          boxSizing: "border-box",
          background: C.white,
          borderRadius: 14,
          padding: "14px 20px",
          textAlign: "center",
          fontFamily: mono,
          fontSize: 38,
          color: C.ink,
        }}
      >
        http://your-server:6262
      </div>

      <div style={{ position: "absolute", top: 1060, left: 100, width: 780 }}>
        <Sequence from={70} layout="none">
          <Terminal
            cmds={["docker exec -i holyarrs /holyarrs reset-owner"]}
            width={780}
            fontSize={34}
            minHeight={0}
            bg="#171311"
            fg="#F7F2EA"
            accent={C.coralSoft}
          />
        </Sequence>
      </div>

      <LiveCaption phrases={S6_PHRASES} totalFrames={voice} y={1330} size={58} />
    </AbsoluteFill>
  );
};
