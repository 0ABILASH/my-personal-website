// Shared travel-data loader.
// Kicks off at module import (i.e. the moment the JS bundle loads, before
// React renders) so the sheet API starts fetching as soon as the website
// opens. Results are cached in localStorage so repeat visits are instant.

var CACHE_KEY = 'travel_places_v1'
var cache = null
var pending = null

function readStored() {
  try {
    var raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

export function preloadTravel() {
  // Serve cached data immediately if we already have it in memory…
  if (cache) return Promise.resolve(cache)

  // …otherwise serve whatever was cached from a previous visit.
  var stored = readStored()
  if (stored && Array.isArray(stored) && stored.length > 0) {
    cache = { places: stored, fetchStatus: 'ok' }
  }

  // Kick off the real fetch once, shared by every caller.
  if (!pending) {
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
            try { localStorage.setItem(CACHE_KEY, JSON.stringify(filtered)) } catch (e) {}
            cache = { places: filtered, fetchStatus: 'ok' }
            return cache
          }
        }
        // Empty/failed response — never fabricate offline data.
        if (!cache) cache = { places: [], fetchStatus: 'fallback' }
      } catch (e) {
        if (!cache) cache = { places: [], fetchStatus: 'error' }
      }
      return cache
    })()
  }

  return pending
}

// Start fetching immediately at bundle load (no waiting for React to mount).
preloadTravel()
