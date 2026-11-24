import { Img, interpolate, useCurrentFrame } from "remotion";
import { videoAsset } from "../../kit";
import { CheckIcon, Cursor, Line, SceneFrame, ShellHead, TermWindow, useBeatPulse } from "./parts";
import { Terminal } from "./terminal";
import { C, WIN_INNER, appear, easeOut, mono, sans } from "./theme";

const SLUG = "xnulinux-macos-tren-linux-arm64";

// ---------------------------------------------------------------- 1. hook
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneFrame step={1} start={0} brand headline={["macOS trên Linux", "không hypervisor"]}>
      <TermWindow>
        <Terminal cmds={["insmod xnu.ko"]} width={WIN_INNER} fontSize={48} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 18,
            paddingTop: 16,
          }}
        >
          <Line at={44} f={f} style={{ fontSize: 38 }}>
            <span style={{ color: C.accent, fontWeight: 700 }}>xnu.ko</span>
            <span style={{ color: C.muted }}> nạp vào Linux arm64</span>
          </Line>
          <Line at={54} f={f} style={{ fontSize: 36, lineHeight: 1.45, color: C.text }}>
            <div>tiến trình macOS</div>
            <div>chạy cạnh tiến trình Linux</div>
          </Line>
          <Line at={48} f={f} style={{ marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <CheckIcon p={appear(f, 52, 10)} size={56} />
              <span style={{ fontSize: 76, fontWeight: 700, color: C.white }}>macOS 27.2.1</span>
            </div>
            <div style={{ fontSize: 35, color: C.muted, marginTop: 12, lineHeight: 1.45 }}>
              <div>loginwindow / WindowServer</div>
              <div>Dock / Finder / Safari</div>
            </div>
          </Line>
        </div>
        <Line
          at={160}
          f={f}
          style={{ borderTop: `1px solid ${C.line}`, paddingTop: 18, fontSize: 38, color: C.accent }}
        >
          desktop macOS, không máy ảo
        </Line>
      </TermWindow>
    </SceneFrame>
  );
};

