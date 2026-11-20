import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Sfx, Terminal, TYPE_DELAY, typingFrames } from "../../../kit";
import { C, F, SL, SW } from "../palette";
import { at, land } from "../plan";
import { Panel, ProjectCard } from "../parts";

const Headline: React.FC<{ text: string; size?: number; top?: number; p: number }> = ({
  text,
  size = 66,
  top = 372,
  p,
}) => (
  <div
    style={{
      position: "absolute",
      left: SL,
      top,
      width: SW,
      fontFamily: F.sans,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.02,
      letterSpacing: -1.2,
      color: C.white,
      textWrap: "balance",
      opacity: p,
      transform: `translateY(${(1 - p) * 26}px)`,
    }}
  >
    {text}
  </div>
);

// s3 — one Rust binary, two lines of config.
export const Lonewolf: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  const head = land(f, 2, 12);
  const card = at(start, 0.45);
  const binary = at(start, 2.45, "down");
  const toml = at(start, 6.2);
  return (
    <AbsoluteFill>
      <Sfx id="pop" at={card} volume={0.26} />
      <Sfx id="thud" at={binary} volume={0.38} />
      <Sfx id="pop" at={toml} volume={0.24} />
      <Headline text="Đơn giản với Rust" p={head} />
      <ProjectCard
        logo="repos/lonewolf-im.png"
        name="Lonewolf"
        meta="Rust · Apache-2.0"
        count={111}
        at={card}
        y={504}
        h={200}
        size={54}
      />

      <div
        style={{
          position: "absolute",
          left: SL,
          top: 752,
          width: SW,
          height: 250,
          display: "flex",
          alignItems: "center",
          gap: 34,
          opacity: land(f, binary, 13),
          transform: `translateY(${(1 - land(f, binary, 13)) * 26}px)`,
        }}
      >
        <div
          style={{
            fontFamily: F.sans,
            fontWeight: 900,
            fontSize: 250,
            lineHeight: 0.8,
            color: C.red,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          1
        </div>
        <div style={{ paddingTop: 12 }}>
          <div style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 70, lineHeight: 1, color: C.white }}>
            BINARY
          </div>
          <div style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 70, lineHeight: 1, color: C.white, marginTop: 10 }}>
            DUY NHẤT
          </div>
        </div>
      </div>

      <Panel at={toml} y={1052} h={196} style={{ padding: "20px 26px" }}>
        <div style={{ fontFamily: F.mono, fontWeight: 500, fontSize: 34, color: C.dim }}>lonewolf.toml</div>
        <div
          style={{
            marginTop: 12,
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 36,
            lineHeight: 1.35,
            color: C.white,
            whiteSpace: "pre",
          }}
        >
          {"[[c2s.listeners]]\n"}
          {'address = "127.0.0.1:5222"'}
        </div>
      </Panel>
    </AbsoluteFill>
  );
};

// s4 — the embedded store: redb, its stars, and what it guarantees.
export const Redb: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  const head = land(f, at(start, 0.15, "down"), 13);
  const r1 = at(start, 1.9);
  const r2 = at(start, 4.3);
  const r3 = at(start, 6.2);
  const store = at(start, 7.3);
  const rows = [
    { at: r1, text: "Cơ sở dữ liệu nhúng thuần Rust" },
    { at: r2, text: "Copy-on-write B+tree" },
    { at: r3, text: "Đầy đủ giao dịch ACID" },
  ];
  return (
    <AbsoluteFill>
      <Sfx id="pop" at={at(start, 0.5)} volume={0.26} />
      {rows.map((row) => (
        <Sfx key={row.at} id="pop" at={row.at} volume={0.22} />
      ))}
      <Sfx id="pop" at={store} volume={0.22} />
      <Headline text="Lưu trữ nhúng với redb" p={head} />
      <ProjectCard
        logo="repos/cberner.png"
        name="redb"
        meta="Rust · Apache-2.0"
        count={4944}
        at={at(start, 0.5)}
        y={540}
      />

      <div style={{ position: "absolute", left: SL, top: 792, width: SW }}>
        {rows.map((row) => {
          const p = land(f, row.at, 12);
          return (
            <div
              key={row.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                height: 96,
                opacity: p,
                transform: `translateX(${(1 - p) * -34}px)`,
              }}
            >
              <div style={{ width: 8, height: 44, background: C.red, flexShrink: 0 }} />
              <div
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 42,
                  color: C.white,
                  lineHeight: 1.1,
                }}
              >
                {row.text}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: SL,
          top: 1112,
          width: SW,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: land(f, store, 12),
          transform: `translateY(${(1 - land(f, store, 12)) * 22}px)`,
        }}
      >
        <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: C.dim }}>Dữ liệu nằm ở</div>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 34,
            color: C.white,
            background: "rgba(4,16,31,0.9)",
            border: "2px solid rgba(255,255,255,0.18)",
            padding: "14px 22px",
          }}
        >
          ./data/lonewolf.dat
        </div>
      </div>
    </AbsoluteFill>
  );
};

