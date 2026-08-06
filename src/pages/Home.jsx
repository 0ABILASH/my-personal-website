import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, PenLine, User, X } from "lucide-react";
import teaImg from "../images/tea.webp";
import batmanImg from "../images/batman.jpg";
import musicImg from "../images/music.jpg";
import petImg from "../images/pet.webp";
import godImg from "../images/god.webp";
import bikeImg from "../images/bike.jpg";
import profileImg from "../images/profile.jpeg";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const PANELS = [
  {
    to: "/profile",
    icon: User,
    label: "Profile",
    desc: "Who I am and what I do.",
    num: "01",
  },
  {
    to: "/travel-log",
    icon: MapPin,
    label: "Travel Log",
    desc: "Places I've been — interactive travel map.",
    num: "02",
  },
  {
    to: "/blogs",
    icon: PenLine,
    label: "Blogs",
    desc: "Where Experiences Become Stories.",
    num: "03",
  },
];

const TRAITS = [
  { img: teaImg, name: "Tea Person", sub: "Proud Teetotaler" },
  { img: batmanImg, name: "Im Batman", sub: "Night Person" },
  { img: musicImg, name: "Music Addict", sub: "Yes I'm" },
  { img: petImg, name: "Pet Partner", sub: "Very Soon" },
  { img: godImg, name: "God", sub: "God First" },
  { img: bikeImg, name: "Motorcyclist", sub: "Road Therapy" },
];

export default function Home({ onCvOpen }) {
  const [greeting, setGreeting] = useState(false);

  return (
    <div>
      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-5 sm:px-6 pt-8 pb-16 sm:pt-12 sm:pb-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] bg-accent/[0.03] rounded-full blur-[100px]" />
          <div className="absolute top-32 left-1/4 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-accent/[0.02] rounded-full blur-[80px]" />
        </div>

        <motion.div
          className="relative flex items-center justify-between gap-8"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <div className="flex-1 min-w-0">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-[11px] font-mono font-medium text-text-tertiary mb-5">
                Software Engineer
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-[-0.03em] leading-[0.92] mb-5"
            >
              ABILASH
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-text-secondary max-w-lg leading-relaxed mb-7"
            >
              A Developer, Traveler, and Curious-explorer.{" "}
              <a href="https://abilash-profile.onrender.com">
                This is My <u>personal space,</u>
              </a> here you'll find my travel stories, personal blogs and a little glimpse into my world.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5">
              <button
                onClick={onCvOpen}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-[13px] font-semibold shadow-[0_2px_16px_rgba(59,130,246,0.3)] transition-all cursor-pointer"
              >
                Download My Data
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => setGreeting(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border hover:border-border-hover text-[13px] font-medium text-text-secondary hover:text-text transition-all cursor-pointer"
              >
                Say Hello
              </button>
            </motion.div>
          </div>

        </motion.div>

         <motion.div
            variants={fadeUp}
            className="flex items-center gap-3 mt-10"
          >
           <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
              Coimbatore, India
            </div>
            <div className="w-px h-3.5 bg-border" />
            <div className="flex items-center gap-1.5">
              {[
                { label: "IG", href: "https://instagram.com/0abilash" },
                { label: "C", href: "https://https://https://www.chess.com/member/abilashcx" },
                { label: "X", href: "https://twitter.com/0ABILASHH" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[9px] font-mono font-bold text-text-quaternary hover:text-text-secondary transition-colors w-6 h-6 rounded-md bg-surface border border-border flex items-center justify-center hover:border-border-hover"
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
      </section>

      {/* About + Traits */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid sm:grid-cols-2 gap-3"
        >
          <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 hover:border-border-hover transition-all duration-300">
            <div className="text-3xl text-accent/20 font-serif leading-none mb-3 select-none">
              &ldquo;
            </div>
            <p className="text-[14px] text-text-secondary leading-relaxed mb-4">
              A curious soul who believes every journey has
              something to teach. I love exploring new places and diving into ideas that challenge the way I
              think. Whether it's crossing random state borders at 2 AM,
              listening to good music on a long drive, I'm always
              chasing experiences that inspire growth, creativity, and
              meaningful connections.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 hover:border-border-hover transition-all duration-300">
            <h3 className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono mb-4">
              Traits
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {TRAITS.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-bg border border-border hover:border-border-hover transition-all duration-200"
                >
                  <img src={t.img} alt={t.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold leading-tight">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-text-tertiary leading-tight mt-0.5">
                      {t.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Explore */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 pb-20 sm:pb-28">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35 }}
          className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono mb-5"
        >
          Explore
        </motion.h2>

        <div className="grid sm:grid-cols-3 gap-3">
          {PANELS.map((panel, i) => {
            const Icon = panel.icon;
            return (
              <motion.div
                key={panel.to}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  to={panel.to}
                  className="group relative block overflow-hidden rounded-2xl border border-border hover:border-border-hover bg-surface transition-all duration-500"
                >
                  {/* Top gradient line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="p-5 sm:p-6">
                    {/* Number + Icon row */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-mono font-bold text-text-quaternary/50">
                        {panel.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-bg border border-border group-hover:border-accent/30 group-hover:bg-accent/5 flex items-center justify-center transition-all duration-500">
                        <Icon size={16} className="text-text-tertiary group-hover:text-accent transition-colors duration-500" />
                      </div>
                    </div>

                    {/* Label + Arrow */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-[15px] font-bold tracking-tight">
                        {panel.label}
                      </h3>
                      <ArrowRight
                        size={13}
                        className="text-text-quaternary -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      />
                    </div>

                    <p className="text-[12px] text-text-tertiary leading-relaxed">
                      {panel.desc}
                    </p>
                  </div>

                  {/* Bottom hover line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Copyright */}
      <footer className="max-w-5xl mx-auto px-5 sm:px-6 pb-10">
        <div className="h-px bg-border mb-8" />
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-text-quaternary">
          <p>Licenced Under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" className="hover:text-text transition-colors">CC NC-ND-4.0</a></p>
          <p className="font-mono">Developed by <span className="hover:text-text transition-colors cursor-default">Abilash</span></p>
        </div>
      </footer>

      {/* Greeting Overlay */}
      <AnimatePresence>
        {greeting && (
          <motion.div
            className="fixed inset-0 z-[2500] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setGreeting(false)}
            />

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-accent/30"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200],
                }}
                transition={{
                  duration: 2,
                  delay: 0.3 + i * 0.15,
                  ease: "easeOut",
                }}
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${30 + Math.random() * 40}%`,
                }}
              />
            ))}

            <motion.div
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Wave hand */}
              <motion.div
                className="text-6xl sm:text-8xl mb-4"
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
              >
                {"\u{1F44B}"}
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Hey! What's up?
              </motion.h1>

              <motion.p
                className="text-sm sm:text-base text-text-secondary mt-3 text-center max-w-xs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                Thanks for stopping by! Glad you&apos;re here.
              </motion.p>

              <motion.button
                onClick={() => setGreeting(false)}
                className="mt-6 px-5 py-2 rounded-xl bg-surface border border-border hover:border-border-hover text-[13px] font-medium text-text-secondary hover:text-text transition-all cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <X size={14} className="inline mr-1.5 -mt-0.5" />
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
