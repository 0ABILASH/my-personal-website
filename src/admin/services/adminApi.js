// API client for the admin dashboard. Every request carries the X-Admin
// header (CSRF defence) and uses cookies for the session. Credentials and the
// admin secret never appear in the browser — they stay on the server.

const BASE = '/api/admin'

async function request(path, method, body) {
  const headers = { 'X-Admin': '1' }
  let payload
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  let res
  try {
    res = await fetch(BASE + path, { method, headers, body: payload, credentials: 'same-origin' })
  } catch (e) {
    throw new Error('Network error — check your connection')
  }
  let data = null
  try { data = await res.json() } catch (e) { data = null }
  if (!res.ok) {
    const err = new Error((data && data.error) || 'Request failed (' + res.status + ')')
    err.status = res.status
    throw err
  }
  return data
}

export const adminApi = {
  login: (username, password) => request('/login', 'POST', { username, password }),
  logout: () => request('/logout', 'POST'),
  session: () => request('/session', 'GET'),
  info: () => request('/info', 'GET'),
  clearCache: () => request('/cache/clear', 'POST'),

  places: () => request('/places', 'GET'),
  createPlace: (data) => request('/places', 'POST', { data }),
  updatePlace: (id, data) => request('/places/' + encodeURIComponent(id), 'PUT', { data }),
  deletePlace: (id) => request('/places/' + encodeURIComponent(id), 'DELETE'),
  reorderPlaces: (ids) => request('/places/reorder', 'POST', { ids }),

  chronicles: () => request('/chronicles', 'GET'),
  createChronicle: (data) => request('/chronicles', 'POST', { data }),
  updateChronicle: (id, data) => request('/chronicles/' + encodeURIComponent(id), 'PUT', { data }),
  deleteChronicle: (id) => request('/chronicles/' + encodeURIComponent(id), 'DELETE'),

  routes: () => request('/routes', 'GET'),
  createRoute: (data) => request('/routes', 'POST', { data }),
  updateRoute: (id, data) => request('/routes/' + encodeURIComponent(id), 'PUT', { data }),
  deleteRoute: (id) => request('/routes/' + encodeURIComponent(id), 'DELETE'),

  media: () => request('/media', 'GET'),
  createMedia: (data) => request('/media', 'POST', { data }),
  deleteMedia: (id) => request('/media/' + encodeURIComponent(id), 'DELETE'),

  likes: () => request('/likes', 'GET'),
  visitors: () => request('/visitors', 'GET'),
  downloads: () => request('/downloads', 'GET'),
  status: () => request('/status', 'GET'),
  profile: () => request('/profile', 'GET'),
  updateProfile: (data) => request('/profile', 'PUT', { data }),
}
