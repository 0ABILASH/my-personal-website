import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import '../App.css';

const games = [
  { icon:'♟️', name:'Chess.com', genre:'Strategy', desc:'Play chess online against millions of players worldwide. From casual matches to puzzles and lessons — the best platform for chess lovers.', url:'https://www.chess.com' },
  { icon:'⚔️', name:'Clash of Clans', genre:'Strategy', desc:'Build your village, train your troops, and battle players worldwide in this epic mobile strategy game by Supercell.', url:'https://www.clashofclans.com' },
];

const sports = [
  { icon:'🏏', name:'Cricket', desc:'Watching IPL and international matches. Love the strategy and tension of Test cricket.' },
  { icon:'⚽', name:'Football', desc:'Premier League weekends are sacred. The beautiful game at its finest.' },
  { icon:'🏀', name:'Basketball', desc:'NBA playoffs are unmatched. Fast-paced, high-energy, and always dramatic.' },
  { icon:'🎾', name:'Tennis', desc:'Grand Slam finals — the mental endurance and precision is incredible to watch.' },
];

export default function Gaming() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState('library');
  const tabRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (tabRef.current) {
      const active = tabRef.current.querySelector('.gtab-item.active');
      if (active) {
        setIndicatorStyle({ width: active.offsetWidth, left: active.offsetLeft });
      }
    }
  }, [activeTab]);

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

        <div className="gtab-bar" ref={tabRef}>
          <div className="gtab-indicator" style={indicatorStyle} />
          <button className={`gtab-item ${activeTab==='library'?'active':''}`} onClick={() => setActiveTab('library')}>🎮 Library</button>
          <button className={`gtab-item ${activeTab==='sports'?'active':''}`} onClick={() => setActiveTab('sports')}>⚽ Sports</button>
          <button className={`gtab-item ${activeTab==='info'?'active':''}`} onClick={() => setActiveTab('info')}>📄 Detail Info</button>
        </div>

        {activeTab === 'library' && (
          <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
            <div className="gmodern-grid">
              {games.map((g,i) => (
                <a key={i} href={g.url} target="_blank" rel="noreferrer" className="gmodern-card">
                  <div className="gmodern-card-glow" />
                  <div className="gmodern-card-top">
                    <span className="gmodern-card-icon">{g.icon}</span>
                    <span className="gmodern-card-arrow">↗</span>
                  </div>
                  <div className="gmodern-card-body">
                    <h3 className="gmodern-card-name">{g.name}</h3>
                    <span className="gmodern-card-genre">{g.genre}</span>
                    <p className="gmodern-card-desc">{g.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
            <div className="gmodern-info">
              <div className="gmodern-info-glow" />
              <p className="gmodern-info-text">Gaming has been a huge part of my life for as long as I can remember. It started with simple platformers as a kid, and over the years I've explored everything from story-driven RPGs to competitive multiplayer games. What I love most is how games combine storytelling, strategy, and skill into one experience. Whether I'm diving into an open-world adventure, solving puzzles in a co-op session, or grinding through a tough boss fight — gaming is where I unwind, challenge myself, and discover new worlds. It's not just a hobby; it's a way of thinking, learning, and having fun.</p>
            </div>
          </div>
        )}

        {activeTab === 'sports' && (
          <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
            <div className="gsport-list">
              {sports.map((s,i) => (
                <div key={i} className="gsport-card">
                  <div className="gsport-card-glow" />
                  <div className="gsport-card-icon">{s.icon}</div>
                  <div className="gsport-card-body">
                    <h3 className="gsport-card-name">{s.name}</h3>
                    <p className="gsport-card-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="hp-bottom">
        <button className="hp-back-btn" onClick={() => navigate('/')}>← Back to home</button>
      </div>
    </div>
  );
}
