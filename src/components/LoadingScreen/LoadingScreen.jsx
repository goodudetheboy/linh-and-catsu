import { useRef, useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import "./LoadingScreen.css";
import { useExperienceStore } from "../../store/useExperienceStore";

const LoadingScreen = () => {
  const { progress, active } = useProgress();
  const [maxProgress, setMaxProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [gone, setGone] = useState(false);

  const setIsExperienceReady = useExperienceStore((s) => s.setIsExperienceReady);

  const tlRef = useRef(null);
  const trRef = useRef(null);
  const blRef = useRef(null);
  const brRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (active && progress === 100) return;
    setMaxProgress((prev) => (progress > prev ? progress : prev));
  }, [progress, active]);

  useGSAP(() => {
    if (!revealed) return;

    gsap.to(contentRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power1.out",
      onStart: () => setIsExperienceReady(true),
    });

    const ease = "power2.inOut";
    gsap.to(tlRef.current, { top: "-100%", left: "-100%", duration: 1.1, ease });
    gsap.to(trRef.current, { top: "-100%", right: "-100%", duration: 1.1, ease });
    gsap.to(blRef.current, { bottom: "-100%", left: "-100%", duration: 1.1, ease });
    gsap.to(brRef.current, {
      bottom: "-100%",
      right: "-100%",
      duration: 1.1,
      ease,
      onComplete: () => setGone(true),
    });
  }, [revealed]);

  const isLoaded = maxProgress === 100;

  if (gone) return null;

  return (
    <div className="loading-screen">
      <div ref={tlRef} className="quadrant quadrant--tl" />
      <div ref={trRef} className="quadrant quadrant--tr" />
      <div ref={blRef} className="quadrant quadrant--bl" />
      <div ref={brRef} className="quadrant quadrant--br" />

      {!revealed && (
        <div ref={contentRef} className="loading-content">
          <h1 className="loading-title">Linh & Catsu</h1>
          <p className="loading-subtitle">a cat world made for you ♡</p>

          <div className="loading-bar-wrapper">
            <div
              className="loading-bar-fill"
              style={{ width: `${maxProgress}%` }}
            />
            <span
              className="loading-bar-paw"
              style={{ left: `${maxProgress}%` }}
            >
              🐾
            </span>
          </div>
          <p className="loading-progress-text">{Math.round(maxProgress)}%</p>

          {isLoaded && (
            <>
              <button className="enter-button" onClick={() => setRevealed(true)}>
                Enter ♡
              </button>
              <p className="scroll-hint">~ scroll to explore ~</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
