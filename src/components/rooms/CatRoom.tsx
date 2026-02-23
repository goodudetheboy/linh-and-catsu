import { useState } from 'react'
import { Room } from './Room'
import { Cat } from '../characters/Cat'
import { WashiTape } from '../ui/WashiTape'
import { Lightbox } from '../gallery/Lightbox'
import { ROOMS } from '../../data/rooms'
import { getCatBySlug } from '../../data/cats'
import type { Cat as CatType } from '../../data/cats'

const COLOR_SCHEME_MAP: Record<string, 'orange' | 'grey' | 'tabby'> = {
  rua:   'orange',
  ri:    'grey',
  bigga: 'tabby',
}

interface CatRoomProps {
  roomIndex: number
  onEditStateChange?: (editing: boolean) => void
}

export function CatRoom({ roomIndex, onEditStateChange }: CatRoomProps) {
  const config = ROOMS[roomIndex]
  const cat    = getCatBySlug(config.catSlug ?? '') as CatType | null
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!cat) return null

  const colorScheme = COLOR_SCHEME_MAP[cat.slug] ?? 'orange'

  return (
    <>
      <Room config={config} onEditStateChange={onEditStateChange}>
        {/* Room label */}
        <div
          className="absolute top-[10%] left-[8%] paper-card px-6 py-3 paper-card--tilted-l"
          style={{ zIndex: 30, boxShadow: '3px 4px 0 rgba(61,44,44,0.12)' }}
        >
          <WashiTape color={config.accentColor} width={80} angle={-6} style={{ top: -11, left: 10 }} />
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink)' }}
          >
            {config.label} 🐾
          </h2>
          <p
            className="text-sm mt-0.5"
            style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink-light)' }}
          >
            {cat.ageYears} years old · {cat.colorDesc}
          </p>
        </div>

        {/* Open gallery button (always accessible in view mode) */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-[10%] right-[8%] paper-card paper-card--tilted-r px-5 py-3 transition-all hover:scale-105 active:scale-95"
          style={{
            zIndex: 30,
            boxShadow: '3px 4px 0 rgba(61,44,44,0.12)',
            fontFamily: 'var(--font-hand)',
            color: 'var(--ink)',
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          📷 Photos
        </button>

        <Cat colorScheme={colorScheme} x={62} delay="0s" size={1.3} />
      </Room>

      {lightboxOpen && cat && (
        <Lightbox
          catSlug={cat.slug}
          catName={cat.name}
          accentColor={config.accentColor}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
