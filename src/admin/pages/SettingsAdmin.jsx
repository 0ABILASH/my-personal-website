import { useState, useEffect, useCallback } from 'react'
import { Database, Wifi, Info, RefreshCw, ShieldCheck, ShieldAlert } from 'lucide-react'
import { adminApi } from '../services/adminApi'
import { useToast } from '../context/ToastContext'
import { PageHeader, LoadingState, ErrorState, Button, Chip } from '../components/ui'

function InfoRow({ icon, label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-border last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-8 h-8 rounded-lg bg-bg-subtle border border-border flex items-center justify-center text-text-tertiary shrink-0">{icon}</span>
        <span className="text-[13px] font-semibold">{label}</span>
      </div>
      <div className="min-w-0 text-right">{children}</div>
    </div>
  )
}

export default function SettingsAdmin() {
  const toast = useToast()
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [cacheBusy, setCacheBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setInfo(await adminApi.info())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const clearCache = async () => {
    setCacheBusy(true)
    try {
      await adminApi.clearCache()
      toast.success('Caches cleared. Public pages will refetch on next visit.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setCacheBusy(false)
    }
  }

  if (loading) return <LoadingState label="Loading settings..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Backend status, storage and cache controls."
        actions={
          <>
            <Button variant="ghost" onClick={load} disabled={loading} title="Refresh">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button onClick={clearCache} loading={cacheBusy} variant="outline">
              <RefreshCw size={14} />
              Clear Caches
            </Button>
          </>
        }
      />

      <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
        <div className="px-4 h-11 border-b border-border flex items-center gap-2">
          <Database size={13} className="text-text-tertiary" />
          <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Google Sheets backend</span>
        </div>
        <InfoRow icon={<Info size={14} />} label="Spreadsheet">
          <span className="text-[12px] text-text-secondary font-mono">{info && info.spreadsheet ? info.spreadsheet : '—'}</span>
        </InfoRow>
        <InfoRow icon={<ShieldCheck size={14} />} label="Admin secret">
          {info && info.secretConfigured ? (
            <Chip tone="green">Configured</Chip>
          ) : (
            <Chip tone="red">Missing</Chip>
          )}
        </InfoRow>
        <InfoRow icon={<Wifi size={14} />} label="Admin backend">
          {error ? <Chip tone="red">Unreachable</Chip> : <Chip tone="green">Connected</Chip>}
        </InfoRow>
      </div>

      <div className="mt-4 rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
        <div className="px-4 h-11 border-b border-border flex items-center gap-2">
          <Database size={13} className="text-text-tertiary" />
          <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Sheets</span>
        </div>
        <div className="flex flex-wrap gap-2 p-4">
          {(info && info.sheets && info.sheets.length ? info.sheets : ['—']).map((s) => (
            <span key={s} className="text-[11px] px-3 py-1.5 rounded-full bg-bg-subtle border border-border text-text-secondary font-mono">{s}</span>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-surface/50 backdrop-blur-sm border border-border p-4 flex items-start gap-3">
        {info && info.secretConfigured ? (
          <ShieldCheck size={16} className="text-accent shrink-0 mt-0.5" />
        ) : (
          <ShieldAlert size={16} className="text-red-400 shrink-0 mt-0.5" />
        )}
        <p className="text-[12px] text-text-tertiary leading-relaxed">
          {info && info.secretConfigured ? (
            <>
              <span className="text-text-secondary font-semibold">All systems ready.</span> The admin backend is connected and
              protected. Mutations to places, chronicles, routes and media update the live sheet.
            </>
          ) : (
            <>
              <span className="text-text-secondary font-semibold">Admin backend not configured.</span> Set the{' '}
              <code className="text-accent">GAS_ADMIN_URL</code> environment variable and deploy{' '}
              <code className="text-accent">gas/AdminCode.gs</code> as a web app with <code className="text-accent">ADMIN_SECRET</code>{' '}
              configured to enable the full dashboard.
            </>
          )}
        </p>
      </div>
    </>
  )
}
