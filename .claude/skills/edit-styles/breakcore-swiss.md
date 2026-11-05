# Breakcore Swiss

Taken from a 5 s After Effects + Blender loop ("time travel", about 150 BPM), measured frame by frame, and stretched here to a full vertical explainer. The feel: a white technical poster that glitches on every drum hit.

**Read [examples/breakcore-swiss.tsx](examples/breakcore-swiss.tsx) first.** It is the approved test build (Dossier, scenes s1–s4). Copy its grid, inserts, `Slam`, `Stroke`, `Portal`, `Sphere`, regrade, ribbons and loop rather than rewriting them. Its scenes are examples of the grammar: your scenes follow your own script and layouts.

## Where this style overrides BUILDER.md

- **Hard cuts, not transitions.** Beat-locked inserts and the portal replace `<TransitionSeries>`, `whip()` and `flash()`, and no scene fades.
- **Bracketed tags** are allowed when they carry real facts from facts.json or the script, for example `[4.337 stars · TypeScript]`. Each tag holds a fact or doesn't appear.
- **BUILDER's other rules still apply:** no fake editor-UI icons, no pills behind words, and micro-text at 34 px or larger.
- **Opening.** The `<Brand />` logo PNG is white, so put a black Swiss block behind it in the opening shot (left 0, top 226, 560×96).

## The beat grid

- **150 BPM**, which is `BEAT = 24` frames at 60 fps, written as `const beat = (n: number) => n * BEAT`.
- For this direction the pipeline composes a 150 BPM breakcore track and snaps every scene `start` in timeline.json onto the grid. Rely on that: `start * 60 % 24 === 0`.
- Every cut, insert, regrade and slam lands on `beat(n)` or the half-beat `beat(n) + 12`, counted from the root frame. Never place one by eye.
- Pace: a visual change every 1–1.5 beats, and a real scene change at each timeline scene start. A fact (number, name, command) holds still and readable for at least 60 frames while things move around it.

## Inserts

- Inserts are whole-frame wrappers driven by the root frame, never placed per scene.
- One lands every 2 beats, at `beat(2k + 1) + 12`, and lasts 2 frames.
- They cycle through four kinds:
  - **invert:** `invert(1)`. This is the flash; a white flash would be invisible on the white ground.
  - **rgb:** `drop-shadow(14px 0 #FF2E4D) drop-shadow(-14px 0 #19C6E6)`.
  - **mirror:** `scaleX(-1)`.
  - **smear:** `scaleX(1.9) skewX(-14deg)`.

## Look

- **Ground.** White paper (`#FAFAF7`) with ink (`#0B0B0C`), laid out like a Swiss print poster:
  - thin hairlines and hand-drawn strokes drawing on (`Stroke`);
  - dotted grids;
  - micro-text and fact tags;
  - topographic contours;
  - cyan pill dashes as shapes, never behind words.
- **Accents:** cyan `#19C6E6`, red `#FF2E4D`, blue `#2340FF`.
- **Type.**
  - Anton is the only display face, because it has the Vietnamese glyphs.
  - The topic's key word `Slam`s in: one frame oversized, then set, with no tween.
  - The kit mono has no Vietnamese, so use it only for ASCII tags and numbers.
- **Shapes.**
  - black radial-gradient spheres with concentric rings (`Sphere`);
  - half-moon discs;
  - rotating black slabs;
  - gradient light cones (violet → cyan → magenta);
  - a blue sine-wave squiggle;
  - SMPTE colour-bar cards.
- **Extruded word** (once per video, on the drop): 16 stacked CSS layers, `translateZ(i * 3px)` with a hue ramp, under `perspective(700px) rotateX(52deg)`. The repo has no font file for `TextGeometry`.
- **Ribbons:**
  - `TubeGeometry` grown along a `CatmullRomCurve3` as the frame advances;
  - unlit `MeshBasicMaterial`, at most 3 tubes;
  - kept above the text block: in 3D, y ≥ -0.8 with the camera at z = 9 and fov 40.
- **Regrade per beat:** `["none", "invert(1) hue-rotate(90deg) saturate(3)", "hue-rotate(250deg) saturate(2)", "sepia(0.9)"][Math.floor(f / BEAT) % 4]`. Tested on images; with footage, check a QA still of each grade before relying on it.
- **Portal:** the image is clipped to a circle with concentric rings rotating at different speeds, then zoomed through into the next scene.

## Structure

1. **Hook** (first 2 beats): the void, a hairline draws on, then the key word slams on beat 1. The Swiss block sits behind `<Brand />`.
2. **Poster build:** layout elements arrive one per half-beat, a cone sweeps, and a portal holds the logo, then zooms through.
3. **Body:** one scene per voiceover phrase, alternating poster scenes with image scenes. The fact is big and still; inserts and regrades keep the frame alive around it.
4. **Drop:** on the strongest line, the extruded word, ribbons through the logo, and the colour bars.
5. **Outro:** rebuild the opening frame (key word, hairline, first shape), so the short loops seamlessly on TikTok.
