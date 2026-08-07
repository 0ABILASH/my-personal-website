import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { adminApi } from '../services/adminApi'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [status, setStatus] = useState('loading') // loading | authenticated | anonymous
  const [user, setUser] = useState(null)

  // Phase 16 requirement: every full load/refresh of the admin dashboard
  // invalidates the server-side admin session, so the user always lands on the
  // login screen after a refresh. In-app navigation (which never remounts this
  // provider) keeps the session alive while working.
  useEffect(() => {
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
