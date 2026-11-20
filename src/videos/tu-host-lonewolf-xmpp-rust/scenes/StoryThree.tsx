import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Sfx } from "../../../kit";
import { C, F, SL, SW } from "../palette";
import { at, land } from "../plan";
import { LowerThird, Panel } from "../parts";

// s7 — v0.3.0 federation: two servers, one certificate-authenticated link.
export const Federation: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  const head = land(f, 0, 8);
  const hero = land(f, 2, 12);
  const link = land(f, at(start, 1.5), 12);
  const factA = at(start, 3.9);
  const factB = at(start, 7.2);
  const dot = (phase: number) => {
    const t = (f / 46 + phase) % 1;
    return t;
  };
  return (
    <AbsoluteFill>
      <Sfx id="pop" at={at(start, 1.2)} volume={0.26} />
      <Sfx id="ding" at={at(start, 3.9)} volume={0.24} />
      <Sfx id="pop" at={at(start, 7.2)} volume={0.22} />
      <div
        style={{
          position: "absolute",
          left: SL,
          top: 372,
          width: SW,
          fontFamily: F.sans,
          fontWeight: 700,
          fontSize: 48,
          lineHeight: 1,
          color: C.white,
          opacity: head,
          transform: `translateY(${(1 - head) * 22}px)`,
        }}
      >
        Tính năng v0.3.0
      </div>

      <div
        style={{
          position: "absolute",
          left: SL,
          top: 438,
          width: SW,
          fontFamily: F.sans,
          fontWeight: 900,
          fontSize: 108,
          lineHeight: 0.92,
          letterSpacing: -4,
          color: C.white,
          opacity: hero,
          transform: `translateY(${(1 - hero) * 34}px)`,
          textWrap: "balance",
        }}
      >
        LIÊN THÔNG
      </div>
      <div
        style={{
          position: "absolute",
          left: SL,
          top: 592,
          width: SW,
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 40,
          color: C.red,
          letterSpacing: 2,
          opacity: hero,
        }}
      >
        FEDERATION
      </div>

      <Panel at={at(start, 1.2)} y={688} h={338} style={{ padding: "28px 26px", boxSizing: "border-box" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            height: "100%",
            position: "relative",
          }}
        >
          <Node label="LONEWOLF" />
          <div style={{ position: "relative", flex: 1, height: "100%" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                height: 4,
                background: "rgba(255,255,255,0.55)",
                transform: "translateY(-50%)",
                transformOrigin: "0 50%",
                scale: `${link} 1`,
              }}
            />
            {link > 0.2
              ? [0, 0.33, 0.66].map((phase) => (
                  <div
                    key={phase}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: `${dot(phase) * 100}%`,
                      width: 16,
                      height: 16,
                      marginTop: -8,
                      marginLeft: -8,
                      borderRadius: 8,
                      background: C.red,
                      opacity: link,
                    }}
                  />
                ))
              : null}
            <div
              style={{
                position: "absolute",
                top: 42,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 34,
                color: C.white,
                opacity: link,
              }}
            >
              TLS
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 46,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 34,
                lineHeight: 1.15,
                color: C.red,
                opacity: link,
              }}
            >
              SASL
              <br />
              EXTERNAL
            </div>
          </div>
          <Node label="XMPP KHÁC" />
        </div>
      </Panel>

      <LowerThird
        at={factA}
        until={factB}
        y={1082}
        label="DIRECT TLS"
        text="Bảo mật ngay từ byte đầu tiên (XEP-0368)"
      />
      <LowerThird at={factB} y={1082} label="DIALBACK" text="Không dùng Server Dialback" />
    </AbsoluteFill>
  );
};

const Node: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      width: 208,
      height: 128,
      flexShrink: 0,
      border: "3px solid rgba(255,255,255,0.75)",
      borderRadius: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: F.sans,
      fontWeight: 800,
      fontSize: 34,
      color: C.white,
      textAlign: "center",
      padding: "0 10px",
      boxSizing: "border-box",
      background: "rgba(255,255,255,0.06)",
    }}
  >
    {label}
  </div>
);

// s8 — certificates from Let's Encrypt, message copies across devices.
export const Certs: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  const head = land(f, at(start, 0.15, "down"), 13);
  const acme = at(start, 1.4);
  const carbons = at(start, 5.4);
  const copy = land(f, at(start, 6.6), 14);
  return (
    <AbsoluteFill>
      <Sfx id="pop" at={acme} volume={0.24} />
      <Sfx id="pop" at={carbons} volume={0.24} />
      <Sfx id="ding" at={at(start, 6.6)} volume={0.22} />
      <div
        style={{
          position: "absolute",
          left: SL,
          top: 372,
          width: SW,
          fontFamily: F.sans,
          fontWeight: 900,
          fontSize: 66,
          lineHeight: 1.02,
          letterSpacing: -1.2,
          color: C.white,
          opacity: head,
          transform: `translateY(${(1 - head) * 26}px)`,
        }}
      >
        Let's Encrypt
        <br />
        và Carbons
      </div>

      <Panel at={acme} y={552} h={238} style={{ padding: "26px 28px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <div style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 54, color: C.red }}>ACME</div>
          <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: C.dim }}>Tự cấp và gia hạn</div>
        </div>
        <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 44, color: C.white, marginTop: 6 }}>
          Let's Encrypt
        </div>
        <div
          style={{
            marginTop: 12,
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 34,
            color: C.white,
            background: "rgba(255,255,255,0.08)",
            padding: "8px 16px",
            display: "inline-block",
          }}
        >
          provider = "letsencrypt"
        </div>
      </Panel>

      <Panel at={carbons} y={812} h={366} style={{ padding: "26px 28px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 48, color: C.white }}>CARBONS</div>
          <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 34, color: C.red }}>XEP-0280 · XEP-0297</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 18 }}>
          <Device />
          <div style={{ flex: 1, position: "relative", height: 186 }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 92,
                height: 3,
                background: "rgba(255,255,255,0.5)",
              }}
            />
            {[0, 0.5].map((phase) => {
              const t = ((f / 70 + phase) % 1);
              return (
                <div
                  key={phase}
                  style={{
                    position: "absolute",
                    top: 92 - 11,
                    left: `${t * 86}%`,
                    width: 22,
                    height: 22,
                    borderRadius: 3,
                    background: C.red,
                    opacity: copy,
                  }}
                />
              );
            })}
            <div
              style={{
                position: "absolute",
                top: 118,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: F.sans,
                fontWeight: 600,
                fontSize: 34,
                lineHeight: 1.2,
                color: C.dim,
              }}
            >
              Bản sao tin nhắn
            </div>
          </div>
          <Device />
        </div>
      </Panel>
    </AbsoluteFill>
  );
};

const Device: React.FC = () => (
  <div
    style={{
      width: 104,
      height: 186,
      flexShrink: 0,
      border: "3px solid rgba(255,255,255,0.75)",
      borderRadius: 12,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      background: "rgba(255,255,255,0.06)",
      padding: 10,
      boxSizing: "border-box",
    }}
  >
    <div style={{ width: "76%", height: 10, background: "rgba(255,255,255,0.7)", borderRadius: 2 }} />
    <div style={{ width: "52%", height: 10, background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
    <div style={{ width: "64%", height: 10, background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
  </div>
);
