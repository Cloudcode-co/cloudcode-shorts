# Pastel 3D explainer

Taken from a 48 s TikTok selling a lightweight Zalo PC client written in Rust (tiktok.com/@erorr404909/video/7703574883246116118). It is soft, tactile and optimistic, like a toy box of the product's parts.

## Where this style overrides BUILDER.md

- **Ground.** BUILDER.md bans flat cream `#F4F1EA` and gradient washes used as decoration. Here the peach gradient with blobs is the style's ground, so it is allowed. Use that ground only, never a flat cream fill.
- **Opening.** `<Brand />` needs a dark background, because its logo is white. Set the pain scene dark (night `#1C1F2E`, blobs at 10% opacity, red cards glowing) and have it bloom into the pastel ground on the answer scene. That contrast is the story's turn.
- **BUILDER's other rules still apply.** In particular there is still no pill or box behind words: feature labels are coloured text.

## Look

- **Ground.** A warm cream-to-peach gradient covered in 6–10 large, soft, low-contrast blobs and rounded squares (sage, peach, sky), some of them out of focus. They drift slowly and never stop.
- **Hero objects** are soft 3D with rounded edges, a matte clay finish and a soft contact shadow below. Examples: the app window tilted in perspective, an install box with a tape strip, a mascot, emoji stickers, a call card, a database cylinder, a podium disc for the "available everywhere" beat.
- **The UI** sits in a dark window floating over the pastel. The window tilts in 3D, and the parts the line talks about (a chat bubble, the sticker bar, the call screen) lift out of it toward the camera.
  - When facts.json has a screenshot of the product, put it in the window.
  - Without one (most GitHub repos), draw only the parts the script's lines name, using their own words and numbers. Leave out every invented device name, value and row.
- **Data shown as UI cards, never as chart axes.** The problem is an alarm-red bar ("96% CPU") or a process list whose bars run red → orange → yellow. The answer is a calm green card ("~20 MB").
- **Confetti** goes on the one install or reveal moment, nowhere else. It falls behind the cards and stays clipped above the caption area, so no piece ever lands on text.
- **Palette** (bend it toward the subject's logo colours): cream `#FBEFE3`, peach `#F7C9B0`, sage `#CFE3C9`, sky `#CFE4F5`, alarm `#F05A4F`, ok green `#4CC38A`, keyword blue `#2F6BFF`, keyword orange `#FF8A1F`.

## Captions

The caption is the scene's on-screen text, nothing extra beside it.
- The scene's `headline` becomes the caption line.
- Its `lines` become the content of the window and cards.
- There is no separate title on top.

Setting it:
- One short line, centred just above TikTok's caption zone (`bottom: SAFE.bottom + 20`), in a heavy rounded sans with Vietnamese glyphs. It changes with each voiceover phrase, about every 1.5 s.
- Exactly one keyword per line is coloured: blue for the product's words, orange for the contrast ("chỉ **~20 MB**", "bằng ngôn ngữ **Rust**", "không **Electron**").
- A small label above the hero object names the feature (`Gọi thoại`, `Lịch sử lưu`). It is coloured text in a semibold face, with no background.

## Structure

1. **Pain** (about 12%): the problem shown as glowing red cards on the dark opening, with `<Brand />` ("máy yếu mở Zalo là đơ").
2. **Answer** (about 12%): the frame blooms into the pastel ground. The product's logo slams onto the app window.
   - Only use a logo that is the product's own; the repo avatar is often the author's picture. Without one, slam the repo name in heavy type, and the avatar may go on the install box as a sticker.
   - Then a mascot pops up if the product has one, followed by two or three lines on what it is built with.
3. **Proof** (about 8%): the red card turns into the green number, then the reveal object (install box + confetti).
4. **Features** (about 45%): one feature per 2–3 s beat. The camera moves onto the floating window and the relevant part lifts out.
5. **Reach** (about 15%): speed, platforms on a podium, open source.
6. **End card**: the product's logo or name, and its link.

## Motion

- Entrances are springs with a small overshoot: windows scale in from 0.9 while rotating a few degrees into place, stickers pop with a bounce. Never start from 0 scale.
- Keep slow parallax drift everywhere. Blobs and hero move at different speeds, so no frame is ever fully still.
- Scenes change by a soft push or a zoom through the hero object. Use the kit's `zoomPunch()` only on the proof reveal.

## In Remotion (60 fps)

- Entrance: `spring({ fps, frame, config: { damping: 12, stiffness: 120 } })`, with opacity 0→1 over the first 12 frames.
- Blobs: absolutely positioned `<div>`s with `border-radius` and a `radial-gradient` fill that fades to transparent. That gives the soft edge with no `filter: blur`. Each drifts on its own `Math.sin(frame / period)`, with a different period per blob so the field never visibly loops.
- Tilted window: CSS `perspective: 1600px` on the parent, with `rotateX/rotateY` springing to a resting 6–10°. Save `@remotion/three` for one true object per scene (the box, the mascot).
- 3D colour: the kit's `Stage3D` lights turn pastel paint brown. Give each `meshStandardMaterial` `emissive` set to its own colour at `emissiveIntensity` about 0.45, which brings back the clay-pastel look.
- Contact shadow: an ellipse with a radial gradient under the object, scaled with the object's height above it.
- Caption: one component taking `text` and `highlight`, timed from each clip's length in durations.json.
