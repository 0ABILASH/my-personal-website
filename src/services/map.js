import L from 'leaflet'

export const FALLBACK_PLACES = [
  { city: 'Coimbatore', country: 'India', lat: 11.0168, lng: 76.9558, emoji: '🏙️', date: 'Home Base' },
]

// ─── Route style ─────────────────────────────────────────────────────
// Gradient route via SVG linearGradient (amber → orange).
export const ROUTE_COLOR = '#f2bf34d0'
const ROUTE_STYLE = {
  color: '#f4b300bd', weight: 1.5, opacity: 0.5,
  lineCap: 'round', lineJoin: 'round',
}

// ─── Marker color palette ────────────────────────────────────────────
var MARKER_COLORS = {
  current:  { fill: '#22c55e', stroke: '#ffffff', glow: 'rgba(34,197,94,0.4)' },
  major:    { fill: '#f4b300db', stroke: '#ffffff', glow: 'rgba(244,180,0,0.4)' },
  visited:  { fill: '#3b82f6', stroke: '#ffffff', glow: 'rgba(59,130,246,0.3)' },
  small:    { fill: '#8b5cf6', stroke: '#ffffff', glow: 'rgba(139,92,246,0.2)' },
}

// ─── API providers (ORS preferred, OSRM fallback) ────────────────────
var ORS_BASE = 'https://api.openrouteservice.org/v2/directions/driving'
var ORS_KEY = import.meta.env.VITE_ORS_API_KEY || ''
var OSRM_BASE = 'https://router.project-osrm.org'
var CACHE_KEY = 'travel_routes_v4'
var CACHE_HASH_KEY = 'travel_places_hash'
var BATCH_SIZE = 5
var BATCH_DELAY = 600

// ─── localStorage cache ───────────────────────────────────────────────
function getRouteCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {} }
  catch { return {} }
}
function saveRouteCache(c) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)) } catch {}
}

// Hash places coordinates to detect when sheet data changes
function placesHash(places) {
  return places.map(function (p) { return p.lat + ',' + p.lng }).join('|')
}
function invalidateCacheIfPlacesChanged(places) {
  try {
    var hash = placesHash(places)
    var prev = localStorage.getItem(CACHE_HASH_KEY)
    if (prev !== hash) {
      localStorage.removeItem(CACHE_KEY)
      localStorage.setItem(CACHE_HASH_KEY, hash)
    }
  } catch {}
}
function routeKey(a, b) {
  var lo = a.lat < b.lat ? a : b
  var hi = a.lat >= b.lat ? a : b
  return lo.lat.toFixed(4) + ',' + lo.lng.toFixed(4) + '|' + hi.lat.toFixed(4) + ',' + hi.lng.toFixed(4)
}

// ─── single-route fetch (server proxy → OSRM) ────────────────────────
// Routes through our own server to avoid browser CORS/rate-limit issues.
async function fetchSingleRoute(from, to) {
  var fromCoord = from.lng + ',' + from.lat
  var toCoord = to.lng + ',' + to.lat
  var res = await fetch('/api/route?from=' + fromCoord + '&to=' + toCoord)
  if (!res.ok) throw new Error('Route proxy ' + res.status)
  var data = await res.json()
  if (!data.coords || data.coords.length === 0) throw new Error('No route')
  return data.coords
}

