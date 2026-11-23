import type { ReactNode } from "react";
import { Sequence } from "remotion";
import {
  DarkStage,
  EndSlate,
  Footage,
  LowerThird,
  NumberCard,
  RepoCard,
  TerminalStage,
  TitleCard,
} from "./parts";

const Shot: React.FC<{ from: number; dur: number; children: ReactNode }> = ({
  from,
  dur,
  children,
}) => (
  <Sequence from={from} durationInFrames={dur} layout="none" name={`shot ${from}`}>
    {children}
  </Sequence>
);

const CODE = "footage/programming-code-on-screen-pixabay-14214.mp4";
const HANDS = "footage/hands-typing-on-laptop-keyboard-pixabay-43559.mp4";
const CIRCUIT = "footage/computer-server-hardware-pixabay-13461.mp4";
const NIGHT_DEV = "footage/developer-working-late-at-night-pixabay-215751.mp4";
const DESK_DEV = "footage/man-working-on-computer-at-night-pixabay-42305.mp4";
const LAPTOP = "footage/laptop-on-desk-in-dark-room-pixabay-1028.mp4";
const TUNNEL = "footage/server-room-pixabay-345428.mp4";
const PHONE = "footage/person-using-smartphone-at-night-pixabay-38084.mp4";
const CITY = "footage/night-city-skyline-pixabay-204326.mp4";

const CURL =
  "curl -fsSL https://raw.githubusercontent.com/KKKKhazix/agent-autoloop/main/install.sh | sh";

// s1 — the late-night terminal habit. Title card, then three photographic
// beats of a man still at the desk.
export const S1: React.FC = () => (
  <>
    <Shot from={0} dur={68}>
      <TitleCard />
    </Shot>
    <Shot from={68} dur={90}>
      <Footage file={NIGHT_DEV} from={0.6} pos="35% 46%" len={90}>
        <LowerThird text="Canh terminal cả đêm?" at={6} />
      </Footage>
    </Shot>
    <Shot from={158} dur={90}>
      <Footage file={DESK_DEV} from={2} pos="48% 50%" len={90}>
        <LowerThird text="Treo tmux thủ công" at={6} />
      </Footage>
    </Shot>
    <Shot from={248} dur={54}>
      <Footage file={HANDS} from={4} pos="52% 50%" len={54}>
        <LowerThird text="Dễ đứt phiên giữa chừng" at={4} />
      </Footage>
    </Shot>
  </>
);

// s2 — closing the terminal used to stop the work; now the agent is a worker.
export const S2: React.FC = () => (
  <>
    <Shot from={0} dur={90}>
      <NumberCard value="24/7" label="agent chạy ngầm" size={300} foot="GitHub" />
    </Shot>
    <Shot from={90} dur={90}>
      <Footage file={LAPTOP} from={1.5} pos="68% 45%" len={90}>
        <LowerThird text="Đóng terminal là việc đứt gánh" at={4} size={58} />
      </Footage>
    </Shot>
    <Shot from={180} dur={88}>
      <Footage file={HANDS} from={9} pos="46% 52%" len={88}>
        <LowerThird text="Tự động hóa CLI Agent" at={4} />
      </Footage>
    </Shot>
    <Shot from={268} dur={88}>
      <Footage file={CODE} from={6} pos="28% 28%" len={88}>
        <LowerThird text="Worker chạy ngầm độc lập" at={4} size={58} />
      </Footage>
    </Shot>
    <Shot from={356} dur={90}>
      <Footage file={DESK_DEV} from={6} pos="46% 45%" len={90}>
        <LowerThird text="Không cần túc trực terminal" at={4} size={58} sub="Claude Code · Codex" />
      </Footage>
    </Shot>
  </>
);

// s3 — the zero-dependency core: hardware, no outbound calls, rules.
export const S3: React.FC = () => (
  <>
    <Shot from={0} dur={90}>
      <NumberCard value="0" label="runtime dependency" size={620} />
    </Shot>
    <Shot from={90} dur={90}>
      <Footage file={CIRCUIT} from={1} pos="50% 50%" len={90}>
        <LowerThird text="Không phụ thuộc thư viện ngoài" at={4} size={56} />
      </Footage>
    </Shot>
    <Shot from={180} dur={88}>
      <Footage file={TUNNEL} from={1} pos="50% 46%" len={88}>
        <LowerThird text="Không gửi request ra ngoài" at={4} size={58} />
      </Footage>
    </Shot>
    <Shot from={268} dur={90}>
      <Footage file={CODE} from={22} pos="30% 30%" len={90}>
        <LowerThird text="Chỉ nhận việc theo luật" at={4} size={58} sub="rules.json" />
      </Footage>
    </Shot>
    <Shot from={358} dur={90}>
      <Footage file={HANDS} from={13} pos="55% 48%" len={90}>
        <LowerThird text="Zero runtime dependency" at={4} size={58} />
      </Footage>
    </Shot>
    <Shot from={448} dur={40}>
      <Footage file={CIRCUIT} from={5} pos="42% 55%" len={40} />
    </Shot>
  </>
);

