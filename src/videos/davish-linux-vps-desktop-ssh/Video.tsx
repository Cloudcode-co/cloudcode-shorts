// A what-if simulation seen through the viewer's eyes: a live SSH session
// flies through a server world while the telemetry ticks. Footage is graded
// and cut on the track's downbeats; the desktop, tunnel, key, log, RAM timer
// and warning are drawn in code.
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  Brand,
  FPS,
  Music,
  SAFE,
  Sfx,
  TikTokGuide,
  Voice,
  easeOut,
  flash,
  mono,
  sans,
  whip,
  zoomPunch,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import script from "./script.json";
import {
  IDS,
  SCENE_DUR,
  SHOTS,
  SESSION,
  START,
  SUBS,
  SUDO_AT,
  TELE_AT,
  TOTAL,
  type Id,
  type ShotSpec,
} from "./data";
import { ICE, INK, WHITE, serif, type Tone } from "./palette";
import { FootageShot, Vignette, cameraStyle } from "./parts";
import {
  CommandGate,
  DawnWorld,
  DesktopVoid,
  DragFile,
  EmptyRack,
  GpuChip,
  KeyArt,
  LogTape,
  PortDoor,
  ScriptWorld,
  SshLink,
  SudoRam,
  TerminalStage,
  ToolField,
  TwoServers,
  WarningField,
} from "./worlds";

const SLUG = script.slug;

const Shot: React.FC<{ spec: ShotSpec; len: number }> = ({ spec, len }) => {
  const f = useCurrentFrame();
  const tone: Tone = spec.tone;
  switch (spec.kind) {
    case "footage":
      return (
        <FootageShot
          clip={spec.clip ?? "racks"}
          trim={spec.trim ?? 0}
          t={f}
          len={len}
          tone={tone}
          pos={spec.pos}
          drive={spec.drive}
        />
      );
    case "terminal":
      return <TerminalStage t={f} tone={tone} variant={spec.variant ?? 1} />;
    case "desktop":
      return <DesktopVoid t={f} len={len} tone={tone} variant={spec.variant ?? 1} />;
    case "link":
      return <SshLink t={f} tone={tone} />;
    case "key":
      return <KeyArt t={f} tone={tone} />;
    case "gate":
      return <CommandGate t={f} len={len} tone={tone} variant={spec.variant ?? 1} />;
    case "port":
      return <PortDoor t={f} tone={tone} />;
    case "log":
      return <LogTape t={f} tone={tone} variant={spec.variant ?? 1} />;
    case "script":
      return <ScriptWorld t={f} tone={tone} />;
    case "sudo":
      return <SudoRam t={f} len={len} tone={tone} variant={spec.variant ?? 1} />;
    case "two":
      return <TwoServers t={f} tone={tone} />;
    case "drag":
      return <DragFile t={f} len={len} tone={tone} />;
    case "tools":
      return <ToolField t={f} tone={tone} />;
    case "warning":
      return <WarningField t={f} len={len} tone={tone} variant={spec.variant ?? 1} />;
    case "gpu":
      return <GpuChip t={f} tone={tone} variant={spec.variant ?? 1} />;
    case "dawn":
      return <DawnWorld t={f} variant={spec.variant ?? 1} />;
    case "rack":
      return <EmptyRack t={f} tone={tone} />;
    default:
      return null;
  }
};

const Scene: React.FC<{ id: Id }> = ({ id }) => {
  const dur = SCENE_DUR(id);
  const shots = SHOTS[id];
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      {shots.map((s, i) => {
        const next = shots[i + 1]?.at ?? dur;
        const len = Math.max(2, next - s.at);
        return (
          <Sequence key={`${id}-${s.at}`} from={s.at} durationInFrames={len} layout="none">
            <Shot spec={s} len={len} />
          </Sequence>
        );
      })}
      <Voice slug={SLUG} id={id} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ HUD

const fmt = (v: number, dec = 0) => {
  const [int, d] = v.toFixed(dec).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return d ? `${grouped},${d}` : grouped;
};

const clock = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const Telemetry: React.FC = () => {
  const f = useCurrentFrame();
  const { id, cfg: base } = TELE_AT(f);
  const session = id === "s6" && f < SUDO_AT;
  const cfg = session
    ? { ...base, ...SESSION, at: START("s6"), clock: false }
    : base;
  const local = f - (session ? START("s6") : cfg.at);
  let value: string;
  if (session) {
    value = clock(f / FPS);
  } else if (cfg.clock) {
    value = clock(900 - local / FPS);
  } else {
    const v = interpolate(local, [0, Math.max(1, cfg.dur)], [cfg.from, cfg.to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: id === "s7" ? (p) => p : easeOut,
    });
    value = fmt(v, cfg.dec ?? 0);
  }
  const inP = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top + 84,
        opacity: inP,
        transform: `translateY(${(1 - inP) * 8}px)`,
        textShadow: "0 2px 26px rgba(0,0,0,0.9)",
      }}
    >
      <div
        style={{
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 7,
          color: cfg.accent,
          opacity: 0.85,
          whiteSpace: "nowrap",
        }}
      >
        {cfg.label}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", marginTop: 4 }}>
        <span
          style={{
            fontFamily: mono,
            fontWeight: 700,
            fontSize: cfg.clock ? 150 : 168,
            lineHeight: 0.94,
            letterSpacing: -3,
            color: WHITE,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 36,
            letterSpacing: 2,
            color: cfg.accent,
            opacity: 0.82,
            marginLeft: 20,
            marginBottom: 18,
            whiteSpace: "nowrap",
          }}
        >
          {cfg.unit}
        </span>
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 34,
          letterSpacing: 4,
          color: "rgba(234,244,255,0.66)",
          whiteSpace: "nowrap",
        }}
      >
        {cfg.sub}
      </div>
    </div>
  );
};

