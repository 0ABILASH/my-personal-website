import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Screenshot protection — deterrent only (not bulletproof)
;(function () {
  if (typeof document === 'undefined') return

  // Block right-click
  document.addEventListener('contextmenu', function (e) { e.preventDefault() }, true)

  // Block PrintScreen key
  document.addEventListener('keydown', function (e) {
    // PrintScreen
    if (e.key === 'PrintScreen') { e.preventDefault(); return }
    // Ctrl+Shift+S (Firefox screenshot)
    if (e.ctrlKey && e.shiftKey && e.key === 'S') { e.preventDefault(); return }
    // Ctrl+P (Print)
    if (e.ctrlKey && e.key === 'p') { e.preventDefault(); return }
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') { e.preventDefault(); return }
    // Ctrl+Shift+I / Ctrl+Shift+J / F12 (DevTools)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) { e.preventDefault(); return }
    if (e.key === 'F12') { e.preventDefault(); return }
  }, true)

  // Block image dragging
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') e.preventDefault()
  }, true)
})()

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
