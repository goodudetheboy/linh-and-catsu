import { useState } from 'react'
import { useRoomScale } from '../../hooks/useRoomScale'

const MIN_ZOOM = 0.35
const MAX_ZOOM = 2.0
const DEFAULT_ZOOM = 1.0

// Tab width in px — this is how much peeks out from the left edge when closed
const TAB_W = 32

interface ZoomSliderProps {
  zoom:     number
  onChange: (zoom: number) => void
}

function MagnifyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="4.25" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9 2.5L4.5 7L9 11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <line x1="6" y1="2" x2="6" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function ZoomSlider({ zoom, onChange }: ZoomSliderProps) {
  const [open, setOpen] = useState(false)
  const { needsCamera } = useRoomScale(zoom)
  const percent = Math.round(zoom * 100)

  return (
    /*
     * The whole strip (panel + tab) lives at left:0.
     * Closed → slideX(calc(-100% + TAB_W px)) so only the tab peeks out.
     * Open  → translateX(0) so the panel is fully visible.
     */
    <div
      className="fixed bottom-6 left-0 z-50 flex items-end"
      style={{
        fontFamily: 'var(--font-hand)',
        transform: open
          ? 'translateX(0)'
          : `translateX(calc(-100% + ${TAB_W}px))`,
        transition: 'transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* ── Panel ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 pl-2">
        {/* Camera mode badge */}
        <div
          className="text-center text-xs px-3 py-1 rounded-full"
          style={{
            background: needsCamera ? 'var(--lavender)' : 'var(--mint)',
            color: 'var(--ink)',
            boxShadow: 'var(--shadow-paper)',
            transform: 'rotate(-1deg)',
          }}
        >
          {needsCamera ? 'Following Linh' : 'Full room view'}
        </div>

        {/* Slider card */}
        <div
          className="paper-card px-3 py-3 flex flex-col items-center gap-2"
          style={{
            borderRadius: 16,
            transform: 'rotate(0.8deg)',
            minWidth: 144,
          }}
        >
          <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>
            {percent}%
          </span>

          <div className="flex items-center gap-2 w-full">
            <button
              onClick={() => onChange(Math.max(MIN_ZOOM, zoom - 0.1))}
              className="flex items-center justify-center w-6 h-6 rounded-full transition-transform active:scale-90 select-none"
              style={{ background: 'var(--cream)', color: 'var(--ink-light)', boxShadow: 'var(--shadow-paper)' }}
              title="Zoom out"
            >
              <MinusIcon />
            </button>

            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              value={zoom}
              onChange={(e) => onChange(Number(e.target.value))}
              className="flex-1"
              style={{ accentColor: 'var(--pink-deep)', cursor: 'pointer' }}
            />

            <button
              onClick={() => onChange(Math.min(MAX_ZOOM, zoom + 0.1))}
              className="flex items-center justify-center w-6 h-6 rounded-full transition-transform active:scale-90 select-none"
              style={{ background: 'var(--cream)', color: 'var(--ink-light)', boxShadow: 'var(--shadow-paper)' }}
              title="Zoom in"
            >
              <PlusIcon />
            </button>
          </div>

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

      {/* ── Toggle tab ──────────────────────────────────────────────── */}
      {/*
       * Rounded on the right only — looks like a drawer tab emerging from the left wall.
       * Sits flush after the panel so together they slide as one strip.
       */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center transition-transform active:scale-95 select-none"
        style={{
          width: TAB_W,
          height: 54,
          background: 'white',
          borderRadius: '0 12px 12px 0',
          boxShadow: '2px 3px 0 rgba(61,44,44,0.12)',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--ink-light)',
          flexShrink: 0,
          marginBottom: 0,
        }}
        title={open ? 'Hide zoom controls' : 'Zoom controls'}
      >
        {open ? <ChevronLeftIcon /> : <MagnifyIcon />}
      </button>
    </div>
  )
}
