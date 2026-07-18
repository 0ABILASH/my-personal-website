import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
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

function ProfileStatus() {
  const statuses = [
    { emoji:'📍', label:'Location', val:'Coimbatore', color:'var(--blue)', bg:'var(--blue-bg)' },
    { emoji:'💜', label:'Status', val:'Single', color:'var(--red)', bg:'var(--red-bg)' },
    { emoji:'🔒', label:'Privacy', val:'Private', color:'var(--purple)', bg:'var(--purple-bg)' },
    { emoji:'💼', label:'What\'s Happening', val:'Career', color:'var(--green)', bg:'var(--green-bg)' },
  ];
  return (
    <div className="profile-status">
      {statuses.map((s,i) => (
        <div key={i} className="profile-status-item">
          <span className="profile-status-emoji" style={{background:s.bg}}>{s.emoji}</span>
          <div className="profile-status-info">
            <span className="profile-status-label">{s.label}</span>
            <span className="profile-status-val">{s.val}</span>
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

  const handleCvDownload = () => {
    if (!cvName.trim()) return;
    setCvSubmitting(true);
    const now = new Date();
    const payload = {
      name: cvName.trim(),
      date: now.toLocaleDateString('en-IN'),
      time: now.toLocaleTimeString('en-IN'),
    };

    const endpoint = import.meta.env.VITE_SHEETS_URL || '/api/cv-download';
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
      mode: 'cors',
    }).catch(() => {});

    downloadCV();
    setTimeout(() => {
      setCvName('');
      setShowCvModal(false);
      setCvSubmitting(false);
    }, 500);
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

    doc.setDrawColor(37, 99, 235);
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

    doc.setDrawColor(37, 99, 235);
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
    { emoji:'🎮', title:'Gaming', desc:'Strategy and adventure games.', color:'#6366f1' },
    { emoji:'📸', title:'Photography', desc:'Capturing moments and light.', color:'#ec4899' },
    { emoji:'🎵', title:'Music', desc:'Playing guitar and discovering artists.', color:'#8b5cf6' },
    { emoji:'📚', title:'Reading', desc:'Sci-fi novels and tech blogs.', color:'#f59e0b' },
    { emoji:'✈️', title:'Travel', desc:'Exploring new places and cultures.', color:'#06b6d4' },
    { emoji:'🏃', title:'Running', desc:'Early morning runs to stay focused.', color:'#10b981' },
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
          <div className="profile-card-new">
            <div className="profile-cover">
              <img src="https://picsum.photos/seed/banner/1200/400" alt="Profile banner" />
              <div className="profile-cover-fade" />
            </div>
            <div className="profile-main-new">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">👨‍💻</div>
                <span className="profile-online-dot" />
              </div>
              <div className="profile-info">
                <h1>Your Name</h1>
                <span className="profile-role">ABILASH</span>
                <p className="profile-bio">Building digital experiences with clean code and creative thinking.</p>
              </div>
              <div className="profile-actions">
                <button className="profile-btn primary" onClick={() => setShowCvModal(true)}>Download My Data</button>
              </div>
            </div>
          </div>

          <ProfileStatus />

          <div className="profile-content">
            <div className="profile-about-card card">
              <div className="pabout-split">
                <div className="pabout-left">
                  <span className="pabout-quote">"</span>
                  <p className="pabout-text">Hey! I'm Abilash — a curious soul who loves exploring things, building random projects at 2am, and getting way too deep into rabbit holes. I enjoy the simple stuff: good music, long walks, and conversations that go nowhere and everywhere at the same time.</p>
                  <div className="pabout-location">
                    <span className="pabout-loc-dot" />Based in India
                  </div>
                </div>
                <div className="pabout-right">
                  <div className="pabout-trait">
                    <span className="pabout-trait-emoji">☕</span>
                    <div><span className="pabout-trait-title">Chai Person</span><span className="pabout-trait-sub">over coffee, always</span></div>
                  </div>
                  <div className="pabout-trait">
                    <span className="pabout-trait-emoji">🌙</span>
                    <div><span className="pabout-trait-title">Night Owl</span><span className="pabout-trait-sub">2am coding sessions</span></div>
                  </div>
                  <div className="pabout-trait">
                    <span className="pabout-trait-emoji">🎧</span>
                    <div><span className="pabout-trait-title">Music Addict</span><span className="pabout-trait-sub">lo-fi & indie vibes</span></div>
                  </div>
                  <div className="pabout-trait">
                    <span className="pabout-trait-emoji">🐕</span>
                    <div><span className="pabout-trait-title">Dog Person</span><span className="pabout-trait-sub">no debate</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-quotes card">
              <div className="pabout-header">
                <span className="pabout-badge" style={{background:'var(--purple)'}}>Quotes I Live By</span>
              </div>
              <div className="pquotes-list">
                {[
                  { text:'Be yourself; everyone else is already taken.', author:'Oscar Wilde' },
                  { text:'The only way to do great work is to love what you do.', author:'Steve Jobs' },
                  { text:'In the middle of difficulty lies opportunity.', author:'Albert Einstein' },
                ].map((q,i) => (
                  <div key={i} className="pquote">
                    <span className="pquote-mark">"</span>
                    <div className="pquote-content">
                      <p className="pquote-text">{q.text}</p>
                      <span className="pquote-author">— {q.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HOBBIES */}
        <section className="section" id="hobbies" ref={refs.hobbies}>
          <div className="section-head" style={{'--accent':'var(--orange)'}}>
            <span className="section-head-pill">Hobbies</span>
            <span className="section-head-dots">•••</span>
          </div>
          <div className="hobby-grid">
            {hobbies.map((h,i) => (
              <Link key={i} to={HOBBY_ROUTES[h.title]} className="hobby-card">
                <div className="hobby-card-icon" style={{background:h.color+'14',color:h.color}}>{h.emoji}</div>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
                <span className="hobby-card-arrow" style={{color:h.color}}>→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section className="section" id="gallery" ref={refs.gallery}>
          <div className="section-head" style={{'--accent':'var(--purple)'}}>
            <span className="section-head-pill">Photo Collections</span>
            <span className="section-head-dots">•••</span>
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
          <div className="section-head" style={{'--accent':'var(--yellow)'}}>
            <span className="section-head-pill">Blogs</span>
            <span className="section-head-dots">•••</span>
          </div>
          <div className="game-tabs" style={{marginBottom:'0.75rem'}}>
            {['all','tutorial','thoughts','update'].map(t => (
              <button key={t} className={`game-tab ${blogFilter===t?'active':''}`} onClick={() => setBlogFilter(t)}>
                {t}
              </button>
            ))}
          </div>
          <div className="blog-grid">
            {blogs.map((b,i) => {
              const tagColor = b.tag==='tutorial'?'var(--blue)':b.tag==='thoughts'?'var(--purple)':'var(--green)';
              const tagBg = b.tag==='tutorial'?'var(--blue-bg)':b.tag==='thoughts'?'var(--purple-bg)':'var(--green-bg)';
              return (
                <div key={i} className="blog-card" onClick={() => setOpenBlog(b)}>
                  <div className="blog-card-accent" style={{background:tagColor}} />
                  <div className="blog-card-inner">
                    <div className="blog-card-top">
                      <span className="blog-card-tag" style={{background:tagBg,color:tagColor}}>{b.tag}</span>
                      <span className="blog-card-read">{b.read} read</span>
                    </div>
                    <h3>{b.title}</h3>
                    <p>{b.excerpt}</p>
                    <div className="blog-card-foot">
                      <span className="blog-card-date">{b.date}</span>
                      <span className="blog-card-arrow">→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* BLOG READER - SLIDE PANEL */}
      {openBlog && (
        <div className="blog-reader">
          <div className="blog-reader-topbar">
            <button className="blog-reader-back" onClick={() => setOpenBlog(null)}>← Back</button>
            <div className="blog-reader-topbar-info">
              <span className="blog-reader-topbar-tag" style={{
                background: openBlog.tag==='tutorial'?'var(--blue-bg)':openBlog.tag==='thoughts'?'var(--purple-bg)':'var(--green-bg)',
                color: openBlog.tag==='tutorial'?'var(--blue)':openBlog.tag==='thoughts'?'var(--purple)':'var(--green)',
              }}>{openBlog.tag}</span>
              <span className="blog-reader-topbar-read">{openBlog.read} read</span>
            </div>
            <span className="blog-reader-topbar-date">{openBlog.date}</span>
          </div>

          <div className="blog-reader-scroll">
            <article className="blog-article">
              <header className="blog-article-header">
                <span className="blog-article-tag" style={{
                  background: openBlog.tag==='tutorial'?'var(--blue-bg)':openBlog.tag==='thoughts'?'var(--purple-bg)':'var(--green-bg)',
                  color: openBlog.tag==='tutorial'?'var(--blue)':openBlog.tag==='thoughts'?'var(--purple)':'var(--green)',
                }}>{openBlog.tag}</span>
                <h1>{openBlog.title}</h1>
                <p className="blog-article-excerpt">{openBlog.excerpt}</p>
                <div className="blog-article-meta">
                  <div className="blog-article-author">
                    <div className="blog-article-avatar">A</div>
                    <div>
                      <span className="blog-article-author-name">Abilash</span>
                      <span className="blog-article-author-role">Developer & Writer</span>
                    </div>
                  </div>
                  <div className="blog-article-meta-right">
                    <span>{openBlog.date}</span>
                    <span className="blog-article-meta-dot">·</span>
                    <span>{openBlog.read} read</span>
                  </div>
                </div>
              </header>

              <div className="blog-article-divider" />

              <div className="blog-article-body">
                <p>{openBlog.body || 'This is a full blog post about ' + openBlog.title.toLowerCase() + '. It covers the key insights, lessons learned, and practical tips I gathered along the way.'}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>

              <div className="blog-article-divider" />

              <footer className="blog-article-footer">
                <div className="blog-article-author-card">
                  <div className="blog-article-author-card-avatar">A</div>
                  <div>
                    <span className="blog-article-author-card-name">Written by Abilash</span>
                    <span className="blog-article-author-card-bio">Building digital experiences with clean code and creative thinking.</span>
                  </div>
                </div>
                <button className="blog-reader-done" onClick={() => setOpenBlog(null)}>Done reading</button>
              </footer>
            </article>
          </div>
        </div>
      )}

      {/* COLLECTION - FULLSCREEN GALLERY */}
      {openCollection && (
        <div className="gallery-fs">
          <div className="gallery-fs-top">
            <button className="gallery-fs-back" onClick={() => { setOpenCollection(null); setLightboxIdx(null); }}>← Back</button>
            <div className="gallery-fs-title">
              <h2>{openCollection.title}</h2>
              <span>{openCollection.photos.length} photos · {openCollection.cat}</span>
            </div>
            <span className="gallery-fs-badge">{openCollection.photos.length} shots</span>
          </div>
          <div className="gallery-fs-scroll">
            <div className="gallery-masonry">
              {openCollection.photos.map((p,i) => (
                <div key={i} className="gallery-m-item" onClick={() => setLightboxIdx(i)}>
                  <img src={p.src} alt="" loading="lazy" />
                  <div className="gallery-m-info">
                    <span className="gallery-m-idx">{String(i+1).padStart(2,'0')}</span>
                    <span className="gallery-m-cap">{openCollection.title} #{i+1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="gallery-fs-bottom">
            <button className="gallery-fs-back-btn" onClick={() => { setOpenCollection(null); setLightboxIdx(null); }}>← Back to collections</button>
          </div>
        </div>
      )}

      {lightboxIdx !== null && openCollection && (
        <div className="lightbox" onClick={() => setLightboxIdx(null)}>
          <button className="lightbox-close" onClick={() => setLightboxIdx(null)}>✕</button>
          {lightboxIdx > 0 && (
            <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }}>‹</button>
          )}
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={openCollection.photos[lightboxIdx].src} alt="" />
          </div>
          {lightboxIdx < openCollection.photos.length - 1 && (
            <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }}>›</button>
          )}
          <div className="lightbox-footer">
            <span>{lightboxIdx + 1} / {openCollection.photos.length}</span>
            <span>{openCollection.title}</span>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-cta">
            <span className="footer-cta-label">Let's Connect</span>
            <p className="footer-cta-text">Got something cool in mind? Let's make it happen.</p>
            <a href="mailto:hello@example.com" className="footer-cta-btn">Say Hello ✉</a>
          </div>
          <div className="footer-mid">
            <div className="footer-links-row">
              <button onClick={() => scrollTo('profile')}>Profile</button>
              <span className="footer-links-dot">·</span>
              <button onClick={() => scrollTo('hobbies')}>Hobbies</button>
              <span className="footer-links-dot">·</span>
              <button onClick={() => scrollTo('gallery')}>Gallery</button>
              <span className="footer-links-dot">·</span>
              <button onClick={() => scrollTo('blogs')}>Blogs</button>
            </div>
            <div className="footer-socials">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-social" title="GitHub">⌨</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-social" title="LinkedIn">💼</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social" title="Twitter">𝕏</a>
              <a href="mailto:hello@example.com" className="footer-social" title="Email">✉</a>
            </div>
          </div>
          <div className="footer-divider" />
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Abilash. Made with React & Vite</span>
            <button className="footer-top-btn" onClick={() => scrollTo('profile')} title="Back to top">↑ Top</button>
          </div>
        </div>
      </footer>

      {showCvModal && (
        <div className="modal-overlay" onClick={() => { setShowCvModal(false); setCvName(''); }}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setShowCvModal(false); setCvName(''); }}>✕</button>
            <span className="modal-emoji">📄</span>
            <h2>Download CV</h2>
            <p className="modal-desc">Enter your name to download Abilash's CV.</p>
            <div className="cv-form">
              <label className="cv-label">Your Name <span className="cv-required">*</span></label>
              <input
                className="cv-input"
                type="text"
                placeholder="Enter your full name"
                value={cvName}
                onChange={e => setCvName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCvDownload(); }}
                autoFocus
              />
            </div>
            <div className="cv-modal-actions">
              <button className="cv-modal-btn cancel" onClick={() => { setShowCvModal(false); setCvName(''); }}>Cancel</button>
              <button className="cv-modal-btn confirm" disabled={!cvName.trim() || cvSubmitting} onClick={handleCvDownload}>
                {cvSubmitting ? 'Saving...' : 'Download PDF'}
              </button>
            </div>
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
        <Route path="/hobby/photography" element={<Photography />} />
        <Route path="/hobby/music" element={<Music />} />
        <Route path="/hobby/reading" element={<Reading />} />
        <Route path="/hobby/travel" element={<Travel />} />
        <Route path="/hobby/running" element={<Running />} />
      </Routes>
    </>
  );
}
