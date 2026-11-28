import { AbsoluteFill, Sequence } from "remotion";
import { Terminal } from "./Terminal";
import { Big503, FailureField, World } from "./components";
import { CONTENT_W, GREEN, SAFE } from "./theme";

const FOOTAGE = (name: string) => `footage/${name}`;
const IMAGES = (name: string) => `images/${name}`;

const SERVER_RACK = FOOTAGE("server-rack-datacenter-blinking-lights-pixabay-14900.mp4");
const NETWORK_CABLES = FOOTAGE("network-server-cables-data-center-pixabay-14906.mp4");
const CODE_SCREEN = FOOTAGE("programming-code-on-computer-screen-pixabay-14214.mp4");
const PHONE_BOX = FOOTAGE("call-center-headset-agent-pixabay-174262.mp4");
const CIRCUIT_VIDEO = FOOTAGE("circuit-board-macro-technology-pixabay-47215.mp4");
const FIBER = FOOTAGE("fiber-optic-light-cables-pixabay-278840.mp4");
const AI_SCREENS = FOOTAGE("modern-cloud-infrastructure-data-server-pixabay-171185.mp4");
const PULSE = FOOTAGE("developer-looking-frustrated-at-multiple-pixabay-1210.mp4");
const HAND_PHONE = FOOTAGE("telephone-poles-wires-sky-pixabay-38084.mp4");
const LAPTOP = FOOTAGE("laptop-terminal-code-night-pixabay-1625.mp4");
const CIRCUIT_PHOTO = IMAGES("macro-circuit-board-electronics-pixabay-564811.jpg");

const COMMANDS = [
  "git clone https://github.com/eisenzopf/rvoip.git && cd rvoip",
  "cargo run -p rvoip-sip --example endpoint_local_call",
];

// s1 — 0..316. Hook: one VM, the number climbs to 8,000.
export const Scene1: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={231}>
      <World
        kind="video"
        src={SERVER_RACK}
        shotLen={231}
        mood="cold"
        shake={3}
        rate={0.9}
        position="50% 44%"
        zoomFrom={1.14}
        zoomTo={1.25}
        panX={-12}
        panY={6}
      />
    </Sequence>
    <Sequence from={231} durationInFrames={85}>
      <World
        kind="video"
        src={NETWORK_CABLES}
        shotLen={85}
        mood="cold"
        shake={3.6}
        rate={0.9}
        position="50% 55%"
        zoomFrom={1.14}
        zoomTo={1.22}
        panX={14}
        panY={-5}
      />
    </Sequence>
  </AbsoluteFill>
);

// s2 — 316..843. The old stack: C and config files, then the 150-call limit.
export const Scene2: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={308}>
      <World
        kind="video"
        src={CODE_SCREEN}
        shotLen={308}
        mood="green"
        shake={2}
        dim={0.22}
        trimBefore={120}
        rate={0.86}
        position="50% 50%"
        zoomFrom={1.11}
        zoomTo={1.21}
        panX={9}
      />
    </Sequence>
    <Sequence from={308} durationInFrames={219}>
      <World
        kind="video"
        src={PHONE_BOX}
        shotLen={219}
        mood="warm"
        shake={2.2}
        trimBefore={60}
        rate={0.9}
        position="50% 42%"
        zoomFrom={1.08}
        zoomTo={1.2}
        panY={-6}
      />
    </Sequence>
  </AbsoluteFill>
);

// s3 — 843..1212. A library inside the app, no server beside it.
export const Scene3: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={166}>
      <World
        kind="video"
        src={CIRCUIT_VIDEO}
        shotLen={166}
        mood="green"
        shake={1.2}
        dim={0.16}
        trimBefore={240}
        rate={0.9}
        position="50% 50%"
        zoomFrom={1.1}
        zoomTo={1.19}
        panX={-8}
      />
    </Sequence>
    <Sequence from={166} durationInFrames={203}>
      <World
        kind="video"
        src={FIBER}
        shotLen={203}
        mood="cold"
        shake={1.6}
        rate={0.9}
        position="50% 50%"
        zoomFrom={1.15}
        zoomTo={1.25}
        panX={10}
        panY={-4}
      />
    </Sequence>
  </AbsoluteFill>
);

