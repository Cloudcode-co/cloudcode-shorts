# Build Notes: espkvm-esp32-p4-ip-kvm

Built a cinematic "What-if simulation" TikTok short for `espkvm-esp32-p4-ip-kvm` seen through the viewer's eyes as a high-stakes homelab server rescue mission. The world fills the entire 1080×1920 frame and continuously moves with subtle camera shake, cinematic vignette, and story-driven color shifts (alarm red for the BIOS kernel panic, cold electric blue for the ESP32-P4 hardware pipeline and 60ms latency drop, and warm haze for homelab recovery). Implemented real-time tabular numeral telemetry counters (`LiveCounter`) and low-centered serif italic subtitles (`Lora` italic with full Vietnamese diacritics support) cut tightly to musical downbeats with visual changes occurring at least every 1.5 seconds.

During QA inspection of rendered stills, fixed:
1. **Overlay text collision with LiveCounter**: moved all in-code simulation overlays (BIOS screen, CSI pipeline, latency scope, web flasher) down to `SAFE.top + 215px` to provide ample clearance below the HUD counter.
2. **Right-side clipping under TikTok buttons**: corrected overlay container right padding to `SAFE.right` (200px) instead of `SAFE.left` (103px) so all diagrams and progress bars sit comfortably within the safe action area.
3. **LiveCounter awkward wrapping**: tightened typography and tabular numeral spacing (`whiteSpace: "nowrap"`, font size 60px) to prevent separator wrapping across lines.
4. **Subtitle opacity flicker**: eliminated periodic modulo-frame drops so serif italic subtitles remain smoothly legible throughout transitions.
5. **Footage matching and credits**: replaced finger-typing macro footage in the outro with authentic developer desk relaxation footage (`atiqurrahman0047`) and small corner attribution.
