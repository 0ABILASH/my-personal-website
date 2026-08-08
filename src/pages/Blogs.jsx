import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenLine,
  ArrowRight,
  X,
  Clock,
  Play,
  Heart,
  Headphones,
} from "lucide-react";
import profileImg from "../images/pimage.jpeg";
import ilayarajaBgm from "../audio/ilayaraja-bgm.mp3";
import kanneKalaimaane from "../audio/Kanne-Kalaimaane-Flute-Instrumental.mp3";
import webUpdateBgm from "../audio/web-update.mp3";
import fluteSoulful from "../audio/flute - soulful.mp3";
import motherBgm from "../audio/mother-bgm.mp3";
import comingSoonBgm from "../audio/coming-soon.mp3";
import sanitizeHtml from "../utils/sanitize";

// Local bundled audio files used as a fallback for the seeded starter blogs
// (sheet ids 1-6). Any blog with an audioSrc set in the sheet uses that URL
// instead; audioTitle is always editable from the sheet.
const LOCAL_AUDIO = {
  "1": { title: "Song Aid", src: ilayarajaBgm },
  "2": { title: "En Kanne Kalaimaane", src: kanneKalaimaane },
  "3": { title: "SoundHelix", src: webUpdateBgm },
  "4": { title: "Most Needed", src: fluteSoulful },
  "5": { title: "Mom's Magic", src: motherBgm },
  "6": { title: "Coming Soon", src: comingSoonBgm },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 640px)").matches
      : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

const TAG_COLORS = {
  Experiance: { text: "text-emerald-400", bg: "bg-emerald-500/15" },
  Voyage: { text: "text-[#118ab2]", bg: "bg-[#118ab2]/15" },
  update: { text: "text-violet-400", bg: "bg-violet-500/15" },
};

const EXTRA_TAG_COLORS = [
  { text: "text-sky-400", bg: "bg-sky-500/15" },
  { text: "text-rose-400", bg: "bg-rose-500/15" },
  { text: "text-amber-400", bg: "bg-amber-500/15" },
  { text: "text-lime-400", bg: "bg-lime-500/15" },
  { text: "text-cyan-400", bg: "bg-cyan-500/15" },
  { text: "text-fuchsia-400", bg: "bg-fuchsia-500/15" },
];

function tagColor(tag) {
  const k = String(tag || "").trim();
  if (TAG_COLORS[k]) return TAG_COLORS[k];
  let h = 0;
  for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0;
  return EXTRA_TAG_COLORS[h % EXTRA_TAG_COLORS.length];
}

