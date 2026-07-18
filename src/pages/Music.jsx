import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css';

const playlist = [
  { title:'Acoustic Sunrise', artist:'Morning Sessions', dur:'3:42', active:true },
  { title:'Midnight Drive', artist:'Lo-Fi Beats', dur:'4:15' },
  { title:'Electric Feel', artist:'Indie Collection', dur:'3:58' },
  { title:'Ocean Waves', artist:'Ambient Sounds', dur:'5:20' },
  { title:'Last Summer', artist:'Jazz Café', dur:'4:01' },
];

export default function Music() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);
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
      </div>
      <div className="hp-bottom">
        <button className="hp-back-btn" onClick={() => navigate('/')}>← Back to home</button>
      </div>
    </div>
  );
}
