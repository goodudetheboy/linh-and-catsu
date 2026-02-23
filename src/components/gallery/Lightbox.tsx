import { useRef } from 'react'
import { usePhotos } from '../../hooks/usePhotos'
import { useAuth } from '../../hooks/useAuth'
import { WashiTape } from '../ui/WashiTape'

interface LightboxProps {
  catSlug:     string
  catName:     string
  accentColor: string
  onClose:     () => void
}

export function Lightbox({ catSlug, catName, accentColor, onClose }: LightboxProps) {
  const { photos, loading, uploadPhoto, deletePhoto } = usePhotos(catSlug)
  const { isAuthenticated } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center"
      style={{ background: 'rgba(61,44,44,0.4)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="animate-pop-in relative bg-white rounded-2xl overflow-hidden flex flex-col"
        style={{
          width: 'min(90vw, 680px)',
          maxHeight: '85vh',
          boxShadow: '6px 8px 0 rgba(61,44,44,0.15)',
          transform: 'rotate(-0.5deg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <WashiTape color={accentColor} width={100} angle={-6} style={{ top: -10, left: 30 }} />
        <WashiTape color="#f9c6d0"     width={70}  angle={4}  style={{ top: -8, right: 50 }} />

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 pt-8 pb-4"
          style={{ borderBottom: `3px dashed ${accentColor}` }}
        >
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink)' }}
          >
            📷 {catName}'s Photos
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
            style={{ background: '#f0f0f0' }}
          >
            ✕
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <span style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink-light)', fontSize: 18 }}>
                Loading photos...
              </span>
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <span className="text-5xl">🐾</span>
              <p style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink-light)', fontSize: 18 }}>
                No photos yet — add some!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, i) => (
                <div
                  key={photo.id}
                  className="group relative paper-card rounded-xl overflow-hidden aspect-square"
                  style={{ transform: `rotate(${(i % 3 - 1) * 1.2}deg)` }}
                >
                  <img
                    src={photo.publicUrl}
                    alt={photo.caption ?? ''}
                    className="w-full h-full object-cover"
                  />
                  {isAuthenticated && (
                    <button
                      onClick={() => deletePhoto(photo)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'var(--pink-deep)', color: 'white' }}
                    >
                      ✕
                    </button>
                  )}
                  {photo.caption && (
                    <div
                      className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs truncate"
                      style={{ background: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-hand)' }}
                    >
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload — auth only */}
        {isAuthenticated && (
          <div className="px-6 py-4" style={{ borderTop: `3px dashed ${accentColor}` }}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={async (e) => {
                for (const f of Array.from(e.target.files ?? [])) await uploadPhoto(f)
                e.target.value = ''
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full py-3 rounded-xl font-bold text-lg transition-all active:scale-95"
              style={{
                fontFamily: 'var(--font-hand)',
                background: accentColor,
                color: 'var(--ink)',
                boxShadow: `0 3px 0 rgba(61,44,44,0.2)`,
              }}
            >
              + Add photos 📸
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
