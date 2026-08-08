// Tracking-sheet date/time helpers.
//
// The tracking sheet can return dates in two shapes:
//   1. Plain text as sent by the site:   DD/MM/YYYY  and  HH:MM:SS
//   2. Real sheet date values, serialized by Apps Script to strings like
//      "Sat Aug 08 2026 00:00:00 GMT+0530 (...)" and
//      "Sat Dec 30 1899 22:44:37 GMT+0521 (...)"
// These helpers normalise both into ISO (YYYY-MM-DD) and clean display formats.

const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 }

function pad(n) {
  return String(n).padStart(2, '0')
}

// Extract a calendar date as { y, mo, d } from either format. Returns null when
// the value is not a date.
export function parseDateParts(v) {
  const s = String(v || '').trim()
  if (!s) return null
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) return { y: Number(m[3]), mo: Number(m[2]), d: Number(m[1]) }
  m = s.match(/^[A-Za-z]{3} ([A-Za-z]{3}) (\d{1,2}) (\d{4})/)
  if (m && MONTHS[m[1]] !== undefined) return { y: Number(m[3]), mo: MONTHS[m[1]], d: Number(m[2]) }
  return null
}

// Normalise a tracking-sheet date to ISO (YYYY-MM-DD) so range comparisons
// work lexically. Returns '' when the value is not a date.
export function toISODate(v) {
  const p = parseDateParts(v)
  return p ? p.y + '-' + pad(p.mo) + '-' + pad(p.d) : ''
}

// Display a tracking-sheet date as DD/MM/YYYY ('' when not a date).
export function fmtDate(v) {
  const p = parseDateParts(v)
  return p ? pad(p.d) + '/' + pad(p.mo) + '/' + p.y : ''
}

// Display a tracking-sheet time as HH:MM:SS ('' when not a time). The time
// may arrive as plain "HH:MM:SS" or embedded in a serialized date string like
// "Sat Dec 30 1899 22:44:37 GMT+0521 (...)".
export function fmtTime(v) {
  const m = String(v || '').trim().match(/(\d{1,2}):(\d{2}):(\d{2})/)
  return m ? pad(m[1]) + ':' + m[2] + ':' + m[3] : ''
}

// DD/MM/YYYY of today's local date — used for "today" comparisons.
export function todayDisplay() {
  const d = new Date()
  return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear()
}

export function isToday(v) {
  return fmtDate(v) === todayDisplay()
}
