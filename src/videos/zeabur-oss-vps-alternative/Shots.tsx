import { siDocker, siHelm, siKubernetes, siLinux, siRust, siTraefikproxy } from "simple-icons";
import { AbsoluteFill, Sequence } from "remotion";
import { FPS, Voice } from "../../kit";
import { Command, DiagramLabel, Headline, Lines, Question } from "./Copy";
import { CameraRig, C, FloatingStage, KubeTile, Platform, SymbolTile, Tile, Tube } from "./Stage";
import durations from "./durations.json";

const Z = "repos/zeabur-oss.png";
const COOL = "repos/coollabsio.png";
const S = Object.fromEntries(Object.entries(durations).map(([id, d]) => [id, Math.round(d * FPS) + 54]));
export const LEN = {
  hook: S.s1 + S.s2 + S.s3,
  build: S.s4 + S.s5 + S.s6,
  drop: S.s7 + S.s8 + S.s9,
  outro: S.s10,
};
export const START = {
  s2: S.s1,
  s3: S.s1 + S.s2,
  s5: S.s4,
  s6: S.s4 + S.s5,
  s8: S.s7,
  s9: S.s7 + S.s8,
};

const Voices: React.FC<{ ids: string[] }> = ({ ids }) => {
  let at = 0;
  return ids.map((id) => {
    const from = at;
    at += S[id];
    return (
      <Sequence key={id} from={from} durationInFrames={S[id]} name={`voice: ${id}`}>
        <Voice slug="zeabur-oss-vps-alternative" id={id} />
      </Sequence>
    );
  });
};

export const HookShot: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <FloatingStage>
      <CameraRig
        keys={[
          { at: 0, pos: [6.7, 6.2, 14], look: [-0.5, 0.15, 0] },
          { at: 230, pos: [5.8, 5.8, 13.3], look: [-0.1, 0, 0] },
          { at: START.s2 + 20, pos: [6.7, 7.3, 14.7], look: [0, -0.6, 0] },
          { at: START.s2 + 330, pos: [5.9, 6.8, 14], look: [0, -0.5, 0] },
          { at: START.s3 + 35, pos: [5.4, 5.2, 12.7], look: [-0.25, 0.45, 0] },
          { at: LEN.hook, pos: [5.1, 5.1, 12.4], look: [-0.2, 0.5, 0] },
        ]}
      />
      <Platform />
      <Sequence layout="none" durationInFrames={S.s1}>
        <Tube from={[-1.55, 0.8, 0]} to={[1.2, 0.05, 0]} at={28} />
        <Tile position={[-1.55, 0.8, 0]} avatar={Z} at={0} size={1.85} tilt={-0.08} />
        <KubeTile position={[1.25, 0, 0]} icon={siKubernetes} at={22} />
      </Sequence>
      <Sequence layout="none" from={START.s2} durationInFrames={S.s2}>
        <Tube from={[-0.8, -0.3, 0.4]} to={[1.1, -0.3, 0.4]} at={95} color={C.cool} lift={0.45} />
        <Tile position={[1.15, -0.3, 0.4]} avatar={COOL} at={18} color={C.cool} size={1.65} />
        <SymbolTile kind="database" position={[-0.85, -0.3, 0.4]} at={78} size={1.55} />
      </Sequence>
      <Sequence layout="none" from={START.s3} durationInFrames={S.s3}>
        <Tube from={[-1.55, 0.8, 0]} to={[1.2, 0.05, 0]} at={55} />
        <Tile position={[-1.55, 0.8, 0]} avatar={Z} at={0} size={1.85} tilt={-0.08} />
        <KubeTile position={[1.25, 0, 0]} icon={siKubernetes} at={48} />
        <Tile position={[-1.55, 2.7, 0.2]} icon={siRust} color={C.orange} at={38} size={1.2} />
        <Tube from={[-1.55, 2.1, 0.2]} to={[-1.55, 1.4, 0]} at={52} color={C.orange} lift={0.2} />
      </Sequence>
    </FloatingStage>
    <Sequence durationInFrames={S.s1}>
      <Headline id="s1" top={354} size={80} />
      <Question />
    </Sequence>
    <Sequence from={START.s2} durationInFrames={S.s2}>
      <Headline id="s2" top={340} size={74} />
      <DiagramLabel text="Coolify" sub="Viết bằng PHP" x={550} y={600} at={25} color={C.cool} width={300} />
      <DiagramLabel text="Database riêng" sub="Lưu trạng thái" x={100} y={1080} at={82} color={C.cool} />
      <Lines id="s2" at={110} top={1250} gap={92} indices={[1]} />
    </Sequence>
    <Sequence from={START.s3} durationInFrames={S.s3}>
      <Headline id="s3" top={340} size={78} />
      <DiagramLabel text="Zeabur OSS" sub="Rust · Stateless" x={100} y={570} at={18} />
      <DiagramLabel text="Kubernetes gốc" sub="Không custom resource" x={490} y={1130} at={86} color={C.blue} width={360} />
      <Lines id="s3" at={118} top={1240} gap={88} indices={[1, 2]} size={42} />
    </Sequence>
  </AbsoluteFill>
);

