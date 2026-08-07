import express from 'express'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load local .env (if present) so PORT, ADMIN_* and GAS_* work in development.
// On hosted platforms (Render etc.) environment variables are injected by the
// platform and this no-op is a safe fallback.
try { process.loadEnvFile() } catch (e) {}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const GAS_URL = process.env.GAS_URL || 'https://script.google.com/macros/s/AKfycbwhnLnBeAyWammouZHO-z41b5fGDG-MNEZtMOPoPYKAs218QokxLzkOVzrW5fiUN3gW5g/exec'
const GAS_ADMIN_URL = process.env.GAS_ADMIN_URL || ''

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(join(__dirname, 'dist')))

// Tiny in-memory TTL cache — GAS responses are cached so repeat requests
// are served instantly instead of hitting the (slow) Apps Script endpoint.
function createCache(ttlMs) {
  var store = {}
  return {
    get: function (key) {
      var entry = store[key]
      if (!entry) return null
      if (Date.now() - entry.t > ttlMs) { delete store[key]; return null }
      return entry.v
    },
    set: function (key, value) {
      store[key] = { t: Date.now(), v: value }
    },
  }
}

// Generic GAS fetcher. Apps Script web apps answer with a 302 to a
// script.googleusercontent.com URL; following it turns a POST into a GET
// (per the fetch spec), which is exactly what GAS expects. Default redirect
// handling does this correctly, so no manual follow is needed.
async function gasFetch(url, options) {
  var controller = new AbortController()
  var timeout = setTimeout(function () { controller.abort() }, 45000)
  try {
    return await fetch(url, Object.assign({ signal: controller.signal }, options))
  } finally {
    clearTimeout(timeout)
  }
}

async function gasGet(params) {
  var url = GAS_URL + '?' + params.toString()
  var controller = new AbortController()
  var timeout = setTimeout(function () { controller.abort() }, 15000)
  var res = await fetch(url, { redirect: 'manual', signal: controller.signal })
  clearTimeout(timeout)

  if (res.status >= 300 && res.status < 400) {
    var location = res.headers.get('location')
    if (location) {
      if (location.startsWith('/')) {
        location = new URL(url).origin + location
      }
      var locUrl = new URL(location)
      params.forEach(function (v, k) {
        if (!locUrl.searchParams.has(k)) locUrl.searchParams.append(k, v)
      })
      locUrl.searchParams.set('_', Date.now().toString())
      var c2 = new AbortController()
      var t2 = setTimeout(function () { c2.abort() }, 15000)
      var finalRes = await fetch(locUrl.toString(), { signal: c2.signal })
      clearTimeout(t2)
      return finalRes
    }
  }
  return res
}

// POST JSON to the admin Apps Script web app and return the parsed response.
// Throws on transport failure, non-JSON, or { ok: false } responses.
async function adminGas(body) {
  if (!GAS_ADMIN_URL) throw new Error('Admin backend not configured (GAS_ADMIN_URL missing)')
  var text, data
  for (var attempt = 0; attempt < 2; attempt++) {
    var res = await gasFetch(GAS_ADMIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
    })
    text = await res.text()
    data = null
    try { data = JSON.parse(text) } catch (e) { data = null }
    if (data || attempt === 1) break
    await new Promise(function (resolve) { setTimeout(resolve, 1000) })
  }
  if (!data) throw new Error('Admin backend returned an invalid response')
  if (data.ok === false) throw new Error(data.error || 'Admin backend error')
  return data
}

// Call an admin GAS action with a payload. The secret never leaves the server.
async function adminCall(action, payload) {
  return adminGas({ action: action, secret: process.env.GAS_ADMIN_SECRET || '', data: payload })
}

// ─── Admin authentication (server-side sessions) ──────────────────────────
const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8 hours
var adminSessions = new Map() // token -> { exp }

function timingSafeStr(a, b) {
  var ba = Buffer.from(String(a))
  var bb = Buffer.from(String(b))
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}

function sha256(v) {
  return crypto.createHash('sha256').update(String(v)).digest('hex')
}

function createAdminSession() {
  var token = crypto.randomBytes(32).toString('hex')
  adminSessions.set(token, { exp: Date.now() + SESSION_TTL_MS })
  return token
}

