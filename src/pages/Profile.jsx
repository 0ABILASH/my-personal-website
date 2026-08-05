import { useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Heart,
  Gem,
  Briefcase,
  Bike,
  Camera,
  AtSign,
  Send,
  Mail,
  MapPin,
  Sparkles,
  Brain,
  ChefHat,
  Mountain,
  ArrowDown,
} from "lucide-react";
import profileImg from "../services/profileImg";

const TRAITS = [
  { label: "R-Status", sub: "Single", icon: Heart },
  { label: "Values", sub: "Loyal & Kindness", icon: Gem },
  { label: "Profession", sub: "Software Engineer", icon: Briefcase },
  { label: "Passion", sub: "Traveler/Eco-Farmer", icon: Bike },
];

const LINKS = [
  { label: "Instagram", href: "https://instagram.com/0abilash", icon: Camera },
  { label: "Snapchat", href: "https://snapchat.com/t/iUJngNIp", icon: Send },
  { label: "Twitter", href: "https://twitter.com/0ABILASHH", icon: AtSign },
  { label: "E-mail", href: "mailto:mailtoabilashy@gmail.com", icon: Mail },
];

const INTERESTS = [
  { name: "Traveling", sub: "Exploring new places", icon: MapPin },
  { name: "Minimalism", sub: "Keeping life simple and intentional", icon: Sparkles },
  { name: "Chess", sub: "Thinking several moves ahead", icon: Brain },
  { name: "Cooking", sub: "Experimenting with new flavors", icon: ChefHat },
  { name: "Mountains", sub: "Home is wherever the peaks are", icon: Mountain },
  { name: "Love", sub: "Choosing kindness every day", icon: Heart },
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

export default function Profile() {
  const [imgHover, setImgHover] = useState(false);

  return (
    <div className="relative max-w-5xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-[420px] h-[420px] bg-accent/[0.06] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[360px] h-[360px] bg-[#118ab2]/[0.05] rounded-full blur-[110px]" />
      </div>

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
          {/* Visible image background — sharp, full bleed */}
          {profileImg && (
            <img
              src={profileImg}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          )}
          {/* Light scrim so the glass card pops */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/55 to-bg/75" />
          {/* Top sheen */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
          {/* Accent glow */}
          <div className="absolute -top-16 right-8 w-56 h-56 rounded-full bg-accent/15 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-16 left-8 w-56 h-56 rounded-full bg-[#118ab2]/15 blur-[80px] pointer-events-none" />

          {/* Floating glass identity card */}
          <div className="relative flex items-center justify-center min-h-[480px] sm:min-h-[520px] px-5 sm:px-8 py-16">
            <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-bg/65 backdrop-blur-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] px-6 sm:px-10 pt-16 sm:pt-20 pb-8 sm:pb-10 text-center">
              {/* Top accent line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

              {/* Avatar — overlaps the glass card top edge */}
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-12 sm:-top-14"
                onMouseEnter={() => setImgHover(true)}
                onMouseLeave={() => setImgHover(false)}
              >
                <div className="absolute -inset-1.5 rounded-[30px] bg-accent/30 blur-lg opacity-70" />
                <div className="relative p-[3px] rounded-[26px] bg-gradient-to-br from-accent via-[#118ab2] to-transparent shadow-[0_24px_60px_-16px_rgba(0,0,0,0.8)]">
                  {profileImg ? (
                    <img
                      src={profileImg}
                      alt="Profile"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-[23px] object-cover object-top bg-bg"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[23px] bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-4xl font-black text-white">
                      A
                    </div>
                  )}
                </div>
                {/* Status dot — always visible */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-[3px] border-bg bg-[#22c55e] flex items-center justify-center shadow-[0_0_14px_rgba(34,197,94,0.7)]">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
                {/* Hover tooltip */}
                {imgHover && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 -bottom-10 px-3 py-1.5 rounded-xl bg-bg/95 backdrop-blur-md border border-border text-[10px] font-bold whitespace-nowrap shadow-xl shadow-black/40 z-20"
                    style={{ color: "#22c55e" }}
                  >
                    Available
                  </motion.div>
                )}
              </div>

              {/* Name */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="h-px w-6 bg-gradient-to-r from-transparent to-accent/70" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                <span className="text-[9px] font-mono font-bold text-text-quaternary uppercase tracking-[0.3em]">
                  Hello, I'm
                </span>
                <span className="h-px w-6 bg-gradient-to-l from-transparent to-accent/70" />
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 text-white">
                Abilash
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mb-4">
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
              <p className="text-[12.5px] text-text-secondary leading-relaxed max-w-md mb-5 mx-auto">
                I'm someone who believes that life is meant to be experienced,
                not just lived. I enjoy exploring unfamiliar places, taking
                spontaneous road trips, and finding beauty in the little moments
                that often go unnoticed.
              </p>

              {/* Status pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg/70 backdrop-blur-md border border-border text-[11px] font-medium text-text-secondary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
                </span>
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
                const Icon = t.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl bg-bg border border-border hover:border-accent/25 hover:bg-accent-soft/40 transition-all duration-200 cursor-default group/tile"
                  >
                    <span className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center text-accent shrink-0 transition-transform group-hover/tile:scale-110">
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[9px] font-bold text-text-quaternary uppercase tracking-wider">
                        {t.label}
                      </div>
                      <div className="text-[12px] font-semibold text-text truncate">
                        {t.sub}
                      </div>
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
                const Icon = l.icon;
                return (
                  <a
                    key={i}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl bg-bg border border-border hover:border-accent/25 hover:bg-accent-soft/40 hover:-translate-y-0.5 transition-all duration-200 group/link"
                  >
                    <span className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center text-accent shrink-0 transition-transform group-hover/link:scale-110">
                      <Icon size={14} />
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
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group flex items-center gap-3 px-3.5 py-3.5 rounded-xl bg-bg border border-border hover:border-accent/25 hover:bg-accent-soft/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                >
                  <span className="relative w-9 h-9 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center text-accent shrink-0 transition-transform group-hover:scale-110">
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-text truncate">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-text-quaternary truncate">
                      {item.sub}
                    </div>
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
