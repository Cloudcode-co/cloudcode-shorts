import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  BRAND_SPACE, Brand, FPS, Music, SAFE, Sfx, Terminal, TikTokGuide, TYPE_DELAY, Voice,
  display, easeOut, flash, mono, sans, typingFrames, whip, zoomPunch,
  type VideoDef, type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const ACCENT = "#FF4343"; // play-button red of the YouTube-for-TV client it drives
const GREEN = "#3DDC84";
const BG = "#0b0e14";
const T = 10; // transition frames

type Kind = "c" | "ok" | "bad" | "cmd";
type Row = [Kind, string];
type Def = {
  id: keyof typeof durations;
  step?: number;
  repo?: 0 | 1;
  footage?: string;
  cmds?: string[];
  rows: Row[];
  tr: "whip" | "zoom" | "flash" | "fade";
};

const DEFS: Def[] = [
  { id: "s1", footage: "living-room-smart-tv-couch-pixabay-185888.mp4", tr: "whip", rows: [
    ["c", "LG webOS và Samsung Tizen"], ["c", "Không hỗ trợ app SmartTube"],
    ["bad", "SmartTube: chỉ Android TV"], ["c", "Vậy bỏ qua quảng cáo kiểu gì?"] ] },
  { id: "s2", repo: 1, tr: "zoom", rows: [
    ["c", "SmartTube chỉ chạy Android"], ["c", "Yêu cầu Android 4.3 trở lên"],
    ["bad", "LG webOS"], ["bad", "Samsung Tizen"], ["bad", "Apple TV"],
    ["bad", "FireTV mới (VegaOS)"] ] },
  { id: "s3", repo: 0, tr: "whip", rows: [
    ["c", "iSponsorBlockTV: tự host"], ["c", "Điều khiển app YouTube gốc"],
    ["ok", "Homelab hoặc VPS"], ["ok", "LG webOS, Samsung Tizen"], ["ok", "Apple TV, Android TV, Roku"] ] },
  { id: "s4", repo: 0, tr: "flash", rows: [
    ["c", "Dùng SponsorBlock API"], ["ok", "Tự nhảy qua đoạn sponsor"],
    ["ok", "Tự bấm nút Skip Ad"], ["ok", "Tự tắt tiếng khi có quảng cáo"],
    ["c", "Skip ngay khi nút xuất hiện"], ["c", "Đoạn sponsor, intro..."] ] },
  { id: "s5", repo: 0, footage: "server-rack-datacenter-blinking-lights-pixabay-14900.mp4", tr: "whip", rows: [
    ["c", "Host không cần chung mạng LAN"], ["ok", "Chỉ cần kết nối youtube.com"],
    ["ok", "VPS ngoài internet vẫn chạy"], ["ok", "Homelab trong nhà cũng được"],
    ["c", "Thêm TV thủ công bằng TV code"] ] },
  { id: "s6", step: 1, repo: 0, tr: "whip", cmds: ["pipx install isponsorblocktv", "uv tool install isponsorblocktv"], rows: [
    ["ok", "Cài từ PyPI"], ["c", "Chỉ cần đúng một lệnh"],
    ["c", "Từ source: Python 3.11+"], ["ok", "Docker image chỉ khoảng 26.3 MB"] ] },
  { id: "s7", step: 2, repo: 0, footage: "person-typing-on-mechanical-keyboard-pixabay-10822.mp4", tr: "whip", cmds: ["isponsorblocktv --setup-cli"], rows: [
    ["c", "Mở app YouTube trên TV"], ["c", "Settings, Link with TV code"],
    ["ok", "Nhập mã vào CLI"], ["ok", "Không cần chung mạng LAN"], ["c", "Hợp khi chạy từ xa, không GUI"] ] },
  { id: "s8", step: 3, repo: 0, tr: "fade", cmds: ["iSponsorBlockTV"], rows: [
    ["ok", "Ghép nối xong"], ["c", "Chạy nền, tự lắng nghe TV"],
    ["ok", "Tự skip sponsor"], ["ok", "Tự mute và bấm Skip Ad"], ["c", "Có cả Add-on Home Assistant"] ] },
  { id: "s9", repo: 0, tr: "zoom", rows: [
    ["bad", "Không chặn như Pi-hole"], ["c", "Chỉ bấm Skip Ad và mute"],
    ["bad", "YouTube Shorts chưa hỗ trợ đủ"], ["bad", "Apple TV + AirPlay: không mute"],
    ["c", "Biết trước hạn chế rồi hãy dựng"] ] },
  { id: "s10", repo: 0, tr: "fade", rows: [
    ["c", "Lưu video để cấu hình sau"], ["cmd", "pipx install isponsorblocktv"],
    ["cmd", "isponsorblocktv --setup-cli"], ["cmd", "iSponsorBlockTV"],
    ["c", "Follow kênh để cập nhật mẹo"], ["ok", "Tự host, tự skip quảng cáo"] ] },
];

