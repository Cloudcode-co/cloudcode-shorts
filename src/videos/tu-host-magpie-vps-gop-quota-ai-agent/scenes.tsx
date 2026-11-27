import { Easing, Img, interpolate, useCurrentFrame } from "remotion";
import {
  CONTENT_W,
  display,
  easeOut,
  sans,
  snap,
  Sfx,
  TYPE_DELAY,
  typingFrames,
  type BrandIcon,
} from "../../kit";
import {
  siClaude,
  siDocker,
  siGithubcopilot,
  siGo,
  siPostgresql,
} from "simple-icons";
import { C, DUR, MAP, SCENES, STARTS, a, repoOf } from "./data";
import {
  ArrowRight,
  BrandGlyph,
  Caption,
  Headline,
  LowerThird,
  ProviderTile,
  QuotaBar,
  RepoCard,
  Rise,
  TerminalPanel,
  useP,
} from "./parts";

const durF = (i: number) => DUR[SCENES[i].id] * 60;

// Local frame at which the voice reaches roughly `frac` of its line.
const at = (i: number, frac: number) => Math.round(durF(i) * frac) + 8;

// The same, but snapped to the nearest beat so a slam lands with the music.
const snapLocal = (i: number, local: number) =>
  Math.max(0, snap(MAP.beats, STARTS[i] + local) - STARTS[i]);

// ---------------------------------------------------------------------------
// 1/3 — the quota runs out

const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const drain = interpolate(f, [26, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.77, 0, 0.175, 1),
  });
  const empty = f > 148;
  return (
    <>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 44 }}>
        <Headline
          delay={6}
          parts={[
            { text: "Cạn quota", color: C.red, size: 136 },
            { text: "khi code dở", color: C.white, size: 104 },
          ]}
        />
        <Rise delay={38} dy={24}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, color: C.white }}>
                Hạn mức Claude
              </span>
              <span
                style={{
                  fontFamily: display,
                  fontWeight: 800,
                  fontSize: 42,
                  color: C.red,
                  opacity: empty ? 1 : 0,
                  transform: `translateY(${empty ? 0 : 8}px)`,
                }}
              >
                CẠN
              </span>
            </div>
            <div
              style={{
                height: 36,
                background: "rgba(255,255,255,0.18)",
                position: "relative",
              }}
            >
              <div style={{ height: "100%", width: `${(1 - drain) * 100}%`, background: C.red }} />
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: -9,
                  width: 4,
                  height: 54,
                  background: C.white,
                  opacity: 0.6,
                }}
              />
            </div>
          </div>
        </Rise>
      </div>
      <LowerThird lines={SCENES[0].lines} delay={at(0, 0.18)} stagger={20} />
    </>
  );
};

// ---------------------------------------------------------------------------
// 1/3 — one pool for every plan

const Converge: React.FC<{ p: number }> = ({ p }) => (
  <svg width={CONTENT_W} height={56} viewBox={`0 0 ${CONTENT_W} 56`} style={{ display: "block" }}>
    {[75, CONTENT_W / 2, CONTENT_W - 75].map((x, k) => (
      <path
        key={k}
        d={`M ${x} 0 C ${x} 32, ${CONTENT_W / 2} 18, ${CONTENT_W / 2} 50`}
        fill="none"
        stroke={k === 1 ? C.red : C.white}
        strokeWidth={4}
        strokeDasharray={150}
        strokeDashoffset={150 * (1 - p)}
        opacity={k === 1 ? 1 : 0.7}
      />
    ))}
    <circle cx={CONTENT_W / 2} cy={50} r={8} fill={C.red} opacity={p} />
  </svg>
);

const Scene2: React.FC = () => {
  const i = 1;
  const magAt = snapLocal(i, at(i, 0.55));
  const p = useP(magAt, 18);
  return (
    <>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
        <Headline
          delay={6}
          parts={[
            { text: "Gom mọi gói", size: 96 },
            { text: "vào một pool", size: 96 },
          ]}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <ProviderTile label="ChatGPT" delay={26} />
          <ProviderTile label="Claude" icon={siClaude} delay={34} />
          <ProviderTile label="Copilot" icon={siGithubcopilot} delay={42} />
        </div>
        <Converge p={p} />
        <RepoCard name="Magpie" delay={magAt} big />
      </div>
      <LowerThird
        lines={SCENES[i].lines}
        delay={at(i, 0.26)}
        stagger={Math.round(durF(i) * 0.3)}
      />
      {[0, 1, 2].map((k) => (
        <Sfx key={k} id="pop" at={26 + k * 8} volume={0.2} />
      ))}
      <Sfx id="pop" at={magAt} volume={0.28} />
      <Sfx id="ding" at={magAt + 3} volume={0.24} />
    </>
  );
};

