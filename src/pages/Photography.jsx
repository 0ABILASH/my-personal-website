import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css';

const shots = [
  { src:'https://picsum.photos/seed/px1/600/400', caption:'Morning light' },
  { src:'https://picsum.photos/seed/px2/600/400', caption:'City reflections' },
  { src:'https://picsum.photos/seed/px3/600/400', caption:'Street portrait' },
  { src:'https://picsum.photos/seed/px4/600/400', caption:'Golden hour' },
  { src:'https://picsum.photos/seed/px5/600/400', caption:'Rainy window' },
  { src:'https://picsum.photos/seed/px6/600/400', caption:'Night neon' },
];

const stats = [
  { label:'Photos Taken', value:'500+', bar:75 },
  { label:'Collections', value:'12', bar:50 },
  { label:'Cameras Owned', value:'3', bar:30 },
];

export default function Photography() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="cy-wrap">
      <nav className="cy-nav">
        <button className="cy-nav-back" onClick={() => navigate('/')}>← Back</button>
        <span className="cy-nav-tag">Photography</span>
      </nav>

      <div className={`cy-hero ${ready?'cy-show':''}`}>
        <div className="cy-scanlines" />
        <div className="cy-hero-inner">
          <div className="cy-hero-left">
            <span className="cy-tag">HOBBY</span>
            <h1 className="cy-hero-title">Photography</h1>
            <p className="cy-hero-desc">Capturing moments, light, and everyday beauty.</p>
          </div>
          <div className="cy-hero-right">
            <div className="cy-hero-icon-box">
              <span className="cy-hero-emoji">📸</span>
              <div className="cy-hero-ring" />
            </div>
          </div>
        </div>
      </div>

      <div className={`cy-stats ${ready?'cy-show':''}`}>
        {stats.map((s,i) => (
          <div key={i} className="cy-stat">
            <div className="cy-stat-top">
              <span className="cy-stat-label">{s.label}</span>
              <span className="cy-stat-value">{s.value}</span>
            </div>
            <div className="cy-stat-bar">
              <div className="cy-stat-fill" style={{width: s.bar + '%'}} />
            </div>
          </div>
        ))}
      </div>

      <div className={`cy-panel ${ready?'cy-show':''}`} style={{maxWidth:800,margin:'1.5rem auto 0',padding:'0 1.4rem'}}>
        <div className="cy-panel-header">
          <h2>Photo Grid</h2>
          <span className="cy-panel-count">{shots.length} shots</span>
        </div>
        <div className="cy-photo-grid">
          {shots.map((s,i) => (
            <div key={i} className="cy-photo-card">
              <img src={s.src} alt="" loading="lazy" />
              <div className="cy-photo-overlay">
                <span className="cy-photo-idx">{String(i+1).padStart(2,'0')}</span>
                <span className="cy-photo-cap">{s.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cy-bottom">
        <button className="cy-back-btn" onClick={() => navigate('/')}>← Back to home</button>
      </div>
    </div>
  );
}
