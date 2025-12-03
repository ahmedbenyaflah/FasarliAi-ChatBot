import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Runtime check - warn if env vars are missing (client-side only)
  if (typeof window !== 'undefined') {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ CRITICAL: Missing Supabase environment variables!')
      console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || '❌ MISSING')
      console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ SET' : '❌ MISSING')
      console.error('')
      console.error('🔧 To fix this:')
      console.error('1. Go to Railway Dashboard → Frontend Service → Variables')
      console.error('2. Add these environment variables:')
      console.error('   - NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
      console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key')
      console.error('3. Redeploy the service')
      console.error('')
      console.error('This will cause "Failed to fetch" errors until fixed!')
    } else {
      // Validate URL format
      if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
        console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL should start with http:// or https://')
      }
    }
  }

  // During build time, env vars might not be available
  // Return a client with placeholder values to prevent build failures
  if (!supabaseUrl || !supabaseAnonKey) {
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}

