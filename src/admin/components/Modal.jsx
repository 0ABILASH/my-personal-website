import { X, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from './ui'

export default function Modal({ open, onClose, title, children, footer, maxWidth }) {
  if (!open) return null
  const width = maxWidth || 'max-w-lg'
  return (
    <motion.div
      className="fixed inset-0 z-[4000] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className={'relative bg-surface border border-border rounded-2xl w-full ' + width + ' max-h-[90vh] overflow-hidden shadow-2xl flex flex-col'}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 6 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-3.5 border-b border-border shrink-0">
          <h2 className="text-[14px] font-bold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-bg-subtle border border-border flex items-center justify-center text-text-tertiary hover:text-text hover:border-border-hover transition-all cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
        <div className="overflow-y-auto p-5 flex-1 min-h-0">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border shrink-0">{footer}</div>}
      </motion.div>
    </motion.div>
  )
}

export function ConfirmDialog({ open, onCancel, onConfirm, title, message, confirmLabel, loading }) {
  return (
    <Modal open={open} onClose={loading ? () => {} : onCancel} title={title || 'Are you sure?'} maxWidth="max-w-md">
      <div className="flex items-start gap-3">
        <span className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
          <AlertTriangle size={16} className="text-red-400" />
        </span>
        <p className="text-[13px] text-text-secondary leading-relaxed">
          {message || 'This action cannot be undone.'}
        </p>
      </div>
      <div className="flex items-center justify-end gap-2 mt-6">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel || 'Delete'}
        </Button>
      </div>
    </Modal>
  )
}
