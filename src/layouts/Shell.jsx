import { useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Download, X } from 'lucide-react'
import headerImg from '../services/headerImg'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/profile', label: 'Profile' },
  { to: '/travel-log', label: 'Travel Log' },
  { to: '/blogs', label: 'Blogs' },
]

const ROUTE_MSGS = {
  '/': [
    'Glad you are here',
    'Every Page Holds a Piece of Me.',
   
  ],
  '/profile': [
    'The Person Behind the Pages',
    'Get to know about me',
  ],
  '/travel-log': [
    'My travel journeys',
    'Destinations on the map',
  ],
  '/blogs': [
    'Read the latest blogs',
    'Headphones recommended',
  ],
}

const BOTTOM_MSGS = {
  '/': [
    'You reached the end',
    'More stuffs, waiting for you',
  ],
  '/profile': [
    'That is all about me',
    'Just a glimpse',
  ],
  '/travel-log': [
    'Tap a destination to explore',
    'Every destination has a story',
  ],
  '/blogs': [
    'Your feedback keeps me writing',
    'How were my blogs?',
    'From the Heart to the Page.',
  ],
}

export default function Shell({ children, onCvOpen }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [imgMenuOpen, setImgMenuOpen] = useState(false)
  const [imgPreviewOpen, setImgPreviewOpen] = useState(false)
  const [nearBottom, setNearBottom] = useState(false)
  const [headerMsg, setHeaderMsg] = useState('')
  const lastMsgCtxRef = useRef(null)
  const lastRouteRef = useRef(null)
  const ctxIdxRef = useRef({})
  const blogDoneTimerRef = useRef(null)
  const blogNextTimerRef = useRef(null)
  const pathRef = useRef(location.pathname)
  const nearBottomRef = useRef(nearBottom)
  const imgMenuRef = useRef(null)
  pathRef.current = location.pathname
  nearBottomRef.current = nearBottom

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  useEffect(() => {
    const onDocClick = (e) => {
      if (imgMenuRef.current && !imgMenuRef.current.contains(e.target)) setImgMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      setNearBottom(window.innerHeight + window.scrollY >= doc.scrollHeight - 200)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const msgIndexRef = useRef(-1)

  useEffect(() => {
    const path = location.pathname
    if (path !== lastRouteRef.current) {
      lastRouteRef.current = path
      ctxIdxRef.current = {}
      setNearBottom(false)
      const ctx = `${path}|top`
      lastMsgCtxRef.current = ctx
      ctxIdxRef.current[ctx] = (ctxIdxRef.current[ctx] ?? -1) + 1
      let list = ROUTE_MSGS[path] || ['Welcome']
      if (path === '/') {
        list = [...list]
        if (sessionStorage.getItem('mpw_visited')) {
          list.unshift('Hey, welcome back')
        } else {
          sessionStorage.setItem('mpw_visited', '1')
          list.unshift('Hey, welcome')
        }
      }
      setHeaderMsg(list[ctxIdxRef.current[ctx] % list.length])
      return
    }
    const ctx = `${path}|${nearBottom ? 'bottom' : 'top'}`
    if (ctx === lastMsgCtxRef.current) return
    lastMsgCtxRef.current = ctx
    ctxIdxRef.current[ctx] = (ctxIdxRef.current[ctx] ?? -1) + 1
    let list = (nearBottom ? BOTTOM_MSGS[path] : ROUTE_MSGS[path]) || ['Welcome']
    if (path === '/' && !nearBottom) {
      list = [...list]
      if (sessionStorage.getItem('mpw_visited')) {
        list.unshift('Hey, welcome back')
      } else {
        sessionStorage.setItem('mpw_visited', '1')
        list.unshift('Hey, welcome')
      }
    }
    setHeaderMsg(list[ctxIdxRef.current[ctx] % list.length])
  }, [location.pathname, nearBottom])

  useEffect(() => {
    const onBlogDone = () => {
      if (blogDoneTimerRef.current) clearTimeout(blogDoneTimerRef.current)
      if (blogNextTimerRef.current) clearTimeout(blogNextTimerRef.current)
      setHeaderMsg('Thanks for reading')
      blogNextTimerRef.current = setTimeout(() => {
        const path = pathRef.current
        const nearBottomNow = nearBottomRef.current
        const ctx = `${path}|${nearBottomNow ? 'bottom' : 'top'}`
        lastMsgCtxRef.current = ctx
        ctxIdxRef.current[ctx] = (ctxIdxRef.current[ctx] ?? -1) + 1
        const list = (nearBottomNow ? BOTTOM_MSGS[path] : ROUTE_MSGS[path]) || ['Welcome']
        setHeaderMsg(list[ctxIdxRef.current[ctx] % list.length])
      }, 4000)
    }
    window.addEventListener('blog-done', onBlogDone)
    return () => {
      window.removeEventListener('blog-done', onBlogDone)
      if (blogDoneTimerRef.current) clearTimeout(blogDoneTimerRef.current)
      if (blogNextTimerRef.current) clearTimeout(blogNextTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const onPlaying = () => setHeaderMsg('Headphones recommended')
    window.addEventListener('blog-playing', onPlaying)
    return () => window.removeEventListener('blog-playing', onPlaying)
  }, [])

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-[2000] bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative" ref={imgMenuRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setImgMenuOpen((o) => !o); }}
                className="cursor-pointer"
                aria-label="Profile options"
              >
                {headerImg ? (
                  <img src={headerImg} alt="Abilash" className="w-5 h-5 rounded-full object-cover shadow-[0_0_16px_rgba(59,130,246,0.25)]" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_16px_rgba(59,130,246,0.25)]">A</div>
                )}
              </button>

              {imgMenuOpen && (
                <div className="absolute left-0 top-7 z-[2100] w-44 rounded-xl bg-surface border border-border shadow-2xl shadow-black/40 overflow-hidden animate-fade-in">
                  <button
                    onClick={() => { setImgMenuOpen(false); setImgPreviewOpen(true); }}
                    className="w-full flex items-center gap-2 px-3.5 py-2.5 text-[12px] font-medium text-text-secondary hover:text-text hover:bg-bg transition-colors text-left cursor-pointer"
                  >
                    Preview Profile Image
                  </button>
                  <Link
                    to="/admin/login"
                    onClick={() => setImgMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3.5 py-2.5 text-[12px] font-medium text-text-secondary hover:text-text hover:bg-bg transition-colors text-left border-t border-border"
                  >
                    🔒 Restricted Access
                  </Link>
                </div>
              )}
            </div>

            {/* Live status message — mobile & tablet only */}
            <AnimatePresence mode="wait">
              <motion.span
                key={headerMsg}
                initial={{ opacity: 0, x: -8, y: 3 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 8, y: -3 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="md:hidden flex items-center gap-2 h-7 px-2.5 rounded-full bg-surface/50 border border-border/50 text-[10px] font-medium text-text-secondary whitespace-nowrap overflow-hidden"
              >
                <span className="flex items-center gap-[3px] shrink-0">
                  <motion.span
                    animate={{ opacity: [0.2, 1, 0.2], y: [0, -1.5, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    className="w-[4px] h-[4px] rounded-full bg-accent"
                  />
                  <motion.span
                    animate={{ opacity: [0.2, 1, 0.2], y: [0, -1.5, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="w-[4px] h-[4px] rounded-full bg-accent"
                  />
                  <motion.span
                    animate={{ opacity: [0.2, 1, 0.2], y: [0, -1.5, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    className="w-[4px] h-[4px] rounded-full bg-accent"
                  />
                </span>
                <span className="truncate">{headerMsg}</span>
              </motion.span>
            </AnimatePresence>
          </div>

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
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-border-hover text-[12px] font-medium text-text-secondary hover:text-text transition-all"
            >
              <ArrowUpRight size={12} />
              Portfolio
            </a>
            <div className="w-px h-4 bg-border hidden md:block" />
            <button
              onClick={onCvOpen}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-border-hover text-[12px] font-medium text-text-secondary hover:text-text transition-all cursor-pointer"
            >
              <Download size={12} />
              Data
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-surface active:bg-surface-hover cursor-pointer"
              aria-label="Toggle menu"
            >
              <span className="relative block w-4 h-[14px]">
                <span className={`absolute left-0 top-0 w-4 h-[2px] bg-text-secondary rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
                <span className={`absolute left-0 top-[6px] w-4 h-[2px] bg-text-secondary rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`absolute left-0 bottom-0 w-4 h-[2px] bg-text-secondary rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
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
              className="fixed inset-0 z-[2400] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[2450] w-[280px] bg-surface border-l border-border flex flex-col md:hidden"
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
                <div className="flex flex-col gap-1">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                  >
                    <a
                      href="https://abilash-dev.onrender.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg border border-border hover:border-border-hover text-[14px] font-medium text-text-secondary hover:text-text transition-all"
                    >
                      <ArrowUpRight size={14} />
                      Portfolio
                    </a>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
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

      {/* Profile image preview */}
      <AnimatePresence>
        {imgPreviewOpen && headerImg && (
          <motion.div
            className="fixed inset-0 z-[3000] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setImgPreviewOpen(false)} />
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => setImgPreviewOpen(false)}
                className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-text-tertiary hover:text-text hover:border-border-hover transition-all cursor-pointer z-10"
              >
                <X size={13} />
              </button>
              <img
                src={headerImg}
                alt="Abilash"
                className="w-72 h-72 sm:w-80 sm:h-80 rounded-3xl object-cover shadow-[0_0_80px_rgba(59,130,246,0.25)] border border-border"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
