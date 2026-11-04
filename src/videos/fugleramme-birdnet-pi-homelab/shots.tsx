import React from "react";
import { Img, Sequence, useCurrentFrame } from "remotion";
import { BRAND_SPACE, Brand, CONTENT_W, SAFE, Sfx, Terminal, TYPE_DELAY, Voice, display, mono, typingFrames, videoAsset } from "../../kit";
import facts from "./facts.json";
import script from "./script.json";
import { C, Headline, Light, LogFeed, Panel, Row, Stage, dots, ramp, rise } from "./parts";

const SLUG = script.slug;
const stars = (repo: string) => facts.repos.find((r) => r.repo === repo)?.stars ?? 0;
const CMDS = script.scenes[6].commands;

const Green: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: C.green }}>{children}</span>;

// ---------- Shot A: hook + the two services (s1, s2)
const Service: React.FC<{
  name: string;
  avatar: string;
  stars: number;
  lang: string;
  desc: string;
  at: number;
}> = ({ name, avatar, stars: n, lang, desc, at }) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + 14);
  const on = f >= at;
  return (
    <Panel
      title={name}
      right={on ? "UP" : "off"}
      rightColor={on ? C.green : C.dim}
      on={on}
      style={{ width: (CONTENT_W - 20) / 2, height: 380 }}
      bodyStyle={{ padding: "14px 18px" }}
    >
      {!on && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 34, color: C.dim }}>
          offline{Math.floor(f / 16) % 2 === 0 ? "_" : " "}
        </div>
      )}
      <div style={{ opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, height: 84 }}>
          <Img src={videoAsset(SLUG, avatar)} style={{ width: 84, height: 84, borderRadius: 14 }} />
          <div style={{ fontFamily: mono, fontSize: 34, color: C.dim, lineHeight: 1.1 }}>
            stars
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 46, color: C.amber }}>{dots(n)}</div>
          </div>
        </div>
        <div style={{ fontFamily: mono, fontSize: 34, color: C.dim, height: 48, lineHeight: "48px" }}>
          lang <span style={{ color: C.text, fontWeight: 700 }}>{lang}</span>
        </div>
        <div style={{ fontSize: 34, lineHeight: "40px", fontWeight: 700, color: C.text }}>{desc}</div>
      </div>
    </Panel>
  );
};

export const ShotA: React.FC<{ s2: number }> = ({ s2 }) => {
  const f = useCurrentFrame();
  const a = f < s2 ? ramp(f, 6, 22) : 0;
  const b = f >= s2 ? ramp(f, s2, s2 + 16) : 0;
  const wave = Array.from({ length: 33 }, (_, i) =>
    14 + 100 * Math.abs(Math.sin(f / 7 + i * 0.7) * Math.sin(f / 13 + i * 0.31)),
  );
  return (
    <Stage top={SAFE.top + BRAND_SPACE} outside={<Brand />}>
      <div style={{ position: "relative", height: 200 }}>
        <Headline style={{ position: "absolute", ...rise(a, 30) }}>
          Khung tranh <Green>AI</Green> tự vẽ chim?
        </Headline>
        <Headline style={{ position: "absolute", ...rise(b, 30) }}>
          Fugleramme và <Green>BirdNET-Go</Green>
        </Headline>
      </div>
      <Panel
        title="mic.stream"
        right={f < s2 ? "LIVE" : "LIVE x2"}
        style={{ height: 466, marginTop: 8 }}
        bodyStyle={{ padding: "14px 20px" }}
      >
        <div style={{ height: 116, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: ramp(f, 14, 30) }}>
          {wave.map((h, i) => (
            <div key={i} style={{ width: 12, height: h, borderRadius: 4, background: i % 7 === 3 ? C.amber : C.green }} />
          ))}
        </div>
        <Row color={C.green} p={ramp(f, 80, 94)} height={52}>Nghe tiếng hót đoán loài</Row>
        <Row color={C.cyan} p={ramp(f, 170, 184)} height={52}>Tự đổi tranh cổ điển</Row>
        <div style={{ marginTop: 8 }}>
          <LogFeed from={30} every={26} rows={3} />
        </div>
      </Panel>
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <Service name="fugleramme" avatar="repos/arnegiacomo.png" stars={stars("arnegiacomo/fugleramme")} lang="Python" desc="Xuất tranh cổ điển thời gian thực" at={s2} />
        <Service name="birdnet-go" avatar="repos/tphakala.png" stars={stars("tphakala/birdnet-go")} lang="Go" desc="AI nhận diện tiếng chim local" at={s2 + 8} />
      </div>
      <Voice slug={SLUG} id="s1" />
      <Sequence from={s2}>
        <Voice slug={SLUG} id="s2" />
        <Sfx id="ding" volume={0.3} />
        <Sfx id="pop" at={8} volume={0.25} />
      </Sequence>
      <Sfx id="pop" at={80} volume={0.2} />
      <Sfx id="pop" at={170} volume={0.2} />
    </Stage>
  );
};

