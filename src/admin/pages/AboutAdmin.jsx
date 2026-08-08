import {
  Layers, ShieldCheck, Database, Terminal, Globe2, Map, BookOpen, Users, Download,
  LayoutDashboard, Activity, UserCog, MapPin, PenLine, Link2, Cpu, Timer, Eye,
  FileJson, KeyRound, Cookie, LogOut, Wrench, MousePointerClick,
} from 'lucide-react'
import { PageHeader, Chip } from '../components/ui'

const STACK = [
  { name: 'React 18', role: 'UI framework', icon: <Cpu size={14} /> },
  { name: 'Vite 5', role: 'Bundler / dev server', icon: <Wrench size={14} /> },
  { name: 'Tailwind CSS 4', role: 'Styling', icon: <PenLine size={14} /> },
  { name: 'react-router-dom 6', role: 'Routing', icon: <Link2 size={14} /> },
  { name: 'framer-motion', role: 'Animations', icon: <Timer size={14} /> },
  { name: 'lucide-react', role: 'Icons', icon: <Eye size={14} /> },
  { name: 'Leaflet', role: 'Travel map', icon: <Map size={14} /> },
  { name: 'Express 4 (ESM)', role: 'Node API server', icon: <Terminal size={14} /> },
  { name: 'Google Apps Script', role: 'Data backend', icon: <Database size={14} /> },
  { name: 'Google Sheets', role: 'Storage', icon: <FileJson size={14} /> },
]

const CAPABILITIES = [
  { label: 'Dashboard', desc: 'Overview of travel, blogs, likes and visitor analytics.', icon: <LayoutDashboard size={14} /> },
  { label: 'Site Status', desc: 'Live health of every backend connection and environment variable.', icon: <Activity size={14} /> },
  { label: 'Profile', desc: 'Edit the public profile, links, tags, traits and interests.', icon: <UserCog size={14} /> },
  { label: 'Travel Logs', desc: 'Add, edit, delete and drag-to-reorder places on the map.', icon: <MapPin size={14} /> },
  { label: 'Blogs', desc: 'Write and publish chronicles with a rich-text editor and audio.', icon: <BookOpen size={14} /> },
  { label: 'Visitors', desc: 'Real tracking-sheet rows: who visited, from where, on what device.', icon: <Users size={14} /> },
  { label: 'Downloads', desc: 'Every data/CV download captured by the site.', icon: <Download size={14} /> },
]

const SECURITY = [
  { label: 'Env-only credentials', desc: 'Access ID + Access Code are set via ADMIN_USERNAME and the SHA-256 ADMIN_PASSWORD_HASH. They never ship in the frontend bundle.', icon: <KeyRound size={14} /> },
  { label: 'HttpOnly session cookie', desc: 'Login issues an HttpOnly admin_session cookie — JS can never read it.', icon: <Cookie size={14} /> },
  { label: 'Timing-safe check', desc: 'Password hashes are compared with a constant-time comparison on the server.', icon: <Timer size={14} /> },
  { label: '1-minute inactivity lock', desc: 'The admin session is destroyed after 60s without interaction.', icon: <LogOut size={14} /> },
  { label: 'X-Admin CSRF guard', desc: 'Every admin API call carries an X-Admin header; requests without it are rejected.', icon: <ShieldCheck size={14} /> },
  { label: 'Shared admin secret', desc: 'The server and the admin Apps Script share GAS_ADMIN_SECRET so admin actions are signed.', icon: <KeyRound size={14} /> },
]

const TRACKING = [
  { label: 'When', value: 'date · time (DD/MM/YYYY, HH:MM:SS)' },
  { label: 'Where', value: 'url · action · referrer' },
  { label: 'Device', value: 'device · brand · os · screen' },
  { label: 'Client', value: 'browser · language' },
  { label: 'Geo (optional)', value: 'ip · city · region · country' },
]

const PAGES = [
  { name: 'Home', route: '/' },
  { name: 'Travel Log', route: '/travel-log' },
  { name: 'Blogs', route: '/blogs' },
  { name: 'Profile', route: '/profile' },
]