// ---------------------------------------------------------------------------
// 1/3 — failover, then smart routing

const AccountPanel: React.FC<{
  title: string;
  value: number;
  tag: string;
  danger?: boolean;
  delay: number;
}> = ({ title, value, tag, danger = false, delay }) => {
  const f = useCurrentFrame();
  const p = useP(delay, 16);
  const v = interpolate(f, [delay, delay + 40], [danger ? 0.12 : 1, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <div
      style={{
        flex: 1,
        background: C.white,
        borderTop: `8px solid ${danger ? C.red : C.navy}`,
        padding: "16px 20px 18px",
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px)`,
        boxShadow: "0 14px 32px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontWeight: 700,
          fontSize: 34,
          color: C.navy,
          lineHeight: 1.08,
          minHeight: 42,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", marginTop: 10 }}>
        <QuotaBar value={v} color={danger ? C.red : C.navy} height={24} />
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 34,
          color: danger ? C.red : C.navy,
          whiteSpace: "nowrap",
        }}
      >
        {tag}
      </div>
    </div>
  );
};

const SmartTiles: React.FC<{ delay: number; moveAt: number }> = ({ delay, moveAt }) => {
  const f = useCurrentFrame();
  const p = useP(delay, 16);
  const move = interpolate(f, [moveAt, moveAt + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.77, 0, 0.175, 1),
  });
  const x = [0, 1, 2].map((k) => {
    const from = k * 210;
    const to = k === 2 ? 0 : k === 0 ? 210 : 420;
    return from + (to - from) * move;
  });
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 22}px)` }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 14,
          marginBottom: 12,
        }}
      >
        <span style={{ width: 12, height: 12, background: C.red }} />
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.white }}>
          Chế độ smart
        </span>
      </div>
      <div style={{ position: "relative", width: 610, height: 108 }}>
        {[0, 1, 2].map((k) => {
          const hot = k === 2;
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: x[k],
                top: 0,
                width: 190,
                height: 104,
                background: hot ? C.white : C.navy2,
                borderTop: `6px solid ${hot ? C.red : "rgba(255,255,255,0.2)"}`,
                padding: "12px 14px",
                boxShadow: hot ? "0 12px 26px rgba(0,0,0,0.35)" : undefined,
              }}
            >
              <div
                style={{
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: 34,
                  color: hot ? C.red : C.mist,
                  whiteSpace: "nowrap",
                }}
              >
                {hot ? "sắp reset" : "còn hạn"}
              </div>
              <div style={{ display: "flex", marginTop: 12 }}>
                <QuotaBar value={hot ? 0.35 : k === 1 ? 0.8 : 0.6} color={hot ? C.red : C.white} height={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Scene3: React.FC = () => {
  const i = 2;
  const arrowP = useP(at(i, 0.24), 20);
  const smartAt = at(i, 0.52);
  return (
    <>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
        <Headline
          delay={6}
          parts={[
            { text: "Tự động failover", size: 90 },
            { text: "thông minh", size: 90 },
          ]}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <AccountPanel title="Gói hiện tại" value={0.04} tag="CẠN" danger delay={12} />
          <div
            style={{
              width: 168,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Img
              src={a(repoOf("Magpie").avatar)}
              style={{ width: 52, height: 52, borderRadius: 26, border: `2px solid ${C.white}` }}
            />
            <span
              style={{
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 34,
                color: C.white,
                whiteSpace: "nowrap",
              }}
            >
              gateway
            </span>
            <ArrowRight p={arrowP} width={88} />
          </div>
          <AccountPanel title="Gói kế tiếp" value={0.92} tag="SẴN SÀNG" delay={34} />
        </div>
        <SmartTiles delay={smartAt} moveAt={at(i, 0.68)} />
      </div>
      <LowerThird
        lines={SCENES[i].lines}
        delay={at(i, 0.16)}
        stagger={Math.round(durF(i) * 0.4)}
      />
      {[12, 34].map((d) => (
        <Sfx key={d} id="pop" at={d} volume={0.22} />
      ))}
      <Sfx id="pop" at={smartAt} volume={0.24} />
    </>
  );
};

// ---------------------------------------------------------------------------
// 2/3 — LiteLLM

const ReqRow: React.FC<{
  icon?: BrandIcon;
  text: string;
  tag?: string;
  delay: number;
  dark?: boolean;
}> = ({ icon, text, tag, delay, dark = false }) => {
  const p = useP(delay, 16);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: dark ? C.navy2 : C.white,
        borderLeft: `10px solid ${C.red}`,
        padding: "16px 22px",
        opacity: p,
        transform: `translateX(${(1 - p) * -50}px)`,
        boxShadow: "0 14px 30px rgba(0,0,0,0.32)",
      }}
    >
      {icon ? (
        <BrandGlyph icon={icon} size={54} color={dark ? C.white : C.navy} />
      ) : (
        <span style={{ width: 22, height: 22, background: C.red, flex: "none" }} />
      )}
      <span
        style={{
          flex: 1,
          fontFamily: display,
          fontWeight: 700,
          fontSize: 40,
          color: dark ? C.white : C.navy,
          lineHeight: 1.1,
        }}
      >
        {text}
      </span>
      {tag ? (
        <span
          style={{
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 34,
            color: C.red,
            borderLeft: `6px solid ${C.red}`,
            paddingLeft: 12,
            whiteSpace: "nowrap",
          }}
        >
          {tag}
        </span>
      ) : null}
    </div>
  );
};

const Scene4: React.FC = () => {
  const i = 3;
  return (
    <>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>
        <Headline
          delay={6}
          parts={[
            { text: "So sánh", size: 96 },
            { text: "với LiteLLM", size: 96 },
          ]}
        />
        <RepoCard name="LiteLLM" delay={at(i, 0.12)} big />
        <ReqRow text="API key trả phí" delay={at(i, 0.3)} />
        <ReqRow
          icon={siPostgresql}
          text="Cần PostgreSQL"
          tag="BẮT BUỘC"
          delay={at(i, 0.46)}
          dark
        />
      </div>
      <LowerThird
        lines={SCENES[i].lines}
        delay={at(i, 0.14)}
        stagger={Math.round(durF(i) * 0.36)}
      />
      <Sfx id="ding" at={at(i, 0.12) + 2} volume={0.24} />
      <Sfx id="pop" at={at(i, 0.46)} volume={0.24} />
    </>
  );
};

// ---------------------------------------------------------------------------
// 2/3 — what Magpie actually is

const Scene5: React.FC = () => {
  const i = 4;
  const flowAt = at(i, 0.34);
  const arrowP = useP(flowAt, 18);
  return (
    <>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>
        <Headline
          delay={6}
          parts={[
            { text: "Bản chất", size: 96 },
            { text: "của Magpie", size: 96 },
          ]}
        />
        <Rise delay={18} dy={24}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              background: C.white,
              borderBottom: `8px solid ${C.red}`,
              padding: "20px 28px",
              boxShadow: "0 16px 34px rgba(0,0,0,0.35)",
            }}
          >
            <BrandGlyph icon={siGo} size={104} />
            <div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 58, color: C.navy, lineHeight: 1 }}>
                viết bằng Go
              </div>
              <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 34, color: "rgba(7,26,51,0.7)", marginTop: 6 }}>
                một gateway gọn nhẹ
              </div>
            </div>
          </div>
        </Rise>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Rise delay={flowAt} dy={20} style={{ flex: 1 }}>
            <div style={{ background: C.white, padding: "16px 20px", borderTop: `6px solid ${C.red}` }}>
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.red }}>
                Gói thuê bao cá nhân
              </div>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.navy, marginTop: 6 }}>
                ChatGPT · Claude · Copilot
              </div>
            </div>
          </Rise>
          <ArrowRight p={arrowP} width={70} />
          <Rise delay={flowAt + 12} dy={20} style={{ flex: 1 }}>
            <div style={{ background: C.navy2, borderLeft: `10px solid ${C.red}`, padding: "16px 20px" }}>
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.mist }}>
                bất kỳ agent nào
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                {["Claude Code", "Codex"].map((x) => (
                  <div key={x} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 10, height: 10, background: C.red }} />
                    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 38, color: C.white }}>{x}</span>
                  </div>
                ))}
              </div>
            </div>
          </Rise>
        </div>
      </div>
      <LowerThird
        lines={SCENES[i].lines}
        delay={at(i, 0.12)}
        stagger={Math.round(durF(i) * 0.4)}
      />
      <Sfx id="pop" at={flowAt} volume={0.24} />
    </>
  );
};