export const BuildShot: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <FloatingStage>
      <CameraRig
        keys={[
          { at: 0, pos: [7.2, 7.7, 15], look: [0, -0.2, 0] },
          { at: 120, pos: [5.2, 6.1, 12.8], look: [0.2, -0.45, 0] },
          { at: 390, pos: [4.8, 5.8, 12.4], look: [0.35, -0.55, 0] },
          { at: START.s5 + 30, pos: [6.8, 6.8, 14.4], look: [0, -0.25, 0] },
          { at: START.s5 + 300, pos: [6.4, 6.5, 14], look: [0, -0.2, 0] },
          { at: START.s6 + 30, pos: [5.6, 5.4, 12.2], look: [0, 0, 0] },
          { at: LEN.build, pos: [5.2, 5.2, 11.8], look: [0, 0.1, 0] },
        ]}
      />
      <Platform size={[6.5, 4.8]} />
      <Sequence layout="none" durationInFrames={S.s4}>
        <Tube from={[-1.6, 1.55, 0]} to={[0, 0.15, 0]} at={0} exitAt={92} />
        <Tile position={[-1.6, 1.55, 0]} avatar={Z} at={0} exitAt={92} />
        <KubeTile position={[0, 0.05, 0]} icon={siKubernetes} at={0} />
        <Tube from={[0, -0.4, 0]} to={[-1.5, -1.6, 0.1]} at={105} color={C.blue} />
        <Tube from={[0.35, -0.35, 0]} to={[1.55, -1.55, 0.2]} at={125} color={C.blue} />
        <SymbolTile kind="app" position={[-1.5, -1.65, 0.1]} at={115} size={1.3} color={C.mint} />
        <Tile position={[1.55, -1.65, 0.2]} icon={siTraefikproxy} at={135} color={C.mint} size={1.3} />
        <Tile position={[0.2, -2.45, 0.65]} icon={siHelm} at={155} color={C.mint} size={1.05} />
      </Sequence>
      <Sequence layout="none" from={START.s5} durationInFrames={S.s5}>
        <Tile position={[1.7, 0.3, 0.3]} avatar={COOL} at={18} color={C.cool} size={1.65} />
        <Tile position={[-1.65, 0.3, 0.3]} icon={siLinux} at={55} color={C.cool} size={1.55} />
        <Tube from={[-1.1, 0.3, 0.3]} to={[1.15, 0.3, 0.3]} at={70} color={C.cool} />
      </Sequence>
      <Sequence layout="none" from={START.s6} durationInFrames={S.s6}>
        <KubeTile position={[0, 0.55, 0.1]} icon={siKubernetes} at={15} size={2.45} />
        <Tile position={[-1.85, -1.2, 0.3]} icon={siHelm} at={95} size={1.25} />
        <Tile position={[1.85, -1.2, 0.3]} icon={siTraefikproxy} at={145} size={1.25} />
      </Sequence>
    </FloatingStage>
    <Sequence durationInFrames={S.s4}>
      <Headline id="s4" top={340} size={76} />
      <DiagramLabel text="Zeabur" sub="Giao diện được gỡ" x={100} y={600} at={18} exitAt={92} />
      <DiagramLabel text="App vẫn chạy" x={100} y={1130} at={125} color={C.mint} />
      <DiagramLabel text="Ingress + TLS" sub="Giữ nguyên" x={490} y={1130} at={168} color={C.mint} width={360} />
      <Lines id="s4" at={190} top={1270} gap={90} indices={[1, 2]} size={42} />
    </Sequence>
    <Sequence from={START.s5} durationInFrames={S.s5}>
      <Headline id="s5" top={340} size={70} />
      <DiagramLabel text="VPS Linux trắng" x={100} y={600} at={60} color={C.cool} width={360} />
      <DiagramLabel text="Coolify" sub="Cài trọn gói" x={550} y={600} at={20} color={C.cool} width={280} />
      <Lines id="s5" at={75} top={1000} gap={86} indices={[0]} size={42} />
      <Command id="s5" at={22} top={1160} fontSize={36} minHeight={250} />
    </Sequence>
    <Sequence from={START.s6} durationInFrames={S.s6}>
      <Headline id="s6" top={340} size={70} />
      <DiagramLabel text="Kubernetes 1.30+" sub="Cụm phải có sẵn" x={100} y={580} at={18} color={C.blue} width={610} />
      <DiagramLabel text="Helm 4" x={100} y={1080} at={105} color={C.blue} width={260} />
      <DiagramLabel text="Ingress Traefik" x={510} y={1080} at={155} color={C.blue} width={340} />
      <Lines id="s6" at={30} top={1270} gap={86} indices={[0]} size={40} />
    </Sequence>
  </AbsoluteFill>
);

