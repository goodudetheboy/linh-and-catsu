import { useEffect, useRef, useState } from "react";
import "./App.css";
import Experience from "./Experience/Experience";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import PhotoPanel from "./components/PhotoPanel/PhotoPanel";
import PasswordGate from "./components/PasswordGate/PasswordGate";
import { useExperienceStore } from "./store/useExperienceStore";
import { useResponsiveStore } from "./store/useResponsiveStore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function App() {
  const isPhotoPanelOpen = useExperienceStore((s) => s.isPhotoPanelOpen);
  const isExperienceReady = useExperienceStore((s) => s.isExperienceReady);
  const isMobile = useResponsiveStore((s) => s.isMobile);
  const tlRef = useRef(null);

  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!isExperienceReady) return;
    const t = setTimeout(() => setShowHint(true), 1200);
    const t2 = setTimeout(() => setShowHint(false), 5000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [isExperienceReady]);

  useGSAP(() => {
    if (tlRef.current) { tlRef.current.revert(); tlRef.current.kill(); }

    const ease = { duration: 0.7, ease: "power3.inOut" };

    tlRef.current = isMobile
      ? gsap.timeline({ paused: true })
          .to("#canvas-container", { scale: 0.45, borderRadius: "28px", transformOrigin: "center 120px", ...ease })
          .to(".full-page-border", { scale: 0.45, borderRadius: "28px", transformOrigin: "center 120px", ...ease }, "<")
      : gsap.timeline({ paused: true })
          .to("#canvas-container", { scale: 0.62, borderRadius: "28px", transformOrigin: "20px center", ...ease })
          .to(".full-page-border", { scale: 0.62, borderRadius: "28px", transformOrigin: "20px center", ...ease }, "<");

    if (isPhotoPanelOpen) tlRef.current.progress(1);
  }, [isMobile]);

  useEffect(() => {
    if (!tlRef.current) return;
    isPhotoPanelOpen ? tlRef.current.play() : tlRef.current.reverse();
  }, [isPhotoPanelOpen]);

  return (
    <PasswordGate>
      <LoadingScreen />
      <PhotoPanel />
      <div className="full-page-border" />
      <span className="corner-decoration corner-decoration--tl">🐾</span>
      <span className="corner-decoration corner-decoration--tr">🐾</span>
      <span className="corner-decoration corner-decoration--bl">🐾</span>
      <span className="corner-decoration corner-decoration--br">🐾</span>
      <div className={`hint-bubble ${showHint ? "visible" : ""}`}>
        click the photo frames to open a cat's gallery ♡
      </div>
      <Experience />
    </PasswordGate>
  );
}

export default App;