// ---------- Shot B: artwork, scale, engine (s3, s4, s5)
const Standby: React.FC<{ p: number }> = ({ p }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 34, color: C.dim, opacity: 1 - p, pointerEvents: "none" }}>
      standby{Math.floor(f / 16) % 2 === 0 ? "_" : " "}
    </div>
  );
};

export const ShotB: React.FC<{ s4: number; s5: number }> = ({ s4, s5 }) => {
  const f = useCurrentFrame();
  const count = Math.round(1200 * ramp(f, 40, 170));
  const p2 = ramp(f, s4, s4 + 14);
  const p3 = ramp(f, s5, s5 + 14);
  const on2 = f >= s4;
  const on3 = f >= s5;
  const dotsAt = [0, 1, 2, 3, 4];
  const D: [number, number, number][] = [
    [0, 0, 60],
    [-92, -52, 40],
    [98, 44, 31],
    [-62, 88, 23],
    [76, -84, 17],
  ];
  return (
    <Stage>
      <Panel title="artwork.store" right="OK" style={{ height: 396 }} bodyStyle={{ padding: "6px 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, ...rise(ramp(f, 0, 14)) }}>
          <span style={{ fontFamily: display, fontWeight: 600, fontSize: 56, color: C.dim }}>gần</span>
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 190, lineHeight: 1.1, color: C.green, fontVariantNumeric: "tabular-nums" }}>
            {dots(count)}
          </span>
        </div>
        <Row color={C.green} p={ramp(f, 110, 124)} height={50} size={38}>Cắt thủ công, sách thế kỷ 19</Row>
        <Row color={C.green} p={ramp(f, 230, 244)} height={50} size={38} font={mono} status="0">AI-generated</Row>
      </Panel>

      <Panel
        title={on2 ? "avonet.scale" : "avonet"}
        right={on2 ? "SYNC" : "idle"}
        rightColor={on2 ? C.green : C.dim}
        on={on2}
        light={C.cyan}
        style={{ height: 360, marginTop: 20 }}
      >
        <Standby p={p2} />
        <div style={{ display: "flex", gap: 14, opacity: p2 }}>
          <svg width={270} height={270} viewBox="-135 -135 270 270" style={{ flex: "none" }}>
            <circle r={126} fill="none" stroke={C.line} strokeWidth={2} />
            <circle r={84} fill="none" stroke={C.line} strokeWidth={2} />
            <circle r={42} fill="none" stroke={C.line} strokeWidth={2} />
            {D.map(([x, y, r], i) => {
              const q = ramp(f, s4 + 20 + dotsAt[i] * 16, s4 + 38 + dotsAt[i] * 16, 0.5, 1);
              return <circle key={i} cx={x} cy={y} r={r * q} fill={i === 0 ? C.green : C.cyan} opacity={q === 0.5 ? 0.4 : 0.9} />;
            })}
          </svg>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 18, fontSize: 36, fontWeight: 700, lineHeight: "42px" }}>
            <div>Dữ liệu sinh học <Green>AVONET</Green></div>
            <div style={{ color: C.dim }}>Chim càng lớn càng ở trung tâm</div>
          </div>
        </div>
      </Panel>

      <Panel
        title={on3 ? "birdnet-go.engine" : "birdnet-go"}
        right={on3 ? "24/7" : "idle"}
        rightColor={on3 ? C.green : C.dim}
        on={on3}
        style={{ height: 394, marginTop: 20 }}
        bodyStyle={{ padding: "8px 20px" }}
      >
        <Standby p={p3} />
        <div style={{ opacity: p3 }}>
          <Row color={C.green} p={ramp(f, s5 + 24, s5 + 38)} height={50} size={38} font={mono} status="ON">BirdNET v2.4</Row>
          <Row color={C.green} p={ramp(f, s5 + 60, s5 + 74)} height={50} size={38} font={mono} status="ON">Perch v2</Row>
          <Row color={C.cyan} p={ramp(f, s5 + 120, s5 + 134)} height={50} size={38} font={mono} status="MQTT">Home Assistant</Row>
          <div style={{ marginTop: 10 }}>
            <LogFeed from={s5 + 30} every={24} rows={3} lines={["mic: listening", "model: scan window", "match: species found", "mqtt: publish ok"]} />
          </div>
        </div>
      </Panel>
      <Voice slug={SLUG} id="s3" />
      <Sequence from={s4}>
        <Voice slug={SLUG} id="s4" />
        <Sfx id="pop" volume={0.25} />
      </Sequence>
      <Sequence from={s5}>
        <Voice slug={SLUG} id="s5" />
        <Sfx id="ding" volume={0.3} />
      </Sequence>
      <Sfx id="pop" at={40} volume={0.2} />
      <Sfx id="thud" at={170} volume={0.25} />
    </Stage>
  );
};

