/* Real-art cat character — uses the sticker PNG for each cat.
   The outer positioning wrapper is unchanged so existing callers still work.
   Pass onClick to make the cat interactive (opens photo album). */

type ColorScheme = 'orange' | 'grey' | 'tabby'

const IMAGE_SRC: Record<ColorScheme, string> = {
  orange: '/assets/characters/rua.png',
  grey:   '/assets/characters/ri.png',
  tabby:  '/assets/characters/bigga.png',
}

interface CatProps {
  colorScheme?: ColorScheme
  x?:          number       // % of room width
  delay?:      string       // animation delay CSS value
  size?:       number       // scale multiplier
  className?:  string
  onClick?:    () => void   // if provided, cat is clickable
}

export function Cat({
  colorScheme = 'orange',
  x = 50,
  delay = '0s',
  size = 1,
  className = '',
  onClick,
}: CatProps) {
  const src = IMAGE_SRC[colorScheme]

  return (
    <div
      className={`absolute bottom-[18%] z-20 ${className}`}
      style={{
        left:            `${x}%`,
        transform:       `translateX(-50%) scale(${size})`,
        transformOrigin: 'bottom center',
        pointerEvents:   onClick ? 'auto' : 'none',
        cursor:          onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
      title={onClick ? 'See photos 📷' : undefined}
    >
      <div
        style={{
      width:          440,
        height:         440,
          animation:      `bop-cat 2.8s ease-in-out infinite`,
          animationDelay: delay,
          /* Sticker drop-shadow matching the art style */
          filter:         'drop-shadow(2px 4px 0 rgba(61,44,44,0.18))',
        }}
      >
        <img
          src={src}
          alt={colorScheme}
          draggable={false}
          style={{
            width:     '100%',
            height:    '100%',
            objectFit: 'contain',
            /* Scale up a bit when hoverable to hint it's interactive */
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
  )
}
