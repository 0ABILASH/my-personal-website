import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css';

const games = [
  { icon:'♟️', name:'Chess.com', genre:'Strategy', desc:'Play chess online against millions of players worldwide. From casual matches to puzzles and lessons — the best platform for chess lovers.', url:'https://www.chess.com', rating:9.5 },
  { icon:'⚔️', name:'Clash of Clans', genre:'Strategy', desc:'Build your village, train your troops, and battle players worldwide in this epic mobile strategy game by Supercell.', url:'https://www.clashofclans.com', rating:8.8 },
];

const sports = [
  { icon:'🏏', name:'Cricket', desc:'Watching IPL and international matches. Love the strategy and tension of Test cricket.', color:'#f59e0b' },
  { icon:'⚽', name:'Football', desc:'Premier League weekends are sacred. The beautiful game at its finest.', color:'#10b981' },
  { icon:'🏀', name:'Basketball', desc:'NBA playoffs are unmatched. Fast-paced, high-energy, and always dramatic.', color:'#ef4444' },
  { icon:'🎾', name:'Tennis', desc:'Grand Slam finals — the mental endurance and precision is incredible to watch.', color:'#8b5cf6' },
];

const stats = [
  { label:'Hours Played', value:'2000+', bar:85 },
  { label:'Games Finished', value:'50+', bar:65 },
  { label:'Max Level', value:'Lv.99', bar:99 },
];

export default function Gaming() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState('library');

  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="cy-wrap">
      <nav className="cy-nav">
        <button className="cy-nav-back" onClick={() => navigate('/')}>← Back</button>
        <span className="cy-nav-tag">Gaming</span>
      </nav>

      <div className={`cy-hero ${ready?'cy-show':''}`}>
        <div className="cy-scanlines" />
        <div className="cy-hero-inner">
          <div className="cy-hero-left">
            <span className="cy-tag">HOBBY</span>
            <h1 className="cy-hero-title">Gaming</h1>
            <p className="cy-hero-desc">Strategy and adventure games — love the challenge.</p>
          </div>
          <div className="cy-hero-right">
            <div className="cy-hero-icon-box">
              <span className="cy-hero-emoji">🎮</span>
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

      <div className={`cy-layout ${ready?'cy-show':''}`}>
        <aside className="cy-sidebar">
          {[
            { id:'library', icon:'🎮', label:'Library' },
            { id:'sports', icon:'⚽', label:'Sports' },
            { id:'info', icon:'📄', label:'Detail Info' },
          ].map(t => (
            <button key={t.id}
              className={`cy-side-btn ${activeTab===t.id?'cy-side-active':''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="cy-side-icon">{t.icon}</span>
              <span className="cy-side-label">{t.label}</span>
              {activeTab===t.id && <span className="cy-side-dot" />}
            </button>
          ))}
        </aside>

        <div className="cy-content">
          {activeTab === 'library' && (
            <div className={`cy-panel ${ready?'cy-show':''}`}>
              <div className="cy-panel-header">
                <h2>Game Library</h2>
                <span className="cy-panel-count">{games.length} games</span>
              </div>
              <div className="cy-game-list">
                {games.map((g,i) => (
                  <a key={i} href={g.url} target="_blank" rel="noreferrer" className="cy-game-card">
                    <div className="cy-game-accent" />
                    <div className="cy-game-left">
                      <span className="cy-game-icon">{g.icon}</span>
                    </div>
                    <div className="cy-game-body">
                      <div className="cy-game-row">
                        <h3>{g.name}</h3>
                        <span className="cy-game-genre">{g.genre}</span>
                      </div>
                      <p>{g.desc}</p>
                      <div className="cy-game-footer">
                        <div className="cy-game-rating">
                          <div className="cy-game-rating-bar">
                            <div className="cy-game-rating-fill" style={{width: g.rating*10+'%'}} />
                          </div>
                          <span>{g.rating}/10</span>
                        </div>
                        <span className="cy-game-link">Play now ↗</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sports' && (
            <div className={`cy-panel ${ready?'cy-show':''}`}>
              <div className="cy-panel-header">
                <h2>Sports I Follow</h2>
                <span className="cy-panel-count">{sports.length} sports</span>
              </div>
              <div className="cy-sport-list">
                {sports.map((s,i) => (
                  <div key={i} className="cy-sport-card">
                    <div className="cy-sport-glow" style={{background: s.color}} />
                    <div className="cy-sport-icon">{s.icon}</div>
                    <div className="cy-sport-body">
                      <h3>{s.name}</h3>
                      <p>{s.desc}</p>
                    </div>
                    <div className="cy-sport-line" style={{background: s.color}} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className={`cy-panel ${ready?'cy-show':''}`}>
              <div className="cy-panel-header">
                <h2>About Gaming</h2>
              </div>
              <div className="cy-terminal">
                <div className="cy-terminal-bar">
                  <span className="cy-terminal-dot cy-dot-red" />
                  <span className="cy-terminal-dot cy-dot-yellow" />
                  <span className="cy-terminal-dot cy-dot-green" />
                  <span className="cy-terminal-title">about_gaming.md</span>
                </div>
                <div className="cy-terminal-body">
                  <p className="cy-terminal-line"><span className="cy-t-prompt">&gt;</span> Gaming has been a huge part of my life for as long as I can remember.</p>
                  <p className="cy-terminal-line"><span className="cy-t-prompt">&gt;</span> It started with simple platformers as a kid, and over the years I've explored everything from story-driven RPGs to competitive multiplayer games.</p>
                  <p className="cy-terminal-line"><span className="cy-t-prompt">&gt;</span> What I love most is how games combine storytelling, strategy, and skill into one experience.</p>
                  <p className="cy-terminal-line"><span className="cy-t-prompt">&gt;</span> Whether I'm diving into an open-world adventure, solving puzzles in a co-op session, or grinding through a tough boss fight — gaming is where I unwind, challenge myself, and discover new worlds.</p>
                  <p className="cy-terminal-line"><span className="cy-t-prompt">&gt;</span> It's not just a hobby; it's a way of thinking, learning, and having fun.</p>
                  <p className="cy-terminal-cursor">_</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="cy-bottom">
        <button className="cy-back-btn" onClick={() => navigate('/')}>← Back to home</button>
      </div>
    </div>
  );
}
