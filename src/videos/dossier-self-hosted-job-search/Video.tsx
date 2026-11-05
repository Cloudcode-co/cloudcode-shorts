import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, Sequence } from "remotion";
import {
  BRAND_SPACE,
  Brand,
  Music,
  SAFE,
  Sfx,
  TYPE_DELAY,
  Terminal,
  TikTokGuide,
  Voice,
  flash,
  typingFrames,
  whip,
  zoomPunch,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import script from "./script.json";
import timeline from "./timeline.json";
import { Avatar, Btn, C, Confetti, Countdown, Panel, PanelText, SLUG, SetBg, pop, round } from "./Parts";

const FPS = 60;
const T = 10; // transition frames
const scenes = Object.fromEntries(script.scenes.map((s) => [s.id, s]));
const sc = (id: string) => scenes[id];
const startF = (id: string) => Math.round((timeline.scenes as Record<string, { start: number }>)[id].start * FPS);
const dur = (id: string) => (durations as Record<string, number>)[id];
const TOTAL = Math.round(timeline.total * FPS);

// Shots: [first scene id, next shot's first scene id or end]
const SHOTS = [["s1", "s3"], ["s3", "s5"], ["s5", "s7"], ["s7", "s9"], ["s9", ""]] as const;
const shotStart = (i: number) => startF(SHOTS[i][0]);
const shotEnd = (i: number) => (SHOTS[i][1] ? startF(SHOTS[i][1]) : TOTAL);
const shotLen = (i: number) => shotEnd(i) - shotStart(i) + (i < SHOTS.length - 1 ? T : 0);
// Frames of a scene, local to the shot that starts at `shot`.
const local = (id: string, shot: string) => startF(id) - startF(shot);
const sceneLen = (id: string, next: string | null, shot: string) =>
  (next ? local(next, shot) : shotEnd(SHOTS.findIndex((s) => s[0] === shot)) - startF(shot) + T) - local(id, shot);

// A scene's elements enter spread over its voice clip.
const lineAt = (i: number, n: number, id: string) =>
  8 + Math.min(i * 22, Math.round((i * (dur(id) * FPS - 90)) / n));

const Beat: React.FC<{ from: number; len: number; children: React.ReactNode }> = ({ from, len, children }) => (
  <Sequence from={from} durationInFrames={len} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

const LETTERS = ["A", "B", "C", "D"];

// Headline panel plus a stack of chunky buttons. `panel` sets whether the
// panel sits above or below the buttons.
const Board: React.FC<{
  id: string;
  panel: "top" | "bottom";
  right?: number[];
  panelSize?: number;
  btnSize?: number;
  letters?: boolean;
  confetti?: boolean;
}> = ({ id, panel, right = [], panelSize = 80, btnSize = 50, letters = true, confetti }) => {
  const s = sc(id);
  const n = s.lines.length;
  const H = n === 3 ? 196 : 250;
  const GAP = 30;
  const panelTop = panel === "top" ? 330 : 1090;
  const panelH = panel === "top" ? 300 : 320;
  const btn0 = panel === "top" ? 690 : 340;
  const last = lineAt(n - 1, n, id);
  return (
    <>
      <Panel top={panelTop} height={panelH}>
        <PanelText text={s.headline} size={panelSize} />
      </Panel>
      {s.lines.map((t, i) => (
        <Btn
          key={t}
          letter={letters ? LETTERS[i] : undefined}
          text={t}
          top={btn0 + i * (H + GAP)}
          height={H}
          at={lineAt(i, n, id)}
          state={right.includes(i) ? "right" : "idle"}
          stateAt={right.length > 1 ? lineAt(i, n, id) + 22 : last + 40}
          size={btnSize}
          mark
        />
      ))}
      {s.lines.map((_, i) => (
        <Sfx key={i} id="pop" at={lineAt(i, n, id)} volume={0.25} />
      ))}
      {right.length > 0 && <Sfx id="ding" at={right.length > 1 ? lineAt(0, n, id) + 22 : last + 40} volume={0.3} />}
      {confetti && <Confetti at={last + 40} x={540} y={panel === "top" ? 1100 : 700} count={50} />}
    </>
  );
};

// Shot 1: the quiz. Question, countdown, reveal.
const OPTIONS = ["Một dịch vụ đám mây", "Một file Word", "Dossier", "Một trình duyệt"];
const QuizShot: React.FC = () => {
  const reveal = local("s2", "s1");
  const s2 = sc("s2");
  const btnTop = (i: number) => 960 + i * 118;
  const rf = useF() - reveal;
  return (
    <AbsoluteFill>
      <SetBg />
      <Brand />
      <Beat from={0} len={reveal}>
        <div style={{ position: "absolute", top: SAFE.top + BRAND_SPACE, left: 0, right: 0 }} />
        <Panel top={SAFE.top + BRAND_SPACE + 10} height={290}>
          <PanelText text="Tự host app nào để AI viết CV theo từng JD?" size={62} />
        </Panel>
        <Countdown start={120} top={650} size={290} />
        <Sfx id="thud" volume={0.4} />
        {[120, 180, 240].map((a) => (
          <Sfx key={a} id="pixel" at={a} volume={0.3} />
        ))}
      </Beat>
      <Beat from={reveal} len={sceneLen("s2", null, "s1") + 400}>
        <Panel top={SAFE.top + BRAND_SPACE + 10} height={290} at={0}>
          <PanelText text={s2.headline} size={64} color={C.gold} />
        </Panel>
        <div
          style={{
            position: "absolute",
            left: 540 - 112,
            top: 645,
            opacity: pop(rf, 0, 14),
            transform: `scale(${0.85 + 0.15 * pop(rf, 0, 14)})`,
          }}
        >
          <Avatar size={224} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 886,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: round,
            fontWeight: 700,
            fontSize: 38,
            color: C.white,
            opacity: pop(rf, 30, 14),
          }}
        >
          {s2.lines[0]}
        </div>
        <Confetti at={0} x={540} y={800} />
        <Sfx id="ding" volume={0.45} />
        <Sfx id="whoosh" at={0} volume={0.25} />
      </Beat>
      {OPTIONS.map((t, i) => (
        <Btn
          key={t}
          letter={LETTERS[i]}
          text={t}
          top={btnTop(i)}
          height={104}
          at={20 + i * 8}
          state={i === 2 ? "right" : "wrong"}
          stateAt={reveal}
          size={42}
        />
      ))}
    </AbsoluteFill>
  );
};

