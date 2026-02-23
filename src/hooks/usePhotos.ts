import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { DbPhoto } from '../lib/supabase'

export interface Photo extends DbPhoto {
  publicUrl: string
}

export function usePhotos(catSlug: string | undefined) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPhotos = useCallback(async () => {
    if (!catSlug) return
    setLoading(true)

    const { data: catRow } = await supabase
      .from('cats')
      .select('id')
      .eq('slug', catSlug)
      .single()

    if (!catRow) { setLoading(false); return }

    const { data } = await supabase
      .from('photos')
      .select('*')
      .eq('cat_id', catRow.id)
      .order('created_at', { ascending: false })

    if (data) {
      const withUrls: Photo[] = data.map((p: DbPhoto) => {
        const { data: urlData } = supabase.storage
          .from('cat-photos')
          .getPublicUrl(p.storage_path)
        return { ...p, publicUrl: urlData.publicUrl }
      })
      setPhotos(withUrls)
    }

    setLoading(false)
  }, [catSlug])

  useEffect(() => { fetchPhotos() }, [fetchPhotos])

  const uploadPhoto = useCallback(
    async (file: File, caption?: string) => {
      if (!catSlug) return

      const { data: catRow } = await supabase
        .from('cats')
        .select('id')
        .eq('slug', catSlug)
        .single()

      if (!catRow) return

      const ext = file.name.split('.').pop()
      const path = `${catSlug}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('cat-photos')
        .upload(path, file)

      if (uploadError) { console.error(uploadError); return }

      await supabase.from('photos').insert({
        cat_id: catRow.id,
        storage_path: path,
        caption: caption ?? null,
      })

      fetchPhotos()
    },
    [catSlug, fetchPhotos],
  )

  const deletePhoto = useCallback(
    async (photo: Photo) => {
      await supabase.storage.from('cat-photos').remove([photo.storage_path])
      await supabase.from('photos').delete().eq('id', photo.id)
      fetchPhotos()
    },
    [fetchPhotos],
  )

  return { photos, loading, uploadPhoto, deletePhoto, refetch: fetchPhotos }
}
