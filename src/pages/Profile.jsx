import { motion } from 'framer-motion'
import { Download, MapPin, ExternalLink } from 'lucide-react'

const TRAITS = [
  { icon: '\u{1F4AC}', label: 'Status', sub: 'Single', color: 'text-amber', bg: 'bg-amber-soft' },
  { icon: '\u{1F4BB}', label: 'Profession', sub: 'Software Engineer', color: 'text-accent', bg: 'bg-accent-soft' },
  { icon: '\u{1F3B5}', label: 'Motto', sub: 'Be Kind', color: 'text-green', bg: 'bg-green-soft' },
  { icon: '\u{1F415}', label: 'Dog Person', sub: 'no debate', color: 'text-blue', bg: 'bg-blue-soft' },
]

const STACK = [
  { name: 'React', color: 'text-cyan-400' },
  { name: 'TypeScript', color: 'text-blue-400' },
  { name: 'Node.js', color: 'text-green-400' },
  { name: 'Python', color: 'text-yellow-400' },
  { name: 'PostgreSQL', color: 'text-blue-300' },
  { name: 'Tailwind CSS', color: 'text-sky-400' },
  { name: 'Git', color: 'text-orange-400' },
  { name: 'Docker', color: 'text-blue-500' },
  { name: 'AWS', color: 'text-amber' },
  { name: 'Figma', color: 'text-pink-400' },
  { name: 'Next.js', color: 'text-text-secondary' },
  { name: 'Redis', color: 'text-red-400' },
]

const LINKS = [
  { label: 'GitHub', href: 'https://github.com', icon: 'GH', color: 'hover:border-text-tertiary/30' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'LI', color: 'hover:border-blue/30' },
  { label: 'Twitter', href: 'https://twitter.com', icon: 'X', color: 'hover:border-text-tertiary/30' },
  { label: 'Email', href: 'mailto:hello@example.com', icon: '@', color: 'hover:border-green/30' },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
}

export default function Profile({ onCvOpen }) {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Card */}
        <motion.div
          variants={fadeUp}
          className="relative overflow-hidden rounded-2xl border border-border mb-4"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-green/5" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 sm:p-8">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-accent to-green flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-[0_0_40px_rgba(124,106,255,0.25)]">
                A
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green border-2 border-surface flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">Abilash</h1>
              <p className="text-[13px] font-semibold text-accent mb-2">Full Stack Developer</p>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-3 max-w-md">
                A curious soul who loves exploring things, building random projects at 2am,
                and getting way too deep into rabbit holes.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
                  <MapPin size={11} />
                  Coimbatore, India
                </div>
                <div className="w-px h-3.5 bg-border" />
                <div className="flex items-center gap-1.5 text-[11px] text-green">
                  <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                  Available for opportunities
                </div>
              </div>
            </div>

            <button
              onClick={onCvOpen}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-[13px] font-semibold shadow-[0_2px_16px_rgba(124,106,255,0.3)] transition-all cursor-pointer"
            >
              <Download size={13} />
              Download Data
            </button>
          </div>
        </motion.div>

        {/* Status + Links Row */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {/* Status */}
          <motion.div
            variants={fadeUp}
            className="bg-surface border border-border rounded-2xl p-5 sm:p-6 hover:border-border-hover transition-all duration-300"
          >
            <h3 className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono mb-4">
              Status
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {TRAITS.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-bg border border-border hover:border-border-hover hover:bg-surface-hover transition-all duration-200 cursor-default"
                >
                  <div className={`w-8 h-8 rounded-lg ${t.bg} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-sm">{t.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-text-quaternary uppercase tracking-wider">{t.label}</div>
                    <div className={`text-[11px] font-semibold ${t.color} truncate`}>{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            variants={fadeUp}
            className="bg-surface border border-border rounded-2xl p-5 sm:p-6 hover:border-border-hover transition-all duration-300"
          >
            <h3 className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono mb-4">
              Links
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {LINKS.map((l, i) => (
                <a
                  key={i}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-bg border border-border ${l.color} hover:bg-surface-hover transition-all duration-200 group`}
                >
                  <span className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-[10px] font-bold text-text-tertiary font-mono flex-shrink-0 group-hover:border-border-hover">
                    {l.icon}
                  </span>
                  <span className="text-[12px] font-semibold flex-1">{l.label}</span>
                  <ExternalLink size={10} className="text-text-quaternary group-hover:text-accent transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stack */}
        <motion.div
          variants={fadeUp}
          className="bg-surface border border-border rounded-2xl p-5 sm:p-6 hover:border-border-hover transition-all duration-300"
        >
          <h3 className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono mb-4">
            Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {STACK.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-bg border border-border text-[11px] font-semibold font-mono hover:border-accent/30 hover:bg-accent-soft hover:text-accent transition-all duration-200 cursor-default"
              >
                {s.name}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
