import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  LINH_CENTER_PX,
  LINH_LEFT_PX,
  LINH_RIGHT_PX,
  LINH_OFF_L_PX,
  LINH_OFF_R_PX,
} from '../data/constants'
import { getRoomMetrics } from './useRoomScale'

export const SCROLL_PER_ROOM = 1400

function getCameraX(linhPx: number, zoom: number): number {
  const m = getRoomMetrics(zoom)
  if (!m.needsCamera) return 0
  const linhScreenX = linhPx * m.scaleFactor
  return Math.max(0, Math.min(m.scaledRoomWidth - m.vw, linhScreenX - m.vw / 2))
}

export function useScrollEngine(totalRooms: number, suspended: boolean, userZoom: number) {
  const worldRef = useRef<HTMLDivElement>(null)

  const [roomIndex, setRoomIndex]   = useState(0)
  const [linhScreenX, setLinhScreenX] = useState(() => {
    const m = getRoomMetrics(userZoom)
    return m.canvasOffsetX + LINH_CENTER_PX * m.scaleFactor
  })

  const currentRoomRef = useRef(0)
  const roomScrollRef  = useRef(SCROLL_PER_ROOM / 2)
  const transitioning  = useRef(false)
  const linhPxRef      = useRef(LINH_CENTER_PX)
  const zoomRef        = useRef(userZoom)

  // Keep zoom ref fresh without re-running main effect
  useEffect(() => { zoomRef.current = userZoom }, [userZoom])

  // Stable applyPositions stored in a ref so other effects can call it
  const applyRef = useRef<(room: number, linhPx: number, zoom?: number) => void>(() => {})

  useEffect(() => {
    if (suspended) return

    const applyPositions = (room: number, linhPx: number, zoom = zoomRef.current) => {
      const m       = getRoomMetrics(zoom)
      const cameraX = getCameraX(linhPx, zoom)
      const worldX  = -(room * m.slotWidth + cameraX)
      gsap.set(worldRef.current, { x: worldX })
      const screenX = m.canvasOffsetX + linhPx * m.scaleFactor - cameraX
      linhPxRef.current = linhPx
      setLinhScreenX(screenX)
    }

    applyRef.current = applyPositions

    const makeLinhTween = (from: number, to: number, duration: number, ease: string) => {
      const proxy = { v: from }
      return gsap.to(proxy, {
        v: to, duration, ease,
        onUpdate: () => applyPositions(currentRoomRef.current, proxy.v),
      })
    }

    const triggerTransition = (direction: 1 | -1) => {
      if (transitioning.current) return
      const targetRoom = currentRoomRef.current + direction
      if (targetRoom < 0 || targetRoom >= totalRooms) return

      transitioning.current = true

      const exitPx    = direction ===  1 ? LINH_RIGHT_PX : LINH_LEFT_PX
      const exitOffPx = direction ===  1 ? LINH_OFF_R_PX : LINH_OFF_L_PX
      const enterOff  = direction ===  1 ? LINH_OFF_L_PX : LINH_OFF_R_PX
      const enterLand = direction ===  1 ? LINH_LEFT_PX  : LINH_RIGHT_PX
      const enterScroll=direction ===  1 ? 0             : SCROLL_PER_ROOM

      const tl = gsap.timeline({
        onComplete: () => {
          currentRoomRef.current = targetRoom
          setRoomIndex(targetRoom)
          roomScrollRef.current = enterScroll
          applyPositions(targetRoom, enterOff)
          makeLinhTween(enterOff, enterLand, 0.45, 'power2.out')
            .then(() => { transitioning.current = false })
        },
      })

      tl.add(makeLinhTween(linhPxRef.current, exitPx,    0.2,  'power1.in'))
      tl.add(makeLinhTween(exitPx,            exitOffPx, 0.28, 'power2.in'))
      tl.add(
        gsap.to(worldRef.current, {
          x: () => -(targetRoom * getRoomMetrics(zoomRef.current).slotWidth),
          duration: 0.65,
          ease: 'power3.inOut',
        }),
        '-=0.18',
      )
    }

    const moveFromDelta = (dy: number) => {
      if (transitioning.current) return
      roomScrollRef.current = Math.max(0, Math.min(SCROLL_PER_ROOM, roomScrollRef.current + dy))
      const progress = roomScrollRef.current / SCROLL_PER_ROOM
      if (progress >= 1) { triggerTransition(1);  return }
      if (progress <= 0) { triggerTransition(-1); return }
      const linhPx = LINH_LEFT_PX + progress * (LINH_RIGHT_PX - LINH_LEFT_PX)
      applyPositions(currentRoomRef.current, linhPx)
    }

    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-furniture-panel]')) return
      e.preventDefault()
      moveFromDelta(e.deltaY * 0.85)
    }

    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault()
      const dy = (touchStartY - e.touches[0].clientY) * 1.5
      touchStartY = e.touches[0].clientY
      moveFromDelta(dy)
    }

    const onResize = () => applyPositions(currentRoomRef.current, linhPxRef.current)

    applyPositions(currentRoomRef.current, linhPxRef.current)

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })
    window.addEventListener('resize',     onResize)

    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      window.removeEventListener('resize',     onResize)
    }
  }, [totalRooms, suspended])

  // When zoom changes, reapply positions so camera and world X update immediately
  useEffect(() => {
    zoomRef.current = userZoom
    applyRef.current?.(currentRoomRef.current, linhPxRef.current, userZoom)
  }, [userZoom])

  return { worldRef, roomIndex, linhScreenX }
}
