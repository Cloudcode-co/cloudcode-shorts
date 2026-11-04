import { OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { siApple, siLinux, siRaycast } from "simple-icons";
import { Brand, BRAND_SPACE, CONTENT_W, Sfx, Terminal, TYPE_DELAY, display, easeOut, mono, sans, typingFrames } from "../../kit";
import facts from "./facts.json";
import {
  ASKER, Avatar, C, CJ, ChatHeader, Composer, Feed, HANDY, Msg, SLUG, Thread, Wave, s, type Who,
} from "./chat";

const clip = (f: string) => staticFile(`videos/${SLUG}/footage/${f}`);

const Video: React.FC<{ file: string; w: number; h: number; pos?: string; from?: number }> = ({
  file, w, h, pos = "50% 50%", from = 0,
}) => (
  <div style={{ width: w, height: h }}>
    <OffthreadVideo
      src={clip(file)}
      muted
      trimBefore={from}
      style={{ width: w, height: h, objectFit: "cover", objectPosition: pos, display: "block" }}
    />
  </div>
);

const Em: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = C.pink }) => (
  <span style={{ color: c, fontWeight: 700 }}>{children}</span>
);

// 1 ── question arrives
export const S1: React.FC = () => (
  <>
  <Brand />
  <Thread padTop={BRAND_SPACE}>
    <ChatHeader who={ASKER} title="Anh em dev" sub="nhóm chat" />
    <Feed>
      <Msg at={s(0.5)} typing={s(0.5)} maxW={720}>
        <span style={{ fontSize: 50 }}>
          Anh em có muốn vừa nói là chữ tự gõ mà không cần gửi bất kỳ audio nào lên <Em c={C.amber}>cloud</Em> không?
        </span>
      </Msg>
      <Msg at={s(2.6)} typing={s(0.6)} who={{ color: C.teal }} bare>
        <Video file="developer-typing-desk-pixabay-203260.mp4" w={640} h={400} />
      </Msg>
      <Msg at={s(4.1)} who={HANDY} typing={s(0.7)}>Gõ văn bản bằng giọng nói</Msg>
      <Msg at={s(5.5)} who={HANDY} typing={s(0.6)} hideAvatar>
        <Em>100%</Em> offline trên máy tính
      </Msg>
    </Feed>
  </Thread>
  </>
);

// 2 ── Handy joins
const stars = facts.repos[0].stars;
export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(
    interpolate(frame, [s(0.3), s(1.8)], [0, stars], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut }),
  );
  const p = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  return (
    <Thread>
      <div style={{ opacity: p, translate: `0 ${(1 - p) * 30}px`, textAlign: "center", paddingTop: 20 }}>
        <div style={{ fontFamily: sans, fontSize: 36, color: C.dim, marginBottom: 26 }}>Handy đã tham gia nhóm</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Avatar who={HANDY} size={340} />
        </div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 120, color: "#fff", marginTop: 22, lineHeight: 1 }}>Handy</div>
        <div style={{ fontFamily: mono, fontSize: 38, color: C.pink, marginTop: 10 }}>cjpais/Handy</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 56, marginTop: 28, fontFamily: sans, fontSize: 40, color: C.dim }}>
          <span><b style={{ color: "#fff", fontSize: 54 }}>{n.toLocaleString("vi-VN")}</b> sao</span>
          <span><b style={{ color: C.amber, fontSize: 54 }}>{facts.repos[0].license}</b></span>
          <span><b style={{ color: C.teal, fontSize: 54 }}>{facts.repos[0].language}</b></span>
        </div>
      </div>
      <Feed>
        <Msg at={s(1.4)} who={HANDY} typing={s(0.5)}>Thử ngay Handy! Ứng dụng speech-to-text</Msg>
        <Msg at={s(3.4)} who={HANDY} typing={s(0.6)} hideAvatar>Mã nguồn mở <Em>MIT</Em></Msg>
        <Msg at={s(5.2)} who={HANDY} typing={s(0.6)} hideAvatar>Xử lý trực tiếp trên máy</Msg>
      </Feed>
    </Thread>
  );
};