// ---------------------------------------------------------------------------
// 2/3 — privacy masking

const MaskRow: React.FC<{ label: string; delay: number }> = ({ label, delay }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span
        style={{
          width: 185,
          flex: "none",
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 38,
          color: C.white,
        }}
      >
        {label}
      </span>
      <div style={{ position: "relative", flex: 1, height: 40, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: C.white,
            clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
            opacity: p,
          }}
        >
          <span style={{ fontFamily: sans, fontSize: 34, letterSpacing: 6, color: C.navy }}>
            ••••••••
          </span>
        </div>
      </div>
    </div>
  );
};

const Scene6: React.FC = () => {
  const i = 5;
  const maskAt = at(i, 0.28);
  return (
    <>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
        <Headline
          delay={6}
          parts={[
            { text: "Bảo mật", size: 88 },
            { text: "privacy masking", size: 84 },
          ]}
        />
        <Rise delay={16} dy={24}>
          <div
            style={{
              background: C.navy2,
              border: `2px solid rgba(255,255,255,0.14)`,
              borderTop: `6px solid ${C.red}`,
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              boxShadow: "0 16px 36px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.mist }}>
              Nội dung prompt
            </div>
            <MaskRow label="API key" delay={maskAt} />
            <MaskRow label="mật khẩu" delay={maskAt + 22} />
            <MaskRow label="email" delay={maskAt + 44} />
          </div>
        </Rise>
        <Rise delay={at(i, 0.58)} dy={18}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 12, height: 12, background: C.red }} />
            <span style={{ fontFamily: display, fontWeight: 700, fontSize: 40, color: C.white }}>
              Che trên máy trước khi gửi
            </span>
          </div>
        </Rise>
      </div>
      <LowerThird
        lines={SCENES[i].lines}
        delay={at(i, 0.18)}
        stagger={Math.round(durF(i) * 0.32)}
      />
      <Sfx id="pop" at={maskAt} volume={0.22} />
      <Sfx id="pop" at={maskAt + 44} volume={0.22} />
    </>
  );
};

