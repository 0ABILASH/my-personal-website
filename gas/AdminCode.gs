/**
 * AdminCode.gs — Admin dashboard backend for the personal website.
 *
 * This is a STANDALONE Google Apps Script web app. It is an ADDITION to the
 * existing backend: it does NOT replace or modify the existing Apps Script
 * code. It only manages admin data (Places, Chronicles, Routes, Media) that
 * lives in the SAME Google Sheet the website already uses.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * SETUP
 * ──────────────────────────────────────────────────────────────────────────
 * 1. Open a new Google Apps Script project (script.google.com) — or your
 *    existing project. If you use a new project, set SPREADSHEET_ID below to
 *    the ID of the spreadsheet that already contains your Places sheet.
 * 2. Project Settings → Project properties → Script properties → add:
 *        ADMIN_SECRET = <a long random string>
 *    This MUST be identical to the GAS_ADMIN_SECRET environment variable set
 *    on the Node server. If it is missing, every admin action is disabled.
 * 3. Deploy → New deployment → Web app:
 *        Execute as : Me
 *        Access     : Anyone
 * 4. Copy the deployment URL into the server env var GAS_ADMIN_URL.
 * 5. The script auto-detects the existing Places sheet (any sheet whose first
 *    row contains "city" and "lat") and auto-creates the Chronicles, Routes
 *    and Media sheets on first use. No manual sheet setup is required.
 *
 * NOTE: the existing public endpoints (action=travel, getLikes, addLike,
 * removeLike, visitor tracking) are NOT handled here — they keep running on
 * the original script untouched.
 */

var SPREADSHEET_ID = '' // ← paste your spreadsheet ID here (or leave empty to use the bound sheet)

var CHRONICLES_SHEET = 'Chronicles'
var ROUTES_SHEET = 'Routes'
var MEDIA_SHEET = 'Media'
var PROFILE_SHEET = 'Profile'
var PROFILE_JSON_FIELDS = ['about', 'tags', 'links', 'traits', 'interests']
var PROFILE_ORDER = ['name', 'tagline', 'location', 'locationShort', 'bio', 'status', 'about', 'tags', 'links', 'traits', 'interests']

var PLACES_HEADERS = ['city', 'country', 'lat', 'lng', 'emoji', 'date', 'type', 'image', 'description']
var CHRONICLE_HEADERS = ['id', 'title', 'excerpt', 'category', 'location', 'date', 'tags', 'cover', 'audioTitle', 'audioSrc', 'status', 'content', 'created', 'updated']
var ROUTE_HEADERS = ['id', 'name', 'places', 'created', 'updated']
var MEDIA_HEADERS = ['id', 'title', 'url', 'kind', 'created']

// ─── Core helpers ─────────────────────────────────────────────────────────

function ss_() {
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID)
  return SpreadsheetApp.getActiveSpreadsheet()
}

function secret_() {
  try {
    return PropertiesService.getScriptProperties().getProperty('ADMIN_SECRET') || ''
  } catch (e) {
    return ''
  }
}

function checkSecret_(secret) {
  var expected = secret_()
  if (!expected) throw new Error('Admin disabled: script property ADMIN_SECRET is not configured')
  if (String(secret || '') !== expected) throw new Error('Invalid admin secret')
}

function clean_(v) {
  return (v === undefined || v === null) ? '' : String(v)
}

function num_(v) {
  if (v === '' || v === undefined || v === null) return ''
  var n = Number(String(v).replace(/,/g, '').replace(/\s+/g, ''))
  return isNaN(n) ? '' : n
}

function normKey_(s) {
  return String(s || '').trim().toLowerCase()
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON)
}

function ok_(extra) {
  var r = { ok: true }
  if (extra) for (var k in extra) r[k] = extra[k]
  return json_(r)
}

function err_(msg) {
  return json_({ ok: false, error: msg || 'Unknown error' })
}

// ─── HTTP entry points ────────────────────────────────────────────────────

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || ''
  try {
    if (action === 'chronicles') return json_(readChronicles_(false)) // public read: published only
    if (action === 'profile') return json_(profile_()) // public read: site profile
    return err_('Unknown action: ' + action)
  } catch (ex) {
    return err_('Error: ' + ex.message)
  }
}

