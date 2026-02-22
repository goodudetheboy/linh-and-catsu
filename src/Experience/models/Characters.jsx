/**
 * Characters.jsx
 *
 * Two moving entities on the curve:
 *   1. The girlfriend — follows movingCharactersCurve through all 4 zones.
 *      Currently uses Moving_Characters_1.webp (Aimee's baked atlas) as a
 *      placeholder. Swap the GLB + texture here when you have a custom model.
 *
 *   2. The zone cat — each zone has its own cat (ri / rua / bigga).
 *      When the girlfriend enters a zone, the cat for that zone pops up and
 *      follows slightly behind her on the same curve.
 *      Cat textures are flat PNG sprites (transparent, billboard-facing camera).
 *
 * Zone → cat mapping:
 *   Winter (0.02 – 0.235)  → Ri    (/textures/ri-papercraft.png)
 *   Spring (0.235 – 0.49)  → Rua   (/textures/rua-papercraft.png)
 *   Summer (0.49 – 0.74)   → Bigga (/textures/bigga-papercraft.png)
 *   Fall   (0.74 – 0.99)   → none
 */

import { useKTX2Texture } from "../utils/ktxLoader";
import React, { useEffect, useRef } from "react";
import { useGLTF, useTexture, Billboard } from "@react-three/drei";
import { useCurveProgressStore } from "../../store/useCurveProgressStore";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { AnimateMesh } from "../components/AnimateMesh";

// ─── scroll zone config ──────────────────────────────────────────────────────

const ZONES = {
  winter: { start: 0.02, end: 0.235, girlfriendOffset: 0.0124 },
  spring: { start: 0.235, end: 0.49,  girlfriendOffset: 0.235  },
  summer: { start: 0.49,  end: 0.74,  girlfriendOffset: 0.49   },
  fall:   { start: 0.74,  end: 0.99,  girlfriendOffset: 0.74   },
};

