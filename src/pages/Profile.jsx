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
          className="relative overflow-hidden rounded-3xl border border-border bg-surface/40 backdrop-blur-sm mb-4 group/card"
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-transparent to-[#118ab2]/[0.06] pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 p-6 sm:p-8">
            {/* Avatar */}
            <div
              className="relative flex-shrink-0"
              onMouseEnter={() => setImgHover(true)}
              onMouseLeave={() => setImgHover(false)}
            >
              <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-br from-accent/60 via-[#118ab2]/40 to-transparent blur-sm opacity-70" />
              <div className="relative p-[3px] rounded-[24px] bg-gradient-to-br from-accent/70 via-border to-[#118ab2]/60">
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-[21px] object-cover bg-bg"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[21px] bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-3xl font-black text-white">
                    A
                  </div>
                )}
              </div>
              {/* Status dot — always visible */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-[3px] border-surface bg-[#22c55e] flex items-center justify-center shadow-[0_0_12px_rgba(34,197,94,0.6)]">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
              {/* Hover tooltip */}
              {imgHover && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-surface border border-border text-[10px] font-bold whitespace-nowrap shadow-xl shadow-black/40 z-10"
                  style={{ color: "#22c55e" }}
                >
                  Available
                </motion.div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="relative overflow-hidden rounded-2xl border border-border mb-3">
                {profileImg && (
                  <img
                    src={profileImg}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-25 blur-md scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/70 to-bg/20" />
                <div className="relative px-5 py-5 sm:px-6">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                    <span className="text-[9px] font-mono font-bold text-text-quaternary uppercase tracking-[0.25em]">
                      Hello, I'm
                    </span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
                    Abilash
                  </h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent">
                      <Briefcase size={11} />
                      Software Engineer
                    </span>
                    <span className="hidden sm:block w-1 h-1 rounded-full bg-text-quaternary" />
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-text-tertiary font-mono">
                      <MapPin size={11} />
                      Coimbatore, India
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-4 max-w-md">
                I'm someone who believes that life is meant to be experienced,
                not just lived. I enjoy exploring unfamiliar places, taking
                spontaneous road trips, and finding beauty in the little moments
                that often go unnoticed.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-bg/60 border border-border text-[11px] font-medium text-text-secondary">
                  {/* <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
                  </span> */}
                  Currently somewhere, collecting another life experience.
                </div>
              </div>
            </div>

            {/* Decorative corner */}
            <div className="hidden lg:block absolute bottom-4 right-5 text-[9px] font-mono text-text-quaternary/40 group-hover/card:text-text-quaternary/70 transition-colors">
              ~ 01
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
