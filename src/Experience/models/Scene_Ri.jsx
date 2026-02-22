// Ri's World — soft pink & lavender cozy room (Vietnamese home vibes)
// Scene centered at world (0, 0, 14), opens toward origin (camera side)
// Group rotation.y = Math.PI so local +Z faces camera

import * as THREE from "three";
import { Text } from "@react-three/drei";
import { AnimateMesh } from "../components/AnimateMesh";
import { useExperienceStore } from "../../store/useExperienceStore";

const PINK = "#FFB3C6";
const PINK_DARK = "#FF85A1";
const LAVENDER = "#D9BBFF";
const LAVENDER_DARK = "#C09EF0";
const CREAM = "#FFF0F5";
const GOLD = "#FFE066";

function Heart({ position, speed = 1, offset = 0 }) {
  return (
    <AnimateMesh
      position={position}
      animations={[
        { property: "position", axis: "y", speed, amplitude: 0.15, base: position[1], offset },
        { property: "rotation", axis: "z", speed: speed * 0.5, amplitude: 0.2, offset },
      ]}
    >
      <mesh>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color={PINK_DARK} />
      </mesh>
    </AnimateMesh>
  );
}

function Star({ position, speed = 1.2, offset = 0 }) {
  return (
    <AnimateMesh
      position={position}
      animations={[
        { property: "rotation", axis: "y", speed, amplitude: Math.PI, offset },
        { property: "position", axis: "y", speed: speed * 0.6, amplitude: 0.1, base: position[1], offset },
      ]}
    >
      <mesh>
        <octahedronGeometry args={[0.12]} />
        <meshBasicMaterial color={GOLD} />
      </mesh>
    </AnimateMesh>
  );
}

const Scene_Ri = () => {
  const openCatPanel = useExperienceStore((s) => s.openCatPanel);

  return (
    <group position={[0, 0, 14]} rotation={[0, Math.PI, 0]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial color={PINK} side={THREE.DoubleSide} />
      </mesh>

      {/* Floor pattern dots */}
      {[-3, 0, 3].map((x) =>
        [-3, 0, 3].map((z) => (
          <mesh key={`dot-${x}-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, z]}>
            <circleGeometry args={[0.2, 12]} />
            <meshBasicMaterial color={PINK_DARK} />
          </mesh>
        ))
      )}

      {/* Back wall */}
      <mesh position={[0, 4, -5.5]}>
        <planeGeometry args={[14, 9]} />
        <meshBasicMaterial color={LAVENDER} side={THREE.DoubleSide} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-7, 4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[11, 9]} />
        <meshBasicMaterial color={LAVENDER_DARK} side={THREE.DoubleSide} />
      </mesh>

      {/* Right wall */}
      <mesh position={[7, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[11, 9]} />
        <meshBasicMaterial color={LAVENDER_DARK} side={THREE.DoubleSide} />
      </mesh>

      {/* Window on back wall */}
      <mesh position={[0, 5.5, -5.4]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial color="#B8E4F9" />
      </mesh>
      <mesh position={[0, 5.5, -5.38]}>
        <planeGeometry args={[0.1, 2.5]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>
      <mesh position={[0, 5.5, -5.38]}>
        <planeGeometry args={[2.5, 0.1]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>

      {/* Shelf on back wall */}
      <mesh position={[2.5, 4.5, -5.2]}>
        <boxGeometry args={[2.5, 0.15, 0.3]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>

      {/* Cat bowl on shelf */}
      <mesh position={[2.5, 4.75, -5.2]}>
        <cylinderGeometry args={[0.25, 0.2, 0.2, 12]} />
        <meshBasicMaterial color="#FFD6E8" />
      </mesh>

      {/* Small plant on shelf */}
      <mesh position={[1.5, 4.75, -5.2]}>
        <cylinderGeometry args={[0.18, 0.22, 0.3, 8]} />
        <meshBasicMaterial color="#C8A87A" />
      </mesh>
      <mesh position={[1.5, 5.1, -5.2]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color="#7EC850" />
      </mesh>

      {/* Cute table */}
      <mesh position={[-2.5, 1.0, -2]}>
        <boxGeometry args={[2, 0.12, 1.2]} />
        <meshBasicMaterial color="#F5C8D8" />
      </mesh>
      {/* Table legs */}
      {[[-1.7, -1.8], [1.7, -1.8], [-1.7, -0.6], [1.7, -0.6]].map(([tx, tz], i) => (
        <mesh key={i} position={[-2.5 + tx * 0.3, 0.5, tz * 0.5]}>
          <cylinderGeometry args={[0.06, 0.06, 1, 6]} />
          <meshBasicMaterial color="#E8A0B8" />
        </mesh>
      ))}

      {/* Tea cup on table */}
      <mesh position={[-2.5, 1.2, -2]}>
        <cylinderGeometry args={[0.2, 0.16, 0.25, 12]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>
      <mesh position={[-2.5, 1.35, -2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.05, 12]} />
        <meshBasicMaterial color={PINK} />
      </mesh>

      {/* Clickable photo frame / album */}
      <mesh
        position={[3, 3.5, -5.3]}
        onClick={() => openCatPanel("ri")}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}
      >
        <boxGeometry args={[1.6, 1.8, 0.08]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>
      {/* Frame border */}
      <mesh position={[3, 3.5, -5.22]}>
        <planeGeometry args={[1.2, 1.4]} />
        <meshBasicMaterial color={PINK} />
      </mesh>
      {/* Camera icon on frame */}
      <mesh position={[3, 3.5, -5.21]}>
        <planeGeometry args={[0.4, 0.32]} />
        <meshBasicMaterial color={LAVENDER_DARK} />
      </mesh>

      {/* Name sign */}
      <Text
        position={[-3.5, 6.5, -5.3]}
        fontSize={0.9}
        color={PINK_DARK}
        anchorX="center"
        anchorY="middle"
        
      >
        Ri ♡
      </Text>

      {/* Age tag */}
      <mesh position={[-3.5, 5.4, -5.25]}>
        <planeGeometry args={[2.2, 0.5]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>
      <Text
        position={[-3.5, 5.4, -5.2]}
        fontSize={0.28}
        color="#7A6A7A"
        anchorX="center"
        anchorY="middle"
      >
        1.5 years old ♡ Vietnam
      </Text>

      {/* Floating decorations */}
      <Heart position={[-4, 3, -1]} speed={1.2} offset={0} />
      <Heart position={[4, 4, -1.5]} speed={0.9} offset={1} />
      <Heart position={[-1, 5, -4]} speed={1.5} offset={2} />
      <Heart position={[2, 2.5, -0.5]} speed={1.0} offset={0.5} />

      <Star position={[-3, 6, -3]} speed={1.0} offset={0.3} />
      <Star position={[3.5, 5.5, -2.5]} speed={1.4} offset={1.2} />
      <Star position={[0, 6.5, -4.5]} speed={0.8} offset={2.1} />

      {/* String lights on ceiling */}
      {[-4, -2, 0, 2, 4].map((x, i) => (
        <mesh key={i} position={[x, 7.8, -2]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? GOLD : PINK_DARK} />
        </mesh>
      ))}
    </group>
  );
};

export default Scene_Ri;
