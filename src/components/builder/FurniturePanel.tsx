import { useState } from 'react'
import { CATEGORIES, getFurnitureByCategory } from '../../data/furniture'
import type { FurnitureCategory } from '../../data/furniture'
import { FurnitureCard } from './FurnitureCard'

interface FurniturePanelProps {
  visible: boolean
}

export function FurniturePanel({ visible }: FurniturePanelProps) {
  const [activeCategory, setActiveCategory] = useState<FurnitureCategory>('furniture')
  const items = getFurnitureByCategory(activeCategory)

  if (!visible) return null

  return (
    <div
      data-furniture-panel
      className="fixed bottom-0 left-0 right-0 z-[110] animate-slide-up"
      style={{
        background: 'var(--cream)',
        borderTop: '3px solid var(--pink)',
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -4px 24px rgba(61,44,44,0.12)',
        maxHeight: '40vh',
      }}
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1.5 rounded-full" style={{ background: 'var(--pink)' }} />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 px-4 pb-2 overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={{
              fontFamily: 'var(--font-hand)',
              background: activeCategory === cat.id ? 'var(--pink)' : 'white',
              color: 'var(--ink)',
              boxShadow: activeCategory === cat.id ? '0 2px 0 var(--pink-deep)' : '0 2px 0 #ddd',
              fontSize: 14,
            }}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div
        className="px-4 pb-4 overflow-x-auto"
        style={{ maxHeight: 'calc(40vh - 80px)' }}
      >
        <div className="flex flex-wrap gap-3 py-2">
          {items.map((item) => (
            <FurnitureCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
