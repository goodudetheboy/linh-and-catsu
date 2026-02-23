import { useState } from 'react'
import { Room } from './Room'
import { Cat } from '../characters/Cat'
import { WashiTape } from '../ui/WashiTape'
import { ROOMS } from '../../data/rooms'
import { CATS } from '../../data/cats'

interface WelcomeRoomProps {
  zoom?: number
  onEditStateChange?: (editing: boolean) => void
}

/* Per-cat positions on the welcome screen — edit these to move cats individually */
const WELCOME_X: Record<string, number> = {
  rua:   28,
  ri:    58,
  bigga: 72,
}

// y = % from room bottom; -10 aligns cat feet with the visual floor (same level as Linh)
const WELCOME_Y: Record<string, number> = {
  rua:   -10,
  ri:    -10,
  bigga: -10,
}

const WELCOME_DELAY: Record<string, string> = {
  rua:   '0.3s',
  ri:    '0.6s',
  bigga: '0.1s',
}

// Horizontal wander bounds per cat so they stay in their own zone
const WELCOME_WANDER_MIN: Record<string, number> = {
  rua:   13,
  ri:    45,
  bigga: 60,
}
const WELCOME_WANDER_MAX: Record<string, number> = {
  rua:   43,
  ri:    70,
  bigga: 88,
}
const WELCOME_WANDER_SPEED: Record<string, number> = {
  rua:   3.5,
  ri:    2.8,
  bigga: 3.2,
}

export function WelcomeRoom({ zoom, onEditStateChange }: WelcomeRoomProps) {
  const config = ROOMS[0]
  // Lazy-init so it reads window once on mount (no SSR concern — pure Vite SPA)
  const [isMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  )

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

      {/* Wall-pinned navigation hint — adapts to desktop (scroll ↓) vs mobile (swipe ←) */}
      <div
        className="animate-float"
        style={{
          position:  'absolute',
          right:     '6%',
          top:       '52%',
          zIndex:    30,
          transform: 'rotate(3deg)',
        }}
      >
        {/* Tack pin */}
        <div style={{
          position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
          width: 18, height: 18, borderRadius: '50%',
          background: 'var(--pink-deep)',
          boxShadow: '0 2px 0 rgba(61,44,44,0.25)',
        }} />
        <div
          className="paper-card px-8 py-5"
          style={{
            background: '#fffbe8',
            boxShadow: '2px 3px 0 rgba(61,44,44,0.12)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink-light)', fontSize: 38, lineHeight: 1.3, textAlign: 'center' }}>
            {isMobile ? 'swipe left' : 'scroll down'}
          </p>
          <p style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink)', fontSize: 44, fontWeight: 700, textAlign: 'center', marginTop: 4 }}>
            {isMobile ? 'to explore →' : 'to explore ↓'}
          </p>
        </div>
      </div>

      {/* Cats — sizes/schemes come from CATS data, so one place to edit */}
      {CATS.map((cat) => (
        <Cat
          key={cat.slug}
          colorScheme={cat.colorScheme}
          size={cat.displaySize}
          x={WELCOME_X[cat.slug] ?? 50}
          y={WELCOME_Y[cat.slug] ?? -10}
          delay={WELCOME_DELAY[cat.slug] ?? '0s'}
          wander
          wanderMin={WELCOME_WANDER_MIN[cat.slug]}
          wanderMax={WELCOME_WANDER_MAX[cat.slug]}
          wanderSpeed={WELCOME_WANDER_SPEED[cat.slug]}
        />
      ))}
    </Room>
  )
}
