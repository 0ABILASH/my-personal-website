import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState, useCallback } from 'react'

import Shell from './layouts/Shell'
import DownloadModal from './components/DownloadModal'
import TimeoutModal from './components/TimeoutModal'
import Home from './pages/Home'
import TravelLog from './pages/TravelLog'
import Blogs from './pages/Blogs'
import Profile from './pages/Profile'
import { trackVisitor } from './services/track'

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
    trackVisitor('pageview')
    resetTimer()

    const handler = () => {
      if (!timedOut) lastActivity.current = Date.now()
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, handler))

    return () => {
      events.forEach(e => window.removeEventListener(e, handler))
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [resetTimer])

  return (
    <>
      <ScrollToTop />
      <Shell onCvOpen={() => setCvOpen(true)}>
        <Routes>
          <Route path="/" element={<Home onCvOpen={() => setCvOpen(true)} />} />
          <Route path="/travel-log" element={<TravelLog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/profile" element={<Profile onCvOpen={() => setCvOpen(true)} />} />
        </Routes>
      </Shell>
      <DownloadModal open={cvOpen} onClose={() => setCvOpen(false)} />
      {timedOut && <TimeoutModal onRetry={handleRetry} />}
    </>
  )
}
