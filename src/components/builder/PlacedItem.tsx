import { useRef, useCallback } from 'react'
import { getFurnitureById } from '../../data/furniture'
import type { PlacedItemState } from '../../hooks/useRoomBuilder'

interface PlacedItemProps {
  item:       PlacedItemState
  isEditing:  boolean
  isSelected: boolean
  roomWidth:  number
  roomHeight: number
  onSelect:   () => void
  onUpdate:   (patch: Partial<PlacedItemState>) => void
  onDelete:   () => void
  onForward:  () => void
  onBackward: () => void
  // For view mode: photo frame click
  onFrameClick?: () => void
}

export function PlacedItem({
  item,
  isEditing,
  isSelected,
  roomWidth,
  roomHeight,
  onSelect,
  onUpdate,
  onDelete,
  onForward,
  onBackward,
  onFrameClick,
}: PlacedItemProps) {
  const furniture = getFurnitureById(item.item_id)
  if (!furniture) return null

  const isFrame = furniture.category === 'frames'

  const dragStartRef = useRef<{ mx: number; my: number; ix: number; iy: number } | null>(null)
  const rotateStartRef = useRef<{ angle: number; initRot: number } | null>(null)
  const resizeStartRef = useRef<{ dist: number; initScale: number } | null>(null)

  const w = furniture.defaultWidth  * item.scale
  const h = furniture.defaultHeight * item.scale

  // ── Drag to move ───────────────────────────────────────────────
  const onDragStart = useCallback((e: React.PointerEvent) => {
    if (!isEditing) return
    e.stopPropagation()
    onSelect()
    dragStartRef.current = { mx: e.clientX, my: e.clientY, ix: item.x, iy: item.y }
    const move = (ev: PointerEvent) => {
      if (!dragStartRef.current) return
      const dx = ((ev.clientX - dragStartRef.current.mx) / roomWidth)  * 100
      const dy = ((ev.clientY - dragStartRef.current.my) / roomHeight) * 100
      onUpdate({
        x: Math.max(0, Math.min(100, dragStartRef.current.ix + dx)),
        y: Math.max(0, Math.min(100, dragStartRef.current.iy + dy)),
      })
    }
    const up = () => {
      dragStartRef.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }, [isEditing, item.x, item.y, onSelect, onUpdate, roomWidth, roomHeight])

  // ── Rotate handle ──────────────────────────────────────────────
  const onRotateStart = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect()
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    const initAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI)
    rotateStartRef.current = { angle: initAngle, initRot: item.rotation }

    const move = (ev: PointerEvent) => {
      if (!rotateStartRef.current) return
      const angle = Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI)
      onUpdate({ rotation: rotateStartRef.current.initRot + (angle - rotateStartRef.current.angle) })
    }
    const up = () => {
      rotateStartRef.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }, [item.rotation, onUpdate])

  // ── Corner resize ──────────────────────────────────────────────
  const onResizeStart = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect()
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    const initDist = Math.hypot(e.clientX - cx, e.clientY - cy)
    resizeStartRef.current = { dist: initDist, initScale: item.scale }

    const move = (ev: PointerEvent) => {
      if (!resizeStartRef.current) return
      const dist = Math.hypot(ev.clientX - cx, ev.clientY - cy)
      const ratio = dist / resizeStartRef.current.dist
      onUpdate({ scale: Math.max(0.2, Math.min(4, resizeStartRef.current.initScale * ratio)) })
    }
    const up = () => {
      resizeStartRef.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }, [item.scale, onUpdate])

  return (
    <div
      onPointerDown={onDragStart}
      onClick={() => {
        if (!isEditing && isFrame) onFrameClick?.()
        else if (isEditing) onSelect()
      }}
      style={{
        position:  'absolute',
        left:      `${item.x}%`,
        top:       `${item.y}%`,
        width:     w,
        height:    h,
        transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
        zIndex:    item.z_index + 10,
        cursor:    isEditing ? 'grab' : isFrame ? 'pointer' : 'default',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      <img
        src={furniture.assetPath}
        alt={furniture.label}
        draggable={false}
        className="w-full h-full object-contain pointer-events-none"
        style={{
          filter: isEditing && isSelected
            ? 'drop-shadow(0 0 6px rgba(232,137,154,0.8))'
            : 'drop-shadow(2px 3px 0 rgba(61,44,44,0.12))',
        }}
      />

      {/* ── Edit handles (only in edit mode when selected) ── */}
      {isEditing && isSelected && (
        <>
          {/* Outline */}
          <div
            className="absolute inset-0 rounded pointer-events-none"
            style={{ border: '2px dashed var(--pink-deep)', margin: -4 }}
          />

          {/* Delete button */}
          <button
            onPointerDown={(e) => { e.stopPropagation(); onDelete() }}
            className="absolute -top-3 -right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10"
            style={{ background: 'var(--pink-deep)', color: 'white', lineHeight: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
          >
            ✕
          </button>

          {/* Rotate handle */}
          <div
            onPointerDown={onRotateStart}
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center cursor-grab z-10"
            style={{ background: 'var(--lavender)', border: '2px solid var(--lavender-deep)', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }}
          >
            ↻
          </div>

          {/* Resize corner */}
          <div
            onPointerDown={onResizeStart}
            className="absolute -bottom-2 -right-2 w-5 h-5 rounded cursor-se-resize z-10"
            style={{ background: 'var(--mint-deep)', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }}
          />

          {/* Z-order context */}
          <div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1"
            style={{ whiteSpace: 'nowrap' }}
          >
            <button
              onPointerDown={(e) => { e.stopPropagation(); onBackward() }}
              className="px-2 py-0.5 rounded text-xs"
              style={{ background: 'white', boxShadow: '0 2px 0 #ddd', fontFamily: 'var(--font-hand)' }}
            >↓ Back</button>
            <button
              onPointerDown={(e) => { e.stopPropagation(); onForward() }}
              className="px-2 py-0.5 rounded text-xs"
              style={{ background: 'white', boxShadow: '0 2px 0 #ddd', fontFamily: 'var(--font-hand)' }}
            >↑ Fwd</button>
          </div>
        </>
      )}

      {/* View mode: hover hint for frames */}
      {!isEditing && isFrame && (
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded"
          style={{ background: 'rgba(249,198,208,0.4)', backdropFilter: 'blur(2px)' }}
        >
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: 13, color: 'var(--ink)' }}>
            📸 View photos
          </span>
        </div>
      )}
    </div>
  )
}
