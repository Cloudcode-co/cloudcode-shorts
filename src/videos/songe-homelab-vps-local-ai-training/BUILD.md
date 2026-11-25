An ops-console explainer for Songe: the local proxy on 127.0.0.1:7613 records real
agent work, trains during idle time as Quick/Deep Dream, then shows the hardware
matrix and the two-command `uv tool` install.

Review fixes:
- s1's second shot now keeps the headline "Tài nguyên nhàn rỗi đang bị lãng phí?"
  and the content lines "Máy chủ chạy 24/7" / "AI chỉ trả lời thụ động" in high-
  contrast white/warn over the darkened rack footage.
- s6 opens directly on the Quick Dream vs Deep Dream comparison (the generic
  chapter card is gone) and then moves to the adapter-training steps.
- s7 opens on "An toàn và dễ đảo ngược" with the three quality checks, then the
  `songe undo` and version-history panel; the overlapping version labels are fixed.
- s9 opens on "Cài đặt Songe" with both `uv tool install songe` and `songe init`
  already on screen in the kit Terminal.
- s10 opens on the "Lưu lại và trải nghiệm" call to action, not an empty frame.

Scene lengths are now derived from the gaps between the timeline's rounded scene
starts, so every cut lands exactly on its documented frame instead of drifting a
frame or two late; primary text and panels are on screen at the cut rather than
fading up from empty. Final QA stills show each flagged scene with its intended
content, and `npx tsc` passes.
