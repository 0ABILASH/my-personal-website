import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Screenshot protection — deterrent only (not bulletproof)
;(function () {
  if (typeof document === 'undefined') return
  var block = document.getElementById('screenshot-block')

  function flashBlack() {
    if (!block) return
    block.style.display = 'block'
    setTimeout(function () { block.style.display = 'none' }, 500)
  }

  // Block right-click
  document.addEventListener('contextmenu', function (e) { e.preventDefault() }, true)

  // Block keys + flash black on PrintScreen
  document.addEventListener('keydown', function (e) {
    if (e.key === 'PrintScreen') { e.preventDefault(); flashBlack(); return }
    if (e.ctrlKey && e.shiftKey && e.key === 'S') { e.preventDefault(); flashBlack(); return }
    if (e.ctrlKey && e.key === 'p') { e.preventDefault(); flashBlack(); return }
    if (e.ctrlKey && e.key === 'u') { e.preventDefault(); return }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) { e.preventDefault(); return }
    if (e.key === 'F12') { e.preventDefault(); return }
  }, true)

  // Block image dragging
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') e.preventDefault()
  }, true)

  // Flash black when window loses focus (snipping tools trigger this)
  window.addEventListener('blur', function () { flashBlack() })

  // CSS print protection — already handled in index.css @media print
})()

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
