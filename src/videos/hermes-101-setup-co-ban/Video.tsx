import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, Img, Sequence, interpolate, useCurrentFrame } from "remotion";
import {
  FPS,
  Music,
  SAFE,
  Sfx,
  Terminal,
  TikTokGuide,
  Voice,
  BRAND_SPACE,
  Brand,
  display,
  easeOut,
  mono,
  sans,
  typingFrames,
  videoAsset,
  whip,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import timeline from "./timeline.json";

const SLUG = "hermes-101-setup-co-ban";
const ACCENT = "#6C8CFF"; // the Informal logo's blue, lifted for a dark theme
const BG = "#0d1117";
const PANEL = "#161b22";
const GREEN = "#3fb950";
const RED = "#f85149";
const AMBER = "#e3b341";
const DIM = "#8b949e";
const T = 10; // transition frames

const sf = (s: number) => Math.round(s * FPS);
const tl = timeline.scenes as Record<string, { start: number; length: number }>;
const dur = durations as Record<string, number>;
const TOTAL = sf(timeline.total);

const SHOTS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((id) => ({ first: id, scenes: [id] }));
const shotStart = SHOTS.map((s) => sf(tl[s.first].start));
const shotLen = shotStart.map((s, i) => (i < SHOTS.length - 1 ? shotStart[i + 1] : TOTAL) - s);

type Row =
  | { kind: "note" | "ok" | "bad" | "warn" | "req"; text: string; at: number; until?: number }
  | { kind: "cmd"; text: string; at: number; until?: number };

const stars = facts.repos[0].stars;

const useFade = (at: number, until?: number) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [sf(at), sf(at) + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const b = until === undefined ? 1 : interpolate(f, [sf(until) - 8, sf(until)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { p: Math.min(a, b), gone: until !== undefined && f >= sf(until) };
};

const MARK: Record<string, { sym: string; color: string }> = {
  ok: { sym: "✓", color: GREEN },
  bad: { sym: "✗", color: RED },
  warn: { sym: "!", color: AMBER },
  req: { sym: "•", color: ACCENT },
};

const RowView: React.FC<{ row: Row }> = ({ row }) => {
  const { p, gone } = useFade(row.at, row.until);
  if (gone) return null;
  if (row.kind === "cmd") {
    return (
      <div style={{ opacity: p, margin: "0 -32px" }}>
        <Sequence from={sf(row.at)} layout="none">
          <Terminal cmds={[row.text]} width={777 - 80 + 64} fontSize={36} minHeight={0} bg="transparent" accent={ACCENT} />
        </Sequence>
      </div>
    );
  }
  if (row.kind === "note") {
    return (
      <div style={{ color: DIM, fontSize: 46, lineHeight: 1.3, opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
        <span style={{ color: ACCENT }}># </span>
        {row.text}
      </div>
    );
  }
  const m = MARK[row.kind];
  return (
    <div style={{ display: "flex", gap: 18, fontSize: 46, lineHeight: 1.3, color: "#e6edf3", opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
      <span style={{ color: m.color, fontWeight: 700, width: 34, flexShrink: 0 }}>{m.sym}</span>
      <span style={{ overflowWrap: "anywhere" }}>{row.text}</span>
    </div>
  );
};

const Headline: React.FC<{ items: { at: number; text: string }[] }> = ({ items }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "relative", height: 180 }}>
      {items.map((it, i) => {
        const end = items[i + 1] ? sf(items[i + 1].at) : Infinity;
        const a = interpolate(f, [sf(it.at), sf(it.at) + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
        const b = end === Infinity ? 1 : interpolate(f, [end - 6, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const o = Math.min(a, b);
        if (o <= 0) return null;
        return (
          <div
            key={it.text}
            style={{
              position: "absolute",
              inset: 0,
              fontFamily: display,
              fontWeight: 800,
              fontSize: 72,
              lineHeight: 1.05,
              color: "#fff",
              textWrap: "balance",
              opacity: o,
              transform: `translateY(${(1 - a) * 20}px)`,
            }}
          >
            {it.text}
          </div>
        );
      })}
    </div>
  );
};

const Counter: React.FC<{ items: { at: number; text: string }[] }> = ({ items }) => {
  const f = useCurrentFrame();
  let cur = items[0].text;
  items.forEach((i) => {
    if (f >= sf(i.at)) cur = i.text;
  });
  return <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 40, color: ACCENT, height: 56 }}>{cur}</div>;
};

const Badge: React.FC<{ at: number; until?: number; src: string; label: string; sub: string }> = ({ at, until, src, label, sub }) => {
  const { p, gone } = useFade(at, until);
  if (gone) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
      <Img src={videoAsset(SLUG, src)} style={{ width: 150, height: 150, borderRadius: 24, background: "#fff", objectFit: "cover" }} />
      <div style={{ fontFamily: mono, fontSize: 36, color: "#e6edf3", lineHeight: 1.35 }}>
        <div style={{ fontWeight: 700 }}>{label.split("/").map((x, i) => <div key={i}>{x}{i ? "" : "/"}</div>)}</div>
        <div style={{ color: DIM }}>{sub}</div>
      </div>
    </div>
  );
};

type ShotDef = {
  head: { at: number; text: string }[];
  counter: { at: number; text: string }[];
  rows: Row[];
  badges?: React.ReactNode;
  first?: boolean;
};

const ShotView: React.FC<ShotDef> = ({ head, counter, rows, badges, first }) => (
  <AbsoluteFill style={{ background: BG, fontFamily: sans }}>
    {first && <Brand />}
    <div
      style={{
        position: "absolute",
        top: SAFE.top + (first ? BRAND_SPACE : 0),
        bottom: SAFE.bottom,
        left: SAFE.left,
        right: SAFE.right,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <Counter items={counter} />
      <Headline items={head} />
      <div
        style={{
          flex: 1,
          background: PANEL,
          borderRadius: 28,
          border: "2px solid #30363d",
          padding: "40px 40px",
          fontFamily: mono,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          overflow: "hidden",
        }}
      >
        {rows.map((r, i) => (
          <RowView key={i} row={r} />
        ))}
        
        {badges}
      </div>
    </div>
  </AbsoluteFill>
);

const DEFS: ShotDef[] = [
  {
    first: true,
    head: [{ at: 0, text: "Tự dựng IBC relayer bằng Rust" }],
    counter: [{ at: 0, text: "Hermes 101" }],
    rows: [
      { kind: "note", text: "Kết nối các chain Cosmos", at: 0.7 },
      { kind: "note", text: "Tự vận hành relayer riêng", at: 1.9 },
    ],
  },
  {
    head: [{ at: 0, text: "Hermes hoạt động thế nào?" }],
    counter: [{ at: 0, text: "Hermes 101" }],
    rows: [
      { kind: "ok", text: "Quét chain state off-chain", at: 1.2 },
      { kind: "ok", text: "Tạo và gửi giao dịch liên chuỗi", at: 3.4 },
    ],
    badges: <Badge at={0.3} src="repos/informalsystems.png" label="informalsystems/hermes" sub={`${stars} sao · Rust`} />,
  },
  {
    head: [{ at: 0, text: "Coi chừng nhầm crate" }],
    counter: [{ at: 0, text: "Bước 1/3" }],
    rows: [
      { kind: "bad", text: "crate 'hermes' không liên quan", at: 0.8 },
      { kind: "ok", text: "dùng ibc-relayer-cli", at: 2.8 },
    ],
  },
  {
    head: [{ at: 0, text: "Yêu cầu Rust tối thiểu" }],
    counter: [{ at: 0, text: "Điều kiện tiên quyết" }],
    rows: [
      { kind: "ok", text: "Rust >= 1.85.0", at: 1.0 },
      { kind: "ok", text: "Mã nguồn mở Apache-2.0", at: 3.2 },
    ],
  },
  {
    head: [{ at: 0, text: "Cài đặt Hermes CLI" }],
    counter: [{ at: 0, text: "Bước 2/3" }],
    rows: [
      { kind: "cmd", text: "cargo install ibc-relayer-cli", at: 0.2 },
      { kind: "ok", text: "binary hermes cài toàn hệ thống", at: 1.9 },
    ],
  },
  {
    head: [{ at: 0, text: "Kiểm tra endpoint kết nối" }],
    counter: [{ at: 0, text: "Bước 3/3" }],
    rows: [
      { kind: "note", text: "Endpoint chain phải phản hồi HTTP 200", at: 0.2 },
      { kind: "req", text: "RPC /status", at: 2.4 },
      { kind: "req", text: "REST /cosmos/base/tendermint/v1beta1/syncing", at: 4.6 },
    ],
  },
  {
    head: [{ at: 0, text: "Giám sát và vận hành" }],
    counter: [{ at: 0, text: "Hermes có sẵn" }],
    rows: [
      { kind: "ok", text: "REST API để xem trạng thái relayer", at: 0.6 },
      { kind: "ok", text: "Prometheus endpoint ibc-telemetry", at: 2.6 },
      { kind: "warn", text: "Phát hành dạng as is, không cam kết bug-free", at: 5.0 },
    ],
  },
  {
    head: [{ at: 0, text: "Tự động hóa với ibc_refresh" }],
    counter: [{ at: 0, text: "Làm tiếp" }],
    rows: [
      { kind: "ok", text: "clear_packets", at: 0.8 },
      { kind: "ok", text: "update_client", at: 1.8 },
      { kind: "note", text: "Lưu video lại để thực hành và follow nhé", at: 3.4 },
    ],
    badges: <Badge at={0.3} src="repos/ChainTools-Tech.png" label="ChainTools-Tech/ibc_refresh" sub={`${facts.repos[1].stars} sao · Python`} />,
  },
];

const Component: React.FC<VideoProps> = ({ guide }) => {
  const voiceRanges = Object.keys(tl).map((id) => [sf(tl[id].start), sf(tl[id].start) + sf(dur[id])] as [number, number]);
  const presentations = DEFS.map((_, i) => (i % 2 ? whip(1) : fade()));
  return (
    <AbsoluteFill style={{ background: BG }}>
      <TransitionSeries>
        {DEFS.flatMap((d, i) => {
          const els = [
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={shotLen[i] + (i < DEFS.length - 1 ? T : 0)}>
              <ShotView {...d} />
            </TransitionSeries.Sequence>,
          ];
          if (i < DEFS.length - 1)
            els.push(
              <TransitionSeries.Transition key={`t${i}`} presentation={presentations[i] as never} timing={linearTiming({ durationInFrames: T })} />,
            );
          return els;
        })}
      </TransitionSeries>

      <Music slug={SLUG} total={TOTAL} voiceRanges={voiceRanges} />
      {Object.keys(tl).map((id) => (
        <Sequence key={id} from={sf(tl[id].start)} durationInFrames={sf(dur[id]) + 20} name={id}>
          <Voice slug={SLUG} id={id} />
        </Sequence>
      ))}
      {/* typing under the install command */}
      <Sequence from={shotStart[4] + sf(0.2) + 16} durationInFrames={typingFrames(["cargo install ibc-relayer-cli"])}>
        <Sfx id="typing" volume={0.25} />
      </Sequence>
      {[...shotStart.slice(1)].map((s, i) => (
        <Sfx key={`w${i}`} id="whoosh" at={s - 4} volume={0.25} />
      ))}
      <Sfx id="ding" at={shotStart[4] + sf(1.9)} volume={0.25} />
      <Sfx id="pop" at={shotStart[2] + sf(0.8)} volume={0.2} />
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = { id: SLUG, component: Component, durationInFrames: TOTAL };
