import { RefreshCw } from 'lucide-react'

// ─── Buttons ───────────────────────────────────────────────────────────────

export function Button({ variant, loading, children, className, ...rest }) {
  const base =
    'inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap'
  const styles = {
    primary: 'bg-accent hover:bg-accent-hover text-white shadow-[0_2px_16px_rgba(59,130,246,0.3)]',
    secondary: 'bg-surface border border-border hover:border-border-hover text-text-secondary hover:text-text',
    outline: 'bg-transparent border border-border hover:border-border-hover text-text-secondary hover:text-text',
    danger: 'bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25',
    ghost: 'text-text-tertiary hover:text-text hover:bg-surface',
  }
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={base + ' ' + (styles[variant] || styles.primary) + ' ' + (className || '')}
    >
      {loading && <RefreshCw size={12} className="animate-spin" />}
      {children}
    </button>
  )
}

// ─── Form fields ───────────────────────────────────────────────────────────

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl bg-bg border border-border text-[13px] text-text placeholder:text-text-quaternary outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all'

export function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-[11px] font-semibold text-text-secondary mb-1.5">
          {label} {required && <span className="text-accent">*</span>}
        </span>
      )}
      {children}
      {hint && <span className="block text-[10px] text-text-quaternary mt-1">{hint}</span>}
    </label>
  )
}

export function TextInput(props) {
  return <input {...props} className={inputCls + ' ' + (props.className || '')} />
}

export function Select({ options, className, children, ...rest }) {
  return (
    <select {...rest} className={inputCls + ' ' + (className || '')}>
      {children
        ? children
        : options.map((o) => {
            if (o && typeof o === 'object') {
              return <option key={o.value} value={o.value}>{o.label}</option>
            }
            return <option key={o} value={o}>{o}</option>
          })}
    </select>
  )
}

export function TextArea(props) {
  return <textarea {...props} className={inputCls + ' resize-y ' + (props.className || '')} />
}

// ─── Status / chips ────────────────────────────────────────────────────────

export function Chip({ children, tone }) {
  const tones = {
    blue: 'bg-accent-soft text-accent border-accent/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/10 text-red-400 border-red-500/30',
    gray: 'bg-surface text-text-tertiary border-border',
    teal: 'bg-[#249D8F]/10 text-[#249D8F] border-[#249D8F]/30',
  }
  return (
    <span className={'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ' + (tones[tone] || tones.gray)}>
      {children}
    </span>
  )
}

// ─── Stat card ─────────────────────────────────────────────────────────────

export function StatCard({ label, value, icon, tone }) {
  const tones = {
    blue: 'text-accent bg-accent-soft border-accent/20',
    green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    teal: 'text-[#249D8F] bg-[#249D8F]/10 border-[#249D8F]/30',
    yellow: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    red: 'text-red-400 bg-red-500/10 border-red-500/30',
    gray: 'text-text-secondary bg-surface border-border',
  }
  const t = tones[tone] || tones.blue
  return (
    <div className="rounded-2xl bg-surface/60 backdrop-blur-sm border border-border p-4 flex items-start gap-3.5 hover:border-border-hover transition-all">
      <span className={'w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ' + t}>
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-2xl font-black tracking-tight leading-none">{value}</div>
        <div className="text-[11px] text-text-tertiary mt-1.5 truncate">{label}</div>
      </div>
    </div>
  )
}

// ─── Loading / error / empty states ────────────────────────────────────────

export function LoadingState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <RefreshCw size={22} className="text-accent animate-spin" />
      <p className="text-[12px] text-text-tertiary font-medium">{label || 'Loading...'}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
      <p className="text-[12.5px] text-red-400 font-medium">{message || 'Something went wrong.'}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCw size={12} />
          Try Again
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ icon, title, hint, message, children }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-2.5 text-center px-4">
      {icon && (
        <span className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center text-text-tertiary">
          {icon}
        </span>
      )}
      <p className="text-[13px] font-semibold text-text-secondary">{title || message || 'Nothing here yet.'}</p>
      {hint && <p className="text-[11.5px] text-text-quaternary">{hint}</p>}
      {children}
    </div>
  )
}

// ─── Search input ──────────────────────────────────────────────────────────

export function SearchInput({ value, onChange, placeholder, className }) {
  return (
    <div className={'relative min-w-[180px] ' + (className || 'flex-1')}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-quaternary pointer-events-none">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search...'}
        className="w-full pl-8.5 pr-3 py-2 rounded-xl bg-surface border border-border text-[12.5px] text-text placeholder:text-text-quaternary outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all"
        style={{ paddingLeft: '2rem' }}
      />
    </div>
  )
}

// ─── Page header ───────────────────────────────────────────────────────────

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">{title}</h1>
        {subtitle && <p className="text-[12px] text-text-tertiary mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
