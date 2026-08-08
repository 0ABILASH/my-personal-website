import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { adminApi } from '../services/adminApi'

// Loads every admin data source as soon as the admin area mounts, so each
// page renders instantly and the dashboard can show one consistent view of
// the whole backend. Each fetch is isolated — one failing source never blocks
// the others (the page shows a per-source issue instead).
const AdminDataContext = createContext(null)

const EMPTY = {
  places: null,
  chronicles: null,
  profile: null,
  likes: null,
  visitors: null,
  downloads: null,
  info: null,
  status: null,
}

export function AdminDataProvider({ children }) {
  const [data, setData] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const grab = (fn, transform) =>
      Promise.resolve()
        .then(fn)
        .then((v) => ({ ok: true, value: transform ? transform(v) : v }))
        .catch((e) => ({ ok: false, value: null, error: e && e.message ? e.message : String(e) }))

    Promise.all([
      grab(() => adminApi.places(), (r) => r.places || []),
      grab(() => adminApi.chronicles(), (r) => r.chronicles || []),
      grab(() => adminApi.profile(), (r) => r || {}),
      grab(() => adminApi.likes(), (r) => r.likes || {}),
      grab(() => adminApi.visitors(), (r) => r.visitors || []),
      grab(() => adminApi.downloads(), (r) => r.downloads || []),
      grab(() => adminApi.info()),
      grab(() => adminApi.status()),
    ]).then(([places, chronicles, profile, likes, visitors, downloads, info, status]) => {
      if (cancelled) return
      setData({
        places,
        chronicles,
        profile,
        likes,
        visitors,
        downloads,
        info,
        status,
      })
      setLoading(false)
      setLastUpdated(new Date())
    })

    return () => { cancelled = true }
  }, [reloadKey])

  const value = useMemo(
    () => ({ data, loading, lastUpdated, reload }),
    [data, loading, lastUpdated, reload]
  )

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider')
  return ctx
}

export function getSlice(res) {
  if (!res) return null
  if (res.ok) return res.value
  throw new Error(res.error || 'Load failed')
}
