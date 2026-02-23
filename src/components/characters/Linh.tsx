/* Linh character — fixed overlay, fully driven by canvas metrics.
   Uses the real sticker art (linh.png). */

interface LinhProps {
  screenX:  number  // px from left viewport edge (her horizontal center)
  screenY:  number  // px from top viewport edge (her FEET — bottom of sprite)
  width:    number  // px
  height:   number  // px
}

export function Linh({ screenX, screenY, width, height }: LinhProps) {
  return (
    <div
      className="fixed z-20 pointer-events-none"
      style={{
        left:       screenX,
        top:        screenY - height,
        width,
        height,
        transform:  'translateX(-50%)',
        transition: 'none',
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
