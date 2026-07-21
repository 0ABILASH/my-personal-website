import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenLine, ArrowRight, X, Clock } from 'lucide-react'

const POSTS = [
  { id: 1, title: 'Building My First React App', excerpt: 'How I got started with React and what I learned along the way.', tag: 'tutorial', date: 'Jan 2025', read: '5 min' },
  { id: 2, title: 'Why I Love Open Source', excerpt: 'The community, the learning, and the impact of contributing.', tag: 'thoughts', date: 'Feb 2025', read: '4 min' },
  { id: 3, title: 'New Portfolio Launch', excerpt: 'Behind the scenes of this website rebuild.', tag: 'update', date: 'Mar 2025', read: '3 min' },
  { id: 4, title: 'TypeScript Tips I Wish I Knew', excerpt: 'Helpful patterns that improved my code quality.', tag: 'tutorial', date: 'Apr 2025', read: '6 min' },
  { id: 5, title: 'What I Read This Year', excerpt: 'My favorite books and articles from 2025.', tag: 'thoughts', date: 'May 2025', read: '4 min' },
  { id: 6, title: 'Deploying with Docker', excerpt: 'A practical guide to containerizing your apps.', tag: 'tutorial', date: 'Jun 2025', read: '7 min' },
]

const TAG_COLORS = {
  tutorial: { text: 'text-blue', bg: 'bg-blue-soft' },
  thoughts: { text: 'text-accent', bg: 'bg-accent-soft' },
  update: { text: 'text-green', bg: 'bg-green-soft' },
}

const FILTERS = ['all', 'tutorial', 'thoughts', 'update']

export default function Writing() {
  const [filter, setFilter] = useState('all')
  const [openPost, setOpenPost] = useState(null)

  const items = filter === 'all' ? POSTS : POSTS.filter(p => p.tag === filter)

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
            <PenLine size={18} className="text-accent" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Writing</h1>
            <p className="text-[12px] text-text-tertiary">Thoughts, tutorials, and updates.</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all duration-200 cursor-pointer whitespace-nowrap ${
                filter === f
                  ? 'bg-accent-soft text-accent border border-accent/20'
                  : 'bg-surface border border-border text-text-tertiary hover:text-text-secondary hover:border-border-hover'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {items.map((post, i) => {
            const tc = TAG_COLORS[post.tag] || TAG_COLORS.thoughts
            return (
              <motion.button
                key={post.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.025, duration: 0.2 }}
                onClick={() => setOpenPost(post)}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-surface border border-border hover:border-border-hover hover:bg-surface-hover transition-all duration-200 text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${tc.text} ${tc.bg} flex-shrink-0`}>
                    {post.tag}
                  </span>
                  <span className="text-[13px] font-semibold truncate">{post.title}</span>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className="text-[10px] text-text-quaternary font-mono hidden sm:inline">{post.read}</span>
                  <span className="text-[10px] text-text-quaternary font-mono">{post.date}</span>
                  <ArrowRight size={12} className="text-text-quaternary group-hover:text-accent transition-all" />
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {openPost && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setOpenPost(null)} />
            <motion.div
              className="relative bg-surface border border-border rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 6 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="p-6 sm:p-8">
                <button
                  onClick={() => setOpenPost(null)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-bg-subtle border border-border flex items-center justify-center text-text-tertiary hover:text-text hover:border-border-hover transition-all cursor-pointer"
                >
                  <X size={13} />
                </button>

                <div className="flex items-center gap-2.5 mb-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${TAG_COLORS[openPost.tag]?.text} ${TAG_COLORS[openPost.tag]?.bg}`}>
                    {openPost.tag}
                  </span>
                  <span className="text-[11px] text-text-tertiary font-mono flex items-center gap-1">
                    <Clock size={10} />
                    {openPost.read} read
                  </span>
                  <span className="text-[11px] text-text-tertiary font-mono">{openPost.date}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">{openPost.title}</h1>
                <p className="text-[13px] text-text-secondary leading-relaxed mb-5">{openPost.excerpt}</p>

                <div className="h-px bg-border mb-5" />

                <div className="space-y-3 text-[13px] sm:text-[14px] text-text-secondary leading-relaxed">
                  <p>This is a full article about {openPost.title.toLowerCase()}. It covers the key insights, lessons learned, and practical tips gathered along the way.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>

                <div className="h-px bg-border my-5" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-green flex items-center justify-center text-[10px] font-bold text-white">A</div>
                    <div>
                      <strong className="text-[12px] block leading-tight">Abilash</strong>
                      <span className="text-[10px] text-text-tertiary leading-tight">Developer & Writer</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpenPost(null)}
                    className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-[12px] font-semibold transition-all cursor-pointer"
                  >
                    Done reading
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
