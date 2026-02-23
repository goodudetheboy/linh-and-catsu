import { useState } from 'react'
import { Room } from './Room'
import { Cat } from '../characters/Cat'
import { WashiTape } from '../ui/WashiTape'
import { Lightbox } from '../gallery/Lightbox'
import { ROOMS } from '../../data/rooms'
import { getCatBySlug } from '../../data/cats'
import type { Cat as CatType } from '../../data/cats'

interface CatRoomProps {
  roomIndex: number
  zoom?: number
  onEditStateChange?: (editing: boolean) => void
}

export function CatRoom({ roomIndex, zoom, onEditStateChange }: CatRoomProps) {
  const config = ROOMS[roomIndex]
  const cat    = getCatBySlug(config.catSlug ?? '') as CatType | null
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!cat) return null

  return (
    <>
      <Room config={config} zoom={zoom} onEditStateChange={onEditStateChange}>
        {/* Room label */}
        <div
          className="paper-card paper-card--tilted-l px-8 py-4"
          style={{
            position: 'absolute',
            top: '10%',
            left: '8%',
            zIndex: 30,
            boxShadow: '3px 4px 0 rgba(61,44,44,0.12)',
          }}
        >
          <WashiTape color={config.accentColor} width={90} angle={-6} style={{ top: -11, left: 10 }} />
          <h2
            className="font-bold"
            style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink)', fontSize: 96 }}
          >
            {config.label} 🐾
          </h2>
          <p
            className="mt-2"
            style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink-light)', fontSize: 48 }}
          >
            {cat.ageYears} years old · {cat.colorDesc}
          </p>
        </div>

        {/* Click the cat to open their album */}
        <Cat
          colorScheme={cat.colorScheme}
          size={cat.displaySize}
          x={55}
          delay="0s"
          onClick={() => setLightboxOpen(true)}
        />
      </Room>

      {lightboxOpen && (
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
