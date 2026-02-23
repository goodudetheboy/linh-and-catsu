/* Real-art cat character — uses the sticker PNG for each cat.
   Pass onClick to make the cat interactive (opens photo album).
   Pass wander to make the cat walk back and forth in the room. */

import { useState, useRef, useEffect } from 'react'

type ColorScheme = 'orange' | 'grey' | 'tabby'

const IMAGE_SRC: Record<ColorScheme, string> = {
  orange: '/assets/characters/rua.png',
  grey:   '/assets/characters/ri.png',
  tabby:  '/assets/characters/bigga.png',
}

interface CatProps {
  colorScheme?:  ColorScheme
  x?:            number       // % of room width (center anchor)
  y?:            number       // % from room bottom (negative = below canvas edge, clipped to floor)
  delay?:        string       // bop animation delay
  size?:         number       // scale multiplier
  className?:    string
  onClick?:      () => void   // makes the cat clickable
  flipX?:        boolean      // start facing left instead of right
  wander?:       boolean      // enable horizontal wandering
  wanderMin?:    number       // left bound, % of room width
  wanderMax?:    number       // right bound, % of room width
  wanderSpeed?:  number       // %/second
}

export function Cat({
  colorScheme  = 'orange',
  x            = 50,
  y            = -10,
  delay        = '0s',
  size         = 1,
  className    = '',
  onClick,
  flipX        = false,
  wander       = false,
  wanderMin,
  wanderMax,
  wanderSpeed  = 3,
}: CatProps) {
  const src  = IMAGE_SRC[colorScheme]
  const minX = wanderMin ?? Math.max(5,  x - 15)
  const maxX = wanderMax ?? Math.min(95, x + 15)

  // Wander state — refs drive the rAF loop, state drives React render
  const dirRef      = useRef(flipX ? -1 : 1)     // 1 = right, -1 = left
  const posRef      = useRef(x)
  const lastTimeRef = useRef<number | null>(null)

  const [catX,       setCatX]       = useState(x)
  const [facingLeft, setFacingLeft] = useState(flipX)

  useEffect(() => {
    if (!wander) return

    let animId: number

    const tick = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time
      // Cap dt so a tab-switch / freeze doesn't cause a huge jump
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = time

      posRef.current += dirRef.current * wanderSpeed * dt

      if (posRef.current >= maxX) {
        posRef.current = maxX
        dirRef.current = -1
        setFacingLeft(true)
      } else if (posRef.current <= minX) {
        posRef.current = minX
        dirRef.current = 1
        setFacingLeft(false)
      }

      setCatX(posRef.current)
      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [wander, minX, maxX, wanderSpeed])

  const displayX = wander ? catX : x

  return (
    <div
      className={`absolute z-20 ${className}`}
      style={{
        left:            `${displayX}%`,
        bottom:          `${y}%`,
        transform:       `translateX(-50%) scale(${size})`,
        transformOrigin: 'bottom center',
        pointerEvents:   onClick ? 'auto' : 'none',
        cursor:          onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
      title={onClick ? 'See photos 📷' : undefined}
    >
      {/*
        Flip wrapper: applies scaleX(-1) when walking left.
        This is kept separate from the bop-cat animation div because
        the bop-cat keyframes explicitly set scaleX(1) and would
        override an inline transform on the same element.
      */}
      <div style={{ transformOrigin: 'center bottom', transform: facingLeft ? 'scaleX(-1)' : undefined }}>
        <div
          style={{
            width:          440,
            height:         440,
            animation:      `bop-cat 2.8s ease-in-out infinite`,
            animationDelay: delay,
            filter:         'drop-shadow(2px 4px 0 rgba(61,44,44,0.18))',
          }}
        >
          <img
            src={src}
            alt={colorScheme}
            draggable={false}
            style={{
              width:      '100%',
              height:     '100%',
              objectFit:  'contain',
              transition: 'transform 0.18s ease',
            }}
            onMouseEnter={(e) => {
              if (onClick) (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.08)'
            }}
            onMouseLeave={(e) => {
              if (onClick) (e.currentTarget as HTMLImageElement).style.transform = ''
            }}
          />
        </div>
      </div>
    </div>
  )
}
