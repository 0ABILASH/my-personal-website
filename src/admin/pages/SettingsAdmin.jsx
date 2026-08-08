import { useState } from 'react'
import { RefreshCw, Database, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Plug, Server, FileText, MapPin, Heart, Users, Download, User, Activity } from 'lucide-react'
import { useAdminData } from '../context/AdminDataContext'
import { useToast } from '../context/ToastContext'
import { adminApi } from '../services/adminApi'
import { PageHeader, LoadingState, ErrorState, Button, Chip } from '../components/ui'

const SERVICE_META = {
  adminBackend: { label: 'Admin backend (Google Sheets)', icon: <Server size={13} /> },
  places: { label: 'Places', icon: <MapPin size={13} /> },
  chronicles: { label: 'Blogs', icon: <FileText size={13} /> },
  profile: { label: 'Profile', icon: <User size={13} /> },
  likes: { label: 'Blog likes', icon: <Heart size={13} /> },
  visitors: { label: 'Visitor tracking', icon: <Users size={13} /> },
  downloads: { label: 'Data downloads', icon: <Download size={13} /> },
}

const ENV_META = [
  { key: 'gasUrl', label: 'GAS_URL (public data)', hint: 'travel + likes + tracking' },
  { key: 'gasAdminUrl', label: 'GAS_ADMIN_URL (admin backend)', hint: 'CRUD + analytics' },
  { key: 'adminUsername', label: 'ADMIN_USERNAME', hint: 'Access ID' },
  { key: 'adminPasswordHash', label: 'ADMIN_PASSWORD_HASH', hint: 'Access Code hash' },
  { key: 'gasAdminSecret', label: 'GAS_ADMIN_SECRET', hint: 'shared admin secret' },
]

function detailText(name, s) {
  const d = s.detail || {}
  switch (name) {
    case 'adminBackend':
      return d.spreadsheet ? d.spreadsheet + ' · ' + d.sheets + ' sheets' : 'spreadsheet unknown'
    case 'places':
    case 'chronicles':
      return d.count + (d.count === 1 ? ' item' : ' items')
    case 'profile':
      return d.fields + (d.fields === 1 ? ' field' : ' fields')
    case 'likes':
      return d.total + (d.total === 1 ? ' like' : ' likes') + ' across ' + d.blogs + ' blog(s)'
    case 'visitors':
    case 'downloads':
      return d.count + (d.count === 1 ? ' record' : ' records')
    default:
      return ''
  }
}

