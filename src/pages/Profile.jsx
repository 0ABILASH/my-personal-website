import { motion } from 'framer-motion'
import { User, Download } from 'lucide-react'

const TRAITS = [
  { icon: '\u2615', label: 'Chai Person', sub: 'over coffee, always' },
  { icon: '\u{1F319}', label: 'Night Owl', sub: '2am coding sessions' },
  { icon: '\u{1F3A7}', label: 'Lo-fi & Indie', sub: 'always on repeat' },
  { icon: '\u{1F415}', label: 'Dog Person', sub: 'no debate' },
]

const STACK = [
  'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL',
  'Tailwind CSS', 'Git', 'Docker', 'AWS', 'Figma', 'Next.js', 'Redis',
]

const LINKS = [
  { label: 'GitHub', href: 'https://github.com', short: 'GH' },
  { label: 'LinkedIn', href: 'https://linkedin.com', short: 'LI' },
  { label: 'Twitter', href: 'https://twitter.com', short: 'X' },
  { label: 'Email', href: 'mailto:hello@example.com', short: '@' },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}
const cardUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export default function Profile({ onCvOpen }) {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-soft flex items-center justify-center">
            <User size={18} className="text-amber" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Profile</h1>
            <p className="text-[12px] text-text-tertiary">Who I am and what I do.</p>
          </div>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 gap-3"
        >
          <motion.div
            variants={cardUp}
            className="bg-surface border border-border rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center hover:border-border-hover transition-all duration-300"
          >
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-green flex items-center justify-center text-xl font-black text-white shadow-[0_0_28px_rgba(124,106,255,0.2)]">
                A
              </div>
              <div className="absolute -inset-1 rounded-[18px] border border-accent/15 animate-glow" />
            </div>
            <h2 className="text-lg font-extrabold tracking-tight mb-0.5">Abilash</h2>
            <p className="text-[12px] font-semibold text-accent mb-2.5">Full Stack Developer</p>
            <p className="text-[13px] text-text-secondary leading-relaxed mb-3 max-w-[260px]">
              A curious soul who loves exploring things, building random projects at 2am,
              and getting way too deep into rabbit holes.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
              Coimbatore, India
            </div>
            <button
              onClick={onCvOpen}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-[13px] font-semibold shadow-[0_2px_12px_rgba(124,106,255,0.3)] transition-all cursor-pointer"
            >
              <Download size={13} />
              Download Data
            </button>
          </motion.div>

          <motion.div
            variants={cardUp}
            className="bg-surface border border-border rounded-2xl p-5 sm:p-6 hover:border-border-hover transition-all duration-300"
          >
            <h3 className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono mb-4">
              Traits
            </h3>
            <div className="flex flex-col gap-2">
              {TRAITS.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-bg border border-border hover:border-border-hover transition-all duration-200"
                >
                  <span className="text-sm w-8 h-8 flex items-center justify-center bg-surface rounded-lg border border-border flex-shrink-0">
                    {t.icon}
                  </span>
                  <div>
                    <div className="text-[12px] font-semibold leading-tight">{t.label}</div>
                    <div className="text-[10px] text-text-tertiary leading-tight mt-0.5">{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={cardUp}
            className="bg-surface border border-border rounded-2xl p-5 sm:p-6 hover:border-border-hover transition-all duration-300"
          >
            <h3 className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono mb-4">
              Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {STACK.map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-bg border border-border text-[11px] font-medium text-text-secondary font-mono hover:border-accent/40 hover:text-text hover:bg-accent-soft transition-all duration-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={cardUp}
            className="bg-surface border border-border rounded-2xl p-5 sm:p-6 hover:border-border-hover transition-all duration-300"
          >
            <h3 className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono mb-4">
              Links
            </h3>
            <div className="flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <a
                  key={i}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-bg border border-border hover:border-border-hover hover:bg-surface-hover transition-all duration-200 group"
                >
                  <span className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-[10px] font-bold text-text-tertiary font-mono flex-shrink-0">
                    {l.short}
                  </span>
                  <span className="text-[12px] font-semibold flex-1">{l.label}</span>
                  <svg
                    className="text-text-quaternary group-hover:text-accent group-hover:translate-x-0.5 transition-all flex-shrink-0"
                    width="12"
                    height="12"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M5 2l5 5-5 5" />
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