export const DropShot: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <FloatingStage>
      <CameraRig
        keys={[
          { at: 0, pos: [6.2, 5.9, 12.8], look: [0, 0, 0] },
          { at: 70, pos: [5.3, 5.2, 11.6], look: [0, 0.05, 0] },
          { at: 360, pos: [5.1, 5, 11.4], look: [0, 0.05, 0] },
          { at: START.s8 + 20, pos: [6.7, 6.1, 13.8], look: [0, -0.1, 0] },
          { at: START.s8 + 340, pos: [6.3, 5.8, 13.4], look: [0, -0.1, 0] },
          { at: START.s9 + 20, pos: [6.2, 6.6, 13.5], look: [0, -0.3, 0] },
          { at: LEN.drop, pos: [5.6, 6.1, 12.8], look: [0, -0.2, 0] },
        ]}
      />
      <Platform />
      <Sequence layout="none" durationInFrames={S.s7}>
        <Tile position={[-1.8, -0.6, 0.4]} icon={siLinux} at={0} size={1.55} />
        <Tile position={[0, 0.85, 0]} avatar={Z} at={8} color={C.orange} size={1.8} />
        <KubeTile position={[1.85, -0.5, 0.2]} icon={siKubernetes} at={24} size={1.7} />
        <Tube from={[-1.2, -0.4, 0.3]} to={[-0.35, 0.65, 0]} at={12} color={C.orange} />
        <Tube from={[0.55, 0.6, 0]} to={[1.35, -0.25, 0.2]} at={26} color={C.orange} />
      </Sequence>
      <Sequence layout="none" from={START.s8} durationInFrames={S.s8}>
        <Tile position={[-1.75, 0.3, 0]} avatar={Z} at={20} size={1.65} />
        <KubeTile position={[1.55, 0.3, 0]} icon={siKubernetes} at={55} size={1.65} />
        <Tube from={[-1.2, 0.3, 0]} to={[1, 0.3, 0]} at={70} color={C.blue} />
      </Sequence>
      <Sequence layout="none" from={START.s9} durationInFrames={S.s9}>
        <Tile position={[-1.8, -0.45, 0.2]} icon={siRust} at={20} size={1.35} />
        <Tile position={[0, 0.55, 0]} icon={siDocker} at={60} size={1.5} color={C.orange} />
        <KubeTile position={[1.8, -0.45, 0]} icon={siKubernetes} at={90} size={1.65} />
        <Tube from={[-1.25, -0.3, 0.2]} to={[-0.35, 0.35, 0]} at={40} color={C.orange} />
        <Tube from={[0.45, 0.35, 0]} to={[1.25, -0.25, 0]} at={82} color={C.orange} />
      </Sequence>
    </FloatingStage>
    <Sequence durationInFrames={S.s7}>
      <Headline id="s7" top={340} size={70} />
      <DiagramLabel text="Linux server" x={100} y={1050} at={12} color={C.orange} width={280} />
      <DiagramLabel text="Zeatend" sub="Đang phát triển" x={390} y={545} at={20} color={C.orange} width={300} />
      <DiagramLabel text="K3s / RKE2" x={565} y={1050} at={45} color={C.blue} width={280} />
      <Command id="s7" at={72} top={1200} fontSize={42} minHeight={140} />
      <Lines id="s7" at={120} top={1390} gap={70} indices={[1]} size={38} />
    </Sequence>
    <Sequence from={START.s8} durationInFrames={S.s8}>
      <Headline id="s8" top={340} size={76} />
      <DiagramLabel text="kubeconfig" sub="Chỉ cần file này" x={100} y={580} at={25} />
      <DiagramLabel text="127.0.0.1" sub="Dashboard cục bộ" x={515} y={580} at={90} color={C.blue} width={330} />
      <Lines id="s8" at={135} top={1110} gap={76} indices={[2]} size={40} />
      <Command id="s8" at={40} top={1250} fontSize={44} minHeight={135} />
    </Sequence>
    <Sequence from={START.s9} durationInFrames={S.s9}>
      <Headline id="s9" top={340} size={76} />
      <DiagramLabel text="Mã nguồn" x={100} y={1050} at={25} />
      <DiagramLabel text="railpack / Dockerfile" x={355} y={570} at={65} color={C.orange} width={480} />
      <DiagramLabel text="Cụm Kubernetes" x={535} y={1050} at={100} color={C.blue} width={320} />
      <Lines id="s9" at={125} top={1130} gap={72} indices={[1]} size={40} />
      <Command id="s9" at={45} top={1230} fontSize={34} minHeight={190} />
    </Sequence>
  </AbsoluteFill>
);

