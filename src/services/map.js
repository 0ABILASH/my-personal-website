import L from 'leaflet'

export const FALLBACK_PLACES = [
  { city: 'Coimbatore', country: 'India', lat: 11.0168, lng: 76.9558, emoji: '🏙️', date: 'Home Base' },
]

export const ROUTE_COLOR = '#6ef400'

const ROUTE_STYLE = { color: '#f63817', weight: 4, opacity: 0.9, }
const OSRM_BASE = 'https://router.project-osrm.org'
const CACHE_KEY = 'travel_routes_v2'
const FETCH_DELAY = 300

// ─── localStorage cache ───────────────────────────────────────────────
function getRouteCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {} }
  catch { return {} }
}

function saveRouteCache(c) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)) } catch {}
}

function routeKey(a, b) {
  const lo = a.lat < b.lat ? a : b
  const hi = a.lat >= b.lat ? a : b
  return lo.lat.toFixed(4) + ',' + lo.lng.toFixed(4) + '|' + hi.lat.toFixed(4) + ',' + hi.lng.toFixed(4)
}

// ─── OSRM fetch ───────────────────────────────────────────────────────
async function fetchOsrmRoute(from, to) {
  const coords = from.lng + ',' + from.lat + ';' + to.lng + ',' + to.lat
  const url = OSRM_BASE + '/route/v1/driving/' + coords + '?overview=full&geometries=geojson'
  const res = await fetch(url)
  if (!res.ok) throw new Error('OSRM ' + res.status)
  const data = await res.json()
  if (!data.routes || data.routes.length === 0) throw new Error('No route')
  return data.routes[0].geometry.coordinates.map(function (c) { return [c[1], c[0]] })
}

// ─── fetch all routes (with cache + fallback) ─────────────────────────
export async function fetchAllRoutes(places, onProgress) {
  if (places.length < 2) return {}
  var cache = getRouteCache()
  var routes = {}
  var total = places.length - 1

  for (var i = 0; i < total; i++) {
    var from = places[i]
    var to = places[i + 1]
    var key = routeKey(from, to)

    if (cache[key]) {
      routes[key] = cache[key]
    } else {
      var coords = ''
      try {
        coords = from.lng + ',' + from.lat + ';' + to.lng + ',' + to.lat
        var res = await fetch(OSRM_BASE + '/route/v1/driving/' + coords + '?overview=full&geometries=geojson')
        if (!res.ok) throw new Error('HTTP ' + res.status)
        var data = await res.json()
        if (!data.routes || data.routes.length === 0) throw new Error('No route')
        var decoded = data.routes[0].geometry.coordinates.map(function (c) { return [c[1], c[0]] })
        routes[key] = decoded
        cache[key] = decoded
        saveRouteCache(cache)
      } catch (e) {
        // OSRM failed — cache straight line to avoid retrying
        routes[key] = [[from.lat, from.lng], [to.lat, to.lng]]
        cache[key] = routes[key]
        saveRouteCache(cache)
      }
      if (onProgress) onProgress(i + 1, total)
      // Delay between requests to respect OSRM rate limits
      if (i < total - 1) await new Promise(function (r) { setTimeout(r, FETCH_DELAY) })
    }
  }
  return routes
}

// ─── clear cached routes (for fresh fetch) ────────────────────────────
export function clearRouteCache() {
  try { localStorage.removeItem(CACHE_KEY) } catch {}
}

// ─── render layers on map ──────────────────────────────────────────────
export function renderLayers(map, places, routes) {
  map.eachLayer(function (layer) {
    if (!(layer instanceof L.TileLayer)) map.removeLayer(layer)
  })

  // Draw road routes (or straight fallback)
  if (routes && places.length >= 2) {
    for (var i = 0; i < places.length - 1; i++) {
      var key = routeKey(places[i], places[i + 1])
      var coords = routes[key] || [[places[i].lat, places[i].lng], [places[i + 1].lat, places[i + 1].lng]]
      L.polyline(coords, ROUTE_STYLE).addTo(map)
    }
  }

  // Draw markers
  places.forEach(function (p) {
    var isFirst = p === places[0]
    var marker = L.circleMarker([p.lat, p.lng], {
      radius: isFirst ? 10 : 4,
      color: ROUTE_COLOR,
      fillColor: ROUTE_COLOR,
      fillOpacity: 1,
      weight: isFirst ? 3 : 1.5,
    }).addTo(map)
    marker.bindPopup(
      '<div style="text-align:center;font-family:Inter,sans-serif;padding:2px 6px">' +
      '<span style="font-size:1.2rem">' + p.emoji + '</span><br/>' +
      '<strong style="font-size:0.85rem">' + p.city + '</strong><br/>' +
      '<span style="font-size:0.7rem;color:#71717a">' + p.country + ' \u00b7 ' + p.date + '</span></div>',
      { closeButton: false, offset: [0, -8] }
    )
  })
}