// ─── batch-fetch all routes ───────────────────────────────────────────
export async function fetchAllRoutes(places, onProgress) {
  if (places.length < 2) return {}
  invalidateCacheIfPlacesChanged(places)
  var cache = getRouteCache()
  var routes = {}
  var total = places.length - 1
  var completed = 0
  var toFetch = []
  for (var i = 0; i < total; i++) {
    var key = routeKey(places[i], places[i + 1])
    if (cache[key]) { routes[key] = cache[key] }
    else { toFetch.push({ from: places[i], to: places[i + 1], key: key }) }
  }
  for (var b = 0; b < toFetch.length; b += BATCH_SIZE) {
    var batch = toFetch.slice(b, b + BATCH_SIZE)
    await Promise.all(batch.map(async function (seg) {
      try {
        var decoded = await fetchSingleRoute(seg.from, seg.to)
        routes[seg.key] = decoded; cache[seg.key] = decoded
      } catch {
        var fb = [[seg.from.lat, seg.from.lng], [seg.to.lat, seg.to.lng]]
        routes[seg.key] = fb; cache[seg.key] = fb
      }
      completed++
      if (onProgress) onProgress(completed, total)
    }))
    saveRouteCache(cache)
    if (b + BATCH_SIZE < toFetch.length) await new Promise(function (r) { setTimeout(r, BATCH_DELAY) })
  }
  if (onProgress) onProgress(total, total)
  return routes
}

export function clearRouteCache() {
  try { localStorage.removeItem(CACHE_KEY) } catch {}
}

// ─── Classify marker type ─────────────────────────────────────────────
// Uses the `type` field from Google Sheet if present.
// Fallback rules: current = first place, visited = everything else.
export function markerType(place, index) {
  var t = (place.type || '').toLowerCase().trim()
  if (t === 'current' || t === 'major' || t === 'small' || t === 'visited') return t
  if (index === 0) return 'current'
  return 'visited'
}

// ─── Build SVG marker icon ────────────────────────────────────────────
function makeMarkerIcon(type) {
  var c = MARKER_COLORS[type]
  var svg = ''

  if (type === 'current') {
    // Green pulsing dot
    svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">' +
      '<circle cx="18" cy="18" r="14" fill="none" stroke="' + c.fill + '" stroke-width="1.5" opacity="0.5">' +
        '<animate attributeName="r" from="10" to="17" dur="2s" repeatCount="indefinite"/>' +
        '<animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite"/>' +
      '</circle>' +
      '<circle cx="18" cy="18" r="5" fill="' + c.fill + '" stroke="#fff" stroke-width="2"/>' +
      '</svg>'
  } else if (type === 'major') {
    // Flag icon
    svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">' +
      '<path d="M5 3v18" stroke="' + c.fill + '" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M5 4 C5 4 9 2 14 4 C19 6 19 10 14 12 C9 14 5 12 5 12" fill="' + c.fill + '"/>' +
      '</svg>'
  } else if (type === 'visited') {
    // Map pin icon
    svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">' +
      '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="' + c.fill + '"/>' +
      '<circle cx="12" cy="9" r="3" fill="#fff"/>' +
      '</svg>'
  } else if (type === 'small') {
    // Circle icon
    svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">' +
      '<circle cx="12" cy="12" r="9" fill="' + c.fill + '" stroke="#fff" stroke-width="1.5"/>' +
      '</svg>'
  }

  var anchor = type === 'current' ? [18, 18] : type === 'major' ? [13, 24] : type === 'visited' ? [11, 22] : type === 'small' ? [8, 8] : [11, 11]
  var popupOff = type === 'current' ? [0, -22] : type === 'major' ? [0, -28] : type === 'visited' ? [0, -26] : [0, -14]
  var iconSz = type === 'current' ? [36, 36] : type === 'major' ? [26, 26] : type === 'visited' ? [22, 22] : [16, 16]

  return L.divIcon({
    html: svg,
    className: 'travel-marker travel-marker--' + type,
    iconSize: iconSz,
    iconAnchor: anchor,
    popupAnchor: popupOff,
  })
}

// ─── Premium popup HTML ───────────────────────────────────────────────
function popupHtml(p, type) {
  var borderColor = MARKER_COLORS[type].fill
  return '<div style="text-align:center;font-family:Gabarito,sans-serif;padding:8px 12px;min-width:120px">' +
    '<div style="font-size:1.4rem;margin-bottom:2px">' + p.emoji + '</div>' +
    '<strong style="font-size:0.85rem;color:#fafafa">' + p.city + '</strong><br/>' +
    '<span style="font-size:0.7rem;color:#a1a1aa">' + p.country + ' · ' + p.date + '</span>' +
    '</div>'
}