function parseCookies(req) {
  var out = {}
  var raw = req.headers.cookie || ''
  raw.split(';').forEach(function (part) {
    var i = part.indexOf('=')
    if (i === -1) return
    try { out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim()) } catch (e) {}
  })
  return out
}

function isAdmin(req) {
  if (req.headers['x-admin'] !== '1') return false
  var token = parseCookies(req)['admin_session'] || ''
  var s = adminSessions.get(token)
  if (!s) return false
  if (s.exp < Date.now()) { adminSessions.delete(token); return false }
  return true
}

function adminOnly(req, res, next) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' })
  next()
}

// Simple per-IP login rate limiter (in-memory, no dependency)
var loginAttempts = new Map() // ip -> { fails, windowStart }
const LOGIN_MAX = 8
const LOGIN_WINDOW_MS = 15 * 60 * 1000

function loginBlocked(ip) {
  var a = loginAttempts.get(ip)
  if (!a) return false
  if (Date.now() - a.windowStart > LOGIN_WINDOW_MS) { loginAttempts.delete(ip); return false }
  return a.fails >= LOGIN_MAX
}

function recordLoginFailure(ip) {
  var a = loginAttempts.get(ip)
  if (!a || Date.now() - a.windowStart > LOGIN_WINDOW_MS) {
    loginAttempts.set(ip, { fails: 1, windowStart: Date.now() })
  } else {
    a.fails++
  }
}

function clearLoginFailures(ip) {
  loginAttempts.delete(ip)
}

