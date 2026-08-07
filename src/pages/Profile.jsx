import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Briefcase, MapPin, RefreshCw } from "lucide-react";
import profileImg from "../images/imagebg.jpeg";
import avatar1 from "../images/99.png";
import avatar2 from "../images/00.png";
import IMG_7004 from "../images/IMG_7004.jpeg";
import JORAH from "../images/jorah-mormont.avif";
import SOFTWARE from "../images/Software-engineer.webp";
import TRAVELER from "../images/traveler.webp";
import INSTAGRAM_ICON from "../images/instagram-icon.webp";
import SNAPCHAT_ICON from "../images/snapchat-image.webp";
import TWITTER_ICON from "../images/sl_z_072523_61700_01.jpg";
import GMAIL_ICON from "../images/google-mail.webp";

const AVATAR_POOL = [avatar1, avatar2];

const TRAITS = [
  { label: "R-Status", sub: "Single", icon: IMG_7004 },
  { label: "Values", sub: "Loyal & Kindness", icon: JORAH },
  { label: "Profession", sub: "Software Engineer", icon: SOFTWARE },
  { label: "Passion", sub: "Traveler/Eco-Farmer", icon: TRAVELER },
];

const LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com/0abilash",
    icon: INSTAGRAM_ICON,
  },
  {
    label: "Snapchat",
    href: "https://snapchat.com/t/iUJngNIp",
    icon: SNAPCHAT_ICON,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/0ABILASHH",
    icon: TWITTER_ICON,
  },
  {
    label: "E-mail",
    href: "mailto:mailtoabilashy@gmail.com",
    icon: GMAIL_ICON,
  },
];

const INTERESTS = [
  { name: "Traveling", sub: "Exploring new places", icon: "https://picsum.photos/seed/traveling/80/80" },
  { name: "Minimalism", sub: "Keeping life simple and intentional", icon: "https://picsum.photos/seed/minimalism/80/80" },
  { name: "Chess", sub: "Thinking several moves ahead", icon: "https://picsum.photos/seed/chess/80/80" },
  { name: "Cooking", sub: "Experimenting with new flavors", icon: "https://picsum.photos/seed/cooking/80/80" },
  { name: "Mountains", sub: "Home is wherever the peaks are", icon: "https://picsum.photos/seed/mountains/80/80" },
  { name: "Love", sub: "Choosing kindness every day", icon: "https://picsum.photos/seed/love/80/80" },
];

const TAGS = ["Love", "Money", "Travel", "Music", "Tea"];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const SectionTitle = ({ label }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="w-1 h-3.5 rounded-full bg-accent/70" />
    <h3 className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.2em] font-mono">
      {label}
    </h3>
    <div className="flex-1 h-px bg-border" />
  </div>
);

