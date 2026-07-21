var SHEETS_URL = import.meta.env.VITE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbwhnLnBeAyWammouZHO-z41b5fGDG-MNEZtMOPoPYKAs218QokxLzkOVzrW5fiUN3gW5g/exec'

function formatDate(d) {
  var dd = String(d.getDate()).padStart(2, '0')
  var mm = String(d.getMonth() + 1).padStart(2, '0')
  var yyyy = d.getFullYear()
  return dd + '/' + mm + '/' + yyyy
}

function formatTime(d) {
  var hh = String(d.getHours()).padStart(2, '0')
  var mm = String(d.getMinutes()).padStart(2, '0')
  var ss = String(d.getSeconds()).padStart(2, '0')
  return hh + ':' + mm + ':' + ss
}

function send(fields) {
  if (!SHEETS_URL) return

  var params = new URLSearchParams(fields)
  params.append('_', Date.now().toString())
  var url = SHEETS_URL + '?' + params.toString()

  if (navigator.sendBeacon) {
    var blob = new Blob([], { type: 'text/html' })
    navigator.sendBeacon(url, blob)
  } else {
    var img = new Image()
    img.src = url
  }
}

function getBrowser() {
  var ua = navigator.userAgent
  if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) return 'Chrome'
  if (ua.indexOf('Edg') > -1) return 'Edge'
  if (ua.indexOf('Firefox') > -1) return 'Firefox'
  if (ua.indexOf('SamsungBrowser') > -1) return 'Samsung Browser'
  if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera'
  if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'Safari'
  return 'Other'
}

function getDevice() {
  var ua = navigator.userAgent
  if (ua.indexOf('Mobile') > -1 || (ua.indexOf('Android') > -1 && ua.indexOf('Mobile') > -1) || ua.indexOf('iPhone') > -1) return 'Mobile'
  if (ua.indexOf('iPad') > -1 || ua.indexOf('Tablet') > -1) return 'Tablet'
  return 'Desktop'
}

function getOS() {
  var ua = navigator.userAgent
  if (ua.indexOf('Win') > -1) return 'Windows'
  if (ua.indexOf('Mac') > -1) return 'macOS'
  if (ua.indexOf('Linux') > -1 && ua.indexOf('Android') === -1) return 'Linux'
  if (ua.indexOf('Android') > -1) return 'Android'
  if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'iOS'
  return 'Other'
}

export function trackVisitor(action) {
  var now = new Date()
  send({
    type: 'Visitor',
    action: action || 'pageview',
    name: '',
    date: formatDate(now),
    time: formatTime(now),
    browser: getBrowser(),
    device: getDevice(),
    os: getOS(),
    screen: screen.width + 'x' + screen.height,
    language: navigator.language || 'Unknown',
    referrer: document.referrer || 'Direct',
    url: window.location.pathname,
  })
}

export function trackCvDownload(name) {
  var now = new Date()
  send({
    type: 'CV Download',
    action: '',
    name: name || '',
    date: formatDate(now),
    time: formatTime(now),
    browser: getBrowser(),
    device: getDevice(),
    os: getOS(),
    screen: screen.width + 'x' + screen.height,
    language: navigator.language || 'Unknown',
    referrer: document.referrer || 'Direct',
    url: window.location.pathname,
  })
}
