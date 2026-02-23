import { useCallback, useState } from 'react'
import type { DbRoomDecoration } from '../lib/supabase'

export type PlacedItemState = DbRoomDecoration

const newId = () => crypto.randomUUID()

export function useRoomBuilder(
  initial: PlacedItemState[],
  onSave: (items: PlacedItemState[]) => Promise<void>,
) {
  const [isEditing, setIsEditing] = useState(false)
  const [items, setItems]         = useState<PlacedItemState[]>(initial)
  const [selected, setSelected]   = useState<string | null>(null)

  // Sync with fresh data when exiting/entering edit
  const openEditor = useCallback((freshItems: PlacedItemState[]) => {
    setItems(freshItems)
    setSelected(null)
    setIsEditing(true)
  }, [])

  const cancelEditor = useCallback((freshItems: PlacedItemState[]) => {
    setItems(freshItems) // revert
    setSelected(null)
    setIsEditing(false)
  }, [])

  const saveEditor = useCallback(async () => {
    await onSave(items)
    setSelected(null)
    setIsEditing(false)
  }, [items, onSave])

  // ── Item mutations ──────────────────────────────────────────────
  const addItem = useCallback(
    (itemId: string, x: number, y: number, roomId: string) => {
      const newItem: PlacedItemState = {
        id:         newId(),
        room_id:    roomId,
        item_id:    itemId,
        x,
        y,
        rotation:   0,
        scale:      1,
        z_index:    items.length,
        extra_data: null,
      }
      setItems((prev) => [...prev, newItem])
      setSelected(newItem.id)
    },
    [items.length],
  )

  const updateItem = useCallback(
    (id: string, patch: Partial<PlacedItemState>) => {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      )
    },
    [],
  )

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
    setSelected(null)
  }, [])

  const bringForward = useCallback((id: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === id)
      if (idx === prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      return next.map((it, i) => ({ ...it, z_index: i }))
    })
  }, [])

  const sendBackward = useCallback((id: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === id)
      if (idx === 0) return prev
      const next = [...prev]
      ;[next[idx], next[idx - 1]] = [next[idx - 1], next[idx]]
      return next.map((it, i) => ({ ...it, z_index: i }))
    })
  }, [])

  return {
    isEditing,
    items,
    selected,
    setSelected,
    openEditor,
    cancelEditor,
    saveEditor,
    addItem,
    updateItem,
    removeItem,
    bringForward,
    sendBackward,
  }
}
