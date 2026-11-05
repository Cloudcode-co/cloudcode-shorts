# Breakcore Swiss

Taken from a 5 s After Effects + Blender loop ("time travel", about 150 BPM), measured frame by frame, and stretched here to a full vertical explainer. The feel: regraded footage and white technical posters, cut hard on every drum hit.

**Read [examples/breakcore-swiss.tsx](examples/breakcore-swiss.tsx) first.** It is the approved test build (roi-tu-do, scenes s1–s3, on its own footage). Copy its grid, shot list, inserts, `Graded`, `Footage`, `Poster`, `Portal`, `Scatter`, `Bars`, `Word` and `FactLayer` rather than rewriting them. Its scenes are examples of the grammar: your shots follow your own script, clips and facts.

## Where this style overrides BUILDER.md

- **Hard cuts, not transitions.** Beat-locked shots, inserts and the portal replace `<TransitionSeries>`, `whip()` and `flash()`, and no scene fades.
- **Almost no text.** Each scene shows only its fact (see Text), not the usual headline stack or bullet lines.
- **BUILDER's other rules still apply:** no fake editor-UI icons, no pills behind words, micro-text at 34 px or larger, and no invented `[TAGS]` or labels.
- **Opening.** The `<Brand />` logo PNG is white, so a black block sits behind it (left 0, top 226, 560×96), only during the first 4 beats of s1.

## Footage first

Footage is the backbone: about half the shots are full-bleed clips. No footage, no breakcore.
- Fetch at least 2 clips per scene with `npm run footage -- <slug> "<english search>"`, and list them per scene like the example's `CLIPS`.
- Each footage shot is regraded every beat with `Graded`: natural → acid → pink-violet → sepia. Acid and pink are duotones (greyscale multiplied by a fixed gradient), so every clip lands on the same colours.
- Over it: ribbons on about 60% of footage shots, a white hairline and white `+` crosses.

## The beat grid

- **150 BPM**, which is `BEAT = 24` frames at 60 fps, written as `const beat = (n: number) => n * BEAT`.
- For this direction the pipeline composes a 150 BPM breakcore track and snaps every scene `start` in timeline.json onto the grid. Rely on that: `start * 60 % 24 === 0`.
- Every cut, insert, regrade and slam lands on `beat(n)` or the half-beat `beat(n) + 12`. Never place one by eye.

## The shot list

Build each scene's shots as data, `{ from, len, kind, seed, clip }`, like the example's `SHOTS`:
- Each shot lasts 1 or 2 beats; a scene never holds one layout longer than 2 beats.
- The first shot of a scene is `word`; the rest cycle through `poster`, `footage`, `scatter`, `portal` and `bars`, with footage about half of them.
- The `seed` drives every position in the shot, so no two posters look alike and every render of a frame is the same.

Kinds:
- **word:** the topic's key word in the wide font at 300 px with tight tracking, cropped off the left edge. It slams in (one frame oversized, then set, with no tween) over a cone and a disc while a hairline draws on.
- **poster:** white and airy. Draw from a thin ellipse ring, a dashed ring, a radial-gradient disc, a half-moon, a rotating slab, a violet or pink cone, a dotted row, cyan pills, the blue squiggle, and a vertical label (the fact's first word).
- **footage:** as in Footage first.
- **scatter:** a still from one of the clips, cut into an 18×14 grid tinted cyan (`grayscale(1) sepia(1) hue-rotate(150deg) saturate(5)`). The pixels gather, then scatter within the shot. Extract the still with `npx remotion ffmpeg -ss 3 -i <clip> -frames:v 1 -vf scale=540:-1 public/videos/<slug>/scatter.jpg`.
- **portal:** footage inside a 520 px circle with 3 rotating rings, zoomed ×7 through its last half-beat.
- **bars:** SMPTE colour-bar cards fanning through 3D over footage.

## Text

Per scene, only two things, in a fixed spot (top 1130), still while the shots cut under them:
- the headline number or fact in the wide font;
- `lines[0]` in sans at 40 px.

Ink on white shots; white with a hard 5 px ink shadow on footage and bars. Use no bullet lists and no headline stacks: the voiceover carries the rest.

**Font.** Unbounded 900 (`@remotion/google-fonts/Unbounded`, with the `vietnamese` subset) is the only display face. The kit mono has no Vietnamese, so use it only for `+` crosses and ASCII.

## Inserts

- Inserts are whole-frame wrappers driven by the root frame, never placed per scene.
- One lands every 2 beats, at `beat(2k + 1) + 12`, and lasts 2 frames.
- They cycle through four kinds:
  - **invert:** `invert(1)`. This is the flash; a white flash would be invisible on the white ground.
  - **rgb:** `drop-shadow(16px 0 0 #FF2E4D) drop-shadow(-16px 0 0 #19C6E6)`.
  - **mirror:** `scaleX(-1)`.
  - **smear:** `scaleX(2.2) skewX(-16deg)`.

## Look

- **Ground:** white paper with ink (`#0B0B0C`). **Accents:** cyan `#19C6E6`, red `#FF2E4D`, blue `#2340FF`, violet `#8A6CFF`, pink `#FF3EA5`.
- **Ribbons:**
  - `TubeGeometry` grown along a `CatmullRomCurve3` as the frame advances;
  - unlit `MeshBasicMaterial`, at most 3 tubes;
  - camera at z = 9 and fov 40.
- **CPU:** one `ThreeCanvas` per shot at most, and no `filter: blur()`.

## Structure

1. **Hook** (s1's first shots): the key word slams on white, the black block behind `<Brand />`, then the first footage cut.
2. **Body:** one scene per voiceover phrase, each cut into its 1–2 beat shots, with the scene's fact still on top.
3. **Drop:** on the strongest line, put the portal and the bars close together.
4. **Outro:** end on a `word` shot with the opening's key word, so the short loops on TikTok.