function doPost(e) {
  var body = {}
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}') || {}
  } catch (ex) { body = {} }
  var action = body.action || ''
  try {
    switch (action) {
      case 'adminInfo':           checkSecret_(body.secret); return json_(info_())
      case 'adminPlaces':         checkSecret_(body.secret); return json_(readPlaces_())
      case 'adminPlaceCreate':    checkSecret_(body.secret); return ok_(createPlace_(body.data || {}))
      case 'adminPlaceUpdate':    checkSecret_(body.secret); updatePlace_(body.data || {}); return ok_()
      case 'adminPlaceDelete':    checkSecret_(body.secret); deletePlace_(body.data && body.data.id); return ok_()
      case 'adminPlacesReorder':  checkSecret_(body.secret); reorderPlaces_(body.data && body.data.ids); return ok_()
      case 'adminChronicles':     checkSecret_(body.secret); return json_(readChronicles_(true))
      case 'adminChronicleCreate': checkSecret_(body.secret); return ok_(createChronicle_(body.data || {}))
      case 'adminChronicleUpdate': checkSecret_(body.secret); updateChronicle_(body.data || {}); return ok_()
      case 'adminChronicleDelete': checkSecret_(body.secret); deleteChronicle_(body.data && body.data.id); return ok_()
      case 'adminRoutes':         checkSecret_(body.secret); return json_(readRoutes_())
      case 'adminRouteCreate':    checkSecret_(body.secret); return ok_(createRoute_(body.data || {}))
      case 'adminRouteUpdate':    checkSecret_(body.secret); updateRoute_(body.data || {}); return ok_()
      case 'adminRouteDelete':    checkSecret_(body.secret); deleteRoute_(body.data && body.data.id); return ok_()
      case 'adminMedia':          checkSecret_(body.secret); return json_(readMedia_())
      case 'adminMediaCreate':    checkSecret_(body.secret); return ok_(createMedia_(body.data || {}))
      case 'adminMediaDelete':    checkSecret_(body.secret); deleteMedia_(body.data && body.data.id); return ok_()
      case 'adminProfile':        checkSecret_(body.secret); return json_(profile_())
      case 'adminProfileUpdate':  checkSecret_(body.secret); updateProfile_(body.data || {}); return ok_()
      case 'adminVisitors':       checkSecret_(body.secret); return json_({ visitors: readTrack_('Visitor') })
      case 'adminDownloads':      checkSecret_(body.secret); return json_({ downloads: readTrack_('Data Download') })
      default: return err_('Unknown action: ' + action)
    }
  } catch (ex) {
    return err_(ex.message || 'Admin error')
  }
}

function info_() {
  var sheets = []
  try {
    var all = ss_().getSheets()
    for (var i = 0; i < all.length; i++) sheets.push(all[i].getName())
  } catch (e) {}
  return {
    spreadsheet: ss_().getName(),
    sheets: sheets,
    secretConfigured: secret_() !== '',
  }
}

// ─── Places ───────────────────────────────────────────────────────────────

function findPlacesSheet_() {
  var sheets = ss_().getSheets()
  for (var i = 0; i < sheets.length; i++) {
    var s = sheets[i]
    var lastCol = Math.max(s.getLastColumn(), 10)
    var first = s.getRange(1, 1, 1, lastCol).getValues()[0]
    var hasCity = false
    var hasLat = false
    for (var c = 0; c < first.length; c++) {
      var k = normKey_(first[c])
      if (k === 'city') hasCity = true
      if (k === 'lat') hasLat = true
    }
    if (hasCity && hasLat) return s
  }
  throw new Error('Places sheet not found: no sheet has a header row with "city" and "lat"')
}

function placesMap_(sheet) {
  var first = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
  var map = {}
  for (var c = 0; c < first.length; c++) {
    var k = normKey_(first[c])
    if (k) map[k] = c
  }
  return map
}

function ensurePlacesColumns_(sheet, map) {
  var need = []
  var cols = PLACES_HEADERS.concat(['id'])
  for (var i = 0; i < cols.length; i++) {
    if (!(cols[i] in map)) need.push(cols[i])
  }
  if (need.length) {
    var start = sheet.getLastColumn() + 1
    sheet.getRange(1, start, 1, need.length).setValues([need])
    for (var j = 0; j < need.length; j++) map[need[j]] = start + j - 1
  }
}

function isRealPlace_(row, map) {
  var keys = PLACES_HEADERS
  for (var i = 0; i < keys.length; i++) {
    var v = row[map[keys[i]]]
    if (v !== '' && v !== undefined && v !== null && String(v).trim() !== '') return true
  }
  return false
}