// 3 ── the author
export const S3: React.FC = () => (
  <Thread>
    <ChatHeader who={CJ} title="CJ Pais" sub="tác giả Handy" />
    <Feed>
      <Msg at={s(0.3)} typing={s(0.3)} who={CJ} bare maxW={760}>
        <Video file="person-with-broken-hand-pixabay-10822.mp4" w={700} h={520} />
      </Msg>
      <Msg at={s(2.0)} who={CJ} typing={s(0.6)} hideAvatar>Tác giả: <Em>CJ Pais</Em></Msg>
      <Msg at={s(3.6)} who={CJ} typing={s(0.7)} hideAvatar>
        <span style={{ fontStyle: "italic" }}>“I built Handy because I broke a finger…”</span>
      </Msg>
      <Msg at={s(5.4)} who={CJ} typing={s(0.6)} hideAvatar>Tạo app vì bị <Em>gãy ngón tay</Em></Msg>
    </Feed>
  </Thread>
);

// 4 ── shortcut
export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const rec = frame >= s(3.6) && frame < s(6.6);
  return (
    <Thread>
      <ChatHeader who={HANDY} title="Handy" sub={rec ? "đang nghe…" : "trực tuyến"} />
      <Feed>
        <Msg at={s(0.3)} typing={s(0.3)} who={HANDY} bare maxW={760}>
          <Video file="speaking-into-desktop-microphone-pixabay-385618.mp4" w={700} h={400} pos="50% 30%" />
        </Msg>
        <Msg at={s(1.6)} who={HANDY} typing={s(0.6)} hideAvatar>
          Phím tắt mặc định
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 72, color: C.pink, marginTop: 6 }}>Ctrl + Space</div>
        </Msg>
        <Msg at={s(4.9)} out typing={s(0.6)}>Nói tự nhiên…</Msg>
        <Msg at={s(7.0)} who={HANDY} typing={s(0.7)}>Buông phím là chữ <Em>tự dán</Em> vào con trỏ</Msg>
        <Msg at={s(8.8)} who={HANDY} typing={s(0.5)} hideAvatar>Dán trực tiếp vào ô văn bản</Msg>
      </Feed>
      <Composer>
        {rec ? (
          <>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: "#FF4D6A", opacity: 0.5 + 0.5 * Math.sin(frame / 6) }} />
            <Wave n={26} h={70} />
          </>
        ) : (
          "Nhắn tin…"
        )}
      </Composer>
    </Thread>
  );
};

// 5 ── Silero + Whisper
const SILERO: Who = { name: "Silero VAD", color: C.teal, letter: "S" };
const WHISPER: Who = { name: "Whisper", color: C.amber, letter: "W" };
const Gated: React.FC = () => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [s(3.4), s(4.0)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: 100 }}>
      {Array.from({ length: 24 }, (_, i) => {
        const silent = i % 8 >= 5;
        const v = silent ? 0.1 + 0.9 * 0 : 0.35 + 0.65 * Math.abs(Math.sin(frame / 6 + i * 1.3));
        return (
          <div
            key={i}
            style={{
              width: silent ? 9 * k : 9,
              marginRight: silent ? -8 * (1 - k) : 0,
              height: 100 * (silent ? 0.12 : v),
              borderRadius: 5,
              background: silent ? C.dim : C.teal,
              opacity: silent ? k : 1,
            }}
          />
        );
      })}
    </div>
  );
};
export const S5: React.FC = () => (
  <Thread>
    <ChatHeader who={HANDY} title="Bên trong Handy" sub="2 thành phần" />
    <Feed>
      <Msg at={s(0.3)} who={SILERO} typing={s(0.4)}>Lọc khoảng lặng bằng <Em c={C.teal}>Silero VAD</Em></Msg>
      <Msg at={s(2.0)} who={SILERO} typing={s(0.4)} hideAvatar><Gated /></Msg>
      <Msg at={s(4.2)} who={WHISPER} typing={s(0.6)}>Whisper hỗ trợ phiên âm</Msg>
      <Msg at={s(5.6)} who={WHISPER} typing={s(0.5)} hideAvatar>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 190, lineHeight: 1, color: C.amber }}>99+</div>
        <div style={{ fontSize: 46 }}>ngôn ngữ</div>
      </Msg>
      <Msg at={s(7.3)} who={HANDY} typing={s(0.5)}>Chạy ngay trên máy anh em</Msg>
    </Feed>
  </Thread>
);

