import { useEffect, useState } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three/webgpu";
import Scene from "./Scene";
import ReactLenis from "lenis/react";
import gsap from "gsap";
import { useRef } from "react";
import { useCurveProgressStore } from "../store/useCurveProgressStore";
import { useGSAP } from "@gsap/react";
import { useExperienceStore } from "../store/useExperienceStore";

gsap.registerPlugin(ScrollTrigger, useGSAP);
extend(THREE);

const Experience = () => {
  const setScrollProgress = useCurveProgressStore((s) => s.setScrollProgress);
  const isExperienceReady = useExperienceStore((s) => s.isExperienceReady);
  const isPhotoPanelOpen = useExperienceStore((s) => s.isPhotoPanelOpen);

  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const lenisInstance = lenis?.lenis;
    if (!lenisInstance) return;
    if (isExperienceReady && !isPhotoPanelOpen) {
      lenisInstance.start();
    } else {
      lenisInstance.stop();
    }
  }, [isExperienceReady, isPhotoPanelOpen, lenis]);

  useEffect(() => {
    const lenisInstance = lenis?.lenis;
    if (!lenisInstance) return;

    const update = (time) => lenisInstance.raf(time * 1000);
    gsap.ticker.add(update);

    const syncScroll = (e) => {
      ScrollTrigger.update();
      setScrollProgress(e.progress);
    };
    lenisInstance.on("scroll", syncScroll);

    return () => {
      lenisInstance.off("scroll", syncScroll);
      gsap.ticker.remove(update);
    };
  }, [lenis, isExperienceReady]);

  return (
    <ReactLenis
      ref={setLenis}
      root
      options={{ autoRaf: false, infinite: true, syncTouch: true }}
    >
      <Canvas
        id="canvas-container"
        style={{ position: "fixed", top: 0, left: 0, transformOrigin: "center center" }}
        flat
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer({
            ...props,
            logarithmicDepthBuffer: true,
          });
          await renderer.init();
          return renderer;
        }}
      >
        <Scene />
        <color attach="background" args={["#F9E8D9"]} />
      </Canvas>
      <div
        style={{ height: "1000vh", width: "100%", pointerEvents: "none" }}
        id="dummy-scroll-div"
      />
    </ReactLenis>
  );
};

export default Experience;