// s4 — 1212..1719. The VM, then 8,348 CPS landing on the downbeat.
export const Scene4: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={190}>
      <World
        kind="video"
        src={AI_SCREENS}
        shotLen={190}
        mood="cold"
        shake={4}
        trimBefore={120}
        rate={0.9}
        cropTop
        zoomFrom={1.12}
        zoomTo={1.2}
        panY={-8}
      />
    </Sequence>
    <Sequence from={190} durationInFrames={317}>
      <World
        kind="video"
        src={SERVER_RACK}
        shotLen={317}
        mood="cold"
        shake={5}
        trimBefore={480}
        rate={0.9}
        position="50% 48%"
        zoomFrom={1.12}
        zoomTo={1.25}
        panX={-12}
        panY={4}
        impulseAt={0}
        impulsePower={10}
      />
    </Sequence>
  </AbsoluteFill>
);

// s5 — 1719..2188. Real calls, then the media path carrying ~12,000 at once.
export const Scene5: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={206}>
      <World
        kind="video"
        src={HAND_PHONE}
        shotLen={206}
        mood="warm"
        shake={3}
        dim={0.2}
        rate={0.9}
        position="50% 44%"
        zoomFrom={1.1}
        zoomTo={1.2}
        panX={-7}
      />
    </Sequence>
    <Sequence from={206} durationInFrames={263}>
      <World
        kind="video"
        src={NETWORK_CABLES}
        shotLen={263}
        mood="cold"
        shake={3.4}
        trimBefore={180}
        rate={0.9}
        position="50% 58%"
        zoomFrom={1.14}
        zoomTo={1.25}
        panX={12}
        impulseAt={0}
        impulsePower={6}
      />
    </Sequence>
  </AbsoluteFill>
);

// s6 — 2188..2720. Twice the load, fast 503s, clean recovery.
export const Scene6: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={130}>
      <World
        kind="video"
        src={SERVER_RACK}
        shotLen={130}
        mood="steel"
        shake={2}
        trimBefore={960}
        rate={0.9}
        position="50% 50%"
        zoomFrom={1.1}
        zoomTo={1.18}
      />
    </Sequence>
    <Sequence from={130} durationInFrames={131}>
      <World
        kind="video"
        src={PULSE}
        shotLen={131}
        mood="red"
        shake={7}
        trimBefore={240}
        rate={0.95}
        zoomFrom={1.12}
        zoomTo={1.23}
        panX={-6}
        impulseAt={0}
        impulsePower={14}
      />
    </Sequence>
    <Sequence from={261} durationInFrames={131}>
      <World
        kind="video"
        src={PULSE}
        shotLen={131}
        mood="red"
        shake={7.5}
        trimBefore={320}
        rate={0.95}
        zoomFrom={1.2}
        zoomTo={1.1}
        panX={8}
      />
    </Sequence>
    <Sequence from={392} durationInFrames={140}>
      <World
        kind="video"
        src={SERVER_RACK}
        shotLen={140}
        mood="warm"
        shake={2}
        trimBefore={1260}
        rate={0.9}
        position="50% 45%"
        zoomFrom={1.1}
        zoomTo={1.18}
        panX={-6}
      />
    </Sequence>
    <Sequence from={130} durationInFrames={262}>
      <FailureField len={262} />
    </Sequence>
    <Sequence from={261} durationInFrames={120}>
      <Big503 />
    </Sequence>
  </AbsoluteFill>
);