export default function SettingsAdmin() {
  const toast = useToast()
  const { data, loading, reload } = useAdminData()
  const [cacheBusy, setCacheBusy] = useState(false)
  const statusRes = data.status
  const status = statusRes && statusRes.ok ? statusRes.value : null

  const clearCache = async () => {
    setCacheBusy(true)
    try {
      await adminApi.clearCache()
      toast.success('Caches cleared. Public pages will refetch on next visit.')
      reload()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setCacheBusy(false)
    }
  }

  if (loading && !status) return <LoadingState label="Loading system status..." />
  if (!status) return <ErrorState message="Could not load system status." onRetry={reload} />

  const services = status.services || []
  const failed = services.filter((s) => !s.ok)
  const env = status.env || {}
  const missingEnv = ENV_META.filter((e) => !env[e.key])
  const info = data.info && data.info.ok ? data.info.value : null

  return (
    <>
      <PageHeader
        title="Site Status"
        subtitle="Connection status of every API and data source."
        actions={
          <>
            <Button variant="ghost" onClick={reload} disabled={loading} title="Refresh">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button onClick={clearCache} loading={cacheBusy} variant="outline">
              <RefreshCw size={14} />
              Clear Caches
            </Button>
          </>
        }
      />

      {/* Overall health */}
      <div className={'rounded-2xl border p-5 mb-4 flex items-start gap-4 ' + (status.ok ? 'bg-emerald-500/[0.06] border-emerald-500/25' : 'bg-red-500/[0.06] border-red-500/30')}>
        {status.ok ? (
          <CheckCircle2 size={22} className="text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle size={22} className="text-red-400 shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-bold tracking-tight">
            {status.ok ? 'All systems operational' : failed.length + ' issue' + (failed.length === 1 ? '' : 's') + ' detected'}
          </div>
          <p className="text-[12px] text-text-tertiary mt-1">
            {status.ok
              ? 'Every backend source is connected and responding.'
              : 'Some data sources are unreachable or misconfigured — review the sections below.'}
          </p>
          <p className="text-[10px] text-text-quaternary font-mono mt-2">
            checked {new Date(status.checkedAt).toLocaleString()} · {status.elapsedMs}ms
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Connections */}
        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <span className="flex items-center gap-2 text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">
              <Plug size={12} /> API Connections
            </span>
          </div>
          {ENV_META.map((e) => {
            const ok = !!env[e.key]
            return (
              <div key={e.key} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border last:border-b-0">
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold text-text-secondary truncate">{e.label}</div>
                  <div className="text-[10px] text-text-quaternary font-mono truncate">{e.hint}</div>
                </div>
                {ok ? <Chip tone="green">Configured</Chip> : <Chip tone="red">Missing</Chip>}
              </div>
            )
          })}
        </div>

        {/* Data sources */}
        <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <span className="flex items-center gap-2 text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">
              <Activity size={12} /> Data Sources
            </span>
          </div>
          {services.map((s) => {
            const meta = SERVICE_META[s.name] || { label: s.name, icon: <Database size={13} /> }
            return (
              <div key={s.name} className="px-4 py-3 border-b border-border last:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={'w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ' + (s.ok ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400')}>
                      {s.ok ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    </span>
                    <span className="text-[12.5px] font-semibold truncate">{meta.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-text-quaternary font-mono">{detailText(s.name, s)}</span>
                    {s.ok ? <Chip tone="green">OK</Chip> : <Chip tone="red">Down</Chip>}
                  </div>
                </div>
                {!s.ok && (
                  <p className="text-[11px] text-red-400/90 mt-1.5 ml-9 font-mono truncate">{s.error}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Issues */}
      {(failed.length > 0 || missingEnv.length > 0) && (
        <div className="mt-4 rounded-2xl bg-red-500/[0.06] border border-red-500/30 overflow-hidden">
          <div className="flex items-center gap-2 px-4 h-11 border-b border-red-500/20">
            <AlertTriangle size={13} className="text-red-400" />
            <span className="text-[10px] font-bold text-red-300 uppercase tracking-[0.18em] font-mono">Issues</span>
          </div>
          <div className="divide-y divide-red-500/10">
            {missingEnv.map((e) => (
              <div key={e.key} className="flex items-start gap-3 px-4 py-3">
                <ShieldAlert size={13} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-[12px] text-text-secondary leading-relaxed">
                  <span className="font-semibold text-red-300">{e.label}</span> is not set on the server. Add it to your hosting
                  platform&apos;s environment variables, then redeploy.
                </p>
              </div>
            ))}
            {failed.map((s) => (
              <div key={s.name} className="flex items-start gap-3 px-4 py-3">
                <XCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-[12px] text-text-secondary leading-relaxed">
                  <span className="font-semibold text-red-300">{(SERVICE_META[s.name] || {}).label || s.name}</span> is unreachable.{' '}
                  <span className="font-mono text-[11px] text-red-300/80">{s.error}</span> Check the GAS deployment and the{' '}
                  <code className="text-accent">GAS_ADMIN_SECRET</code> script property.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sheets */}
      <div className="mt-4 rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
        <div className="px-4 h-11 border-b border-border flex items-center gap-2">
          <Database size={13} className="text-text-tertiary" />
          <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Google Sheets</span>
        </div>
        <div className="flex flex-wrap gap-2 p-4">
          {(info && info.sheets && info.sheets.length ? info.sheets : ['—']).map((s) => (
            <span key={s} className="text-[11px] px-3 py-1.5 rounded-full bg-bg-subtle border border-border text-text-secondary font-mono">{s}</span>
          ))}
          {info && info.spreadsheet && (
            <span className="text-[10px] text-text-quaternary font-mono w-full mt-1">Spreadsheet: {info.spreadsheet}</span>
          )}
        </div>
      </div>
    </>
  )
}
