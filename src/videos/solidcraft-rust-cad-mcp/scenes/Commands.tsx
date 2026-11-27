import { siClaude } from "simple-icons";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { mono } from "../../../kit";
import { onBeat } from "../timing";
import { C, Hairline, Safe, ramp, serif, serifItalic, shadow } from "../theme";
import { Terminal } from "../Terminal";

export const CARGO = ["cargo run --release -p solidcraft -- --sample"];
export const CLAUDE = ["claude mcp add solidcraft -- solidcraft-cli mcp"];

export const CARGO_START = onBeat("s8", 40);
export const CLAUDE_START = onBeat("s9", 77);

// s8 — build and run the sample desktop app from the repository.
export const CargoScene: React.FC = () => {
  const f = useCurrentFrame();
  const head = ramp(f, 4, 18);
  const note = ramp(f, 30, 18);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 62% 34% at 50% 34%, rgba(61,130,232,0.09), rgba(7,10,15,0) 72%)",
        }}
      />
      <Safe>
        <div
          style={{
            position: "absolute",
            top: 84,
            left: 0,
            width: 720,
            fontFamily: serif,
            fontSize: 54,
            fontWeight: 600,
            letterSpacing: -0.4,
            opacity: head,
            transform: `translateY(${(1 - head) * 18}px)`,
            ...shadow,
          }}
        >
          Chạy thử bản Desktop
        </div>
        <div
          style={{
            position: "absolute",
            top: 158,
            left: 0,
            fontFamily: serif,
            fontSize: 36,
            color: C.dust,
            opacity: ramp(f, 16, 18),
          }}
        >
          Chạy bản mẫu với Cargo
        </div>

        <div style={{ position: "absolute", top: 286, left: 0 }}>
          <Terminal cmds={CARGO} fontSize={40} minHeight={320} delay={CARGO_START} />
        </div>

        <Hairline style={{ position: "absolute", bottom: 172, left: 0, right: 0 }} />

        <div
          style={{
            position: "absolute",
            bottom: 58,
            left: 0,
            width: 777,
            fontFamily: serifItalic,
            fontSize: 34,
            lineHeight: 1.4,
            color: C.paper,
            opacity: note,
            transform: `translateY(${(1 - note) * 16}px)`,
            ...shadow,
          }}
        >
          Biên dịch và chạy bản mẫu từ mã nguồn.
        </div>
      </Safe>
    </AbsoluteFill>
  );
};

// s9 — register the SolidCraft MCP server with Claude from the command line.
export const ClaudeScene: React.FC = () => {
  const f = useCurrentFrame();
  const head = ramp(f, 4, 18);
  const note = ramp(f, 30, 18);

  return (
    <AbsoluteFill style={{ backgroundColor: C.navy }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(7,10,15,0.7) 0%, rgba(7,10,15,0) 34%, rgba(7,10,15,0.72) 100%)",
        }}
      />
      <Safe>
        <div
          style={{
            position: "absolute",
            top: 84,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: head,
          }}
        >
          <svg width={44} height={44} viewBox="0 0 24 24">
            <path d={siClaude.path} fill={C.paper} />
          </svg>
          <span style={{ fontFamily: serif, fontSize: 42, fontWeight: 600 }}>Claude Code</span>
          <span
            style={{
              fontFamily: mono,
              fontSize: 34,
              color: C.blue,
              marginLeft: "auto",
            }}
          >
            MCP
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: 152,
            left: 0,
            width: 720,
            fontFamily: serif,
            fontSize: 52,
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: -0.4,
            opacity: ramp(f, 12, 18),
            transform: `translateY(${(1 - head) * 14}px)`,
            ...shadow,
          }}
        >
          Kết nối Claude qua MCP
        </div>

        <div style={{ position: "absolute", top: 292, left: 0 }}>
          <Terminal
            cmds={CLAUDE}
            fontSize={40}
            minHeight={320}
            delay={CLAUDE_START}
            bg="#0A1018"
          />
        </div>

        <Hairline style={{ position: "absolute", bottom: 196, left: 0, right: 0 }} />

        <div
          style={{
            position: "absolute",
            bottom: 92,
            left: 0,
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            opacity: note,
            transform: `translateY(${(1 - note) * 16}px)`,
          }}
        >
          <span style={{ fontFamily: serif, fontSize: 36, color: C.dust }}>
            server đã đăng ký
          </span>
          <span style={{ fontFamily: mono, fontSize: 42, color: C.paper }}>solidcraft</span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 34,
            left: 0,
            fontFamily: serifItalic,
            fontSize: 36,
            color: C.dust,
            opacity: note,
          }}
        >
          Model Context Protocol
        </div>
      </Safe>
    </AbsoluteFill>
  );
};