// ---------------------------------------------------------------- 2. compare
const CompareRow: React.FC<{
  f: number;
  at: number;
  name: string;
  text: string;
  hot?: boolean;
  lit?: boolean;
}> = ({ f, at, name, text, hot = false, lit = false }) => {
  const p = appear(f, at);
  return (
    <div
      style={{
        opacity: p,
        translate: `0 ${(1 - p) * 12}px`,
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "24px 18px",
        borderLeft: `4px solid ${lit && hot ? C.accent : "transparent"}`,
        background: lit && hot ? "rgba(255,182,46,0.07)" : "transparent",
        borderBottom: `1px solid ${C.lineSoft}`,
      }}
    >
      <div
        style={{
          width: 196,
          flexShrink: 0,
          fontFamily: mono,
          fontSize: 42,
          fontWeight: 700,
          color: hot ? C.accent : C.white,
        }}
      >
        {name}
      </div>
      <div
        style={{
          flex: 1,
          fontFamily: sans,
          fontSize: 38,
          fontWeight: 700,
          lineHeight: 1.25,
          color: hot ? C.white : C.muted,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Compare: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneFrame
      step={2}
      start={330}
      headline={["Khác biệt với Darling", "và macRun"]}
    >
      <TermWindow>
        <ShellHead label="công cụ" right="cách chạy" />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <CompareRow f={f} at={32} name="Darling" text="chỉ hỗ trợ CLI" />
          <CompareRow f={f} at={130} name="macRun" text="thay thế runtime Electron" />
          <CompareRow
            f={f}
            at={229}
            name="xnulinux"
            text="nạp trực tiếp kernel XNU"
            hot
            lit={f >= 294}
          />
        </div>
        <Line
          at={294}
          f={f}
          style={{ borderTop: `1px solid ${C.line}`, paddingTop: 24, marginTop: 10 }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 62, fontWeight: 700, color: C.accent }}>xnu.ko</span>
            <span style={{ fontFamily: sans, fontSize: 38, fontWeight: 700, color: C.white }}>
              nạp thẳng kernel XNU
            </span>
            <Cursor f={f} h={38} w={16} />
          </div>
          <div style={{ fontFamily: sans, fontSize: 34, color: C.muted, marginTop: 8 }}>
            kernel macOS chạy ngay trong Linux
          </div>
        </Line>
      </TermWindow>
    </SceneFrame>
  );
};

// ---------------------------------------------------------------- 3. parallel
const ProcessRow: React.FC<{ f: number; at: number; name: string }> = ({ f, at, name }) => {
  const p = appear(f, at);
  return (
    <div
      style={{
        opacity: p,
        translate: `0 ${(1 - p) * 8}px`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        height: 64,
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: 2, background: C.accent, opacity: 0.85 }} />
      <span style={{ fontFamily: mono, fontSize: 38, color: C.text }}>{name}</span>
    </div>
  );
};

export const Parallel: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = useBeatPulse(939);
  const strike = appear(f, 338, 10);
  return (
    <SceneFrame
      step={3}
      start={939}
      headline={["Chạy song song", "không hypervisor"]}
    >
      <TermWindow>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 28 }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: mono,
                fontSize: 36,
                color: C.muted,
                paddingBottom: 12,
                borderBottom: `1px solid ${C.line}`,
              }}
            >
              macOS
            </div>
            <ProcessRow f={f} at={35} name="launchd" />
            <ProcessRow f={f} at={67} name="WindowServer" />
            <ProcessRow f={f} at={100} name="Safari" />
          </div>
          <div style={{ width: 1, background: C.line }} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: mono,
                fontSize: 36,
                color: C.muted,
                paddingBottom: 12,
                borderBottom: `1px solid ${C.line}`,
              }}
            >
              Linux
            </div>
            <ProcessRow f={f} at={35} name="systemd" />
            <ProcessRow f={f} at={67} name="sshd" />
            <ProcessRow f={f} at={100} name="xnudrmd" />
          </div>
        </div>

        <Line
          at={198}
          f={f}
          style={{ paddingTop: 18, borderTop: `1px solid ${C.line}` }}
        >
          <div style={{ fontFamily: sans, fontSize: 40, fontWeight: 700, color: C.white }}>
            cùng một CPU vật lý
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {[0, 1, 2, 3].map((i) => {
              const lit = f >= 220 + i * 28;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 32,
                    borderRadius: 4,
                    background: lit ? "rgba(255,182,46,0.5)" : "rgba(255,182,46,0.12)",
                    border: `1px solid ${C.accentSoft}`,
                    scale: lit ? 1 + pulse * 0.06 : 1,
                  }}
                />
              );
            })}
          </div>
          <div style={{ fontFamily: mono, fontSize: 34, color: C.muted, marginTop: 12, lineHeight: 1.4 }}>
            <div>hai không gian người dùng</div>
            <div>chạy chung</div>
          </div>
        </Line>

        <Line
          at={329}
          f={f}
          style={{ paddingTop: 18, borderTop: `1px solid ${C.line}` }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <span style={{ fontFamily: mono, fontSize: 58, color: C.dim }}>hypervisor</span>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "52%",
                height: 4,
                width: `${strike * 100}%`,
                background: C.accent,
              }}
            />
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: 38,
              fontWeight: 700,
              color: C.white,
              marginTop: 6,
            }}
          >
            không có tầng trung gian
          </div>
        </Line>

        {f >= 360 && (
        <div>
          <Line
            at={360}
            f={f}
            style={{ fontFamily: mono, fontSize: 35, color: C.muted, lineHeight: 1.45 }}
          >
            <div>mỗi CPU macOS là một</div>
            <div>thread Linux ghim vào CPU</div>
          </Line>
          <Line at={430} f={f} style={{ fontFamily: mono, fontSize: 34, color: C.dim, marginTop: 8 }}>
            vector ngoại lệ do Linux giữ
          </Line>
        </div>
        )}
        </div>
      </TermWindow>
    </SceneFrame>
  );
};

// ---------------------------------------------------------------- 4. cpu/memory
const SysRow: React.FC<{ f: number; at: number; k: string; v: string }> = ({ f, at, k, v }) => (
  <Line at={at} f={f} style={{ display: "flex", gap: 20, fontSize: 40 }}>
    <span style={{ color: C.muted, width: 290, flexShrink: 0 }}>{k}</span>
    <span style={{ color: C.white }}>{v}</span>
  </Line>
);