// Row number (1-indexed) of the last row that holds real place data. Probes
// only a few single columns, so it never scans the tens of thousands of empty
// rows that sit below the data in this spreadsheet.
function lastRealRow_(sheet, map) {
  var probe = [map['city'], map['lat'], map['lng']].filter(function (c) { return c !== undefined })
  if (!probe.length) return 1
  var total = sheet.getLastRow()
  if (total < 2) return 1
  var last = 1
  for (var pi = 0; pi < probe.length; pi++) {
    var vals = sheet.getRange(2, probe[pi] + 1, total - 1, 1).getValues()
    for (var r = vals.length - 1; r >= 0; r--) {
      var v = vals[r][0]
      if (v !== '' && v !== undefined && v !== null && String(v).trim() !== '') {
        if (r + 2 > last) last = r + 2
        break
      }
    }
  }
  return last
}

function dataColumns_(sheet) {
  var first = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
  var maxIdx = -1
  for (var c = 0; c < first.length; c++) {
    if (String(first[c] || '').trim() !== '') maxIdx = c
  }
  return maxIdx + 1
}

function readPlaces_() {
  var sheet = findPlacesSheet_()
  var map = placesMap_(sheet)
  ensurePlacesColumns_(sheet, map)
  var lastReal = lastRealRow_(sheet, map)
  if (lastReal < 2) return { places: [] }
  var numCols = Math.max(dataColumns_(sheet), 2)
  var idCol = map['id']
  var values = sheet.getRange(2, 1, lastReal - 1, numCols).getValues()
  var places = []
  var changed = false
  for (var r = 0; r < values.length; r++) {
    if (!isRealPlace_(values[r], map)) continue
    var id = values[r][idCol]
    if (id === '' || id === undefined || id === null) {
      id = 'p' + Utilities.getUuid()
      values[r][idCol] = id
      changed = true
    }
    var p = { id: String(id) }
    for (var k in map) {
      if (k === 'id') continue
      var v = values[r][map[k]]
      p[k] = (v === undefined || v === null) ? '' : v
    }
    p.lat = num_(p.lat)
    p.lng = num_(p.lng)
    places.push(p)
  }
  if (changed) {
    var writes = []
    for (var x = 0; x < values.length; x++) {
      if (values[x][idCol] && String(values[x][idCol]) !== '') writes.push([String(values[x][idCol])])
      else writes.push([''])
    }
    sheet.getRange(2, idCol + 1, writes.length, 1).setValues(writes)
  }
  return { places: places }
}

function buildPlaceRow_(d) {
  return {
    city: clean_(d.city),
    country: clean_(d.country),
    lat: num_(d.lat),
    lng: num_(d.lng),
    emoji: clean_(d.emoji),
    date: clean_(d.date),
    type: clean_(d.type).trim(),
    image: clean_(d.image),
    description: clean_(d.description),
  }
}

function createPlace_(d) {
  if (!clean_(d.city) && num_(d.lat) === '' && num_(d.lng) === '') {
    throw new Error('A place needs at least a city name or coordinates')
  }
  var sheet = findPlacesSheet_()
  var map = placesMap_(sheet)
  ensurePlacesColumns_(sheet, map)
  var id = clean_(d.id) || ('p' + Utilities.getUuid())
  var row = buildPlaceRow_(d)
  var numCols = sheet.getLastColumn()
  var values = new Array(numCols)
  for (var c = 0; c < numCols; c++) values[c] = ''
  for (var k in map) {
    if (row[k] !== undefined) values[map[k]] = row[k]
  }
  values[map['id']] = id
  // Insert right after the last row that already holds real place data.
  var insertAt = lastRealRow_(sheet, map)
  sheet.getRange(insertAt + 1, 1, 1, numCols).setValues([values])
  return { id: id }
}

function updatePlace_(d) {
  var id = clean_(d.id)
  if (!id) throw new Error('Missing place id')
  var sheet = findPlacesSheet_()
  var map = placesMap_(sheet)
  ensurePlacesColumns_(sheet, map)
  var rowNumber = findRowByColumn_(sheet, map['id'], id)
  if (rowNumber < 0) throw new Error('Place not found: ' + id)
  var numCols = sheet.getLastColumn()
  var values = sheet.getRange(rowNumber, 1, 1, numCols).getValues()[0].slice()
  var row = buildPlaceRow_(d)
  for (var k in row) {
    if (map[k] !== undefined) values[map[k]] = row[k]
  }
  values[map['id']] = id
  sheet.getRange(rowNumber, 1, 1, numCols).setValues([values])
}

