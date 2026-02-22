// Rua's World — warm golden/amber cozy senior cat space
// Scene centered at world (-12.12, 0, -7), rotation = Math.PI/3 to face camera

import * as THREE from "three";
import { Text } from "@react-three/drei";
import { AnimateMesh } from "../components/AnimateMesh";
import { useExperienceStore } from "../../store/useExperienceStore";

const GOLD = "#FFD580";
const AMBER = "#FFB347";
const CREAM = "#FFF8E7";
const WARM_BROWN = "#C8956C";
const ORANGE_LIGHT = "#FFE0B2";
const PINK_SOFT = "#FFD6C8";

function FloatingStar({ position, speed = 1, offset = 0, color = GOLD }) {
  return (
    <AnimateMesh
      position={position}
      animations={[
        { property: "position", axis: "y", speed, amplitude: 0.12, base: position[1], offset },
        { property: "rotation", axis: "y", speed: speed * 0.8, amplitude: Math.PI, offset },
      ]}
    >
      <mesh>
        <octahedronGeometry args={[0.13]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </AnimateMesh>
  );
}

function FloatingDiamond({ position, speed = 1, offset = 0 }) {
  return (
    <AnimateMesh
      position={position}
      animations={[
        { property: "position", axis: "y", speed, amplitude: 0.1, base: position[1], offset },
        { property: "rotation", axis: "z", speed: speed * 0.5, amplitude: 0.4, offset },
      ]}
    >
      <mesh>
        <octahedronGeometry args={[0.1]} />
        <meshBasicMaterial color={AMBER} />
      </mesh>
    </AnimateMesh>
  );
}

const Scene_Rua = () => {
  const openCatPanel = useExperienceStore((s) => s.openCatPanel);

  return (
    <group position={[-12.12, 0, -7]} rotation={[0, Math.PI / 3, 0]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial color={GOLD} side={THREE.DoubleSide} />
      </mesh>

      {/* Floor rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[6, 5]} />
        <meshBasicMaterial color={ORANGE_LIGHT} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[5.2, 4.2]} />
        <meshBasicMaterial color={AMBER} side={THREE.DoubleSide} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 4, -5.5]}>
        <planeGeometry args={[14, 9]} />
        <meshBasicMaterial color={ORANGE_LIGHT} side={THREE.DoubleSide} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-7, 4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[11, 9]} />
        <meshBasicMaterial color={CREAM} side={THREE.DoubleSide} />
      </mesh>

      {/* Right wall */}
      <mesh position={[7, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[11, 9]} />
        <meshBasicMaterial color={CREAM} side={THREE.DoubleSide} />
      </mesh>

      {/* Cozy armchair */}
      {/* Seat */}
      <mesh position={[2.5, 1.0, -2]}>
        <boxGeometry args={[2.5, 0.6, 2]} />
        <meshBasicMaterial color={AMBER} />
      </mesh>
      {/* Back */}
      <mesh position={[2.5, 2.5, -3]}>
        <boxGeometry args={[2.5, 2.2, 0.4]} />
        <meshBasicMaterial color={AMBER} />
      </mesh>
      {/* Left armrest */}
      <mesh position={[1.2, 1.5, -2]}>
        <boxGeometry args={[0.4, 0.8, 2]} />
        <meshBasicMaterial color={WARM_BROWN} />
      </mesh>
      {/* Right armrest */}
      <mesh position={[3.8, 1.5, -2]}>
        <boxGeometry args={[0.4, 0.8, 2]} />
        <meshBasicMaterial color={WARM_BROWN} />
      </mesh>
      {/* Seat cushion */}
      <mesh position={[2.5, 1.35, -2]}>
        <boxGeometry args={[2.1, 0.25, 1.7]} />
        <meshBasicMaterial color={PINK_SOFT} />
      </mesh>

      {/* Side table with lamp */}
      <mesh position={[-2.5, 0.9, -2]}>
        <cylinderGeometry args={[0.6, 0.5, 0.9, 12]} />
        <meshBasicMaterial color={WARM_BROWN} />
      </mesh>
      <mesh position={[-2.5, 1.0, -2]}>
        <cylinderGeometry args={[0.62, 0.62, 0.1, 12]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>
      {/* Lamp post */}
      <mesh position={[-2.5, 2.5, -2]}>
        <cylinderGeometry args={[0.05, 0.05, 2.2, 8]} />
        <meshBasicMaterial color="#A07040" />
      </mesh>
      {/* Lamp shade */}
      <mesh position={[-2.5, 3.5, -2]}>
        <coneGeometry args={[0.6, 0.8, 12, 1, true]} />
        <meshBasicMaterial color={CREAM} side={THREE.DoubleSide} />
      </mesh>
      {/* Lamp glow */}
      <mesh position={[-2.5, 3.1, -2]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial color={GOLD} />
      </mesh>

      {/* Bookshelf on left wall */}
      <mesh position={[-5.5, 2.5, -1]}>
        <boxGeometry args={[0.3, 5, 3.5]} />
        <meshBasicMaterial color={WARM_BROWN} />
      </mesh>
      {/* Books */}
      {[0.7, 1.4, 2.1, 2.8, 3.5, 4.2].map((y, i) => (
        <mesh key={i} position={[-5.3, y, -1 + (i % 3) * 0.4 - 0.4]}>
          <boxGeometry args={[0.2, 0.6, 0.35]} />
          <meshBasicMaterial color={[AMBER, PINK_SOFT, GOLD, WARM_BROWN, CREAM, ORANGE_LIGHT][i]} />
        </mesh>
      ))}

      {/* Clickable photo album */}
      <mesh
        position={[-4.5, 3.5, -5.3]}
        onClick={() => openCatPanel("rua")}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}
      >
        <boxGeometry args={[1.6, 1.8, 0.08]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>
      <mesh position={[-4.5, 3.5, -5.22]}>
        <planeGeometry args={[1.2, 1.4]} />
        <meshBasicMaterial color={GOLD} />
      </mesh>
      <mesh position={[-4.5, 3.5, -5.21]}>
        <planeGeometry args={[0.4, 0.32]} />
        <meshBasicMaterial color={AMBER} />
      </mesh>

      {/* Name sign */}
      <Text
        position={[4, 6.5, -5.3]}
        fontSize={0.9}
        color={WARM_BROWN}
        anchorX="center"
        anchorY="middle"
        
      >
        Rua ♡
      </Text>

      {/* Age tag */}
      <mesh position={[4, 5.4, -5.25]}>
        <planeGeometry args={[2.5, 0.5]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>
      <Text
        position={[4, 5.4, -5.2]}
        fontSize={0.28}
        color="#7A6A7A"
        anchorX="center"
        anchorY="middle"
      >
        5 years old ♡ Vietnam
      </Text>

      {/* Floating decorations */}
      <FloatingStar position={[-4, 4, -1]} speed={1.1} offset={0} />
      <FloatingStar position={[4.5, 5, -2]} speed={0.8} offset={1} color={AMBER} />
      <FloatingStar position={[0, 6, -4]} speed={1.3} offset={2} />
      <FloatingStar position={[-2, 3, -1.5]} speed={1.0} offset={0.7} color={PINK_SOFT} />

      <FloatingDiamond position={[3.5, 6.5, -3]} speed={0.9} offset={0.4} />
      <FloatingDiamond position={[-3, 5.5, -3.5]} speed={1.2} offset={1.5} />
      <FloatingDiamond position={[1.5, 7, -4]} speed={0.7} offset={0.8} />

      {/* String lights */}
      {[-4, -2, 0, 2, 4].map((x, i) => (
        <mesh key={i} position={[x, 7.8, -2]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? GOLD : AMBER} />
        </mesh>
      ))}
    </group>
  );
};

export default Scene_Rua;