function formatMonth(d) {
  const m = String(d || "").slice(0, 10);
  const dt = new Date(m);
  if (isNaN(dt.getTime())) return String(d || "").slice(0, 7);
  return dt.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function readTime(html) {
  const words = String(html || "")
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  if (words <= 40) return "1 min";
  return Math.ceil(words / 180) + " min";
}

function toPost(c) {
  const legacyId = String(c.id || "").trim();
  // Seeded starter blogs use plain numeric ids (1-6) so their existing like
  // counts keep working; new blogs use uuid ids and get a "sheet-" prefix.
  const id = /^\d+$/.test(legacyId) ? legacyId : "sheet-" + legacyId;
  const local = LOCAL_AUDIO[legacyId] || null;
  const audioSrc = c.audioSrc || (local && local.src) || "";
  return {
    id,
    title: c.title,
    excerpt: c.excerpt || "",
    tag: c.category || "update",
    date: formatMonth(c.date),
    read: readTime(c.content),
    audio: audioSrc
      ? { title: c.audioTitle || (local && local.title) || c.title, src: audioSrc }
      : null,
    content: c.content || "",
  };
}

export default function Writing() {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState("all");
  const [openPost, setOpenPost] = useState(null);
  const [sheetPosts, setSheetPosts] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [likes, setLikes] = useState({});
  const pendingLikeRef = useRef({});
  const [showTip, setShowTip] = useState(false);
  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("blogLikes") || "{}");
    } catch {
      return {};
    }
  });
  const blogRef = useRef(null);
  const cursorRef = useRef(null);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const openPostRef = useRef(null);

  useEffect(() => {
    fetch("/api/likes")
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.likes === "object") setLikes(d.likes);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/chronicles")
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d && d.chronicles)
          ? d.chronicles.filter(
              (c) =>
                c &&
                c.title &&
                String(c.status).toLowerCase() === "published",
            )
          : [];
        if (list.length) setSheetPosts(list.map(toPost));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const showT = setTimeout(() => setShowTip(true), 1200);
    const hideT = setTimeout(() => setShowTip(false), 7200);
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
  }, []);

  const toggleLike = () => {
    if (!openPost) return;
    const id = String(openPost.id);
    if (pendingLikeRef.current[id]) return;
    pendingLikeRef.current[id] = true;
    const already = !!likedPosts[id];
    const nextLiked = !already;
    setLikes((prev) => ({
      ...prev,
      [id]: Math.max(0, (Number(prev[id]) || 0) + (nextLiked ? 1 : -1)),
    }));
    setLikedPosts((prev) => {
      const next = { ...prev, [id]: nextLiked };
      localStorage.setItem("blogLikes", JSON.stringify(next));
      return next;
    });
    fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id, liked: nextLiked }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.count === "number")
          setLikes((prev) => ({ ...prev, [id]: d.count }));
      })
      .catch(() => {
        setLikes((prev) => ({
          ...prev,
          [id]: Math.max(0, (Number(prev[id]) || 0) - (nextLiked ? 1 : -1)),
        }));
        setLikedPosts((prev) => {
          const next = { ...prev, [id]: already };
          localStorage.setItem("blogLikes", JSON.stringify(next));
          return next;
        });
      })
      .finally(() => {
        delete pendingLikeRef.current[id];
      });
  };

  useEffect(() => {
    const a = new Audio();
    a.preload = "metadata";
    const onPlay = () => {
      setPlaying(true);
      if (openPostRef.current) {
        window.dispatchEvent(new CustomEvent("blog-playing"));
      }
    };
    const onPause = () => {
      setPlaying(false);
      window.dispatchEvent(new CustomEvent("blog-stopped"));
    };
    const onEnded = () => {
      setPlaying(false);
      window.dispatchEvent(new CustomEvent("blog-stopped"));
    };
    const onError = () => setAudioError(true);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onError);
    audioRef.current = a;
    return () => {
      a.pause();
      a.src = "";
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onError);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, []);

  const ensureAudioGraph = (a) => {
    if (audioCtxRef.current) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) {
        a.volume = 0.03;
        return;
      }
      const ctx = new Ctx();
      const source = ctx.createMediaElementSource(a);
      const gain = ctx.createGain();
      gain.gain.value = 0.03;
      source.connect(gain);
      gain.connect(ctx.destination);
      audioCtxRef.current = ctx;
    } catch {
      a.volume = 0.03;
    }
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const pause = () => a.pause();
    const onVisibility = () => {
      if (document.visibilityState === "hidden") pause();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", pause);
    window.addEventListener("blur", pause);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", pause);
      window.removeEventListener("blur", pause);
    };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const activityEvents = [
      "pointerdown",
      "keydown",
      "touchstart",
      "wheel",
      "scroll",
    ];
    const onActivity = () => {
      const now = Date.now();
      if (now - lastActivityRef.current > 5000) lastActivityRef.current = now;
    };
    activityEvents.forEach((ev) =>
      window.addEventListener(ev, onActivity, { passive: true }),
    );
    const check = () => {
      if (a.paused) return;
      if (document.hidden || Date.now() - lastActivityRef.current > 60 * 1000) {
        a.pause();
      }
    };
    const id = setInterval(check, 2000);
    return () => {
      activityEvents.forEach((ev) =>
        window.removeEventListener(ev, onActivity),
      );
      clearInterval(id);
    };
  }, []);

  const openPostWith = (post) => {
    setOpenPost(post);
    openPostRef.current = post;
    setAudioError(false);
    const a = audioRef.current;
    if (!a || !post.audio) return;
    ensureAudioGraph(a);
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    a.src = post.audio.src;
    a.play().catch(() => {});
  };

  const closePost = () => {
    setOpenPost(null);
    openPostRef.current = null;
    const a = audioRef.current;
    if (a) a.pause();
    window.dispatchEvent(new CustomEvent("blog-done"));
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      ensureAudioGraph(a);
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().catch(() => {});
      }
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  };

  useEffect(() => {
    if (!openPost) return;
    const onMove = (e) => {
      const el = blogRef.current;
      if (!el || !cursorRef.current) return;
      const r = el.getBoundingClientRect();
      if (
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom
      ) {
        cursorRef.current.style.opacity = "1";
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      } else {
        cursorRef.current.style.opacity = "0";
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [openPost]);

  const allPosts = useMemo(() => sheetPosts, [sheetPosts]);
  const filters = useMemo(
    () => [
      "all",
      ...Array.from(new Set(allPosts.map((p) => p.tag))),
    ],
    [allPosts],
  );

  const items =
    filter === "all" ? allPosts : allPosts.filter((p) => p.tag === filter);

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            {/* <PenLine size={16} className="text-accent" /> */}
            <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">
              Blogs
            </span>
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] font-mono text-text-quaternary">
              {allPosts.length} posts
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Blogs
          </h1>
          <p className="text-[12px] text-text-tertiary">
This is more than writing. This is who I am.          </p>
        </div>

        <div className="flex gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all duration-200 cursor-pointer whitespace-nowrap ${
                filter === f
                  ? "bg-accent-soft text-accent border border-accent/20"
                  : "bg-surface border border-border text-text-tertiary hover:text-text-secondary hover:border-border-hover"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <span className="inline-flex w-11 h-11 rounded-xl bg-surface border border-border items-center justify-center text-text-tertiary mb-3">
              <PenLine size={18} />
            </span>
            <p className="text-[13px] font-semibold text-text-secondary">No blogs yet</p>
            <p className="text-[11.5px] text-text-quaternary mt-1">
              Check back soon — new stories are on the way.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((post, i) => {
              const tc = tagColor(post.tag);
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
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${tc.text} ${tc.bg} flex-shrink-0`}
                    >
                      {post.tag}
                    </span>
                    <span className="text-[13px] font-semibold truncate">
                      {post.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="flex items-center gap-1 text-[10px] font-mono text-text-quaternary">
                      <Heart
                        size={10}
                        className={
                          likes[post.id] ? "text-red-400 fill-current" : ""
                        }
                      />
                      {likes[post.id] || 0}
                    </span>
                    <span className="text-[10px] text-text-quaternary font-mono hidden sm:inline">
                      {post.read}
                    </span>
                    <span className="text-[10px] text-text-quaternary font-mono">
                      {post.date}
                    </span>
                    <ArrowRight
                      size={12}
                      className="text-text-quaternary group-hover:text-accent transition-all"
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {openPost && (
          <>
            <div
              ref={cursorRef}
              className="blog-cursor"
              style={{ opacity: 0 }}
            />
            <motion.div
              className="fixed inset-0 z-[80] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                onClick={closePost}
              />
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
                            ? "bg-accent text-white border-accent"
                            : "bg-bg-subtle border-border text-text-tertiary group-hover:text-text group-hover:border-border-hover"
                        }`}
                      >
                        {playing ? (
                          <>
                            <span className="flex items-end gap-[2px] h-3">
                              <span
                                className="eq-bar w-[2px] h-full bg-current"
                                style={{ animationDelay: "0ms" }}
                              />
                              <span
                                className="eq-bar w-[2px] h-full bg-current"
                                style={{ animationDelay: "180ms" }}
                              />
                              <span
                                className="eq-bar w-[2px] h-full bg-current"
                                style={{ animationDelay: "360ms" }}
                              />
                            </span>
                            {audioError && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-400" />
                            )}
                          </>
                        ) : (
                          <Play size={13} className="ml-0.5" />
                        )}
                      </span>
                      <span className="flex flex-col items-start leading-tight min-w-0">
                        <span className="text-[9px] font-mono text-text-quaternary whitespace-nowrap">
                          {playing
                            ? "Now playing"
                            : audioError
                              ? "Audio unavailable"
                              : "Play blog song"}
                        </span>
                        <span className="text-[11px] font-semibold text-text-secondary truncate max-w-[110px] sm:max-w-[180px]">
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
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${tagColor(openPost.tag).text} ${tagColor(openPost.tag).bg}`}
                    >
                      {openPost.tag}
                    </span>
                    <span className="text-[11px] text-text-tertiary font-mono flex items-center gap-1">
                      <Clock size={10} />
                      {openPost.read} read
                    </span>
                    <span className="text-[11px] text-text-tertiary font-mono">
                      {openPost.date}
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
                    {openPost.title}
                  </h1>
                  <p className="text-[13px] text-text-secondary leading-relaxed mb-5">
                    {openPost.excerpt}
                  </p>

                  <div className="h-px bg-border mb-5" />

                  <div
                    ref={blogRef}
                    className="space-y-3 text-[13px] sm:text-[14px] text-text-secondary leading-relaxed blog-content"
                  >
                    {Array.isArray(openPost.content) ? (
                      openPost.content.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))
                    ) : (
                      <div
                        className="space-y-3"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(openPost.content),
                        }}
                      />
                    )}
                  </div>

                  <div className="flex justify-center pt-7">
                    <button
                      onClick={toggleLike}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer"
                      aria-label={
                        likedPosts[openPost.id]
                          ? "Unlike this blog"
                          : "Like this blog"
                      }
                    >
                      <motion.span
                        className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                          likedPosts[openPost.id]
                            ? "bg-red-500/15 border-red-500/30 text-red-400"
                            : "bg-bg-subtle border-border text-text-tertiary group-hover:text-red-400 group-hover:border-red-500/30"
                        }`}
                        animate={
                          likedPosts[openPost.id]
                            ? { scale: [0.8, 1.2, 1] }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <Heart
                          size={18}
                          className={
                            likedPosts[openPost.id] ? "fill-current" : ""
                          }
                        />
                      </motion.span>
                      <span className="text-[11px] font-semibold text-text-secondary">
                        {likes[openPost.id] || 0}{" "}
                        {likes[openPost.id] === 1 ? "like" : "likes"}
                      </span>
                      <span className="text-[9px] font-mono text-text-quaternary">
                        {likedPosts[openPost.id]
                          ? "You liked this blog"
                          : "Like this blog"}
                      </span>
                    </button>
                  </div>

                  <div className="h-px bg-border my-5" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {profileImg ? (
                        <img
                          src={profileImg}
                          alt="Abilash"
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-[10px] font-bold text-white">
                          A
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] text-text-tertiary leading-tight">
                          Written By
                        </span>
                        <strong className="text-[12px] block leading-tight">
                          Abilash
                        </strong>
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
            initial={
              isMobile
                ? { opacity: 0, y: 80 }
                : { opacity: 0, scale: 0.96, y: 16, filter: "blur(6px)" }
            }
            animate={
              isMobile
                ? { opacity: 1, y: 0 }
                : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
            }
            exit={
              isMobile
                ? { opacity: 0, y: 80 }
                : { opacity: 0, scale: 0.96, y: 16, filter: "blur(6px)" }
            }
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={
              isMobile
                ? "fixed bottom-4 left-4 right-4 z-[90] flex items-center gap-3 pl-3 pr-2 py-3 rounded-2xl bg-surface/95 backdrop-blur-md border border-border shadow-2xl shadow-black/50"
                : "fixed top-1/2 -translate-y-1/2 right-4 z-[90] flex items-center gap-3 w-[320px] max-w-[calc(100vw-2rem)] pl-3 pr-2 py-2.5 rounded-2xl bg-surface/95 backdrop-blur-md border border-border shadow-2xl shadow-black/50"
            }
            role="status"
          >
            <span className="w-8 h-8 rounded-xl bg-accent-soft border border-accent/20 flex items-center justify-center shrink-0">
              <Headphones size={14} className="text-accent" />
            </span>
            <p className="text-[12px] font-medium text-text-secondary leading-snug flex-1">
              Use <span className="text-text font-semibold">headphones</span>{" "}
              and read the blogs for the best experience.
            </p>
            <button
              onClick={() => setShowTip(false)}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-text-quaternary hover:text-text hover:bg-bg transition-all cursor-pointer shrink-0"
              aria-label="Dismiss notification"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
