import { ROOMS } from '../../data/rooms'

interface RoomIndicatorProps {
  current: number
}

export function RoomIndicator({ current }: RoomIndicatorProps) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50 pointer-events-none"
      style={{ fontFamily: 'var(--font-hand)' }}
    >
      {ROOMS.map((room, i) => (
        <div key={room.id} className="flex flex-col items-center gap-1">
          <div
            className="transition-all duration-500 rounded-full border-2"
            style={{
              width:  i === current ? 14 : 8,
              height: i === current ? 14 : 8,
              backgroundColor: i === current ? 'var(--pink-deep)' : 'rgba(255,255,255,0.6)',
              borderColor: i === current ? 'var(--pink-deep)' : 'rgba(61,44,44,0.25)',
              boxShadow: i === current ? '0 2px 6px rgba(232,137,154,0.5)' : 'none',
            }}
          />
        </div>
      ))}
    </div>
  )
}
