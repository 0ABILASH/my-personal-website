import L from 'leaflet'

export const FALLBACK_PLACES = [
  { city: 'Coimbatore', country: 'India', lat: 11.0168, lng: 76.9558, emoji: '🏙️', date: 'Home Base' },
]

export const ROUTE_COLOR = '#F4B400'

// Route polyline style — orange dashed line following roads
const ROUTE_STYLE = { color: '#F4B400', weight: 2, opacity: 0.9, dashArray: '10, 8' }

// API providers — OpenRouteService preferred, OSRM as fallback
const ORS_BASE = 'https://api.openrouteservice.org/v2/directions/driving'
const ORS_KEY = import.meta.env.VITE_ORS_API_KEY || ''
const OSRM_BASE = 'https://router.project-osrm.org'
const CACHE_KEY = 'travel_routes_v3'
const BATCH_SIZE = 5   // parallel requests per batch
const BATCH_DELAY = 600 // ms between batches

// ─── localStorage cache ───────────────────────────────────────────────
// Cache keyed by ordered consecutive pairs. Store version in key to allow
// migration when cache format changes.
function getRouteCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {} }
  catch { return {} }
}

function saveRouteCache(c) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)) } catch {}
}

// Deterministic key for an unordered pair of coordinates
function routeKey(a, b) {
  var lo = a.lat < b.lat ? a : b
  var hi = a.lat >= b.lat ? a : b
  return lo.lat.toFixed(4) + ',' + lo.lng.toFixed(4) + '|' + hi.lat.toFixed(4) + ',' + hi.lng.toFixed(4)
}

// ─── single-route fetch (ORS → OSRM fallback) ────────────────────────
// Tries OpenRouteService first (requires API key), falls back to free
// OSRM demo server. Returns array of [lat, lng] coordinates.
async function fetchSingleRoute(from, to) {
  // Attempt OpenRouteService if key is available
  if (ORS_KEY) {
    try {
      var coords = [[from.lng, from.lat], [to.lng, to.lat]]
      var res = await fetch(ORS_BASE, {
        method: 'POST',
        headers: {
          'Authorization': ORS_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates: coords }),
      })
      if (res.ok) {
        var data = await res.json()
        var geom = data.features[0].geometry.coordinates
        return geom.map(function (c) { return [c[1], c[0]] })
      }
    } catch {}
  }

  // Fallback to OSRM (free, no key)
  var osrmCoords = from.lng + ',' + from.lat + ';' + to.lng + ',' + to.lat
  var osrmRes = await fetch(
    OSRM_BASE + '/route/v1/driving/' + osrmCoords + '?overview=full&geometries=geojson'
  )
  if (!osrmRes.ok) throw new Error('OSRM ' + osrmRes.status)
  var osrmData = await osrmRes.json()
  if (!osrmData.routes || osrmData.routes.length === 0) throw new Error('No route')
  return osrmData.routes[0].geometry.coordinates.map(function (c) { return [c[1], c[0]] })
}

// ─── batch-fetch all routes (parallel batches + cache) ────────────────
// For 100+ locations, fetches routes in parallel batches of BATCH_SIZE
// to maximise throughput while staying within rate limits.
// onProgress(done, total) is called after each segment completes.
export async function fetchAllRoutes(places, onProgress) {
  if (places.length < 2) return {}
  var cache = getRouteCache()
  var routes = {}
  var total = places.length - 1
  var completed = 0

  // Build list of uncached segments
  var toFetch = []
  for (var i = 0; i < total; i++) {
    var from = places[i]
    var to = places[i + 1]
    var key = routeKey(from, to)
    if (cache[key]) {
      routes[key] = cache[key]
    } else {
      toFetch.push({ from: from, to: to, key: key, index: i })
    }
  }

  // Fetch uncached segments in parallel batches
  for (var b = 0; b < toFetch.length; b += BATCH_SIZE) {
    var batch = toFetch.slice(b, b + BATCH_SIZE)
    var promises = batch.map(async function (seg) {
      try {
        var decoded = await fetchSingleRoute(seg.from, seg.to)
        routes[seg.key] = decoded
        cache[seg.key] = decoded
      } catch {
        // On failure, cache a straight line to avoid retrying
        var fallback = [[seg.from.lat, seg.from.lng], [seg.to.lat, seg.to.lng]]
        routes[seg.key] = fallback
        cache[seg.key] = fallback
      }
      completed++
      if (onProgress) onProgress(Math.min(completed + Object.keys(routes).length - completed, total), total)
    })
    await Promise.all(promises)

    // Persist cache after each batch
    saveRouteCache(cache)

    // Report progress and throttle between batches
    if (onProgress) onProgress(completed + (Object.keys(routes).length - completed), total)
    if (b + BATCH_SIZE < toFetch.length) {
      await new Promise(function (r) { setTimeout(r, BATCH_DELAY) })
    }
  }

  // Final progress update
  if (onProgress) onProgress(total, total)
  return routes
}

// ─── clear cached routes ──────────────────────────────────────────────
export function clearRouteCache() {
  try { localStorage.removeItem(CACHE_KEY) } catch {}
}

// ─── render layers on map ──────────────────────────────────────────────
// Clears all non-tile layers, draws road polylines then markers.
// When routes is null/undefined, shows straight dashed fallback lines
// so the map is never blank while loading.
export function renderLayers(map, places, routes) {
  map.eachLayer(function (layer) {
    if (!(layer instanceof L.TileLayer)) map.removeLayer(layer)
  })

  // Draw route polylines
  if (places.length >= 2) {
    for (var i = 0; i < places.length - 1; i++) {
      var key = routeKey(places[i], places[i + 1])
      var coords
      if (routes && routes[key]) {
        coords = routes[key]
      } else {
        // Straight-line fallback while routes load or if missing
        coords = [[places[i].lat, places[i].lng], [places[i + 1].lat, places[i + 1].lng]]
      }
      L.polyline(coords, ROUTE_STYLE).addTo(map)
    }
  }

  // Draw markers with popups
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
      '<span style="font-size:0.7rem;color:#71717a">' + p.country + ' · ' + p.date + '</span></div>',
      { closeButton: false, offset: [0, -8] }
    )
  })
}