// 6 ── GPU vs CPU poll
const Option: React.FC<{ at: number; fill: number; label: string; c: string; fillAt: number }> = ({ at, fill, label, c, fillAt }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  if (frame < at) return null;
  const f = interpolate(frame, [fillAt, fillAt + 24], [0, fill], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  return (
    <div style={{ opacity: p, translate: `0 ${(1 - p) * 20}px`, marginTop: 30 }}>
      <div style={{ display: "flex", gap: 20, alignItems: "center", fontSize: 46, fontWeight: 700 }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, border: `5px solid ${c}`, flexShrink: 0, boxSizing: "border-box", background: f > 0.1 ? c : "transparent" }} />
        {label}
      </div>
      <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.12)", marginTop: 14 }}>
        <div style={{ height: 10, borderRadius: 5, width: `${f * 100}%`, background: c }} />
      </div>
    </div>
  );
};
export const S6: React.FC = () => (
  <Thread>
    <ChatHeader who={HANDY} title="Handy" sub="khảo sát nhanh" />
    <Feed>
      <Msg at={s(0.3)} who={HANDY} typing={s(0.4)} maxW={CONTENT_W - 100}>
        <div style={{ fontSize: 50, fontWeight: 700 }}>Máy bạn chạy GPU hay CPU?</div>
        <div style={{ width: CONTENT_W - 220 }}>
          <Option at={s(1.0)} fillAt={s(1.6)} fill={0.85} c={C.amber} label="Whisper Turbo hoặc Large khi có GPU" />
          <Option at={s(4.6)} fillAt={s(5.0)} fill={0.85} c={C.teal} label="Parakeet V3 tối ưu riêng cho CPU" />
        </div>
      </Msg>
      <Msg at={s(3.0)} out typing={s(0.5)}>GPU thì <Em c={C.ink}>Whisper</Em></Msg>
      <Msg at={s(6.7)} who={HANDY} typing={s(0.6)}>Parakeet V3 nhận diện ngôn ngữ tự động</Msg>
      <Msg at={s(8.2)} who={HANDY} typing={s(0.4)} hideAvatar>Cực nhanh trên CPU</Msg>
    </Feed>
  </Thread>
);

// 7 ── hooks, Raycast, CLI
const RAYCAST: Who = { name: "Raycast", color: "#FF6363", icon: siRaycast.path };
const CLI = "handy --toggle-transcription";
export const S7: React.FC = () => (
  <Thread>
    <ChatHeader who={HANDY} title="Dành cho dev" sub="hook và CLI" />
    <Feed>
      <Msg at={s(0.3)} who={HANDY} typing={s(0.4)}>Hook script sửa văn bản <Em>trước khi dán</Em></Msg>
      <Msg at={s(1.8)} who={HANDY} typing={s(0.5)} hideAvatar>
        <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 40, color: C.pink }}>hooks/transcription</span>
      </Msg>
      <Msg at={s(3.2)} who={RAYCAST} typing={s(0.5)}>Điều khiển qua Raycast</Msg>
      <Msg at={s(4.4)} out typing={s(0.5)} bare maxW={CONTENT_W}>
        <Terminal cmds={[CLI]} width={CONTENT_W - 60} fontSize={38} minHeight={120} />
        <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames([CLI])} volume={0.3} />
      </Msg>
    </Feed>
  </Thread>
);

