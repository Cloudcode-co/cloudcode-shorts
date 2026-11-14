import React from "react";
import { AbsoluteFill, useCurrentFrame, OffthreadVideo, interpolate } from "remotion";
import { videoAsset } from "../../../kit";
import { getCameraShake } from "../theme";
import { LiveCounter, SerifSubtitle, Vignette, ColorGrade, CornerCredit } from "../SimulationHud";
import { BiosScreenOverlay } from "../SimulationOverlays";

const SLUG = "espkvm-esp32-p4-ip-kvm";

export const Scene6: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  const shake = getCameraShake(frame, 3);
  const driftScale = interpolate(frame, [0, len], [1.04, 1.12]);

  // Fast cuts:
  // Cut 1: 0 - 85 (USB flash drive insert footage)
  // Cut 2: 85 - 170 (BIOS Setup screen with Virtual Media USB)
  // Cut 3: 170 - 255 (USB flash drive footage closer zoom)
  // Cut 4: 255 - 340 (BIOS Setup screen)
  // Cut 5: 340 - 425 (USB footage reverse)
  // Cut 6: 425 - 498 (BIOS Setup screen ready)
  const cut =
    frame < 85
      ? 1
      : frame < 170
      ? 2
      : frame < 255
      ? 3
      : frame < 340
      ? 4
      : frame < 425
      ? 5
      : 6;

  const mountPct = Math.min(100, Math.floor(35 + (frame / len) * 65));

  const subtitle =
    frame < 120
      ? "Máy chủ nhận thiết bị như chuột phím thật..."
      : frame < 240
      ? "...kèm tính năng Virtual Media mount ISO từ thẻ nhớ..."
      : frame < 370
      ? "...cho phép cắm file ISO cứu hộ từ xa qua mạng..."
      : "...cài lại hệ điều hành ngay trong BIOS!";

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#020914" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) rotate(${shake.rot}deg) scale(${driftScale})`,
        }}
      >
        {cut === 1 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/usb-flash-drive-insert-pixabay-53781.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85)" }}
          />
        )}
        {cut === 2 && <BiosScreenOverlay />}
        {cut === 3 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/usb-flash-drive-insert-pixabay-53781.mp4")}
            muted
            trimBefore={90}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.85) contrast(1.1)",
              transform: "scale(1.2)",
            }}
          />
        )}
        {cut === 4 && <BiosScreenOverlay />}
        {cut === 5 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/usb-flash-drive-insert-pixabay-53781.mp4")}
            muted
            trimBefore={150}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.85)",
              transform: "scaleX(-1)",
            }}
          />
        )}
        {cut === 6 && <BiosScreenOverlay />}
      </AbsoluteFill>

      <ColorGrade mode="cold-blue" intensity={0.4} />
      <Vignette intensity={0.82} />

      <LiveCounter
        label="USB EMULATION · VIRTUAL MEDIA"
        value1="USB 2.0"
        unit1="HID"
        value2={mountPct}
        unit2="% MOUNTED"
        color="#34D399"
      />

      <SerifSubtitle text={subtitle} />
      <CornerCredit text="Footage: Pixabay / Danil_Shostak" />
    </AbsoluteFill>
  );
};
