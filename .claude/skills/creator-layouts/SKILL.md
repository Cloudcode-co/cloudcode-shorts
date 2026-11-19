---
name: creator-layouts
description: Six creator-reel layouts (split-screen, explainer, behind-the-person, storytelling, ranking-list, hook variants) measured from a talking-head Instagram reel and rebuilt for voiceover shorts with stock footage. Use when the art direction is `creator-layouts`, or when a scene should look like a creator's edit (person on camera framed under visuals, tier list, stat counter with a profile card).
---

# Creator layouts

Taken frame by frame from a 22 s reel (720×1280, 30 fps) by a creator showing six editing layouts he generates with Claude. In the reel a person talks to camera and the graphics sit around him. This project has no presenter, so **the person slot is filled with a footage clip of a person** (facts.json `footage`, or `npm run footage -- <slug> "man talking to camera"`), or with a `<GreenScreen>` clip when the layout needs a cutout. All numbers below are already scaled to 1080×1920 (source × 1.5). Code for every layout is in [examples.tsx](examples.tsx); copy the part you need into the video's folder and adapt it.

## Where this style overrides BUILDER.md

- **Ground.** The split-screen and explainer layouts sit on warm paper `#F2EEE7` with a dot grid (dots `rgba(0,0,0,0.07)`, 3 px, every 36 px). That ground is allowed here, but never as a flat fill: the dot grid is always on.
- **Caption boxes.** The storytelling title and the split-screen label sit in solid boxes. That is allowed only as a box around a **whole line**: padding `0.18em 0.4em`, radius 14, one box per line. A box never covers part of a line or a single word.
- **Pills.** The coral step pill ("Bước 1") above a split-screen title is allowed. It holds the whole label and nothing else.
- **Small labels over images.** In the explainer layout the two image labels ("NGÁCH KHÁC" / "NGÁCH CỦA BẠN") are 28 px tracked caps. They label pictures, never a heading.
- **All other BUILDER.md rules still apply**: SAFE area, 34 px minimum, `<Brand />` on the dark opening, facts only from facts.json, footage never as proof.

## Shared parts

- **Type.** Heavy sans: the kit `display` at 800. The accent word: Playfair Display italic, loaded with `loadFont("italic", { weights: ["600"], subsets: ["latin", "vietnamese"] })` from `@remotion/google-fonts/PlayfairDisplay`. Every title and caption mixes the two: exactly one word, the one the voice stresses, in the serif italic.
- **Palette.** Paper `#F2EEE7`, ink `#16130F`, coral `#C8584A` (accent word on paper, step pill, arrows), white `#FFFFFF` (captions on footage), green `#3DDC84` (a "+N" gain), follow blue `#1D9BF0`, highlight yellow `#FFD43B` (hook titles and tier labels on dark cards).
- **Live caption.** On footage, one phrase of 1–4 words at a time, white, `display` 800, 68 px, centred at y ≈ 1180 (inside SAFE). Shadow `0 4px 18px rgba(0,0,0,0.55)`. It changes with each voiceover phrase: pace phrases from the clip length (characters ÷ total characters × clip frames). Each phrase enters over 6 frames: opacity 0 → 1 and scale 0.92 → 1 with the kit `easeOut`. It leaves on a hard cut to the next phrase.
- **Footage card.** A person clip in a rounded card: radius 54, `overflow: hidden`, `objectFit: "cover"`, `objectPosition` chosen to keep the face in the top third, shadow `0 24px 60px rgba(0,0,0,0.18)` (pre-blurred is not needed at this size).
- **Timing.** The reel holds each layout for 2.9 s on average and cuts between layouts. In this project a scene lasts its voice clip. Hold one layout per scene and change layout when the scene changes; never two layouts in one scene. Every element comes in at the frame the voice names it.
- **Motion vocabulary.** Entrances: `useIn(delay, 14)` with `enter(p, 24)` from the kit. Things that land (a card into a tier, a thumbnail into an empty slot): `spring({ frame: frame - s, fps, config: { damping: 14, stiffness: 170, mass: 0.9 } })`. Counters: `interpolate` over 40 frames with `easeOut`, `fontVariantNumeric: "tabular-nums"`, formatted with `toLocaleString("en-US")`. Drawn arrows: SVG path with `strokeDasharray = length` and `strokeDashoffset` from length → 0 over 18 frames. No CSS transitions or keyframes.

