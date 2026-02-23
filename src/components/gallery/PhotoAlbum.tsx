/* Photo album sitting in each cat room.
   Click triggers a 3D CSS book-cover flip → Lightbox opens.
   albumState is lifted to CatRoom so Lightbox (a sibling of Room) can
   coordinate the close animation without transform-clipping issues. */

export type AlbumState = 'idle' | 'opening' | 'open' | 'closing'

interface PhotoAlbumProps {
  albumState: AlbumState
  catName:    string
  accentColor: string
  onClick:    () => void
}

const SPINE_W  = 18   // px
const COVER_W  = 104  // px
const ALBUM_H  = 148  // px

/* Paw-print SVG drawn inline so no asset dependency */
function PawPrint({ opacity = 0.22 }: { opacity?: number }) {
  return (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main pad */}
      <ellipse cx="20" cy="28" rx="11" ry="9"  fill={`rgba(61,44,44,${opacity})`} />
      {/* Toe beans */}
      <ellipse cx="9"  cy="17" rx="5"  ry="5.5" fill={`rgba(61,44,44,${opacity})`} />
      <ellipse cx="31" cy="17" rx="5"  ry="5.5" fill={`rgba(61,44,44,${opacity})`} />
      <ellipse cx="15" cy="9"  rx="4"  ry="4.5" fill={`rgba(61,44,44,${opacity})`} />
      <ellipse cx="25" cy="9"  rx="4"  ry="4.5" fill={`rgba(61,44,44,${opacity})`} />
    </svg>
  )
}

