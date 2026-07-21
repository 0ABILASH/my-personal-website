import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import './App.css';
import Gaming from './pages/Gaming';
import GameDetail from './pages/GameDetail';
import Photography from './pages/Photography';
import Music from './pages/Music';
import Reading from './pages/Reading';
import Travel from './pages/Travel';
import Running from './pages/Running';

const NAV = [
  { id:'profile', label:'Profile', icon:'◉' },
  { id:'hobbies', label:'Hobbies', icon:'◈' },
  { id:'gallery', label:'Gallery', icon:'▣' },
  { id:'blogs',   label:'Blogs',   icon:'▤' },
];

const HOBBY_ROUTES = {
  Gaming: '/hobby/gaming',
  Photography: '/hobby/photography',
  Music: '/hobby/music',
  Reading: '/hobby/reading',
  Travel: '/hobby/travel',
  Running: '/hobby/running',
};

function ProfileStatus() {
  const statuses = [
    { label:'Location', val:'Coimbatore', icon:'→', color:'var(--primary)' },
    { label:'Status', val:'Single', icon:'♡', color:'var(--pink)' },
    { label:'Privacy', val:'Private', icon:'△', color:'var(--violet)' },
    { label:'Focus', val:'Career', icon:'◎', color:'var(--blue)' },
  ];
  return (
    <div className="nx-status">
      {statuses.map((s,i) => (
        <div key={i} className="nx-stat-chip" style={{'--chip-c':s.color}}>
          <span className="nx-stat-icon">{s.icon}</span>
          <div className="nx-stat-text">
            <span className="nx-stat-label">{s.label}</span>
            <span className="nx-stat-val">{s.val}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Home() {
  const [active, setActive] = useState('profile');
  const [blogFilter, setBlogFilter] = useState('all');
  const [openBlog, setOpenBlog] = useState(null);
  const [openCollection, setOpenCollection] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [showCvModal, setShowCvModal] = useState(false);
  const [cvName, setCvName] = useState('');
  const [cvSubmitting, setCvSubmitting] = useState(false);
  const [cvStatus, setCvStatus] = useState('');

  const handleCvDownload = () => {
    if (!cvName.trim()) return;
    setCvSubmitting(true);
    setCvStatus('');
    const now = new Date();
    const payload = {
      name: cvName.trim(),
      date: now.toLocaleDateString('en-IN'),
      time: now.toLocaleTimeString('en-IN'),
    };

    const endpoint = import.meta.env.VITE_SHEETS_URL;

    if (!endpoint) {
      console.error('[CV] VITE_SHEETS_URL is not set!');
      setCvStatus('Config missing: VITE_SHEETS_URL not set');
      downloadCV();
      setTimeout(() => {
        setCvName('');
        setShowCvModal(false);
        setCvSubmitting(false);
      }, 800);
      return;
    }

    console.log('[CV] endpoint:', endpoint);

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(payload),
    })
      .then(() => setCvStatus('Saved ✓'))
      .catch(() => {
        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(payload)], { type: 'text/plain;charset=UTF-8' });
          navigator.sendBeacon(endpoint, blob);
        }
        setCvStatus('Saved ✓');
      });

    downloadCV();
    setTimeout(() => {
      setCvName('');
      setShowCvModal(false);
      setCvSubmitting(false);
    }, 800);
  };

  const downloadCV = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Abilash', 20, 25);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('Full Stack Developer', 20, 33);
    doc.text('Coimbatore, India', 20, 40);
    doc.text('Email: hello@example.com', 20, 47);

    doc.setDrawColor(0, 212, 170);
    doc.setLineWidth(0.5);
    doc.line(20, 52, 190, 52);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('About Me', 20, 62);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const aboutText = 'A passionate developer who loves building clean, meaningful digital experiences. I enjoy turning complex problems into simple, elegant solutions.';
    const aboutLines = doc.splitTextToSize(aboutText, 170);
    doc.text(aboutLines, 20, 70);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Skills', 20, 90);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('React, Node.js, TypeScript, UI/UX Design, Tailwind CSS, Git', 20, 98);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Experience', 20, 115);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Full Stack Developer', 20, 123);
    doc.setFont('helvetica', 'normal');
    doc.text('2023 - Present', 150, 123);
    doc.text('Building web applications with React, Node.js, and modern tooling.', 20, 130);

    doc.setFont('helvetica', 'bold');
    doc.text('Web Developer', 20, 143);
    doc.setFont('helvetica', 'normal');
    doc.text('2022 - 2023', 150, 143);
    doc.text('Developed responsive websites and full-stack projects.', 20, 150);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Education', 20, 170);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Computer Science', 20, 178);
    doc.setFont('helvetica', 'normal');
    doc.text('Bachelor of Technology', 20, 185);

    doc.setDrawColor(0, 212, 170);
    doc.line(20, 200, 190, 200);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Generated from my-personal-website', 20, 207);

    doc.save('Abilash_CV.pdf');
  };

  const refs = {
    profile: useRef(null),
    hobbies: useRef(null),
    gallery: useRef(null),
    blogs: useRef(null),
  };

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin:'-80px 0px -60% 0px', threshold:0 });
    Object.values(refs).forEach(r => r.current && obs.observe(r.current));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    refs[id]?.current?.scrollIntoView({ behavior:'smooth' });
  };

  const hobbies = [
    { emoji:'🎮', title:'Gaming', desc:'Strategy and adventure games.', route:'Gaming' },
    { emoji:'📸', title:'Photography', desc:'Capturing moments and light.', route:'Photography' },
    { emoji:'🎵', title:'Music', desc:'Playing guitar and discovering artists.', route:'Music' },
    { emoji:'📚', title:'Reading', desc:'Sci-fi novels and tech blogs.', route:'Reading' },
    { emoji:'✈️', title:'Travel', desc:'Exploring new places and cultures.', route:'Travel' },
    { emoji:'🏃', title:'Running', desc:'Early morning runs to stay focused.', route:'Running' },
  ];

  const collections = [
    { title:'Nature Walks', cat:'nature', photos:[
      { src:'https://picsum.photos/seed/n1/600/800' },
      { src:'https://picsum.photos/seed/n2/800/600' },
      { src:'https://picsum.photos/seed/n3/600/600' },
      { src:'https://picsum.photos/seed/n4/800/800' },
      { src:'https://picsum.photos/seed/n5/600/400' },
      { src:'https://picsum.photos/seed/n6/800/600' },
    ]},
    { title:'City Vibes', cat:'urban', photos:[
      { src:'https://picsum.photos/seed/u1/800/600' },
      { src:'https://picsum.photos/seed/u2/600/800' },
      { src:'https://picsum.photos/seed/u3/600/600' },
      { src:'https://picsum.photos/seed/u4/800/600' },
      { src:'https://picsum.photos/seed/u5/600/800' },
      { src:'https://picsum.photos/seed/u6/800/800' },
    ]},
    { title:'Travel Diaries', cat:'travel', photos:[
      { src:'https://picsum.photos/seed/t1/600/800' },
      { src:'https://picsum.photos/seed/t2/800/600' },
      { src:'https://picsum.photos/seed/t3/600/600' },
      { src:'https://picsum.photos/seed/t4/800/800' },
      { src:'https://picsum.photos/seed/t5/600/400' },
      { src:'https://picsum.photos/seed/t6/800/600' },
    ]},
    { title:'Daily Life', cat:'lifestyle', photos:[
      { src:'https://picsum.photos/seed/l1/800/600' },
      { src:'https://picsum.photos/seed/l2/600/800' },
      { src:'https://picsum.photos/seed/l3/600/600' },
      { src:'https://picsum.photos/seed/l4/800/600' },
      { src:'https://picsum.photos/seed/l5/600/800' },
      { src:'https://picsum.photos/seed/l6/800/800' },
    ]},
    { title:'Golden Hours', cat:'nature', photos:[
      { src:'https://picsum.photos/seed/g1/600/800' },
      { src:'https://picsum.photos/seed/g2/800/600' },
      { src:'https://picsum.photos/seed/g3/600/600' },
      { src:'https://picsum.photos/seed/g4/800/800' },
      { src:'https://picsum.photos/seed/g5/600/400' },
      { src:'https://picsum.photos/seed/g6/800/600' },
    ]},
    { title:'Street Scenes', cat:'urban', photos:[
      { src:'https://picsum.photos/seed/s1/800/600' },
      { src:'https://picsum.photos/seed/s2/600/800' },
      { src:'https://picsum.photos/seed/s3/600/600' },
      { src:'https://picsum.photos/seed/s4/800/600' },
      { src:'https://picsum.photos/seed/s5/600/800' },
      { src:'https://picsum.photos/seed/s6/800/800' },
    ]},
  ];
  const [photoFilter, setPhotoFilter] = useState('all');
  const cats = ['all','nature','urban','travel','lifestyle'];
  const filteredCollections = photoFilter==='all'?collections:collections.filter(c=>c.cat===photoFilter);

  const posts = [
    { title:'Building My First React App', excerpt:'How I got started with React and what I learned.', tag:'tutorial', date:'Jan 2025', read:'5 min' },
    { title:'Why I Love Open Source', excerpt:'The community, the learning, and the impact.', tag:'thoughts', date:'Feb 2025', read:'4 min' },
    { title:'New Portfolio Launch', excerpt:'Behind the scenes of this website redesign.', tag:'update', date:'Mar 2025', read:'3 min' },
    { title:'TypeScript Tips I Wish I Knew', excerpt:'Helpful patterns that improved my code quality.', tag:'tutorial', date:'Apr 2025', read:'6 min' },
    { title:'What I Read This Year', excerpt:'My favorite books and articles from 2025.', tag:'thoughts', date:'May 2025', read:'4 min' },
  ];

  const blogs = blogFilter==='all'?posts:posts.filter(p=>p.tag===blogFilter);

  return (
    <div className="nx">

      {/* ─── FLOATING NAV ─── */}
      <nav className="nx-nav">
        <div className="nx-nav-inner">
          <span className="nx-nav-logo">ABILASH</span>
          <div className="nx-nav-links">
            {NAV.map(n => (
              <button key={n.id}
                className={`nx-nav-link ${active===n.id?'is-active':''}`}
                onClick={() => scrollTo(n.id)}
              ><span className="nx-nav-icon">{n.icon}</span>{n.label}</button>
            ))}
          </div>
        </div>
      </nav>

      <main className="nx-main">

        {/* ─── HERO ─── */}
        <section className="section" id="profile" ref={refs.profile}>
          <div className="nx-hero">
            <div className="nx-hero-grid">
              <div className="nx-hero-left">
                <div className="nx-hero-badge">Full Stack Developer</div>
                <h1 className="nx-hero-name">Abilash</h1>
                <p className="nx-hero-desc">Building digital experiences with clean code and creative thinking. Based in India.</p>
                <div className="nx-hero-actions">
                  <button className="nx-btn nx-btn-primary" onClick={() => setShowCvModal(true)}>
                    <span>↓</span> Download CV
                  </button>
                  <a href="mailto:hello@example.com" className="nx-btn nx-btn-ghost">Say Hello</a>
                </div>
              </div>
              <div className="nx-hero-right">
                <div className="nx-hero-avatar">
                  <span className="nx-hero-emoji">👨‍💻</span>
                  <div className="nx-hero-ring" />
                  <div className="nx-hero-dot" />
                </div>
                <div className="nx-hero-orb nx-orb-1" />
                <div className="nx-hero-orb nx-orb-2" />
              </div>
            </div>
          </div>

          <ProfileStatus />

          <div className="nx-profile-grid">
            <div className="nx-card nx-about">
              <div className="nx-about-quote">"</div>
              <p className="nx-about-text">Hey! I'm Abilash — a curious soul who loves exploring things, building random projects at 2am, and getting way too deep into rabbit holes. I enjoy the simple stuff: good music, long walks, and conversations that go nowhere and everywhere at the same time.</p>
              <div className="nx-about-loc">
                <span className="nx-pulse" />
                Based in India
              </div>
            </div>

            <div className="nx-card nx-traits">
              {[
                { icon:'☕', name:'Chai Person', sub:'over coffee, always' },
                { icon:'🌙', name:'Night Owl', sub:'2am coding sessions' },
                { icon:'🎧', name:'Music Addict', sub:'lo-fi & indie vibes' },
                { icon:'🐕', name:'Dog Person', sub:'no debate' },
              ].map((t,i) => (
                <div key={i} className="nx-trait">
                  <span className="nx-trait-icon">{t.icon}</span>
                  <div className="nx-trait-text">
                    <span className="nx-trait-name">{t.name}</span>
                    <span className="nx-trait-sub">{t.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="nx-card nx-quotes">
            <div className="nx-quotes-head">Quotes I Live By</div>
            <div className="nx-quotes-list">
              {[
                { text:'Be yourself; everyone else is already taken.', author:'Oscar Wilde' },
                { text:'The only way to do great work is to love what you do.', author:'Steve Jobs' },
                { text:'In the middle of difficulty lies opportunity.', author:'Albert Einstein' },
              ].map((q,i) => (
                <div key={i} className="nx-quote">
                  <span className="nx-quote-mark">"</span>
                  <div className="nx-quote-body">
                    <p className="nx-quote-text">{q.text}</p>
                    <span className="nx-quote-author">— {q.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOBBIES ─── */}
        <section className="section" id="hobbies" ref={refs.hobbies}>
          <div className="nx-section-head">
            <span className="nx-section-tag">◈ Hobbies</span>
          </div>
          <div className="nx-hobby-grid">
            {hobbies.map((h,i) => (
              <Link key={i} to={HOBBY_ROUTES[h.route]} className="nx-hobby-card">
                <div className="nx-hobby-top">
                  <span className="nx-hobby-emoji">{h.emoji}</span>
                  <span className="nx-hobby-arrow">↗</span>
                </div>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── GALLERY ─── */}
        <section className="section" id="gallery" ref={refs.gallery}>
          <div className="nx-section-head">
            <span className="nx-section-tag">▣ Collections</span>
          </div>
          <div className="nx-filters">
            {cats.map(c => (
              <button key={c} className={`nx-filter ${photoFilter===c?'is-active':''}`} onClick={() => setPhotoFilter(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="nx-collection-grid">
            {filteredCollections.map((col,i) => (
              <div key={i} className="nx-collection-card" onClick={() => setOpenCollection(col)}>
                <img src={col.photos[0].src} alt={col.title} />
                <div className="nx-collection-info">
                  <h4>{col.title}</h4>
                  <span>{col.photos.length} photos · {col.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── BLOGS ─── */}
        <section className="section" id="blogs" ref={refs.blogs}>
          <div className="nx-section-head">
            <span className="nx-section-tag">▤ Blogs</span>
          </div>
          <div className="nx-filters">
            {['all','tutorial','thoughts','update'].map(t => (
              <button key={t} className={`nx-filter ${blogFilter===t?'is-active':''}`} onClick={() => setBlogFilter(t)}>
                {t}
              </button>
            ))}
          </div>
          <div className="nx-blog-grid">
            {blogs.map((b,i) => (
              <div key={i} className="nx-blog-card" onClick={() => setOpenBlog(b)}>
                <div className="nx-blog-top">
                  <span className="nx-blog-tag" data-tag={b.tag}>{b.tag}</span>
                  <span className="nx-blog-read">{b.read}</span>
                </div>
                <h3>{b.title}</h3>
                <p>{b.excerpt}</p>
                <div className="nx-blog-foot">
                  <span>{b.date}</span>
                  <span className="nx-blog-go">→</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ─── BLOG READER ─── */}
      {openBlog && (
        <div className="nx-reader">
          <div className="nx-reader-bar">
            <button className="nx-reader-back" onClick={() => setOpenBlog(null)}>← Back</button>
            <div className="nx-reader-meta">
              <span className="nx-blog-tag" data-tag={openBlog.tag}>{openBlog.tag}</span>
              <span>{openBlog.read} read</span>
            </div>
            <span>{openBlog.date}</span>
          </div>

          <div className="nx-reader-scroll">
            <article className="nx-article">
              <header className="nx-article-head">
                <span className="nx-blog-tag" data-tag={openBlog.tag}>{openBlog.tag}</span>
                <h1>{openBlog.title}</h1>
                <p>{openBlog.excerpt}</p>
                <div className="nx-article-author">
                  <div className="nx-article-avatar">A</div>
                  <div>
                    <strong>Abilash</strong>
                    <span>Developer & Writer</span>
                  </div>
                </div>
              </header>

              <div className="nx-article-divider" />

              <div className="nx-article-body">
                <p>{openBlog.body || 'This is a full blog post about ' + openBlog.title.toLowerCase() + '. It covers the key insights, lessons learned, and practical tips I gathered along the way.'}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>

              <div className="nx-article-divider" />

              <footer className="nx-article-foot">
                <div className="nx-article-author-card">
                  <div className="nx-article-avatar">A</div>
                  <div>
                    <strong>Written by Abilash</strong>
                    <span>Building digital experiences with clean code and creative thinking.</span>
                  </div>
                </div>
                <button className="nx-btn nx-btn-primary" onClick={() => setOpenBlog(null)}>Done reading</button>
              </footer>
            </article>
          </div>
        </div>
      )}

      {/* ─── COLLECTION FULLSCREEN ─── */}
      {openCollection && (
        <div className="nx-gallery-full">
          <div className="nx-gallery-full-bar">
            <button className="nx-reader-back" onClick={() => { setOpenCollection(null); setLightboxIdx(null); }}>← Back</button>
            <div>
              <h2>{openCollection.title}</h2>
              <span>{openCollection.photos.length} photos · {openCollection.cat}</span>
            </div>
          </div>
          <div className="nx-gallery-full-scroll">
            <div className="nx-masonry">
              {openCollection.photos.map((p,i) => (
                <div key={i} className="nx-masonry-item" onClick={() => setLightboxIdx(i)}>
                  <img src={p.src} alt="" loading="lazy" />
                  <div className="nx-masonry-info">
                    <span className="nx-masonry-idx">{String(i+1).padStart(2,'0')}</span>
                    <span>{openCollection.title} #{i+1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="nx-gallery-full-foot">
            <button className="nx-btn nx-btn-ghost" onClick={() => { setOpenCollection(null); setLightboxIdx(null); }}>← Back to collections</button>
          </div>
        </div>
      )}

      {lightboxIdx !== null && openCollection && (
        <div className="nx-lightbox" onClick={() => setLightboxIdx(null)}>
          <button className="nx-lightbox-close" onClick={() => setLightboxIdx(null)}>✕</button>
          {lightboxIdx > 0 && (
            <button className="nx-lightbox-prev" onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }}>‹</button>
          )}
          <div className="nx-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={openCollection.photos[lightboxIdx].src} alt="" />
          </div>
          {lightboxIdx < openCollection.photos.length - 1 && (
            <button className="nx-lightbox-next" onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }}>›</button>
          )}
          <div className="nx-lightbox-footer">
            <span>{lightboxIdx + 1} / {openCollection.photos.length}</span>
            <span>{openCollection.title}</span>
          </div>
        </div>
      )}

      {/* ─── FOOTER ─── */}
      <footer className="nx-footer">
        <div className="nx-footer-inner">
          <div className="nx-footer-cta">
            <span className="nx-footer-tag">Let's Connect</span>
            <p>Got something cool in mind? Let's make it happen.</p>
            <a href="mailto:hello@example.com" className="nx-btn nx-btn-primary">Say Hello</a>
          </div>
          <div className="nx-footer-mid">
            <div className="nx-footer-links">
              {NAV.map(n => (
                <button key={n.id} onClick={() => scrollTo(n.id)}>{n.label}</button>
              ))}
            </div>
            <div className="nx-footer-socials">
              <a href="https://github.com" target="_blank" rel="noreferrer">⌨</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">💼</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">𝕏</a>
              <a href="mailto:hello@example.com">✉</a>
            </div>
          </div>
          <div className="nx-footer-bottom">
            <span>© {new Date().getFullYear()} Abilash</span>
            <button onClick={() => scrollTo('profile')}>↑ Top</button>
          </div>
        </div>
      </footer>

      {/* ─── CV MODAL ─── */}
      {showCvModal && (
        <div className="nx-modal-overlay" onClick={() => { setShowCvModal(false); setCvName(''); }}>
          <div className="nx-modal" onClick={e => e.stopPropagation()}>
            <button className="nx-modal-close" onClick={() => { setShowCvModal(false); setCvName(''); }}>✕</button>
            <div className="nx-modal-icon">📄</div>
            <h2>Download CV</h2>
            <p>Enter your name to download Abilash's CV.</p>
            <div className="nx-modal-field">
              <label>Your Name <span>*</span></label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={cvName}
                onChange={e => setCvName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCvDownload(); }}
                autoFocus
              />
            </div>
            <div className="nx-modal-actions">
              <button className="nx-btn nx-btn-ghost" onClick={() => { setShowCvModal(false); setCvName(''); }}>Cancel</button>
              <button className="nx-btn nx-btn-primary" disabled={!cvName.trim() || cvSubmitting} onClick={handleCvDownload}>
                {cvSubmitting ? 'Saving...' : 'Download PDF'}
              </button>
            </div>
            {cvStatus && <p className="nx-modal-status">{cvStatus}</p>}
          </div>
        </div>
      )}

    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const handler = () => { sessionStorage.setItem('scroll_' + pathname, window.scrollY); };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [pathname]);
  useEffect(() => {
    const pos = sessionStorage.getItem('scroll_' + pathname);
    window.scrollTo(0, pos ? Number(pos) : 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hobby/gaming" element={<Gaming />} />
        <Route path="/hobby/gaming/game/:slug" element={<GameDetail />} />
        <Route path="/hobby/photography" element={<Photography />} />
        <Route path="/hobby/music" element={<Music />} />
        <Route path="/hobby/reading" element={<Reading />} />
        <Route path="/hobby/travel" element={<Travel />} />
        <Route path="/hobby/running" element={<Running />} />
      </Routes>
    </>
  );
}
