import { useState, useCallback } from 'react'
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

  const openAlbum = useCallback(() => {
    if (cat) {
      const audio = new Audio(`/assets/sound/${cat.slug}-meow.mp3`)
      audio.volume = 0.6
      audio.play().catch(() => {})
    }
    setLightboxOpen(true)
  }, [cat])

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

        {/* Pet-prompt sticky note — right side, opposite the room label */}
        <div
          className="animate-float"
          style={{ position: 'absolute', top: '10%', right: '6%', zIndex: 30, animationDelay: '0.4s' }}
        >
          <div style={{ transform: 'rotate(3deg)' }}>
            {/* Tack pin */}
            <div style={{
              position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
              width: 16, height: 16, borderRadius: '50%',
              background: config.accentColor,
              boxShadow: '0 2px 0 rgba(61,44,44,0.22)',
            }} />
            <div
              className="paper-card"
              style={{ background: '#fffbe8', boxShadow: '2px 3px 0 rgba(61,44,44,0.12)', whiteSpace: 'nowrap', padding: '16px 48px' }}
            >
              <p style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink-light)', fontSize: 36, textAlign: 'center', lineHeight: 1.3 }}>
                psst...
              </p>
              <p style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink)', fontSize: 42, fontWeight: 700, textAlign: 'center', marginTop: 2 }}>
                try petting {cat.name}!
              </p>
            </div>
          </div>
        </div>

        {/* Click the cat to open their album */}
        <Cat
          colorScheme={cat.colorScheme}
          size={cat.displaySize}
          x={55}
          y={-10}
          delay="0s"
          flipX={cat.slug === 'ri' || cat.slug === 'bigga'}
          wander
          wanderMin={20}
          wanderMax={80}
          wanderSpeed={3}
          onClick={openAlbum}
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
