import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Lock, ArrowLeft, ShieldAlert, User, KeyRound } from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'
import { Button, Field, TextInput } from '../components/ui'

export default function AdminLogin() {
  const { status, login } = useAdminAuth()
  const [accessId, setAccessId] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const lockControls = useAnimation()

  // Modern warning flash — the card border + a soft red wash pulse 5 times
  // when the restricted login page opens.
  useEffect(() => {
    const timers = []
    for (let i = 0; i < 5; i++) {
      timers.push(setTimeout(() => setFlashOn(true), i * 700))
      timers.push(setTimeout(() => setFlashOn(false), i * 700 + 350))
    }
    timers.push(setTimeout(() => setFlashOn(false), 3500))
    return () => timers.forEach(clearTimeout)
  }, [])

  if (status === 'authenticated') return <Navigate to="/admin/dashboard" replace />

  const vibrateLock = () => {
    lockControls.start({
      x: [0, -7, 7, -6, 6, -3, 3, 0],
      transition: { duration: 0.5, ease: 'easeOut' },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!accessId.trim() || !accessCode) {
      setError('Enter your Access ID and Access Code.')
      vibrateLock()
      return
    }
    setBusy(true)
    setError('')
    try {
      await login(accessId.trim(), accessCode)
    } catch (err) {
      setError(err.message || 'Login failed.')
      setBusy(false)
      vibrateLock()
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center p-4 relative overflow-hidden">
      {/* Soft red wash on entry */}
      <AnimatePresence>
        {flashOn && (
          <motion.div
            className="fixed inset-0 z-[5000] bg-red-600/[0.06] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          />
        )}
      </AnimatePresence>

      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-red-500/[0.03] rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-[400px] relative">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[11px] text-text-tertiary hover:text-text transition-colors mb-6">
          <ArrowLeft size={12} />
          Back to website
        </Link>

        <motion.div
          className="rounded-3xl bg-surface/70 backdrop-blur-xl border shadow-2xl shadow-black/40 overflow-hidden"
          animate={
            flashOn
              ? { borderColor: 'rgba(248,113,113,0.55)', boxShadow: '0 0 44px rgba(239,68,68,0.28)' }
              : { borderColor: 'rgba(30,41,59,0.8)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.45)' }
          }
          transition={{ duration: 0.12 }}
        >
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-accent via-accent/50 to-red-500/60" />

          <div className="p-7 sm:p-8">
            {/* Emblem + heading */}
            <div className="flex items-center gap-3.5 mb-6">
              <motion.span
                animate={lockControls}
                className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-white shadow-[0_0_24px_rgba(59,130,246,0.4)]"
              >
                <Lock size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-surface" />
              </motion.span>
              <div>
                <div className="text-[9px] font-mono text-accent tracking-[0.22em] uppercase mb-1">Abilash · Private Area</div>
                <h1 className="text-lg font-black tracking-tight">Restricted Access</h1>
              </div>
            </div>

            {/* Warning */}
            <p className="mb-6 flex items-start gap-2 text-[12px] font-semibold text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5">
              <ShieldAlert size={14} className="shrink-0 mt-0.5" />
              Owner verification required. Unauthorized access is prohibited and may be logged.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Access ID" required>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-quaternary">
                    <User size={13} />
                  </span>
                  <TextInput
                    value={accessId}
                    onChange={(e) => setAccessId(e.target.value)}
                    placeholder="Enter access ID"
                    autoComplete="username"
                    style={{ paddingLeft: '2.35rem' }}
                  />
                </div>
              </Field>
              <Field label="Access Code" required>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-quaternary">
                    <KeyRound size={13} />
                  </span>
                  <TextInput
                    type="password"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter access code"
                    autoComplete="current-password"
                    style={{ paddingLeft: '2.35rem' }}
                  />
                </div>
              </Field>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button type="submit" loading={busy} className="w-full !py-2.5">
                <Lock size={13} />
                {busy ? 'Verifying...' : 'Unlock Dashboard'}
              </Button>
            </form>

            <p className="text-center text-[10px] text-text-quaternary mt-5 font-mono">
              This area is guarded — sessions expire after 1 minute of inactivity.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