const ScrollText = ({ text, className }) => {
  const ref = useRef(null);
  const [overflow, setOverflow] = useState(false);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      setOverflow(el.scrollWidth > el.clientWidth + 1);
      setDist(el.scrollWidth - el.clientWidth);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div
      ref={ref}
      className={`whitespace-nowrap overflow-hidden [&::-webkit-scrollbar]:hidden [scrollbar-width:none] ${className}`}
    >
      {overflow ? (
        <motion.span
          className="inline-block"
          animate={{ x: [0, -dist, -dist, 0] }}
          transition={{
            duration: Math.max(5, dist / 30),
            times: [0, 0.45, 0.75, 1],
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          {text}
        </motion.span>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
};

export default function Profile() {
  const [avatarIndex, setAvatarIndex] = useState(0);
  const avatarSrc = AVATAR_POOL[avatarIndex % AVATAR_POOL.length];

  return (
    <div className="relative max-w-5xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            
            <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.2em] font-mono">
              Profile
            </span>
            <div className="flex-1 h-px bg-border" />
           
          </div>
         
          <p className="text-[13px] text-text-secondary max-w-lg leading-relaxed mt-2">
            A snapshot of the person behind this digital journal — what I value,
            where I go, and what makes me me.
          </p>
        </motion.div>

        {/* Hero Card */}
        <motion.div
          variants={fadeUp}
          className="relative overflow-hidden rounded-3xl border border-border mb-4"
        >
          {/* Top sheen */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent z-20" />

          <div className="relative grid grid-cols-1 md:grid-cols-5">
            {/* Photo panel — the image stays fully visible */}
            <div className="relative md:col-span-3 h-60 sm:h-72 md:h-auto md:min-h-[460px] md:border-r md:border-border">
              {profileImg ? (
                <img
                  src={profileImg}
                  alt="Abilash"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-accent to-[#118ab2] flex items-center justify-center">
                  <span className="text-9xl font-black text-white/30">A</span>
                </div>
              )}
              {/* Photo scrim for edge legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-bg/40" />

              {/* Avatar — circular image inside a refined gradient ring */}
                <div className="absolute bottom-6 right-6 sm:right-0 sm:translate-x-1/2 z-10">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-accent via-[#118ab2] to-accent-hover p-[3px] shadow-[0_12px_40px_-10px_rgba(59,130,246,0.5)]">
                    <div className="w-full h-full rounded-full overflow-hidden ring-1 ring-white/20">
                      {avatarSrc ? (
                        <div className="relative w-full h-full">
                          <AnimatePresence initial={false}>
                            <motion.img
                              key={avatarIndex}
                              src={avatarSrc}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="absolute inset-0 w-full h-full object-cover object-top"
                            />
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-3xl font-black text-white">
                          A
                        </div>
                      )}
                    </div>
                    {/* Shuffle button — toggles the avatar image */}
                    <div className="absolute -right-2 top-18 z-30">
                      <motion.span
                        key={avatarIndex}
                        initial={{ rotate: -180, scale: 0.6 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setAvatarIndex((i) => (i + 1) % AVATAR_POOL.length)}
                        className="block w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center cursor-pointer shadow-[0_4px_14px_rgba(0,0,0,0.45)]"
                      >
                        <RefreshCw className="w-6 h-6 text-white" aria-hidden="true" />
                      </motion.span>
                    </div>
                  </div>
                </div>
            </div>

            {/* Content panel */}
            <div className="relative md:col-span-2 flex flex-col justify-center items-start px-6 sm:px-8 py-10 sm:py-12 bg-gradient-to-br from-surface via-surface to-bg">
              {/* Accent glow */}
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-accent/10 blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-[#118ab2]/10 blur-[80px] pointer-events-none" />

             

              <h1 className="relative text-4xl sm:text-5xl font-black tracking-tight mb-3 text-white">
                Abilash
              </h1>

              {/* Badges */}
              <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-white text-[10px] font-bold shadow-[0_2px_10px_rgba(59,130,246,0.4)]">
                  <Briefcase size={10} />
                  Software Engineer
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-text-secondary font-mono">
                  <MapPin size={11} />
                  India
                </span>
              </div>

              {/* Bio */}
              <p className="relative text-[12.5px] text-text-secondary leading-relaxed mb-5">
                I'm someone who believes that life is meant to be experienced,
                not just lived. I enjoy exploring unfamiliar places, taking
                spontaneous road trips, and finding beauty in the little moments
                that often go unnoticed.
              </p>

              {/* Status pill */}
              <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg/70 backdrop-blur-md border border-border text-[11px] font-medium text-text-secondary">
                
                Currently somewhere, collecting another life experience.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status + Social */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <motion.div
            variants={fadeUp}
            className="bg-surface/40 backdrop-blur-sm border border-border rounded-2xl p-5 sm:p-6 hover:border-border-hover hover:-translate-y-0.5 transition-all duration-300"
          >
            <SectionTitle label="Status" />
            <div className="grid grid-cols-2 gap-2">
              {TRAITS.map((t, i) => {
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl bg-bg border border-border hover:border-accent/25 hover:bg-accent-soft/40 transition-all duration-200 cursor-default group/tile min-w-0"
                  >
                    <span className="w-8 h-8 rounded-lg border border-accent/15 overflow-hidden flex-shrink-0 transition-transform group-hover/tile:scale-110">
                      <img
                        src={t.icon}
                        alt={t.label}
                        className="w-full h-full object-cover"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-bold text-text-quaternary uppercase tracking-wider">
                        {t.label}
                      </div>
                      <ScrollText text={t.sub} className="text-[12px] font-semibold text-text" />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-surface/40 backdrop-blur-sm border border-border rounded-2xl p-5 sm:p-6 hover:border-border-hover hover:-translate-y-0.5 transition-all duration-300"
          >
            <SectionTitle label="Social Links" />
            <div className="grid grid-cols-2 gap-2">
              {LINKS.map((l, i) => {
                return (
                  <a
                    key={i}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl bg-bg border border-border hover:border-accent/25 hover:bg-accent-soft/40 hover:-translate-y-0.5 transition-all duration-200 group/link"
                  >
                    <span className="w-8 h-8 rounded-lg border border-accent/15 overflow-hidden flex-shrink-0 transition-transform group-hover/link:scale-110">
                      <img
                        src={l.icon}
                        alt={l.label}
                        className="w-full h-full object-cover"
                      />
                    </span>
                    <span className="text-[12px] font-semibold flex-1 truncate">
                      {l.label}
                    </span>
                    <ExternalLink
                      size={10}
                      className="text-text-quaternary group-hover/link:text-accent transition-colors flex-shrink-0"
                    />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* About */}
        <motion.div
          variants={fadeUp}
          className="bg-surface/40 backdrop-blur-sm border border-border rounded-2xl p-5 sm:p-6 mb-4 hover:border-border-hover transition-all duration-300"
        >
          <SectionTitle label="About Me" />
          <div className="space-y-3">
            <p className="text-[13px] text-text-secondary leading-relaxed">
              Hey! I'm Abilash.&mdash; I've always believed that the best stories begin
              with curiosity. Whether it's taking an unfamiliar road, watching
              the sunrise from a place I've never been, or simply pausing to
              appreciate the little moments, I find inspiration in experiences
              that can't be planned. I enjoy exploring places that feel
              untouched, meeting people with different perspectives, and
              creating memories that stay long after the journey ends. To me,
              life isn't about reaching a destination—it's about embracing
              everything along the way.
            </p>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              This website is my digital journal,
              where I capture the moments, adventures, and stories that have
              shaped my perspective. Every photograph, every destination, and
              every memory is a reminder that there's always something new
              waiting to be discovered. Thanks for stopping by. I hope you enjoy
              exploring my world.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {TAGS.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-bg border border-border hover:border-accent/30 text-[10px] font-semibold text-text-tertiary font-mono transition-colors cursor-default"
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
          className="bg-surface/40 backdrop-blur-sm border border-border rounded-2xl p-5 sm:p-6 hover:border-border-hover transition-all duration-300"
        >
          <SectionTitle label="Things I Enjoy" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {INTERESTS.map((item, i) => {
              return (
                <div
                  key={i}
                  className="group flex items-center gap-3 px-3.5 py-3.5 rounded-xl bg-bg border border-border hover:border-accent/25 hover:bg-accent-soft/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default min-w-0"
                >
                  <span className="relative w-9 h-9 rounded-xl border border-accent/15 overflow-hidden flex-shrink-0 transition-transform group-hover:scale-110">
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <ScrollText text={item.name} className="text-[12px] font-semibold text-text" />
                    <ScrollText text={item.sub} className="text-[10px] text-text-quaternary" />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={fadeUp} className="mt-10 flex justify-center">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/40 border border-border text-[11px] font-medium text-text-tertiary hover:text-text-secondary hover:border-border-hover transition-all"
          >
            That's a little glimpse about me
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
