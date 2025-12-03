'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, username?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  verifyPassword: (email: string, password: string) => Promise<{ valid: boolean; error?: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signUp = async (email: string, password: string, username?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || null,
        },
      },
    })
    return { error }
  }

  const verifyPassword = async (email: string, password: string) => {
    try {
      // Create a temporary client to verify credentials without persisting session
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        // Check if it's a network error (missing env vars)
        if (error.message?.includes('Failed to fetch') || error.message?.includes('fetch')) {
          console.error('❌ Network error: Check if Supabase environment variables are set correctly')
          return { 
            valid: false, 
            error: {
              ...error,
              message: 'Unable to connect to authentication service. Please check your configuration.'
            }
          }
        }
        return { valid: false, error }
      }
      
      // Immediately sign out to prevent session creation
      await supabase.auth.signOut()
      return { valid: true }
    } catch (err: any) {
      // Catch network errors
      if (err?.message?.includes('fetch') || err?.message?.includes('Failed to fetch')) {
        console.error('❌ Network error during password verification:', err)
        return {
          valid: false,
          error: {
            message: 'Network error: Unable to connect to authentication service. Please check your Supabase configuration.',
            name: 'NetworkError'
          }
        }
      }
      throw err
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      // Check if it's a network error (missing env vars)
      if (error && (error.message?.includes('Failed to fetch') || error.message?.includes('fetch'))) {
        console.error('❌ Network error: Check if Supabase environment variables are set correctly')
        return {
          error: {
            ...error,
            message: 'Unable to connect to authentication service. Please check your configuration.'
          }
        }
      }
      
      return { error }
    } catch (err: any) {
      // Catch network errors
      if (err?.message?.includes('fetch') || err?.message?.includes('Failed to fetch')) {
        console.error('❌ Network error during sign in:', err)
        return {
          error: {
            message: 'Network error: Unable to connect to authentication service. Please check your Supabase configuration.',
            name: 'NetworkError'
          }
        }
      }
      throw err
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    router.push('/signin')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        verifyPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

