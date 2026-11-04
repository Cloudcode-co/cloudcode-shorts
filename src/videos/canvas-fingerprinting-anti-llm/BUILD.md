# Video Build Documentation: canvas-fingerprinting-anti-llm

## Overview
Built a short documentary video exploring how a canvas fingerprinting script on `servicepipe.tech` deployed anti-LLM obfuscation techniques—embedding dead-code biological weapon dosages (`computeRicinLethalDosage`) and invisible Unicode tag characters with a `-917504` subtraction offset to trip AI safety guardrails and political censorship filters. The visual treatment faithfully adheres to the documentary art direction: desaturated full-frame stock footage with soft radial vignettes, slow Ken Burns push-ins, lower-third captions set in serif (`Lora`), key numbers (`10.000`, `1.033`, `917.504`) set huge in serif (`Playfair Display`) on black between scenes, and rapid cuts at the Scene 4 turning point.

## QA & Visual Polish
- **Layout & Framing**: Refactored all scene panels into vertically balanced terminal, dossier, and dashboard displays, eliminating empty voids between the content cards and lower-third captions across all safe zones.
- **Typography & Localization**: Loaded `@remotion/google-fonts` for `Playfair Display` and `Lora` with explicit Vietnamese character subsets, guaranteeing diacritic rendering while maintaining a strict `>= 34px` minimum font size.
- **Evidence Presentation**: Cropped and scaled the golden wave canvas (`p1-3.jpg`) with a dark bottom gradient mask to focus cleanly on the artwork without displaying raw blog text, and expanded technical decompiler windows demonstrating the exact mathematical decryption logic (`917603 - 917504 = 99 -> 'c'`).
- **Pacing & Audio**: Sequenced 7 distinct documentary chapters with custom title cards and inter-scene key numbers, ducking background music under voiceover tracks and punctuating transitions with subtle sound effects.