const CpuPhase: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <TermWindow>
      <Terminal cmds={["sysctl machdep.cpu"]} width={WIN_INNER} fontSize={44} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
        <Line at={56} f={f} style={{ color: C.dim, fontSize: 34, marginBottom: 6 }}>
          trên macOS hosted
        </Line>
        <SysRow f={f} at={66} k="machdep.cpu" v="ARM processor" />
        <SysRow f={f} at={96} k="hw.cpufamily" v="0" />
        <SysRow f={f} at={126} k="hw.ncpu" v="4" />
        <Line at={148} f={f} style={{ marginTop: 26, paddingTop: 20, borderTop: `1px solid ${C.line}` }}>
          <div style={{ fontFamily: sans, fontSize: 36, fontWeight: 700, color: C.white }}>
            mỗi CPU macOS là một thread Linux ghim
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  border: `1px solid ${C.accentSoft}`,
                  background: "rgba(255,182,46,0.08)",
                  borderRadius: 6,
                  padding: "14px 0",
                  textAlign: "center",
                  fontFamily: mono,
                  fontSize: 34,
                  color: C.accent,
                }}
              >
                thread {i}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: mono, fontSize: 34, color: C.muted, marginTop: 12 }}>
            ghim vào CPU vật lý
          </div>
        </Line>
        <Line
          at={210}
          f={f}
          style={{ marginTop: 6, fontFamily: mono, fontSize: 34, color: C.dim, lineHeight: 1.4 }}
        >
          <div>XNU chạy tới khi gọi host</div>
          <div>idle / I/O / timer</div>
        </Line>
      </div>
    </TermWindow>
  );
};

const MemoryPhase: React.FC = () => {
  const f = useCurrentFrame();
  const token = interpolate(f, [296, 330], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const pages = 24;
  const slam = appear(f, 666, 8);
  return (
    <TermWindow>
      <ShellHead label="bộ nhớ" right="pmap riêng" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", paddingTop: 16 }}>
        <Line at={279} f={f} style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontFamily: mono, fontSize: 34, color: C.dim }}>Linux</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 2 }}>
            <span style={{ fontSize: 66, fontWeight: 700, color: C.accent }}>CMA</span>
            <span style={{ fontFamily: sans, fontSize: 34, color: C.muted }}>một khối liền kề</span>
          </div>
        </Line>

        <div
          style={{
            height: 54,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 2, background: C.line }} />
          <div
            style={{
              position: "absolute",
              top: 0,
              translate: `0 ${token * 34}px`,
              width: 18,
              height: 18,
              background: C.accent,
              borderRadius: 3,
              opacity: f >= 296 ? 1 : 0,
            }}
          />
        </div>

        <Line at={330} f={f} style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <span style={{ fontFamily: mono, fontSize: 34, color: C.dim }}>XNU</span>
            <span style={{ fontSize: 60, fontWeight: 700, color: C.white }}>pmap</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 8,
              marginTop: 16,
            }}
          >
            {Array.from({ length: pages }, (_, i) => {
              const p = appear(f, 350 + i * 5, 8);
              return (
                <div
                  key={i}
                  style={{
                    height: 44,
                    borderRadius: 3,
                    border: `1px solid ${C.accentSoft}`,
                    background: `rgba(255,182,46,${0.05 + p * 0.2})`,
                    opacity: 0.35 + p * 0.65,
                  }}
                />
              );
            })}
          </div>
          <Line at={541} f={f} style={{ marginTop: 14, fontSize: 38, color: C.accent }}>
            trang 4 KB
          </Line>
        </Line>

        <Line at={600} f={f} style={{ fontSize: 34, color: C.muted }}>
          XNU tự quản lý qua pmap riêng
        </Line>

        {f >= 666 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: C.panel,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontSize: 196,
                fontWeight: 700,
                lineHeight: 1,
                color: C.accent,
                scale: 1.14 - slam * 0.14,
                opacity: 1,
              }}
            >
              4 KB
            </div>
            <div style={{ fontFamily: sans, fontSize: 44, fontWeight: 700, color: C.white }}>
              pmap riêng
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: 72,
                    height: 34,
                    borderRadius: 3,
                    border: `1px solid ${C.accent}`,
                    background: "rgba(255,182,46,0.14)",
                    opacity: 0.8,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </TermWindow>
  );
};

export const CpuMemory: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneFrame
      step={4}
      start={1513}
      headline={["Cơ chế điều phối", "CPU và bộ nhớ"]}
    >
      {f < 279 ? <CpuPhase /> : <MemoryPhase />}
    </SceneFrame>
  );
};

