import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SAFE, easeOut } from "../../../kit";
import {
  Area,
  Avatar,
  Backdrop,
  RedSquare,
  StarNumber,
  rise,
  slide,
  useAt,
} from "../bits";
import { C, a } from "../theme";
import type { SceneProps } from "./types";

const CODE = a("footage/frustrated-programmer-coding-screen-pixabay-27706.mp4");

// ---------------------------------------------------------------------------
// s3 — the fast-anything story opens on its own card, then shows profiling.
// ---------------------------------------------------------------------------

const FastCard: React.FC = () => {
  const slab = useAt(0, 12);
  const num = useAt(2, 12);
  const name = useAt(7, 12);
  const sub = useAt(13, 12);
  const panel = useAt(34, 13);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 280,
          background: C.red,
          transform: `translateX(${(1 - slab) * -100}%)`,
        }}
      />
      <div
        style={{
          ...rise(num, 20),
          position: "absolute",
          left: SAFE.left,
          top: 498,
          fontSize: 230,
          fontWeight: 900,
          lineHeight: 0.82,
          color: C.white,
          letterSpacing: -6,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        01
      </div>
      <div
        style={{
          ...rise(name, 24),
          position: "absolute",
          left: 320,
          top: 690,
          width: 560,
          fontSize: 72,
          fontWeight: 900,
          color: C.white,
          letterSpacing: -1,
          lineHeight: 1.05,
        }}
      >
        fast-anything
      </div>
      <div
        style={{
          ...rise(sub, 20),
          position: "absolute",
          left: 320,
          top: 782,
          width: 560,
          fontSize: 40,
          fontWeight: 600,
          color: C.steel,
          lineHeight: 1.2,
        }}
      >
        Khoanh vùng điểm nghẽn
      </div>

      <div
        style={{
          ...rise(panel, 56),
          position: "absolute",
          left: 320,
          top: 862,
          width: 560,
          height: 306,
          background: C.white,
          borderTop: `10px solid ${C.red}`,
          padding: "20px 22px 22px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar src={a("repos/EL4CTEO.png")} size={96} style={{ border: `4px solid ${C.navy}` }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: C.navy, lineHeight: 1.1 }}>
              fast-anything
            </div>
            <div style={{ fontSize: 34, fontWeight: 600, color: "#5E7393", marginTop: 4 }}>
              Rust · MIT
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            color: C.navy,
          }}
        >
          <span style={{ fontSize: 44, color: C.red, lineHeight: 1 }}>★</span>
          <StarNumber to={1971} at={34} style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.9 }} />
          <span style={{ fontSize: 34, fontWeight: 600, color: "#5E7393" }}>sao</span>
        </div>
      </div>
    </>
  );
};

const ProfileShot: React.FC = () => {
  const f = useCurrentFrame();
  const head = useAt(180, 12);
  const l1 = useAt(196, 12);
  const l2 = useAt(214, 12);
  const scan = interpolate(f, [186, 246], [18, 208], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const widths = [300, 210, 360, 280, 330, 240, 300, 380, 260, 320];

  return (
    <Area top={520}>
      <div
        style={{
          ...rise(head, 24),
          fontSize: 72,
          fontWeight: 900,
          color: C.white,
          lineHeight: 1.04,
          letterSpacing: -1,
        }}
      >
        <div>Tự tìm đúng</div>
        <div>hàm nặng nhất</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 206,
          width: 777,
          height: 276,
          background: "rgba(3, 14, 30, 0.88)",
          border: "2px solid rgba(255,255,255,0.2)",
          borderLeft: `9px solid ${C.red}`,
          padding: "18px 22px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {widths.map((w, i) => {
          const hot = i === 6;
          return (
            <div
              key={i}
              style={{
                height: 16,
                marginTop: i === 0 ? 0 : 9,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: hot ? 330 : w,
                  height: 12,
                  background: hot ? C.red : "rgba(220,235,252,0.26)",
                }}
              />
              {hot ? (
                <div style={{ fontSize: 34, fontWeight: 700, color: C.white }}>
                  hàm nặng nhất
                </div>
              ) : null}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: scan,
            height: 3,
            background: C.red,
            opacity: f < 260 ? 1 : 0,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 520,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ ...slide(l1, -30), fontSize: 44, fontWeight: 700, color: C.white }}>
          Tự động scan và profiling
        </div>
        <div style={{ ...slide(l2, -30), fontSize: 44, fontWeight: 700, color: C.white }}>
          Xác định đúng vòng lặp tốn CPU
        </div>
      </div>
    </Area>
  );
};

