import { useEffect, useState } from 'react'
import { ROOM_HEIGHT, ROOM_WIDTH } from '../data/constants'

export interface RoomMetrics {
  scaleFactor:      number  // (vh / ROOM_HEIGHT) * userZoom
  scaledRoomWidth:  number  // ROOM_WIDTH  * scaleFactor
  scaledRoomHeight: number  // ROOM_HEIGHT * scaleFactor
  needsCamera:      boolean // scaledRoomWidth > vw → camera follows Linh
  slotWidth:        number  // max(scaledRoomWidth, vw)
  canvasOffsetX:    number  // px: horizontal center in slot when !needsCamera
  canvasOffsetY:    number  // px: vertical  center in slot when canvas < vh
  vw:               number
  vh:               number
}

function compute(userZoom = 1): RoomMetrics {
  const vw               = window.innerWidth
  const vh               = window.innerHeight
  const scaleFactor      = (vh / ROOM_HEIGHT) * userZoom
  const scaledRoomWidth  = ROOM_WIDTH  * scaleFactor
  const scaledRoomHeight = ROOM_HEIGHT * scaleFactor
  const needsCamera      = scaledRoomWidth > vw
  const slotWidth        = needsCamera ? scaledRoomWidth : vw
  const canvasOffsetX    = needsCamera ? 0 : (vw  - scaledRoomWidth)  / 2
  const canvasOffsetY    = Math.max(0,         (vh  - scaledRoomHeight) / 2)
  return {
    scaleFactor, scaledRoomWidth, scaledRoomHeight,
    needsCamera, slotWidth, canvasOffsetX, canvasOffsetY, vw, vh,
  }
}

/** Reactive — recalculates on resize or zoom change */
export function useRoomScale(userZoom = 1): RoomMetrics {
  const [metrics, setMetrics] = useState<RoomMetrics>(() => compute(userZoom))

  useEffect(() => {
    setMetrics(compute(userZoom))
    const onResize = () => setMetrics(compute(userZoom))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [userZoom])

  return metrics
}

/** Non-reactive instant read — call inside event handlers */
export const getRoomMetrics = (userZoom = 1) => compute(userZoom)
