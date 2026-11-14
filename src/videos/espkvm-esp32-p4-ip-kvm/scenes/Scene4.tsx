import React from "react";
import { AbsoluteFill, useCurrentFrame, OffthreadVideo, Img, interpolate } from "remotion";
import { videoAsset } from "../../../kit";
import { getCameraShake } from "../theme";
import { LiveCounter, SerifSubtitle, Vignette, ColorGrade, CornerCredit } from "../SimulationHud";
import { CsiPipelineOverlay, Scanlines } from "../SimulationOverlays";

const SLUG = "espkvm-esp32-p4-ip-kvm";

export const Scene4: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  // Growing shake toward the drop at the end of scene 4!
  const shakeIntensity = interpolate(frame, [0, len - 60, len], [2, 6, 12], {
    extrapolateRight: "clamp",
  });
  const shake = getCameraShake(frame, shakeIntensity);
  const driftScale = interpolate(frame, [0, len], [1.04, 1.14]);

  // Fast cuts (every 80-90 frames):
  // Cut 1: 0 - 80 (Network cable footage)
  // Cut 2: 80 - 170 (CSI hardware flow diagram)
  // Cut 3: 170 - 260 (Macro processor photo)
  // Cut 4: 260 - 350 (Network cable footage zoom)
  // Cut 5: 350 - 440 (CSI pipeline overlay)
  // Cut 6: 440 - 520 (Circuit board footage)
  // Cut 7: 520 - 593 (High tension build-up before the drop!)
  const cut =
    frame < 80
      ? 1
      : frame < 170
      ? 2
      : frame < 260
      ? 3
      : frame < 350
      ? 4
      : frame < 440
      ? 5
      : frame < 520
      ? 6
      : 7;

  const fpsVal = interpolate(frame, [0, len], [20, 27], { extrapolateRight: "clamp" });

  const subtitle =
    frame < 130
      ? "Chip cầu Toshiba TC358743 bắt tín hiệu HDMI..."
      : frame < 270
      ? "...đẩy qua giao tiếp CSI tốc độ cao..."
      : frame < 420
      ? "...để bộ mã hóa phần cứng ESP32-P4 nén video..."
      : "...sẵn sàng truyền hình ảnh mượt mà tức thì!";

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#040812" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) rotate(${shake.rot}deg) scale(${driftScale})`,
        }}
      >
        {cut === 1 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/network-cable-ethernet-connection-pixabay-14906.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85)" }}
          />
        )}
        {cut === 2 && <CsiPipelineOverlay />}
        {cut === 3 && (
          <AbsoluteFill>
            <Img
              src={videoAsset(SLUG, "images/circuit-motherboard-processor-macro-pixabay-564811.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.8) contrast(1.15)",
                transform: `scale(${1 + (frame - 170) * 0.003})`,
              }}
            />
            <Scanlines opacity={0.2} />
          </AbsoluteFill>
        )}
        {cut === 4 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/network-cable-ethernet-connection-pixabay-14906.mp4")}
            muted
            trimBefore={100}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.8)",
              transform: "scale(1.2)",
            }}
          />
        )}
        {cut === 5 && <CsiPipelineOverlay />}
        {cut === 6 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/circuit-board-microchip-pixabay-13370.mp4")}
            muted
            trimBefore={60}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8)" }}
          />
        )}
        {cut === 7 && (
          <AbsoluteFill style={{ backgroundColor: "#0284C7" }}>
            <Img
              src={videoAsset(SLUG, "images/circuit-motherboard-processor-macro-pixabay-564811.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(1.1) contrast(1.3) hue-rotate(190deg)",
                transform: `scale(${1.15 + (frame - 520) * 0.004})`,
              }}
            />
            <Scanlines opacity={0.3} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>

      <ColorGrade mode="cold-blue" intensity={0.45} />
      <Vignette intensity={0.82} />

      <LiveCounter
        label="HARDWARE PIPELINE · CSI BANDWIDTH"
        value1={Math.round(fpsVal)}
        unit1="FPS 1080P"
        value2="1.50"
        unit2="GBPS CSI"
        color="#38BDF8"
      />

      <SerifSubtitle text={subtitle} />
      <CornerCredit text="Footage: Pixabay / cipnt" />
    </AbsoluteFill>
  );
};
