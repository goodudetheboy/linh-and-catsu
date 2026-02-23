import { Room } from './Room'
import { Cat } from '../characters/Cat'
import { WashiTape } from '../ui/WashiTape'
import { ROOMS } from '../../data/rooms'

interface TogetherRoomProps {
  onEditStateChange?: (editing: boolean) => void
}

export function TogetherRoom({ onEditStateChange }: TogetherRoomProps) {
  const config = ROOMS[4]

  return (
    <Room config={config} onEditStateChange={onEditStateChange}>
      {/* Title card */}
      <div
        className="absolute top-[12%] left-1/2 -translate-x-1/2 paper-card px-10 py-5 paper-card--tilted-r"
        style={{ boxShadow: '4px 5px 0 rgba(61,44,44,0.13)', zIndex: 30 }}
      >
        <WashiTape color={config.accentColor} width={90} angle={-5} style={{ top: -12, left: 20 }} />
        <h2
          className="text-4xl font-bold text-center"
          style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink)' }}
        >
          All together 🌸
        </h2>
        <p
          className="text-center text-lg mt-1"
          style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink-light)' }}
        >
          Linh, Rua, RI &amp; Bigga
        </p>
      </div>

      <Cat colorScheme="orange" x={30} delay="0s"   />
      <Cat colorScheme="grey"   x={60} delay="0.4s" />
      <Cat colorScheme="tabby"  x={74} delay="0.2s" />
    </Room>
  )
}
