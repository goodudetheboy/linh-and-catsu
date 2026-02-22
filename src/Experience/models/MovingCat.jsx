import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Billboard } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useCurveProgressStore } from "../../store/useCurveProgressStore";
import { AnimateMesh } from "../components/AnimateMesh";

const CAT_CONFIGS = {
  ri: {
    texturePath: "/textures/ri-papercraft.png",
    offset: 0.02,
    range: { start: 0.02, end: 0.3 },
    size: [1.4, 1.8],
  },
  rua: {
    texturePath: "/textures/rua-papercraft.png",
    offset: 0.36,
    range: { start: 0.36, end: 0.63 },
    size: [1.6, 1.9],
  },
  bigga: {
    texturePath: "/textures/bigga-papercraft.png",
    offset: 0.69,
    range: { start: 0.69, end: 0.96 },
    size: [1.4, 2.0],
  },
};

function CatCharacter({ catKey }) {
  const config = CAT_CONFIGS[catKey];
  const texture = useTexture(config.texturePath);
  texture.colorSpace = THREE.SRGBColorSpace;

  const outerRef = useRef();
  const innerRef = useRef();
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const upVec = useRef(new THREE.Vector3(0, 1, 0));
  const prevProgress = useRef(0);
  const visibilityState = useRef(false);

  useFrame(() => {
    const { scrollProgress, curves } = useCurveProgressStore.getState();
    const curveName = "catCurve";
    if (!curves[curveName] || !outerRef.current) return;

    const { start, end } = config.range;
    const { offset } = config;

    const shouldBeVisible = scrollProgress >= start && scrollProgress < end;

    if (visibilityState.current !== shouldBeVisible) {
      visibilityState.current = shouldBeVisible;
      gsap.to(innerRef.current.position, {
        y: shouldBeVisible ? 0.2 : -6,
        duration: 1.5,
        ease: "back.out(1.2)",
        overwrite: "auto",
      });
    }

    const clamped = Math.min(Math.max(scrollProgress, start), end);
    const rangeProgress = (clamped - start) / (end - start);
    const curveValue = (offset + rangeProgress * (end - start)) % 1;

    curves[curveName].getPointAt(curveValue, targetPos.current);
    const tangent = curves[curveName].getTangentAt(curveValue);

    const isLoop =
      Math.abs(scrollProgress - prevProgress.current) > 0.5;

    if (isLoop) {
      outerRef.current.position.copy(targetPos.current);
    } else {
      outerRef.current.position.lerp(targetPos.current, 0.1);
    }

    targetLookAt.current.crossVectors(tangent, upVec.current);
    outerRef.current.lookAt(targetLookAt.current);

    prevProgress.current = scrollProgress;
  });

  return (
    <group ref={outerRef}>
      <group ref={innerRef} position={[0, -6, 0]}>
        <AnimateMesh
          animations={[
            { property: "position", axis: "y", speed: 1.8, amplitude: 0.06, base: 0.3 },
          ]}
        >
          <Billboard lockX={false} lockY={false} lockZ={false}>
            <mesh>
              <planeGeometry args={config.size} />
              <meshBasicMaterial
                map={texture}
                transparent
                alphaTest={0.05}
                side={THREE.DoubleSide}
              />
            </mesh>
          </Billboard>
        </AnimateMesh>
      </group>
    </group>
  );
}

const MovingCat = () => {
  return (
    <>
      <CatCharacter catKey="ri" />
      <CatCharacter catKey="rua" />
      <CatCharacter catKey="bigga" />
    </>
  );
};

export default MovingCat;
