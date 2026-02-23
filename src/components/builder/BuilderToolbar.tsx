interface BuilderToolbarProps {
  onSave:   () => void
  onCancel: () => void
  saving?:  boolean
}

export function BuilderToolbar({ onSave, onCancel, saving }: BuilderToolbarProps) {
  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] flex items-center gap-3 animate-slide-up"
      style={{
        background: 'white',
        borderRadius: 999,
        padding: '10px 20px',
        boxShadow: '0 4px 0 rgba(61,44,44,0.15), 0 8px 24px rgba(61,44,44,0.12)',
        fontFamily: 'var(--font-hand)',
      }}
    >
      <span style={{ color: 'var(--ink)', fontSize: 16 }}>✏️ Decorating...</span>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <button
        onClick={onCancel}
        className="px-4 py-1.5 rounded-full transition-all active:scale-95 text-sm font-semibold"
        style={{ background: '#f0f0f0', color: 'var(--ink)' }}
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="px-5 py-1.5 rounded-full transition-all active:scale-95 text-sm font-bold disabled:opacity-60"
        style={{
          background: 'var(--pink)',
          color: 'var(--ink)',
          boxShadow: '0 3px 0 var(--pink-deep)',
        }}
      >
        {saving ? 'Saving...' : '💾 Save room'}
      </button>
    </div>
  )
}
