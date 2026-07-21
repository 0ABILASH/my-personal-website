import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState, useCallback } from 'react'

import Shell from './layouts/Shell'
import CvModal from './components/CvModal'
import TimeoutModal from './components/TimeoutModal'
import Home from './pages/Home'
import Space from './pages/Space'
import Writing from './pages/Writing'
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
          <Route path="/travel-log" element={<Space />} />
          <Route path="/blogs" element={<Writing />} />
          <Route path="/profile" element={<Profile onCvOpen={() => setCvOpen(true)} />} />
        </Routes>
      </Shell>
      <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />
      {timedOut && <TimeoutModal onRetry={handleRetry} />}
    </>
  )
}
