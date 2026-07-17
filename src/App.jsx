import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Gaming from './pages/Gaming';
import Photography from './pages/Photography';
import Music from './pages/Music';
import Reading from './pages/Reading';
import Travel from './pages/Travel';
import Running from './pages/Running';

const NAV = [
  { id:'profile', label:'Profile', color:'var(--blue)' },
  { id:'hobbies', label:'Hobbies', color:'var(--orange)' },
  { id:'gallery', label:'Gallery', color:'var(--purple)' },
  { id:'blogs',   label:'Blogs',   color:'var(--yellow)' },
];

const HOBBY_ROUTES = {
  Gaming: '/hobby/gaming',
  Photography: '/hobby/photography',
  Music: '/hobby/music',
  Reading: '/hobby/reading',
  Travel: '/hobby/travel',
  Running: '/hobby/running',
};

function Home() {
  const [active, setActive] = useState('profile');
  const [blogFilter, setBlogFilter] = useState('all');
  const [openBlog, setOpenBlog] = useState(null);
  const [openCollection, setOpenCollection] = useState(null);

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
    { emoji:'🎮', title:'Gaming', desc:'Strategy and adventure games.' },
    { emoji:'📸', title:'Photography', desc:'Capturing moments and light.' },
    { emoji:'🎵', title:'Music', desc:'Playing guitar and discovering artists.' },
    { emoji:'📚', title:'Reading', desc:'Sci-fi novels and tech blogs.' },
    { emoji:'✈️', title:'Travel', desc:'Exploring new places and cultures.' },
    { emoji:'🏃', title:'Running', desc:'Early morning runs to stay focused.' },
  ];

  const collections = [
    { title:'Nature Walks', cat:'nature', photos:[
      { src:'https://picsum.photos/seed/n1/600/400' },
      { src:'https://picsum.photos/seed/n2/600/400' },
      { src:'https://picsum.photos/seed/n3/600/400' },
    ]},
    { title:'City Vibes', cat:'urban', photos:[
      { src:'https://picsum.photos/seed/u1/600/400' },
      { src:'https://picsum.photos/seed/u2/600/400' },
      { src:'https://picsum.photos/seed/u3/600/400' },
    ]},
    { title:'Travel Diaries', cat:'travel', photos:[
      { src:'https://picsum.photos/seed/t1/600/400' },
      { src:'https://picsum.photos/seed/t2/600/400' },
      { src:'https://picsum.photos/seed/t3/600/400' },
    ]},
    { title:'Daily Life', cat:'lifestyle', photos:[
      { src:'https://picsum.photos/seed/l1/600/400' },
      { src:'https://picsum.photos/seed/l2/600/400' },
      { src:'https://picsum.photos/seed/l3/600/400' },
    ]},
    { title:'Golden Hours', cat:'nature', photos:[
      { src:'https://picsum.photos/seed/g1/600/400' },
      { src:'https://picsum.photos/seed/g2/600/400' },
      { src:'https://picsum.photos/seed/g3/600/400' },
    ]},
    { title:'Street Scenes', cat:'urban', photos:[
      { src:'https://picsum.photos/seed/s1/600/400' },
      { src:'https://picsum.photos/seed/s2/600/400' },
      { src:'https://picsum.photos/seed/s3/600/400' },
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
    <div className="app">
      {/* TOP NAV */}
      <header className="topbar">
        <div className="topbar-inner">
          <span className="topbar-logo">yourname</span>
          <nav className="topbar-links">
            {NAV.map(n => (
              <button key={n.id}
                className={`topbar-link ${active===n.id?'active':''}`}
                onClick={() => scrollTo(n.id)}
              >{n.label}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">

        {/* PROFILE */}
        <section className="section" id="profile" ref={refs.profile}>
          <div className="profile-hero">
            <div className="profile-cover">
              <img src="https://picsum.photos/seed/banner/1200/400" alt="Profile banner" />
            </div>
            <div className="profile-main">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">👨‍💻</div>
                <span className="profile-status" />
              </div>
              <div className="profile-text">
                <h1>Your Name</h1>
                <p className="profile-role">ABILASH</p>
                <p className="profile-bio">Building digital experiences with clean code and creative thinking.</p>
              </div>
              <div className="profile-actions">
                <button className="profile-btn primary">Download CV</button>
                <button className="profile-btn">Contact Me</button>
              </div>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <span className="stat-num">2+</span>
              <span className="stat-label">Years Exp</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">10+</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">5+</span>
              <span className="stat-label">Technologies</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">∞</span>
              <span className="stat-label">Curiosity</span>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-about card">
              <h3>About Me</h3>
              <p>A passionate developer who loves building clean, meaningful digital experiences. I enjoy turning complex problems into simple, elegant solutions.</p>
            </div>
            <div className="profile-details card">
              <h3>Details</h3>
              <div className="detail-row"><span className="detail-label">Location</span><span>Earth 🌍</span></div>
              <div className="detail-row"><span className="detail-label">Role</span><span>Full Stack Developer</span></div>
              <div className="detail-row"><span className="detail-label">Education</span><span>Computer Science</span></div>
              <div className="detail-row"><span className="detail-label">Availability</span><span className="detail-green">Open to work</span></div>
            </div>
          </div>
        </section>

        {/* HOBBIES */}
        <section className="section" id="hobbies" ref={refs.hobbies}>
          <div className="section-head">
            <span className="section-dot" style={{background:'var(--orange)'}} />
            <span className="section-title">Hobbies</span>
            <span className="section-count">6</span>
          </div>
          <div className="cards cards-3">
            {hobbies.map((h,i) => (
              <Link key={i} to={HOBBY_ROUTES[h.title]} className="card hobby-card">
                <span className="hobby-emoji">{h.emoji}</span>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section className="section" id="gallery" ref={refs.gallery}>
          <div className="section-head">
            <span className="section-dot" style={{background:'var(--purple)'}} />
            <span className="section-title">Photo Collections</span>
            <span className="section-count">{filteredCollections.length}</span>
          </div>
          <div className="game-tabs" style={{marginBottom:'0.75rem'}}>
            {cats.map(c => (
              <button key={c} className={`game-tab ${photoFilter===c?'active':''}`} onClick={() => setPhotoFilter(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="collections-grid">
            {filteredCollections.map((col,i) => (
              <div key={i} className="collection-card" onClick={() => setOpenCollection(col)}>
                <img src={col.photos[0].src} alt={col.title} />
                <div className="collection-overlay">
                  <h4>{col.title}</h4>
                  <div className="meta">
                    <span>{col.photos.length} photos</span>
                    <span className="dot" />
                    <span>{col.cat}</span>
                  </div>
                </div>
                <span className="collection-count">{col.photos.length}</span>
                <span className="collection-badge">{col.cat}</span>
              </div>
            ))}
          </div>
        </section>

        {/* BLOGS */}
        <section className="section" id="blogs" ref={refs.blogs}>
          <div className="section-head">
            <span className="section-dot" style={{background:'var(--yellow)'}} />
            <span className="section-title">Blogs</span>
            <span className="section-count">{blogs.length}</span>
          </div>
          <div className="game-tabs" style={{marginBottom:'0.75rem'}}>
            {['all','tutorial','thoughts','update'].map(t => (
              <button key={t} className={`game-tab ${blogFilter===t?'active':''}`} onClick={() => setBlogFilter(t)}>
                {t}
              </button>
            ))}
          </div>
          <div className="cards cards-2">
            {blogs.map((b,i) => (
              <div key={i} className="card blog-card"
                onClick={() => setOpenBlog(b)}>
                <div className="blog-head">
                  <h3>{b.title}</h3>
                  <span className="blog-tag" style={{
                    background: b.tag==='tutorial'?'var(--blue-bg)':b.tag==='thoughts'?'var(--purple-bg)':'var(--green-bg)',
                    color: b.tag==='tutorial'?'var(--blue)':b.tag==='thoughts'?'var(--purple)':'var(--green)',
                  }}>{b.tag}</span>
                </div>
                <p>{b.excerpt}</p>
                <div className="blog-card-foot">
                  <span>{b.date}</span><span>·</span><span>{b.read} read</span>
                  <span className="blog-toggle">▼ open</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* BLOG READER - SLIDE PANEL */}
      {openBlog && (
        <div className="blog-panel-backdrop" onClick={() => setOpenBlog(null)}>
          <div className="blog-panel" onClick={e => e.stopPropagation()}>
            <div className="blog-panel-hero">
              <div className="blog-panel-hero-bg" />
              <button className="blog-panel-close" onClick={() => setOpenBlog(null)}>✕</button>
              <span className="blog-panel-tag" style={{
                background: openBlog.tag==='tutorial'?'#2563eb':openBlog.tag==='thoughts'?'#9333ea':'#16a34a',
              }}>{openBlog.tag}</span>
              <h1>{openBlog.title}</h1>
              <div className="blog-panel-meta">
                <span>{openBlog.date}</span>
                <span className="meta-dot" />
                <span>{openBlog.read} read</span>
              </div>
            </div>
            <div className="blog-panel-body">
              <div className="blog-panel-dropcap">T</div>
              <p>{openBlog.body || 'This is a full blog post about ' + openBlog.title.toLowerCase() + '. It covers the key insights, lessons learned, and practical tips I gathered along the way.'}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <div className="blog-panel-divider" />
              <div className="blog-panel-footer">
                <span className="blog-panel-author">Written by Your Name</span>
                <button className="blog-panel-done" onClick={() => setOpenBlog(null)}>Done reading</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COLLECTION - FULLSCREEN GALLERY */}
      {openCollection && (
        <div className="gallery-fullscreen">
          <div className="gallery-fs-topbar">
            <div className="gallery-fs-info">
              <h2>{openCollection.title}</h2>
              <span>{openCollection.photos.length} photos · {openCollection.cat}</span>
            </div>
            <button className="gallery-fs-close" onClick={() => setOpenCollection(null)}>✕</button>
          </div>
          <div className="gallery-fs-grid">
            {openCollection.photos.map((p,i) => (
              <div key={i} className="gallery-fs-item">
                <img src={p.src} alt="" />
                <span className="gallery-fs-num">{String(i+1).padStart(2,'0')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="footer-logo">yourname</span>
              <p>Building digital experiences with passion and purpose.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Menu</h4>
                <button onClick={() => scrollTo('profile')}>Profile</button>
                <button onClick={() => scrollTo('hobbies')}>Hobbies</button>
                <button onClick={() => scrollTo('gallery')}>Gallery</button>
                <button onClick={() => scrollTo('blogs')}>Blogs</button>
              </div>
              <div className="footer-col">
                <h4>Social</h4>
                <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Your Name. All rights reserved.</p>
            <p className="footer-license">Licensed under MIT License · Built with React</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
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
        <Route path="/hobby/photography" element={<Photography />} />
        <Route path="/hobby/music" element={<Music />} />
        <Route path="/hobby/reading" element={<Reading />} />
        <Route path="/hobby/travel" element={<Travel />} />
        <Route path="/hobby/running" element={<Running />} />
      </Routes>
    </>
  );
}
