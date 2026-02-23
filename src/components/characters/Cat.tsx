/* Placeholder 2D papercraft cat.
   Pass colorScheme to tint per cat. Replace SVG with real art later. */

type ColorScheme = 'orange' | 'grey' | 'tabby'

interface CatProps {
  colorScheme?: ColorScheme
  x?: number       // % of room width
  delay?: string   // animation delay CSS value
  size?: number    // scale multiplier
  className?: string
}

const COLORS: Record<ColorScheme, { body: string; stripe: string; inner: string }> = {
  orange: { body: '#f5c842', stripe: '#e8972a', inner: '#fde8a0' },
  grey:   { body: '#b8b8d4', stripe: '#8888aa', inner: '#ddddf0' },
  tabby:  { body: '#c4956a', stripe: '#8c5e38', inner: '#e8c8a0' },
}

export function Cat({
  colorScheme = 'orange',
  x = 50,
  delay = '0s',
  size = 1,
  className = '',
}: CatProps) {
  const c = COLORS[colorScheme]

  return (
    <div
      className={`absolute bottom-[18%] z-20 pointer-events-none ${className}`}
      style={{
        left: `${x}%`,
        transform: `translateX(-50%) scale(${size})`,
        transformOrigin: 'bottom center',
      }}
    >
      <div
        className="drop-shadow-paper"
        style={{ width: 70, height: 80, animation: `bop-cat 2.8s ease-in-out infinite`, animationDelay: delay }}
      >
        <svg viewBox="0 0 70 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="70" height="80">
          {/* Tail */}
          <path
            d="M58 65 Q80 50 72 35"
            stroke={c.body} strokeWidth="8" strokeLinecap="round" fill="none"
            style={{ animation: `tail-wag 1.2s ease-in-out infinite`, transformOrigin: '58px 65px', animationDelay: delay }}
          />
          {/* Body */}
          <ellipse cx="35" cy="58" rx="22" ry="18" fill={c.body} stroke="#3d2c2c" strokeWidth="1.5"/>
          {/* Belly */}
          <ellipse cx="35" cy="60" rx="12" ry="10" fill={c.inner} opacity="0.8"/>
          {/* Head */}
          <circle cx="35" cy="30" r="20" fill={c.body} stroke="#3d2c2c" strokeWidth="1.5"/>
          {/* Ears */}
          <polygon points="16,16 10,2 24,12" fill={c.body} stroke="#3d2c2c" strokeWidth="1.5"
            style={{ animation: `ear-twitch 3s ease-in-out infinite`, transformOrigin: '16px 16px', animationDelay: delay }}/>
          <polygon points="54,16 60,2 46,12" fill={c.body} stroke="#3d2c2c" strokeWidth="1.5"/>
          {/* Inner ears */}
          <polygon points="17,15 12,5 22,12" fill={c.inner} opacity="0.9"/>
          <polygon points="53,15 58,5 48,12" fill={c.inner} opacity="0.9"/>
          {/* Eyes */}
          <ellipse cx="27" cy="29" rx="5" ry="6" fill="white"/>
          <circle cx="28" cy="30" r="3" fill="#3d2c2c"/>
          <circle cx="29" cy="29" r="1" fill="white"/>
          <ellipse cx="43" cy="29" rx="5" ry="6" fill="white"/>
          <circle cx="44" cy="30" r="3" fill="#3d2c2c"/>
          <circle cx="45" cy="29" r="1" fill="white"/>
          {/* Nose */}
          <path d="M33 36 L35 38 L37 36 Z" fill="#e8899a"/>
          {/* Mouth */}
          <path d="M32 38 Q35 41 38 38" stroke="#3d2c2c" strokeWidth="1" strokeLinecap="round" fill="none"/>
          {/* Whiskers */}
          <line x1="15" y1="34" x2="28" y2="36" stroke="#3d2c2c" strokeWidth="0.8" opacity="0.6"/>
          <line x1="15" y1="37" x2="28" y2="37" stroke="#3d2c2c" strokeWidth="0.8" opacity="0.6"/>
          <line x1="42" y1="36" x2="55" y2="34" stroke="#3d2c2c" strokeWidth="0.8" opacity="0.6"/>
          <line x1="42" y1="37" x2="55" y2="37" stroke="#3d2c2c" strokeWidth="0.8" opacity="0.6"/>
          {/* Stripes */}
          <path d="M25 55 Q35 52 45 55" stroke={c.stripe} strokeWidth="2" fill="none" opacity="0.5"/>
          <path d="M28 61 Q35 58 42 61" stroke={c.stripe} strokeWidth="2" fill="none" opacity="0.5"/>
          {/* Paws */}
          <ellipse cx="22" cy="72" rx="8" ry="5" fill={c.body} stroke="#3d2c2c" strokeWidth="1.2"/>
          <ellipse cx="48" cy="72" rx="8" ry="5" fill={c.body} stroke="#3d2c2c" strokeWidth="1.2"/>
        </svg>
      </div>
    </div>
  )
}
