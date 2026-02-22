import { useState, useRef } from "react";
import gsap from "gsap";
import "./PasswordGate.css";

const CORRECT_PASSWORD = import.meta.env.VITE_SITE_PASSWORD ?? "catsu";
const SESSION_KEY = "catsu_unlocked";

const PasswordGate = ({ children }) => {
  const isUnlocked =
    typeof window !== "undefined" &&
    sessionStorage.getItem(SESSION_KEY) === "true";

  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
      sessionStorage.setItem(SESSION_KEY, "true");
      gsap.to(".password-gate", {
        opacity: 0,
        scale: 0.96,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => setUnlocked(true),
      });
    } else {
      setError("Hmm, that's not right... try again? 🐾");
      if (inputRef.current) {
        inputRef.current.classList.remove("error");
        void inputRef.current.offsetWidth;
        inputRef.current.classList.add("error");
      }
    }
  };

  if (unlocked) return children;

  return (
    <>
      <div className="password-gate">
        <div className="password-gate__card">
          <div className="password-gate__paws">🐱</div>
          <h1 className="password-gate__title">Linh's Cat World</h1>
          <p className="password-gate__subtitle">
            Psst... this little world was made just for you ♡
            <br />
            Enter the secret password to get in!
          </p>

          <form
            className="password-gate__input-wrapper"
            onSubmit={handleSubmit}
            style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <input
              ref={inputRef}
              className="password-gate__input"
              type="password"
              placeholder="secret password..."
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              autoFocus
            />
            <p className="password-gate__error">{error}</p>
            <button className="password-gate__button" type="submit">
              Open the door ♡
            </button>
          </form>
        </div>
      </div>
      {/* Hidden so the 3D scene loads behind the gate */}
      <div style={{ visibility: "hidden", position: "absolute" }}>{children}</div>
    </>
  );
};

export default PasswordGate;