// ---------------------------------------------------------------------------
// 3/3 — install

const Scene7: React.FC = () => {
  const i = 6;
  const cmds = SCENES[i].commands;
  return (
    <>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 30 }}>
        <Headline delay={0} parts={[{ text: "Cài đặt Magpie", size: 88 }]} />
        <Caption text="Một lệnh chính thức" delay={6} color={C.mist} size={40} />
        <TerminalPanel cmds={cmds} termDelay={6} fontSize={38} minHeight={340} />
      </div>
      <LowerThird lines={SCENES[i].lines} delay={at(i, 0.2)} />
      <Sfx id="thud" at={6} volume={0.42} />
      <Sfx id="typing" at={6 + TYPE_DELAY} frames={typingFrames(cmds)} volume={0.22} />
    </>
  );
};

// ---------------------------------------------------------------------------
// 3/3 — Docker on the VPS

const Scene8: React.FC = () => {
  const i = 7;
  const cmds = SCENES[i].commands;
  return (
    <>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>
        <Headline
          delay={6}
          parts={[
            { text: "Chạy Docker", size: 92 },
            { text: "trên VPS", size: 92 },
          ]}
        />
        <Rise delay={20} dy={24}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 22 }}>
            <BrandGlyph icon={siDocker} size={72} color={C.white} />
            <div
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: 180,
                lineHeight: 0.82,
                color: C.white,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: -6,
                textShadow: "0 4px 30px rgba(5,14,30,0.55)",
              }}
            >
              3430
            </div>
            <div style={{ paddingBottom: 16, whiteSpace: "nowrap" }}>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 42, color: C.white }}>
                Web UI
              </div>
            </div>
          </div>
        </Rise>
        <TerminalPanel cmds={cmds} termDelay={20} fontSize={38} minHeight={220} />
      </div>
      <LowerThird
        lines={SCENES[i].lines}
        delay={at(i, 0.12)}
        stagger={Math.round(durF(i) * 0.4)}
      />
      <Sfx id="pop" at={20} volume={0.24} />
      <Sfx id="typing" at={20 + TYPE_DELAY} frames={typingFrames(cmds)} volume={0.22} />
    </>
  );
};

