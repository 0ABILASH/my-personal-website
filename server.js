import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwhnLnBeAyWammouZHO-z41b5fGDG-MNEZtMOPoPYKAs218QokxLzkOVzrW5fiUN3gW5g/exec'

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(join(__dirname, 'dist')))

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

app.get('/api/travel', async function (req, res) {
  try {
    var params = new URLSearchParams({ action: 'travel', _: Date.now().toString() })
    var gasRes = await gasGet(params)
    var text = await gasRes.text()
    try {
      var data = JSON.parse(text)
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
  try {
    var params = new URLSearchParams({ action: 'getLikes' })
    var gasRes = await gasGet(params)
    var text = await gasRes.text()
    var data = JSON.parse(text)
    if (data && typeof data.likes === 'object') {
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
