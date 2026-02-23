/* Linh character — rendered inside the canvas clip wrapper in RoomWorld.
   All coordinates are relative to the clip wrapper (top-left = canvas left edge). */

interface LinhProps {
  screenX:  number  // px from clip-wrapper left edge (her horizontal center)
  screenY:  number  // px from viewport top (her FEET — bottom of sprite)
  width:    number  // px
  height:   number  // px
}

export function Linh({ screenX, screenY, width, height }: LinhProps) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left:       screenX,
        top:        screenY - height,
        width,
        height,
        transform:  'translateX(-50%)',
        transition: 'none',
        zIndex:     20,
      }}
    >
      <div
        className="animate-bop"
        style={{
          width:    '100%',
          height:   '100%',
          filter:   'drop-shadow(2px 4px 0 rgba(61,44,44,0.18))',
        }}
      >
        <img
          src="/assets/characters/linh.png"
          alt="Linh"
          draggable={false}
          style={{
            width:     '100%',
            height:    '100%',
            objectFit: 'contain',
            objectPosition: 'bottom',
          }}
        />
      </div>
    </div>
  )
}