// ---------------------------------------------------------------------------
// 3/3 — remote OAuth sign-in

const StepRow: React.FC<{ n: number; text: string; delay: number; last?: boolean }> = ({
  n,
  text,
  delay,
  last = false,
}) => {
  const p = useP(delay, 16);
  return (
    <div style={{ display: "flex", gap: 16, opacity: p, transform: `translateX(${(1 - p) * -26}px)` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 44 }}>
        <div
          style={{
            width: 44,
            height: 44,
            background: C.red,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: display,
            fontWeight: 800,
            fontSize: 34,
            color: C.white,
            flex: "none",
          }}
        >
          {n}
        </div>
        {!last && <div style={{ width: 3, flex: 1, background: "rgba(255,255,255,0.35)", marginTop: 6 }} />}
      </div>
      <div
        style={{
          flex: 1,
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 38,
          color: C.white,
          lineHeight: 1.15,
          padding: "5px 0 16px",
          textShadow: "0 2px 16px rgba(5,14,30,0.5)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Scene9: React.FC = () => {
  const i = 8;
  const cmds = SCENES[i].commands;
  const steps = [
    { text: "Đăng nhập Codex", delay: at(i, 0.16) },
    { text: "Trình duyệt trả callback về localhost", delay: at(i, 0.42) },
    { text: "Dán URL vào giao diện", delay: at(i, 0.68) },
  ];
  return (
    <>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
        <Headline
          delay={6}
          parts={[
            { text: "Đăng nhập", size: 92 },
            { text: "OAuth từ xa", size: 92 },
          ]}
        />
        <TerminalPanel cmds={cmds} termDelay={34} fontSize={38} minHeight={200} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {steps.map((s, k) => (
            <StepRow key={s.text} n={k + 1} text={s.text} delay={s.delay} last={k === steps.length - 1} />
          ))}
        </div>
      </div>
      <LowerThird
        lines={SCENES[i].lines}
        delay={at(i, 0.1)}
        stagger={Math.round(durF(i) * 0.45)}
      />
      {steps.map((s) => (
        <Sfx key={s.text} id="pop" at={s.delay} volume={0.2} />
      ))}
      <Sfx id="typing" at={34 + TYPE_DELAY} frames={typingFrames(cmds)} volume={0.22} />
    </>
  );
};

// ---------------------------------------------------------------------------
// outro

const Scene10: React.FC = () => (
  <>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 30 }}>
      <Rise delay={4} dy={18}>
        <div style={{ width: 200, height: 12, background: C.red }} />
      </Rise>
      <Headline
        delay={8}
        parts={[
          { text: "Lưu video", size: 156 },
          { text: "để dựng trạm Magpie", color: C.mist, size: 76 },
        ]}
      />
      <Rise delay={44} dy={22}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            background: C.white,
            borderLeft: `12px solid ${C.red}`,
            padding: "18px 26px",
            boxShadow: "0 16px 34px rgba(0,0,0,0.38)",
          }}
        >
          <span style={{ width: 12, height: 12, background: C.red }} />
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 42, color: C.navy }}>
            Follow để xem mẹo AI mới
          </span>
        </div>
      </Rise>
    </div>
    <RepoCard name="Magpie" delay={62} style={{ marginTop: 12 }} />
    <Sfx id="ding" at={12} volume={0.26} />
    <Sfx id="pop" at={44} volume={0.24} />
  </>
);

// ---------------------------------------------------------------------------

const BODIES: React.FC[] = [
  Scene1,
  Scene2,
  Scene3,
  Scene4,
  Scene5,
  Scene6,
  Scene7,
  Scene8,
  Scene9,
  Scene10,
];

export const SceneBody: React.FC<{ i: number }> = ({ i }) => {
  const Body = BODIES[i] as React.FC;
  return <Body />;
};
