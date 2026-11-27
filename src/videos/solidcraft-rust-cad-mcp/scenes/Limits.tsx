import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { onBeat } from "../timing";
import {
  C,
  Footage,
  Hairline,
  Safe,
  Stamp,
  Vignette,
  ramp,
  serif,
  serifItalic,
  shadow,
} from "../theme";

// s10 — the limits: Wasm32 caps plugin memory at 4096 MiB, and one of the
// 76 reference parts is still a tracked bug.
export const Limits: React.FC = () => {
  const f = useCurrentFrame();
  const big = ramp(f, 12, 18);
  const scale = interpolate(big, [0, 1], [1.06, 1]);
  const rest = ramp(f, 70, 18);
  const bug = ramp(f, onBeat("s10", 430), 18);
  const note = ramp(f, onBeat("s10", 466), 18);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <Footage
        file="footage/developer-at-desk-night-pixabay-232538.mp4"
        len={599}
        from={1}
        seconds={11}
        position="46% 52%"
        push={[1.04, 1.12]}
        brightness={0.46}
        saturation={0.35}
      />
      <Vignette strength={1.15} />

      <Safe>
        <div
          style={{
            position: "absolute",
            top: 84,
            left: 0,
            fontFamily: serif,
            fontSize: 50,
            fontWeight: 600,
            lineHeight: 1.06,
            ...shadow,
          }}
        >
          Giới hạn kỹ thuật
        </div>

        <Stamp style={{ position: "absolute", top: 150, opacity: ramp(f, 40, 20) }}>
          WASM32 ABI
        </Stamp>

        <div
          style={{
            position: "absolute",
            top: 236,
            left: -4,
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            opacity: big,
            scale: String(scale),
            transformOrigin: "left bottom",
          }}
        >
          <span
            style={{
              fontFamily: serif,
              fontSize: 248,
              lineHeight: 1,
              fontWeight: 600,
              letterSpacing: -9,
              fontVariantNumeric: "tabular-nums",
              ...shadow,
            }}
          >
            4096
          </span>
          <span
            style={{
              fontFamily: serif,
              fontSize: 86,
              fontWeight: 400,
              color: C.blue,
              ...shadow,
            }}
          >
            MiB
          </span>
        </div>

        <Hairline style={{ position: "absolute", top: 530, left: 0, right: 0, opacity: rest }} />

        <div
          style={{
            position: "absolute",
            top: 554,
            left: 0,
            fontFamily: serif,
            fontSize: 38,
            lineHeight: 1.4,
            color: C.paper,
            opacity: rest,
            ...shadow,
          }}
        >
          bộ nhớ tối đa cho plugin
        </div>
        <div
          style={{
            position: "absolute",
            top: 606,
            left: 0,
            fontFamily: serifItalic,
            fontSize: 34,
            color: C.dust,
            opacity: rest,
            ...shadow,
          }}
        >
          chặn bởi quy chuẩn Wasm32 hiện tại
        </div>

        <Hairline style={{ position: "absolute", top: 744, left: 0, right: 0, opacity: bug }} />

        <div
          style={{
            position: "absolute",
            top: 786,
            left: 0,
            display: "flex",
            alignItems: "baseline",
            gap: 14,
            opacity: bug,
            transform: `translateY(${(1 - bug) * 18}px)`,
          }}
        >
          <span
            style={{
              fontFamily: serif,
              fontSize: 152,
              lineHeight: 0.9,
              fontWeight: 600,
              color: C.blue,
              fontVariantNumeric: "tabular-nums",
              ...shadow,
            }}
          >
            1
          </span>
          <span
            style={{
              fontFamily: serif,
              fontSize: 54,
              lineHeight: 1,
              color: C.dust,
              ...shadow,
            }}
          >
            /76
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 950,
            left: 0,
            fontFamily: serif,
            fontSize: 38,
            lineHeight: 1.25,
            color: C.paper,
            opacity: bug,
            ...shadow,
          }}
        >
          chi tiết còn lỗi đang theo dõi
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 38,
            left: 0,
            width: 777,
            fontFamily: serif,
            fontSize: 34,
            lineHeight: 1.4,
            color: C.dust,
            opacity: note,
            ...shadow,
          }}
        >
          trong 76 chi tiết mẫu đã đối chiếu với FreeCAD
        </div>
      </Safe>
    </AbsoluteFill>
  );
};
