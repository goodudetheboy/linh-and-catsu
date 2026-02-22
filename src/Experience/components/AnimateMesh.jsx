import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function AnimateMesh({
  children,
  animations,
  property = "rotation",
  axis = "y",
  speed = 1,
  amplitude = 0.3,
  offset = 0,
  base = 0,
  position,
}) {
  const ref = useRef();

  const resolvedAnimations = animations ?? [
    { property, axis, speed, amplitude, offset, base },
  ];

  useFrame(({ clock }) => {
    if (!ref.current) return;
    resolvedAnimations.forEach(
      ({
        property: prop = "rotation",
        axis: ax = "y",
        speed: spd = 1,
        amplitude: amp = 0.3,
        offset: off = 0,
        base: b = 0,
      }) => {
        ref.current[prop][ax] =
          b + amp * Math.sin(clock.elapsedTime * spd + off);
      }
    );
  });

  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}
