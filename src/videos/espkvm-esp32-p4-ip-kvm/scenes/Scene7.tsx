import React from "react";
import { AbsoluteFill, useCurrentFrame, OffthreadVideo, interpolate } from "remotion";
import { videoAsset } from "../../../kit";
import { getCameraShake } from "../theme";
import { LiveCounter, SerifSubtitle, Vignette, ColorGrade, CornerCredit } from "../SimulationHud";
import { WebSerialFlashOverlay } from "../SimulationOverlays";

const SLUG = "espkvm-esp32-p4-ip-kvm";

export const Scene7: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  const shake = getCameraShake(frame, 2.5);
  const driftScale = interpolate(frame, [0, len], [1.04, 1.12]);

  // Fast cuts:
  // Cut 1: 0 - 85 (USB-C cable plug footage)
  // Cut 2: 85 - 170 (Web Serial Flasher screen)
  // Cut 3: 170 - 255 (USB-C cable footage zoom)
  // Cut 4: 255 - 340 (Web Serial Flasher progress)
  // Cut 5: 340 - 446 (USB-C footage pan)
  const cut =
    frame < 85
      ? 1
      : frame < 170
      ? 2
      : frame < 255
      ? 3
      : frame < 340
      ? 4
      : 5;

  const pct = Math.min(100, Math.floor(15 + (frame / len) * 85));

  const subtitle =
    frame < 110
      ? "Để cài đặt, cắm cáp USB-C vào máy tính..."
      : frame < 230
      ? "...mở Chrome hoặc Edge vào trang web flasher..."
      : frame < 340
      ? "...nạp firmware trực tiếp qua Web Serial..."
      : "...không cần cài đặt toolchain hay driver phức tạp!";

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#020814" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) rotate(${shake.rot}deg) scale(${driftScale})`,
        }}
      >
        {cut === 1 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/usb-cable-plug-laptop-pixabay-187275.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85)" }}
          />
        )}
        {cut === 2 && <WebSerialFlashOverlay />}
        {cut === 3 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/usb-cable-plug-laptop-pixabay-187275.mp4")}
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
        {cut === 4 && <WebSerialFlashOverlay />}
        {cut === 5 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/usb-cable-plug-laptop-pixabay-187275.mp4")}
            muted
            trimBefore={160}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.85)",
              transform: "scaleX(-1)",
            }}
          />
        )}
      </AbsoluteFill>

      <ColorGrade mode="cold-blue" intensity={0.4} />
      <Vignette intensity={0.82} />

      <LiveCounter
        label="INSTALLATION · WEB SERIAL SPEED"
        value1="921,600"
        unit1="BAUD"
        value2={pct}
        unit2="% FLASH"
        color="#38BDF8"
      />

      <SerifSubtitle text={subtitle} />
      <CornerCredit text="Footage: Pixabay / alekslevet" />
    </AbsoluteFill>
  );
};