const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  let idx = 0;
  for (let i = 0; i < SUBS.length; i++) if (f >= SUBS[i].at) idx = i;
  const cur = SUBS[idx];
  const next = SUBS[idx + 1];
  const end = next ? next.at : TOTAL;
  const p = interpolate(f, [cur.at, cur.at + 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  // A line leaves fast on its last 5 frames, so the next shot's line lands clean.
  const out = interpolate(f, [end - 5, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      key={idx}
      style={{
        position: "absolute",
        left: SAFE.left,
        width: 1080 - SAFE.left - SAFE.right,
        bottom: SAFE.bottom + 34,
        textAlign: "center",
        fontFamily: serif,
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: 52,
        lineHeight: 1.14,
        letterSpacing: 0.2,
        color: "#F2F8FF",
        opacity: p * out,
        transform: `translateY(${(1 - p) * 10}px)`,
        textWrap: "balance",
        textShadow:
          "0 3px 28px rgba(0,0,0,0.95), 0 1px 6px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.8)",
      }}
    >
      {cur.text}
    </div>
  );
};

// ------------------------------------------------------------------ shake

const sceneAt = (f: number): Id => {
  let id: Id = "s1";
  for (const k of IDS) if (f >= START(k)) id = k;
  return id;
};

const BASE_SHAKE: Record<Id, number> = {
  s1: 0.28,
  s2: 0.42,
  s3: 0.3,
  s4: 0.3,
  s5: 0.32,
  s6: 0.4,
  s7: 0.85,
  s8: 0.62,
  s9: 0.22,
};

const dropHit = (f: number) => {
  const at = START("s7") + 9;
  const d = f - at;
  return d >= 0 && d < 26 ? Math.pow(1 - d / 26, 2) : 0;
};

const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const build = Math.max(0, Math.min(1, (f - (START("s7") - 142)) / 142));
  const alarm = sceneAt(f) === "s8" ? 0.2 : 0;
  const acc = BASE_SHAKE[sceneAt(f)] + dropHit(f) * 2.4 + build * 0.5 + alarm;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: INK }}>
      <AbsoluteFill style={cameraStyle(acc, f, 3)}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ video

const SceneSfx: React.FC<{ id: Id }> = ({ id }) => {
  if (id === "s1") return <Sfx id="thud" volume={0.35} />;
  if (id === "s2") return <Sfx id="whoosh" volume={0.22} />;
  if (id === "s3") return <Sfx id="pixel" volume={0.2} />;
  if (id === "s4") return <Sfx id="whoosh" volume={0.2} />;
  if (id === "s5") return <Sfx id="whoosh" volume={0.18} />;
  if (id === "s6") return <Sfx id="pixel" volume={0.18} />;
  if (id === "s7")
    return (
      <>
        <Sfx id="thud" at={9} volume={0.55} />
        <Sfx id="ding" at={9} volume={0.22} />
      </>
    );
  if (id === "s8") return <Sfx id="thud" volume={0.3} />;
  return (
    <>
      <Sfx id="whoosh" volume={0.16} />
      <Sfx id="pixel" at={65} volume={0.18} />
    </>
  );
};

const VOICE_RANGES: [number, number][] = IDS.map((id): [number, number] => [
  START(id),
  START(id) + Math.round((durations as Record<string, number>)[id] * FPS),
]).filter(([a, b]) => b > a);

const Davish: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ backgroundColor: INK }}>
    <Camera>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Hook" durationInFrames={SCENE_DUR("s1")}>
          <Scene id="s1" />
          <Brand />
          <SceneSfx id="s1" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={flash("#F7C48B")}
          timing={linearTiming({ durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence name="The old way" durationInFrames={SCENE_DUR("s2")}>
          <Scene id="s2" />
          <SceneSfx id="s2" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={flash(ICE)}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="Agentless" durationInFrames={SCENE_DUR("s3")}>
          <Scene id="s3" />
          <SceneSfx id="s3" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={zoomPunch()}
          timing={linearTiming({ durationInFrames: 8 })}
        />
        <TransitionSeries.Sequence name="SSH key" durationInFrames={SCENE_DUR("s4")}>
          <Scene id="s4" />
          <SceneSfx id="s4" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={whip(1)}
          timing={linearTiming({ durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence name="Transparent" durationInFrames={SCENE_DUR("s5")}>
          <Scene id="s5" />
          <SceneSfx id="s5" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 8 })}
        />
        <TransitionSeries.Sequence name="Command log" durationInFrames={SCENE_DUR("s6")}>
          <Scene id="s6" />
          <SceneSfx id="s6" />
        </TransitionSeries.Sequence>
        {/* Hard cut into the drop. */}
        <TransitionSeries.Sequence name="Workspace" durationInFrames={SCENE_DUR("s7")}>
          <Scene id="s7" />
          <SceneSfx id="s7" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={flash("#FF4234")}
          timing={linearTiming({ durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence name="Caveats" durationInFrames={SCENE_DUR("s8")}>
          <Scene id="s8" />
          <SceneSfx id="s8" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence name="Outro" durationInFrames={SCENE_DUR("s9")}>
          <Scene id="s9" />
          <SceneSfx id="s9" />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </Camera>
    <Vignette />
    <Telemetry />
    <Subtitles />
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: Davish,
  durationInFrames: TOTAL,
};
