import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Download, Menu, X } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/space', label: 'Space' },
  { to: '/writing', label: 'Writing' },
  { to: '/profile', label: 'Profile' },
]

export default function Shell({ children, onCvOpen }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_16px_rgba(124,106,255,0.25)]">A</div>
            <span className="text-[13px] font-semibold tracking-tight text-text group-hover:text-accent transition-colors">Abilash</span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {NAV.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-accent-soft text-accent'
                    : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-hover'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onCvOpen}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-border-hover text-[12px] font-medium text-text-secondary hover:text-text transition-all cursor-pointer"
            >
              <Download size={12} />
              CV
            </button>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex w-7 h-7 items-center justify-center text-text-quaternary hover:text-text-secondary transition-colors"
            >
              <ArrowUpRight size={14} />
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-text-tertiary hover:text-text hover:border-border-hover transition-all cursor-pointer"
            >
              {mobileOpen ? <X size={13} /> : <Menu size={13} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-14 left-0 right-0 z-40 bg-bg/95 backdrop-blur-xl border-b border-border overflow-hidden md:hidden"
          >
            <div className="px-5 py-3 flex flex-col gap-0.5">
              {NAV.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                    isActive(link.to)
                      ? 'bg-accent-soft text-accent'
                      : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-hover'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-border my-1.5" />
              <button
                onClick={() => { onCvOpen(); setMobileOpen(false); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-all text-left cursor-pointer"
              >
                <Download size={13} />
                Download CV
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
