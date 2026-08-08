import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { adminApi } from '../services/adminApi'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [status, setStatus] = useState('loading') // loading | authenticated | anonymous
  const [user, setUser] = useState(null)

  // Security: the admin area must only be entered from the site's profile-image
  // menu (which sets the admin_safe_entry marker for SPA navigation). Any full
  // page load of an /admin URL (refresh or typing it directly) destroys the
  // session and bounces back to the homepage.
  useEffect(() => {
    const safeEntry = sessionStorage.getItem('admin_safe_entry')
    sessionStorage.removeItem('admin_safe_entry')
    if (safeEntry !== '1') {
      adminApi.logout().catch(() => {})
      window.location.assign('/')
      return
    }
    let mounted = true
    adminApi.logout()
      .catch(() => {})
      .finally(() => {
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
