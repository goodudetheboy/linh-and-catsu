import { useState } from 'react'
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { DecorationLayer } from './DecorationLayer'
import { BuilderToolbar } from '../builder/BuilderToolbar'
import { FurniturePanel } from '../builder/FurniturePanel'
import { LoginModal } from '../ui/LoginModal'
import { useAuth } from '../../hooks/useAuth'
import { useRoomBuilder } from '../../hooks/useRoomBuilder'
import { useRoomDecorations } from '../../hooks/useRoomDecorations'
import type { RoomConfig } from '../../data/rooms'

const WALL_PATTERNS: Record<string, string> = {
  dots: `radial-gradient(circle, rgba(0,0,0,0.06) 1.5px, transparent 1.5px)`,
  stripes: `repeating-linear-gradient(135deg, rgba(255,255,255,0.3) 0, rgba(255,255,255,0.3) 2px, transparent 0, transparent 50%)`,
  grid: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
  stars: `radial-gradient(ellipse 2px 2px at 20px 20px, rgba(0,0,0,0.07) 0%, transparent 100%)`,
}

const WALL_PATTERN_SIZE: Record<string, string> = {
  dots: '28px 28px',
  stripes: '20px 20px',
  grid: '32px 32px',
  stars: '40px 40px',
}

interface RoomProps {
  config:   RoomConfig
  children?: React.ReactNode
  onEditStateChange?: (editing: boolean) => void
}

export function Room({ config, children, onEditStateChange }: RoomProps) {
  const { isAuthenticated } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [saving, setSaving] = useState(false)

  const { decorations, saveDecorations } = useRoomDecorations(config.id)

  const builder = useRoomBuilder(decorations, async (items) => {
    setSaving(true)
    await saveDecorations(items)
    setSaving(false)
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const handleEditClick = () => {
    if (!isAuthenticated) { setShowLogin(true); return }
    builder.openEditor(decorations)
    onEditStateChange?.(true)
  }

  const handleSave = async () => {
    await builder.saveEditor()
    onEditStateChange?.(false)
  }

  const handleCancel = () => {
    builder.cancelEditor(decorations)
    onEditStateChange?.(false)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    // Only handle drops from the catalog into the room
    if (
      typeof active.id === 'string' &&
      active.id.startsWith('catalog-') &&
      typeof over.id === 'string' &&
      over.id.startsWith('room-drop-')
    ) {
      const itemId = (active.data.current as { itemId: string }).itemId
      // Place at 50% / 40% as default, user can move it
      builder.addItem(itemId, 50, 40, config.id)
    }
  }

  const wallPattern = config.wallPattern
    ? {
        backgroundImage: WALL_PATTERNS[config.wallPattern],
        backgroundSize: WALL_PATTERN_SIZE[config.wallPattern],
      }
    : {}

  return (
    <>
      {builder.isEditing && (
        <BuilderToolbar onSave={handleSave} onCancel={handleCancel} saving={saving} />
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      <DndContext sensors={sensors} modifiers={[restrictToWindowEdges]} onDragEnd={handleDragEnd}>
        {/* ── 3D Diorama container ── */}
        <div
          className="relative flex-shrink-0 paper-texture overflow-hidden"
          style={{
            width: '100vw',
            height: '100vh',
            perspective: '1200px',
          }}
        >
          {/* Scene (slight tilt for depth) */}
          <div
            style={{
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              transform: 'rotateX(4deg)',
              transformOrigin: 'center 60%',
            }}
          >
            {/* Back wall */}
            <div
              className="absolute inset-0"
              style={{
                background: config.wallColor,
                ...wallPattern,
              }}
            />

            {/* Floor */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: '35%',
                background: config.floorColor,
                transform: 'rotateX(-60deg)',
                transformOrigin: 'bottom center',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />

            {/* Left wall */}
            <div
              className="absolute top-0 left-0 bottom-0"
              style={{
                width: '12%',
                background: config.wallColor,
                filter: 'brightness(0.88)',
                transform: 'rotateY(55deg)',
                transformOrigin: 'left center',
              }}
            />

            {/* Right wall */}
            <div
              className="absolute top-0 right-0 bottom-0"
              style={{
                width: '12%',
                background: config.wallColor,
                filter: 'brightness(0.88)',
                transform: 'rotateY(-55deg)',
                transformOrigin: 'right center',
              }}
            />

            {/* Room content (characters, fixed decorations) */}
            <div className="absolute inset-0">
              {children}
            </div>

            {/* Decoration layer (drag-and-drop items) */}
            <DecorationLayer
              roomId={config.id}
              items={builder.items.length ? builder.items : decorations}
              isEditing={builder.isEditing}
              selected={builder.selected}
              onSelect={builder.setSelected}
              onDeselect={() => builder.setSelected(null)}
              onUpdate={builder.updateItem}
              onDelete={builder.removeItem}
              onForward={builder.bringForward}
              onBackward={builder.sendBackward}
              onFrameClick={(_item) => { /* photo frame lightbox handled per-room */ }}
            />
          </div>
        </div>

        {/* Drag overlay (ghost image while dragging from panel) */}
        <DragOverlay>
          {/* Handled inline by FurnitureCard opacity */}
          {null}
        </DragOverlay>

        {/* Furniture panel (edit mode only) */}
        <FurniturePanel visible={builder.isEditing} />
      </DndContext>

      {/* Edit pencil button */}
      {!builder.isEditing && (
        <button
          onClick={handleEditClick}
          className="fixed bottom-16 right-5 z-50 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95"
          style={{
            background: 'white',
            boxShadow: '0 4px 0 rgba(61,44,44,0.18), 0 6px 16px rgba(61,44,44,0.1)',
          }}
          title="Decorate this room"
        >
          ✏️
        </button>
      )}
    </>
  )
}
