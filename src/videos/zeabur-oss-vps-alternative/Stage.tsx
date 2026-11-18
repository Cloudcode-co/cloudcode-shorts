import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { Stage3D, useImageTexture } from "../../kit";
import type { BrandIcon } from "../../kit";
import { videoAsset } from "../../kit";

export const C = {
  bg: "#10101B",
  ink: "#181822",
  violet: "#8C52FF",
  purple: "#6C00FF",
  orange: "#FF4B0A",
  cool: "#A875FF",
  white: "#F8F9FF",
  muted: "#B9B8CB",
  mint: "#81E6C0",
  blue: "#72B7FF",
};

type V3 = [number, number, number];
type CamKey = { at: number; pos: V3; look: V3 };
const move = Easing.bezier(0.77, 0, 0.175, 1);

export const CameraRig: React.FC<{ keys: CamKey[] }> = ({ keys }) => {
  const f = useCurrentFrame();
  const { camera } = useThree();
  let i = 0;
  while (i < keys.length - 2 && f >= keys[i + 1].at) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const p = interpolate(f, [a.at, b.at], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: move,
  });
  camera.position.set(...a.pos.map((v, n) => v + (b.pos[n] - v) * p) as V3);
  camera.lookAt(...a.look.map((v, n) => v + (b.look[n] - v) * p) as V3);
  camera.setViewOffset(1080, 1920, 95, -105, 1080, 1920);
  camera.updateMatrixWorld();
  return null;
};

export const progress = (f: number, at: number, duration = 20) =>
  interpolate(f, [at, at + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.23, 1, 0.32, 1),
  });

const svgUrl = (icon: BrandIcon, color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24"><path d="${icon.path}" fill="${color}"/></svg>`,
  )}`;

export const Tile: React.FC<{
  position: V3;
  at?: number;
  avatar?: string;
  icon?: BrandIcon;
  color?: string;
  size?: number;
  exitAt?: number;
  tilt?: number;
}> = ({ position, at = 0, avatar, icon, color = C.violet, size = 1.6, exitAt, tilt = 0 }) => {
  const f = useCurrentFrame();
  const texture = useImageTexture(avatar ? videoAsset("zeabur-oss-vps-alternative", avatar) : svgUrl(icon!, C.ink));
  const p = progress(f, at, 22);
  const out = exitAt === undefined ? 0 : progress(f, exitAt, 26);
  const bob = Math.sin((f - at) / 60) * 0.045 * p;
  const opacity = p * (1 - out);
  return (
    <group
      position={[position[0], position[1] + (1 - p) * -0.32 + out * 1.2 + bob, position[2]]}
      rotation={[0, tilt + out * 0.35, 0]}
      scale={0.94 + p * 0.06 - out * 0.04}
    >
      <mesh>
        <boxGeometry args={[size, size, 0.32]} />
        <meshStandardMaterial color={C.white} roughness={0.88} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, -size / 2 + 0.075, 0.171]}>
        <boxGeometry args={[size * 0.72, 0.065, 0.025]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.06, 0.173]}>
        <planeGeometry args={[size * 0.82, size * 0.82]} />
        <meshBasicMaterial map={texture} transparent opacity={opacity} toneMapped={false} />
      </mesh>
    </group>
  );
};

export const SymbolTile: React.FC<{
  kind: "database" | "app";
  position: V3;
  at?: number;
  size?: number;
  color?: string;
  exitAt?: number;
}> = ({ kind, position, at = 0, size = 1.5, color = C.cool, exitAt }) => {
  const f = useCurrentFrame();
  const out = exitAt === undefined ? 0 : progress(f, exitAt, 26);
  const p = progress(f, at, 20) * (1 - out);
  return (
    <group position={[position[0], position[1] + out * 1.2, position[2]]} scale={0.94 + p * 0.06}>
      <mesh>
        <boxGeometry args={[size, size, 0.3]} />
        <meshStandardMaterial color={C.white} roughness={0.88} transparent opacity={p} />
      </mesh>
      {kind === "database" ? (
        <mesh position={[0, 0.02, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[size * 0.27, size * 0.27, size * 0.48, 24]} />
          <meshStandardMaterial color={color} roughness={0.75} transparent opacity={p} />
        </mesh>
      ) : (
        <>
          <mesh position={[0, 0.04, 0.24]}>
            <boxGeometry args={[size * 0.56, size * 0.56, size * 0.28]} />
            <meshStandardMaterial color={color} roughness={0.75} transparent opacity={p} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[-size * 0.15 + i * size * 0.15, -size * 0.34, 0.34]}>
              <boxGeometry args={[size * 0.06, size * 0.06, 0.06]} />
              <meshBasicMaterial color={C.ink} transparent opacity={p} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};

export const KubeTile: React.FC<{ position: V3; at?: number; size?: number; icon: BrandIcon }> = ({
  position,
  at = 0,
  size = 2.25,
  icon,
}) => <Tile position={position} at={at} size={size} icon={icon} color={C.blue} />;

export const Tube: React.FC<{
  from: V3;
  to: V3;
  at?: number;
  color?: string;
  lift?: number;
  opacity?: number;
  exitAt?: number;
}> = ({ from, to, at = 0, color = C.violet, lift = 0.65, opacity = 1, exitAt }) => {
  const f = useCurrentFrame();
  const curve = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const d = new THREE.Vector3(...to);
    const mid = a.clone().lerp(d, 0.5);
    mid.y += lift;
    return new THREE.CatmullRomCurve3([a, mid, d]);
  }, [from, to, lift]);
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 32, 0.055, 8, false), [curve]);
  const p = progress(f, at, 30);
  const count = geometry.index?.count ?? 0;
  geometry.setDrawRange(0, Math.floor((count * p) / 6) * 6);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.75} transparent opacity={opacity * (exitAt === undefined ? 1 : 1 - progress(f, exitAt, 20))} />
    </mesh>
  );
};

export const Platform: React.FC<{ at?: number; size?: [number, number] }> = ({
  at = 0,
  size = [5.9, 4.5],
}) => {
  const f = useCurrentFrame();
  const p = progress(f, at, 28);
  return (
    <group position={[0, -1.05 - (1 - p) * 0.4, 0.3]} scale={0.96 + p * 0.04}>
      <mesh>
        <boxGeometry args={[size[0], 0.16, size[1]]} />
        <meshStandardMaterial color="#24243A" roughness={0.95} transparent opacity={p} />
      </mesh>
      {[-1.6, 0, 1.6].map((x) => (
        <mesh key={x} position={[x, 0.09, 0]}>
          <boxGeometry args={[0.022, 0.012, size[1] * 0.9]} />
          <meshBasicMaterial color="#555275" transparent opacity={p * 0.6} />
        </mesh>
      ))}
      {[-1.25, 0, 1.25].map((z) => (
        <mesh key={z} position={[0, 0.09, z]}>
          <boxGeometry args={[size[0] * 0.9, 0.012, 0.022]} />
          <meshBasicMaterial color="#555275" transparent opacity={p * 0.6} />
        </mesh>
      ))}
    </group>
  );
};

export const FloatingStage: React.FC<{ children: React.ReactNode; camera?: V3 }> = ({
  children,
  camera = [7, 7, 12],
}) => (
  <Stage3D camera={camera} fov={42} background={C.bg}>
    <directionalLight position={[-5, 4, 6]} intensity={0.65} color="#B9C8FF" />
    {children}
  </Stage3D>
);
