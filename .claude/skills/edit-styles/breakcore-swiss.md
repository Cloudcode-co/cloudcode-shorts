# Breakcore Swiss

Taken from a 5 s After Effects + Blender loop ("time travel", about 150 BPM), measured frame by frame, and stretched here to a full vertical explainer. The feel: regraded footage, white technical posters and lit 3D type, cut hard on every drum hit, and never the same shot twice.

**Read [examples/breakcore-swiss.tsx](examples/breakcore-swiss.tsx) first.** It is the approved test build (roi-tu-do, scenes s1–s3, on its own footage). Copy its beats, shot deck, inserts, `Graded`, `Clip`, the 3D parts (`Lights`, `Ribbons`, `Word3D`, `Bars3D`), the poster pieces, every shot kind and `FactLayer`, rather than rewriting them. Its scenes are examples of the grammar: your shots follow your own script, clips and facts.

## Where this style overrides BUILDER.md

- **Hard cuts, not transitions.** Beat-locked shots, inserts and the portal replace `<TransitionSeries>`, `whip()` and `flash()`, and no scene fades.
- **Almost no text.** Each scene shows only its fact and one key word (see Text), not the usual headline stack or bullet lines.
- **BUILDER's other rules still apply:** no fake editor-UI icons, no pills behind words, micro-text at 34 px or larger, and no invented `[TAGS]` or labels.
- **Opening.** The `<Brand />` logo PNG is white, so a black block sits behind it (left 0, top 226, 560×96), only until the 4th beat.

## Footage first

Footage is the backbone: most shots carry a clip.
- Fetch at least 2 clips per scene with `npm run footage -- <slug> "<english search>"`, and list them per scene like the example's `CLIPS`.
- Make 3 portrait stills from the clips for `Poster` and `Scatter`, named `still-0.jpg` to `still-2.jpg` like the example's `STILLS`:
  `npx remotion ffmpeg -ss 3 -i public/videos/<slug>/footage/<clip> -frames:v 1 -vf "crop=ih*9/16:ih,scale=540:-1" public/videos/<slug>/still-0.jpg`
- `Clip` gives every shot its own crop, zoom, drift and start point in the clip, from the shot's seed, so the same clip never looks the same twice.
- `Graded` regrades by the shot's seed: natural, cyan-lime, pink-violet, sepia, orange-red. The tinted ones are duotones (greyscale multiplied by a gradient), so every clip lands on the same colours.

## The beats

- The music is ElevenLabs breakcore (composed breakcore when ElevenLabs fails). Its real tempo is not the prompt's, so `scripts/music.mjs` measures the beats and writes them to timeline.json: `beats` (seconds, gaps filled at the median period) and `bpm`. Scene starts are already snapped onto beats.
- Cut only on `timeline.beats`: `const BEATS = timeline.beats.map(fr)`. Never assume a fixed `BEAT`, and never place a cut by eye.
- In the scene the timeline puts in the Drop section, shots may also cut on the half-beat between two beats.

## The shot list

Build each scene's shots as data, `{ from, len, kind, g, clip }`, like the example's `SHOTS`:
- A shot lasts 1 or 2 beats. `g` is a global shot counter, the seed for everything inside the shot.
- The first shot of each scene is `word`. The rest are dealt from a deck: every kind once, in a seeded order, before any kind comes back, and never a kind used by the two shots before. Copy `deal()`.
- Every position, size, colour, count, curve and angle inside a shot comes from its seed. Two shots of the same kind must never look alike: repetition is the one thing this style cannot have.

Kinds:
- **word:** the scene's key word in the wide font at about 300 px, tight tracking, cropped off the left edge. It slams in (2 frames oversized, then set, with no tween) over poster pieces.
- **word3d:** the key word as real extruded type: `TextGeometry` from `public/fonts/unbounded-900.typeface.json` (Unbounded 900, Vietnamese included), lit from two coloured sides, tilted back, cropped by the frame but still readable.
- **maskword:** the key word huge, with the footage visible only inside its letters (`mix-blend-mode: lighten` over white).
- **poster:** white and airy, 5–7 of the 12 pieces (rings, dashed rings, a gradient disc, a half-moon, a slab, cones, dotted rows, pills, the squiggle, a vertical label, a still, crosses), placed by the seed.
- **footage:** a clip full-bleed, often with lit 3D ribbons (`Ribbons`: flat glossy bands, two colours along their length, 1–3 per shot).
- **scatter:** a still cut into a tinted pixel grid of its own size. The pixels gather into a clear picture, hold, then blow apart.
- **portal:** footage inside a ring portal of its own place and size, zoomed through at the end.
- **bars:** SMPTE colour-bar cards fanning over footage. **bars3d:** the same cards as real 3D panels flying past the camera.
- **strips:** footage in horizontal strips sliding against each other.
- **tiles:** a 2×2 or 3×2 grid of the same moment in different grades.

## Text

- **Key word:** one short word per scene, picked from what the voice says, for the word, word3d and maskword shots (the example's `KEY`: RƠI, MACH, XOAY). Never the headline number: the fact already shows it.
- **Fact:** per scene, the headline number in the wide font and `lines[0]` in sans at 36 px, at top 1110, still while the shots cut under them. Each sits on a solid block (ink with white text on white shots, white with ink text on dark ones), so it reads over any shot.
- No bullet lists and no headline stacks: the voiceover carries the rest.

**Font.** Unbounded 900 (`@remotion/google-fonts/Unbounded`, with the `vietnamese` subset) is the only display face. The kit mono has no Vietnamese, so use it only for `+` crosses and ASCII.

## Inserts

- Inserts are whole-frame wrappers driven by the root frame, never placed per scene.
- One lands on the off-beat after every other beat and lasts 2 frames.
- Each is drawn by its seed from: **invert** (`invert(1)`, the flash; a white flash would be invisible on white), **rgb** (red and cyan drop-shadows, 10–22 px apart), **mirror** (`scaleX(-1)`), **smear** (`scaleX` 1.6–2.6 with a skew) and **jolt** (a vertical jump with high contrast).

## Look

- **Ground:** white paper with ink (`#0B0B0C`). **Accents:** cyan `#19C6E6`, red `#FF2E4D`, blue `#2340FF`, violet `#8A6CFF`, pink `#FF3EA5`, lime `#C6FF1A`, orange `#FF8A1F`.
- **3D:** `@remotion/three` with `meshStandardMaterial` and the example's `Lights`, camera at z = 9 and fov 40.
- **CPU:** one `ThreeCanvas` per shot at most, and no `filter: blur()`.

## Structure

1. **Hook** (s1's first shots): the key word slams on white, the black block behind `<Brand />`, then the first footage cut.
2. **Body:** one scene per voiceover phrase, each cut into its 1–2 beat shots, with the scene's fact still on top.
3. **Drop:** the scene in the timeline's Drop section also cuts on half-beats.
4. **Outro:** end on a `word` shot with the opening's key word, so the short loops on TikTok.
