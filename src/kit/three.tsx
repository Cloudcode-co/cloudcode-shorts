// 3D building blocks on @remotion/three (React Three Fiber). A video that
// imports these renders with WebGL: on CI that is software rendering
// (--gl=swangle), several times slower than 2D, so use 3D where it earns it.
import { useLoader } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useVideoConfig } from "remotion";
import * as THREE from "three";

// A full-frame 3D stage: ThreeCanvas sized to the video, a perspective
// camera and soft light. Drive every movement from useCurrentFrame() inside
// it, never from R3F's useFrame or clocks: Remotion renders frames out of
// order and in parallel.
export const Stage3D: React.FC<{
  children: React.ReactNode;
  camera?: [number, number, number];
  fov?: number;
  background?: string;
  style?: React.CSSProperties;
}> = ({ children, camera = [0, 0, 8], fov = 40, background, style }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: camera, fov }}
      style={{ position: "absolute", inset: 0, ...style }}
    >
      {background ? <color attach="background" args={[background]} /> : null}
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 8]} intensity={1.6} />
      {children}
    </ThreeCanvas>
  );
};

// An image (a repo avatar, a logo from staticFile) as a texture. It suspends
// until loaded; ThreeCanvas holds the frame meanwhile.
export const useImageTexture = (src: string) => {
  const texture = useLoader(THREE.TextureLoader, src);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};