import { useCurrentFrame } from "remotion";
function useF() {
  return useCurrentFrame();
}

const ProfileShot: React.FC = () => {
  const b = local("s4", "s3");
  return (
    <AbsoluteFill>
      <SetBg />
      <Beat from={0} len={b}>
        <Board id="s3" panel="top" right={[2]} confetti />
      </Beat>
      <Beat from={b} len={sceneLen("s4", null, "s3")}>
        <Board id="s4" panel="top" right={[2]} panelSize={76} btnSize={46} confetti />
        <Sfx id="whoosh" volume={0.3} />
      </Beat>
    </AbsoluteFill>
  );
};

const AgentShot: React.FC = () => {
  const b = local("s6", "s5");
  return (
    <AbsoluteFill>
      <SetBg footage="person-working-laptop-coffee-pixabay-293083.mp4" footageAt={b} />
      <Beat from={0} len={b}>
        <Board id="s5" panel="bottom" panelSize={74} btnSize={46} />
      </Beat>
      <Beat from={b} len={sceneLen("s6", null, "s5")}>
        <Board id="s6" panel="top" right={[0, 1, 2]} panelSize={84} btnSize={48} letters={false} />
        <Sfx id="whoosh" volume={0.3} />
      </Beat>
    </AbsoluteFill>
  );
};

