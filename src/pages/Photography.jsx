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

export default function Photography() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div className="hp-wrap">
      <nav className="hp-nav"><button onClick={() => navigate('/')}>← Back</button><span>Photography</span></nav>
      <div className={`hp-hero hp-hero-photo ${ready?'hp-show':''}`}>
        <div className="hp-hero-content">
          <span className="hp-badge hp-badge-photo">Hobby</span>
          <h1>Photography</h1>
          <p>Capturing moments, light, and everyday beauty.</p>
        </div>
        <div className="hp-hero-icon">📸</div>
      </div>
      <div className="hp-body">
        <div className={`hp-stats hp-stagger ${ready?'hp-show':''}`}>
          <div className="hp-stat"><span className="hp-stat-num hp-color-photo">500+</span><span className="hp-stat-label">Photos Taken</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-photo">12</span><span className="hp-stat-label">Collections</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-photo">3</span><span className="hp-stat-label">Cameras Owned</span></div>
        </div>
        <div className={`hp-grid-2 hp-stagger ${ready?'hp-show':''}`}>
          {shots.map((s,i) => (
            <div key={i} className="hp-photo-card">
              <img src={s.src} alt="" />
              <span className="hp-photo-cap">{s.caption}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="hp-bottom">
        <button className="hp-back-btn" onClick={() => navigate('/')}>← Back to home</button>
      </div>
    </div>
  );
}
