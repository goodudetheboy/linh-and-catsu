# Linh & Catsu — Architecture Spec

A scrapbook-aesthetic website for Linh to store photos of her three cats (Rua, RI, Bigga) and decorate rooms with drag-and-drop furniture. Built with Vite + React + TypeScript, deployed to Vercel, backed by Supabase.

---

## Tech Stack

| Concern | Choice | Why |
|---------|--------|-----|
| Framework | Vite + React + TypeScript | Pure SPA — no SSR needed. Next.js was considered but GSAP + App Router causes hydration friction. Vite has zero overhead. |
| Scroll animation | GSAP (no ScrollTrigger) | Wheel events captured manually (`e.preventDefault()`); virtual scroll position in a ref drives all animation. Native scroll is blocked (`overflow: hidden` on html/body). |
| Drag and drop | @dnd-kit/core + modifiers | Room builder furniture drag. PointerSensor works on touch. |
| Backend | Supabase | Auth (single user), Postgres (cats/photos/room_decorations), Storage (cat-photos bucket). |
| Styling | Tailwind CSS v4 + custom CSS | Papercraft design tokens in CSS custom properties. |
| Font | Caveat (Google Fonts) + Nunito | Handwritten display + body. |

---

## Fixed Canvas System

**Every room is a 1600 × 900 px canvas** (16:9). All furniture positions are stored as `x%` / `y%` of this canvas. This is the single source of truth for layout — it never changes regardless of screen size.

### Scale factor

```
scaleFactor = (vh / ROOM_HEIGHT) * userZoom
            = (viewport height / 900) * userZoom
```

`userZoom` defaults to 1.0 and is controlled by the zoom slider. GSAP tweens the zoom change smoothly at 60fps.

### Derived values (see `useRoomScale.ts`)

| Value | Formula | Purpose |
|-------|---------|---------|
| `scaledRoomWidth` | `1600 * scaleFactor` | Visual width of canvas on screen |
| `scaledRoomHeight` | `900 * scaleFactor` | Visual height of canvas on screen |
| `needsCamera` | `scaledRoomWidth > vw` | Whether to pan camera with Linh |
| `slotWidth` | `max(scaledRoomWidth, vw)` | Width each room occupies in the world strip |
| `canvasOffsetX` | `(vw - scaledRoomWidth) / 2` when `!needsCamera` | Horizontal centering offset |
| `canvasOffsetY` | `max(0, (vh - scaledRoomHeight) / 2)` | Vertical centering offset (cute bg top/bottom when zoomed out) |

### Screen behavior by device

| Device | Viewport | Zoom 1x behavior |
|--------|---------|-----------------|
| 1080p desktop | 1920×1080 | scaledRoomWidth = 1920 = vw → full room, no camera |
| 1440p | 2560×1440 | scaledRoomWidth = 2560 = vw → full room |
| Laptop 768p | 1366×768 | scaledRoomWidth = 1365 ≈ vw → full room |
| iPad landscape | 1024×768 | scaledRoomWidth = 1365 > 1024 → camera follows Linh |
| iPhone portrait | 375×812 | scaledRoomWidth = 1443 > 375 → camera follows Linh |

On screens narrower than 16:9, the cute polka-dot background shows on the sides (and top/bottom when zoomed out). The room canvas gets a glowing frame border against this background.

---

## Scroll Engine (`useScrollEngine.ts`)

**No native scrolling.** `window.addEventListener('wheel', ..., { passive: false })` captures all scroll input and calls `e.preventDefault()`. Touch via `touchmove`.

### Virtual scroll state
- `roomScrollRef` — 0 to `SCROLL_PER_ROOM` (1400) within the current room
- `currentRoomRef` — which room index we're in
- `linhPxRef` — Linh's current position in canvas-px

### Walk range
- `roomScroll = 0` → Linh at `LINH_LEFT_PX` (220px from left)
- `roomScroll = SCROLL_PER_ROOM/2` → Linh at center (800px) — initial state on first load
- `roomScroll = SCROLL_PER_ROOM` → Linh at `LINH_RIGHT_PX` (1380px)