const TermBlock: React.FC<{ cmds: string[]; top: number; size: number; minHeight: number }> = ({
  cmds,
  top,
  size,
  minHeight,
}) => {
  const f = useF();
  const p = pop(f, 0, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
        border: `8px solid ${C.gold}`,
        borderRadius: 40,
        overflow: "hidden",
        boxShadow: `0 0 36px ${C.gold}66`,
      }}
    >
      <Terminal cmds={cmds} fontSize={size} minHeight={minHeight} width={1080 - SAFE.left - SAFE.right - 16} bg={C.bgDeep} accent={C.gold} />
      <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(cmds)} volume={0.2} />
    </div>
  );
};

const SetupShot: React.FC = () => {
  const b = local("s8", "s7");
  const s8 = sc("s8");
  return (
    <AbsoluteFill>
      <SetBg />
      <Beat from={0} len={b}>
        <Board id="s7" panel="top" right={[0]} panelSize={80} btnSize={48} />
      </Beat>
      <Beat from={b} len={sceneLen("s8", null, "s7")}>
        <Panel top={290} height={200}>
          <PanelText text={s8.headline} size={58} />
        </Panel>
        <TermBlock cmds={s8.commands} top={540} size={35} minHeight={560} />
        {s8.lines.map((t, i) => (
          <Btn key={t} text={t} top={1180 + i * 130} height={112} at={40 + i * 24} size={40} state="right" stateAt={80 + i * 24} />
        ))}
        <Sfx id="whoosh" volume={0.3} />
      </Beat>
    </AbsoluteFill>
  );
};

const FinishShot: React.FC = () => {
  const b = local("s10", "s9");
  const s9 = sc("s9");
  const s10 = sc("s10");
  return (
    <AbsoluteFill>
      <SetBg footage="young-programmer-smiling-desk-pixabay-3160.mp4" footageAt={b} />
      <Beat from={0} len={b}>
        <Panel top={290} height={200}>
          <PanelText text={s9.headline} size={58} />
        </Panel>
        <TermBlock cmds={s9.commands} top={540} size={40} minHeight={450} />
        {s9.lines.map((t, i) => (
          <Btn key={t} text={t} top={1120 + i * 150} height={128} at={40 + i * 24} size={42} state="right" stateAt={80 + i * 24} />
        ))}
      </Beat>
      <Beat from={b} len={sceneLen("s10", null, "s9")}>
        <div style={{ position: "absolute", left: 540 - 110, top: 290 }}>
          <Avatar size={220} />
        </div>
        <Panel top={560} height={330}>
          <PanelText text={s10.headline} size={96} color={C.gold} />
        </Panel>
        {s10.lines.map((t, i) => (
          <Btn key={t} letter={LETTERS[i]} text={t} top={950 + i * 220} height={190} at={40 + i * 40} size={46} />
        ))}
        <Confetti at={10} x={540} y={700} count={80} />
        <Sfx id="ding" volume={0.4} />
        <Sfx id="whoosh" volume={0.3} />
      </Beat>
    </AbsoluteFill>
  );
};

const SHOT_COMPONENTS = [QuizShot, ProfileShot, AgentShot, SetupShot, FinishShot];
const PRESENTATIONS = [zoomPunch(), whip(1), whip(-1), flash(C.gold)] as const;

const voiceRanges: [number, number][] = script.scenes.map((s) => [startF(s.id), startF(s.id) + Math.round(dur(s.id) * FPS)]);

const Dossier: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <TransitionSeries>
      {SHOT_COMPONENTS.flatMap((Shot, i) => {
        const items = [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={shotLen(i)}>
            <Shot />
          </TransitionSeries.Sequence>,
        ];
        if (i < PRESENTATIONS.length) {
          items.push(
            <TransitionSeries.Transition
              key={`t${i}`}
              presentation={PRESENTATIONS[i] as never}
              timing={linearTiming({ durationInFrames: T })}
            />,
          );
        }
        return items;
      })}
    </TransitionSeries>
    {script.scenes.map((s) => (
      <Sequence key={s.id} from={startF(s.id)} layout="none">
        <Voice slug={SLUG} id={s.id} />
      </Sequence>
    ))}
    <Music slug={SLUG} total={TOTAL} voiceRanges={voiceRanges} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: Dossier,
  durationInFrames: TOTAL,
};
