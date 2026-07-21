import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Globe } from 'lucide-react'
import { SHEETS_URL, FALLBACK_PLACES, renderLayers } from '../services/map'

export default function Space() {
  const [sheetData, setSheetData] = useState(null)
  const [activePlace, setActivePlace] = useState(null)
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const mapReady = useRef(false)

  const places = sheetData
    ? (sheetData.places || []).filter(p => p.lat && p.lng)
    : FALLBACK_PLACES

  useEffect(() => {
    if (!SHEETS_URL) return
    fetch(`${SHEETS_URL}?action=travel`)
      .then(r => r.json())
      .then(data => setSheetData(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return
    const map = L.map(mapRef.current, {
      scrollWheelZoom: true,
      zoomControl: true,
      attributionControl: true,
    }).setView([11.5, 78.5], 5.5)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)
    mapInstance.current = map
    mapReady.current = true
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
        mapReady.current = false
      }
    }
  }, [])

  useEffect(() => {
    if (!mapReady.current || !mapInstance.current) return
    renderLayers(mapInstance.current, places)
  }, [places])

  useEffect(() => {
    if (!mapReady.current || !mapInstance.current || places.length === 0) return
    const timer = setTimeout(() => {
      mapInstance.current.flyTo([places[0].lat, places[0].lng], 8, { duration: 2 })
    }, 500)
    return () => clearTimeout(timer)
  }, [sheetData])

  const flyTo = (place) => {
    if (!mapInstance.current) return
    setActivePlace(place)
    mapInstance.current.flyTo([place.lat, place.lng], 8, { duration: 1.5 })
  }

  const uniqueCountries = new Set(places.map(p => p.country)).size
  const uniqueCities = new Set(places.map(p => p.city)).size

  const stats = [
    { label: 'Countries', value: uniqueCountries },
    { label: 'Cities', value: uniqueCities },
    { label: 'Total', value: places.length },
  ]

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-green-soft flex items-center justify-center">
            <Globe size={18} className="text-green" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Space</h1>
            <p className="text-[12px] text-text-tertiary">Places I&apos;ve been &mdash; click a destination to fly there.</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + i * 0.03, duration: 0.3 }}
              className="px-4 py-3 rounded-xl bg-surface border border-border min-w-[80px]"
            >
              <div className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-accent to-green bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-[10px] text-text-quaternary font-mono font-medium mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="rounded-2xl overflow-hidden border border-border mb-8"
        >
          <div ref={mapRef} className="w-full h-[320px] sm:h-[420px] bg-bg" />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {places.map((p, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 + i * 0.02, duration: 0.2 }}
              onClick={() => flyTo(p)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-surface border transition-all duration-200 text-left cursor-pointer ${
                activePlace === p
                  ? 'border-accent/40 bg-accent-soft shadow-[0_0_10px_rgba(124,106,255,0.08)]'
                  : 'border-border hover:border-border-hover'
              }`}
            >
              <span className="text-base flex-shrink-0">{p.emoji}</span>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold truncate leading-tight">{p.city}</div>
                <div className="text-[10px] text-text-tertiary truncate leading-tight">{p.country} &middot; {p.date}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