### Room transition sequence (forward)
1. Linh walks briskly to right edge (0.2s, power1.in)
2. She strides off screen right (0.28s, power2.in)
3. World strip slides left to next room (0.65s, power3.inOut) — overlaps by 0.18s
4. `onComplete`: snap Linh off-screen left, reset `roomScroll = 0`, walk her in to `LINH_LEFT_PX` (0.45s, power2.out)
5. `transitioning = false` — scroll unlocked

Backward transition is the mirror. All scroll input is ignored while `transitioning = true`.

### Camera follow
```
cameraX = clamp(linhScreenX - vw/2, 0, scaledRoomWidth - vw)
worldX  = -(currentRoom * slotWidth + cameraX)
```
When `!needsCamera`, `cameraX = 0` always — world position is just `-(room * slotWidth)`.

### applyPositions
Every frame (scroll tick, zoom change, resize) calls:
```typescript
applyPositions(room, linhPx, zoom)
  → computes metrics
  → gsap.set(worldRef, { x: worldX })
  → setLinhScreenX(canvasOffsetX + linhPx * scaleFactor - cameraX)
```

---

## Linh Character (fixed overlay)

Linh is **`position: fixed`**, rendered in `RoomWorld` as a single instance — NOT inside any room component.

**Why fixed:** She needs to animate across room transitions. If she were inside a room component, React's state batching would cause a 1-frame jag where the new room is on screen but Linh hasn't updated her room yet.

**Size and position are derived entirely from canvas metrics:**
```typescript
linhW     = 80  * scaleFactor          // scales with canvas
linhH     = 160 * scaleFactor          // scales with canvas
linhFeetY = canvasOffsetY + 0.88 * ROOM_HEIGHT * scaleFactor  // feet on canvas floor
linhScreenX = (from useScrollEngine)   // horizontal, px from left
```

The `Linh` component takes `{ screenX, screenY, width, height }` all in screen px.

---

## Room Builder

Each room has a `✏️` pencil button (bottom-right). Click → if not logged in, shows `LoginModal`. If logged in:
1. `useRoomBuilder` enters edit mode, scroll suspended
2. `FurniturePanel` slides up from bottom (categorized: Furniture / Plants / Decor / Cute / Frames)
3. Drag items from panel into room via `@dnd-kit/core`
4. Placed items (`PlacedItem.tsx`) have handles: drag to move, rotate grip (top), corner resize, ✕ delete, z-order buttons
5. `BuilderToolbar` (top): Save → persists to Supabase `room_decorations` table. Cancel → reverts.

**Furniture catalog:** `src/data/furniture.ts` — 28 items. Assets in `public/assets/furniture/` (colored placeholder SVGs). Replace SVG files with real art — filename must match exactly.

**Photo frames** are a furniture category. Placing one in the room creates a clickable frame that opens the cat's photo lightbox in view mode.

---

## Authentication

Single user (Linh). No registration flow.

- `useAuth.ts` calls `supabase.auth.signInWithPassword({ email: VITE_LINH_EMAIL, password })`
- The email is hardcoded from `.env` — only a password field is shown in the UI
- Session persists in localStorage (Supabase default)
- RLS on all write operations: `auth.role() = 'authenticated'`
- Public read on everything (site is viewable by anyone)

---

## Supabase Schema

Run `supabase-setup.sql` in Supabase SQL editor.

**`cats`** — id, slug (rua/ri/bigga), name, age_years, color_desc, room_order
**`photos`** — id, cat_id (FK), storage_path, caption, created_at
**`room_decorations`** — id, room_id (slug), item_id, x (%), y (%), rotation (deg), scale (float), z_index, extra_data (jsonb)
**Storage bucket:** `cat-photos` — public read, auth write. Path: `/{cat-slug}/{filename}`

---

## Rooms

| Index | ID | Label | Cat |
|-------|----|-------|-----|
| 0 | `welcome` | Linh & Catsu | — |
| 1 | `rua` | Rua's Room | Rua (5yr, orange tabby) |
| 2 | `ri` | RI's Room | RI (1.5yr, grey) |
| 3 | `bigga` | Bigga's Room | Bigga (2.5yr, grey/brown tabby) |
| 4 | `together` | Together | — |

