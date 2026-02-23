import { useRef } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { PlacedItem } from '../builder/PlacedItem'
import type { PlacedItemState } from '../../hooks/useRoomBuilder'

interface DecorationLayerProps {
  roomId:     string
  items:      PlacedItemState[]
  isEditing:  boolean
  selected:   string | null
  onSelect:   (id: string) => void
  onDeselect: () => void
  onUpdate:   (id: string, patch: Partial<PlacedItemState>) => void
  onDelete:   (id: string) => void
  onForward:  (id: string) => void
  onBackward: (id: string) => void
  onFrameClick?: (item: PlacedItemState) => void
}

export function DecorationLayer({
  roomId,
  items,
  isEditing,
  selected,
  onSelect,
  onDeselect,
  onUpdate,
  onDelete,
  onForward,
  onBackward,
  onFrameClick,
}: DecorationLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null)

  const { setNodeRef } = useDroppable({ id: `room-drop-${roomId}` })

  const setRef = (el: HTMLDivElement | null) => {
    setNodeRef(el)
    ;(layerRef as React.MutableRefObject<HTMLDivElement | null>).current = el
  }

  const roomWidth  = layerRef.current?.offsetWidth  ?? window.innerWidth
  const roomHeight = layerRef.current?.offsetHeight ?? window.innerHeight

  return (
    <div
      ref={setRef}
      className="absolute inset-0 z-10"
      style={{
        cursor:        isEditing ? 'crosshair' : 'default',
        /* In view mode, pass clicks through to room children (e.g. PhotoAlbum).
           Descendant PlacedItems can override this with pointer-events: auto. */
        pointerEvents: isEditing ? 'auto' : 'none',
      }}
      onClick={() => isEditing && onDeselect()}
    >
      {items.map((item) => (
        <PlacedItem
          key={item.id}
          item={item}
          isEditing={isEditing}
          isSelected={selected === item.id}
          roomWidth={roomWidth}
          roomHeight={roomHeight}
          onSelect={() => onSelect(item.id)}
          onUpdate={(patch) => onUpdate(item.id, patch)}
          onDelete={() => onDelete(item.id)}
          onForward={() => onForward(item.id)}
          onBackward={() => onBackward(item.id)}
          onFrameClick={() => onFrameClick?.(item)}
        />
      ))}
    </div>
  )
}
