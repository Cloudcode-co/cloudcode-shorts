import React from "react";
import { AbsoluteFill, useCurrentFrame, OffthreadVideo, interpolate } from "remotion";
import { videoAsset } from "../../../kit";
import { getCameraShake } from "../theme";
import { LiveCounter, SerifSubtitle, Vignette, ColorGrade, CornerCredit } from "../SimulationHud";
import { HomelabRestoredOverlay } from "../SimulationOverlays";

const SLUG = "espkvm-esp32-p4-ip-kvm";

export const Scene10: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  const shake = getCameraShake(frame, 2);
  const driftScale = interpolate(frame, [0, len], [1.03, 1.1]);

  // Fast cuts:
  // Cut 1: 0 - 85 (Developer smiling footage)
  // Cut 2: 85 - 175 (Homelab restored telemetry)
  // Cut 3: 175 - 260 (Developer smiling footage zoom)
  // Cut 4: 260 - 355 (Homelab operational overview)
  // Cut 5: 355 - 464 (Developer smiling final hold)
  const cut =
    frame < 85
      ? 1
      : frame < 175
      ? 2
      : frame < 260
      ? 3
      : frame < 355
      ? 4
      : 5;

  const subtitle =
    frame < 110
      ? "Lưu video lại để tự dựng IP-KVM cứu hộ homelab..."
      : frame < 230
      ? "...giải pháp KVM ngon bổ rẻ chỉ vài trăm nghìn..."
      : frame < 340
      ? "...và bấm theo dõi để không lo kẹt ở BIOS nhé!"
      : "Follow kênh để đón xem nhiều dự án homelab mới!";

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#040D08" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) rotate(${shake.rot}deg) scale(${driftScale})`,
        }}
      >
        {cut === 1 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/man-smiling-laptop-success-pixabay-86866.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.9)" }}
          />
        )}
        {cut === 2 && <HomelabRestoredOverlay />}
        {cut === 3 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/man-smiling-laptop-success-pixabay-86866.mp4")}
            muted
            trimBefore={60}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.9) contrast(1.1)",
              transform: "scale(1.15)",
            }}
          />
        )}
        {cut === 4 && <HomelabRestoredOverlay />}
        {cut === 5 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/man-smiling-laptop-success-pixabay-86866.mp4")}
            muted
            trimBefore={120}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.92)" }}
          />
        )}
      </AbsoluteFill>

      {/* Warm haze closing grade */}
      <ColorGrade mode="warm" intensity={0.35} />
      <Vignette intensity={0.75} />

      <LiveCounter
        label="HOMELAB STATUS · AVAILABILITY"
        value1="100%"
        unit1="RESCUED"
        value2="24/7"
        unit2="ONLINE"
        color="#34D399"
      />

      <SerifSubtitle text={subtitle} />
      <CornerCredit text="Footage: Pixabay / atiqurrahman0047" />
    </AbsoluteFill>
  );
};
