import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { DbRoomDecoration } from '../lib/supabase'

export type { DbRoomDecoration }

export function useRoomDecorations(roomId: string) {
  const [decorations, setDecorations] = useState<DbRoomDecoration[]>([])
  const [loading, setLoading] = useState(false)

  const fetchDecorations = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('room_decorations')
      .select('*')
      .eq('room_id', roomId)
      .order('z_index', { ascending: true })

    setDecorations(data ?? [])
    setLoading(false)
  }, [roomId])

  useEffect(() => { fetchDecorations() }, [fetchDecorations])

  const saveDecorations = useCallback(
    async (items: DbRoomDecoration[]) => {
      // Delete existing for this room, then insert fresh set
      await supabase.from('room_decorations').delete().eq('room_id', roomId)

      if (items.length === 0) return

      const rows = items.map((item) => ({ ...item, room_id: roomId }))
      const { error } = await supabase.from('room_decorations').insert(rows)
      if (error) console.error('[saveDecorations]', error)

      fetchDecorations()
    },
    [roomId, fetchDecorations],
  )

  return { decorations, loading, saveDecorations, refetch: fetchDecorations }
}
