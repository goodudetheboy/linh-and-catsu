import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useScrollEngine } from '../../hooks/useScrollEngine'
import { useRoomScale } from '../../hooks/useRoomScale'
import { ROOM_HEIGHT } from '../../data/constants'
import { ROOMS } from '../../data/rooms'
import { RoomIndicator } from '../ui/RoomIndicator'
import { ZoomSlider } from '../ui/ZoomSlider'
import { Linh } from '../characters/Linh'
import { WelcomeRoom } from './WelcomeRoom'
import { CatRoom } from './CatRoom'
import { TogetherRoom } from './TogetherRoom'

// Linh's natural dimensions on the room canvas at scale 1
const LINH_NATURAL_W = 320
const LINH_NATURAL_H = 560
// Her feet sit at this fraction from the canvas top (aligned to the visual floor junction)
const LINH_FEET_Y_FRAC = 1.1

const MIN_ZOOM = 0.35
const MAX_ZOOM = 2.0

// Coarse-pointer (touch) devices get a zoomed-out default so the whole room fits on screen
const isMobileDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export function RoomWorld() {
  const [editingSuspended, setEditingSuspended] = useState(false)

  // Animated zoom — GSAP tweens between values, driving React state at 60fps
  const initialZoom             = isMobileDevice() ? 0.35 : 0.8
  const [zoom, setZoom]         = useState(initialZoom)
  const animZoomRef             = useRef(initialZoom)
  const zoomTweenRef            = useRef<gsap.core.Tween | null>(null)

  const handleZoomChange = (target: number) => {
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, target))
    zoomTweenRef.current?.kill()
    const proxy = { z: animZoomRef.current }
    zoomTweenRef.current = gsap.to(proxy, {
      z:        clamped,
      duration: 0.4,
      ease:     'power2.out',
      onUpdate: () => {
        animZoomRef.current = proxy.z
        setZoom(proxy.z)
      },
      onComplete: () => {
        animZoomRef.current = clamped
        setZoom(clamped)
      },
    })
  }

  const metrics = useRoomScale(zoom)
  const { slotWidth, vh, scaleFactor, canvasOffsetX, canvasOffsetY, scaledRoomWidth, vw } = metrics
  const { worldRef, roomIndex, linhScreenX } =
    useScrollEngine(ROOMS.length, editingSuspended, zoom)

  const totalWorldWidth = slotWidth * ROOMS.length

  // Linh's screen-space dimensions — scale with the canvas
  const linhW      = LINH_NATURAL_W * scaleFactor
  const linhH      = LINH_NATURAL_H * scaleFactor
  // Her feet Y = canvas top + LINH_FEET_Y_FRAC of canvas height
  const linhFeetY  = canvasOffsetY + LINH_FEET_Y_FRAC * ROOM_HEIGHT * scaleFactor

  /*
   * Linh clip wrapper — a fixed container that exactly covers the canvas's
   * horizontal footprint on screen.  overflow:hidden clips Linh when she
   * walks off the canvas edge into the polka-dot gutter, eliminating the
   * "exits outside the room border" glitch that appears at zoom < 1.
   *
   * Width = min(scaledRoomWidth, vw) so it never exceeds the viewport.
   * Linh's screenX is already viewport-relative; we subtract canvasOffsetX
   * so positions inside the wrapper are canvas-edge-relative.
   */
  const clipLeft  = canvasOffsetX
  const clipWidth = Math.min(scaledRoomWidth, vw - canvasOffsetX)

  return (
    <>
      <div className="fixed inset-0 overflow-hidden">
        <div
          ref={worldRef}
          className="flex"
          style={{ width: totalWorldWidth, height: vh, willChange: 'transform' }}
        >
          <WelcomeRoom zoom={zoom} onEditStateChange={setEditingSuspended} />

          {[1, 2, 3].map((idx) => (
            <CatRoom
              key={ROOMS[idx].id}
              roomIndex={idx}
              zoom={zoom}
              onEditStateChange={setEditingSuspended}
            />
          ))}

          <TogetherRoom zoom={zoom} onEditStateChange={setEditingSuspended} />
        </div>
      </div>

      {/* Clip wrapper — Linh is absolute inside here so overflow:hidden hides her
          the moment she steps past the canvas border */}
      <div
        className="fixed pointer-events-none"
        style={{ left: clipLeft, top: 0, width: clipWidth, height: vh, overflow: 'hidden', zIndex: 20 }}
      >
        <Linh
          screenX={linhScreenX - clipLeft}
          screenY={linhFeetY}
          width={linhW}
          height={linhH}
        />
      </div>

      <RoomIndicator current={roomIndex} />
      <ZoomSlider zoom={zoom} onChange={handleZoomChange} />
    </>
  )
}
