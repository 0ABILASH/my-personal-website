import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

;(function () {
  if (typeof document === 'undefined') return

  var block = document.getElementById('screenshot-block')

  function hideContent() {
    if (block) block.style.display = 'block'
    document.body.classList.add('screenshot-hide')
  }

  function showContent() {
    if (block) block.style.display = 'none'
    document.body.classList.remove('screenshot-hide')
  }

  // Hide on blur (alt-tab, snipping tool overlay)
  window.addEventListener('blur', hideContent)
  window.addEventListener('focus', showContent)

  // Hide on visibility change (tab switch, minimize)
  document.addEventListener('visibilitychange', function () {
    document.hidden ? hideContent() : showContent()
  })

  // Block right-click
  document.addEventListener('contextmenu', function (e) { e.preventDefault() }, true)

  // Block dangerous keys
  document.addEventListener('keydown', function (e) {
    if (e.key === 'PrintScreen') { e.preventDefault(); hideContent(); setTimeout(showContent, 1000); return }
    if (e.ctrlKey && e.shiftKey && e.key === 'S') { e.preventDefault(); hideContent(); setTimeout(showContent, 1000); return }
    if (e.ctrlKey && e.key === 'p') { e.preventDefault(); hideContent(); setTimeout(showContent, 1000); return }
    if (e.ctrlKey && e.key === 'u') { e.preventDefault(); return }
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
