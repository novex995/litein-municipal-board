import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const isPlaceholder = (value) => {
  if (!value) return true
  const normalized = value.toLowerCase()
  return normalized.startsWith('your_') || normalized.includes('your_supabase')
}

const isValidUrl = (value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export const isSupabaseConfigured =
  isValidUrl(supabaseUrl) && !isPlaceholder(supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const supabaseConfigError = new Error(
  'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env.'
)

const unavailable = () => ({ data: null, error: supabaseConfigError })

// Auth helpers
export const signUp = async (email, password, userData) => {
  if (!supabase) return unavailable()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  if (!supabase) return unavailable()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  if (!supabase) return { error: supabaseConfigError }

  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  if (!supabase) return null

  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getUserRole = async (userId) => {
  if (!supabase) return unavailable()

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()
  return { data, error }
}