export function PhotoAlbum({ albumState, catName, accentColor, onClick }: PhotoAlbumProps) {
  const isIdle    = albumState === 'idle'
  const isOpening = albumState === 'opening'
  const isOpen    = albumState === 'open'
  const isClosing = albumState === 'closing'

  /* Cover rotateY: animate when transitioning, hold final position otherwise */
  const coverTransform = isOpen ? 'rotateY(-175deg)' : 'rotateY(0deg)'
  const coverAnimation = isOpening
    ? 'book-cover-open 0.72s cubic-bezier(0.4,0,0.2,1) forwards'
    : isClosing
    ? 'book-cover-close 0.52s ease-in forwards'
    : 'none'

  return (
    <div
      className="absolute"
      style={{
        bottom:          '20%',
        left:            '18%',
        zIndex:          25,
        cursor:          isIdle ? 'pointer' : 'default',
        /* Idle: gentle floating + slight tilt */
        animation:       isIdle ? 'album-float 3s ease-in-out infinite' : 'none',
        transformOrigin: 'bottom center',
        userSelect:      'none',
      }}
      onClick={isIdle ? onClick : undefined}
      title={isIdle ? `Open ${catName}'s album` : undefined}
    >
      {/* ── 3D book scene ────────────────────────────────────────── */}
      <div
        style={{
          position:        'relative',
          width:            SPINE_W + COVER_W,
          height:           ALBUM_H,
          perspective:      600,
          perspectiveOrigin:'30% 50%',
          /* Lift shadow under book */
          filter: 'drop-shadow(3px 6px 0 rgba(61,44,44,0.22))',
        }}
      >
        {/* ── Spine ──────────────────────────────────────────────── */}
        <div
          style={{
            position:     'absolute',
            left:          0,
            top:           0,
            width:         SPINE_W,
            height:        ALBUM_H,
            background:   `linear-gradient(to right, rgba(0,0,0,0.35), rgba(0,0,0,0.1))`,
            backgroundColor: accentColor,
            borderRadius: '4px 0 0 4px',
            zIndex:        2,
            /* Thin gold/light stripe along spine edge */
            boxShadow:    'inset -2px 0 4px rgba(255,255,255,0.18)',
          }}
        >
          {/* Vertical title on spine */}
          <p
            style={{
              fontFamily:   'var(--font-hand)',
              fontSize:      10,
              color:         'rgba(61,44,44,0.7)',
              writingMode:  'vertical-rl',
              textOrientation:'mixed',
              transform:    'rotate(180deg)',
              margin:        'auto',
              paddingTop:    10,
              letterSpacing: '0.05em',
            }}
          >
            {catName}
          </p>
        </div>

        {/* ── Pages (visible when cover is open) ─────────────────── */}
        <div
          style={{
            position:     'absolute',
            left:          SPINE_W,
            top:           4,
            width:         COVER_W - 2,
            height:        ALBUM_H - 8,
            background:   '#fdf6ee',
            borderRadius: '0 3px 3px 0',
            zIndex:        1,
            /* Lined-paper look */
            backgroundImage:
              'repeating-linear-gradient(transparent, transparent 11px, rgba(61,44,44,0.07) 11px, rgba(61,44,44,0.07) 12px)',
            backgroundPosition: '0 18px',
            /* Shadow from spine + outer edge */
            boxShadow:
              'inset 6px 0 14px rgba(61,44,44,0.12), inset -1px 0 3px rgba(61,44,44,0.06)',
          }}
        >
          {/* Content hint shown when open/opening */}
          <div
            style={{
              position:   'absolute',
              inset:       0,
              display:     'flex',
              flexDirection:'column',
              alignItems:  'center',
              justifyContent:'center',
              gap:          6,
              opacity:     (isOpen || isOpening) ? 1 : 0,
              transition:  'opacity 0.3s ease 0.45s',
              pointerEvents:'none',
            }}
          >
            <span style={{ fontSize: 22 }}>📷</span>
            <span
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize:    11,
                color:       'var(--ink-light)',
                textAlign:   'center',
                lineHeight:   1.3,
              }}
            >
              {catName}'s<br/>Photos
            </span>
          </div>
        </div>

        {/* ── Cover (3-D flip) ───────────────────────────────────── */}
        <div
          style={{
            position:       'absolute',
            left:            SPINE_W,
            top:             0,
            width:           COVER_W,
            height:          ALBUM_H,
            transformStyle: 'preserve-3d',
            transformOrigin:'left center',
            /* Hold open/closed; animation overrides when transitioning */
            transform:       coverTransform,
            animation:       coverAnimation,
            zIndex:          3,
          }}
        >
          {/* Front face ------------------------------------------ */}
          <div
            style={{
              position:          'absolute',
              inset:              0,
              backfaceVisibility:'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background:        accentColor,
              borderRadius:      '0 5px 5px 0',
              display:           'flex',
              flexDirection:     'column',
              alignItems:        'center',
              justifyContent:    'center',
              gap:                8,
              padding:           '14px 10px',
              /* Subtle texture overlay */
              backgroundImage:
                `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.22) 0%, transparent 60%)`,
            }}
          >
            {/* Inner dashed border */}
            <div
              style={{
                position:     'absolute',
                inset:         6,
                border:       '1.5px dashed rgba(61,44,44,0.22)',
                borderRadius:  3,
                pointerEvents:'none',
              }}
            />

            {/* Washi-tape strip accent at top */}
            <div
              style={{
                position:     'absolute',
                top:          -4,
                left:          12,
                right:         12,
                height:        8,
                background:   'rgba(255,255,255,0.45)',
                borderRadius:  2,
                transform:    'rotate(-1deg)',
              }}
            />

            <PawPrint opacity={0.2} />

            <p
              style={{
                fontFamily:  'var(--font-hand)',
                fontSize:     14,
                fontWeight:   700,
                color:        'var(--ink)',
                textAlign:   'center',
                lineHeight:   1.25,
                margin:       0,
              }}
            >
              {catName}'s<br />Album
            </p>

            <span style={{ fontSize: 16, lineHeight: 1 }}>📷</span>

            {/* Idle shimmer hint */}
            {isIdle && (
              <p
                style={{
                  position:    'absolute',
                  bottom:       8,
                  left:         0,
                  right:        0,
                  textAlign:   'center',
                  fontFamily:  'var(--font-hand)',
                  fontSize:     10,
                  color:        'rgba(61,44,44,0.45)',
                  letterSpacing:'0.03em',
                }}
              >
                ✨ open me
              </p>
            )}
          </div>

          {/* Back face (inner cover shown when fully open) --------- */}
          <div
            style={{
              position:          'absolute',
              inset:              0,
              backfaceVisibility:'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform:         'rotateY(180deg)',
              background:        accentColor,
              backgroundImage:   `radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.15) 0%, transparent 55%)`,
              borderRadius:      '5px 0 0 5px',
              /* Subtle inner cover texture */
              opacity:           0.85,
            }}
          />
        </div>
      </div>
    </div>
  )
}
