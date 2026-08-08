import { useMemo } from 'react'
import { Users, Download, Monitor, Smartphone, RefreshCw, Globe, Clock, MousePointerClick } from 'lucide-react'
import { useAdminData } from '../context/AdminDataContext'
import { StatCard, LoadingState, ErrorState, PageHeader, Button, Chip, EmptyState } from '../components/ui'

function todayStr() {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return dd + '/' + mm + '/' + d.getFullYear()
}

function isToday(date) {
  return String(date || '') === todayStr()
}

function summarize(list) {
  let mobile = 0
  const byBrowser = {}
  const byDevice = {}
  let today = 0
  list.forEach((v) => {
    const dev = String(v.device || 'Unknown')
    byDevice[dev] = (byDevice[dev] || 0) + 1
    if (dev === 'Mobile') mobile++
    const br = String(v.browser || 'Unknown')
    byBrowser[br] = (byBrowser[br] || 0) + 1
    if (isToday(v.date)) today++
  })
  const topBrowser = Object.keys(byBrowser).sort((a, b) => byBrowser[b] - byBrowser[a])[0] || '—'
  return { mobile, desktop: list.length - mobile, byDevice, today, topBrowser }
}

export default function VisitorsAdmin() {
  const { data, loading, reload } = useAdminData()
  const visitors = data.visitors
  const downloads = data.downloads

  const vRes = useMemo(() => (visitors && visitors.ok ? summarize(visitors.value) : null), [visitors])
  const dRes = useMemo(() => (downloads && downloads.ok ? downloads.value : null), [downloads])

  if (loading && !visitors) return <LoadingState label="Loading analytics..." />

  const vError = visitors && !visitors.ok ? visitors.error : ''
  const dError = downloads && !downloads.ok ? downloads.error : ''

  const showTable = (v) => {
    const d = String(v.date || '')
    const t = String(v.time || '')
    return (d ? d + ' · ' : '') + (t || '')
  }

  return (
    <>
      <PageHeader
        title="Visitors"
        subtitle="Visitor traffic and data downloads recorded from the live site."
        actions={
          <Button variant="ghost" onClick={reload} disabled={loading} title="Refresh">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Visitors" value={vRes ? visitors.value.length : '—'} icon={<Users size={15} />} tone="blue" />
        <StatCard label="Today" value={vRes ? vRes.today : '—'} icon={<Clock size={15} />} tone="green" />
        <StatCard label="Downloads" value={dRes ? dRes.length : '—'} icon={<Download size={15} />} tone="teal" />
        <StatCard label="Mobile" value={vRes ? vRes.mobile + ' / ' + vRes.desktop : '—'} icon={vRes && vRes.mobile > vRes.desktop ? <Smartphone size={15} /> : <Monitor size={15} />} tone="yellow" />
      </div>

      {vError && <ErrorState message={'Visitors: ' + vError} onRetry={reload} />}
      {dError && <ErrorState message={'Downloads: ' + dError} onRetry={reload} />}

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Visitors */}
        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <span className="flex items-center gap-2 text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">
              <Users size={12} /> Visitors
            </span>
            {vRes && (
              <span className="text-[10px] text-text-quaternary font-mono">
                top browser: {vRes.topBrowser}
              </span>
            )}
          </div>
          <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
            {vRes && visitors.value.length === 0 && (
              <EmptyState icon={<Users size={18} />} title="No visitors yet" hint="Page visits recorded by the site appear here." />
            )}
            {(vRes ? visitors.value : []).slice(0, 100).map((v, i) => (
              <div key={i} className="px-4 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-bg-subtle border border-border flex items-center justify-center text-text-tertiary shrink-0">
                      {String(v.device || '').toLowerCase() === 'mobile' ? <Smartphone size={11} /> : <Monitor size={11} />}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-text-secondary truncate flex items-center gap-1.5">
                        {String(v.url || '/')}
                        {String(v.action || '').trim() && (
                          <Chip tone="gray">{String(v.action).trim()}</Chip>
                        )}
                      </div>
                      <div className="text-[10px] text-text-quaternary font-mono truncate">
                        {v.browser || '—'} · {v.brand || '—'} · {v.os || '—'} · {v.device || '—'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-text-quaternary font-mono shrink-0">{showTable(v)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Downloads */}
        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <span className="flex items-center gap-2 text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">
              <Download size={12} /> Data Downloads
            </span>
            {dRes && (
              <span className="text-[10px] text-text-quaternary font-mono">{dRes.length} total</span>
            )}
          </div>
          <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
            {dRes && dRes.length === 0 && (
              <EmptyState icon={<Download size={18} />} title="No downloads yet" hint="People who download your data from the site appear here." />
            )}
            {(dRes || []).slice(0, 100).map((d, i) => (
              <div key={i} className="px-4 py-2.5">
                <div className="flex items-center justify-between gap-2">
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
                  <span className="text-[10px] text-text-quaternary font-mono shrink-0">{showTable(d)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {(vRes && vRes.topBrowser !== '—') && (
        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <span className="flex items-center gap-2 text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">
              <Globe size={12} /> Devices & Browsers
            </span>
            <span className="text-[10px] text-text-quaternary font-mono">last 500 tracked visits</span>
          </div>
          <div className="p-4 grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              {Object.keys(vRes.byDevice).sort((a, b) => vRes.byDevice[b] - vRes.byDevice[a]).map((k) => (
                <div key={k} className="flex items-center justify-between gap-2">
                  <span className="text-[11.5px] text-text-secondary flex items-center gap-1.5">
                    <MousePointerClick size={11} className="text-text-quaternary" /> {k}
                  </span>
                  <span className="text-[11px] font-mono text-text-quaternary">{vRes.byDevice[k]}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {Object.keys(vRes.byDevice).sort((a, b) => vRes.byDevice[b] - vRes.byDevice[a]).map((k) => {
                const pct = Math.round((vRes.byDevice[k] / Math.max(1, visitors.value.length)) * 100)
                return (
                  <div key={k} className="flex items-center gap-2">
                    <span className="text-[10px] text-text-quaternary w-10 font-mono shrink-0">{pct}%</span>
                    <div className="h-1.5 rounded-full bg-bg-subtle border border-border overflow-hidden flex-1">
                      <div className="h-full rounded-full bg-accent" style={{ width: Math.max(4, pct) + '%' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