app.post('/api/admin/login', async function (req, res) {
  var ip = req.headers['x-forwarded-for'] ? String(req.headers['x-forwarded-for']).split(',')[0].trim() : req.socket.remoteAddress || ''
  if (loginBlocked(ip)) return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' })

  var expectedUser = process.env.ADMIN_USERNAME || 'admin'
  var expectedHash = process.env.ADMIN_PASSWORD_HASH || ''
  if (!expectedHash) return res.status(500).json({ error: 'Admin not configured on the server' })

  var username = String((req.body && req.body.username) || '')
  var password = String((req.body && req.body.password) || '')

  if (!timingSafeStr(username, expectedUser) || !timingSafeStr(sha256(password), expectedHash)) {
    recordLoginFailure(ip)
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  clearLoginFailures(ip)
  var token = createAdminSession()
  res.setHeader('Set-Cookie', 'admin_session=' + token + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + Math.floor(SESSION_TTL_MS / 1000))
  res.json({ ok: true })
})

app.post('/api/admin/logout', function (req, res) {
  var token = parseCookies(req)['admin_session'] || ''
  adminSessions.delete(token)
  res.setHeader('Set-Cookie', 'admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0')
  res.json({ ok: true })
})

app.get('/api/admin/session', function (req, res) {
  var token = parseCookies(req)['admin_session'] || ''
  var s = adminSessions.get(token)
  if (s && s.exp > Date.now()) {
    res.json({ authenticated: true, username: process.env.ADMIN_USERNAME || 'admin' })
  } else {
    res.json({ authenticated: false })
  }
})

app.post('/api/admin/cache/clear', adminOnly, function (req, res) {
  travelCache.set('travel', null)
  chroniclesCache.set('chronicles', null)
  likesCache.set('likes', null)
  profileCache.set('profile', null)
  adminCache.set('profile', null)
  res.json({ ok: true })
})

app.get('/api/admin/info', adminOnly, async function (req, res) {
  try {
    var data = await adminCall('adminInfo')
    res.json(data)
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

// Real like counts (from the public BlogLikes backend) — shown on the Dashboard.
app.get('/api/admin/likes', adminOnly, async function (req, res) {
  var cached = adminCache.get('likes')
  if (cached) return res.json(cached)
  try {
    var params = new URLSearchParams({ action: 'getLikes', _: Date.now().toString() })
    var gasRes = await gasGet(params)
    var text = await gasRes.text()
    var data = JSON.parse(text)
    var payload = { likes: (data && data.likes) || {} }
    adminCache.set('likes', payload)
    res.json(payload)
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.get('/api/admin/profile', adminOnly, async function (req, res) {
  var cached = adminCache.get('profile')
  if (cached) return res.json(cached)
  try {
    var data = await adminCall('adminProfile')
    adminCache.set('profile', data)
    res.json(data)
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.put('/api/admin/profile', adminOnly, async function (req, res) {
  var d = (req.body && req.body.data) || {}
  if (!d || typeof d !== 'object') return res.status(400).json({ error: 'Invalid profile payload' })
  try {
    await adminCall('adminProfileUpdate', d)
    profileCache.set('profile', null)
    adminCache.set('profile', null)
    res.json({ ok: true })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

// Public site profile — the same source the Admin Dashboard edits.
app.get('/api/profile', async function (req, res) {
  res.set('Cache-Control', 'no-store')
  var cached = profileCache.get('profile')
  if (cached) return res.json(cached)
  if (!GAS_ADMIN_URL) return res.json({})
  try {
    var params = new URLSearchParams({ action: 'profile', _: Date.now().toString() })
    var gasRes = await gasFetch(GAS_ADMIN_URL + '?' + params.toString(), {})
    var text = await gasRes.text()
    var data = JSON.parse(text)
    profileCache.set('profile', data)
    res.json(data)
  } catch (err) {
    res.json({})
  }
})

app.post('/api/track', async function (req, res) {
  try {
    var body = req.body || {}
    console.log('[track] received:', JSON.stringify(body))

    var ip = ''
    var fwd = req.headers['x-forwarded-for']
    if (fwd) {
      ip = String(fwd).split(',')[0].trim()
    }
    if (!ip) {
      ip = req.socket.remoteAddress || ''
    }
    if (ip === '::1' || ip === '::ffff:127.0.0.1' || ip === '127.0.0.1') {
      ip = ''
    }

    var ipData = {}
    if (ip) {
      try {
        var controller = new AbortController()
        var timeout = setTimeout(function () { controller.abort() }, 3000)
        var ipRes = await fetch('https://ipapi.co/' + ip + '/json/', { signal: controller.signal })
        clearTimeout(timeout)
        ipData = await ipRes.json()
      } catch (e) {}
    }

    var params = new URLSearchParams()
    Object.keys(body).forEach(function (key) {
      params.append(key, body[key] !== undefined && body[key] !== null ? String(body[key]) : '')
    })
    if (ip) params.append('ip', ip)
    if (ipData.city) params.append('city', ipData.city)
    if (ipData.country_name) params.append('country', ipData.country_name)
    if (ipData.region) params.append('region', ipData.region)
    params.append('_', Date.now().toString())
    console.log('[track] sending to GAS:', params.toString().substring(0, 200))
    await gasGet(params)
    console.log('[track] GAS success')
  } catch (err) {
    console.error('[track] error:', err.message)
  }
  res.json({ ok: true })
})

const travelCache = createCache(5 * 60 * 1000)
const likesCache = createCache(30 * 1000)
const chroniclesCache = createCache(60 * 1000)
const adminCache = createCache(10 * 1000)
const profileCache = createCache(60 * 1000)

app.get('/api/travel', async function (req, res) {
  res.set('Cache-Control', 'no-store')
  try {
    var cached = travelCache.get('travel')
    if (cached) return res.json(cached)

    var params = new URLSearchParams({ action: 'travel', _: Date.now().toString() })
    var gasRes = await gasGet(params)
    var text = await gasRes.text()
    try {
      var data = JSON.parse(text)
      if (data.places && data.places.length > 0) travelCache.set('travel', data)
      res.json(data)
    } catch (e) {
      console.error('[travel] JSON parse failed, raw:', text.substring(0, 200))
      res.json({ places: [] })
    }
  } catch (err) {
    console.error('[travel] error:', err.message)
    res.json({ places: [] })
  }
})

// Blog like counts from Google Sheets (via GAS)
app.get('/api/likes', async function (req, res) {
  res.set('Cache-Control', 'no-store')
  try {
    var cached = likesCache.get('likes')
    if (cached) return res.json(cached)

    var params = new URLSearchParams({ action: 'getLikes' })
    var gasRes = await gasGet(params)
    var text = await gasRes.text()
    var data = JSON.parse(text)
    if (data && typeof data.likes === 'object') {
      likesCache.set('likes', { likes: data.likes })
      res.json({ likes: data.likes })
    } else {
      res.json({ likes: data || {} })
    }
  } catch (err) {
    res.json({ likes: {} })
  }
})

app.post('/api/like', async function (req, res) {
  try {
    var body = req.body || {}
    var postId = String(body.postId || '')
    if (!postId) return res.json({ error: 'missing postId' })
    var liked = body.liked === true || body.liked === 'true'
    var params = new URLSearchParams({
      action: liked ? 'addLike' : 'removeLike',
      postId: postId,
      _: Date.now().toString(),
    })
    var gasRes = await gasGet(params)
    var text = await gasRes.text()
    var data = JSON.parse(text)
    if (data && typeof data.count === 'number') {
      res.json(data)
    } else {
      res.json({ error: 'bad GAS response', postId: postId })
    }
  } catch (err) {
    res.json({ error: err.message })
  }
})

// Public chronicles feed (published only) — served from the admin backend.
app.get('/api/chronicles', async function (req, res) {
  res.set('Cache-Control', 'no-store')
  try {
    var cached = chroniclesCache.get('chronicles')
    if (cached) return res.json(cached)
    if (!GAS_ADMIN_URL) return res.json({ chronicles: [] })

    var params = new URLSearchParams({ action: 'chronicles', _: Date.now().toString() })
    var gasRes = await gasFetch(GAS_ADMIN_URL + '?' + params.toString(), {})
    var text = await gasRes.text()
    var data = JSON.parse(text)
    var list = (data && Array.isArray(data.chronicles)) ? data.chronicles : []
    chroniclesCache.set('chronicles', { chronicles: list })
    res.json({ chronicles: list })
  } catch (err) {
    console.error('[chronicles] error:', err.message)
    res.json({ chronicles: [] })
  }
})

// ─── Admin CRUD API (session-protected, validates + talks to admin GAS) ───
function validatePlacePayload(data) {
  var p = data || {}
  if (!String(p.city || '').trim() && !String(p.lat || '').trim() && !String(p.lng || '').trim()) {
    return 'A place needs at least a city name or coordinates'
  }
  if (p.lat !== undefined && p.lat !== '' && isNaN(Number(p.lat))) return 'Latitude must be a number'
  if (p.lng !== undefined && p.lng !== '' && isNaN(Number(p.lng))) return 'Longitude must be a number'
  return null
}

app.get('/api/admin/places', adminOnly, async function (req, res) {
  var cached = adminCache.get('places')
  if (cached) return res.json(cached)
  try {
    var data = await adminCall('adminPlaces')
    var payload = { places: data.places || [] }
    adminCache.set('places', payload)
    res.json(payload)
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.post('/api/admin/places', adminOnly, async function (req, res) {
  var bad = validatePlacePayload(req.body && req.body.data)
  if (bad) return res.status(400).json({ error: bad })
  try {
    var data = await adminCall('adminPlaceCreate', (req.body && req.body.data) || {})
    travelCache.set('travel', null)
    adminCache.set('places', null)
    res.json(data)
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.put('/api/admin/places/:id', adminOnly, async function (req, res) {
  var payload = Object.assign({}, (req.body && req.body.data) || {}, { id: req.params.id })
  var bad = validatePlacePayload(payload)
  if (bad) return res.status(400).json({ error: bad })
  try {
    await adminCall('adminPlaceUpdate', payload)
    travelCache.set('travel', null)
    adminCache.set('places', null)
    res.json({ ok: true })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.delete('/api/admin/places/:id', adminOnly, async function (req, res) {
  try {
    await adminCall('adminPlaceDelete', { id: req.params.id })
    travelCache.set('travel', null)
    adminCache.set('places', null)
    res.json({ ok: true })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.post('/api/admin/places/reorder', adminOnly, async function (req, res) {
  var ids = req.body && req.body.ids
  if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'No order provided' })
  try {
    await adminCall('adminPlacesReorder', { ids: ids })
    travelCache.set('travel', null)
    adminCache.set('places', null)
    res.json({ ok: true })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.get('/api/admin/chronicles', adminOnly, async function (req, res) {
  var cached = adminCache.get('chronicles')
  if (cached) return res.json(cached)
  try {
    var data = await adminCall('adminChronicles')
    var payload = { chronicles: data.chronicles || [] }
    adminCache.set('chronicles', payload)
    res.json(payload)
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.post('/api/admin/chronicles', adminOnly, async function (req, res) {
  var d = (req.body && req.body.data) || {}
  if (!String(d.title || '').trim()) return res.status(400).json({ error: 'A chronicle needs a title' })
  try {
    var data = await adminCall('adminChronicleCreate', d)
    chroniclesCache.set('chronicles', null)
    adminCache.set('chronicles', null)
    res.json(data)
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.put('/api/admin/chronicles/:id', adminOnly, async function (req, res) {
  var d = Object.assign({}, (req.body && req.body.data) || {}, { id: req.params.id })
  if (!String(d.title || '').trim()) return res.status(400).json({ error: 'A chronicle needs a title' })
  try {
    await adminCall('adminChronicleUpdate', d)
    chroniclesCache.set('chronicles', null)
    adminCache.set('chronicles', null)
    res.json({ ok: true })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.delete('/api/admin/chronicles/:id', adminOnly, async function (req, res) {
  try {
    await adminCall('adminChronicleDelete', { id: req.params.id })
    chroniclesCache.set('chronicles', null)
    adminCache.set('chronicles', null)
    res.json({ ok: true })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.get('/api/admin/routes', adminOnly, async function (req, res) {
  var cached = adminCache.get('routes')
  if (cached) return res.json(cached)
  try {
    var data = await adminCall('adminRoutes')
    var payload = { routes: data.routes || [] }
    adminCache.set('routes', payload)
    res.json(payload)
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.post('/api/admin/routes', adminOnly, async function (req, res) {
  var d = (req.body && req.body.data) || {}
  if (!String(d.name || '').trim()) return res.status(400).json({ error: 'A route needs a name' })
  try {
    var data = await adminCall('adminRouteCreate', d)
    adminCache.set('routes', null)
    res.json(data)
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.put('/api/admin/routes/:id', adminOnly, async function (req, res) {
  var d = Object.assign({}, (req.body && req.body.data) || {}, { id: req.params.id })
  if (!String(d.name || '').trim()) return res.status(400).json({ error: 'A route needs a name' })
  try {
    await adminCall('adminRouteUpdate', d)
    adminCache.set('routes', null)
    res.json({ ok: true })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.delete('/api/admin/routes/:id', adminOnly, async function (req, res) {
  try {
    await adminCall('adminRouteDelete', { id: req.params.id })
    adminCache.set('routes', null)
    res.json({ ok: true })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.get('/api/admin/media', adminOnly, async function (req, res) {
  var cached = adminCache.get('media')
  if (cached) return res.json(cached)
  try {
    var data = await adminCall('adminMedia')
    var payload = { media: data.media || [] }
    adminCache.set('media', payload)
    res.json(payload)
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.post('/api/admin/media', adminOnly, async function (req, res) {
  var d = (req.body && req.body.data) || {}
  if (!String(d.url || '').trim()) return res.status(400).json({ error: 'A media item needs a URL' })
  try {
    var data = await adminCall('adminMediaCreate', d)
    adminCache.set('media', null)
    res.json(data)
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.delete('/api/admin/media/:id', adminOnly, async function (req, res) {
  try {
    await adminCall('adminMediaDelete', { id: req.params.id })
    adminCache.set('media', null)
    res.json({ ok: true })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

// Proxy OSRM route requests — avoids browser CORS/rate-limit issues
app.get('/api/route', async function (req, res) {
  try {
    var from = req.query.from  // "lng,lat"
    var to = req.query.to      // "lng,lat"
    if (!from || !to) return res.json({ error: 'missing from/to' })

    var url = 'https://router.project-osrm.org/route/v1/driving/' + from + ';' + to + '?overview=simplified&geometries=geojson&steps=false'
    var osrmRes = await fetch(url)
    var data = await osrmRes.json()

    if (data.routes && data.routes.length > 0) {
      var coords = data.routes[0].geometry.coordinates.map(function (c) { return [c[1], c[0]] })
      res.json({ coords: coords })
    } else {
      res.json({ coords: null })
    }
  } catch (err) {
    res.json({ coords: null })
  }
})

app.get('*', function (req, res) {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT)

// Warm the travel cache shortly after boot so the first visitor request is
// served instantly (only the very first warm-up hits the slow GAS endpoint).
setTimeout(async function () {
  if (travelCache.get('travel')) return
  try {
    var params = new URLSearchParams({ action: 'travel', _: Date.now().toString() })
    var gasRes = await gasGet(params)
    var text = await gasRes.text()
    var data = JSON.parse(text)
    if (data.places && data.places.length > 0) travelCache.set('travel', data)
    console.log('[warm] travel cache primed')
  } catch (err) {
    console.error('[warm] travel warm-up failed:', err.message)
  }
}, 1000)
