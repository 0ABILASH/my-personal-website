import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin, PenLine, Heart, Compass, LocateFixed,
  FileText, Star, Clock, ArrowUpRight, Sparkles,
  Users, Download, Calendar, Smartphone, Monitor,
} from 'lucide-react'
import { useAdminData } from '../context/AdminDataContext'
import { StatCard, LoadingState, ErrorState, PageHeader, Chip } from '../components/ui'
import { getActivity, timeAgo } from '../utils'

// Sheet dates are stored as DD/MM/YYYY — normalise to ISO (YYYY-MM-DD) so
// range comparisons work lexically. Returns '' when the value isn't a date.
function toISODate(sheetDate) {
  const m = String(sheetDate || '').trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) return ''
  return m[3] + '-' + String(m[2]).padStart(2, '0') + '-' + String(m[1]).padStart(2, '0')
}

// Local date (YYYY-MM-DD) for a day offset from today.
function localISODate(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() - offsetDays)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return y + '-' + m + '-' + dd
}

export default function Dashboard() {
  const { data, loading, reload } = useAdminData()
  const [datePreset, setDatePreset] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const coreFailed = ['places', 'chronicles', 'likes']
    .map((k) => data[k])
    .find((r) => r && !r.ok)
  if (coreFailed) return <ErrorState message={coreFailed.error} onRetry={reload} />
  if (loading && !data.places) return <LoadingState label="Loading dashboard..." />

  const places = data.places ? data.places.value : []
  const chronicles = data.chronicles ? data.chronicles.value : []
  const likes = data.likes ? data.likes.value : {}

  const visited = places.filter((p) => String(p.type || '').trim() === 'visited').length
  const favorites = places.filter((p) => String(p.type || '').trim() === 'small').length
  const current = places.filter((p) => String(p.type || '').trim() === 'current').length
  const published = chronicles.filter((c) => String(c.status || '').trim() === 'published').length
  const drafts = chronicles.filter((c) => String(c.status || '').trim() !== 'published').length
  const totalLikes = Object.keys(likes).reduce((sum, k) => sum + Number(likes[k] || 0), 0)

  const chronicleById = {}
  chronicles.forEach((c) => { chronicleById[String(c.id)] = c })

  const blogTitle = (id) => {
    const key = String(id).replace(/^sheet-/, '')
    const c = chronicleById[key]
    return c && c.title ? c.title : String(id)
  }

  const likedBlogs = Object.keys(likes)
    .map((id) => ({ id, count: Number(likes[id] || 0), title: blogTitle(id) }))
    .filter((l) => l.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
  const maxLike = Math.max(1, ...likedBlogs.map((l) => l.count))

  const recentPlaces = places.slice(-4).reverse()
  const recentChronicles = chronicles
    .slice()
    .sort((a, b) => String(b.updated || b.created || '').localeCompare(String(a.updated || a.created || '')))
    .slice(0, 4)
  const activity = getActivity()

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  // ── Visitor & download analytics (data already loaded via AdminDataContext) ──
  let rangeFrom = ''
  let rangeTo = ''
  if (datePreset === 'today') { rangeFrom = localISODate(0); rangeTo = localISODate(0) }
  else if (datePreset === '7d') { rangeFrom = localISODate(6); rangeTo = localISODate(0) }
  else if (datePreset === '30d') { rangeFrom = localISODate(29); rangeTo = localISODate(0) }
  else if (datePreset === 'custom') { rangeFrom = dateFrom; rangeTo = dateTo }

  const inRange = (rowDate) => {
    const iso = toISODate(rowDate)
    if (!iso) return !rangeFrom && !rangeTo
    if (rangeFrom && iso < rangeFrom) return false
    if (rangeTo && iso > rangeTo) return false
    return true
  }

  const vRes = data.visitors
  const dRes = data.downloads
  const allVisitors = vRes && vRes.ok ? vRes.value : []
  const allDownloads = dRes && dRes.ok ? dRes.value : []
  const filteredVisitors = allVisitors.filter((v) => inRange(v.date))
  const filteredDownloads = allDownloads.filter((d) => inRange(d.date))

  const applyPreset = (k) => {
    setDatePreset(k)
    if (k !== 'custom') { setDateFrom(''); setDateTo('') }
  }

  const rowStamp = (r) => {
    const d = String(r.date || '')
    const t = String(r.time || '')
    return (d || '—') + (t ? ' · ' + t : '')
  }

  const rangeLabel = (iso) => (iso ? iso.split('-').reverse().join('/') : '')

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

      {/* Hero greeting */}
      <div className="relative rounded-2xl bg-gradient-to-r from-accent/[0.14] via-accent/[0.05] to-transparent border border-accent/20 p-5 sm:p-6 mb-6 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono mb-2">
              <Sparkles size={11} className="text-accent" />
              Welcome back
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight mb-1">Hey Abilash</h2>
            <p className="text-[12px] text-text-tertiary">{today}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl font-black text-accent leading-none">{totalLikes}</div>
            <div className="text-[10px] text-text-tertiary mt-1.5 font-mono">total likes</div>
          </div>
        </div>
      </div>

      {/* Travel stats */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Travel</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Places" value={places.length} icon={<MapPin size={15} />} tone="blue" />
        <StatCard label="Visited" value={visited} icon={<Compass size={15} />} tone="green" />
        <StatCard label="Favorites" value={favorites} icon={<Heart size={15} />} tone="teal" />
        <StatCard label="Current" value={current} icon={<LocateFixed size={15} />} tone="yellow" />
      </div>

      {/* Blog stats */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Blogs</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Published" value={published} icon={<FileText size={15} />} tone="green" />
        <StatCard label="Drafts" value={drafts} icon={<Star size={15} />} tone="yellow" />
        <StatCard label="Blogs With Likes" value={likedBlogs.length} icon={<Heart size={15} />} tone="red" />
        <StatCard label="Total Likes" value={totalLikes} icon={<Heart size={15} />} tone="blue" />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Blog likes */}
        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Blog Likes</span>
            <Heart size={12} className="text-red-400" />
          </div>
          <div className="p-4 space-y-3">
            {likedBlogs.length === 0 && (
              <p className="text-[12px] text-text-tertiary py-6 text-center">
                No likes yet — they&apos;ll show up here once visitors love your blogs.
              </p>
            )}
            {likedBlogs.map((l) => (
              <div key={l.id} className="group">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[12.5px] font-medium text-text-secondary truncate min-w-0">
                    {l.title}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-semibold shrink-0">
                    <Heart size={9} className="fill-current" />
                    {l.count} {l.count === 1 ? 'like' : 'likes'}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-bg-subtle border border-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-700"
                    style={{ width: Math.max(8, (l.count / maxLike) * 100) + '%' }}
                  />
                </div>
              </div>
            ))}
            {likedBlogs.length > 0 && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-text-quaternary font-mono">{likedBlogs.length} blog(s)</span>
                <span className="text-[10px] text-text-quaternary font-mono">{totalLikes} likes total</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent blogs */}
        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Recent Blogs</span>
            <Link to="/admin/chronicles" className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline">
              View all <ArrowUpRight size={11} />
            </Link>
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
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent places */}
        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Recent Places</span>
            <Link to="/admin/places" className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline">
              View all <ArrowUpRight size={11} />
            </Link>
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

        {/* Recent activity */}
        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
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
      </div>

      {/* Analytics */}
      <div className="flex items-center gap-2 mb-2.5 mt-8">
        <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Analytics</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Date filter */}
      <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border p-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono mr-1">
            <Calendar size={11} /> Date Filter
          </span>
          {[['all', 'All'], ['today', 'Today'], ['7d', 'Last 7 Days'], ['30d', 'Last 30 Days'], ['custom', 'Custom']].map(([k, label]) => (
            <button
              key={k}
              onClick={() => applyPreset(k)}
              className={
                'px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all border cursor-pointer ' +
                (datePreset === k ? 'bg-accent-soft text-accent border-accent/20' : 'bg-surface border-border text-text-tertiary hover:text-text')
              }
            >
              {label}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => { setDateFrom(e.target.value); setDatePreset('custom') }}
              className="h-9 rounded-xl bg-bg border border-border px-3 text-[12px] text-text-secondary font-mono outline-none focus:border-accent/40"
            />
            <span className="text-[10px] text-text-quaternary">→</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => { setDateTo(e.target.value); setDatePreset('custom') }}
              className="h-9 rounded-xl bg-bg border border-border px-3 text-[12px] text-text-secondary font-mono outline-none focus:border-accent/40"
            />
            {(dateFrom || dateTo || datePreset !== 'all') && (
              <button
                onClick={() => applyPreset('all')}
                className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-text-tertiary hover:text-text hover:bg-surface transition-all cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <p className="text-[10px] text-text-quaternary font-mono mt-2.5">
          Showing {filteredVisitors.length} of {allVisitors.length} visitors · {filteredDownloads.length} of {allDownloads.length} downloads
          {rangeFrom && ' from ' + rangeLabel(rangeFrom)}
          {rangeTo && ' to ' + rangeLabel(rangeTo)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard label="Total Visitors" value={filteredVisitors.length} icon={<Users size={15} />} tone="blue" />
        <StatCard label="Total Downloads" value={filteredDownloads.length} icon={<Download size={15} />} tone="teal" />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Visitor activity */}
        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Visitor Activity</span>
            <span className="text-[10px] text-text-quaternary font-mono">{filteredVisitors.length} in period</span>
          </div>
          <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
            {filteredVisitors.length === 0 && (
              <p className="text-[12px] text-text-tertiary px-4 py-8 text-center">No visitors in this period.</p>
            )}
            {filteredVisitors.slice(0, 60).map((v, i) => (
              <div key={i} className="px-4 py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-bg-subtle border border-border flex items-center justify-center text-text-tertiary shrink-0">
                    {String(v.device || '').toLowerCase() === 'mobile' ? <Smartphone size={11} /> : <Monitor size={11} />}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-text-secondary truncate flex items-center gap-1.5">
                      {String(v.url || '/')}
                      {String(v.action || '').trim() && <Chip tone="gray">{String(v.action).trim()}</Chip>}
                    </div>
                    <div className="text-[10px] text-text-quaternary font-mono truncate">
                      {v.browser || '—'} · {v.os || '—'} · {v.device || '—'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-text-quaternary font-mono shrink-0">{rowStamp(v)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Download activity */}
        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Download Activity</span>
            <span className="text-[10px] text-text-quaternary font-mono">{filteredDownloads.length} in period</span>
          </div>
          <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
            {filteredDownloads.length === 0 && (
              <p className="text-[12px] text-text-tertiary px-4 py-8 text-center">No downloads in this period.</p>
            )}
            {filteredDownloads.slice(0, 60).map((d, i) => (
              <div key={i} className="px-4 py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-bg-subtle border border-border flex items-center justify-center text-text-tertiary shrink-0">
                    <Download size={11} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-text-secondary truncate">{String(d.name || 'Anonymous')}</div>
                    <div className="text-[10px] text-text-quaternary font-mono truncate">
                      {d.browser || '—'} · {d.device || '—'} · {d.os || '—'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-text-quaternary font-mono shrink-0">{rowStamp(d)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
