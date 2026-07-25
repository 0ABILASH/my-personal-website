import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

;(function () {
  if (typeof document === 'undefined') return

  var block = document.getElementById('screenshot-block')

  // Hide page content — show black screen
  function hideContent() {
    document.documentElement.style.background = '#000'
    document.body.style.background = '#000'
    document.body.style.overflow = 'hidden'
    var root = document.getElementById('root')
    if (root) root.style.visibility = 'hidden'
    if (block) block.style.display = 'block'
  }

  // Restore page content
  function showContent() {
    document.documentElement.style.background = ''
    document.body.style.background = ''
    document.body.style.overflow = ''
    var root = document.getElementById('root')
    if (root) root.style.visibility = 'visible'
    if (block) block.style.display = 'none'
  }

  // Page loses focus (user tabs away, opens snipping tool, etc.)
  window.addEventListener('blur', hideContent)
  window.addEventListener('focus', showContent)

  // Page visibility change (alt-tab, minimized, etc.)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      hideContent()
    } else {
      showContent()
    }
  })

  // Block right-click
  document.addEventListener('contextmenu', function (e) { e.preventDefault() }, true)

  // Block dangerous keys
  document.addEventListener('keydown', function (e) {
    if (e.key === 'PrintScreen') { e.preventDefault(); hideContent(); setTimeout(showContent, 800); return }
    if (e.ctrlKey && e.shiftKey && e.key === 'S') { e.preventDefault(); return }
    if (e.ctrlKey && e.key === 'p') { e.preventDefault(); return }
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
