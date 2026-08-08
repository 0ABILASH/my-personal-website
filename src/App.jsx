import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState, useCallback } from 'react'

import Shell from './layouts/Shell'
import DownloadModal from './components/DownloadModal'
import TimeoutModal from './components/TimeoutModal'
import Home from './pages/Home'
import TravelLog from './pages/TravelLog'
import Blogs from './pages/Blogs'
import Profile from './pages/Profile'
import AdminApp from './admin/AdminApp'
import { trackVisitor } from './services/track'
import { preloadAll } from './services/preload'

const TIMEOUT_MS = 60 * 1000

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const [cvOpen, setCvOpen] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const lastActivity = useRef(Date.now())
  const timerRef = useRef(null)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  const resetTimer = useCallback(() => {
    lastActivity.current = Date.now()
    setTimedOut(false)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (Date.now() - lastActivity.current >= TIMEOUT_MS) {
        clearInterval(timerRef.current)
        setTimedOut(true)
      }
    }, 5000)
  }, [])

  const handleRetry = useCallback(() => {
    trackVisitor('retry')
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    if (isAdmin) return
    trackVisitor('pageview')
    resetTimer()
    preloadAll()

    const handler = () => {
      if (!timedOut) lastActivity.current = Date.now()
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, handler))

    return () => {
      events.forEach(e => window.removeEventListener(e, handler))
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [resetTimer, isAdmin])

  // Show the Session Timeout modal when the admin area redirects here after
  // an inactivity expiry, then clean the flag out of the URL.
  useEffect(() => {
    if (isAdmin) return
    const params = new URLSearchParams(window.location.search)
    if (params.get('session_timeout') === '1') {
      setTimedOut(true)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [isAdmin])

  return (
    <>
      <ScrollToTop />
      {isAdmin ? (
        <AdminApp />
      ) : (
        <>
          <Shell onCvOpen={() => setCvOpen(true)}>
            <Routes>
              <Route path="/" element={<Home onCvOpen={() => setCvOpen(true)} />} />
              <Route path="/travel-log" element={<TravelLog />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Shell>
          <DownloadModal open={cvOpen} onClose={() => setCvOpen(false)} />
          {timedOut && <TimeoutModal onRetry={handleRetry} />}
        </>
      )}
    </>
  )
}