function deletePlace_(id) {
  if (!id) throw new Error('Missing place id')
  var sheet = findPlacesSheet_()
  var map = placesMap_(sheet)
  ensurePlacesColumns_(sheet, map)
  var rowNumber = findRowByColumn_(sheet, map['id'], id)
  if (rowNumber < 0) throw new Error('Place not found: ' + id)
  sheet.deleteRow(rowNumber)
}

function reorderPlaces_(ids) {
  if (!ids || !ids.length) throw new Error('No place order provided')
  var sheet = findPlacesSheet_()
  var map = placesMap_(sheet)
  ensurePlacesColumns_(sheet, map)
  var lastReal = lastRealRow_(sheet, map)
  if (lastReal < 2) return
  var numCols = Math.max(dataColumns_(sheet), 2)
  var idCol = map['id']
  var values = sheet.getRange(2, 1, lastReal - 1, numCols).getValues()
  var rowsById = {}
  var realSlots = []
  for (var r = 0; r < values.length; r++) {
    if (!isRealPlace_(values[r], map)) continue
    var id = values[r][idCol]
    if (id === '' || id === undefined || id === null) {
      id = 'p' + Utilities.getUuid()
      values[r][idCol] = id
    }
    rowsById[String(id)] = values[r]
    realSlots.push(r)
  }
  var ordered = []
  for (var i = 0; i < ids.length; i++) {
    var want = String(ids[i])
    if (rowsById[want]) { ordered.push(rowsById[want]); delete rowsById[want] }
  }
  for (var key in rowsById) ordered.push(rowsById[key])
  for (var s = 0; s < ordered.length; s++) {
    values[realSlots[s]] = ordered[s]
    values[realSlots[s]][idCol] = String(ordered[s][idCol])
  }
  sheet.getRange(2, 1, values.length, numCols).setValues(values)
}

function findRowByColumn_(sheet, col, id) {
  var last = sheet.getLastRow()
  if (last < 2) return -1
  var vals = sheet.getRange(2, col + 1, last - 1, 1).getValues()
  for (var r = 0; r < vals.length; r++) {
    if (String(vals[r][0]) === String(id)) return r + 2
  }
  return -1
}

// ─── Generic sheet helpers (Chronicles / Routes / Media) ──────────────────

function getSheet_(name, headers) {
  var s = ss_().getSheetByName(name)
  if (s) return s
  s = ss_().insertSheet(name)
  s.getRange(1, 1, 1, headers.length).setValues([headers])
  return s
}

function headerKeys_(sheet) {
  var numCols = Math.max(sheet.getLastColumn(), 1)
  var first = sheet.getRange(1, 1, 1, numCols).getValues()[0]
  var keys = {}
  for (var c = 0; c < first.length; c++) {
    var k = normKey_(first[c])
    if (k) keys[k] = c
  }
  return keys
}

function idColumn_(sheet, keys) {
  if (keys['id'] !== undefined) return keys['id']
  var c = sheet.getLastColumn() + 1
  sheet.getRange(1, c, 1, 1).setValue('id')
  keys['id'] = c - 1
  return keys['id']
}

function readRows_(sheet, keys) {
  var last = sheet.getLastRow()
  if (last < 2) return []
  var numCols = sheet.getLastColumn()
  var values = sheet.getRange(2, 1, last - 1, numCols).getValues()
  var rows = []
  for (var r = 0; r < values.length; r++) {
    var obj = {}
    var any = false
    for (var c = 0; c < numCols; c++) {
      var v = values[r][c]
      if (v !== '' && v !== undefined && v !== null) any = true
      obj[c] = (v === undefined || v === null) ? '' : v
    }
    if (any) rows.push(obj)
  }
  return rows
}

function rowToObject_(row, keys) {
  var obj = {}
  for (var k in keys) obj[k] = (row[keys[k]] === undefined) ? '' : row[keys[k]]
  return obj
}

function rowNumberById_(sheet, idCol, id) {
  var last = sheet.getLastRow()
  if (last < 2) return -1
  var vals = sheet.getRange(2, idCol + 1, last - 1, 1).getValues()
  for (var r = 0; r < vals.length; r++) {
    if (String(vals[r][0]) === String(id)) return r + 2
  }
  return -1
}

// ─── Chronicles ───────────────────────────────────────────────────────────

function nowIso_() {
  return new Date().toISOString()
}