// ---------------------------------------------------------------- 5. boot time
const CompareBar: React.FC<{
  f: number;
  name: string;
  from: number;
  to: number;
  target: number;
  range?: boolean;
  label: string;
  labelAt: number;
  dim?: boolean;
}> = ({ f, name, from, to, target, range = false, label, labelAt, dim = false }) => {
  const p = interpolate(f, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const max = 50;
  const solid = Math.min(p * target, range ? 31 : target) / max;
  const light = range ? Math.max(0, p * target - 31) / max : 0;
  return (
    <div style={{ opacity: dim ? 0.55 : 1 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
        <span style={{ fontFamily: sans, fontSize: 42, fontWeight: 700, color: C.white }}>{name}</span>
        <span
          style={{
            fontFamily: mono,
            fontSize: 64,
            fontWeight: 700,
            color: C.accent,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {f >= labelAt ? label : `${Math.round(target * p)}`}
        </span>
      </div>
      <div
        style={{
          position: "relative",
          height: 34,
          marginTop: 10,
          background: "#121A18",
          border: `1px solid ${C.line}`,
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: C.accent,
            transform: `scaleX(${solid})`,
            transformOrigin: "left",
          }}
        />
        {range ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${(31 / max) * 100}%`,
              width: `${(19 / max) * 100}%`,
              background: C.accent,
              opacity: 0.35,
              transform: `scaleX(${light / (19 / max)})`,
              transformOrigin: "left",
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export const BootTime: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = useBeatPulse(2232);
  const fill = interpolate(f, [5, 198], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const counted = Math.round(
    31 *
      interpolate(f, [5, 67], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeOut,
      }),
  );
  const big = f < 67 ? `${counted}` : f < 198 ? "31" : "31–48";

  return (
    <SceneFrame step={5} start={2232} headline={["Boot desktop nhanh", "hơn máy ảo"]} flashAt={0}>
      <TermWindow>
        <ShellHead label="thời gian lên desktop" right="giây" />
        {f < 329 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              paddingTop: 8,
            }}
          >
            <div>
              <div style={{ fontFamily: sans, fontSize: 46, fontWeight: 700, color: C.white }}>
                xnulinux
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 132,
                  fontWeight: 700,
                  lineHeight: 1.16,
                  letterSpacing: -4,
                  color: C.accent,
                  fontVariantNumeric: "tabular-nums",
                  marginTop: 2,
                  scale: 1 + pulse * 0.02,
                }}
              >
                {big}
              </div>
              <div style={{ fontFamily: mono, fontSize: 36, color: C.muted }}>giây</div>
            </div>
            <div
              style={{
                position: "relative",
                height: 58,
                background: "#121A18",
                border: `1px solid ${C.line}`,
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: C.accent,
                  transform: `scaleX(${Math.min(fill * 48, 31) / 50})`,
                  transformOrigin: "left",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${(31 / 50) * 100}%`,
                  width: `${(17 / 50) * 100}%`,
                  background: C.accent,
                  opacity: 0.35,
                  transform: `scaleX(${Math.max(0, fill * 48 - 31) / 17})`,
                  transformOrigin: "left",
                }}
              />
            </div>
            <div>
              <Line at={120} f={f} style={{ fontSize: 36, color: C.text }}>
                máy ảo Linux arm64
              </Line>
              <Line at={198} f={f} style={{ fontSize: 36, color: C.muted, marginTop: 4 }}>
                macOS 27.2.1 / tự đăng nhập
              </Line>
            </div>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              paddingTop: 10,
            }}
          >
            <CompareBar
              f={f}
              name="xnulinux"
              from={0}
              to={1}
              target={48}
              range
              label="31–48"
              labelAt={0}
            />
            <CompareBar
              f={f}
              name="Apple Virtualization"
              from={329}
              to={410}
              target={49}
              label="49"
              labelAt={410}
              dim={f >= 460}
            />
            <Line
              at={540}
              f={f}
              style={{ borderTop: `1px solid ${C.line}`, paddingTop: 18, fontSize: 35, color: C.muted, lineHeight: 1.5 }}
            >
              <div>
                macOS 27.2.1 / tự đăng nhập
                <Cursor f={f} h={28} w={12} />
              </div>
              <div>Apple Virtualization VM trên cùng máy Mac</div>
            </Line>
          </div>
        )}
      </TermWindow>
    </SceneFrame>
  );
};

