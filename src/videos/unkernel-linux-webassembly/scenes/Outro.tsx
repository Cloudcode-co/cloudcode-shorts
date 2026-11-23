import { Easing, Img, interpolate, useCurrentFrame } from "remotion";
import { mono, sans } from "../../../kit";
import { C, a } from "../palette";
import { Headline, Label, Lamp, Panel, Scene, Status, appear, rise } from "../ui";

const STARS = 1176;

const formatStars = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const Icon: React.FC<{ kind: "save" | "follow" }> = ({ kind }) => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={C.mint} strokeWidth="1.8">
    {kind === "save" ? (
      <path d="M6 3h12v18l-6-4.2L6 21z" strokeLinejoin="round" />
    ) : (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" strokeLinecap="round" />
      </>
    )}
  </svg>
);

const CtaRow: React.FC<{ p: number; kind: "save" | "follow"; text: string }> = ({
  p,
  kind,
  text,
}) => (
  <div
    style={{
      ...rise(p, 14),
      display: "flex",
      alignItems: "center",
      gap: 18,
      borderTop: `1px solid ${C.line}`,
      paddingTop: 14,
      fontFamily: sans,
      fontSize: 38,
      fontWeight: 700,
      color: C.text,
    }}
  >
    <Icon kind={kind} />
    {text}
  </div>
);

export const Outro: React.FC<{ len: number }> = () => {
  const f = useCurrentFrame();
  const head = appear(f, 2, 16);
  const repo = appear(f, 16, 18);
  const question = appear(f, 180, 18);
  const save = appear(f, 110, 16);
  const follow = appear(f, 144, 16);
  const blink = Math.floor(f / 18) % 2 === 0;

  const starP = interpolate(f, [38, 148], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <Scene style={{ gap: 20 }}>
      <Headline size={86} style={rise(head, 28)}>
        Lưu lại và
        <br />
        trải nghiệm
      </Headline>

      <Panel
        tone="mint"
        style={rise(repo, 30)}
        bodyStyle={{ display: "flex", flexDirection: "column", gap: 10 }}
        title={
          <>
            <Img
              src={a("repos/pithings.png")}
              style={{ width: 46, height: 46, borderRadius: 23, background: "#fff" }}
            />
            <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 38 }}>pithings/unkernel</span>
          </>
        }
        right={<Label color={C.dim}>GPL-2.0</Label>}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="54" height="54" viewBox="0 0 24 24" fill={C.mint}>
            <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8-6.1-3.6-6.1 3.6 1.5-6.8L2.2 9.5l6.9-.7z" />
          </svg>
          <span
            style={{
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 104,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: C.text,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatStars(Math.round(STARS * starP))}
          </span>
          <span style={{ fontFamily: sans, fontSize: 44, color: C.dim }}>sao</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Lamp color={C.mint} size={12} />
          <span style={{ fontFamily: sans, fontSize: 34, color: C.dim, lineHeight: 1.18 }}>
            nhân Linux biên dịch sang wasm
          </span>
        </div>
        <span style={{ fontFamily: mono, fontSize: 34, color: C.faint }}>
          github.com/pithings/unkernel
        </span>
      </Panel>

      <Panel
        tone="dim"
        style={{ ...rise(question, 28), flex: 1, display: "flex", flexDirection: "column" }}
        bodyStyle={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, justifyContent: "center" }}
        title={<Label color={C.dim}>câu hỏi</Label>}
        right={<Status color={C.mint}>shell ready</Status>}
      >
        <div
          style={{
            fontFamily: sans,
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1.22,
            color: C.text,
            textWrap: "balance",
          }}
        >
          Liệu nhân Linux chạy trên web dưới một giây đã đủ tiện chưa?
          <span
            style={{
              display: "inline-block",
              width: 18,
              height: 38,
              marginLeft: 8,
              verticalAlign: "-4px",
              background: blink ? C.mint : C.line,
            }}
          />
        </div>
        <span style={{ fontFamily: mono, fontSize: 34, color: C.faint }}>
          0.300 s / shell ready / alpine
        </span>
      </Panel>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <CtaRow p={save} kind="save" text="Lưu video để vọc thử" />
        <CtaRow p={follow} kind="follow" text="Follow kênh để xem thêm mẹo dev" />
      </div>
    </Scene>
  );
};
