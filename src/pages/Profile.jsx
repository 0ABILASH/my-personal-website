import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import profileImg from '../services/profileImg'

const TRAITS = [
  { icon: '\u{1F4AC}', label: 'R-Status', sub: 'Single' },
  { icon: '\u{1F4BB}', label: 'Role', sub: 'Developer' },
  { icon: '\u{1F3B5}', label: 'Profession', sub: 'Software Engineer' },
  { icon: '\u{1F415}', label: 'Passion', sub: 'Traveler' },
]

const LINKS = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'IG' },
  { label: 'Chess', href: 'https://chess.com', icon: 'CH' },
  { label: 'Twitter', href: 'https://twitter.com', icon: 'X' },
  { label: 'Email', href: 'mailto:mailtoabilashy@gmail.com', icon: '@' },
]

const INTERESTS = [
  { icon: '\u{1F30D}', name: 'Traveling', sub: 'Exploring new places' },
  { icon: '\u{1F6B4}', name: 'Biking', sub: 'Two wheels, infinite freedom' },
  { icon: '\u{1F3A7}', name: 'Music', sub: 'Lo-fi & Indie always on repeat' },
  { icon: '\u2615', name: 'Tea', sub: 'Proud teetotaler' },
  { icon: '\u{1F4F1}', name: 'Tech', sub: 'Building random projects at 2am' },
  { icon: '\u{1F319}', name: 'Night Owl', sub: 'Best ideas come after midnight' },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
}

export default function Profile() {
  const [imgHover, setImgHover] = useState(false)

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
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 sm:p-8">
            <div
              className="relative flex-shrink-0 group"
              onMouseEnter={() => setImgHover(true)}
              onMouseLeave={() => setImgHover(false)}
            >
              {profileImg ? (
                <img src={profileImg} alt="Profile" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-[0_0_40px_rgba(59,130,246,0.25)]" />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.25)]">
                  A
                </div>
              )}
              {/* Status dot — always visible */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green border-2 border-surface flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>
              {/* Hover tooltip */}
              {imgHover && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-surface border border-border text-[10px] font-semibold text-green whitespace-nowrap shadow-lg z-10"
                >
                  Available
                </motion.div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">Abilash</h1>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-3 max-w-md">
                A curious soul who loves exploring things, building random projects at 2am,
                and getting way too deep into rabbit holes.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-accent">
                  {/* <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> */}
                  Available
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Status + Links */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
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
                  <span className="text-sm flex-shrink-0">{t.icon}</span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-text-quaternary uppercase tracking-wider">{t.label}</div>
                    <div className="text-[11px] font-semibold text-text truncate">{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

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
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-bg border border-border hover:border-border-hover hover:bg-surface-hover transition-all duration-200 group"
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

        {/* About */}
        <motion.div
          variants={fadeUp}
          className="bg-surface border border-border rounded-2xl p-5 sm:p-6 mb-4 hover:border-border-hover transition-all duration-300"
        >
          <h3 className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono mb-4">
            About
          </h3>
          <div className="space-y-3">
            <p className="text-[13px] text-text-secondary leading-relaxed">
              Hey! I&apos;m Abilash &mdash; a curious soul who believes every journey has something to teach.
              I love exploring new places, building modern web applications, and diving into ideas that
              challenge the way I think. Whether it&apos;s crossing random state borders at 2 AM, listening
              to good music on a long drive, or tweaking code until 4am &mdash; I&apos;m always chasing
              experiences that inspire growth, creativity, and meaningful connections.
            </p>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              I specialize in building full-stack web applications with a focus on clean design
              and smooth user experiences. When I&apos;m not coding, you&apos;ll find me on a bike ride,
              curating playlists, or planning my next trip.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Open Source', 'UI/UX', 'Travel', 'Music', 'Biking', 'Tea'].map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-bg border border-border text-[10px] font-semibold text-text-tertiary font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          variants={fadeUp}
          className="bg-surface border border-border rounded-2xl p-5 sm:p-6 hover:border-border-hover transition-all duration-300"
        >
          <h3 className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono mb-4">
            Interests
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INTERESTS.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-bg border border-border hover:border-border-hover hover:bg-surface-hover transition-all duration-200 cursor-default group"
              >
                <span className="text-base flex-shrink-0 group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-text">{item.name}</div>
                  <div className="text-[10px] text-text-quaternary truncate">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
