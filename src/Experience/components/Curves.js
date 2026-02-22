import * as THREE from "three";

// Three cat scenes arranged at equilateral triangle vertices (radius 14):
//   Ri    at (0,    0,  14)   → camera approaches from (0, 2, 6)
//   Rua   at (-12.12, 0, -7) → camera approaches from (-5, 2, -3)
//   Bigga at ( 12.12, 0, -7) → camera approaches from ( 5, 2, -3)

export const exportedCurves = [
  {
    name: "cameraPathCurve",
    closed: true,
    startIndex: 0,
    points: [
      // ── Ri zone (t ≈ 0.0 – 0.3) ──
      new THREE.Vector3(0, 2.5, 5.5),
      new THREE.Vector3(-1.5, 2.2, 5.8),
      // ── Transition Ri → Rua ──
      new THREE.Vector3(-3.5, 2, 4.5),
      new THREE.Vector3(-5.0, 2, 2.0),
      new THREE.Vector3(-5.5, 2, 0.0),
      // ── Rua zone (t ≈ 0.35 – 0.6) ──
      new THREE.Vector3(-5.5, 2, -2.0),
      new THREE.Vector3(-5.0, 2, -3.0),
      new THREE.Vector3(-4.5, 2.2, -3.8),
      // ── Transition Rua → Bigga ──
      new THREE.Vector3(-2.0, 2, -5.5),
      new THREE.Vector3(0.0, 2, -6.0),
      new THREE.Vector3(2.0, 2, -5.5),
      // ── Bigga zone (t ≈ 0.67 – 0.9) ──
      new THREE.Vector3(4.5, 2.2, -3.8),
      new THREE.Vector3(5.0, 2, -3.0),
      new THREE.Vector3(5.5, 2, -2.0),
      // ── Transition Bigga → Ri ──
      new THREE.Vector3(5.5, 2, 0.0),
      new THREE.Vector3(5.0, 2, 2.0),
      new THREE.Vector3(3.5, 2, 4.5),
      new THREE.Vector3(1.5, 2.2, 5.8),
    ],
  },
  {
    name: "cameraLookAtCurve",
    closed: true,
    startIndex: 0,
    points: [
      // Looking at Ri
      new THREE.Vector3(0, 1.2, 13),
      new THREE.Vector3(-1, 1.2, 12.5),
      // Transition
      new THREE.Vector3(-7, 1, 5),
      new THREE.Vector3(-10, 1, 0),
      new THREE.Vector3(-11, 1, -3),
      // Looking at Rua
      new THREE.Vector3(-11.5, 1, -6),
      new THREE.Vector3(-11.5, 1.2, -7),
      new THREE.Vector3(-10.5, 1.2, -8),
      // Transition
      new THREE.Vector3(-5, 1, -11),
      new THREE.Vector3(0, 1, -12),
      new THREE.Vector3(5, 1, -11),
      // Looking at Bigga
      new THREE.Vector3(10.5, 1.2, -8),
      new THREE.Vector3(11.5, 1.2, -7),
      new THREE.Vector3(11.5, 1, -6),
      // Transition
      new THREE.Vector3(11, 1, -3),
      new THREE.Vector3(10, 1, 0),
      new THREE.Vector3(7, 1, 5),
      new THREE.Vector3(1, 1.2, 12.5),
    ],
  },
  {
    name: "catCurve",
    closed: true,
    startIndex: 0,
    points: [
      // Ri zone (top, z+)
      new THREE.Vector3(0, 0.3, 11),
      new THREE.Vector3(-4, 0.3, 10.5),
      // Travel to Rua
      new THREE.Vector3(-8, 0.3, 7),
      new THREE.Vector3(-10.5, 0.3, 3),
      new THREE.Vector3(-11, 0.3, -1),
      // Rua zone (left, x-)
      new THREE.Vector3(-10.5, 0.3, -5),
      new THREE.Vector3(-9.5, 0.3, -7),
      new THREE.Vector3(-8, 0.3, -9),
      // Travel to Bigga (through bottom)
      new THREE.Vector3(-4, 0.3, -11),
      new THREE.Vector3(0, 0.3, -12),
      new THREE.Vector3(4, 0.3, -11),
      // Bigga zone (right, x+)
      new THREE.Vector3(8, 0.3, -9),
      new THREE.Vector3(9.5, 0.3, -7),
      new THREE.Vector3(10.5, 0.3, -5),
      // Travel back to Ri
      new THREE.Vector3(11, 0.3, -1),
      new THREE.Vector3(10.5, 0.3, 3),
      new THREE.Vector3(8, 0.3, 7),
      new THREE.Vector3(4, 0.3, 10.5),
    ],
  },
  // Mobile variants (slightly tighter)
  {
    name: "mobileCameraPathCurve",
    closed: true,
    startIndex: 0,
    points: [
      new THREE.Vector3(0, 3, 4.5),
      new THREE.Vector3(-4, 2.5, 2.5),
      new THREE.Vector3(-5, 2.5, 0),
      new THREE.Vector3(-4.5, 2.5, -3),
      new THREE.Vector3(0, 2.5, -5),
      new THREE.Vector3(4.5, 2.5, -3),
      new THREE.Vector3(5, 2.5, 0),
      new THREE.Vector3(4, 2.5, 2.5),
    ],
  },
  {
    name: "mobileCameraLookAtCurve",
    closed: true,
    startIndex: 0,
    points: [
      new THREE.Vector3(0, 1, 12),
      new THREE.Vector3(-10, 1, 2),
      new THREE.Vector3(-11, 1, -6),
      new THREE.Vector3(-5, 1, -10),
      new THREE.Vector3(0, 1, -11),
      new THREE.Vector3(5, 1, -10),
      new THREE.Vector3(11, 1, -6),
      new THREE.Vector3(10, 1, 2),
    ],
  },
  {
    name: "mobileCatCurve",
    closed: true,
    startIndex: 0,
    points: [
      new THREE.Vector3(0, 0.3, 11),
      new THREE.Vector3(-9.5, 0.3, -5),
      new THREE.Vector3(0, 0.3, -12),
      new THREE.Vector3(9.5, 0.3, -5),
    ],
  },
];

export const createCurves = () => {
  const curves = {};
  exportedCurves.forEach((data) => {
    let pts = [...data.points];
    const idx = data.startIndex || 0;
    if (idx > 0 && idx < pts.length) {
      pts = [...pts.slice(idx), ...pts.slice(0, idx)];
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    curve.closed = data.closed;
    curves[data.name] = curve;
  });
  return curves;
};
