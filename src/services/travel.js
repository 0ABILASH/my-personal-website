// Shared travel-data loader — kicks off on app load so the sheet API is
// already fetched (and cached) before the Travel Log page mounts.
var cache = null
var pending = null

export function preloadTravel() {
  if (pending) return pending
  pending = (async function () {
    try {
      var res = await fetch('/api/travel')
      var data = await res.json()
      if (data.places && data.places.length > 0) {
        var filtered = data.places.filter(function (p) { return p.lat && p.lng })
        filtered.forEach(function (p) {
          var img = p.image || p['image '] || ''
          if (!img || typeof img === 'object') img = ''
          p.image = img
          p.description = p.description || p['description '] || ''
        })
        if (filtered.length > 0) {
          cache = { places: filtered, fetchStatus: 'ok' }
          return cache
        }
      }
      cache = { places: [], fetchStatus: 'fallback' }
      return cache
    } catch {
      cache = { places: [], fetchStatus: 'error' }
      return cache
    }
  })()
  return pending
}