// Starter blogs written into the Chronicles sheet on first use (only when the
// sheet is completely empty). After that the admin dashboard fully owns them —
// you can edit, delete or add more from the Blogs page.
var SEED_CHRONICLES = [
  {
    id: '1',
    title: 'Beyond the Miles',
    excerpt: 'The Road Is My Therapy',
    category: 'Experiance',
    location: '',
    date: '2026-08-01',
    tags: 'solo, ride, therapy',
    cover: '',
    audioTitle: 'Song Aid',
    audioSrc: '',
    status: 'published',
    content: '<p>I have ridden more than 5,000 km alone, and those journeys make me feel truly alive. The feeling of being on the open road, with nothing but my thoughts and the endless horizon ahead, is one of the greatest joys of my life. It is a feeling I want to carry with me until my last day.</p><p>What makes these rides even more special are the people I meet along the way. Strangers have shown me kindness, cared for me, and offered me company when I was alone. Their warmth and generosity have taught me that beautiful connections can be found anywhere.</p><p>The places I have visited have been breathtaking, each with its own beauty and memories. Every road, every sunrise, every small moment becomes a part of my story.</p><p>That is why I want to keep riding, exploring new places, meeting new people, and experiencing the freedom and peace that these journeys bring, again and again.</p>',
  },
  {
    id: '2',
    title: 'That Broken Love',
    excerpt: 'Twice I Loved, Twice I Let Go',
    category: 'Experiance',
    location: '',
    date: '2026-08-01',
    tags: 'love, heartbreak',
    cover: '',
    audioTitle: 'En Kanne Kalaimaane',
    audioSrc: '',
    status: 'published',
    content: '<p>Yes, I loved with all my heart, and I lost with a heart that was left empty.</p><p>Yes, I fell in love twice, and I lost both times.</p><p>The love I had for those who once meant the world to me was genuine. I gave my heart honestly, without pretending or holding back. Even today, I don\'t know where I failed or what I could have done differently to hold on to those relationships.</p><p>Maybe that was simply my fate. Not every love story is meant to last forever, no matter how real it feels.</p><p>Even so, I carry no resentment. I sincerely hope they find happiness, peace, and a beautiful life ahead. My love for them was never about possession — it was about wanting the best for them, even if that future didn\'t include me.</p><p>Some people remain in our hearts, not because they stayed, but because they taught us how deeply we are capable of loving. Thanks Loving !!</p>',
  },
  {
    id: '3',
    title: 'WebSite Update',
    excerpt: 'Soon gonna a fix',
    category: 'update',
    location: '',
    date: '2026-07-15',
    tags: 'update, news',
    cover: '',
    audioTitle: 'SoundHelix',
    audioSrc: '',
    status: 'published',
    content: '<p>I\'m making a few improvements behind the scenes. Some pages are still under construction while I add new content and polish the overall experience. Check back soon — there\'s more on the way!</p>',
  },
  {
    id: '4',
    title: 'My Kind of Peace',
    excerpt: 'This is What i need the most',
    category: 'Voyage',
    location: '',
    date: '2026-07-10',
    tags: 'peace, freedom, solo',
    cover: '',
    audioTitle: 'Most Needed',
    audioSrc: '',
    status: 'published',
    content: '<p>The way I see life is completely different from how most people do. Maybe that\'s why I often feel like I don\'t fit into society.</p><p>For me, happiness has always been simple. It\'s sitting quietly, watching the things I love, and finding peace in those moments. There is a quiet beauty in slowing down and simply being present.</p><p>More than anything, I want my life to be peaceful. And if protecting my peace means stepping away from the noise of society, then I\'m willing to do that. If necessary, I\'ll disappear from the crowd and choose solitude over chaos.</p><p>I love traveling alone and exploring the world at my own pace. Every journey teaches me something new, and every road brings me a sense of freedom that I can\'t find anywhere else. Being alone has never made me feel lonely — it has made me feel alive.</p><p>That is the life I want to live: a life filled with peace, freedom, meaningful experiences, and the quiet joy of discovering both the world and myself.</p>',
  },
  {
    id: '5',
    title: 'The Quiet Strength',
    excerpt: 'Amma - The Love That Raised Me.',
    category: 'Voyage',
    location: '',
    date: '2026-07-05',
    tags: 'amma, family, love',
    cover: '',
    audioTitle: "Mom's Magic",
    audioSrc: '',
    status: 'published',
    content: '<p>Amma</p><p>She is the one who taught me what life truly is. Through countless sacrifices, she shaped me into the person I am today. She is one of the greatest souls I have ever known.</p><p>Her strength, resilience, and unconditional love have guided me through every stage of my life. Every sacrifice she made became a stepping stone that helped me grow into a better person.</p><p>My greatest wish is to make her proud and to take care of her, just as she has always taken care of me. That is what matters most to me.</p><p>I may not always express my love and care in obvious ways, and others may not notice it, but deep in my heart, I will always care for her. She is, and always will be, my greatest blessing.</p>',
  },
  {
    id: '6',
    title: 'Available Soon',
    excerpt: 'Stay tuned.',
    category: 'Voyage',
    location: '',
    date: '2026-07-01',
    tags: 'coming soon',
    cover: '',
    audioTitle: 'Coming Soon',
    audioSrc: '',
    status: 'published',
    content: '<p>This blog is under construction.</p>',
  },
]

