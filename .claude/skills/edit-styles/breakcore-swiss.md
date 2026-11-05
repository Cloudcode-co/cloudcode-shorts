# Breakcore Swiss

Taken from a 5 s After Effects + Blender loop ("time travel", 1024×576, 30 fps, about 150 BPM), measured frame by frame, and stretched here to a full vertical explainer. The feel: a white technical poster that glitches on every drum hit.

## The beat grid comes first

- Pick the tempo before writing scenes: 150 BPM, which is **24 frames per beat** at 60 fps. Put it in the music prompt ("breakcore / jungle, 150 BPM, chopped amen breaks").
- Write the grid as data: `const BEAT = 24; const beat = (n: number) => n * BEAT;`. Every hard cut, insert and regrade lands on `beat(n)` or on the half-beat `beat(n) + 12`. Never place one by eye.
- The reference cut every 8–20 frames at 30 fps. Here that is a visual change every 1–1.5 beats, with a real scene change every 2–4 beats, so the voiceover's facts can still be read.

## Look

- **Ground.** A white void, laid out like a Swiss print poster:
  - thin black hairlines, plus hand-drawn black strokes that draw themselves on;
  - dotted grids (`••••••••`) and tiny micro-text blocks;
  - bracketed rainbow tags such as `[COLOR WHEEL]`;
  - topographic contour lines and cyan pill dashes.
- **Type.**
  - The topic's key word is set in a heavy grotesque (Archivo Black or Anton, with Vietnamese subsets). It slams in, is mirrored for one frame, masks footage, and breaks into pixel noise.
  - Small labels run vertically along shapes ("TWO", "THREE").
  - Micro-text uses a mono face.
  - Once per video, one extruded 3D word is seen in steep perspective.
- **Shapes.**
  - black radial-gradient spheres with concentric rings, and black half-moon discs;
  - rotating black slabs;
  - gradient light cones (violet → cyan → magenta);
  - a blue sine-wave squiggle;
  - SMPTE colour-bar cards flying in 3D.
- **Footage or screenshots.**
  - Ribbon trails (yellow, magenta, blue tubes) fly through the shot.
  - Fake editor-UI icons sit on top: a pen tool, a T text tool, a cube.
  - Each beat regrades the shot: natural → acid lime/cyan → pink/violet → sepia.

## Inserts and transitions

- **One-frame inserts** mark the snare. At 60 fps make them 2 frames long. Use one of:
  - a white flash;
  - a horizontal smear (the same frame with `scaleX(6)` and a 1-row scanline stretch);
  - the key word mirrored (`scaleX(-1)`);
  - an RGB split (three offset copies with `mix-blend-mode: screen` in R, G and B).
- **Portal.** Footage clipped to a circle with concentric rings rotating at different speeds, then zoomed through into the next scene.
- **Hard cuts everywhere else.** BUILDER.md's rule asks for transitions; in this style, the beat-locked inserts and the portal are those transitions. Never use a fade.
- **Loop.** End by rebuilding the opening frame (the key word, the hairline, the first shape) so the short loops seamlessly on TikTok.

## Structure

1. **Hook** (first 2 beats): the white void, a hairline draws on, then the key word slams in on beat 1.
2. **Poster build** (4–6 beats): technical layout elements arrive one per half-beat; a cone sweeps; a portal opens.
3. **Body**: each voiceover phrase gets one scene of 2–4 beats.
   - Show the fact big and still for at least 60 frames.
   - Around it, inserts and regrades keep the frame moving.
   - Alternate between poster scenes and footage/UI scenes.
4. **Drop**: the 3D word and the colour bars, on the strongest line.
5. **Outro**: back to the opening frame, `<Brand />`, loop.

## In Remotion (60 fps)

- Shot list as data, `{ beat, beats, scene, grade }`, rendered with `<Sequence from={beat(b)} durationInFrames={beat(n)}>`.
- An insert is `<Sequence from={beat(b) + 12} durationInFrames={2}>` holding the insert component.
- Regrade: a CSS `filter` chain on the footage, picked by `Math.floor(frame / BEAT) % 4`: `none`, `invert(1) hue-rotate(90deg) saturate(3)`, `hue-rotate(250deg) saturate(2)`, `sepia(0.9)`. These filters are cheap; blur is not.
- Strokes drawing on: SVG paths with `strokeDasharray` equal to their length, and `strokeDashoffset` taken by `interpolate` to 0 over 8–16 frames from the beat.
- Ribbons: `@remotion/three` `TubeGeometry` along a `CatmullRomCurve3`, unlit `MeshBasicMaterial`, at most 3 tubes. The extruded word is `TextGeometry` with a bevel.
- An effect that starts at frame `s` is 0 before `s` (the BUILDER.md rule about one-off effects).
