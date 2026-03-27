// FILE: src/features/auth/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '../../api/authApi'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password })
    const { accessToken, refreshToken, ...userInfo } = res.data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(userInfo))
    setUser(userInfo)
    return userInfo
  }, [])

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const isAdmin = user?.role === 'ADMIN'
  const isLibrarian = user?.role === 'LIBRARIAN'
  const isMember = user?.role === 'MEMBER'
  const isAdminOrLibrarian = isAdmin || isLibrarian

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isLibrarian, isMember, isAdminOrLibrarian }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