function seedChroniclesIfEmpty_() {
  var sheet = getSheet_(CHRONICLES_SHEET, CHRONICLE_HEADERS)
  var keys = headerKeys_(sheet)
  var rows = readRows_(sheet, keys)
  var hasAny = false
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][keys['id']] || '').trim() !== '') { hasAny = true; break }
  }
  if (hasAny) return
  for (var s = 0; s < SEED_CHRONICLES.length; s++) {
    var d = SEED_CHRONICLES[s]
    var row = buildChronicleRow_(d, null)
    var values = new Array(sheet.getLastColumn())
    for (var c = 0; c < values.length; c++) values[c] = ''
    for (var k in keys) {
      if (row[k] !== undefined) values[keys[k]] = row[k]
    }
    values[keys['id']] = String(d.id)
    sheet.appendRow(values)
  }
}

function readChronicles_(includeDrafts) {
  seedChroniclesIfEmpty_()
  var sheet = getSheet_(CHRONICLES_SHEET, CHRONICLE_HEADERS)
  var keys = headerKeys_(sheet)
  var rows = readRows_(sheet, keys)
  var out = []
  for (var i = 0; i < rows.length; i++) {
    var c = rowToObject_(rows[i], keys)
    if (!c.id) continue
    if (!includeDrafts && normKey_(c.status) !== 'published') continue
    out.push(c)
  }
  return { chronicles: out }
}

function buildChronicleRow_(d, existing) {
  var now = nowIso_()
  var row = {}
  row.title = clean_(d.title)
  row.excerpt = clean_(d.excerpt)
  row.category = clean_(d.category)
  row.location = clean_(d.location)
  row.date = clean_(d.date)
  row.tags = clean_(d.tags)
  row.cover = clean_(d.cover)
  row.audioTitle = clean_(d.audioTitle)
  row.audioSrc = clean_(d.audioSrc)
  row.status = normKey_(d.status) === 'published' ? 'published' : 'draft'
  row.content = clean_(d.content)
  row.created = existing && existing.created ? existing.created : now
  row.updated = now
  return row
}

function createChronicle_(d) {
  if (!clean_(d.title)) throw new Error('A chronicle needs a title')
  var sheet = getSheet_(CHRONICLES_SHEET, CHRONICLE_HEADERS)
  var keys = headerKeys_(sheet)
  var id = clean_(d.id) || ('c' + Utilities.getUuid())
  var row = buildChronicleRow_(d, null)
  var values = new Array(sheet.getLastColumn())
  for (var c = 0; c < values.length; c++) values[c] = ''
  for (var k in keys) {
    if (row[k] !== undefined) values[keys[k]] = row[k]
  }
  values[keys['id']] = id
  sheet.appendRow(values)
  return { id: id }
}

function updateChronicle_(d) {
  var id = clean_(d.id)
  if (!id) throw new Error('Missing chronicle id')
  var sheet = getSheet_(CHRONICLES_SHEET, CHRONICLE_HEADERS)
  var keys = headerKeys_(sheet)
  var idCol = keys['id']
  var rowNumber = rowNumberById_(sheet, idCol, id)
  if (rowNumber < 0) throw new Error('Chronicle not found: ' + id)
  var numCols = sheet.getLastColumn()
  var values = sheet.getRange(rowNumber, 1, 1, numCols).getValues()[0].slice()
  var current = rowToObject_(values, keys)
  var row = buildChronicleRow_(d, current)
  for (var k in row) {
    if (keys[k] !== undefined) values[keys[k]] = row[k]
  }
  values[idCol] = id
  sheet.getRange(rowNumber, 1, 1, numCols).setValues([values])
}

