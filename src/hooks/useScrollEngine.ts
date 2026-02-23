import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export const SCROLL_PER_ROOM = 1400

// Linh's X positions as % of room width
const X_CENTER = 50   // starting/center position
const X_RIGHT  = 88   // right edge — triggers forward transition
const X_LEFT   = 12   // left edge  — triggers backward transition
const X_OFF_R  = 112  // off screen right
const X_OFF_L  = -12  // off screen left

export function useScrollEngine(totalRooms: number, suspended: boolean) {
  const worldRef = useRef<HTMLDivElement>(null)

  const [roomIndex, setRoomIndex] = useState(0)
  const [linhX, setLinhX]         = useState(X_CENTER)

  // Internal refs — mutated without triggering re-renders
  const currentRoomRef  = useRef(0)
  const roomScrollRef   = useRef(0)           // 0 → SCROLL_PER_ROOM per room
  const transitioning   = useRef(false)
  const linhXRef        = useRef(X_CENTER)    // mirrors linhX state for GSAP tweens

  // Sync both the ref and the state atomically
  const moveLinh = (x: number) => {
    linhXRef.current = x
    setLinhX(x)
  }

  useEffect(() => {
    if (suspended) return

    // ── Shared transition builder ────────────────────────────────────
    const triggerTransition = (direction: 1 | -1) => {
      if (transitioning.current) return
      const targetRoom = currentRoomRef.current + direction
      if (targetRoom < 0 || targetRoom >= totalRooms) return

      transitioning.current = true

      // Where Linh exits and enters from
      const exitX  = direction ===  1 ? X_RIGHT  : X_LEFT
      const exitOff= direction ===  1 ? X_OFF_R  : X_OFF_L
      const enterOff=direction ===  1 ? X_OFF_L  : X_OFF_R
      // After entering, roomScroll sits at the edge she came from
      const enterScrollReset = direction === 1 ? 0 : SCROLL_PER_ROOM
      const enterLinhX       = direction === 1 ? X_LEFT : X_RIGHT

      const tl = gsap.timeline({
        onComplete: () => {
          currentRoomRef.current = targetRoom
          setRoomIndex(targetRoom)
          // roomScroll at the edge she came in from — full room to walk
          roomScrollRef.current = enterScrollReset

          // Snap off screen, walk into position
          linhXRef.current = enterOff
          setLinhX(enterOff)
          gsap.to(linhXRef, {
            current: enterLinhX,
            duration: 0.45,
            ease: 'power2.out',
            onUpdate: () => setLinhX(linhXRef.current),
            onComplete: () => { transitioning.current = false },
          })
        },
      })

      // 1. Linh walks briskly to the exit edge
      tl.to(linhXRef, {
        current: exitX,
        duration: 0.2,
        ease: 'power1.in',
        onUpdate: () => setLinhX(linhXRef.current),
      })
      // 2. She strides off screen
      tl.to(linhXRef, {
        current: exitOff,
        duration: 0.28,
        ease: 'power2.in',
        onUpdate: () => setLinhX(linhXRef.current),
      })
      // 3. Room slides (overlaps with her walking off)
      tl.to(worldRef.current, {
        x: `${-targetRoom * 100}vw`,
        duration: 0.65,
        ease: 'power3.inOut',
      }, '-=0.18')
    }

    const goForward  = () => triggerTransition(1)
    const goBackward = () => triggerTransition(-1)

    // ── Wheel handler ────────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-furniture-panel]')) return
      e.preventDefault()
      if (transitioning.current) return

      roomScrollRef.current = Math.max(
        0,
        Math.min(SCROLL_PER_ROOM, roomScrollRef.current + e.deltaY * 0.85),
      )

      const progress = roomScrollRef.current / SCROLL_PER_ROOM  // 0 → 1

      // Map progress 0→1 to Linh's X range (X_LEFT → X_RIGHT), centered at 0.5
      const x = X_LEFT + progress * (X_RIGHT - X_LEFT)
      moveLinh(x)

      if (progress >= 1) { goForward();  return }
      if (progress <= 0) { goBackward(); return }
    }

    // ── Touch support ────────────────────────────────────────────────
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault()
      if (transitioning.current) return
      const dy = touchStartY - e.touches[0].clientY
      touchStartY = e.touches[0].clientY
      // Reuse wheel logic via synthetic delta
      roomScrollRef.current = Math.max(
        0,
        Math.min(SCROLL_PER_ROOM, roomScrollRef.current + dy * 1.5),
      )
      const progress = roomScrollRef.current / SCROLL_PER_ROOM
      moveLinh(X_LEFT + progress * (X_RIGHT - X_LEFT))
      if (progress >= 1) goForward()
      if (progress <= 0) goBackward()
    }

    // Initial state: center of room
    roomScrollRef.current = SCROLL_PER_ROOM / 2
    moveLinh(X_CENTER)

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })

    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
    }
  }, [totalRooms, suspended])

  return { worldRef, roomIndex, linhX }
}
