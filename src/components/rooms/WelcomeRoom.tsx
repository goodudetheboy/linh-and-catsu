import { Room } from './Room'
import { Cat } from '../characters/Cat'
import { WashiTape } from '../ui/WashiTape'
import { ROOMS } from '../../data/rooms'
import { CATS } from '../../data/cats'

interface WelcomeRoomProps {
  zoom?: number
  onEditStateChange?: (editing: boolean) => void
}

/* X positions for the three cats on the welcome screen */
const WELCOME_X: Record<string, number> = {
  rua:   28,
  ri:    58,
  bigga: 72,
}

const WELCOME_DELAY: Record<string, string> = {
  rua:   '0.3s',
  ri:    '0.6s',
  bigga: '0.1s',
}

export function WelcomeRoom({ zoom, onEditStateChange }: WelcomeRoomProps) {
  const config = ROOMS[0]

  return (
    <Room config={config} zoom={zoom} onEditStateChange={onEditStateChange}>
      {/* Title card */}
      <div
        className="paper-card px-12 py-6"
        style={{
          position:  'absolute',
          top:       '12%',
          left:      '50%',
          transform: 'translateX(-50%) rotate(-1.5deg)',
          background: 'white',
          boxShadow: '4px 5px 0 rgba(61,44,44,0.13)',
          zIndex: 30,
          whiteSpace: 'nowrap',
        }}
      >
        <WashiTape color="#f9c6d0" width={120} angle={-8} style={{ top: -14, left: 20 }} />
        <WashiTape color="#d5c8f0" width={90}  angle={6}  style={{ top: -12, right: 25 }} />
        <h1
          className="font-bold text-center"
          style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink)', fontSize: 110 }}
        >
          Linh &amp; Catsu 🐱
        </h1>
        <p
          className="text-center"
          style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink-light)', fontSize: 52, marginTop: 6 }}
        >
          Home Sweetsu Home
        </p>
      </div>

      {/* Scroll hint */}
      <div
        className="flex flex-col items-center gap-3 animate-scroll-hint"
        style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}
      >
        <span style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink-light)', fontSize: 36 }}>
          scroll to explore
        </span>
        <div
          className="rounded-full border-4 flex items-center justify-center"
          style={{ width: 52, height: 52, borderColor: 'var(--pink-deep)', color: 'var(--pink-deep)', fontSize: 28 }}
        >
          ↓
        </div>
      </div>

      {/* Cats — sizes/schemes come from CATS data, so one place to edit */}
      {CATS.map((cat) => (
        <Cat
          key={cat.slug}
          colorScheme={cat.colorScheme}
          size={cat.displaySize}
          x={WELCOME_X[cat.slug] ?? 50}
          delay={WELCOME_DELAY[cat.slug] ?? '0s'}
        />
      ))}
    </Room>
  )
}
