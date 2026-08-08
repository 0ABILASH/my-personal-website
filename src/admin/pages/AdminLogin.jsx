import { useState, useEffect } from 'react'
import { Navigate, Link, useSearchParams } from 'react-router-dom'
import { KeyRound, ShieldCheck, ArrowLeft, Clock } from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'
import { Button, Field, TextInput } from '../components/ui'

export default function AdminLogin() {
  const { status, login } = useAdminAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (searchParams.get('expired') === '1') {
      setNotice('Your admin session expired due to inactivity. Please log in again.')
      searchParams.delete('expired')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  if (status === 'authenticated') return <Navigate to="/admin/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Enter your Username and Access code.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await login(username.trim(), password)
    } catch (err) {
      setError(err.message || 'Login failed.')
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="w-full max-w-[380px] relative">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[11px] text-text-tertiary hover:text-text transition-colors mb-6">
          <ArrowLeft size={12} />
          Back to website
        </Link>

        <div className="rounded-2xl bg-surface/70 backdrop-blur-xl border border-border shadow-2xl shadow-black/40 p-7">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h1 className="text-lg font-black tracking-tight">Admin Login (Abilash)</h1>
              <p className="text-[11px] text-text-tertiary font-mono">Restricted area</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Username" required>
                <TextInput
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Credential"
                  autoComplete="username"
                />
              </Field>
            <Field label="Access code" required>
              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
              />
            </Field>

            {notice && (
              <p className="text-[12px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2.5 flex items-start gap-2">
                <Clock size={12} className="shrink-0 mt-0.5" />
                {notice}
              </p>
            )}

            {error && (
              <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5">
                {error}
              </p>
            )}

            <Button type="submit" loading={busy} className="w-full !py-2.5">
              <KeyRound size={13} />
              {busy ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>

        <p className="text-center text-[10px] text-text-quaternary mt-5 font-mono">
          Only the site owner can access this dashboard.
        </p>
      </div>
    </div>
  )
}
