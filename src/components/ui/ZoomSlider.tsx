import { useRoomScale } from '../../hooks/useRoomScale'

const MIN_ZOOM = 0.35
const MAX_ZOOM = 2.0
const DEFAULT_ZOOM = 1.0

interface ZoomSliderProps {
  zoom:     number
  onChange: (zoom: number) => void
}

export function ZoomSlider({ zoom, onChange }: ZoomSliderProps) {
  const { needsCamera } = useRoomScale(zoom)

  const percent = Math.round(zoom * 100)

  return (
    <div
      className="fixed bottom-6 left-5 z-50 flex flex-col gap-2"
      style={{ fontFamily: 'var(--font-hand)' }}
    >
      {/* Camera mode badge */}
      <div
        className="text-center text-xs px-3 py-1 rounded-full transition-all duration-300"
        style={{
          background: needsCamera ? 'var(--lavender)' : 'var(--mint)',
          color: 'var(--ink)',
          boxShadow: 'var(--shadow-paper)',
          transform: 'rotate(-1deg)',
        }}
      >
        {needsCamera ? '🎯 Following Linh' : '🏠 Full room view'}
      </div>

      {/* Slider card */}
      <div
        className="paper-card px-3 py-3 flex flex-col items-center gap-2"
        style={{
          borderRadius: 16,
          transform: 'rotate(0.8deg)',
          minWidth: 140,
        }}
      >
        {/* Zoom % label */}
        <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>
          {percent}%
        </span>

        {/* Slider + icons row */}
        <div className="flex items-center gap-2 w-full">
          {/* Zoom out */}
          <button
            onClick={() => onChange(Math.max(MIN_ZOOM, zoom - 0.1))}
            className="text-lg leading-none transition-transform active:scale-90 select-none"
            style={{ color: 'var(--ink-light)' }}
            title="Zoom out"
          >
            🔍
          </button>

          {/* Range input */}
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1"
            style={{
              accentColor: 'var(--pink-deep)',
              cursor: 'pointer',
            }}
          />

          {/* Zoom in */}
          <button
            onClick={() => onChange(Math.min(MAX_ZOOM, zoom + 0.1))}
            className="text-lg leading-none transition-transform active:scale-90 select-none"
            style={{ color: 'var(--ink-light)' }}
            title="Zoom in"
          >
            🔍
          </button>
        </div>

        {/* Reset to default */}
        {Math.abs(zoom - DEFAULT_ZOOM) > 0.05 && (
          <button
            onClick={() => onChange(DEFAULT_ZOOM)}
            className="text-xs px-2 py-0.5 rounded-full transition-all active:scale-95"
            style={{
              background: 'var(--yellow)',
              color: 'var(--ink)',
              boxShadow: '0 2px 0 var(--yellow-deep)',
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