// s5 — build it from source.
export const Compile: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  const head = land(f, at(start, 0.15, "down"), 13);
  const term = at(start, 2.05);
  const bins = at(start, 5.5);
  const cmds = [
    "git clone --branch v0.3.0 https://github.com/lonewolf-im/lonewolf.git",
    "cd lonewolf",
    "cargo build --release --locked -p lonewolf -p lonewolfctl",
  ];
  return (
    <AbsoluteFill>
      <Sfx id="typing" at={term + TYPE_DELAY} frames={typingFrames(cmds)} volume={0.26} />
      <Sfx id="pop" at={bins} volume={0.24} />
      <Headline text="Biên dịch từ source" p={head} />
      <Sequence from={term} name="terminal" layout="none">
        <div style={{ position: "absolute", left: SL, top: 482, width: SW }}>
          <Terminal cmds={cmds} width={SW} fontSize={36} minHeight={0} bg={C.ink} fg={C.white} accent={C.red} />
        </div>
      </Sequence>

      <div
        style={{
          position: "absolute",
          left: SL,
          top: 958,
          width: SW,
          opacity: land(f, bins, 12),
          transform: `translateY(${(1 - land(f, bins, 12)) * 22}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            fontFamily: F.sans,
            fontWeight: 600,
            fontSize: 34,
            color: C.dim,
          }}
        >
          <span style={{ fontFamily: F.mono, fontWeight: 700, color: C.white }}>target/release/</span>
          <span>2 binary sau khi build</span>
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 18 }}>
          {["lonewolf", "lonewolfctl"].map((bin) => (
            <div
              key={bin}
              style={{
                background: C.paper,
                color: C.onPaper,
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 40,
                padding: "18px 26px",
                borderRadius: 4,
                borderLeft: `8px solid ${C.red}`,
              }}
            >
              {bin}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// s6 — start it, create two accounts.
export const Run: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  const head = land(f, at(start, 0.15, "down"), 13);
  const term = at(start, 1.45);
  const accounts = at(start, 5.3);
  const cmds = [
    "./target/release/lonewolf --config ./lonewolf.toml",
    "./target/release/lonewolfctl account create alice@localhost",
    "./target/release/lonewolfctl account create bob@localhost",
  ];
  return (
    <AbsoluteFill>
      <Sfx id="typing" at={term + TYPE_DELAY} frames={typingFrames(cmds)} volume={0.26} />
      <Sfx id="pop" at={accounts} volume={0.24} />
      <Headline text="Khởi chạy và tạo tài khoản" size={64} p={head} />
      <Sequence from={term} name="terminal" layout="none">
        <div style={{ position: "absolute", left: SL, top: 548, width: SW }}>
          <Terminal cmds={cmds} width={SW} fontSize={36} minHeight={0} bg={C.ink} fg={C.white} accent={C.red} />
        </div>
      </Sequence>

      <div
        style={{
          position: "absolute",
          left: SL,
          top: 986,
          width: SW,
          opacity: land(f, accounts, 12),
          transform: `translateY(${(1 - land(f, accounts, 12)) * 22}px)`,
        }}
      >
        <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: C.dim }}>2 tài khoản localhost vừa tạo</div>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          {["alice@localhost", "bob@localhost"].map((jid) => (
            <div
              key={jid}
              style={{
                flex: 1,
                background: C.paper,
                borderRadius: 4,
                borderTop: `6px solid ${C.red}`,
                padding: "18px 20px",
                textAlign: "center",
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 34,
                color: C.onPaper,
                whiteSpace: "nowrap",
              }}
            >
              {jid}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 22,
            fontFamily: F.sans,
            fontWeight: 600,
            fontSize: 34,
            color: C.dim,
          }}
        >
          <div style={{ width: 14, height: 14, background: C.red, borderRadius: 2 }} />
          Client kết nối STARTTLS, cổng 5222
        </div>
      </div>
    </AbsoluteFill>
  );
};