## The layouts

Pick the layout from the scene's job, and use at least three different layouts in one video.

1. **Split-screen**: one step of a process. Top half (y 0–960) is the paper panel: step pill at y 300, title at y 360 (`display` 800 at 84 px with one Playfair italic word in coral), then a screenshot, repo card or UI card from facts.json filling y 470–900. Bottom half (y 960–1920) is the footage. The label box straddles the seam: centred on y 960, ink box with white `display` 800 caps at 62 px, naming what the top panel shows ("NÚT NÀY", "LỆNH NÀY"). The label pops in 8 frames after the panel, scale 0.8 → 1 with a spring.
2. **Explainer**: a before → after or this → that comparison. Full paper ground. Title at y 300 (same mix as split-screen, 96 px). Two images of the same size (300 × 375, radius 12) at x 150 and x 630, y 430, labels 28 px above them. The right one starts as an empty dashed box (`2px dashed rgba(0,0,0,0.25)`) with a grey "?" at 90 px. A coral arc arrow draws from left image to right image, then the right image springs in (scale 0.85 → 1) at the end of the arrow. The footage card fills x 90–990, y 860–1690, with the live caption over its lower third.
3. **Behind-the-person**: a big number about the subject (stars, downloads, users) from facts.json. Full-frame footage, darkened 25%. A dark panel (radius 36, `#0E0E10` at 92%) at y 280–1000 shows a grid of 3 × 3 images from facts.json (screenshots, share images) with a small tab row on top. The counter sits at y 1050, white, `display` 800 at 130 px, ticking from 0 to the real number over 40 frames. Under it a profile card (radius 28, `#15151A`, width 660): the repo avatar 96 px round, name in 40 px, a green "+12,345" line in 32 px, and a button that turns from blue "Theo dõi" into grey "Đang theo dõi" when the counter ends. When a green-screen clip exists, put the `<GreenScreen>` person between the panel and the counter, so the person stands in front of the grid. Otherwise skip the cutout and keep the panel in front of the footage.
4. **Storytelling**: a result or a short story. Full-frame footage. Three white cards (radius 24, each 300 × 300, gap 24) in a row at y 280: a ring stat (an SVG ring that fills with the number in the centre), a picture, and a short list (three rows with a coloured dot and a word). Below them two title lines in ink boxes, white `display` 800 at 72 px, then one subtitle line in a white box with ink text at 44 px. Cards enter left to right, 6 frames apart. Title lines enter 8 frames apart, rising 24 px each.
5. **Ranking-list**: rating or comparing several things. Full-frame footage. The title at y 300: `display` 800 italic (use `transform: skewX(-8deg)`), 104 px, caps, gradient fill orange `#FF8A1F` → amber `#FFB547` via `background-clip: text`, with a dark 6 px `WebkitTextStroke` of `rgba(0,0,0,0.35)`. The tier board at y 1000–1500, x 100–980: seven rows S A B C D E F, each 70 px tall. The letter tiles are 70 px wide, `display` 800 at 44 px, coloured S `#FF5C6C`, A `#FF9F43`, B `#FFD43B`, C `#A3E635`, D `#38BDF8`, E `#818CF8`, F `#E879F9`. The track is `#111114` at 85%. Each item is a navy card (`#0F1C3F`, white 3 px border, radius 10) with an image and a yellow caps name. It drops from 200 px above into its row with the landing spring. One item per voice mention, and the tier comes from the script, never invented.
6. **Hook variants**: the opening 2 s, after `<Brand />`. Pick one of three hook looks the reel tested side by side:
   - (a) A yellow `#FFD43B` caps title, `display` 800 at 88 px, three lines over footage at y 300, with a thin black stroke.
   - (b) A white quote card (radius 24, padding 32) at y 300, with the source's avatar, name and the claim in 40 px ink.
   - (c) A huge stat ("8×", "3 phút"), `display` 800 at 220 px, in yellow, and a 40 px white line under it.

## Check

- Each layout used is built to its numbers above, or the difference has a reason you can name.
- The person slot always holds real footage, never a drawn or generated face, and never the face of a real public person.
- Every number, name and tier comes from script.json or facts.json.
- Captions and labels stay inside SAFE and at least 34 px.
