import { AbsoluteFill, Series } from "remotion";
import { Brand, Music, Sfx, TikTokGuide, Voice, fit, FPS, type VideoDef, type VideoProps } from "../../kit";
import VO from "./durations.json";
import { SLUG } from "./palette";
import { CompareShot, FreeShot, ROWS } from "./scenes/Compare";
import { Contenders, FAMILY_FIRST, FAMILY_GAP, HermesRivals } from "./scenes/Contenders";
import { EndCard } from "./scenes/EndCard";
import { Hook } from "./scenes/Hook";
import { Install, INSTALL_INTRO, STEP_COUNT } from "./scenes/Install";
import { Verdict, VERDICT_HERMES } from "./scenes/Verdict";

// Hard cuts only. Each shot lasts as long as its voiceover clip plus a breath,
// but never less than its animation needs.
const HOOK = fit(VO.hook, 210);
const FAMILY = fit(VO.family, 420);
const RIVALS = fit(VO.rivals, 420);
const FREE = fit(VO.free, 140);
const ROW_IDS = ["row-1", "row-2", "row-3", "row-4", "row-5"] as const;
const ROW_LENS = ROW_IDS.map((id) => fit(VO[id], 200));
// Where in each row's line the voice reaches Hermes, as a share of the shot.
const HERMES_AT = [0.6, 0.5, 0.25, 0.5, 0.55];
const VERDICT = fit(VO.verdict, 420);
const STEP_LENS = Array.from({ length: STEP_COUNT }, (_, i) =>
  fit(VO[`step-${i + 1}` as "step-1"], 210),
);
const INSTALL = STEP_LENS.reduce((sum, n) => sum + n, INSTALL_INTRO);
// The sign-off line plays over the end card, then the card holds for 1.5s.
const END = fit(VO.cta, 240) + 90;
const ROWS_TOTAL = ROW_LENS.reduce((sum, n) => sum + n, 0);
const TOTAL =
  HOOK + FAMILY + RIVALS + FREE + ROWS_TOTAL + VERDICT + INSTALL + END;

// Frames where the voice is talking, used to duck the music under it.
const VOICE_RANGES: [number, number][] = (() => {
  const ranges: [number, number][] = [];
  let at = 0;
  const say = (seconds: number, start = at) =>
    ranges.push([start, start + Math.round(seconds * FPS)]);
  say(VO.hook);
  at += HOOK;
  say(VO.family);
  at += FAMILY;
  say(VO.rivals);
  at += RIVALS;
  say(VO.free);
  at += FREE;
  ROW_IDS.forEach((id, i) => {
    say(VO[id]);
    at += ROW_LENS[i];
  });
  say(VO.verdict);
  at += VERDICT;
  let step = at + INSTALL_INTRO;
  STEP_LENS.forEach((len, i) => {
    say(VO[`step-${i + 1}` as "step-1"], step);
    step += len;
  });
  at += INSTALL;
  say(VO.cta);
  return ranges;
})();

const HermesVsOpenClaw: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence name="Hook" durationInFrames={HOOK}>
        <Hook len={HOOK} />
        <Voice slug={SLUG} id="hook" />
        <Sfx id="thud" volume={0.5} />
        <Sfx id="pixel" at={18} volume={0.3} />
        <Brand />
      </Series.Sequence>
      <Series.Sequence name="Claw family" durationInFrames={FAMILY}>
        <Contenders len={FAMILY} />
        <Voice slug={SLUG} id="family" />
        <Sfx id="whoosh" />
        {[0, 1, 2, 3].map((i) => (
          <Sfx key={i} id="pop" at={FAMILY_FIRST + i * FAMILY_GAP} volume={0.25} />
        ))}
      </Series.Sequence>
      <Series.Sequence name="Hermes rivals" durationInFrames={RIVALS}>
        <HermesRivals len={RIVALS} />
        <Voice slug={SLUG} id="rivals" />
        <Sfx id="whoosh" />
        {[0, 1, 2, 3].map((i) => (
          <Sfx key={i} id="pop" at={FAMILY_FIRST + i * FAMILY_GAP} volume={0.25} />
        ))}
      </Series.Sequence>
      <Series.Sequence name="Free" durationInFrames={FREE}>
        <FreeShot len={FREE} />
        <Voice slug={SLUG} id="free" />
        <Sfx id="whoosh" />
        <Sfx id="ding" at={14} volume={0.3} />
      </Series.Sequence>
      {ROWS.map((r, i) => (
        <Series.Sequence key={r.label} name={r.label} durationInFrames={ROW_LENS[i]}>
          <CompareShot
            row={r}
            len={ROW_LENS[i]}
            hermesAt={Math.round(ROW_LENS[i] * HERMES_AT[i])}
          />
          <Voice slug={SLUG} id={ROW_IDS[i]} />
          <Sfx id="whoosh" />
          <Sfx id="pop" at={8} volume={0.25} />
          <Sfx id="pop" at={Math.round(ROW_LENS[i] * HERMES_AT[i])} volume={0.25} />
        </Series.Sequence>
      ))}
      <Series.Sequence name="Verdict" durationInFrames={VERDICT}>
        <Verdict len={VERDICT} />
        <Voice slug={SLUG} id="verdict" />
        <Sfx id="whoosh" />
        <Sfx id="pop" volume={0.25} />
        <Sfx id="ding" at={Math.round(VERDICT * VERDICT_HERMES)} volume={0.3} />
      </Series.Sequence>
      <Series.Sequence name="Install" durationInFrames={INSTALL}>
        <Install len={INSTALL} steps={STEP_LENS} />
        <Sfx id="whoosh" />
      </Series.Sequence>
      <Series.Sequence name="End card" durationInFrames={END}>
        <EndCard len={END} />
        <Voice slug={SLUG} id="cta" />
        <Sfx id="whoosh" />
        <Sfx id="ding" at={28} volume={0.3} />
      </Series.Sequence>
    </Series>
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: HermesVsOpenClaw,
  durationInFrames: TOTAL,
};