function deleteChronicle_(id) {
  if (!id) throw new Error('Missing chronicle id')
  var sheet = getSheet_(CHRONICLES_SHEET, CHRONICLE_HEADERS)
  var keys = headerKeys_(sheet)
  var rowNumber = rowNumberById_(sheet, keys['id'], id)
  if (rowNumber < 0) throw new Error('Chronicle not found: ' + id)
  sheet.deleteRow(rowNumber)
}

// ─── Routes (saved named routes) ──────────────────────────────────────────

function readRoutes_() {
  var sheet = getSheet_(ROUTES_SHEET, ROUTE_HEADERS)
  var keys = headerKeys_(sheet)
  var rows = readRows_(sheet, keys)
  var out = []
  for (var i = 0; i < rows.length; i++) {
    var r = rowToObject_(rows[i], keys)
    if (!r.id) continue
    try { r.places = JSON.parse(r.places || '[]') } catch (e) { r.places = [] }
    out.push(r)
  }
  return { routes: out }
}

function buildRouteRow_(d, existing) {
  var now = nowIso_()
  var places = d.places
  if (typeof places === 'string') {
    try { places = JSON.parse(places) } catch (e) { places = [] }
  }
  if (!Array.isArray(places)) places = []
  return {
    name: clean_(d.name),
    places: JSON.stringify(places),
    created: existing && existing.created ? existing.created : now,
    updated: now,
  }
}

function createRoute_(d) {
  if (!clean_(d.name)) throw new Error('A route needs a name')
  var sheet = getSheet_(ROUTES_SHEET, ROUTE_HEADERS)
  var keys = headerKeys_(sheet)
  var id = clean_(d.id) || ('r' + Utilities.getUuid())
  var row = buildRouteRow_(d, null)
  var values = new Array(sheet.getLastColumn())
  for (var c = 0; c < values.length; c++) values[c] = ''
  for (var k in keys) {
    if (row[k] !== undefined) values[keys[k]] = row[k]
  }
  values[keys['id']] = id
  sheet.appendRow(values)
  return { id: id }
}

function updateRoute_(d) {
  var id = clean_(d.id)
  if (!id) throw new Error('Missing route id')
  var sheet = getSheet_(ROUTES_SHEET, ROUTE_HEADERS)
  var keys = headerKeys_(sheet)
  var rowNumber = rowNumberById_(sheet, keys['id'], id)
  if (rowNumber < 0) throw new Error('Route not found: ' + id)
  var numCols = sheet.getLastColumn()
  var values = sheet.getRange(rowNumber, 1, 1, numCols).getValues()[0].slice()
  var current = rowToObject_(values, keys)
  var row = buildRouteRow_(d, current)
  for (var k in row) {
    if (keys[k] !== undefined) values[keys[k]] = row[k]
  }
  values[keys['id']] = id
  sheet.getRange(rowNumber, 1, 1, numCols).setValues([values])
}

function deleteRoute_(id) {
  if (!id) throw new Error('Missing route id')
  var sheet = getSheet_(ROUTES_SHEET, ROUTE_HEADERS)
  var keys = headerKeys_(sheet)
  var rowNumber = rowNumberById_(sheet, keys['id'], id)
  if (rowNumber < 0) throw new Error('Route not found: ' + id)
  sheet.deleteRow(rowNumber)
}

// ─── Media ────────────────────────────────────────────────────────────────

function readMedia_() {
  var sheet = getSheet_(MEDIA_SHEET, MEDIA_HEADERS)
  var keys = headerKeys_(sheet)
  var rows = readRows_(sheet, keys)
  var out = []
  for (var i = 0; i < rows.length; i++) {
    var m = rowToObject_(rows[i], keys)
    if (!m.id) continue
    out.push(m)
  }
  return { media: out }
}

function createMedia_(d) {
  if (!clean_(d.url)) throw new Error('A media item needs a URL')
  var sheet = getSheet_(MEDIA_SHEET, MEDIA_HEADERS)
  var keys = headerKeys_(sheet)
  var id = clean_(d.id) || ('m' + Utilities.getUuid())
  var now = nowIso_()
  var row = {
    title: clean_(d.title),
    url: clean_(d.url),
    kind: clean_(d.kind),
    created: clean_(d.created) || now,
  }
  var values = new Array(sheet.getLastColumn())
  for (var c = 0; c < values.length; c++) values[c] = ''
  for (var k in keys) {
    if (row[k] !== undefined) values[keys[k]] = row[k]
  }
  values[keys['id']] = id
  sheet.appendRow(values)
  return { id: id }
}

