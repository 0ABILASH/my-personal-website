import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenLine, ArrowRight, X, Clock } from 'lucide-react'
import profileImg from '../services/profileImg'

const POSTS = [
  {
    id: 1,
    title: 'Coming Soon',
    excerpt: 'This blog is under construction. Stay tuned.',
    tag: 'Experiance',
    date: '2025',
    read: '5 min',
    content: [
      'Coming soon. This blog is under construction.',
    ],
  },
  {
    id: 2,
    title: 'Coming Soon',
    excerpt: 'This blog is under construction. Stay tuned.',
    tag: 'Experiance',
    date: '2025',
    read: '4 min',
    content: [
      'Coming soon. This blog is under construction.',
    ],
  },
  {
    id: 3,
    title: 'Web Update',
    excerpt: 'Soon gonna a fix',
    tag: 'update',
    date: 'Mar 2025',
    read: '3 min',
    content: [
      'Im making a few improvements behind the scenes. Some pages are still under construction while I add new content and polish the overall experience. Check back soon—theres more on the way!',
    ],
  },
  {
    id: 4,
    title: 'Coming Soon',
    excerpt: 'This blog is under construction. Stay tuned.',
    tag: 'life',
    date: '2025',
    read: '6 min',
    content: [
      'Coming soon. This blog is under construction.',
    ],
  },
  {
    id: 5,
    title: 'Coming Soon',
    excerpt: 'This blog is under construction. Stay tuned.',
    tag: 'life',
    date: '2025',
    read: '4 min',
    content: [
      'Coming soon. This blog is under construction.',
    ],
  },
]

const TAG_COLORS = {
  Experiance: { text: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  life: { text: 'text-red-400', bg: 'bg-red-500/15' },
  update: { text: 'text-violet-400', bg: 'bg-violet-500/15' },
}

const FILTERS = ['all', 'Experiance', 'life', 'update']

export default function Writing() {
  const [filter, setFilter] = useState('all')
  const [openPost, setOpenPost] = useState(null)
  const blogRef = useRef(null)
  const cursorRef = useRef(null)

  useEffect(() => {
    if (!openPost) return
    const onMove = (e) => {
      const el = blogRef.current
      if (!el || !cursorRef.current) return
      const r = el.getBoundingClientRect()
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        cursorRef.current.style.opacity = '1'
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top = e.clientY + 'px'
      } else {
        cursorRef.current.style.opacity = '0'
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [openPost])

  const items = filter === 'all' ? POSTS : POSTS.filter(p => p.tag === filter)

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <PenLine size={16} className="text-accent" />
            <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">
              Blogs
            </span>
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] font-mono text-text-quaternary">
              {POSTS.length} posts
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Blogs
          </h1>
          <p className="text-[12px] text-text-tertiary">Experiance, life, and updates.</p>
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
          <>
            <div ref={cursorRef} className="blog-cursor" style={{ opacity: 0 }} />
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

                <div ref={blogRef} className="space-y-3 text-[13px] sm:text-[14px] text-text-secondary leading-relaxed blog-content">
                  {openPost.content.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <div className="h-px bg-border my-5" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {profileImg ? (
                      <img src={profileImg} alt="Abilash" className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-[10px] font-bold text-white">A</div>
                    )}
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
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
