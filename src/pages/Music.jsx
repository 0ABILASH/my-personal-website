import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import '../App.css';

const playlist = [
  { title:'Acoustic Sunrise', artist:'Morning Sessions', dur:'3:42', active:true },
  { title:'Midnight Drive', artist:'Lo-Fi Beats', dur:'4:15' },
  { title:'Electric Feel', artist:'Indie Collection', dur:'3:58' },
  { title:'Ocean Waves', artist:'Ambient Sounds', dur:'5:20' },
  { title:'Last Summer', artist:'Jazz Café', dur:'4:01' },
];

const topSongs = [
  { title:'Blinding Lights', artist:'The Weeknd', dur:'3:20', genre:'Pop' },
  { title:'Levitating', artist:'Dua Lipa', dur:'3:23', genre:'Pop' },
  { title:'Bohemian Rhapsody', artist:'Queen', dur:'5:55', genre:'Rock' },
  { title:'Shape of You', artist:'Ed Sheeran', dur:'3:53', genre:'Pop' },
  { title:'Starboy', artist:'The Weeknd', dur:'3:50', genre:'R&B' },
];

export default function Music() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState('playlist');
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
      <nav className="hp-nav"><button onClick={() => navigate('/')}>← Back</button><span>Music</span></nav>
      <div className={`hp-hero hp-hero-music ${ready?'hp-show':''}`}>
        <div className="hp-hero-content">
          <span className="hp-badge hp-badge-music">Hobby</span>
          <h1>Music</h1>
          <p>Playing guitar and discovering artists.</p>
        </div>
        <div className="hp-hero-icon">🎵</div>
      </div>
      <div className="hp-body">
        <div className={`hp-stats hp-stagger ${ready?'hp-show':''}`}>
          <div className="hp-stat"><span className="hp-stat-num hp-color-music">3</span><span className="hp-stat-label">Instruments</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-music">200+</span><span className="hp-stat-label">Songs Learned</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-music">5</span><span className="hp-stat-label">Years Playing</span></div>
        </div>
        <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
          <h2>Now Playing</h2>
          <div className="hp-player-card">
            <div className="hp-player-disc">♫</div>
            <div className="hp-player-info">
              <strong>Acoustic Sunrise</strong>
              <span>Morning Sessions · 3:42</span>
            </div>
            <div className="hp-wave">
              {[...Array(16)].map((_,i) => <div key={i} className="hp-wave-bar" style={{animationDelay:`${i*0.08}s`}} />)}
            </div>
          </div>
        </div>

        <div className="gtab-bar" ref={tabRef}>
          <div className="gtab-indicator" style={indicatorStyle} />
          <button className={`gtab-item ${activeTab==='playlist'?'active':''}`} onClick={() => setActiveTab('playlist')}>🎵 Playlist</button>
          <button className={`gtab-item ${activeTab==='top5'?'active':''}`} onClick={() => setActiveTab('top5')}>🎶 Top 5 Songs</button>
        </div>

        {activeTab === 'playlist' && (
          <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
            <h2>Playlist</h2>
            {playlist.map((t,i) => (
              <div key={i} className={`hp-list-item ${t.active?'hp-list-active':''}`}>
                <span className="hp-list-num">{t.active?'▶':String(i+1).padStart(2,'0')}</span>
                <div className="hp-list-info">
                  <strong>{t.title}</strong>
                  <span>{t.artist}</span>
                </div>
                <span className="hp-list-dur">{t.dur}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'top5' && (
          <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
            <h2>Top 5 Songs</h2>
            {topSongs.map((t,i) => (
              <div key={i} className="hp-list-item">
                <span className="hp-list-num">{String(i+1).padStart(2,'0')}</span>
                <div className="hp-list-info">
                  <strong>{t.title}</strong>
                  <span>{t.artist} · {t.genre}</span>
                </div>
                <span className="hp-list-dur">{t.dur}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="hp-bottom">
        <button className="hp-back-btn" onClick={() => navigate('/')}>← Back to home</button>
      </div>
    </div>
  );
}