// ---------- Shot C: hardware check, then the install (s6, s7)
export const ShotC: React.FC<{ s7: number }> = ({ s7 }) => {
  const f = useCurrentFrame();
  const q = ramp(f, s7 - 4, s7 + 22);
  const h1 = 720 - 650 * q;
  const rowH = 128 - 44 * q;
  const size = 50 - 12 * q;
  const rows: { name: string; ok: boolean; status: string; at: number }[] = [
    { name: "Pi 4 (64-bit)", ok: true, status: "tối thiểu", at: 30 },
    { name: "Pi 3", ok: false, status: "ngừng hỗ trợ", at: 190 },
    { name: "Pi Zero", ok: false, status: "ngừng hỗ trợ", at: 250 },
    { name: "mic mono", ok: true, status: "bắt buộc", at: 370 },
    { name: "mic stereo", ok: false, status: "lệch pha", at: 450 },
  ];
  const typeStart = s7 + 30;
  return (
    <Stage>
      <Panel title="hw.check" right={f < s7 ? "scan" : "done"} rightColor={C.amber} light={C.amber} style={{ height: h1 }} bodyStyle={{ padding: "4px 20px" }}>
        {q < 0.6 && rows.map((r) => (
          <Row key={r.name} color={r.ok ? C.green : C.red} p={ramp(f, r.at, r.at + 14)} height={rowH} size={size} font={mono} status={r.status}>
            {r.name}
          </Row>
        ))}
      </Panel>
      <Panel title="docker compose" right={f < typeStart ? "ready" : "run"} rightColor={C.amber} light={C.amber} style={{ height: 1190 - h1 - 20, marginTop: 20 }} bodyStyle={{ padding: 10 }}>
        {f < typeStart ? (
          <Terminal cmds={[""]} width={CONTENT_W - 24} fontSize={46} minHeight={900} bg="#0a100e" accent={C.green} />
        ) : (
          <Sequence from={typeStart}>
            <Terminal cmds={CMDS} width={CONTENT_W - 24} fontSize={46} minHeight={900} bg="#0a100e" accent={C.green} />
          </Sequence>
        )}
      </Panel>
      <Voice slug={SLUG} id="s6" />
      <Sfx id="pop" at={30} volume={0.2} />
      <Sfx id="thud" at={190} volume={0.25} />
      <Sfx id="thud" at={250} volume={0.25} />
      <Sfx id="pop" at={370} volume={0.2} />
      <Sfx id="thud" at={450} volume={0.25} />
      <Sequence from={s7}>
        <Voice slug={SLUG} id="s7" />
        <Sfx id="whoosh" volume={0.2} />
      </Sequence>
      <Sfx id="typing" at={typeStart + TYPE_DELAY} frames={typingFrames(CMDS)} volume={0.25} />
    </Stage>
  );
};

