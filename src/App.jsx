import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import Shell from './layouts/Shell'
import CvModal from './components/CvModal'
import Home from './pages/Home'
import Space from './pages/Space'
import Writing from './pages/Writing'
import Profile from './pages/Profile'
import { useState } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const [cvOpen, setCvOpen] = useState(false)

  return (
    <>
      <ScrollToTop />
      <Shell onCvOpen={() => setCvOpen(true)}>
        <Routes>
          <Route path="/" element={<Home onCvOpen={() => setCvOpen(true)} />} />
          <Route path="/space" element={<Space />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/profile" element={<Profile onCvOpen={() => setCvOpen(true)} />} />
        </Routes>
      </Shell>
      <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  )
}