// ─── Animate route draw (SVG stroke-dashoffset) ───────────────────────
// After Leaflet renders the SVG polylines, calculates each path's length
// and animates it from hidden to fully drawn over ANIM_DURATION ms.
var ANIM_DURATION = 4000
function animateRouteDraw() {
  requestAnimationFrame(function () {
    var paths = document.querySelectorAll('.leaflet-pane.leaflet-overlay-pane path')
    paths.forEach(function (path) {
      var len = path.getTotalLength()
      if (!len || len === 0) return
      path.style.strokeDasharray = len
      path.style.strokeDashoffset = len
      path.style.transition = 'stroke-dashoffset ' + ANIM_DURATION + 'ms cubic-bezier(0.4,0,0.2,1)'
      requestAnimationFrame(function () { path.style.strokeDashoffset = '0' })
    })
  })
}

// ─── render layers on map ─────────────────────────────────────────────
// Accepts `animate` for draw-in animation, `showMajor`, `showSmall`, and `showVisited` for filtering.
export function renderLayers(map, places, routes, animate, showMajor, showSmall, showVisited) {
  map.eachLayer(function (layer) {
    if (!(layer instanceof L.TileLayer)) map.removeLayer(layer)
  })

  // 1. Route segments — solid amber line
  if (places.length >= 2) {
    for (var i = 0; i < places.length - 1; i++) {
      var key = routeKey(places[i], places[i + 1])
      var coords = (routes && routes[key])
        ? routes[key]
        : [[places[i].lat, places[i].lng], [places[i + 1].lat, places[i + 1].lng]]

      L.polyline(coords, ROUTE_STYLE).addTo(map)
    }
    if (animate) animateRouteDraw()
  }

  // 2. Markers — filter by visible types
  places.forEach(function (p, i) {
    var type = markerType(p, i)
    if (type === 'major' && !showMajor) return
    if (type === 'visited' && !showVisited) return
    if (type === 'small' && !showSmall) return
    var icon = makeMarkerIcon(type)
    var marker = L.marker([p.lat, p.lng], { icon: icon, riseOnHover: true }).addTo(map)

    marker.bindPopup(popupHtml(p, type), {
      closeButton: false, offset: [0, -8], maxWidth: 220,
      className: 'travel-popup',
    })
  })
}

// ─── Tile layer config (CartoDB Dark Matter) ─────────────────────────
export var DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
export var TILE_OPTIONS = { attribution: '', maxZoom: 19, subdomains: 'abcd' }

// ─── Legend as a Leaflet control (stays inside the map) ───────────────
var legendControl = null
export function addLegend(map) {
  if (legendControl) return
  legendControl = L.control({ position: 'bottomleft' })
  legendControl.onAdd = function () {
    var div = L.DomUtil.create('div', 'travel-legend')
    div.innerHTML =
      '<div class="travel-legend-inner">' +
        '<div class="travel-legend-item"><span class="travel-legend-dot" style="background:#22c55e"></span><span>Current Location</span></div>' +
        '<div class="travel-legend-item"><span class="travel-legend-dot" style="background:#3b82f6"></span><span>Visited City</span></div>' +
        '<div class="travel-legend-item"><span class="travel-legend-dot" style="background:#F4B400"></span><span>Major Destination</span></div>' +
        '<div class="travel-legend-item"><span class="travel-legend-dot" style="background:#8b5cf6"></span><span>Small Stop</span></div>' +
        '<div class="travel-legend-item"><span class="travel-legend-line"></span><span>Travel Route</span></div>' +
      '</div>'
    return div
  }
  legendControl.addTo(map)
}
export function removeLegend() {
  if (legendControl) { legendControl.remove(); legendControl = null }
}
