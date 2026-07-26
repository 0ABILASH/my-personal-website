var API_URL = '/api/track'

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
  var payload = Object.assign({}, fields, { _: Date.now().toString() })

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(function () {})
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

function getBrand() {
  var ua = navigator.userAgent
  if (ua.indexOf('Samsung') > -1) return 'Samsung'
  if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'Apple'
  if (ua.indexOf('Pixel') > -1) return 'Google'
  if (ua.indexOf('OnePlus') > -1) return 'OnePlus'
  if (ua.indexOf('Xiaomi') > -1 || ua.indexOf('Mi ') > -1) return 'Xiaomi'
  if (ua.indexOf('Redmi') > -1) return 'Xiaomi'
  if (ua.indexOf('Realme') > -1) return 'Realme'
  if (ua.indexOf('OPPO') > -1) return 'OPPO'
  if (ua.indexOf('Vivo') > -1) return 'Vivo'
  if (ua.indexOf('Huawei') > -1) return 'Huawei'
  if (ua.indexOf('Motorola') > -1 || ua.indexOf('Moto') > -1) return 'Motorola'
  if (ua.indexOf('Nokia') > -1) return 'Nokia'
  if (ua.indexOf('Sony') > -1) return 'Sony'
  if (ua.indexOf('Nothing') > -1) return 'Nothing'
  if (ua.indexOf('Android') > -1) return 'Android Device'
  if (ua.indexOf('Windows') > -1 || ua.indexOf('Win') > -1) return 'Windows PC'
  if (ua.indexOf('Mac') > -1) return 'Apple Mac'
  if (ua.indexOf('Linux') > -1) return 'Linux PC'
  return 'Unknown'
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
    brand: getBrand(),
    os: getOS(),
    screen: screen.width + 'x' + screen.height,
    language: navigator.language || 'Unknown',
    referrer: document.referrer || 'Direct',
    url: window.location.pathname,
  })
}

export function trackDataDownload(name) {
  var now = new Date()
  send({
    type: 'Data Download',
    action: '',
    name: name || '',
    date: formatDate(now),
    time: formatTime(now),
    browser: getBrowser(),
    device: getDevice(),
    brand: getBrand(),
    os: getOS(),
    screen: screen.width + 'x' + screen.height,
    language: navigator.language || 'Unknown',
    referrer: document.referrer || 'Direct',
    url: window.location.pathname,
  })
}
