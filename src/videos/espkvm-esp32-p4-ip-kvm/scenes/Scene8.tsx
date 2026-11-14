import React from "react";
import { AbsoluteFill, useCurrentFrame, OffthreadVideo, interpolate } from "remotion";
import { videoAsset } from "../../../kit";
import { getCameraShake } from "../theme";
import { LiveCounter, SerifSubtitle, Vignette, ColorGrade, CornerCredit } from "../SimulationHud";
import { PinoutGotchaOverlay } from "../SimulationOverlays";

const SLUG = "espkvm-esp32-p4-ip-kvm";

export const Scene8: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  const shake = getCameraShake(frame, 3.5);
  const driftScale = interpolate(frame, [0, len], [1.04, 1.12]);

  // Fast cuts:
  // Cut 1: 0 - 85 (Soldering & wiring footage)
  // Cut 2: 85 - 175 (Pinout gotcha diagram)
  // Cut 3: 175 - 260 (Wiring footage zoom)
  // Cut 4: 260 - 355 (Security cert.pem notice)
  // Cut 5: 355 - 479 (Wiring footage verified)
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

  const isAlert = frame < 260;

  const subtitle =
    frame < 120
      ? "Nhưng lưu ý cổng nối máy chủ nằm ở giắc MX1.25..."
      : frame < 240
      ? "...chứ không phải cổng Type-C trên bo mạch..."
      : frame < 360
      ? "...và nhớ cài chứng chỉ CA cert.pem vào máy..."
      : "...thì trình duyệt mới kích hoạt đầy đủ phím chuột!";

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0C0608" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) rotate(${shake.rot}deg) scale(${driftScale})`,
        }}
      >
        {cut === 1 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/electronic-circuit-wiring-soldering-pixabay-33577.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85)" }}
          />
        )}
        {cut === 2 && <PinoutGotchaOverlay />}
        {cut === 3 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/electronic-circuit-wiring-soldering-pixabay-33577.mp4")}
            muted
            trimBefore={120}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.8) contrast(1.1)",
              transform: "scale(1.2)",
            }}
          />
        )}
        {cut === 4 && <PinoutGotchaOverlay />}
        {cut === 5 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/electronic-circuit-wiring-soldering-pixabay-33577.mp4")}
            muted
            trimBefore={200}
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

      {/* Shifts from red warning to neutral/warm */}
      <ColorGrade mode={isAlert ? "red" : "cold-blue"} intensity={0.4} alertPulse={isAlert} />
      <Vignette intensity={0.84} />

      <LiveCounter
        label="HARDWARE WIRING · SECURITY CA"
        value1="MX1.25"
        unit1="OTG"
        value2="CA CERT"
        unit2={isAlert ? "ALERT" : "TRUSTED"}
        color={isAlert ? "#F87171" : "#34D399"}
      />

      <SerifSubtitle text={subtitle} />
      <CornerCredit text="Footage: Pixabay / motionstock" />
    </AbsoluteFill>
  );
};
