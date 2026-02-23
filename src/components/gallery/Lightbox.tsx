import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { usePhotos } from '../../hooks/usePhotos'
import { useAuth } from '../../hooks/useAuth'
import { WashiTape } from '../ui/WashiTape'
import { LoginModal } from '../ui/LoginModal'

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

  /* Index of the photo being viewed full-screen; null = grid view */
  const [viewIndex, setViewIndex] = useState<number | null>(null)
  const [showLogin, setShowLogin] = useState(false)

  /* Upload confirmation — files selected but not yet uploaded */
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [uploading, setUploading]       = useState(false)

  /* Object URLs for pending previews — revoked on dismiss */
  const previewUrls = useMemo(
    () => pendingFiles.map((f) => URL.createObjectURL(f)),
    [pendingFiles],
  )
  useEffect(() => () => previewUrls.forEach((u) => URL.revokeObjectURL(u)), [previewUrls])

  const cancelPending = useCallback(() => {
    setPendingFiles([])
    if (fileRef.current) fileRef.current.value = ''
  }, [])

  const confirmUpload = useCallback(async () => {
    setUploading(true)
    for (const f of pendingFiles) await uploadPhoto(f)
    setUploading(false)
    setPendingFiles([])
    if (fileRef.current) fileRef.current.value = ''
  }, [pendingFiles, uploadPhoto])

  /* Navigate full-screen viewer */
  const goPrev = useCallback(() => {
    setViewIndex((i) => (i == null || i === 0 ? photos.length - 1 : i - 1))
  }, [photos.length])

  const goNext = useCallback(() => {
    setViewIndex((i) => (i == null ? 0 : (i + 1) % photos.length))
  }, [photos.length])

  /* Keyboard navigation for full-screen viewer */
  useEffect(() => {
    if (viewIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goPrev() }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
      if (e.key === 'Escape')     { e.preventDefault(); setViewIndex(null) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewIndex, goPrev, goNext])

  const viewedPhoto = viewIndex != null ? photos[viewIndex] : null

  /* Portal to document.body so position:fixed is relative to the viewport,
     not the worldRef div (which has willChange:transform — a known CSS gotcha
     that turns transformed ancestors into the containing block for fixed els). */
  return createPortal(
    <>
      {/* ── Album panel ─────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-150 flex items-center justify-center p-8"
        style={{ background: 'rgba(61,44,44,0.45)', backdropFilter: 'blur(7px)' }}
        onClick={onClose}
      >
        {/* Outer wrapper: no overflow clip so tapes aren't cut off */}
        <div
          className="animate-pop-in relative w-full"
          style={{
            maxWidth:  700,
            maxHeight: '100%',
            transform: 'rotate(-0.5deg)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Washi tape accents — outside the clipping card so they're fully visible */}
          <WashiTape color={accentColor} width={100} angle={-6} style={{ top: -10, left: 30 }} />
          <WashiTape color="#f9c6d0"     width={70}  angle={4}  style={{ top: -8,  right: 50 }} />

          {/* Inner card — owns overflow-hidden for rounded corners */}
          <div
            className="relative bg-white rounded-2xl overflow-hidden flex flex-col"
            style={{
              maxHeight: '100%',
              boxShadow: '6px 8px 0 rgba(61,44,44,0.18)',
            }}
          >

          {/* Spine accent */}
          <div
            style={{
              position:     'absolute',
              left:          0,
              top:           0,
              bottom:        0,
              width:         6,
              background:    accentColor,
              opacity:       0.55,
              borderRadius: '12px 0 0 12px',
              pointerEvents:'none',
            }}
          />

          {/* ── Header ─────────────────────────────────────────── */}
          <div
            className="flex items-center justify-between px-6 pt-5 pb-4"
            style={{ borderBottom: `3px dashed ${accentColor}` }}
          >
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink)' }}
            >
              📷 {catName}'s Album
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95"
              style={{ background: '#f0f0f0', flexShrink: 0 }}
            >
              ✕
            </button>
          </div>

          {/* ── Photo grid ─────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
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
                    style={{
                      transform: `rotate(${(i % 3 - 1) * 1.2}deg)`,
                      cursor:    'zoom-in',
                      transition:'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                    onClick={() => setViewIndex(i)}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLDivElement).style.transform =
                        `rotate(${(i % 3 - 1) * 0.5}deg) scale(1.04)`
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                        '4px 6px 0 rgba(61,44,44,0.2)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLDivElement).style.transform =
                        `rotate(${(i % 3 - 1) * 1.2}deg)`
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = ''
                    }}
                  >
                    <img
                      src={photo.publicUrl}
                      alt={photo.caption ?? ''}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(61,44,44,0.18)' }}
                    >
                      <span style={{ fontSize: 22 }}>🔍</span>
                    </div>

                    {isAuthenticated && (
                      <button
                        onClick={(e) => { e.stopPropagation(); deletePhoto(photo) }}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'var(--pink-deep)', color: 'white' }}
                        title="Delete photo"
                      >
                        ✕
                      </button>
                    )}
                    {photo.caption && (
                      <div
                        className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs truncate"
                        style={{ background: 'rgba(255,255,255,0.88)', fontFamily: 'var(--font-hand)' }}
                      >
                        {photo.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Upload footer ──────────────────────────────────── */}
          <div className="px-6 py-4" style={{ borderTop: `3px dashed ${accentColor}` }}>
            {isAuthenticated ? (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? [])
                    if (files.length > 0) setPendingFiles(files)
                  }}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-3 rounded-xl font-bold text-lg transition-all hover:brightness-95 active:scale-95"
                  style={{
                    fontFamily: 'var(--font-hand)',
                    background:  accentColor,
                    color:      'var(--ink)',
                    boxShadow:  `0 3px 0 rgba(61,44,44,0.2)`,
                  }}
                >
                  + Add photos 📸
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="w-full py-2.5 rounded-xl font-bold text-base transition-all hover:brightness-95 active:scale-95 flex items-center justify-center gap-2"
                style={{
                  fontFamily: 'var(--font-hand)',
                  background: '#f5f0eb',
                  color:      'var(--ink-light)',
                  boxShadow:  '0 2px 0 rgba(61,44,44,0.1)',
                }}
              >
                🔐 Login to add photos
              </button>
            )}
          </div>

          {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
          </div>{/* ── end inner card */}
        </div>{/* ── end outer wrapper */}
      </div>

      {/* ── Upload confirmation overlay ──────────────────────────── */}
      {pendingFiles.length > 0 && (
        <div
          className="fixed inset-0 z-210 flex items-center justify-center p-8"
          style={{ background: 'rgba(61,44,44,0.55)', backdropFilter: 'blur(8px)' }}
          onClick={cancelPending}
        >
          {/* Outer wrapper: keeps tapes unclipped */}
          <div
            className="animate-pop-in relative w-full"
            style={{
              maxWidth:  560,
              maxHeight: '100%',
              transform: 'rotate(0.4deg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <WashiTape color={accentColor} width={90} angle={-5} style={{ top: -10, left: 24 }} />
            <WashiTape color="#f9c6d0"     width={60} angle={4}  style={{ top: -8,  right: 40 }} />

            {/* Inner card */}
            <div
              className="relative bg-white rounded-2xl overflow-hidden flex flex-col"
              style={{
                maxHeight: '100%',
                boxShadow: '6px 8px 0 rgba(61,44,44,0.2)',
              }}
            >

            {/* Header */}
            <div className="px-6 pt-7 pb-3">
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink)' }}
              >
                Upload {pendingFiles.length} photo{pendingFiles.length > 1 ? 's' : ''}?
              </h3>
              <p style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink-light)', fontSize: 14, marginTop: 2 }}>
                Check these look right before adding them to the album.
              </p>
            </div>

            {/* Preview grid */}
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}
              >
                {previewUrls.map((url, i) => (
                  <div
                    key={url}
                    className="relative rounded-xl overflow-hidden aspect-square"
                    style={{
                      transform: `rotate(${(i % 3 - 1) * 1.5}deg)`,
                      boxShadow: '3px 4px 0 rgba(61,44,44,0.12)',
                    }}
                  >
                    <img src={url} alt={pendingFiles[i].name} className="w-full h-full object-cover" draggable={false} />
                    <div
                      className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs truncate"
                      style={{ background: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-hand)' }}
                    >
                      {pendingFiles[i].name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex gap-3 px-6 py-4"
              style={{ borderTop: `3px dashed ${accentColor}` }}
            >
              <button
                onClick={cancelPending}
                disabled={uploading}
                className="flex-1 py-3 rounded-xl font-bold text-base transition-all hover:brightness-95 active:scale-95 disabled:opacity-50"
                style={{
                  fontFamily: 'var(--font-hand)',
                  background: '#f0ece8',
                  color:      'var(--ink-light)',
                  boxShadow:  '0 2px 0 rgba(61,44,44,0.1)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                disabled={uploading}
                className="flex-2 py-3 rounded-xl font-bold text-lg transition-all hover:brightness-95 active:scale-95 disabled:opacity-60"
                style={{
                  fontFamily: 'var(--font-hand)',
                  background:  accentColor,
                  color:      'var(--ink)',
                  boxShadow:  `0 3px 0 rgba(61,44,44,0.2)`,
                }}
              >
                {uploading
                  ? 'Uploading...'
                  : `Upload ${pendingFiles.length} photo${pendingFiles.length > 1 ? 's' : ''} 📸`}
              </button>
            </div>
            </div>{/* ── end inner card */}
          </div>{/* ── end outer wrapper */}
        </div>
      )}

      {/* ── Full-screen photo viewer ─────────────────────────────── */}
      {viewedPhoto && (
        <div
          className="fixed inset-0 z-200 flex items-center justify-center"
          style={{ background: 'rgba(20,12,12,0.82)', backdropFilter: 'blur(12px)' }}
          onClick={() => setViewIndex(null)}
        >
          {/* Photo */}
          <div
            className="animate-fade-in relative"
            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Polaroid-style frame */}
            <div
              className="paper-card"
              style={{
                padding:      '10px 10px 40px',
                transform:   'rotate(-0.8deg)',
                boxShadow:   '0 12px 40px rgba(0,0,0,0.5)',
                background:  'white',
                borderRadius: 6,
              }}
            >
              <WashiTape
                color={accentColor}
                width={90}
                angle={-4}
                style={{ top: -9, left: '50%', transform: 'translateX(-50%)' }}
              />
              <img
                src={viewedPhoto.publicUrl}
                alt={viewedPhoto.caption ?? ''}
                style={{
                  display:     'block',
                  maxWidth:    'min(80vw, 640px)',
                  maxHeight:   '72vh',
                  objectFit:   'contain',
                  borderRadius: 3,
                }}
                draggable={false}
              />
              {viewedPhoto.caption && (
                <p
                  style={{
                    textAlign:  'center',
                    marginTop:   10,
                    fontFamily: 'var(--font-hand)',
                    fontSize:    18,
                    color:      'var(--ink)',
                  }}
                >
                  {viewedPhoto.caption}
                </p>
              )}
              {/* Photo counter */}
              <p
                style={{
                  textAlign:  'center',
                  fontFamily: 'var(--font-hand)',
                  fontSize:    13,
                  color:      'var(--ink-light)',
                  marginTop:  viewedPhoto.caption ? 2 : 8,
                }}
              >
                {(viewIndex ?? 0) + 1} / {photos.length}
              </p>
            </div>

            {/* Close */}
            <button
              onClick={() => setViewIndex(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95"
              style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', zIndex: 10 }}
            >
              ✕
            </button>
          </div>

          {/* Prev / Next arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                className="fixed left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95"
                style={{ background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                aria-label="Previous photo"
              >
                ←
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext() }}
                className="fixed right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95"
                style={{ background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                aria-label="Next photo"
              >
                →
              </button>
            </>
          )}
        </div>
      )}
    </>,
    document.body,
  )
}
