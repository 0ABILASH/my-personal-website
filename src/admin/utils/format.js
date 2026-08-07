// Small formatting helpers for the admin dashboard.

// Convert a Google Drive share link (or file id) into the same thumbnail URL
// format the website already uses, e.g.
//   https://drive.google.com/file/d/ABC/view → https://drive.google.com/thumbnail?id=ABC&sz=w800
export function toDriveThumb(url, size) {
  const s = String(url || '').trim()
  if (!s) return ''
  const m = s.match(/[?&]id=([A-Za-z0-9_-]+)/) || s.match(/\/d\/([A-Za-z0-9_-]+)/)
  if (m && m[1]) return 'https://drive.google.com/thumbnail?id=' + m[1] + '&sz=w' + (size || 800)
  return s
}

export function isDriveLink(url) {
  return /drive\.google\.com\/(file|open|uc|thumbnail)/i.test(String(url || ''))
}

export function timeAgo(ts) {
  if (!ts) return ''
  const n = Number(ts)
  if (!n) return ''
  const diff = Date.now() - n
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return min + 'm ago'
  const hr = Math.floor(min / 60)
  if (hr < 24) return hr + 'h ago'
  const day = Math.floor(hr / 24)
  return day + 'd ago'
}

export function formatDate(d) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch (e) {
    return String(d)
  }
}

export function stripHtml(html) {
  return String(html || '').replace(/<[^>]*>/g, ' ')
}