// 8 ── platforms
const PLATFORMS: { label: string; who: Who; at: number }[] = [
  { label: "Windows", who: { color: C.teal, letter: "W" }, at: 0.3 },
  { label: "macOS", who: { color: "#111", icon: siApple.path }, at: 1.6 },
  { label: "Linux", who: { color: C.ink, icon: siLinux.path }, at: 2.9 },
];
const Join: React.FC<{ label: string; who: Who; at: number }> = ({ label, who, at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [s(at), s(at) + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  if (frame < s(at)) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: p, translate: `${(1 - p) * -60}px 0`, marginBottom: 26 }}>
      <Avatar who={who} size={120} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 84, color: "#fff" }}>{label}</div>
      <Sfx id="pop" at={0} volume={0.18} frames={20} />
    </div>
  );
};
export const S8: React.FC = () => (
  <Thread>
    <ChatHeader who={HANDY} title="Handy v0.10.0" sub="bản mới nhất" />
    <div style={{ fontFamily: sans, fontSize: 36, color: C.dim, margin: "26px 0 26px 8px" }}>Hỗ trợ đầy đủ</div>
    {PLATFORMS.map((p) => (
      <Join key={p.label} {...p} />
    ))}
    <Feed>
      <Msg at={s(4.8)} who={HANDY} typing={s(0.5)}>
        <span style={{ fontFamily: mono, fontWeight: 700, color: C.pink, fontSize: 64 }}>v0.10.0</span>
        <div>Mới: phiên âm file</div>
      </Msg>
      <Msg at={s(6.6)} out typing={s(0.4)} bare maxW={640}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "26px 34px" }}>
          <svg width="76" height="76" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill={C.ink} /><path d="M9.5 7.5l7 4.5-7 4.5z" fill={C.pink} /></svg>
          <Wave n={16} h={70} color={C.ink} seed={2} />
        </div>
      </Msg>
      <Msg at={s(8.2)} who={HANDY} typing={s(0.5)}>Phiên âm file âm thanh <Em>trực tiếp</Em></Msg>
    </Feed>
  </Thread>
);

// 9 ── install
const CMDS = ["brew install --cask handy", "winget install cjpais.Handy"];
export const S9: React.FC = () => (
  <Thread>
    <ChatHeader who={HANDY} title="Cài đặt" sub="lệnh chính thức" />
    <Feed>
      <Msg at={s(0.3)} who={HANDY} typing={s(0.4)}>Cài nhanh qua package manager</Msg>
      <Msg at={s(1.4)} out typing={s(0.4)} bare maxW={CONTENT_W}>
        <Terminal cmds={CMDS} width={CONTENT_W - 40} fontSize={36} minHeight={170} />
        <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(CMDS)} volume={0.3} />
      </Msg>
      <Msg at={s(4.6)} who={HANDY} typing={s(0.5)}>macOS dùng <Em>brew</Em></Msg>
      <Msg at={s(5.6)} who={HANDY} typing={s(0.4)} hideAvatar>Windows chỉ một dòng <Em>winget</Em></Msg>
    </Feed>
  </Thread>
);

// 10 ── sign-off
const Bookmark: React.FC = () => (
  <svg width="54" height="54" viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4.5L6 21z" fill={C.ink} /></svg>
);
export const S10: React.FC = () => (
  <Thread>
    <ChatHeader who={HANDY} title="Anh em dev" sub="nhóm chat" />
    <Feed>
      <Msg at={s(0.3)} typing={s(0.3)} who={HANDY} bare maxW={760}>
        <Video file="developer-working-late-setup-pixabay-154384.mp4" w={700} h={560} />
      </Msg>
      <Msg at={s(1.9)} who={HANDY} typing={s(0.6)}>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <svg width="54" height="54" viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4.5L6 21z" fill={C.pink} /></svg>
          Lưu video để dùng khi cần
        </div>
      </Msg>
      <Msg at={s(3.8)} out typing={s(0.6)}>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <Bookmark />
          Lưu rồi nhé!
        </div>
      </Msg>
      <Msg at={s(5.0)} who={HANDY} typing={s(0.5)}>Follow để đón xem <Em>mẹo mới</Em></Msg>
    </Feed>
  </Thread>
);

export const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
export { ASKER };
