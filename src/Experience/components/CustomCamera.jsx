import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useCurveProgressStore } from "../../store/useCurveProgressStore";
import { useCameraStore } from "../../store/useCameraStore";
import { useResponsiveStore } from "../../store/useResponsiveStore";
import { useExperienceStore } from "../../store/useExperienceStore";

const CustomCamera = () => {
  const { pointer } = useThree();
  const cameraGroupRef = useRef();
  const cameraRef = useRef();

  const targetPosition = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const currentPointer = useRef(new THREE.Vector2());
  const isInitialFrame = useRef(true);

  useFrame(() => {
    if (!cameraGroupRef.current || !cameraRef.current) return;
    if (useExperienceStore.getState().isPhotoPanelOpen) return;

    const { scrollProgress, curves } = useCurveProgressStore.getState();

    curves.cameraPathCurve.getPointAt(scrollProgress, targetPosition.current);
    curves.cameraLookAtCurve.getPointAt(scrollProgress, targetLookAt.current);

    if (isInitialFrame.current) {
      cameraGroupRef.current.position.copy(targetPosition.current);
      currentLookAt.current.copy(targetLookAt.current);
      cameraGroupRef.current.lookAt(currentLookAt.current);
      cameraRef.current.rotation.set(0, Math.PI, 0);
      isInitialFrame.current = false;
      return;
    }

    cameraGroupRef.current.position.lerp(targetPosition.current, 0.1);
    currentLookAt.current.lerp(targetLookAt.current, 0.1);
    cameraGroupRef.current.lookAt(currentLookAt.current);

    const isMobile = useResponsiveStore.getState().isMobile;
    currentPointer.current.lerp(isMobile ? { x: 0, y: 0 } : pointer, 0.08);

    cameraRef.current.position.set(
      isMobile ? 0 : currentPointer.current.x * 0.15,
      isMobile ? 0 : currentPointer.current.y * 0.1,
      0
    );
    cameraRef.current.rotation.set(
      isMobile ? 0 : -currentPointer.current.y * 0.08,
      isMobile ? Math.PI : -currentPointer.current.x * 0.08 + Math.PI,
      0
    );

    const zoom = useCameraStore.getState().zoom;
    if (cameraRef.current.zoom !== zoom) {
      cameraRef.current.zoom = zoom;
      cameraRef.current.updateProjectionMatrix();
    }
  });

  return (
    <group ref={cameraGroupRef}>
      <PerspectiveCamera makeDefault fov={50} ref={cameraRef} />
    </group>
  );
};

export default CustomCamera;
