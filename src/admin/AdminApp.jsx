import { Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import AdminLayout from './components/AdminLayout'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import ChroniclesAdmin from './pages/ChroniclesAdmin'
import PlacesAdmin from './pages/PlacesAdmin'
import ProfileAdmin from './pages/ProfileAdmin'
import SettingsAdmin from './pages/SettingsAdmin'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { ToastProvider } from './context/ToastContext'

export default function AdminApp() {
  return (
    <ToastProvider>
      <AdminAuthProvider>
        <ErrorBoundary>
          <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/chronicles" element={<AdminLayout><ChroniclesAdmin /></AdminLayout>} />
          <Route path="/admin/places" element={<AdminLayout><PlacesAdmin /></AdminLayout>} />
          <Route path="/admin/profile" element={<AdminLayout><ProfileAdmin /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><SettingsAdmin /></AdminLayout>} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
        </ErrorBoundary>
      </AdminAuthProvider>
    </ToastProvider>
  )
}