const lenOf = (id: string) => Math.round((timeline.scenes as Record<string, { length: number }>)[id].length * FPS);
const LENS = DEFS.map((d) => lenOf(d.id));
const STARTS = LENS.map((_, i) => LENS.slice(0, i).reduce((a, b) => a + b, 0));
const TOTAL = LENS.reduce((a, b) => a + b, 0);
const VOICE_RANGES: [number, number][] = DEFS.map((d, i) => [STARTS[i], STARTS[i] + Math.round(durations[d.id] * FPS)]);
const scriptOf = (id: string) => script.scenes.find((s) => s.id === id)!;

const kindColor: Record<Kind, string> = { c: "#8b95a7", ok: GREEN, bad: ACCENT, cmd: "#fff" };
const mark: Record<Kind, string> = { c: "#", ok: "✓", bad: "✗", cmd: "$" };

const Cursor: React.FC<{ on: boolean }> = ({ on }) => (
  <span style={{ display: "inline-block", width: "0.5em", height: "1em", marginLeft: 6, verticalAlign: "-0.14em", background: on ? ACCENT : "transparent" }} />
);

const Scene: React.FC<{ d: Def; len: number }> = ({ d, len }) => {
  const f = useCurrentFrame();
  const sc = scriptOf(d.id);
  const hasCmd = !!d.cmds;
  const cmdEnd = hasCmd ? TYPE_DELAY + typingFrames(d.cmds!) : 0;
  const first = hasCmd ? cmdEnd + 14 : 14;
  const n = d.rows.length;
  const gap = Math.min(78, Math.floor((len - first - 30) / Math.max(1, n - 1)));
  const starts = d.rows.map((_, k) => first + k * gap);
  const pulse = Math.max(0, ...starts.map((s) => (f < s ? 0 : interpolate(f - s, [0, 9], [1, 0], { extrapolateRight: "clamp" }))));
  const cmdPulse = hasCmd && f >= TYPE_DELAY && f < TYPE_DELAY + 9 ? 1 - (f - TYPE_DELAY) / 9 : 0;
  const p = Math.max(pulse, cmdPulse);
  const head = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  const win = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  const cursorOn = Math.floor(f / 16) % 2 === 0;
  const repo = d.repo === undefined ? null : facts.repos[d.repo];
  const lastIdx = starts.reduce((a, s, k) => (f >= s ? k : a), -1);
  const topPad = d.id === "s1" ? SAFE.top + BRAND_SPACE : SAFE.top;
  const fs = 54;

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: sans }}>
      {d.footage && (
        <AbsoluteFill>
          <OffthreadVideo src={staticFile(`videos/${SLUG}/footage/${d.footage}`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <AbsoluteFill style={{ background: "rgba(8,10,16,0.72)" }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ padding: `${topPad}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`, display: "flex", flexDirection: "column" }}>
        <div style={{ opacity: head, transform: `translateY(${(1 - head) * 20}px)` }}>
          {d.step && (
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 44, color: ACCENT, marginBottom: 10 }}>
              Bước {d.step}/3
            </div>
          )}
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 76, lineHeight: 1.06, color: "#fff", textWrap: "balance" as never }}>
            {sc.headline}
          </div>
        </div>
        <div
          style={{
            marginTop: 34, flex: 1, background: "rgba(13,17,23,0.96)", borderRadius: 28,
            border: `3px solid ${p > 0 ? ACCENT : "#232a36"}`, overflow: "hidden",
            opacity: win, transform: `scale(${(0.97 + 0.03 * win) * (1 + 0.008 * p)})`,
            display: "flex", flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 28px", background: "#151b25", borderBottom: "2px solid #232a36" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
            ))}
            {repo && (
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12, fontFamily: sans, fontWeight: 700, fontSize: 34, color: "#c9d1de" }}>
                <Img src={staticFile(`videos/${SLUG}/${repo.avatar}`)} style={{ width: 46, height: 46, borderRadius: 23 }} />
                <span style={{ fontVariantNumeric: "tabular-nums" }}>★ {repo.stars.toLocaleString("en-US")}</span>
              </div>
            )}
          </div>
          <div style={{ padding: "34px 32px", color: "#fff" }}>
            {hasCmd && (
              <div style={{ margin: "-26px -32px 30px" }}>
                <Terminal cmds={d.cmds!} width={777} fontSize={34} minHeight={0} bg="transparent" accent={ACCENT} />
              </div>
            )}
            {d.rows.map((r, k) => {
              if (f < starts[k]) return null;
              const text = r[1];
              const isCmd = r[0] === "cmd";
              const cps = Math.max(0.6, text.length / Math.max(10, gap - 14));
              const typed = Math.min(text.length, Math.floor((f - starts[k]) * cps));
              const active = k === lastIdx;
              return (
                <div key={k} style={{ display: "flex", gap: 18, fontFamily: isCmd ? mono : sans, fontWeight: isCmd ? 500 : 700, fontSize: isCmd ? 36 : fs, lineHeight: 1.25, marginBottom: 34, color: r[0] === "c" ? "#c9d1de" : kindColor[r[0]] }}>
                  <span style={{ fontFamily: mono, color: isCmd ? ACCENT : kindColor[r[0]], width: 40, flex: "none" }}>{mark[r[0]]}</span>
                  <div style={{ flex: 1, textWrap: "balance" as never }}>
                    {text.slice(0, typed)}
                    {active && <Cursor on={cursorOn} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
      <Voice slug={SLUG} id={d.id} />
      <Sfx id="whoosh" volume={0.25} />
      {hasCmd && <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(d.cmds!)} volume={0.3} />}
      {starts.map((s, k) => (d.rows[k][0] === "ok" ? <Sfx key={k} id="pop" at={s} volume={0.18} /> : null))}
      {d.id === "s1" && <Brand />}
    </AbsoluteFill>
  );
};

const pres = (t: Def["tr"]) =>
  t === "whip" ? whip(1) : t === "zoom" ? zoomPunch() : t === "flash" ? flash(ACCENT) : fade();

const Main: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ background: BG }}>
    <TransitionSeries>
      {DEFS.flatMap((d, i) => {
        const last = i === DEFS.length - 1;
        const items = [
          <TransitionSeries.Sequence key={d.id} name={d.id} durationInFrames={LENS[i] + (last ? 0 : T)}>
            <Scene d={d} len={LENS[i]} />
          </TransitionSeries.Sequence>,
        ];
        if (!last) {
          items.push(
            <TransitionSeries.Transition key={`t${i}`} presentation={pres(d.tr) as never} timing={linearTiming({ durationInFrames: T })} />,
          );
        }
        return items;
      })}
    </TransitionSeries>
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = { id: SLUG, component: Main, durationInFrames: TOTAL };