// s4 — waiting for approval: the process is gone, then the drop lands on 0%.
export const S4: React.FC = () => (
  <>
    <Shot from={0} dur={90}>
      <Footage file={CODE} from={3} pos="27% 32%" len={90}>
        <LowerThird text="Gặp chỗ cần anh em duyệt" at={4} size={58} />
      </Footage>
    </Shot>
    <Shot from={90} dur={90}>
      <Footage file={HANDS} from={6} pos="44% 50%" len={90}>
        <LowerThird text="Tiến trình tự ngắt khi chờ duyệt" at={4} size={56} />
      </Footage>
    </Shot>
    <Shot from={180} dur={90}>
      <Footage file={CIRCUIT} from={4} pos="46% 46%" len={90}>
        <LowerThird text="Nghỉ chờ duyệt: 0% CPU" at={4} size={58} />
      </Footage>
    </Shot>
    <Shot from={270} dur={90}>
      <Footage file={LAPTOP} from={4} pos="70% 42%" len={90}>
        <LowerThird text="Không hao phí token khi treo" at={4} size={56} />
      </Footage>
    </Shot>
    <Shot from={360} dur={37}>
      <Footage file={CODE} from={30} pos="24% 26%" len={37} />
    </Shot>
    <Shot from={397} dur={49}>
      <NumberCard value="0%" label="CPU · token khi chờ duyệt" size={540} />
    </Shot>
  </>
);

// s5 — the reveal: a card on the phone, a tap, the old session resumes.
// The turning point, so the cuts run at two beats.
export const S5: React.FC<{ start: number }> = ({ start }) => (
  <>
    <Shot from={0} dur={66}>
      <Footage file={PHONE} from={0.3} pos="50% 42%" len={66} pumpBase={start}>
        <LowerThird text="Đẩy thông báo sang" at={3} size={58} />
      </Footage>
    </Shot>
    <Shot from={66} dur={66}>
      <Footage file={PHONE} from={2.6} pos="56% 38%" len={66} pumpBase={start + 66}>
        <LowerThird text="Discord · Slack · Feishu" at={3} size={54} />
      </Footage>
    </Shot>
    <Shot from={132} dur={66}>
      <Footage file={PHONE} from={4.4} pos="46% 56%" len={66} pumpBase={start + 132}>
        <LowerThird text="Anh em bấm chọn" at={3} size={58} />
      </Footage>
    </Shot>
    <Shot from={198} dur={66}>
      <Footage file={CODE} from={12} pos="32% 32%" len={66} pumpBase={start + 198}>
        <LowerThird text="Tự nạp lại session cũ" at={3} size={56} />
      </Footage>
    </Shot>
    <Shot from={264} dur={66}>
      <Footage file={HANDS} from={11} pos="50% 50%" len={66} pumpBase={start + 264}>
        <LowerThird text="Làm nốt phần còn lại" at={3} size={56} />
      </Footage>
    </Shot>
    <Shot from={330} dur={68}>
      <Footage file={LAPTOP} from={2.6} pos="70% 44%" len={68} pumpBase={start + 330}>
        <LowerThird text="Human-in-the-Loop liền mạch" at={3} size={56} />
      </Footage>
    </Shot>
    <Shot from={398} dur={90}>
      <Footage file={CODE} from={18} pos="24% 38%" len={90} pumpBase={start + 398}>
        <LowerThird text="Tự nối lại context cũ" at={4} size={58} />
      </Footage>
    </Shot>
  </>
);

