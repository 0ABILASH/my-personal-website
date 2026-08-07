import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, PenLine, Heart, Compass, Star, FileText, Clock, LocateFixed } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import { StatCard, LoadingState, ErrorState, PageHeader, Chip } from '../components/ui'
import { getActivity, timeAgo } from '../utils'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [placesRes, chroniclesRes, likesRes] = await Promise.all([
        adminApi.places(),
        adminApi.chronicles(),
        adminApi.likes().catch(() => ({ likes: {} })),
      ])
      setData({
        places: placesRes.places || [],
        chronicles: chroniclesRes.chronicles || [],
        likes: likesRes.likes || {},
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <LoadingState label="Loading dashboard..." />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!data) return <LoadingState label="Loading dashboard..." />

  const places = data.places || []
  const chronicles = data.chronicles || []
  const likes = data.likes || {}
  const visited = places.filter((p) => String(p.type || '').trim() === 'visited').length
  const favorites = places.filter((p) => String(p.type || '').trim() === 'small').length
  const current = places.filter((p) => String(p.type || '').trim() === 'current').length
  const published = chronicles.filter((c) => String(c.status || '').trim() === 'published').length
  const drafts = chronicles.filter((c) => String(c.status || '').trim() !== 'published').length
  const totalLikes = Object.keys(likes).reduce((sum, k) => sum + Number(likes[k] || 0), 0)

  const chronicleById = {}
  chronicles.forEach((c) => { chronicleById[String(c.id)] = c })
  const topLiked = Object.keys(likes)
    .map((id) => ({
      id,
      count: Number(likes[id] || 0),
      title: (chronicleById[String(id).replace(/^sheet-/, '')] || {}).title || id,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)

  const recentPlaces = places.slice(-4).reverse()
  const recentChronicles = chronicles
    .slice()
    .sort((a, b) => String(b.updated || b.created || '').localeCompare(String(a.updated || a.created || '')))
    .slice(0, 4)
  const activity = getActivity()

  const quick = [
    { to: '/admin/chronicles?new=1', label: 'New Blog', icon: <PenLine size={14} /> },
    { to: '/admin/places?new=1', label: 'Add Place', icon: <MapPin size={14} /> },
  ]

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your travel website data."
        actions={
          <div className="flex flex-wrap gap-2">
            {quick.map((q) => (
              <Link
                key={q.label}
                to={q.to}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-[12px] font-semibold shadow-[0_2px_16px_rgba(59,130,246,0.3)] transition-all"
              >
                {q.icon}
                {q.label}
              </Link>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Places" value={places.length} icon={<MapPin size={15} />} tone="blue" />
        <StatCard label="Visited" value={visited} icon={<Compass size={15} />} tone="green" />
        <StatCard label="Favorites" value={favorites} icon={<Heart size={15} />} tone="teal" />
        <StatCard label="Current" value={current} icon={<LocateFixed size={15} />} tone="yellow" />
        <StatCard label="Published Blogs" value={published} icon={<FileText size={15} />} tone="green" />
        <StatCard label="Drafts" value={drafts} icon={<Star size={15} />} tone="yellow" />
        <StatCard label="Total Likes" value={totalLikes} icon={<Heart size={15} />} tone="red" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Recent Blogs</span>
            <Link to="/admin/chronicles" className="text-[11px] text-accent hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {recentChronicles.length === 0 && (
              <p className="text-[12px] text-text-tertiary px-4 py-8 text-center">No blogs yet.</p>
            )}
            {recentChronicles.map((c) => (
              <Link key={c.id} to="/admin/chronicles" className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-surface transition-colors">
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold truncate">{c.title || 'Untitled'}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Chip tone={String(c.status || '').trim() === 'published' ? 'green' : 'yellow'}>
                      {String(c.status || 'draft').toLowerCase()}
                    </Chip>
                    {c.category && <span className="text-[10px] text-text-quaternary font-mono">{c.category}</span>}
                  </div>
                </div>
                <span className="text-[10px] text-text-quaternary font-mono shrink-0">{c.date || ''}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Recent Places</span>
            <Link to="/admin/places" className="text-[11px] text-accent hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {recentPlaces.length === 0 && (
              <p className="text-[12px] text-text-tertiary px-4 py-8 text-center">No places yet.</p>
            )}
            {recentPlaces.map((p) => (
              <Link key={p.id} to="/admin/places" className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-surface transition-colors">
                <div className="min-w-0 flex items-center gap-2.5">
                  <span className="text-base">{p.emoji || '📍'}</span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold truncate">{p.city || 'Untitled place'}</div>
                    <div className="text-[10px] text-text-quaternary font-mono truncate">{p.country || ''}</div>
                  </div>
                </div>
                <Chip tone={String(p.type || '').trim() === 'visited' ? 'green' : String(p.type || '').trim() === 'small' ? 'teal' : 'gray'}>
                  {String(p.type || 'place').trim() || 'place'}
                </Chip>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {totalLikes > 0 && (
        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden mt-4">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Most Liked</span>
            <Heart size={12} className="text-red-400" />
          </div>
          <div className="divide-y divide-border">
            {topLiked.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-2 px-4 py-3">
                <span className="text-[12.5px] text-text-secondary truncate min-w-0">{t.title}</span>
                <span className="text-[11px] font-mono text-text-quaternary shrink-0">{t.count} ♥</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden mt-4">
        <div className="flex items-center justify-between px-4 h-11 border-b border-border">
          <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Recent Activity</span>
          <span className="text-[10px] text-text-quaternary font-mono">This device only</span>
        </div>
        <div className="divide-y divide-border">
          {activity.length === 0 && (
            <p className="text-[12px] text-text-tertiary px-4 py-8 text-center">
              No admin activity yet. Actions you take will appear here.
            </p>
          )}
          {activity.slice(0, 10).map((a, i) => (
            <div key={i} className="flex items-center gap-2.5 px-4 py-3">
              <Clock size={12} className="text-text-quaternary shrink-0" />
              <span className="text-[12px] text-text-secondary flex-1 min-w-0 truncate">{a.text}</span>
              <span className="text-[10px] text-text-quaternary font-mono shrink-0">{timeAgo(a.at)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
