import { useState, useEffect } from 'react'
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
  isActive?: boolean
}

export function CatRoom({ roomIndex, zoom, onEditStateChange, isActive = false }: CatRoomProps) {
  const config = ROOMS[roomIndex]
  const cat    = getCatBySlug(config.catSlug ?? '') as CatType | null
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Meow once on entry, then randomly every 10–20 s while the room is visible
  useEffect(() => {
    if (!isActive || !cat) return

    const audio = new Audio(`/assets/sound/${cat.slug}-meow.mp3`)
    audio.volume = 0.6

    let timerId: ReturnType<typeof setTimeout>

    const scheduleNext = () => {
      const delay = (10 + Math.random() * 10) * 1000   // 10–20 s
      timerId = setTimeout(() => {
        audio.currentTime = 0
        audio.play().catch(() => {})
        scheduleNext()
      }, delay)
    }

    // Play immediately on room entry, then keep scheduling
    audio.play().catch(() => {})
    scheduleNext()

    return () => {
      clearTimeout(timerId)
      audio.pause()
      audio.src = ''
    }
  }, [isActive, cat?.slug])

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
          y={-10}
          delay="0s"
          wander
          wanderMin={20}
          wanderMax={80}
          wanderSpeed={3}
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