// ---------------------------------------------------------------- 6. apps + stress
const ProcLine: React.FC<{ f: number; at: number; name: string }> = ({ f, at, name }) => {
  const p = appear(f, at);
  return (
    <div
      style={{
        opacity: p,
        translate: `0 ${(1 - p) * 10}px`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        height: 150,
        borderBottom: `1px solid ${C.lineSoft}`,
      }}
    >
      <CheckIcon p={appear(f, at + 5, 10)} size={44} />
      <span style={{ fontFamily: mono, fontSize: 50, fontWeight: 700, color: C.white }}>{name}</span>
      <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 34, color: C.muted }}>chạy</span>
    </div>
  );
};

const ProcessPhase: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <TermWindow>
      <ShellHead label="tiến trình macOS" right="trạng thái" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <ProcLine f={f} at={13} name="WindowServer" />
        <ProcLine f={f} at={45} name="Dock" />
        <ProcLine f={f} at={78} name="Finder" />
        <ProcLine f={f} at={110} name="Safari" />
      </div>
    </TermWindow>
  );
};

const APPS = [
  ["Safari", "Notes"],
  ["Calculator", "TextEdit"],
  ["System Settings", "Spotlight"],
];

const StressPhase: React.FC = () => {
  const f = useCurrentFrame();
  const minutes = interpolate(f, [144, 536], [0, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const secs = Math.floor((minutes % 1) * 60);
  const clock = `${String(Math.floor(minutes)).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  return (
    <TermWindow>
      <ShellHead label="stress test" right="30 phút" />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingTop: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span
            style={{
              fontFamily: mono,
              fontSize: 138,
              fontWeight: 700,
              lineHeight: 1.18,
              color: C.accent,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            40
          </span>
          <span style={{ fontFamily: sans, fontSize: 38, fontWeight: 700, color: C.white }}>
            lượt mở app
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {APPS.map((pair, i) => {
            const at = 120 + i * 4;
            const p = appear(f, at);
            return (
              <div
                key={pair[0]}
                style={{
                  opacity: p,
                  translate: `0 ${(1 - p) * 6}px`,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  fontFamily: mono,
                  fontSize: 35,
                  color: C.text,
                }}
              >
                {pair.map((app) => (
                  <div key={app} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 7, height: 7, borderRadius: 2, background: C.green }} />
                    {app}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div style={{ minHeight: 216, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {f < 536 ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: mono, fontSize: 34, color: C.muted }}>thời gian chạy</span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 62,
                    fontWeight: 700,
                    color: C.text,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {clock}
                </span>
              </div>
              <div
                style={{
                  height: 12,
                  borderRadius: 3,
                  background: "#121A18",
                  marginTop: 12,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: C.accent,
                    transform: `scaleX(${(minutes / 30).toFixed(4)})`,
                    transformOrigin: "left",
                  }}
                />
              </div>
              <div style={{ fontFamily: mono, fontSize: 34, color: C.dim, marginTop: 10 }}>
                đang mở app liên tục
              </div>
            </div>
          ) : (
            <div
              style={{
                border: `1px solid rgba(87,214,143,0.45)`,
                borderRadius: 12,
                padding: "16px 20px",
                background: "rgba(87,214,143,0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <CheckIcon p={appear(f, 540, 10)} size={52} />
                <span style={{ fontFamily: mono, fontSize: 54, fontWeight: 700, color: C.white }}>
                  không panic
                </span>
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 38,
                  color: C.green,
                  marginTop: 4,
                  paddingLeft: 68,
                }}
              >
                không crash report
              </div>
              <Line
                at={596}
                f={f}
                style={{ marginTop: 4, paddingLeft: 68, fontFamily: sans, fontSize: 34, color: C.muted }}
              >
                sau 30 phút chạy liên tục
              </Line>
            </div>
          )}
        </div>
      </div>
    </TermWindow>
  );
};

export const Stress: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneFrame
      step={6}
      start={2941}
      headline={["Chạy được cả WindowServer", "và Safari"]}
    >
      {f < 144 ? <ProcessPhase /> : <StressPhase />}
    </SceneFrame>
  );
};

// ---------------------------------------------------------------- 7. install scripts
const STEPS = [
  { at: 300, label: "build", host: "Linux arm64", result: "xnu-12377.121.6" },
  { at: 350, label: "rebuild", host: "Linux arm64", result: "xnu.ko / fki.ko" },
  { at: 400, label: "đĩa cài", host: "Mac có Xcode", result: "macOS 27 disk" },
  { at: 450, label: "boot", host: "Linux arm64", result: "desktop macOS" },
];

export const Install: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneFrame step={7} start={3597} headline={["Quy trình", "cài đặt xnulinux"]}>
      <TermWindow>
        <ShellHead label="script chính thức" right="host" />
        <div style={{ padding: "14px 0 6px" }}>
          <Terminal
            cmds={[
              "scripts/vm-xnu-build.sh",
              "scripts/vm-xnu-rebuild.sh",
              "scripts/mk-macvm-disk.sh",
              "scripts/xnulinux-boot.sh",
            ]}
            width={WIN_INNER}
            fontSize={36}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            paddingTop: 8,
          }}
        >
          {STEPS.map((s, i) => {
            const done = f >= s.at;
            return (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  padding: "10px 0",
                  borderTop: i === 0 ? "none" : `1px solid ${C.lineSoft}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontFamily: mono, fontSize: 34, color: C.accent, width: 20 }}>
                    {i + 1}
                  </span>
                  <span
                    style={{
                      fontFamily: sans,
                      fontSize: 38,
                      fontWeight: 700,
                      color: done ? C.white : C.muted,
                    }}
                  >
                    {s.label}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: mono,
                      fontSize: 34,
                      color: C.dim,
                    }}
                  >
                    {s.host}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    paddingLeft: 34,
                    height: 36,
                  }}
                >
                  {done ? (
                    <CheckIcon p={appear(f, s.at + 4, 9)} size={28} />
                  ) : (
                    <div style={{ width: 9, height: 9, borderRadius: 2, background: C.line }} />
                  )}
                  <span style={{ fontFamily: mono, fontSize: 34, color: done ? C.text : C.muted }}>
                    {done ? s.result : "chưa chạy"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <Line
          at={500}
          f={f}
          style={{
            borderTop: `1px solid ${C.line}`,
            paddingTop: 12,
            fontFamily: mono,
            fontSize: 34,
            color: C.muted,
            lineHeight: 1.45,
          }}
        >
          <div>Mac có Xcode / host Linux arm64</div>
        </Line>
      </TermWindow>
    </SceneFrame>
  );
};

