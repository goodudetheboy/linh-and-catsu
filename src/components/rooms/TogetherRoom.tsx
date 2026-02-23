import { Room } from './Room'
import { Cat } from '../characters/Cat'
import { WashiTape } from '../ui/WashiTape'
import { ROOMS } from '../../data/rooms'
import { CATS } from '../../data/cats'

interface TogetherRoomProps {
  zoom?: number
  onEditStateChange?: (editing: boolean) => void
}

// Look up display sizes from the single source of truth
const catBySlug = Object.fromEntries(CATS.map((c) => [c.slug, c]))

export function TogetherRoom({ zoom, onEditStateChange }: TogetherRoomProps) {
  const config = ROOMS[4]

  return (
    <Room config={config} zoom={zoom} onEditStateChange={onEditStateChange}>
      {/* Title card */}
      <div
        className="paper-card"
        style={{
          position:   'absolute',
          top:        '12%',
          left:       '50%',
          transform:  'translateX(-50%) rotate(1deg)',
          zIndex:     30,
          whiteSpace: 'nowrap',
          boxShadow:  '4px 5px 0 rgba(61,44,44,0.13)',
          padding:    '20px 48px',
        }}
      >
        <WashiTape color={config.accentColor} width={90} angle={-5} style={{ top: -12, left: 20 }} />
        <h2
          className="font-bold text-center"
          style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink)', fontSize: 96 }}
        >
          All together 🌸
        </h2>
        <p
          className="text-center"
          style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink-light)', fontSize: 48, marginTop: 6 }}
        >
          Linh, Rua, Ri &amp; Bigga (&amp; Stink?)
        </p>
      </div>

      {/* Cats closer together around the group */}
      <Cat colorScheme="orange" size={catBySlug['rua']?.displaySize ?? 1}   x={20} y={-10} delay="0s"   />
      <Cat colorScheme="grey"   size={catBySlug['ri']?.displaySize  ?? 1}   x={34} y={-10} delay="0.4s" flipX />
      <Cat colorScheme="tabby"  size={catBySlug['bigga']?.displaySize ?? 1} x={74} y={-10} delay="0.2s" flipX />

      {/*
        Vuong — closer to centre at x=56%.
        Linh at mid-scroll (~50%) stands just to his left.
      */}
      <div
        className="absolute z-20"
        style={{
          left:            '56%',
          bottom:          '-10%',
          transform:       'translateX(-50%)',
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="animate-bop"
          style={{
            width:  300,
            height: 560,
            filter: 'drop-shadow(2px 4px 0 rgba(61,44,44,0.18))',
          }}
        >
          <img
            src="/assets/characters/vuong.png"
            alt="Vuong"
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom' }}
          />
        </div>
      </div>
    </Room>
  )
}