// s7 — 2720..3247. The drop: SIP, WebRTC and SRTP in one moving model.
export const Scene7: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={133}>
      <World
        kind="video"
        src={FIBER}
        shotLen={133}
        mood="violet"
        shake={4.5}
        trimBefore={360}
        rate={0.9}
        zoomFrom={1.15}
        zoomTo={1.26}
        panX={-10}
        impulseAt={0}
        impulsePower={9}
      />
    </Sequence>
    <Sequence from={133} durationInFrames={131}>
      <World
        kind="video"
        src={AI_SCREENS}
        shotLen={131}
        mood="violet"
        shake={4.5}
        trimBefore={540}
        rate={0.9}
        cropTop
        zoomFrom={1.1}
        zoomTo={1.2}
        panY={-6}
      />
    </Sequence>
    <Sequence from={264} durationInFrames={131}>
      <World
        kind="video"
        src={FIBER}
        shotLen={131}
        mood="cold"
        shake={4}
        trimBefore={420}
        rate={0.9}
        zoomFrom={1.16}
        zoomTo={1.26}
        panX={10}
      />
    </Sequence>
    <Sequence from={395} durationInFrames={132}>
      <World
        kind="video"
        src={AI_SCREENS}
        shotLen={132}
        mood="violet"
        shake={4}
        trimBefore={780}
        rate={0.9}
        cropTop
        zoomFrom={1.12}
        zoomTo={1.22}
        panY={-4}
      />
    </Sequence>
  </AbsoluteFill>
);

// s8 — 3247..3770. Four API surfaces; SIP beta, WebRTC and AI preview.
export const Scene8: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={261}>
      <World
        kind="photo"
        src={CIRCUIT_PHOTO}
        shotLen={261}
        mood="amber"
        shake={2}
        dim={0.18}
        zoomFrom={1.08}
        zoomTo={1.19}
        panX={10}
      />
    </Sequence>
    <Sequence from={261} durationInFrames={131}>
      <World
        kind="video"
        src={CODE_SCREEN}
        shotLen={131}
        mood="steel"
        shake={1.8}
        dim={0.22}
        trimBefore={720}
        rate={0.9}
        zoomFrom={1.1}
        zoomTo={1.19}
        panX={-8}
      />
    </Sequence>
    <Sequence from={392} durationInFrames={131}>
      <World
        kind="video"
        src={LAPTOP}
        shotLen={131}
        mood="amber"
        shake={1.6}
        dim={0.22}
        trimBefore={120}
        rate={0.9}
        position="50% 56%"
        zoomFrom={1.1}
        zoomTo={1.19}
        panX={6}
      />
    </Sequence>
  </AbsoluteFill>
);

// s9 — 3770..4256. The local call, typed exactly.
export const Scene9: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={486}>
      <World
        kind="video"
        src={CODE_SCREEN}
        shotLen={486}
        mood="green"
        shake={1}
        dim={0.24}
        trimBefore={1440}
        rate={0.9}
        zoomFrom={1.1}
        zoomTo={1.2}
        panX={-8}
      />
    </Sequence>
    <Sequence from={80} durationInFrames={406}>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 796,
          width: CONTENT_W,
          borderRadius: 30,
          overflow: "hidden",
          border: "1px solid rgba(123,227,176,0.32)",
          background: "rgba(3,8,10,0.7)",
          boxShadow: "0 34px 90px rgba(0,0,0,0.55)",
        }}
      >
        <Terminal
          cmds={COMMANDS}
          width={CONTENT_W}
          fontSize={35}
          minHeight={0}
          bg="rgba(3,8,10,0.88)"
          fg="#E9F7F0"
          accent={GREEN}
        />
      </div>
    </Sequence>
  </AbsoluteFill>
);

// s10 — 4256..4720. Back to the number, held warm.
export const Scene10: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={172}>
      <World
        kind="video"
        src={SERVER_RACK}
        shotLen={172}
        mood="warm"
        shake={3}
        trimBefore={180}
        rate={0.86}
        position="50% 46%"
        zoomFrom={1.18}
        zoomTo={1.09}
        panX={6}
      />
    </Sequence>
    <Sequence from={172} durationInFrames={131}>
      <World
        kind="video"
        src={FIBER}
        shotLen={131}
        mood="cold"
        shake={3.2}
        trimBefore={60}
        rate={0.86}
        zoomFrom={1.14}
        zoomTo={1.24}
        panX={-8}
      />
    </Sequence>
    <Sequence from={303} durationInFrames={161}>
      <World
        kind="video"
        src={FIBER}
        shotLen={161}
        mood="warm"
        shake={2.6}
        trimBefore={260}
        rate={0.86}
        zoomFrom={1.18}
        zoomTo={1.27}
        panX={8}
      />
    </Sequence>
  </AbsoluteFill>
);
