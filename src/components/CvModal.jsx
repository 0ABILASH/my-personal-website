import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Loader2, Check } from 'lucide-react'
import { trackCvDownload } from '../services/track'
import { downloadCV } from '../services/cv'

export default function CvModal({ open, onClose }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    setStatus('')

    trackCvDownload(name.trim())

    downloadCV()
    setStatus('Downloaded!')
    setTimeout(() => {
      setName('')
      setStatus('')
      setSubmitting(false)
      onClose()
    }, 800)
  }

  const handleClose = () => {
    setName('')
    setStatus('')
    setSubmitting(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} />
          <motion.div
            className="relative bg-surface border border-border rounded-2xl p-6 sm:p-7 w-full max-w-[380px] shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-bg-subtle border border-border flex items-center justify-center text-text-tertiary hover:text-text hover:border-border-hover transition-all cursor-pointer"
            >
              <X size={13} />
            </button>

            <div className="w-10 h-10 rounded-xl bg-accent-soft border border-accent/15 flex items-center justify-center mb-5">
              <FileText size={18} className="text-accent" />
            </div>

            <h2 className="text-[15px] font-bold tracking-tight mb-1">Download CV</h2>
            <p className="text-[12px] text-text-tertiary mb-5">
              Enter your name to download Abilash&apos;s resume.
            </p>

            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-text-secondary mb-1.5">
                Your Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg border border-border text-[13px] text-text placeholder:text-text-quaternary outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-[12px] font-medium text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || submitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-[12px] font-semibold shadow-[0_2px_10px_rgba(124,106,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {submitting ? (
                  <><Loader2 size={12} className="animate-spin" />Saving...</>
                ) : status === 'Downloaded!' ? (
                  <><Check size={12} />Done</>
                ) : (
                  'Download PDF'
                )}
              </button>
            </div>

            {status && (
              <motion.p
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-[11px] text-green font-medium text-center"
              >
                {status}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
