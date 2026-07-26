import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import profileImg from "../services/profileImg";

const TRAITS = [
  { label: "R-Status", sub: "Single" },
  { label: "Values", sub: "Loyal & Kindness" },
  { label: "Profession", sub: "Software Engineer" },
  { label: "Passion", sub: "Traveler/Eco-Farmer" },
];

const LINKS = [
  { label: "Instagram", href: "https://instagram.com/0abilash" },
  { label: "Snapchat", href: "https://snapchat.com/t/iUJngNIp" },
  { label: "Twitter", href: "https://twitter.com/0ABILASHH" },
  { label: "E-mail", href: "mailto:mailtoabilashy@gmail.com" },
];

const INTERESTS = [
  { name: "Traveling", sub: "Exploring new places" },
  { name: "Minimalism", sub: "Keeping life simple and intentional" },
  { name: "Chess", sub: "Thinking several moves ahead" },
  { name: "Cooking", sub: "Experimenting with new flavors" },
  { name: "Mountains", sub: "Home is wherever the peaks are" },
  { name: "Love", sub: "Choosing kindness every day" },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Profile() {
  const [imgHover, setImgHover] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <motion.div variants={stagger} initial="hidden" animate="visible">
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
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover"
                  style={{ boxShadow: "0 0 40px rgba(34,197,94,0.25)" }}
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.25)]">
                  A
                </div>
              )}
              {/* Status dot — always visible */}
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-surface flex items-center justify-center"
                style={{ background: "#22c55e" }}
              >
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>
              {/* Hover tooltip */}
              {imgHover && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-surface border border-border text-[10px] font-semibold whitespace-nowrap shadow-lg z-10"
                  style={{ color: "#22c55e" }}
                >
                  Available
                </motion.div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
                Abilash
              </h1>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-3 max-w-md">
                I'm someone who believes that life is meant to be experienced,
                not just lived. I enjoy exploring unfamiliar places, taking
                spontaneous road trips, and finding beauty in the little moments
                that often go unnoticed.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-accent">
                  {/* <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> */}
                  Currently somewhere, collecting another life experience.
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
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-text-quaternary uppercase tracking-wider">
                      {t.label}
                    </div>
                    <div className="text-[11px] font-semibold text-text truncate">
                      {t.sub}
                    </div>
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
              Social Links
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
                  <span className="text-[12px] font-semibold flex-1">
                    {l.label}
                  </span>
                  <ExternalLink
                    size={10}
                    className="text-text-quaternary group-hover:text-accent transition-colors flex-shrink-0"
                  />
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
            About Me
          </h3>
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
              {["Love", "Money", "Travel", "Music", "Tea"].map(
                (tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-bg border border-border text-[10px] font-semibold text-text-tertiary font-mono"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          variants={fadeUp}
          className="bg-surface border border-border rounded-2xl p-5 sm:p-6 hover:border-border-hover transition-all duration-300"
        >
          <h3 className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono mb-4">
           Things I Enjoy
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INTERESTS.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-bg border border-border hover:border-border-hover hover:bg-surface-hover transition-all duration-200 cursor-default group"
              >
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-text">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-text-quaternary truncate">
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
