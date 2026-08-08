import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import AdminLayout from './components/AdminLayout'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import ChroniclesAdmin from './pages/ChroniclesAdmin'
import PlacesAdmin from './pages/PlacesAdmin'
import ProfileAdmin from './pages/ProfileAdmin'
import VisitorsAdmin from './pages/VisitorsAdmin'
import SettingsAdmin from './pages/SettingsAdmin'
import { useAdminAuth, AdminAuthProvider } from './context/AdminAuthContext'
import { AdminDataProvider } from './context/AdminDataContext'
import { ToastProvider } from './context/ToastContext'

// Inactivity rule for the whole admin area (login page AND dashboard pages):
// after 1 minute without interaction the admin session is destroyed and the
// user is returned to the public homepage with a session-timeout prompt.
const INACTIVITY_MS = 60 * 1000
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click', 'input', 'pointermove']

function AdminInactivityWatcher() {
  const { logout } = useAdminAuth()

  useEffect(() => {
    let timer = null
    const expire = () => {
      logout().finally(() => { window.location.assign('/?session_timeout=1') })
    }
    const reset = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(expire, INACTIVITY_MS)
    }
    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, reset, { passive: true }))
    reset()
    return () => {
      if (timer) clearTimeout(timer)
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, reset))
    }
  }, [logout])

  return null
}

export default function AdminApp() {
  return (
    <ToastProvider>
      <AdminAuthProvider>
        <AdminDataProvider>
          <AdminInactivityWatcher />
          <ErrorBoundary>
            <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/chronicles" element={<AdminLayout><ChroniclesAdmin /></AdminLayout>} />
            <Route path="/admin/places" element={<AdminLayout><PlacesAdmin /></AdminLayout>} />
            <Route path="/admin/profile" element={<AdminLayout><ProfileAdmin /></AdminLayout>} />
            <Route path="/admin/visitors" element={<AdminLayout><VisitorsAdmin /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><SettingsAdmin /></AdminLayout>} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
          </ErrorBoundary>
        </AdminDataProvider>
      </AdminAuthProvider>
    </ToastProvider>
  )
}