const CAT_ZONES = {
  winter: { texture: "/textures/ri-papercraft.png",   size: [1.4, 1.8], lag: 0.018 },
  spring: { texture: "/textures/rua-papercraft.png",  size: [1.6, 1.9], lag: 0.018 },
  summer: { texture: "/textures/bigga-papercraft.png",size: [1.4, 2.0], lag: 0.018 },
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function getZone(progress) {
  for (const [name, z] of Object.entries(ZONES)) {
    if (progress >= z.start && progress < z.end) return name;
  }
  return null;
}

function useCurveFollower(curveRef, upVec) {
  const posRef    = useRef(new THREE.Vector3());
  const lookRef   = useRef(new THREE.Vector3());
  const tangentRef = useRef(new THREE.Vector3());

  return { posRef, lookRef, tangentRef };
}

// ─── Girlfriend ──────────────────────────────────────────────────────────────
// Currently wrapping the same Moving_Characters GLB / texture as Aimee's world.
// Replace the GLB path and node references when you have a custom model.

function Girlfriend() {
  const { nodes } = useGLTF("/models/Moving_Characters-transformed.glb");
  const texture   = useKTX2Texture("/textures/Moving_Characters_1.webp", { side: "double" });
  const curves    = useCurveProgressStore((s) => s.curves);

  const outerRef      = useRef();
  const innerRef      = useRef();
  const swapFrontRef  = useRef();
  const swapSideRef   = useRef();
  const leftArmRef    = useRef();
  const rightArmRef   = useRef();
  const leftFootRef   = useRef();
  const rightFootRef  = useRef();
  const sideFaceRef   = useRef();
  const sideFaceSmileRef = useRef();

  const targetPos  = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const upVec      = useRef(new THREE.Vector3(0, 1, 0));
  const prevProg   = useRef(0);
  const visRef     = useRef(false);

  const isScrolling   = useRef(false);
  const scrollTimeout = useRef(null);
  const idleTimer     = useRef(null);
  const showingFront  = useRef(true);

  // place on curve at startup
  useEffect(() => {
    if (!curves?.movingCharactersCurve) return;
    const z = ZONES.winter;
    curves.movingCharactersCurve.getPointAt(z.girlfriendOffset, targetPos.current);
    if (outerRef.current) outerRef.current.position.copy(targetPos.current);
  }, [curves]);

  useFrame(() => {
    if (!curves?.movingCharactersCurve || !outerRef.current) return;
    const scrollProgress = useCurveProgressStore.getState().scrollProgress;
    const zone = getZone(scrollProgress);
    const cfg  = zone ? ZONES[zone] : null;

    // visibility
    const shouldShow = !!cfg;
    if (visRef.current !== shouldShow) {
      visRef.current = shouldShow;
      gsap.to(innerRef.current.position, {
        y: shouldShow ? 0.23 : -5,
        duration: 1.5,
        ease: "back.out(1.2)",
        overwrite: "auto",
      });
    }

    if (!cfg) { prevProg.current = scrollProgress; return; }

    // position on curve
    const { start, end, girlfriendOffset } = cfg;
    const isLoop     = Math.abs(scrollProgress - prevProg.current) > 0.5;
    const clamped    = Math.min(Math.max(scrollProgress, start), end);
    const rangeProg  = (clamped - start) / (end - start);
    const curveVal   = girlfriendOffset + rangeProg * (end - start);

    curves.movingCharactersCurve.getPointAt(curveVal, targetPos.current);
    const tangent = curves.movingCharactersCurve.getTangentAt(curveVal);

    if (isLoop) outerRef.current.position.copy(targetPos.current);
    else         outerRef.current.position.lerp(targetPos.current, 0.1);

    targetLook.current.crossVectors(tangent, upVec.current);
    outerRef.current.lookAt(targetLook.current);

    // walking animation
    if (zone === "winter" && isScrolling.current) {
      const wave    = scrollProgress * 100;
      const swing   = Math.sin(wave) * 0.7;
      if (leftArmRef.current)  leftArmRef.current.rotation.z  = nodes.Moving_Characters_Winter_left_arm.rotation.z  + swing;
      if (rightArmRef.current) rightArmRef.current.rotation.z = nodes.Moving_Characters_Winter_right_arm.rotation.z - swing;
      if (leftFootRef.current)  leftFootRef.current.rotation.z  = nodes.Moving_Characters_Winter_left_foot.rotation.z  + swing;
      if (rightFootRef.current) rightFootRef.current.rotation.z = nodes.Moving_Characters_Winter_right_foot.rotation.z - swing;
    }

    // scroll-idle face swap (winter only)
    const scrollChanged = scrollProgress !== prevProg.current;
    if (scrollChanged) {
      isScrolling.current = true;
      clearTimeout(scrollTimeout.current);
      clearTimeout(idleTimer.current);

      if (zone === "winter" && showingFront.current) {
        showingFront.current = false;
        gsap.to(swapFrontRef.current?.position, { y: -5, duration: 0.4, ease: "back.in(1.2)" });
        gsap.to(swapSideRef.current?.position,  { y:  0, duration: 0.6, delay: 0.2, ease: "back.out(1.2)" });
      }

      scrollTimeout.current = setTimeout(() => { isScrolling.current = false; }, 50);
      idleTimer.current = setTimeout(() => {
        if (!showingFront.current) {
          showingFront.current = true;
          gsap.to(swapSideRef.current?.position,  { y: -5, duration: 0.4, ease: "back.in(1.2)" });
          gsap.to(swapFrontRef.current?.position, { y:  0, duration: 0.6, delay: 0.2, ease: "back.out(1.2)" });
        }
      }, 3000);
    }

    if (sideFaceRef.current)      sideFaceRef.current.visible      = !isScrolling.current;
    if (sideFaceSmileRef.current) sideFaceSmileRef.current.visible = isScrolling.current;

    prevProg.current = scrollProgress;
  });

  return (
    <group ref={outerRef}>
      <group ref={innerRef} position={[0, -5, 0]}>
        {/* front-facing idle view */}
        <AnimateMesh position={[0, 0, 0]} animations={[
          { property: "rotation", axis: "y", speed: 1, amplitude: 0.3 },
          { property: "position", axis: "y", speed: 2, amplitude: 0.05, base: 0.23 },
        ]}>
          <group ref={swapFrontRef} position={[0, 0, 0]}>
            <mesh geometry={nodes.Moving_Characters_Winter_arm_left_front.geometry}   material={texture} position={nodes.Moving_Characters_Winter_arm_left_front.position} />
            <mesh geometry={nodes.Moving_Characters_Winter_arm_right_front.geometry}  material={texture} position={nodes.Moving_Characters_Winter_arm_right_front.position} />
            <mesh geometry={nodes.Moving_Characters_Winter_front_character.geometry}  material={texture} position={nodes.Moving_Characters_Winter_front_character.position} />
            <mesh geometry={nodes.Moving_Characters_Winter_Front_Smile.geometry}      material={texture} position={nodes.Moving_Characters_Winter_Front_Smile.position} />
            <mesh geometry={nodes.Moving_Characters_Winter_front_smile_face.geometry} material={texture} position={nodes.Moving_Characters_Winter_front_smile_face.position} />
            <mesh geometry={nodes.Moving_Characters_Winter_head_front.geometry}       material={texture} position={nodes.Moving_Characters_Winter_head_front.position} />
          </group>
        </AnimateMesh>

        {/* side-walking view */}
        <AnimateMesh position={[0, 0, 0]} animations={[
          { property: "rotation", axis: "y", speed: 1, amplitude: 0.3 },
          { property: "position", axis: "y", speed: 2, amplitude: 0.05, base: 0 },
        ]}>
          <group ref={swapSideRef} position={[0, -5, 0]}>
            <mesh ref={leftArmRef}      geometry={nodes.Moving_Characters_Winter_left_arm.geometry}        material={texture} position={nodes.Moving_Characters_Winter_left_arm.position} />
            <mesh ref={rightArmRef}     geometry={nodes.Moving_Characters_Winter_right_arm.geometry}       material={texture} position={nodes.Moving_Characters_Winter_right_arm.position} />
            <mesh ref={leftFootRef}     geometry={nodes.Moving_Characters_Winter_left_foot.geometry}       material={texture} position={nodes.Moving_Characters_Winter_left_foot.position} />
            <mesh ref={rightFootRef}    geometry={nodes.Moving_Characters_Winter_right_foot.geometry}      material={texture} position={nodes.Moving_Characters_Winter_right_foot.position} />
            <mesh                       geometry={nodes.Moving_Characters_Winter_side.geometry}            material={texture} position={nodes.Moving_Characters_Winter_side.position} />
            <mesh ref={sideFaceRef}     geometry={nodes.Moving_Characters_Winter_side_face.geometry}       material={texture} position={nodes.Moving_Characters_Winter_side_face.position} />
            <mesh ref={sideFaceSmileRef}geometry={nodes.Moving_Characters_Winter_side_face_smile.geometry} material={texture} position={nodes.Moving_Characters_Winter_side_face_smile.position} />
          </group>
        </AnimateMesh>
      </group>
    </group>
  );
}

// ─── Zone Cat ─────────────────────────────────────────────────────────────────
// A flat PNG sprite that pops up in a zone and follows slightly behind the girl.

function ZoneCat({ zoneName }) {
  const cfg      = CAT_ZONES[zoneName];
  const zone     = ZONES[zoneName];
  const texture  = useTexture(cfg.texture);
  texture.colorSpace = THREE.SRGBColorSpace;

  const curves   = useCurveProgressStore((s) => s.curves);

  const outerRef  = useRef();
  const innerRef  = useRef();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook= useRef(new THREE.Vector3());
  const upVec     = useRef(new THREE.Vector3(0, 1, 0));
  const prevProg  = useRef(0);
  const visRef    = useRef(false);

  useEffect(() => {
    if (!curves?.movingCharactersCurve || !outerRef.current) return;
    curves.movingCharactersCurve.getPointAt(zone.girlfriendOffset, targetPos.current);
    outerRef.current.position.copy(targetPos.current);
  }, [curves]);

  useFrame(() => {
    if (!curves?.movingCharactersCurve || !outerRef.current) return;
    const scrollProgress = useCurveProgressStore.getState().scrollProgress;
    const inZone = scrollProgress >= zone.start && scrollProgress < zone.end;

    if (visRef.current !== inZone) {
      visRef.current = inZone;
      gsap.to(innerRef.current.position, {
        y: inZone ? 0.2 : -5,
        duration: 1.2,
        ease: "back.out(1.2)",
        overwrite: "auto",
      });
    }

    if (!inZone) { prevProg.current = scrollProgress; return; }

    const { start, end, girlfriendOffset } = zone;
    const isLoop    = Math.abs(scrollProgress - prevProg.current) > 0.5;
    const clamped   = Math.min(Math.max(scrollProgress, start), end);
    const rangeProg = (clamped - start) / (end - start);
    // cat lags behind girlfriend by `lag` curve units
    const curveVal  = Math.max(0, girlfriendOffset + rangeProg * (end - start) - cfg.lag);

    curves.movingCharactersCurve.getPointAt(curveVal, targetPos.current);
    const tangent = curves.movingCharactersCurve.getTangentAt(curveVal);

    if (isLoop) outerRef.current.position.copy(targetPos.current);
    else         outerRef.current.position.lerp(targetPos.current, 0.08);

    targetLook.current.crossVectors(tangent, upVec.current);
    outerRef.current.lookAt(targetLook.current);

    prevProg.current = scrollProgress;
  });

  return (
    <group ref={outerRef}>
      <group ref={innerRef} position={[0, -5, 0]}>
        <AnimateMesh animations={[
          { property: "position", axis: "y", speed: 1.8, amplitude: 0.06, base: 0.3 },
        ]}>
          <Billboard lockX={false} lockY={false} lockZ={false}>
            <mesh>
              <planeGeometry args={cfg.size} />
              <meshBasicMaterial map={texture} transparent alphaTest={0.05} side={THREE.DoubleSide} />
            </mesh>
          </Billboard>
        </AnimateMesh>
      </group>
    </group>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function Characters() {
  return (
    <>
      <Girlfriend />
      <ZoneCat zoneName="winter" />
      <ZoneCat zoneName="spring" />
      <ZoneCat zoneName="summer" />
    </>
  );
}

useGLTF.preload("/models/Moving_Characters-transformed.glb");
