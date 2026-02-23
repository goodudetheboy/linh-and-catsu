import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { WashiTape } from './WashiTape'

interface LoginModalProps {
  onClose: () => void
}

export function LoginModal({ onClose }: LoginModalProps) {
  const { signIn, error } = useAuth()
  const [password, setPassword]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [shaking, setShaking]     = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const ok = await signIn(password)
    setLoading(false)
    if (ok) {
      onClose()
    } else {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(61,44,44,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="animate-pop-in relative bg-white rounded-2xl p-8 w-80 shadow-xl"
        style={{ transform: 'rotate(-1deg)', boxShadow: '4px 6px 0 rgba(61,44,44,0.15)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Washi tape accent */}
        <WashiTape color="#f9c6d0" width={80} angle={-8} style={{ top: -10, left: 20 }} />
        <WashiTape color="#d5c8f0" width={60} angle={5}  style={{ top: -8, right: 30 }} />

        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🔐</div>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-hand)', color: 'var(--ink)' }}
          >
            It's Linh only here!
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--ink-light)' }}>
            Enter your password to decorate
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password..."
            autoFocus
            className={`
              w-full px-4 py-3 rounded-xl border-2 text-center text-lg outline-none transition-all
              ${shaking ? 'animate-[shake_0.4s_ease]' : ''}
            `}
            style={{
              fontFamily: 'var(--font-hand)',
              borderColor: error ? 'var(--pink-deep)' : 'var(--lavender)',
              background: '#fdf6ee',
            }}
          />
          {error && (
            <p className="text-center text-sm" style={{ color: 'var(--pink-deep)', fontFamily: 'var(--font-hand)' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50"
            style={{
              fontFamily: 'var(--font-hand)',
              background: 'var(--pink)',
              color: 'var(--ink)',
              boxShadow: '0 3px 0 var(--pink-deep)',
            }}
          >
            {loading ? 'Checking...' : 'Let me in! 🐱'}
          </button>
        </form>
      </div>
    </div>
  )
}
