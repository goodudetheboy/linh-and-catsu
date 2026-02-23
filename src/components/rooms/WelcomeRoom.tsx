import { Room } from './Room'
import { Cat } from '../characters/Cat'
import { WashiTape } from '../ui/WashiTape'
import { ROOMS } from '../../data/rooms'

interface WelcomeRoomProps {
  onEditStateChange?: (editing: boolean) => void
}

export function WelcomeRoom({ onEditStateChange }: WelcomeRoomProps) {
  const config = ROOMS[0]

  return (
    <Room config={config} onEditStateChange={onEditStateChange}>
      {/* Title card */}
      <div
        className="absolute top-[12%] left-1/2 -translate-x-1/2 paper-card px-10 py-5 paper-card--tilted-l"
        style={{
          background: 'white',
          boxShadow: '4px 5px 0 rgba(61,44,44,0.13)',
          zIndex: 30,
        }}
      >
        <WashiTape color="#f9c6d0" width={90}  angle={-8} style={{ top: -12, left: 15 }} />
        <WashiTape color="#d5c8f0" width={70}  angle={6}  style={{ top: -10, right: 20 }} />
        <h1
          className="text-5xl font-bold text-center whitespace-nowrap"
          style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink)' }}
        >
          Linh &amp; Catsu 🐱
        </h1>
        <p
          className="text-center text-lg mt-1"
          style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink-light)' }}
        >
          a little home for three very good cats
        </p>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-scroll-hint"
        style={{ zIndex: 30 }}
      >
        <span style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink-light)', fontSize: 14 }}>
          scroll to explore
        </span>
        <div
          className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: 'var(--pink-deep)', color: 'var(--pink-deep)' }}
        >
          ↓
        </div>
      </div>

      {/* Cats */}
      <Cat colorScheme="orange" x={28} delay="0.3s" />
      <Cat colorScheme="grey"   x={58} delay="0.6s" />
      <Cat colorScheme="tabby"  x={72} delay="0.1s" />
    </Room>
  )
}