export const OutroShot: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <FloatingStage>
      <CameraRig
        keys={[
          { at: 0, pos: [6.6, 6.2, 14.2], look: [0, 0.15, 0] },
          { at: 170, pos: [5.4, 5.3, 12.5], look: [0, 0.25, 0] },
          { at: LEN.outro, pos: [5.1, 5.1, 12.2], look: [0, 0.25, 0] },
        ]}
      />
      <Platform />
      <Tile position={[0, 1.1, 0]} avatar={Z} size={2.1} at={0} />
      <KubeTile position={[-1.7, -0.9, 0.2]} icon={siKubernetes} at={20} size={1.5} />
      <Tile position={[1.7, -0.9, 0.2]} icon={siTraefikproxy} at={34} size={1.35} color={C.mint} />
      <Tile position={[0, -1.8, 0.5]} icon={siRust} at={46} size={1.15} color={C.orange} />
      <Tube from={[0, 0.5, 0]} to={[-1.25, -0.6, 0.2]} at={28} />
      <Tube from={[0.4, 0.5, 0]} to={[1.2, -0.6, 0.2]} at={38} color={C.mint} />
      <Tube from={[0, 0.5, 0]} to={[0, -1.35, 0.5]} at={50} color={C.orange} />
    </FloatingStage>
    <Headline id="s10" top={360} size={82} align="center" />
    <DiagramLabel text="Zeabur OSS" sub="PaaS tự host · Không database riêng" x={160} y={570} at={40} width={620} />
    <Lines id="s10" at={90} top={1240} gap={100} size={44} />
  </AbsoluteFill>
);

export const ShotVoice: React.FC<{ ids: string[] }> = ({ ids }) => <Voices ids={ids} />;
