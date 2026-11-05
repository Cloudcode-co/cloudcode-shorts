---
name: dj-cut
description: Cut and move a Remotion short to its music the way a DJ hears it, with beats, bars, phrases, energy, build-ups and drops from src/videos/<slug>/beatmap.json. Use whenever a video has a beatmap.json, or when asked to sync cuts to the music, hit the drop, or make the edit feel musical.
---

# DJ cut

A DJ hears music in layers: beats, bars of 4 beats, phrases of 8 bars, then sections that rise and fall in energy. An edit feels musical when its changes follow the same layers. The bigger the change on screen, the bigger the musical boundary it lands on. A cut placed on a random frame feels off even when nobody can say why.

## The data

`scripts/beatmap.mjs` listens to `public/videos/<slug>/music.mp3` and writes `src/videos/<slug>/beatmap.json`, in seconds:

- `bpm`
- `beats`: every beat. Quiet stretches are filled at the track's own beat length.
- `downbeats`: the one of each bar.
- `phrases`: every 8 bars from the first downbeat. A DJ mixes on these.
- `sections`: `{ start, end, energy }`, with energy from 0 to 1. `drop: true` marks a section that jumps up in energy.
- `drops`: the start of each section marked as a drop.

Load it through the kit. Every helper takes the frame of the whole video, so inside a `<Sequence>` add the scene's start to the local frame:

```tsx
import { beatmap, hit, snap, buildUp, sectionAt, nextOf } from "../../kit";
import beats from "./beatmap.json";
const MAP = beatmap(beats); // frames: MAP.beats, MAP.downbeats, MAP.phrases, MAP.drops, MAP.sections, MAP.period
```

- `snap(marks, f)`: the mark nearest f.
- `nextOf` / `lastOf(marks, f)`: the next mark, or the one before.
- `hit(marks, f, decay)`: 1 on the mark, easing to 0 over `decay` frames. It drives a kick.
- `beatPhase(map, f)`: 0 to 1 through the current beat.
- `sectionAt(map, f)`: the section frame f is in.
- `buildUp(map, f, beats)`: 0 to 1 over the beats before the next drop.

If there is no beatmap.json (silence, a track with no drums, or no uv), skip this skill. Never invent beats.

## Rules

**The voice comes first.** Scene starts come from timeline.json; leave them where they are. This skill times what happens inside a scene. A number or a name still stays readable and still for 1 s, even across beats.

**Match the size of a change to the size of the boundary:**

| On screen | Lands on |
|---|---|
| A new idea, a new look, a different background | a phrase, or the scene start |
| A new shot, a layout change, a headline slamming in | a downbeat |
| A word or an item appearing, a small punch, a regrade | a beat |
| Stutters, inserts and half-beat cuts | between beats, only in a high-energy section |

Snap a change you placed by the story to the right layer: `const at = snap(MAP.downbeats, START + 90)`. Snap only within the scene: never move a cut before its line starts, or past the scene's end.

**Pace by energy.** Read `sectionAt(MAP, f).energy`:
- Below 0.35 (an intro or a breakdown): hold a shot for 2 bars or more, use slow drift and little or no pump. Let it breathe.
- 0.35 to 0.65: a change about once a bar, with a light pump on the downbeats.
- Above 0.65: a change every 1–2 beats, a pump on every beat, and inserts allowed.

**Build-up, then the drop.** This is the moment people remember:
- Through `buildUp(MAP, f, 8)` before a drop, speed the cuts up (2 beats, then 1, then half), tighten the framing, and raise the contrast or brightness toward 1.
- On the last half-beat before the drop, take something away: a freeze, or a blank frame of the ground colour. Tension needs a pause.
- On the drop frame itself, land the biggest reveal of the video, such as the key number, the product or the punchline, with one hit (a flash, a zoom punch or a shake). Make it the strongest hit of the edit. Plan the script's best line for the drop; if they do not meet, the line wins and the drop gets a strong visual instead.

**Pump with restraint.** Scale the background layer, never the text, by `1 + 0.03 * hit(MAP.beats, f, 10)`. Use a stronger pump of 0.06 on downbeats. While the voice talks (the music is ducked), halve it. A pump on every beat for the whole video turns into noise, so give it the high-energy sections only.

**Tension and release.** Do not use the same hit on every beat. Repeat a motif once a phrase, changed each time (a different colour, side or size), so the edit has a form the ear already knows. At the end of a phrase (its last bar), a small fill is allowed: a 2–4 frame freeze repeated 3 times (`<Freeze>`), or an insert.

**End on the one.** The last cut and the end card land on a downbeat, ideally a phrase. The kit's `<Music>` fades the last 90 frames.

## Example

```tsx
// Inside a scene that starts at frame START (the timeline's start).
const f = useCurrentFrame() + START;
const sec = sectionAt(MAP, f);
const pump = sec.energy > 0.65 ? 0.03 * hit(MAP.beats, f) + 0.03 * hit(MAP.downbeats, f) : 0;
const rise = buildUp(MAP, f, 8);
const dropAt = nextOf(MAP.drops, START);
const revealAt = dropAt < START + LEN ? dropAt : snap(MAP.downbeats, START + 60);
return (
  <AbsoluteFill>
    <AbsoluteFill style={{ transform: `scale(${1 + pump + rise * 0.08})`, filter: `contrast(${1 + rise * 0.3})` }}>
      <Background />
    </AbsoluteFill>
    {f >= revealAt && <BigNumber slamAt={revealAt} />}
  </AbsoluteFill>
);
```

## Check before done

- Every scene-level change sits on a downbeat or phrase. Every small change sits on a beat.
- The drop, if the video has one, carries the biggest moment, with a pause right before it.
- Quiet sections hold their shots and loud ones move. Nothing pumps through a breakdown.
- No fact moves or cuts away before it has been readable for 1 s.