function SectionCard({ icon, title, children }) {
  return (
    <div className="rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
      <div className="flex items-center gap-2 px-4 h-11 border-b border-border">
        <span className="text-text-tertiary">{icon}</span>
        <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export default function AboutAdmin() {
  return (
    <>
      <PageHeader
        title="About"
        subtitle="What powers this site and this dashboard."
      />

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Stack */}
        <SectionCard icon={<Layers size={13} />} title="Tech Stack">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {STACK.map((t) => (
              <div key={t.name} className="flex items-center gap-2.5 rounded-xl bg-bg-subtle/60 border border-border px-3 py-2.5">
                <span className="w-6 h-6 rounded-lg bg-surface border border-border flex items-center justify-center text-accent shrink-0">{t.icon}</span>
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold truncate">{t.name}</div>
                  <div className="text-[10px] text-text-quaternary truncate">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Architecture */}
        <SectionCard icon={<Globe2 size={13} />} title="Architecture">
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <Chip tone="blue">Frontend</Chip>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                A React single-page app. <code className="text-accent">npm run build</code> produces <code className="text-accent">dist/</code>, served by the Express server on port 3000.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Chip tone="teal">API</Chip>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                <code className="text-accent">server.js</code> exposes the public JSON endpoints, the admin API, an in-memory TTL cache and the SPA fallback route.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Chip tone="green">Data</Chip>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                Two Google Apps Script web apps — one public (travel, likes, tracking) and one admin (<code className="text-accent">gas/AdminCode.gs</code> for CRUD + analytics) — read and write Google Sheets.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Chip tone="yellow">Caching</Chip>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                GAS responses are cached in memory so repeat requests are served instantly instead of hitting the slow Apps Script endpoint. Clear them from Site Status.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Capabilities */}
        <SectionCard icon={<LayoutDashboard size={13} />} title="Admin Capabilities">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CAPABILITIES.map((c) => (
              <div key={c.label} className="rounded-xl bg-bg-subtle/60 border border-border px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-secondary">
                  <span className="text-accent">{c.icon}</span>
                  {c.label}
                </div>
                <p className="text-[10.5px] text-text-quaternary mt-1 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Security */}
        <SectionCard icon={<ShieldCheck size={13} />} title="Security Model">
          <div className="space-y-2.5">
            {SECURITY.map((s) => (
              <div key={s.label} className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">{s.icon}</span>
                <div>
                  <div className="text-[12px] font-semibold text-text-secondary">{s.label}</div>
                  <p className="text-[11px] text-text-quaternary mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Tracking */}
        <SectionCard icon={<MousePointerClick size={13} />} title="Visitor Tracking Fields">
          <div className="space-y-2">
            {TRACKING.map((t) => (
              <div key={t.label} className="flex items-center justify-between gap-3 py-1.5 border-b border-border last:border-b-0">
                <span className="text-[11px] font-semibold text-text-tertiary">{t.label}</span>
                <span className="text-[11px] font-mono text-text-secondary text-right">{t.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Run locally */}
        <SectionCard icon={<Terminal size={13} />} title="Run Locally">
          <div className="space-y-2">
            {['npm install', 'npm run build', 'npm start'].map((cmd, i) => (
              <div key={cmd} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-md bg-accent-soft border border-accent/20 text-accent text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <code className="text-[12px] font-mono bg-bg rounded-lg border border-border px-3 py-1.5 flex-1">{cmd}</code>
              </div>
            ))}
            <p className="text-[11px] text-text-quaternary pt-1">
              The site runs at <code className="text-accent">http://localhost:3000</code>. Use <code className="text-accent">npm run dev</code> for the Vite dev server.
            </p>
          </div>
        </SectionCard>
      </div>

      {/* Public pages */}
      <div className="mt-4 rounded-2xl bg-surface/50 backdrop-blur-sm border border-border overflow-hidden">
        <div className="flex items-center gap-2 px-4 h-11 border-b border-border">
          <Globe2 size={13} className="text-text-tertiary" />
          <span className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.18em] font-mono">Public Pages</span>
        </div>
        <div className="flex flex-wrap gap-2 p-4">
          {PAGES.map((p) => (
            <a
              key={p.route}
              href={p.route}
              className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-bg-subtle border border-border text-text-secondary hover:text-text hover:border-accent/40 transition-all font-mono"
            >
              {p.name} <span className="text-text-quaternary">/</span> {p.route}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
