/* Placeholder 2D papercraft character for Linh.
   Positioned as a fixed overlay, fully driven by canvas metrics so she
   scales and moves with the room canvas at any zoom level.
   Replace the SVG innards with real art when ready — keep the outer wrapper. */

interface LinhProps {
  screenX:  number  // px from left viewport edge (her horizontal center)
  screenY:  number  // px from top viewport edge (her FEET — bottom of sprite)
  width:    number  // px
  height:   number  // px
}

export function Linh({ screenX, screenY, width, height }: LinhProps) {
  return (
    <div
      className="fixed z-20 pointer-events-none"
      style={{
        left:       screenX,
        top:        screenY - height,
        width,
        height,
        transform:  'translateX(-50%)',
        transition: 'none',
      }}
    >
      <div
        className="animate-bop drop-shadow-paper"
        style={{ width: '100%', height: '100%' }}
      >
        {/* ── Placeholder SVG character (swap for real art) ── */}
        <svg
          viewBox="0 0 80 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Body */}
          <rect x="22" y="70" width="36" height="55" rx="8" fill="#fcd5b0" stroke="#3d2c2c" strokeWidth="2"/>
          {/* Dress ruffle */}
          <ellipse cx="40" cy="118" rx="24" ry="8" fill="#f9c6d0" stroke="#3d2c2c" strokeWidth="1.5"/>
          {/* Head */}
          <circle cx="40" cy="45" r="24" fill="#fcd5b0" stroke="#3d2c2c" strokeWidth="2"/>
          {/* Hair */}
          <ellipse cx="40" cy="26" rx="24" ry="14" fill="#3d2c2c"/>
          <ellipse cx="18" cy="42" rx="7" ry="14" fill="#3d2c2c"/>
          <ellipse cx="62" cy="42" rx="7" ry="14" fill="#3d2c2c"/>
          {/* Eyes */}
          <ellipse cx="32" cy="46" rx="4" ry="5" fill="white"/>
          <circle cx="33" cy="47" r="2.5" fill="#3d2c2c"/>
          <circle cx="34" cy="46" r="0.8" fill="white"/>
          <ellipse cx="48" cy="46" rx="4" ry="5" fill="white"/>
          <circle cx="49" cy="47" r="2.5" fill="#3d2c2c"/>
          <circle cx="50" cy="46" r="0.8" fill="white"/>
          {/* Blush */}
          <ellipse cx="27" cy="52" rx="5" ry="3" fill="#f9c6d0" opacity="0.8"/>
          <ellipse cx="53" cy="52" rx="5" ry="3" fill="#f9c6d0" opacity="0.8"/>
          {/* Mouth */}
          <path d="M36 57 Q40 61 44 57" stroke="#3d2c2c" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          {/* Arms */}
          <rect x="7"  y="72" width="15" height="30" rx="7" fill="#fcd5b0" stroke="#3d2c2c" strokeWidth="1.5"/>
          <rect x="58" y="72" width="15" height="30" rx="7" fill="#fcd5b0" stroke="#3d2c2c" strokeWidth="1.5"/>
          {/* Legs */}
          <rect x="27" y="120" width="12" height="30" rx="6" fill="#fcd5b0" stroke="#3d2c2c" strokeWidth="1.5"/>
          <rect x="41" y="120" width="12" height="30" rx="6" fill="#fcd5b0" stroke="#3d2c2c" strokeWidth="1.5"/>
          {/* Shoes */}
          <ellipse cx="33" cy="150" rx="9" ry="6" fill="#f9c6d0" stroke="#3d2c2c" strokeWidth="1.5"/>
          <ellipse cx="47" cy="150" rx="9" ry="6" fill="#f9c6d0" stroke="#3d2c2c" strokeWidth="1.5"/>
          {/* Hair bow */}
          <path d="M34 20 Q40 14 46 20 Q40 26 34 20Z" fill="#f9c6d0" stroke="#3d2c2c" strokeWidth="1"/>
          <circle cx="40" cy="20" r="3" fill="#e8899a" stroke="#3d2c2c" strokeWidth="1"/>
        </svg>
      </div>
    </div>
  )
}
