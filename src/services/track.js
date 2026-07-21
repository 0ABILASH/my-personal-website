const SHEETS_URL = import.meta.env.VITE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbwcFe2sB0xmbOPtZDbcXj77RGgdFNRGXWq_BbaCW_7uWPv86VPj1qBl52lCxyqW4mJBxA/exec'

function send(fields) {
  if (!SHEETS_URL) return
  var qs = new URLSearchParams(fields).toString()
  new Image().src = SHEETS_URL + '?' + qs + '&_=' + Date.now()
}

function getBrowser() {
  var ua = navigator.userAgent
  if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) return 'Chrome'
  if (ua.indexOf('Edg') > -1) return 'Edge'
  if (ua.indexOf('Firefox') > -1) return 'Firefox'
  if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'Safari'
  return 'Other'
}

function getDevice() {
  var ua = navigator.userAgent
  if (ua.indexOf('Mobile') > -1 || ua.indexOf('Android') > -1 || ua.indexOf('iPhone') > -1) return 'Mobile'
  return 'Desktop'
}

function getOS() {
  var ua = navigator.userAgent
  if (ua.indexOf('Win') > -1) return 'Windows'
  if (ua.indexOf('Mac') > -1) return 'macOS'
  if (ua.indexOf('Linux') > -1) return 'Linux'
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
    date: now.toLocaleDateString('en-IN'),
    time: now.toLocaleTimeString('en-IN'),
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
    date: now.toLocaleDateString('en-IN'),
    time: now.toLocaleTimeString('en-IN'),
    browser: getBrowser(),
    device: getDevice(),
    os: getOS(),
    screen: screen.width + 'x' + screen.height,
    language: navigator.language || 'Unknown',
    referrer: document.referrer || 'Direct',
    url: window.location.pathname,
  })
}
