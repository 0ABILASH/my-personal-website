import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Download } from 'lucide-react'
import profileImg from '../services/profileImg'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/profile', label: 'Profile' },
  { to: '/travel-log', label: 'Travel Log' },
  { to: '/blogs', label: 'Blogs' },
]

export default function Shell({ children, onCvOpen }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-[2000] bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
            {profileImg ? (
              <img src={profileImg} alt="Abilash" className="w-7 h-7 rounded-full object-cover shadow-[0_0_16px_rgba(59,130,246,0.25)]" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_16px_rgba(59,130,246,0.25)]">A</div>
            )}
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
            <a
              href="https://abilash-dev.onrender.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-border-hover text-[12px] font-medium text-text-secondary hover:text-text transition-all"
            >
              <ArrowUpRight size={12} />
              Portfolio
            </a>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <button
              onClick={onCvOpen}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-border-hover text-[12px] font-medium text-text-secondary hover:text-text transition-all cursor-pointer"
            >
              <Download size={12} />
              Data
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center hover:border-border-hover transition-all cursor-pointer"
              aria-label="Toggle menu"
            >
              <span className="flex flex-col gap-[5px] w-3.5">
                <span className={`block h-[1.5px] bg-text-secondary rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${mobileOpen ? 'rotate-45 translate-y-[3.25px]' : ''}`} />
                <span className={`block h-[1.5px] bg-text-secondary rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${mobileOpen ? '-rotate-45 -translate-y-[3.25px]' : ''}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-surface border-l border-border flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-5 h-14 border-b border-border">
                <span className="text-[13px] font-semibold text-text">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-7 h-7 rounded-lg bg-bg border border-border flex items-center justify-center hover:border-border-hover transition-all cursor-pointer"
                >
                  <span className="block w-3 h-[1.5px] bg-text-secondary rounded-full rotate-45 translate-y-[0px] absolute" />
                  <span className="block w-3 h-[1.5px] bg-text-secondary rounded-full -rotate-45 translate-y-[0px] absolute" />
                </button>
              </div>
              <nav className="flex-1 flex flex-col p-3 gap-1">
                {NAV.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all ${
                        isActive(link.to)
                          ? 'bg-accent-soft text-accent border border-accent/20'
                          : 'text-text-secondary hover:text-text hover:bg-bg border border-transparent'
                      }`}
                    >
                      <span className="text-[10px] text-text-quaternary w-4 text-right font-mono">{String(i + 1).padStart(2, '0')}</span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="p-3 border-t border-border">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                >
                  <button
                    onClick={() => { onCvOpen(); setMobileOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg border border-border hover:border-border-hover text-[14px] font-medium text-text-secondary hover:text-text transition-all w-full cursor-pointer"
                  >
                    <Download size={14} />
                    Download Data
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
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
