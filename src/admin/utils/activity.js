// Local-only admin activity feed (stored in localStorage). Used by the
// Dashboard "Recent Activity" panel. Never leaves the browser.

const KEY = 'admin_activity_v1'
const MAX = 20

export function logActivity(text) {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]')
    list.unshift({ text: String(text || ''), at: Date.now() })
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)))
  } catch (e) {}
}

export function getActivity() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch (e) {
    return []
  }
}

export function clearActivity() {
  try { localStorage.removeItem(KEY) } catch (e) {}
}