// ---------------------------------------------------------------- 8. service + caveats
const ServiceRow: React.FC<{ f: number; at: number; label: string; right: string }> = ({
  f,
  at,
  label,
  right,
}) => {
  const p = appear(f, at);
  return (
    <div
      style={{
        opacity: p,
        translate: `0 ${(1 - p) * 8}px`,
        height: 88,
        display: "flex",
        alignItems: "center",
        gap: 16,
        borderBottom: `1px solid ${C.lineSoft}`,
      }}
    >
      <CheckIcon p={appear(f, at + 4, 9)} size={34} />
      <span style={{ fontFamily: mono, fontSize: 38, color: C.text }}>{label}</span>
      <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 34, color: C.dim }}>
        {right}
      </span>
    </div>
  );
};

const Caveat: React.FC<{ f: number; at: number; title: string; sub: string }> = ({
  f,
  at,
  title,
  sub,
}) => {
  const p = appear(f, at);
  return (
    <div
      style={{
        opacity: p,
        translate: `0 ${(1 - p) * 10}px`,
        borderLeft: `6px solid ${C.accent}`,
        paddingLeft: 22,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: mono, fontSize: 48, fontWeight: 700, color: C.accent }}>!</span>
        <span style={{ fontFamily: mono, fontSize: 42, fontWeight: 700, color: C.white }}>{title}</span>
      </div>
      <div style={{ fontFamily: sans, fontSize: 36, color: C.muted, marginTop: 6 }}>{sub}</div>
    </div>
  );
};

