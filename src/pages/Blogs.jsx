import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenLine, ArrowRight, X, Clock, Play, Heart, Headphones } from 'lucide-react'
import profileImg from '../services/profileImg'

const POSTS = [
  {
    id: 1,
    title: 'Beyond the Miles',
    excerpt: 'The Road Is My Therapy',
    tag: 'Experiance',
    date: 'August 2026',
    read: '5 min',
    audio: {
      title: 'SoundHelix Song 8',
      src: '/audio/beyond-the-miles.mp3',
    },
    content: [
      'I have ridden More than- 5,000 km alone, and those journeys make me feel truly alive. The feeling of being on the open road, with nothing but my thoughts and the endless horizon ahead, is one of the greatest joys of my life. It is a feeling I want to carry with me until my last day.',
'What makes these rides even more special are the people I meet along the way. Strangers have shown me kindness, cared for me, and offered me company when I was alone. Their warmth and generosity have taught me that beautiful connections can be found anywhere.',
'The places I have visited have been breathtaking, each with its own beauty and memories. Every road, every sunrise, every small moment becomes a part of my story.',
'That is why I want to keep riding, exploring new places, meeting new people, and experiencing the freedom and peace that these journeys bring, again and again.',

    ],
  },
  {
    id: 2,
    title: 'That Broken Love',
    excerpt: 'Twice I Loved, Twice I Let Go',
    tag: 'Experiance',
    date: 'August 2026',
    read: '3 min',
    audio: {
      title: '',
      src: '/audio/Kanne-kalaimaane-Flute-Instrumental.mp3',
    },
    content: [
      'Yes, I loved with all my heart, and I lost with a heart that was left empty.',
'Yes, I fell in love twice, and I lost both times.',
'The love I had for those who once meant the world to me was genuine. I gave my heart honestly, without pretending or holding back. Even today, I don\u2019t know where I failed or what I could have done differently to hold on to those relationships.',
'Maybe that was simply my fate. Not every love story is meant to last forever, no matter how real it feels.',
'Even so, I carry no resentment. I sincerely hope they find happiness, peace, and a beautiful life ahead. My love for them was never about possession—it was about wanting the best for them, even if that future didn\u2019t include me.',
'Some people remain in our hearts, not because they stayed, but because they taught us how deeply we are capable of loving.  Thanks Loving !!'
    ],
  },
  {
    id: 3,
    title: 'Web Update',
    excerpt: 'Soon gonna a fix',
    tag: 'update',
    date: 'July 2026',
    read: '0 min',
    audio: {
      title: 'SoundHelix Song 3',
      src: '/audio/web-update.mp3',
    },
    content: [
      'Im making a few improvements behind the scenes. Some pages are still under construction while I add new content and polish the overall experience. Check back soon—theres more on the way!',
    ],
  },
  {
    id: 4,
    title: 'My Kind of Peace',
    excerpt: 'This is What i need the most',
    tag: 'life',
    date: 'July 2026',
    read: '6 min',
    audio: {
      title: 'SoundHelix Song 6',
      src: '/audio/Naan-Pizhai',
    },
    content: [
      'The way I see life is completely different from how most people do. Maybe that\u2019s why I often feel like I don\u2019t fit into society.',
      'For me, happiness has always been simple. It\u2019s sitting quietly, watching the things I love, and finding peace in those moments. There is a quiet beauty in slowing down and simply being present.',
      'More than anything, I want my life to be peaceful. And if protecting my peace means stepping away from the noise of society, then I\u2019m willing to do that. If necessary, I\u2019ll disappear from the crowd and choose solitude over chaos.',
      'I love traveling alone and exploring the world at my own pace. Every journey teaches me something new, and every road brings me a sense of freedom that I can\u2019t find anywhere else. Being alone has never made me feel lonely\u2014it has made me feel alive.',
      'That is the life I want to live: a life filled with peace, freedom, meaningful experiences, and the quiet joy of discovering both the world and myself.',
    ],
  },
  {
    id: 5,
    title: 'Coming Soon',
    excerpt: 'This blog is under construction. Stay tuned.',
    tag: 'life',
    date: 'July 2026',
    read: '0 min',
    audio: {
      title: 'SoundHelix Song 16',
      src: '/audio/coming-soon.mp3',
    },
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
  const [playing, setPlaying] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [likes, setLikes] = useState({})
  const pendingLikeRef = useRef({})
  const [showTip, setShowTip] = useState(true)
  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('blogLikes') || '{}')
    } catch {
      return {}
    }
  })
  const blogRef = useRef(null)
  const cursorRef = useRef(null)
  const audioRef = useRef(null)
  const audioCtxRef = useRef(null)
  const lastActivityRef = useRef(Date.now())

  useEffect(() => {
    fetch('/api/likes')
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.likes === 'object') setLikes(d.likes)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setShowTip(false), 6000)
    return () => clearTimeout(t)
  }, [])

  const toggleLike = () => {
    if (!openPost) return
    const id = String(openPost.id)
    if (pendingLikeRef.current[id]) return
    pendingLikeRef.current[id] = true
    const already = !!likedPosts[id]
    const nextLiked = !already
    setLikes((prev) => ({ ...prev, [id]: Math.max(0, (Number(prev[id]) || 0) + (nextLiked ? 1 : -1)) }))
    setLikedPosts((prev) => {
      const next = { ...prev, [id]: nextLiked }
      localStorage.setItem('blogLikes', JSON.stringify(next))
      return next
    })
    fetch('/api/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: id, liked: nextLiked }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.count === 'number') setLikes((prev) => ({ ...prev, [id]: d.count }))
      })
      .catch(() => {
        setLikes((prev) => ({ ...prev, [id]: Math.max(0, (Number(prev[id]) || 0) - (nextLiked ? 1 : -1)) }))
        setLikedPosts((prev) => {
          const next = { ...prev, [id]: already }
          localStorage.setItem('blogLikes', JSON.stringify(next))
          return next
        })
      })
      .finally(() => {
        delete pendingLikeRef.current[id]
      })
  }

  useEffect(() => {
    const a = new Audio()
    a.preload = 'metadata'
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => setPlaying(false)
    const onError = () => setAudioError(true)
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)
    a.addEventListener('ended', onEnded)
    a.addEventListener('error', onError)
    audioRef.current = a
    return () => {
      a.pause()
      a.src = ''
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
      a.removeEventListener('ended', onEnded)
      a.removeEventListener('error', onError)
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
        audioCtxRef.current = null
      }
    }
  }, [])

  const ensureAudioGraph = (a) => {
    if (audioCtxRef.current) return
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) { a.volume = 0.1; return }
      const ctx = new Ctx()
      const source = ctx.createMediaElementSource(a)
      const gain = ctx.createGain()
      gain.gain.value = 0.1
      source.connect(gain)
      gain.connect(ctx.destination)
      audioCtxRef.current = ctx
    } catch {
      a.volume = 0.1
    }
  }

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const pause = () => a.pause()
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') pause()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', pause)
    window.addEventListener('blur', pause)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', pause)
      window.removeEventListener('blur', pause)
    }
  }, [])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const activityEvents = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel', 'scroll']
    const onActivity = () => {
      lastActivityRef.current = Date.now()
    }
    activityEvents.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }))
    const check = () => {
      if (a.paused) return
      if (document.hidden || Date.now() - lastActivityRef.current > 60 * 1000) {
        a.pause()
      }
    }
    const id = setInterval(check, 2000)
    return () => {
      activityEvents.forEach((ev) => window.removeEventListener(ev, onActivity))
      clearInterval(id)
    }
  }, [])

  const openPostWith = (post) => {
    setOpenPost(post)
    setAudioError(false)
    const a = audioRef.current
    if (!a || !post.audio) return
    ensureAudioGraph(a)
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {})
    }
    a.src = post.audio.src
    a.play().catch(() => {})
  }

  const closePost = () => {
    setOpenPost(null)
    const a = audioRef.current
    if (a) a.pause()
  }

  const togglePlay = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) {
      ensureAudioGraph(a)
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {})
      }
      a.play().catch(() => {})
    } else {
      a.pause()
    }
  }

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
                onClick={() => openPostWith(post)}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-surface border border-border hover:border-border-hover hover:bg-surface-hover transition-all duration-200 text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${tc.text} ${tc.bg} flex-shrink-0`}>
                    {post.tag}
                  </span>
                  <span className="text-[13px] font-semibold truncate">{post.title}</span>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className="flex items-center gap-1 text-[10px] font-mono text-text-quaternary">
                    <Heart
                      size={10}
                      className={likes[post.id] ? 'text-red-400 fill-current' : ''}
                    />
                    {likes[post.id] || 0}
                  </span>
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
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={closePost} />
            <motion.div
              className="relative bg-surface border border-border rounded-2xl w-full max-w-xl max-h-[85vh] supports-[height:100dvh]:max-h-[85dvh] overflow-hidden shadow-2xl flex flex-col"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 6 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between gap-2 px-5 sm:px-7 pt-4 sm:pt-5 shrink-0">
                {openPost.audio ? (
                  <button
                    onClick={togglePlay}
                    title={openPost.audio.title}
                    className="flex items-center gap-2.5 group cursor-pointer"
                  >
                    <span
                      className={`relative w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                        playing
                          ? 'bg-accent text-white border-accent'
                          : 'bg-bg-subtle border-border text-text-tertiary group-hover:text-text group-hover:border-border-hover'
                      }`}
                    >
                      {playing ? (
                        <>
                          <span className="flex items-end gap-[2px] h-3">
                            <span className="eq-bar w-[2px] h-full bg-current" style={{ animationDelay: '0ms' }} />
                            <span className="eq-bar w-[2px] h-full bg-current" style={{ animationDelay: '180ms' }} />
                            <span className="eq-bar w-[2px] h-full bg-current" style={{ animationDelay: '360ms' }} />
                          </span>
                          {audioError && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-400" />}
                        </>
                      ) : (
                        <Play size={13} className="ml-0.5" />
                      )}
                    </span>
                    <span className="hidden sm:flex flex-col items-start leading-tight">
                      <span className="text-[9px] font-mono text-text-quaternary">
                        {playing ? 'Now playing' : audioError ? 'Audio unavailable' : 'Play blog song'}
                      </span>
                      <span className="text-[11px] font-semibold text-text-secondary truncate max-w-[180px]">
                        {openPost.audio.title}
                      </span>
                    </span>
                  </button>
                ) : (
                  <span />
                )}
                <button
                  onClick={closePost}
                  className="w-8 h-8 rounded-xl bg-bg-subtle border border-border flex items-center justify-center text-text-tertiary hover:text-text hover:border-border-hover transition-all cursor-pointer shrink-0"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="overflow-y-auto p-5 sm:p-7 pt-3">
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

                <div className="flex justify-center pt-7">
                  <button
                    onClick={toggleLike}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer"
                    aria-label={likedPosts[openPost.id] ? 'Unlike this blog' : 'Like this blog'}
                  >
                    <motion.span
                      className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                        likedPosts[openPost.id]
                          ? 'bg-red-500/15 border-red-500/30 text-red-400'
                          : 'bg-bg-subtle border-border text-text-tertiary group-hover:text-red-400 group-hover:border-red-500/30'
                      }`}
                      animate={likedPosts[openPost.id] ? { scale: [0.8, 1.2, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <Heart size={18} className={likedPosts[openPost.id] ? 'fill-current' : ''} />
                    </motion.span>
                    <span className="text-[11px] font-semibold text-text-secondary">
                      {likes[openPost.id] || 0} {likes[openPost.id] === 1 ? 'like' : 'likes'}
                    </span>
                    <span className="text-[9px] font-mono text-text-quaternary">
                      {likedPosts[openPost.id] ? 'You liked this blog' : 'Like this blog'}
                    </span>
                  </button>
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
                    onClick={closePost}
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

      <AnimatePresence>
        {showTip && (
          <motion.div
            key="headphone-tip"
            initial={{ x: '110%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '110%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed top-20 left-0 right-0 z-[90] flex justify-center px-4 pointer-events-none"
            role="status"
          >
            <div className="pointer-events-auto flex items-center gap-3 max-w-[320px] w-full pl-3 pr-2 py-2.5 rounded-2xl bg-surface/95 backdrop-blur-xl border border-border shadow-2xl shadow-black/50">
              <span className="w-8 h-8 rounded-xl bg-accent-soft border border-accent/20 flex items-center justify-center shrink-0">
                <Headphones size={14} className="text-accent" />
              </span>
              <p className="text-[12px] font-medium text-text-secondary leading-snug flex-1">
                Use <span className="text-text font-semibold">headphones</span> and read the blogs for the best experience.
              </p>
              <button
                onClick={() => setShowTip(false)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-text-quaternary hover:text-text hover:bg-bg transition-all cursor-pointer shrink-0"
                aria-label="Dismiss notification"
              >
                <X size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
