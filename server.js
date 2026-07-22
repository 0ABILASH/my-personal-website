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
  var res = await fetch(url, { redirect: 'manual' })

  if (res.status >= 300 && res.status < 400) {
    var location = res.headers.get('location')
    if (location) {
      if (location.startsWith('/')) {
        location = new URL(url).origin + location
      }
      if (location.indexOf('?') === -1) {
        location += '?' + params.toString()
      }
      await fetch(location)
    }
  }
}

app.post('/api/track', async function (req, res) {
  try {
    var params = new URLSearchParams()
    var body = req.body || {}
    Object.keys(body).forEach(function (key) {
      if (body[key] !== undefined && body[key] !== null) {
        params.append(key, String(body[key]))
      }
    })
    params.append('_', Date.now().toString())
    await gasGet(params)
  } catch (err) {}
  res.json({ ok: true })
})

app.get('/api/travel', async function (req, res) {
  try {
    var params = new URLSearchParams({ action: 'travel' })
    var url = GAS_URL + '?' + params.toString()
    var gasRes = await fetch(url, { redirect: 'manual' })
    var finalRes = gasRes

    // GAS returns 302 redirect — follow it manually
    if (gasRes.status >= 300 && gasRes.status < 400) {
      var location = gasRes.headers.get('location')
      if (location) {
        if (location.startsWith('/')) {
          location = new URL(url).origin + location
        }
        if (location.indexOf('?') === -1) {
          location += '?' + params.toString()
        }
        // Use redirect: 'follow' so the body is readable
        finalRes = await fetch(location, { redirect: 'follow' })
      }
    }

    var text = await finalRes.text()
    try {
      res.json(JSON.parse(text))
    } catch (e) {
      res.json({ places: [] })
    }
  } catch (err) {
    res.json({ places: [] })
  }
})

// Proxy OSRM route requests — avoids browser CORS/rate-limit issues
app.get('/api/route', async function (req, res) {
  try {
    var from = req.query.from  // "lng,lat"
    var to = req.query.to      // "lng,lat"
    if (!from || !to) return res.json({ error: 'missing from/to' })

    var url = 'https://router.project-osrm.org/route/v1/driving/' + from + ';' + to + '?overview=full&geometries=geojson'
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
