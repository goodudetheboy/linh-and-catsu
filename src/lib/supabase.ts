import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing env vars. Copy .env.example to .env and fill in your values.',
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

// ─── Types mirroring the DB schema ──────────────────────────────────
export interface DbCat {
  id: string
  slug: string
  name: string
  age_years: number
  color_desc: string
  room_order: number
}

export interface DbPhoto {
  id: string
  cat_id: string
  storage_path: string
  caption: string | null
  created_at: string
}

export interface DbRoomDecoration {
  id: string
  room_id: string
  item_id: string
  x: number
  y: number
  rotation: number
  scale: number
  z_index: number
  extra_data: Record<string, unknown> | null
}