Room palettes defined in `src/data/rooms.ts` (`RoomConfig[]`). Adding a new room = add one object to this array. Scroll engine picks up the count automatically.

---

## Project Structure

```
src/
  components/
    rooms/
      RoomWorld.tsx        ← top-level: zoom state, world strip, single Linh
      Room.tsx             ← 3D CSS diorama shell + DnD context + edit button
      DecorationLayer.tsx  ← 2D overlay with placed items
      WelcomeRoom.tsx / CatRoom.tsx / TogetherRoom.tsx
    builder/
      FurniturePanel.tsx   ← slide-up drawer, categorized items
      FurnitureCard.tsx    ← draggable thumbnail from panel
      PlacedItem.tsx       ← item in room with move/rotate/resize/delete handles
      BuilderToolbar.tsx   ← Save / Cancel bar
    characters/
      Linh.tsx             ← fixed overlay, takes { screenX, screenY, width, height }
      Cat.tsx              ← absolute inside canvas, bobbing animation
    gallery/
      Lightbox.tsx         ← photo grid + upload modal
    ui/
      WashiTape.tsx        ← decorative tape accent (color, angle props)
      RoomIndicator.tsx    ← dot nav
      LoginModal.tsx       ← password-only login
      ZoomSlider.tsx       ← zoom range input + camera mode badge
  hooks/
    useScrollEngine.ts     ← wheel/touch → virtual scroll → GSAP world+Linh
    useRoomScale.ts        ← scaleFactor, needsCamera, slotWidth, offsets
    useRoomBuilder.ts      ← edit mode state, item mutations (add/update/remove/z-order)
    useRoomDecorations.ts  ← Supabase CRUD for room_decorations
    usePhotos.ts           ← Supabase CRUD for photos + storage
    useAuth.ts             ← Supabase auth (signIn/signOut/session)
  lib/
    supabase.ts            ← Supabase client + DB type interfaces
  data/
    constants.ts           ← ROOM_WIDTH, ROOM_HEIGHT, LINH_*_PX positions
    rooms.ts               ← RoomConfig[] array
    cats.ts                ← Cat[] metadata
    furniture.ts           ← FurnitureItem[] catalog
  styles/
    animations.css         ← bop, tail-wag, ear-twitch, slide-up, pop-in keyframes
  index.css                ← design tokens (CSS vars), paper texture, base reset
```

---

## Environment Variables (.env)

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_LINH_EMAIL=linh@example.com   ← Linh's Supabase auth email (hardcoded in login)
```

---

## What's Done

- [x] Scroll engine (wheel + touch, virtual position, room transitions with GSAP)
- [x] 5 room stubs with unique palettes and CSS 3D diorama effect
- [x] Fixed canvas system (1600×900) with responsive scaling
- [x] Camera follow on narrow screens
- [x] Zoom slider (0.35×–2.0×) with smooth GSAP tween, camera respects zoom
- [x] Outside-room cute polka-dot background + room frame border
- [x] Linh placeholder character (fixed overlay, scales with canvas)
- [x] Cat placeholder characters (3 color schemes, bobbing animations)
- [x] Room builder (drag-drop, move/rotate/resize/z-order, save to Supabase)
- [x] Furniture catalog (28 items, placeholder SVGs)
- [x] Photo gallery (Lightbox, upload, delete, Supabase storage)
- [x] Supabase auth (password-only login modal)
- [x] Room indicator dots
- [x] Supabase SQL setup script (`supabase-setup.sql`)

## What's Left

- [ ] Fill in Supabase `.env` values and run `supabase-setup.sql`
- [ ] Design each room individually (colors, decor, mood)
- [ ] Replace placeholder SVG furniture with real stylized art assets
- [ ] Replace placeholder Linh/Cat SVGs with real character art
- [ ] Custom welcome room design (title, intro feel)
- [ ] Decide on room 5 ("Together") purpose
- [ ] Polish: loading states, error handling, mobile touch handle sizes
- [ ] Deploy to Vercel