// s6 — a bad JSON reply retries only that reply, and the loop breaker.
export const S6: React.FC = () => (
  <>
    <Shot from={0} dur={90}>
      <Footage file={CODE} from={34} pos="26% 28%" len={90}>
        <LowerThird text="Agent trả về JSON lỗi" at={4} size={58} />
      </Footage>
    </Shot>
    <Shot from={90} dur={90}>
      <Footage file={CODE} from={2} pos="38% 34%" len={90}>
        <LowerThird text="Chỉ viết lại câu trả lời" at={4} size={58} />
      </Footage>
    </Shot>
    <Shot from={180} dur={90}>
      <Footage file={HANDS} from={14} pos="54% 52%" len={90}>
        <LowerThird text="Không chạy lại toàn bộ tác vụ" at={4} size={54} />
      </Footage>
    </Shot>
    <Shot from={270} dur={90}>
      <Footage file={CIRCUIT} from={6} pos="52% 44%" len={90}>
        <LowerThird text="Ngắt mạch chống lặp" at={4} size={58} />
      </Footage>
    </Shot>
    <Shot from={360} dur={96}>
      <NumberCard value="8" label="tầng ngắt mạch tối đa" size={620} />
    </Shot>
    <Shot from={456} dur={90}>
      <Footage file={CODE} from={16} pos="35% 30%" len={90}>
        <LowerThird text="Ngắt mạch tối đa 8 tầng" at={4} size={56} />
      </Footage>
    </Shot>
  </>
);

// s7 — one command, typed out exactly, held readable.
export const S7: React.FC = () => (
  <>
    <Shot from={0} dur={80}>
      <NumberCard value="1" label="dòng lệnh cURL" size={600} />
    </Shot>
    <Shot from={80} dur={90}>
      <Footage file={HANDS} from={5} pos="48% 50%" len={90}>
        <LowerThird text="Node 24+ và Git" at={4} size={58} />
      </Footage>
    </Shot>
    <Shot from={170} dur={90}>
      <DarkStage />
    </Shot>
    <Shot from={260} dur={90}>
      <Footage file={CODE} from={8} pos="30% 30%" len={90} dim={0.6} />
    </Shot>
    <Shot from={350} dur={70}>
      <DarkStage />
    </Shot>
    <Sequence from={170} durationInFrames={250} layout="none" name="terminal install">
      <TerminalStage cmds={[CURL]} />
    </Sequence>
    <Shot from={350} dur={70}>
      <LowerThird text="Cài đặt một dòng lệnh" at={4} size={58} />
    </Shot>
  </>
);

// s8 — try, answer, status. The terminal keeps typing while the plate changes.
export const S8: React.FC = () => (
  <>
    <Shot from={0} dur={90}>
      <Footage file={HANDS} from={2} pos="50% 48%" len={90}>
        <LowerThird text="Cài xong, thử ngay" at={4} size={58} />
      </Footage>
    </Shot>
    <Shot from={90} dur={90}>
      <DarkStage />
    </Shot>
    <Shot from={180} dur={90}>
      <Footage file={CODE} from={20} pos="30% 32%" len={90} dim={0.6} />
    </Shot>
    <Shot from={270} dur={90}>
      <Footage file={LAPTOP} from={5} pos="66% 42%" len={90} dim={0.55}>
        <LowerThird text="Answer và status" at={4} size={56} sub="Kiểm tra tiến độ tức thì" />
      </Footage>
    </Shot>
    <Shot from={360} dur={47}>
      <Footage file={HANDS} from={9} pos="42% 54%" len={47}>
        <LowerThird text="Test thử luồng hoạt động" at={2} size={54} />
      </Footage>
    </Shot>
    <Sequence from={90} durationInFrames={270} layout="none" name="terminal try">
      <TerminalStage cmds={["agent-autoloop try", "agent-autoloop answer 1 2", "agent-autoloop status"]} />
    </Sequence>
  </>
);

// s9 — save it, set it up on the VPS, and the case file.
export const S9: React.FC = () => (
  <>
    <Shot from={0} dur={90}>
      <Footage file={CITY} from={1} pos="50% 46%" len={90}>
        <LowerThird text="Lưu video để setup" at={4} size={58} />
      </Footage>
    </Shot>
    <Shot from={90} dur={90}>
      <Footage file={DESK_DEV} from={4} pos="47% 48%" len={90}>
        <LowerThird text="Setup cho VPS ngay" at={4} size={58} />
      </Footage>
    </Shot>
    <Shot from={180} dur={90}>
      <RepoCard />
    </Shot>
    <Shot from={270} dur={90}>
      <Footage file={HANDS} from={3} pos="52% 50%" len={90}>
        <LowerThird text="Follow để đón tip mới" at={4} size={58} />
      </Footage>
    </Shot>
    <Shot from={360} dur={123}>
      <EndSlate len={123} />
    </Shot>
  </>
);
