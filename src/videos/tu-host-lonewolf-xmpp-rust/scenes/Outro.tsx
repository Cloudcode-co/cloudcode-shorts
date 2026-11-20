import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { Sfx } from "../../../kit";
import { C, F, SL, SW, a, stars } from "../palette";
import { at, land } from "../plan";
import { LowerThird } from "../parts";

// s9 — what it cannot do yet. The notes land right after the headline so the
// frame is never a headline over an empty lower half.
export const Caveats: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  const head = land(f, 1, 11);
  const badge = land(f, 3, 12);
  const notes = [
    { at: 3, text: "Chỉ chạy single-node" },
    { at: 6, text: "Chưa hỗ trợ chat nhóm MUC" },
    { at: 9, text: "Chưa lưu lịch sử MAM" },
  ];
  const roadmap = at(start, 0.53);
  return (
    <AbsoluteFill>
      <Sfx id="thud" at={3} volume={0.36} />
      <Sfx id="pop" at={6} volume={0.2} />
      <Sfx id="pop" at={9} volume={0.2} />
      <Sfx id="pop" at={roadmap} volume={0.2} />
      <div
        style={{
          position: "absolute",
          left: SL,
          top: 372,
          width: SW,
          fontFamily: F.sans,
          fontWeight: 900,
          fontSize: 64,
          lineHeight: 1,
          letterSpacing: -1.2,
          color: C.white,
          opacity: head,
          transform: `translateY(${(1 - head) * 26}px)`,
        }}
      >
        Lưu ý hiện tại
      </div>

      <div
        style={{
          position: "absolute",
          left: SL,
          top: 470,
          width: SW,
          opacity: badge,
          transform: `translateY(${(1 - badge) * 30}px)`,
        }}
      >
        <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 38, lineHeight: 1.2, color: C.dim }}>
          Phiên bản
        </div>
        <div
          style={{
            fontFamily: F.sans,
            fontWeight: 900,
            fontSize: 146,
            lineHeight: 0.86,
            letterSpacing: -4,
            color: C.red,
            marginTop: 4,
          }}
        >
          PRE-1.0
        </div>
        <div
          style={{
            fontFamily: F.sans,
            fontWeight: 600,
            fontSize: 34,
            lineHeight: 1.2,
            color: C.dim,
            marginTop: 12,
          }}
        >
          Định dạng lưu trữ có thể thay đổi
        </div>
      </div>

      <div style={{ position: "absolute", left: SL, top: 716, width: SW }}>
        {notes.map((row, i) => {
          const p = land(f, row.at, 13);
          return (
            <div
              key={row.text}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                height: 144,
                marginTop: i === 0 ? 0 : 10,
                boxSizing: "border-box",
                background: C.white,
                borderRadius: 4,
                paddingLeft: 36,
                paddingRight: 26,
                overflow: "hidden",
                opacity: p,
                transform: `translateY(${(1 - p) * 26}px)`,
              }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 8, background: C.red }} />
              <div
                style={{
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 50,
                  lineHeight: 1.08,
                  color: C.onPaper,
                  textWrap: "balance",
                }}
              >
                {row.text}
              </div>
            </div>
          );
        })}
      </div>

      <LowerThird
        at={roadmap}
        y={1180}
        h={126}
        label="ROADMAP"
        text="Clustering và PostgreSQL ở giai đoạn sau"
      />
    </AbsoluteFill>
  );
};

// s10 — save it, follow, and the closing question.
export const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const head = land(f, 8, 14);
  const save = land(f, 70, 13);
  const follow = land(f, 170, 13);
  const question = land(f, 330, 15);
  const mark = land(f, 450, 14);
  return (
    <AbsoluteFill>
      <Sfx id="pop" at={70} volume={0.22} />
      <Sfx id="pop" at={170} volume={0.22} />
      <Sfx id="ding" at={330} volume={0.26} />
      <Sfx id="pop" at={450} volume={0.22} />
      <div
        style={{
          position: "absolute",
          left: SL,
          top: 408,
          width: SW,
          fontFamily: F.sans,
          fontWeight: 900,
          fontSize: 96,
          lineHeight: 0.98,
          letterSpacing: -3,
          color: C.white,
          opacity: head,
          transform: `translateY(${(1 - head) * 30}px)`,
        }}
      >
        Lưu video
        <br />
        và thử ngay
      </div>

      <div style={{ position: "absolute", left: SL, top: 700, width: SW }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            opacity: save,
            transform: `translateX(${(1 - save) * -30}px)`,
          }}
        >
          <div style={{ width: 10, height: 10, background: C.red }} />
          <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 38, color: C.white }}>
            Lưu lại để triển khai trên VPS
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 22,
            opacity: follow,
            transform: `translateX(${(1 - follow) * -30}px)`,
          }}
        >
          <div style={{ width: 10, height: 10, background: C.red }} />
          <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 38, color: C.white }}>
            Follow để đón xem cập nhật mới
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: SL,
          top: 900,
          width: SW,
          fontFamily: F.sans,
          fontWeight: 900,
          fontSize: 70,
          lineHeight: 1.02,
          letterSpacing: -2,
          color: C.red,
          opacity: question,
          transform: `translateY(${(1 - question) * 28}px)`,
        }}
      >
        SẴN SÀNG BỎ
        <br />
        DATABASE RỜI?
      </div>

      <div
        style={{
          position: "absolute",
          left: SL,
          top: 1140,
          width: SW,
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: mark,
          transform: `translateY(${(1 - mark) * 22}px)`,
        }}
      >
        <Img
          src={a("repos/lonewolf-im.png")}
          style={{
            width: 74,
            height: 74,
            borderRadius: 14,
            border: "2px solid rgba(255,255,255,0.55)",
            background: "#EEF3F9",
          }}
        />
        <div>
          <div style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 40, lineHeight: 1, color: C.white }}>
            Lonewolf
          </div>
          <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: C.dim, marginTop: 7 }}>
            {stars(111)} sao GitHub · Apache-2.0
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
