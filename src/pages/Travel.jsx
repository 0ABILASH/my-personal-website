import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css';

const destinations = [
  { city:'Tokyo', country:'Japan', emoji:'🗼', date:'Mar 2024', color:'#ef4444' },
  { city:'Paris', country:'France', emoji:'🏛️', date:'Jun 2024', color:'#3b82f6' },
  { city:'New York', country:'USA', emoji:'🗽', date:'Sep 2024', color:'#22c55e' },
  { city:'Reykjavik', country:'Iceland', emoji:'🌋', date:'Jan 2025', color:'#8b5cf6' },
  { city:'Bali', country:'Indonesia', emoji:'🌴', date:'Apr 2025', color:'#f97316' },
  { city:'Kyoto', country:'Japan', emoji:'⛩️', date:'Jun 2025', color:'#e11d48' },
];

export default function Travel() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div className="hp-wrap">
      <nav className="hp-nav"><button onClick={() => navigate('/')}>← Back</button><span>Travel</span></nav>
      <div className={`hp-hero hp-hero-travel ${ready?'hp-show':''}`}>
        <div className="hp-hero-content">
          <span className="hp-badge hp-badge-travel">Hobby</span>
          <h1>Travel</h1>
          <p>Exploring new places and cultures.</p>
        </div>
        <div className="hp-hero-icon">✈️</div>
      </div>
      <div className="hp-body">
        <div className={`hp-stats hp-stagger ${ready?'hp-show':''}`}>
          <div className="hp-stat"><span className="hp-stat-num hp-color-travel">6</span><span className="hp-stat-label">Countries</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-travel">15</span><span className="hp-stat-label">Cities</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-travel">42</span><span className="hp-stat-label">Days Abroad</span></div>
        </div>
        <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
          <h2>Destinations</h2>
          {destinations.map((d,i) => (
            <div key={i} className="hp-list-item">
              <div className="hp-dest-dot" style={{background:d.color+'18',color:d.color}}><span>{d.emoji}</span></div>
              <div className="hp-list-info">
                <strong>{d.city}</strong>
                <span>{d.country} · {d.date}</span>
              </div>
              <span className="hp-list-arrow">→</span>
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