export const Service: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneFrame step={8} start={4157} headline={["Chạy systemd", "và lưu ý"]}>
      <TermWindow>
        {f < 363 ? (
          <>
            <Terminal cmds={["scripts/install-service.sh"]} width={WIN_INNER} fontSize={38} />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                paddingTop: 14,
              }}
            >
              <Line
                at={102}
                f={f}
                style={{
                  border: `1px solid rgba(87,214,143,0.4)`,
                  borderRadius: 12,
                  background: "rgba(87,214,143,0.05)",
                  padding: "14px 18px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <CheckIcon p={appear(f, 106, 10)} size={44} />
                  <span style={{ fontFamily: mono, fontSize: 44, fontWeight: 700, color: C.white }}>
                    xnulinux.service
                  </span>
                </div>
                <div style={{ fontFamily: sans, fontSize: 34, color: C.muted, marginTop: 4, paddingLeft: 58 }}>
                  chạy như dịch vụ systemd
                </div>
              </Line>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <ServiceRow f={f} at={106} label="khởi động cùng máy" right="boot" />
                <ServiceRow f={f} at={116} label="stop sạch cùng VM" right="exit" />
                <ServiceRow f={f} at={126} label="restart sau panic" right="auto" />
                <ServiceRow f={f} at={136} label="/var/log/xnulinux/" right="log" />
              </div>

              <Line
                at={240}
                f={f}
                style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: mono, fontSize: 34, color: C.muted }}
              >
                <span style={{ color: C.accent }}>$</span>
                <span> </span>
                <Cursor f={f} h={26} w={12} />
              </Line>
            </div>
          </>
        ) : (
          <>
            <ShellHead label="lưu ý" />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                paddingTop: 18,
              }}
            >
              <Caveat
                f={f}
                at={340}
                title="trang 4 KB chậm hơn 16 KB"
                sub="truy cập bộ nhớ chậm hơn native"
              />
              <Caveat
                f={f}
                at={400}
                title="kernel Linux bị tainted"
                sub="xnu.ko / APSL-2.0 / Proprietary"
              />
              {f >= 420 && <Line
                at={420}
                f={f}
                style={{ borderTop: `1px solid ${C.line}`, paddingTop: 16, fontFamily: mono, fontSize: 34, color: C.muted, lineHeight: 1.45 }}
              >
                <div>AMFI patch / SIP relaxed</div>
                <div>cryptex gộp vào system volume</div>
              </Line>}
              <Line
                at={470}
                f={f}
                style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: mono, fontSize: 34, color: C.muted }}
              >
                <span style={{ color: C.accent }}>$</span>
                <span> </span>
                <Cursor f={f} h={26} w={12} />
              </Line>
            </div>
          </>
        )}
      </TermWindow>
    </SceneFrame>
  );
};

// ---------------------------------------------------------------- 9. end
export const End: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneFrame step={9} start={4910} headline={["Lưu lại", "và theo dõi"]}>
      <TermWindow>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Img
            src={videoAsset(SLUG, "repos/AFK-surf.png")}
            style={{ width: 96, height: 96, borderRadius: 18, background: "#FFFFFF" }}
          />
          <div>
            <div style={{ fontFamily: sans, fontSize: 46, fontWeight: 700, color: C.white }}>
              xnulinux
            </div>
            <div style={{ fontFamily: mono, fontSize: 34, color: C.muted }}>2.163 sao GitHub</div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            paddingTop: 14,
          }}
        >
          <Line
            at={0}
            f={f}
            style={{
              borderLeft: `5px solid ${C.accent}`,
              paddingLeft: 20,
              fontSize: 46,
              lineHeight: 1.34,
              color: C.white,
              fontWeight: 700,
            }}
          >
            <div>Liệu cách nạp kernel này</div>
            <div>có thay thế hoàn toàn</div>
            <div>
              máy ảo macOS?
              <Cursor f={f} h={34} w={16} />
            </div>
          </Line>

          <Line at={20} f={f} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: C.accent }} />
            <span style={{ fontFamily: sans, fontSize: 44, fontWeight: 700, color: C.white }}>
              Lưu video để vọc xnulinux
            </span>
          </Line>

          <Line at={56} f={f} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: C.accent, marginTop: 16 }} />
            <span style={{ fontFamily: sans, fontSize: 40, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>
              <div>Bấm follow để cập nhật</div>
              <div>thủ thuật mới</div>
            </span>
          </Line>

          <Line at={120} f={f} style={{ fontFamily: mono, fontSize: 34, color: C.muted }}>
            github.com/AFK-surf/xnulinux
          </Line>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            borderTop: `1px solid ${C.line}`,
            paddingTop: 14,
            fontFamily: mono,
            fontSize: 36,
            color: C.muted,
          }}
        >
          <span style={{ color: C.accent }}>$</span>
          <span> </span>
          <Cursor f={f} h={30} w={14} />
        </div>
      </TermWindow>
    </SceneFrame>
  );
};