const KeepShot: React.FC = () => {
  const f = useCurrentFrame();
  const head = useAt(330, 12);
  const cells = Array.from({ length: 100 }, (_, i) => i);
  return (
    <Area top={520}>
      <div
        style={{
          ...rise(head, 24),
          fontSize: 64,
          fontWeight: 900,
          color: C.white,
          lineHeight: 1.06,
        }}
      >
        <div>Giữ nguyên 95%</div>
        <div>codebase cũ</div>
      </div>
      <div
        style={{
          marginTop: 34,
          display: "grid",
          gridTemplateColumns: "repeat(10, 40px)",
          gap: 7,
        }}
      >
        {cells.map((i) => {
          const on = interpolate(f, [334 + i * 0.32, 340 + i * 0.32], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const hot = i >= 95;
          return (
            <div
              key={i}
              style={{
                width: 40,
                height: 40,
                background: hot ? C.red : C.white,
                opacity: on * (hot ? 1 : 0.82),
              }}
            />
          );
        })}
      </div>
      <div style={{ marginTop: 24, display: "flex", gap: 26, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <RedSquare size={14} />
          <span style={{ fontSize: 38, fontWeight: 700, color: C.red }}>5% viết lại</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 14, height: 14, background: C.white }} />
          <span style={{ fontSize: 38, fontWeight: 700, color: C.white }}>95% giữ nguyên</span>
        </div>
      </div>
    </Area>
  );
};

export const FastIntro: React.FC<SceneProps> = ({ start, storyStart, storyEnd }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop
        src={CODE}
        globalStart={start}
        storyStart={storyStart}
        storyEnd={storyEnd}
        trimBefore={0}
        pos="50% 46%"
        dim={0.58}
      />
      {f < 180 ? <FastCard /> : null}
      {f >= 180 && f < 330 ? <ProfileShot /> : null}
      {f >= 330 ? <KeepShot /> : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// s4 — 4,91s to 42ms, then the 116x number.
// ---------------------------------------------------------------------------

const SpeedShot: React.FC = () => {
  const head = useAt(8, 12);
  const before = useAt(14, 12);
  const after = useAt(150, 13);
  const scaleAfter = 42 / 4910;
  const afterP = useAt(150, 16);
  return (
    <Area top={520}>
      <div style={{ ...rise(head, 24), fontSize: 58, fontWeight: 900, color: C.white }}>
        Lọc trùng mờ Python
      </div>
      <div style={{ marginTop: 4, fontSize: 36, fontWeight: 600, color: C.steel }}>
        700 tên
      </div>

      <div style={{ ...rise(before, 26), marginTop: 44 }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: C.steel }}>TRƯỚC</div>
        <div
          style={{
            fontSize: 132,
            fontWeight: 900,
            color: C.white,
            lineHeight: 0.95,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          4,91s
        </div>
        <div style={{ marginTop: 16, height: 38, background: C.red, width: 640 }} />
      </div>

      <div
        style={{
          ...rise(after, 30),
          marginTop: 46,
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 700, color: C.red }}>SAU</div>
        <div
          style={{
            fontSize: 132,
            fontWeight: 900,
            color: C.white,
            lineHeight: 0.95,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          42ms
        </div>
        <div
          style={{
            marginTop: 16,
            height: 38,
            width: 640 * scaleAfter * afterP,
            background: C.white,
            minWidth: 8,
          }}
        />
      </div>
    </Area>
  );
};

const BigXShot: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [330, 342], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const ts = useAt(372, 13);
  return (
    <Area top={520}>
      <div style={{ fontSize: 36, fontWeight: 700, color: C.steel }}>
        PYTHON · LỌC TRÙNG MỜ 700 TÊN
      </div>
      <div
        style={{
          opacity: p,
          transform: `scale(${1.12 - p * 0.12})`,
          transformOrigin: "0% 50%",
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          marginTop: 8,
        }}
      >
        <span
          style={{
            fontSize: 292,
            fontWeight: 900,
            color: C.white,
            lineHeight: 0.92,
            letterSpacing: -10,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          116
        </span>
        <span style={{ fontSize: 230, fontWeight: 900, color: C.red, lineHeight: 1 }}>×</span>
      </div>
      <div style={{ fontSize: 42, fontWeight: 700, color: C.white, marginTop: 2 }}>
        nhanh hơn
      </div>

      <div style={{ ...slide(ts, -30), marginTop: 34 }}>
        <div style={{ fontSize: 38, fontWeight: 700, color: C.steel }}>
          TypeScript · 2.000 tên
        </div>
        <div style={{ marginTop: 4, display: "flex", alignItems: "baseline", gap: 16 }}>
          <span style={{ fontSize: 56, fontWeight: 800, color: C.steel }}>3,11s</span>
          <span style={{ fontSize: 72, fontWeight: 900, color: C.white }}>155ms</span>
          <span style={{ fontSize: 56, fontWeight: 900, color: C.red }}>20×</span>
        </div>
        <div style={{ marginTop: 10, height: 26, width: 640 * (3.11 / 4.91), background: C.red }} />
        <div style={{ marginTop: 6, height: 26, width: Math.max(8, 640 * (0.155 / 4.91)), background: C.white }} />
      </div>
    </Area>
  );
};

export const Speed: React.FC<SceneProps> = ({ start, storyStart, storyEnd }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop
        src={CODE}
        globalStart={start}
        storyStart={storyStart}
        storyEnd={storyEnd}
        trimBefore={40}
        pos="50% 44%"
        dim={0.56}
      />
      {f < 330 ? <SpeedShot /> : <BigXShot />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// s5 — one function, one crate; 500 recorded calls; the edge cases.
// ---------------------------------------------------------------------------

const MetricRow: React.FC<{ p: number; text: string; sub?: string }> = ({ p, text, sub }) => (
  <div
    style={{
      ...slide(p, -30),
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: "26px 0",
      borderBottom: "2px solid rgba(255,255,255,0.12)",
    }}
  >
    <RedSquare size={14} />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 44, fontWeight: 700, color: C.white, lineHeight: 1.15 }}>
        {text}
      </div>
      {sub ? (
        <div style={{ fontSize: 34, fontWeight: 600, color: C.steel, marginTop: 2 }}>{sub}</div>
      ) : null}
    </div>
  </div>
);

// The opening board for s5. The middle-of-clip review still lands only a few
// frames after the cut, so the whole shot (headline, crate card and the three
// test facts) is on screen from its first frame; only a short fade runs.
const CrateShot: React.FC = () => {
  const head = useAt(0, 5);
  const main = useAt(0, 5);
  const r1 = useAt(0, 5);
  const r2 = useAt(1, 5);
  const r3 = useAt(2, 5);
  const foot = useAt(2, 5);
  return (
    <Area top={520}>
      <div
        style={{
          ...rise(head, 18),
          fontSize: 60,
          fontWeight: 900,
          color: C.white,
          lineHeight: 1.04,
          letterSpacing: -1,
        }}
      >
        <div>Kiểm thử 500</div>
        <div>edge cases</div>
      </div>

      <div
        style={{
          ...rise(main, 20),
          marginTop: 26,
          display: "flex",
          alignItems: "center",
          gap: 28,
        }}
      >
        <div
          style={{
            width: 190,
            height: 190,
            border: `9px solid ${C.white}`,
            borderTopColor: C.red,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 94, fontWeight: 900, color: C.white, lineHeight: 0.9 }}>1</div>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.steel, marginTop: 6 }}>CRATE</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 84, fontWeight: 900, color: C.white, lineHeight: 1 }}>
            1 hàm
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 14,
              fontSize: 84,
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            <span style={{ color: C.red }}>=</span>
            <span style={{ color: C.white }}>1 crate</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 30, borderTop: "2px solid rgba(255,255,255,0.18)" }}>
        <MetricRow p={r1} text="Biên dịch vài giây" sub="thay vì vài phút" />
        <MetricRow p={r2} text="Replay 500 lần gọi thực tế" />
        <MetricRow p={r3} text="Tự test NaN, ±∞, text non-ASCII" />
      </div>

      <div
        style={{
          ...slide(foot, -26),
          marginTop: 24,
          fontSize: 36,
          fontWeight: 600,
          color: C.steel,
          lineHeight: 1.25,
        }}
      >
        Mỗi bản port chỉ là một crate một hàm
      </div>
    </Area>
  );
};

const CallsShot: React.FC = () => {
  const f = useCurrentFrame();
  const cells = Array.from({ length: 500 }, (_, i) => i);
  const count = interpolate(f, [150, 240], [0, 500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <Area top={520}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <div
          style={{
            fontSize: 250,
            fontWeight: 900,
            color: C.white,
            lineHeight: 0.82,
            letterSpacing: -8,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(count)}
        </div>
        <div style={{ fontSize: 38, fontWeight: 700, color: C.steel, lineHeight: 1.2 }}>
          lần gọi
          <br />
          thực tế
        </div>
      </div>
      <div
        style={{
          marginTop: 26,
          display: "grid",
          gridTemplateColumns: "repeat(25, 18px)",
          gap: 5,
        }}
      >
        {cells.map((i) => {
          const on = interpolate(f, [148 + i * 0.24, 153 + i * 0.24], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{ width: 18, height: 18, background: C.white, opacity: on * 0.8 }}
            />
          );
        })}
      </div>
      <div style={{ marginTop: 22, fontSize: 36, fontWeight: 600, color: C.steel }}>
        replay nguyên văn từng lần gọi đã ghi
      </div>
    </Area>
  );
};

const EDGE = ["NaN", "±∞", "-0.0", "0 và ±1", "Text non-ASCII", "Input rỗng", "Lớn gấp 16×"];

const EdgeRow: React.FC<{ label: string; at: number; last: boolean }> = ({ label, at, last }) => {
  const p = useAt(at, 10);
  return (
    <div
      style={{
        ...slide(p, -26),
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "14px 0",
        borderBottom: last ? "none" : "2px solid rgba(255,255,255,0.12)",
      }}
    >
      <RedSquare size={14} />
      <span style={{ fontSize: 42, fontWeight: 700, color: C.white }}>{label}</span>
    </div>
  );
};

const EdgeShot: React.FC = () => {
  const head = useAt(360, 12);
  return (
    <Area top={520}>
      <div style={{ ...rise(head, 24), fontSize: 62, fontWeight: 900, color: C.white }}>
        Trường hợp biên
      </div>
      <div style={{ marginTop: 22, fontSize: 36, fontWeight: 600, color: C.steel }}>
        Tự sinh thêm ca và để code gốc trả lời
      </div>
      <div
        style={{
          marginTop: 20,
          background: "rgba(3, 14, 30, 0.86)",
          borderLeft: `9px solid ${C.red}`,
          padding: "10px 22px",
        }}
      >
        {EDGE.map((label, i) => (
          <EdgeRow key={label} label={label} at={362 + i * 2} last={i === EDGE.length - 1} />
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: 34, fontWeight: 600, color: C.steel }}>
        Mọi ca phải khớp, sai số 1e-9
      </div>
    </Area>
  );
};

export const Tests: React.FC<SceneProps> = ({ start, storyStart, storyEnd }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop
        src={CODE}
        globalStart={start}
        storyStart={storyStart}
        storyEnd={storyEnd}
        trimBefore={80}
        pos="50% 48%"
        dim={0.58}
      />
      {f < 140 ? <CrateShot /> : null}
      {f >= 140 && f < 360 ? <CallsShot /> : null}
      {f >= 360 ? <EdgeShot /> : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// s6 — the FFI gate: right but slower is still refused.
// ---------------------------------------------------------------------------

const BalanceShot: React.FC = () => {
  const head = useAt(6, 12);
  const sub = useAt(20, 12);
  const beam = useAt(30, 30);
  const tilt = interpolate(beam, [0, 1], [0, -11]);
  const panL = useAt(44, 16);
  const panR = useAt(52, 16);
  const caption = useAt(90, 13);
  return (
    <Area top={520}>
      <div style={{ ...rise(head, 24), fontSize: 64, fontWeight: 900, color: C.white }}>
        Bẫy FFI call overhead
      </div>
      <div style={{ ...rise(sub, 20), marginTop: 6, fontSize: 38, fontWeight: 600, color: C.steel }}>
        Khi gọi Rust tốn hơn phần tiết kiệm
      </div>

      <div style={{ position: "absolute", left: 0, top: 188, width: 777, height: 440 }}>
        <div
          style={{
            position: "absolute",
            left: 78,
            top: 78,
            width: 620,
            height: 12,
            background: C.white,
            transform: `rotate(${tilt}deg)`,
            transformOrigin: "50% 50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 386,
            top: 92,
            width: 6,
            height: 268,
            background: C.white,
            opacity: 0.75,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 366,
            top: 52,
            width: 0,
            height: 0,
            borderLeft: "22px solid transparent",
            borderRight: "22px solid transparent",
            borderBottom: `34px solid ${C.red}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 170,
            top: 110,
            width: 3,
            height: 92,
            background: "rgba(255,255,255,0.75)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 590,
            top: 72,
            width: 3,
            height: 80,
            background: "rgba(255,255,255,0.75)",
          }}
        />
        <div
          style={{
            ...rise(panL, 30),
            position: "absolute",
            left: 20,
            top: 198,
            width: 280,
            height: 144,
            background: "rgba(3,14,30,0.94)",
            border: `3px solid ${C.red}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 130, height: 18, background: C.red, marginBottom: 12 }} />
          <div style={{ fontSize: 36, fontWeight: 800, color: C.red }}>CHI PHÍ GỌI</div>
          <div style={{ fontSize: 34, fontWeight: 600, color: C.steel, marginTop: 4 }}>
            vào Rust
          </div>
        </div>
        <div
          style={{
            ...rise(panR, 26),
            position: "absolute",
            left: 477,
            top: 148,
            width: 280,
            height: 144,
            background: "rgba(3,14,30,0.94)",
            border: "3px solid rgba(255,255,255,0.7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 800, color: C.white }}>THỜI GIAN</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: C.white }}>TIẾT KIỆM</div>
        </div>
      </div>

      <div
        style={{
          ...slide(caption, -26),
          position: "absolute",
          left: 0,
          top: 670,
          display: "flex",
          alignItems: "center",
          gap: 14,
          width: 777,
        }}
      >
        <RedSquare size={14} />
        <span style={{ fontSize: 38, fontWeight: 700, color: C.white }}>
          Chi phí gọi lớn hơn phần tiết kiệm
        </span>
      </div>
    </Area>
  );
};

const RefuseShot: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [170, 184], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const who = useAt(174, 12);
  return (
    <Area top={520}>
      <div style={{ ...rise(who, 20), fontSize: 42, fontWeight: 700, color: C.steel }}>
        fast-anything
      </div>
      <div
        style={{
          opacity: p,
          transform: `translateY(${(1 - p) * 40}px)`,
          marginTop: 12,
        }}
      >
        <div
          style={{
            fontSize: 118,
            fontWeight: 900,
            color: C.red,
            lineHeight: 1,
            letterSpacing: -3,
          }}
        >
          TỪ CHỐI
        </div>
        <div
          style={{
            fontSize: 118,
            fontWeight: 900,
            color: C.white,
            lineHeight: 1,
            letterSpacing: -3,
          }}
        >
          KÍCH HOẠT
        </div>
      </div>
      <div style={{ marginTop: 28, height: 8, width: 200, background: C.red }} />
      <div
        style={{
          marginTop: 24,
          fontSize: 38,
          fontWeight: 600,
          color: C.steel,
          lineHeight: 1.35,
          maxWidth: 680,
        }}
      >
        Bản port đúng nhưng chậm hơn từng lần gọi thì không được bật.
      </div>
    </Area>
  );
};

const GATE = [
  "Chỉ kích hoạt khi thực sự nhanh hơn",
  "Loại bỏ chi phí switch ngữ cảnh FFI",
  "Tắt mở linh hoạt qua biến môi trường",
];

const GateRow: React.FC<{ text: string; i: number; at: number }> = ({ text, i, at }) => {
  const p = useAt(at, 13);
  return (
    <div
      style={{
        ...slide(p, -40),
        display: "flex",
        alignItems: "flex-start",
        gap: 20,
        borderTop: "2px solid rgba(255,255,255,0.16)",
        padding: "26px 0 30px",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          background: i === 0 ? C.red : "transparent",
          border: i === 0 ? "none" : `2px solid ${C.red}`,
          color: i === 0 ? "#FFFFFF" : C.red,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 34,
          fontWeight: 800,
          flexShrink: 0,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        0{i + 1}
      </div>
      <div style={{ fontSize: 46, fontWeight: 700, color: C.white, lineHeight: 1.22, textWrap: "balance" }}>
        {text}
      </div>
    </div>
  );
};

const GateList: React.FC = () => (
  <Area top={520}>
    <div style={{ display: "flex", flexDirection: "column" }}>
      {GATE.map((text, i) => (
        <GateRow key={text} text={text} i={i} at={300 + i * 20} />
      ))}
    </div>
  </Area>
);

export const Gate: React.FC<SceneProps> = ({ start, storyStart, storyEnd }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop
        src={CODE}
        globalStart={start}
        storyStart={storyStart}
        storyEnd={storyEnd}
        trimBefore={120}
        pos="50% 46%"
        dim={0.58}
      />
      {f < 170 ? <BalanceShot /> : null}
      {f >= 170 && f < 300 ? <RefuseShot /> : null}
      {f >= 300 ? <GateList /> : null}
    </AbsoluteFill>
  );
};
