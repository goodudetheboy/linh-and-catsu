import { useDraggable } from '@dnd-kit/core'
import type { FurnitureItem } from '../../data/furniture'

interface FurnitureCardProps {
  item: FurnitureItem
}

export function FurnitureCard({ item }: FurnitureCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `catalog-${item.id}`,
    data: { type: 'catalog', itemId: item.id },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing select-none"
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <div
        className="paper-card rounded-xl flex items-center justify-center overflow-hidden"
        style={{ width: 72, height: 72, padding: 6 }}
      >
        <img
          src={item.assetPath}
          alt={item.label}
          className="w-full h-full object-contain pointer-events-none"
          onError={(e) => {
            // Fallback colored square if asset missing
            const t = e.currentTarget
            t.style.display = 'none'
            const parent = t.parentElement
            if (parent && !parent.querySelector('.placeholder-block')) {
              const div = document.createElement('div')
              div.className = 'placeholder-block w-full h-full rounded-lg'
              div.style.background = 'var(--lavender)'
              parent.appendChild(div)
            }
          }}
        />
      </div>
      <span
        className="text-xs text-center leading-tight"
        style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink)', maxWidth: 72 }}
      >
        {item.label}
      </span>
    </div>
  )
}
