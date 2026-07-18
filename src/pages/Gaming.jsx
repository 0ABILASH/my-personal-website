import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css';

const games = [
  { icon:'⚔️', name:'The Witcher 3', genre:'RPG', hours:'340h', pct:85 },
  { icon:'🧩', name:'Portal 2', genre:'Puzzle', hours:'28h', pct:40 },
  { icon:'🗺️', name:'Elden Ring', genre:'Adventure', hours:'120h', pct:65 },
];

export default function Gaming() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div className="hp-wrap">
      <nav className="hp-nav"><button onClick={() => navigate('/')}>← Back</button><span>Gaming</span></nav>
      <div className={`hp-hero hp-hero-gaming ${ready?'hp-show':''}`}>
        <div className="hp-hero-content">
          <span className="hp-badge hp-badge-gaming">Hobby</span>
          <h1>Gaming</h1>
          <p>Strategy and adventure games — love the challenge.</p>
        </div>
        <div className="hp-hero-icon">🎮</div>
      </div>
      <div className="hp-body">
        <div className={`hp-stats hp-stagger ${ready?'hp-show':''}`}>
          <div className="hp-stat"><span className="hp-stat-num hp-color-gaming">2000+</span><span className="hp-stat-label">Hours Played</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-gaming">50+</span><span className="hp-stat-label">Games Finished</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-gaming">Lv.99</span><span className="hp-stat-label">Max Level</span></div>
        </div>
        <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
          <h2>Library</h2>
          {games.map((g,i) => (
            <div key={i} className="hp-list-item">
              <span className="hp-list-icon">{g.icon}</span>
              <div className="hp-list-info">
                <strong>{g.name}</strong>
                <span>{g.genre} · {g.hours}</span>
              </div>
              <div className="hp-mini-bar"><div className="hp-mini-fill hp-bg-gaming" style={{width:`${g.pct}%`}} /></div>
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