function deleteMedia_(id) {
  if (!id) throw new Error('Missing media id')
  var sheet = getSheet_(MEDIA_SHEET, MEDIA_HEADERS)
  var keys = headerKeys_(sheet)
  var rowNumber = rowNumberById_(sheet, keys['id'], id)
  if (rowNumber < 0) throw new Error('Media not found: ' + id)
  sheet.deleteRow(rowNumber)
}

// ─── Site Profile (key/value rows in the Profile sheet) ────────────────────
function profile_() {
  var sheet = getSheet_(PROFILE_SHEET, ['field', 'value'])
  var keys = headerKeys_(sheet)
  var rows = readRows_(sheet, keys)
  var out = {}
  for (var i = 0; i < rows.length; i++) {
    var f = clean_(rows[i][keys['field']])
    if (!f) continue
    var v = rows[i][keys['value']]
    if (PROFILE_JSON_FIELDS.indexOf(f) !== -1) {
      try { v = JSON.parse(v) } catch (e) { v = [] }
    }
    out[f] = v
  }
  return out
}

function updateProfile_(d) {
  var sheet = getSheet_(PROFILE_SHEET, ['field', 'value'])
  var keys = headerKeys_(sheet)
  var last = sheet.getLastRow()
  if (last >= 2) sheet.getRange(2, 1, last - 1, 2).clearContent()
  var rows = []
  for (var i = 0; i < PROFILE_ORDER.length; i++) {
    var k = PROFILE_ORDER[i]
    if (!(k in d)) continue
    var v = d[k]
    if (PROFILE_JSON_FIELDS.indexOf(k) !== -1) v = JSON.stringify(Array.isArray(v) ? v : [])
    rows.push([k, clean_(v)])
  }
  if (rows.length) sheet.getRange(2, 1, rows.length, 2).setValues(rows)
}

// ─── Visitors & Data Downloads (the tracking sheet) ────────────────────────
//
// The public site writes every page visit and data download into a tracking
// sheet (any sheet whose header row has "type" and "name"). The rows carry
// fields like type, action, name, date, time, browser, device, brand, os,
// screen, language, referrer, url and optionally ip/city/country/region.
// Visitors have type "Visitor"; downloads have type "Data Download".

function findTrackSheet_() {
  var sheets = ss_().getSheets()
  for (var i = 0; i < sheets.length; i++) {
    var s = sheets[i]
    var cols = Math.min(s.getLastColumn(), 60)
    if (cols < 1) continue
    var first = s.getRange(1, 1, 1, cols).getValues()[0]
    var hasType = false
    var hasName = false
    for (var c = 0; c < first.length; c++) {
      var k = normKey_(first[c])
      if (k === 'type') hasType = true
      if (k === 'name') hasName = true
    }
    if (hasType && hasName) return s
  }
  throw new Error('Tracking sheet not found (no sheet with "type" and "name" headers)')
}

// Row number (1-indexed) of the last row that holds real tracking data. Probes
// only a couple of columns so it never scans huge empty ranges.
function lastTrackRow_(sheet, map) {
  var probe = []
  if (map['type'] !== undefined) probe.push(map['type'])
  if (map['date'] !== undefined) probe.push(map['date'])
  if (!probe.length) return 1
  var total = sheet.getLastRow()
  if (total < 2) return 1
  var last = 1
  for (var pi = 0; pi < probe.length; pi++) {
    var vals = sheet.getRange(2, probe[pi] + 1, total - 1, 1).getValues()
    for (var r = vals.length - 1; r >= 0; r--) {
      var v = vals[r][0]
      if (v !== '' && v !== undefined && v !== null && String(v).trim() !== '') {
        if (r + 2 > last) last = r + 2
        break
      }
    }
  }
  return last
}

// Returns the most recent rows of the given type (newest first), capped at
// MAX_ROWS so responses stay small even with heavy traffic.
var TRACK_MAX_ROWS = 500

function readTrack_(typeFilter) {
  var sheet = findTrackSheet_()
  var map = placesMap_(sheet)
  var last = lastTrackRow_(sheet, map)
  if (last < 2) return []
  var numCols = sheet.getLastColumn()
  var values = sheet.getRange(2, 1, last - 1, numCols).getValues()
  var out = []
  for (var r = values.length - 1; r >= 0; r--) {
    var t = clean_(values[r][map['type']]).toLowerCase()
    if (typeFilter && t !== String(typeFilter).toLowerCase()) continue
    if (!t) continue
    var row = {}
    for (var k in map) row[k] = clean_(values[r][map[k]])
    out.push(row)
    if (out.length >= TRACK_MAX_ROWS) break
  }
  return out
}
