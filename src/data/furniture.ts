export type FurnitureCategory = 'furniture' | 'plants' | 'decor' | 'cute' | 'frames'

export interface FurnitureItem {
  id: string
  label: string
  category: FurnitureCategory
  assetPath: string
  defaultWidth: number  // px
  defaultHeight: number // px
}

export const FURNITURE_CATALOG: FurnitureItem[] = [
  // ── Furniture ──────────────────────────────────────────────────
  { id: 'sofa',        label: 'Sofa',         category: 'furniture', assetPath: '/assets/furniture/sofa.svg',        defaultWidth: 180, defaultHeight: 100 },
  { id: 'bookshelf',   label: 'Bookshelf',    category: 'furniture', assetPath: '/assets/furniture/bookshelf.svg',   defaultWidth: 100, defaultHeight: 160 },
  { id: 'desk',        label: 'Desk',         category: 'furniture', assetPath: '/assets/furniture/desk.svg',        defaultWidth: 140, defaultHeight: 90  },
  { id: 'bed',         label: 'Bed',          category: 'furniture', assetPath: '/assets/furniture/bed.svg',         defaultWidth: 160, defaultHeight: 120 },
  { id: 'wardrobe',    label: 'Wardrobe',     category: 'furniture', assetPath: '/assets/furniture/wardrobe.svg',    defaultWidth: 110, defaultHeight: 160 },
  { id: 'rug',         label: 'Rug',          category: 'furniture', assetPath: '/assets/furniture/rug.svg',         defaultWidth: 180, defaultHeight: 100 },
  { id: 'lamp',        label: 'Floor Lamp',   category: 'furniture', assetPath: '/assets/furniture/lamp.svg',        defaultWidth: 60,  defaultHeight: 160 },
  { id: 'cat-tree',    label: 'Cat Tree',     category: 'furniture', assetPath: '/assets/furniture/cat-tree.svg',    defaultWidth: 100, defaultHeight: 180 },

  // ── Plants ─────────────────────────────────────────────────────
  { id: 'plant-big',   label: 'Monstera',     category: 'plants',    assetPath: '/assets/furniture/plant-big.svg',   defaultWidth: 90,  defaultHeight: 130 },
  { id: 'plant-small', label: 'Succulent',    category: 'plants',    assetPath: '/assets/furniture/plant-small.svg', defaultWidth: 50,  defaultHeight: 60  },
  { id: 'plant-hang',  label: 'Hanging',      category: 'plants',    assetPath: '/assets/furniture/plant-hang.svg',  defaultWidth: 70,  defaultHeight: 100 },

  // ── Decor ──────────────────────────────────────────────────────
  { id: 'fairy-lights',label: 'Fairy Lights', category: 'decor',     assetPath: '/assets/furniture/fairy-lights.svg',defaultWidth: 200, defaultHeight: 60  },
  { id: 'banner',      label: 'Banner',       category: 'decor',     assetPath: '/assets/furniture/banner.svg',      defaultWidth: 200, defaultHeight: 60  },
  { id: 'clock',       label: 'Clock',        category: 'decor',     assetPath: '/assets/furniture/clock.svg',       defaultWidth: 70,  defaultHeight: 70  },
  { id: 'window',      label: 'Window',       category: 'decor',     assetPath: '/assets/furniture/window.svg',      defaultWidth: 120, defaultHeight: 140 },
  { id: 'curtain',     label: 'Curtain',      category: 'decor',     assetPath: '/assets/furniture/curtain.svg',     defaultWidth: 140, defaultHeight: 180 },

  // ── Cute ───────────────────────────────────────────────────────
  { id: 'star-sticker', label: 'Star',        category: 'cute',      assetPath: '/assets/furniture/star.svg',        defaultWidth: 50,  defaultHeight: 50  },
  { id: 'heart',        label: 'Heart',       category: 'cute',      assetPath: '/assets/furniture/heart.svg',       defaultWidth: 50,  defaultHeight: 50  },
  { id: 'ribbon',       label: 'Ribbon',      category: 'cute',      assetPath: '/assets/furniture/ribbon.svg',      defaultWidth: 80,  defaultHeight: 60  },
  { id: 'bow',          label: 'Bow',         category: 'cute',      assetPath: '/assets/furniture/bow.svg',         defaultWidth: 70,  defaultHeight: 50  },
  { id: 'paw',          label: 'Paw Print',   category: 'cute',      assetPath: '/assets/furniture/paw.svg',         defaultWidth: 45,  defaultHeight: 45  },
  { id: 'mushroom',     label: 'Mushroom',    category: 'cute',      assetPath: '/assets/furniture/mushroom.svg',    defaultWidth: 55,  defaultHeight: 65  },

  // ── Frames ─────────────────────────────────────────────────────
  { id: 'frame-square', label: 'Square Frame',category: 'frames',    assetPath: '/assets/furniture/frame-square.svg',defaultWidth: 120, defaultHeight: 120 },
  { id: 'frame-wide',   label: 'Wide Frame',  category: 'frames',    assetPath: '/assets/furniture/frame-wide.svg',  defaultWidth: 160, defaultHeight: 120 },
  { id: 'frame-tall',   label: 'Tall Frame',  category: 'frames',    assetPath: '/assets/furniture/frame-tall.svg',  defaultWidth: 100, defaultHeight: 140 },
  { id: 'polaroid',     label: 'Polaroid',    category: 'frames',    assetPath: '/assets/furniture/polaroid.svg',    defaultWidth: 100, defaultHeight: 120 },
]

export const getFurnitureById = (id: string) =>
  FURNITURE_CATALOG.find((f) => f.id === id) ?? null

export const getFurnitureByCategory = (cat: FurnitureCategory) =>
  FURNITURE_CATALOG.filter((f) => f.category === cat)

export const CATEGORIES: { id: FurnitureCategory; label: string; emoji: string }[] = [
  { id: 'furniture', label: 'Furniture', emoji: '🛋️' },
  { id: 'plants',    label: 'Plants',    emoji: '🌿' },
  { id: 'decor',     label: 'Decor',     emoji: '✨' },
  { id: 'cute',      label: 'Cute',      emoji: '🎀' },
  { id: 'frames',    label: 'Frames',    emoji: '🖼️' },
]
