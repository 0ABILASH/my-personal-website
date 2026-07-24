import { motion } from 'framer-motion'
import { Clock, RotateCcw } from 'lucide-react'

export default function TimeoutModal({ onRetry }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      <motion.div
        className="relative bg-surface border border-border rounded-2xl p-8 sm:p-10 w-full max-w-[400px] shadow-2xl text-center"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="w-14 h-14 rounded-2xl bg-amber-soft border border-amber/15 flex items-center justify-center mx-auto mb-5"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Clock size={24} className="text-amber" />
        </motion.div>

        <h2 className="text-lg font-bold tracking-tight mb-2">Session Timeout</h2>
        <p className="text-[13px] text-text-secondary leading-relaxed mb-6">
          You&apos;ve been inactive for a while. Click below to continue.
        </p>

        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-[13px] font-semibold shadow-[0_2px_16px_rgba(59,130,246,0.3)] transition-all cursor-pointer"
        >
          <RotateCcw size={14} />
          Try Again
        </button>

          <p className="text-[10px] text-text-quaternary mt-4 font-mono">
          It will navigate to website.
        </p>
      </motion.div>
    </motion.div>
  )
}
