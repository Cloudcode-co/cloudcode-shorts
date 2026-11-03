import { Img } from "remotion";
import {
  siDiscord,
  siDocker,
  siJavascript,
  siPython,
  siSignal,
  siTelegram,
  siWhatsapp,
  siZalo,
} from "simple-icons";
import { BrandIcon, BrandIcons, Shot, display, enter, useIn } from "../../../kit";
import { C, a } from "../palette";

export type Row = {
  label: string;
  claw: string;
  hermes: string;
  clawIcons?: BrandIcon[];
  hermesIcons?: BrandIcon[];
};

// Sources: docs.openclaw.ai "OpenClaw and Hermes Agent" + NousResearch/hermes-agent README.
export const ROWS: Row[] = [
  { label: "Giỏi nhất ở đâu", claw: "Nối được cực nhiều kênh chat", hermes: "Tự học, tự viết skill mới" },
  {
    label: "Nhắn tin qua đâu",
    claw: "Có cả Zalo, WhatsApp, Telegram",
    hermes: "Telegram, Discord, Slack, Signal",
    clawIcons: [siZalo, siWhatsapp, siTelegram, siDiscord],
    // simple-icons no longer ships Slack's logo, so it is named in text only.
    hermesIcons: [siTelegram, siDiscord, siSignal],
  },
  { label: "Nhớ thế nào", claw: "Ghi rõ nguồn, xoá vẫn có dấu vết", hermes: "Tự ghi nhớ, tìm lại được chat cũ" },
  {
    label: "Chạy code bằng gì",
    claw: "JavaScript",
    hermes: "Python, trên Docker, SSH, Modal",
    clawIcons: [siJavascript],
    hermesIcons: [siPython, siDocker],
  },
  { label: "Ai đứng sau", claw: "Một quỹ phi lợi nhuận", hermes: "Nous Research, có gói trả phí" },
];

export const Side: React.FC<{
  who: "claw" | "hermes";
  children: React.ReactNode;
  delay: number;
}> = ({ who, children, delay }) => {
  const p = useIn(delay);
  const claw = who === "claw";
  return (
    <div
      style={{
        ...enter(p, 40),
        background: claw ? C.lobster : C.gold,
        color: claw ? C.white : C.hermesInk,
        borderRadius: 32,
        padding: "30px 36px 38px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Img
          src={a(
            claw ? "agents/avatar-openclaw.png" : "agents/avatar-NousResearch.png",
          )}
          style={{ width: 72, height: 72, borderRadius: 36 }}
        />
        <div style={{ fontSize: 38, fontWeight: 700 }}>
          {claw ? "OpenClaw" : "Hermes"}
        </div>
      </div>
      <div style={{ marginTop: 18 }}>{children}</div>
    </div>
  );
};

const big = {
  fontFamily: display,
  fontWeight: 800,
  fontSize: 72,
  lineHeight: 1.05,
};

// `hermesAt` brings in the Hermes card when the voiceover gets to it.
export const CompareShot: React.FC<{ row: Row; len: number; hermesAt: number }> = ({
  row,
  len,
  hermesAt,
}) => {
  const head = useIn(0, 10);
  return (
    <Shot bg={C.white} len={len} style={{ gap: 30, justifyContent: "center" }}>
      <div
        style={{
          ...enter(head),
          fontFamily: display,
          fontWeight: 800,
          fontSize: 80,
          color: C.hermesInk,
        }}
      >
        {row.label}?
      </div>
      <Side who="claw" delay={8}>
        <div style={big}>{row.claw}</div>
        {row.clawIcons && <BrandIcons icons={row.clawIcons} delay={20} />}
      </Side>
      <Side who="hermes" delay={hermesAt}>
        <div style={big}>{row.hermes}</div>
        {row.hermesIcons && <BrandIcons icons={row.hermesIcons} delay={hermesAt + 12} />}
      </Side>
    </Shot>
  );
};

export const FreeShot: React.FC<{ len: number }> = ({ len }) => {
  const pics = useIn(0, 16);
  const title = useIn(6);
  const sub = useIn(20);
  return (
    <Shot bg={C.lobster} len={len} style={{ justifyContent: "center", gap: 28 }}>
      <div style={{ ...enter(pics, 40), display: "flex", gap: 24, marginBottom: 20 }}>
        {["agents/avatar-openclaw.png", "agents/avatar-NousResearch.png"].map((src) => (
          <Img
            key={src}
            src={a(src)}
            style={{
              width: 260,
              height: 260,
              borderRadius: 40,
              border: `8px solid ${C.white}`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          ...enter(title),
          fontFamily: display,
          fontWeight: 800,
          fontSize: 136,
          lineHeight: 0.98,
          color: C.white,
        }}
      >
        Cả hai đều miễn phí
      </div>
      <div style={{ ...enter(sub), fontSize: 48, fontWeight: 700, color: C.white }}>
        Mã nguồn mở, giấy phép MIT, tự cài trên máy của bạn.
      </div>
    </Shot>
  );
};
