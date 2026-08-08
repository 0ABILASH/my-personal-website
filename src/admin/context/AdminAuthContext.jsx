import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { adminApi } from '../services/adminApi'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [status, setStatus] = useState('loading') // loading | authenticated | anonymous
  const [user, setUser] = useState(null)

  // Verify the session against the server on load. This makes full page
  // reloads of /admin/* work (the HttpOnly cookie survives a refresh), so the
  // dashboard never bounces to the homepage or shows a blank page.
  useEffect(() => {
    let mounted = true
    adminApi.session()
      .then((res) => {
        if (!mounted) return
        if (res && res.authenticated) {
          setStatus('authenticated')
          setUser({ username: res.username || 'admin' })
        } else {
          setStatus('anonymous')
          setUser(null)
        }
      })
      .catch(() => {
        if (mounted) {
          setStatus('anonymous')
          setUser(null)
        }
      })
    return () => { mounted = false }
  }, [])

  const login = useCallback(async (username, password) => {
    await adminApi.login(username, password)
    setStatus('authenticated')
    setUser({ username })
  }, [])

  const logout = useCallback(async () => {
    try { await adminApi.logout() } catch (e) {}
    setStatus('anonymous')
    setUser(null)
  }, [])

  const value = { status, user, login, logout }
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
