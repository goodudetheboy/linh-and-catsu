import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

const LINH_EMAIL = import.meta.env.VITE_LINH_EMAIL as string

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (password: string) => {
    setError(null)
    const { error: err } = await supabase.auth.signInWithPassword({
      email: LINH_EMAIL,
      password,
    })
    if (err) {
      setError('Wrong password, try again!')
      return false
    }
    return true
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    signIn,
    signOut,
  }
}