// ---------- Shot D: ports, then the species database (s8, s9)
export const ShotD: React.FC<{ s9: number }> = ({ s9 }) => {
  const f = useCurrentFrame();
  const q = ramp(f, s9 - 4, s9 + 24);
  const hPorts = 1190 - 1190 * q;
  const hSpecies = 1190 - hPorts - 20;
  const n = Math.round(765 * ramp(f, s9 + 30, s9 + 130));
  const fill = ramp(f, s9 + 30, s9 + 130) * (765 / 6435);
  return (
    <Stage>
      {hSpecies > 40 && (
        <Panel title="artwork" right="OK" style={{ height: hSpecies, marginBottom: q >= 1 ? 0 : 20 }} bodyStyle={{ padding: "6px 20px", display: "flex", flexDirection: "column", justifyContent: "space-around", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 225, lineHeight: 1.1, color: C.green, fontVariantNumeric: "tabular-nums" }}>{n}</span>
            <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 64, color: C.dim }}>/ {dots(6435)}</span>
          </div>
          <div style={{ height: 22, borderRadius: 11, background: C.line, overflow: "hidden" }}>
            <div style={{ width: `${fill * 100}%`, minWidth: 0, height: "100%", background: C.green }} />
          </div>
          <div style={{ fontSize: 56, fontWeight: 700, marginTop: 30, ...rise(ramp(f, s9 + 40, s9 + 54)) }}>loài đã có sẵn tranh</div>
          <div style={{ marginTop: 0, fontFamily: mono, fontSize: 46, color: C.text, border: `2px dashed ${C.line}`, borderRadius: 10, padding: "26px 18px", ...rise(ramp(f, s9 + 250, s9 + 266)) }}>
            <span style={{ color: C.green }}>/ </span>assets/artwork/custom/
          </div>
          <div style={{ fontSize: 54, fontWeight: 700, color: C.dim, marginTop: 40, ...rise(ramp(f, s9 + 280, s9 + 294)) }}>Thả ảnh vào đây là xong</div>
        </Panel>
      )}
      {q < 0.85 && <Panel title="sockets" right="LISTEN" style={{ height: hPorts, overflow: "hidden" }} bodyStyle={{ padding: "6px 20px", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
        <div style={rise(ramp(f, 20, 36))}>
          <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 170 - 110 * q, color: C.green, lineHeight: 1.1 }}>8080</span>
          <div style={{ fontSize: 56 - 20 * q, fontWeight: 700 }}>chế độ Kiosk</div>
        </div>
        <div style={rise(ramp(f, 150, 166))}>
          <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 110 - 60 * q, color: C.cyan, lineHeight: 1.1 }}>/admin</span>
          <div style={{ fontSize: 50 - 14 * q, fontWeight: 700 }}>trang quản trị, tinh chỉnh</div>
        </div>
        <div style={rise(ramp(f, 290, 306))}>
          <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 64 - 24 * q, color: C.amber }}>Inky Impression</span>
          <div style={{ fontSize: 50 - 14 * q, fontWeight: 700 }}>e-ink hay màn TV đều đẹp</div>
        </div>
      </Panel>}
      <Voice slug={SLUG} id="s8" />
      <Sfx id="ding" at={20} volume={0.3} />
      <Sfx id="pop" at={150} volume={0.25} />
      <Sfx id="pop" at={290} volume={0.25} />
      <Sequence from={s9}>
        <Voice slug={SLUG} id="s9" />
        <Sfx id="whoosh" volume={0.2} />
        <Sfx id="thud" at={130} volume={0.25} />
        <Sfx id="pop" at={250} volume={0.25} />
      </Sequence>
    </Stage>
  );
};

// ---------- Shot E: outro board (s10)
export const ShotE: React.FC = () => {
  const f = useCurrentFrame();
  const items = ["fugleramme", "birdnet-go", "1.200 tranh", "avonet", "pi 4 + mic mono", "docker compose", ":8080 /admin", "765 loài"];
  return (
    <Stage>
      <Headline size={104} style={{ marginTop: 40, ...rise(ramp(f, 0, 18), 30) }}>
        Lưu lại để <Green>dựng thử!</Green>
      </Headline>
      <Panel title="weekend.build" right="ALL UP" style={{ height: 640, marginTop: 28 }} bodyStyle={{ padding: "6px 20px" }}>
        {items.map((it, i) => (
          <Row key={it} color={C.green} p={ramp(f, 14 + i * 7, 28 + i * 7)} height={72} size={42} font={mono} status="UP">
            {it}
          </Row>
        ))}
      </Panel>
      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 48, fontWeight: 700, ...rise(ramp(f, 80, 96)) }}>
          <Light color={C.amber} size={26} />Lưu video cuối tuần thực hành
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 48, fontWeight: 700, ...rise(ramp(f, 140, 156)) }}>
          <Light color={C.amber} size={26} />Bấm theo dõi để đón mẹo mới
        </div>
      </div>
      <Voice slug={SLUG} id="s10" />
      <Sfx id="ding" at={80} volume={0.3} />
      <Sfx id="ding" at={140} volume={0.3} />
    </Stage>
  );
};
