import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, PenLine, MapPin,
  User, Settings, LogOut, Menu, X, Globe,
} from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'
import { LoadingState } from './ui'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/profile', label: 'Profile', icon: User },
  { to: '/admin/places', label: 'Travel Logs', icon: MapPin },
  { to: '/admin/chronicles', label: 'Blogs', icon: PenLine },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

function SidebarContent({ onNavigate }) {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-[12px] font-black text-white shadow-[0_0_16px_rgba(59,130,246,0.35)]">A</div>
        <div className="min-w-0">
          <div className="text-[13px] font-black tracking-tight leading-none">ABILASH</div>
          <div className="text-[9px] font-mono text-accent tracking-[0.2em] uppercase mt-1">Admin</div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-0.5 p-3 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon
          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={
                'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium transition-all ' +
                (active
                  ? 'bg-accent-soft text-accent border border-accent/20'
                  : 'text-text-secondary hover:text-text hover:bg-surface border border-transparent')
              }
            >
              <Icon size={15} className={active ? 'text-accent' : ''} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border flex flex-col gap-1">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium text-text-secondary hover:text-text hover:bg-surface transition-all"
        >
          <Globe size={15} />
          View Website
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium text-red-400/90 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer text-left"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }) {
  const { status } = useAdminAuth()
  const [drawer, setDrawer] = useState(false)
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-bg text-text">
        <LoadingState label="Checking session..." />
      </div>
    )
  }

  if (status === 'anonymous') {
    return <Navigate to={'/admin/login' + location.search} replace />
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-60 bg-surface/40 backdrop-blur-xl border-r border-border z-[3000]">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="lg:hidden fixed inset-0 z-[3100]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-64 bg-surface border-r border-border flex flex-col">
            <button
              onClick={() => setDrawer(false)}
              className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-bg border border-border flex items-center justify-center text-text-tertiary cursor-pointer"
            >
              <X size={13} />
            </button>
            <SidebarContent onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-[3000] h-14 bg-bg/85 backdrop-blur-xl border-b border-border flex items-center justify-between px-4">
        <button
          onClick={() => setDrawer(true)}
          className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-text-secondary cursor-pointer"
        >
          <Menu size={16} />
        </button>
        <span className="text-[12px] font-bold tracking-tight">ABILASH · Admin</span>
        <span className="w-9" />
      </header>

      <main className="lg:ml-60 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</div>
      </main>
    </div>
  )
}
