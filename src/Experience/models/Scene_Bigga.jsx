// Bigga's World — cool NYC loft vibes, slate blue & silver
// Scene centered at world (12.12, 0, -7), rotation = -Math.PI/3 to face camera

import * as THREE from "three";
import { Text } from "@react-three/drei";
import { AnimateMesh } from "../components/AnimateMesh";
import { useExperienceStore } from "../../store/useExperienceStore";

const SLATE = "#B0BEC5";
const BLUE_LIGHT = "#90CAF9";
const BLUE_MID = "#64B5F6";
const SILVER = "#CFD8DC";
const CREAM = "#FAFAFA";
const NIGHT_BLUE = "#546E7A";
const TEAL = "#80DEEA";
const GOLD = "#FFD580";

function FloatingSnowflake({ position, speed = 1, offset = 0 }) {
  return (
    <AnimateMesh
      position={position}
      animations={[
        { property: "position", axis: "y", speed, amplitude: 0.1, base: position[1], offset },
        { property: "rotation", axis: "y", speed: speed * 1.5, amplitude: Math.PI, offset },
        { property: "rotation", axis: "z", speed: speed * 0.5, amplitude: 0.3, offset },
      ]}
    >
      <mesh>
        <octahedronGeometry args={[0.1]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>
    </AnimateMesh>
  );
}

function FloatingCircle({ position, speed = 1, offset = 0 }) {
  return (
    <AnimateMesh
      position={position}
      animations={[
        { property: "position", axis: "y", speed, amplitude: 0.12, base: position[1], offset },
        { property: "rotation", axis: "x", speed: speed * 0.6, amplitude: Math.PI, offset },
      ]}
    >
      <mesh>
        <torusGeometry args={[0.12, 0.04, 8, 16]} />
        <meshBasicMaterial color={BLUE_MID} />
      </mesh>
    </AnimateMesh>
  );
}

const Scene_Bigga = () => {
  const openCatPanel = useExperienceStore((s) => s.openCatPanel);

  return (
    <group position={[12.12, 0, -7]} rotation={[0, -Math.PI / 3, 0]}>
      {/* Floor - concrete-ish grey */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial color={SLATE} side={THREE.DoubleSide} />
      </mesh>

      {/* Floor rug - circular */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[3.5, 24]} />
        <meshBasicMaterial color={NIGHT_BLUE} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[3, 24]} />
        <meshBasicMaterial color={BLUE_LIGHT} side={THREE.DoubleSide} />
      </mesh>

      {/* Back wall - dark night sky vibes */}
      <mesh position={[0, 4, -5.5]}>
        <planeGeometry args={[14, 9]} />
        <meshBasicMaterial color={NIGHT_BLUE} side={THREE.DoubleSide} />
      </mesh>

      {/* NYC skyline silhouette on back wall */}
      {[
        [-5, 1.5, 1.5, -5.3],
        [-3.5, 2.5, 1.2, -5.3],
        [-2, 3.5, 1.0, -5.3],
        [-0.5, 2.8, 1.1, -5.3],
        [1, 4.2, 0.9, -5.3],
        [2.2, 2.0, 1.3, -5.3],
        [3.5, 3.0, 1.0, -5.3],
        [4.8, 1.8, 1.4, -5.3],
      ].map(([x, h, w, z], i) => (
        <mesh key={i} position={[x, h / 2, z]}>
          <boxGeometry args={[w, h, 0.05]} />
          <meshBasicMaterial color={SILVER} />
        </mesh>
      ))}

      {/* Left wall */}
      <mesh position={[-7, 4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[11, 9]} />
        <meshBasicMaterial color={SILVER} side={THREE.DoubleSide} />
      </mesh>

      {/* Right wall */}
      <mesh position={[7, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[11, 9]} />
        <meshBasicMaterial color={SILVER} side={THREE.DoubleSide} />
      </mesh>

      {/* Large window on right wall (city view) */}
      <mesh position={[6.9, 4.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial color={BLUE_LIGHT} transparent opacity={0.7} />
      </mesh>
      {/* Window frame */}
      <mesh position={[6.85, 4.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.08, 4]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>
      <mesh position={[6.85, 4.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4, 0.08]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>

      {/* Cat perch / tower */}
      {/* Base */}
      <mesh position={[-3.5, 0.5, -2]}>
        <cylinderGeometry args={[0.8, 0.9, 1, 12]} />
        <meshBasicMaterial color={SILVER} />
      </mesh>
      {/* Middle post */}
      <mesh position={[-3.5, 1.5, -2]}>
        <cylinderGeometry args={[0.18, 0.18, 2, 8]} />
        <meshBasicMaterial color="#8FA0A8" />
      </mesh>
      {/* Platform */}
      <mesh position={[-3.5, 2.6, -2]}>
        <cylinderGeometry args={[0.9, 0.85, 0.2, 12]} />
        <meshBasicMaterial color={SLATE} />
      </mesh>
      {/* Cushion on platform */}
      <mesh position={[-3.5, 2.8, -2]}>
        <cylinderGeometry args={[0.75, 0.75, 0.15, 12]} />
        <meshBasicMaterial color={BLUE_MID} />
      </mesh>
      {/* Second post */}
      <mesh position={[-3.5, 3.8, -2]}>
        <cylinderGeometry args={[0.14, 0.14, 2, 8]} />
        <meshBasicMaterial color="#8FA0A8" />
      </mesh>
      {/* Top platform */}
      <mesh position={[-3.5, 4.9, -2]}>
        <cylinderGeometry args={[0.85, 0.8, 0.18, 12]} />
        <meshBasicMaterial color={SLATE} />
      </mesh>

      {/* Sofa - modern grey */}
      <mesh position={[3, 0.8, -3]}>
        <boxGeometry args={[3.5, 0.7, 1.6]} />
        <meshBasicMaterial color={SILVER} />
      </mesh>
      <mesh position={[3, 1.7, -3.7]}>
        <boxGeometry args={[3.5, 1.6, 0.4]} />
        <meshBasicMaterial color="#9FB8C5" />
      </mesh>
      {/* Sofa cushions */}
      {[-0.9, 0.9].map((x, i) => (
        <mesh key={i} position={[3 + x, 1.3, -3]}>
          <boxGeometry args={[1.5, 0.55, 1.5]} />
          <meshBasicMaterial color={BLUE_LIGHT} />
        </mesh>
      ))}

      {/* Coffee table */}
      <mesh position={[3, 0.45, -1]}>
        <boxGeometry args={[2, 0.08, 1]} />
        <meshBasicMaterial color="#8FA0A8" />
      </mesh>
      <mesh position={[3, 0.22, -1]}>
        <boxGeometry args={[1.8, 0.08, 0.8]} />
        <meshBasicMaterial color={NIGHT_BLUE} />
      </mesh>

      {/* Clickable photo frame */}
      <mesh
        position={[4, 4, -5.3]}
        onClick={() => openCatPanel("bigga")}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}
      >
        <boxGeometry args={[1.6, 1.8, 0.08]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>
      <mesh position={[4, 4, -5.22]}>
        <planeGeometry args={[1.2, 1.4]} />
        <meshBasicMaterial color={BLUE_MID} />
      </mesh>
      <mesh position={[4, 4, -5.21]}>
        <planeGeometry args={[0.4, 0.32]} />
        <meshBasicMaterial color={NIGHT_BLUE} />
      </mesh>

      {/* Name sign */}
      <Text
        position={[-3.5, 6.5, -5.3]}
        fontSize={0.9}
        color={BLUE_MID}
        anchorX="center"
        anchorY="middle"
        
      >
        Bigga ♡
      </Text>

      {/* Age tag */}
      <mesh position={[-3.5, 5.4, -5.25]}>
        <planeGeometry args={[2.8, 0.5]} />
        <meshBasicMaterial color={CREAM} />
      </mesh>
      <Text
        position={[-3.5, 5.4, -5.2]}
        fontSize={0.28}
        color="#546E7A"
        anchorX="center"
        anchorY="middle"
      >
        2.5 years old ♡ New York
      </Text>

      {/* Floating decorations */}
      <FloatingSnowflake position={[-4, 4, -1]} speed={1.2} offset={0} />
      <FloatingSnowflake position={[4.5, 5.5, -2]} speed={0.8} offset={1} />
      <FloatingSnowflake position={[0, 6.5, -4]} speed={1.4} offset={2} />
      <FloatingSnowflake position={[-2, 3.5, -2]} speed={1.0} offset={0.5} />

      <FloatingCircle position={[3.5, 5, -1.5]} speed={0.9} offset={0.3} />
      <FloatingCircle position={[-3, 6, -3]} speed={1.1} offset={1.2} />
      <FloatingCircle position={[1, 7, -4.5]} speed={0.7} offset={2.0} />

      {/* City window light dots */}
      {[1, 1.8, 2.6, 3.4, 4.2, 5].map((y, i) =>
        [-5, -4, -3, -2, -1].map((x, j) => (
          <mesh key={`w-${i}-${j}`} position={[6.88, y, x * 0.3]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.08, 0.06]} />
            <meshBasicMaterial color={(i + j) % 3 === 0 ? GOLD : CREAM} />
          </mesh>
        ))
      )}

      {/* String lights */}
      {[-4, -2, 0, 2, 4].map((x, i) => (
        <mesh key={i} position={[x, 7.8, -2]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? TEAL : BLUE_MID} />
        </mesh>
      ))}
    </group>
  );
};

export default Scene_Bigga;
