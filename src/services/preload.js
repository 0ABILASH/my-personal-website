// Prefetch every public API the moment the site bundle loads, so the server
// caches are warm and each page renders instantly. Each getter returns a
// shared in-flight promise — pages reuse it instead of starting their own
// duplicate fetch, and any page that mounts after the data has arrived gets
// the already-resolved result immediately.

import { preloadTravel } from './travel'

var pending = {}

function once(key, url) {
  if (!pending[key]) {
    pending[key] = fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('bad status ' + r.status)
        return r.json()
      })
      .catch(function () { return null })
  }
  return pending[key]
}

export function getProfile() { return once('profile', '/api/profile') }

export function getLikes() { return once('likes', '/api/likes') }

export function getChronicles() { return once('chronicles', '/api/chronicles') }

// Kick off every public API call at once. Call this from App on first mount
// (and it also runs the travel preloader which fires at bundle import time).
export function preloadAll() {
  getProfile()
  getLikes()
  getChronicles()
  return preloadTravel()
}
