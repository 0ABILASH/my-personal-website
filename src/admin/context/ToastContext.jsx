import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const toast = useCallback((message, kind) => {
    const id = Math.random().toString(36).slice(2)
    const k = kind || 'success'
    setToasts((t) => [...t, { id, message: String(message), kind: k }])
    setTimeout(() => dismiss(id), 3400)
  }, [dismiss])

  const success = useCallback((m) => toast(m, 'success'), [toast])
  const error = useCallback((m) => toast(m, 'error'), [toast])
  const info = useCallback((m) => toast(m, 'info'), [toast])

  const icons = {
    success: <CheckCircle2 size={14} className="text-emerald-400" />,
    error: <AlertCircle size={14} className="text-red-400" />,
    info: <Info size={14} className="text-accent" />,
  }

  const borders = {
    success: 'border-emerald-500/30',
    error: 'border-red-500/30',
    info: 'border-accent/30',
  }

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[6000] flex flex-col gap-2 items-end max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => (
          <button
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={
              'flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface border text-[12px] font-medium text-text-secondary shadow-2xl shadow-black/50 animate-fade-in cursor-pointer ' +
              borders[t.kind]
            }
          >
            {icons[t.kind]}
            <span>{t.message}</span>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
