import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getCurrentUser, getUserRole, isSupabaseConfigured } from '../services/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return undefined
    }

    // Check active session
    getCurrentUser().then((user) => {
      setUser(user)
      if (user) {
        getUserRole(user.id).then(({ data }) => {
          setRole(data?.role || 'citizen')
        })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        getUserRole(session.user.id).then(({ data }) => {
          setRole(data?.role || 'citizen')
        })
      } else {
        setRole(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    role,
    loading,
    isAuthenticated: !!user,
    isAdmin: role === 'super_admin' || role === 'municipal_manager',
    isStaff: role === 'municipal_staff' || role === 'department_head',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
