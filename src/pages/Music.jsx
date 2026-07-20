import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import '../App.css';

const playlist = [
  { title:'Acoustic Sunrise', artist:'Morning Sessions', dur:'3:42', durSec:222, link:'https://open.spotify.com/search/Acoustic%20Sunrise%20Morning%20Sessions', colors:['#f59e0b','#f97316'] },
  { title:'Midnight Drive', artist:'Lo-Fi Beats', dur:'4:15', durSec:255, link:'https://open.spotify.com/search/Midnight%20Drive%20Lo-Fi%20Beats', colors:['#6366f1','#8b5cf6'] },
  { title:'Electric Feel', artist:'Indie Collection', dur:'3:58', durSec:238, link:'https://open.spotify.com/search/Electric%20Feel%20Indie', colors:['#10b981','#06b6d4'] },
  { title:'Ocean Waves', artist:'Ambient Sounds', dur:'5:20', durSec:320, link:'https://open.spotify.com/search/Ocean%20Waves%20Ambient', colors:['#0ea5e9','#6366f1'] },
  { title:'Last Summer', artist:'Jazz Café', dur:'4:01', durSec:241, link:'https://open.spotify.com/search/Last%20Summer%20Jazz%20Cafe', colors:['#ec4899','#f43f5e'] },
];

const topSongs = [
  { title:'Blinding Lights', artist:'The Weeknd', dur:'3:20', genre:'Pop', link:'https://open.spotify.com/search/Blinding%20Lights%20The%20Weeknd' },
  { title:'Levitating', artist:'Dua Lipa', dur:'3:23', genre:'Pop', link:'https://open.spotify.com/search/Levitating%20Dua%20Lipa' },
  { title:'Bohemian Rhapsody', artist:'Queen', dur:'5:55', genre:'Rock', link:'https://open.spotify.com/search/Bohemian%20Rhapsody%20Queen' },
  { title:'Shape of You', artist:'Ed Sheeran', dur:'3:53', genre:'Pop', link:'https://open.spotify.com/search/Shape%20of%20You%20Ed%20Sheeran' },
  { title:'Starboy', artist:'The Weeknd', dur:'3:50', genre:'R&B', link:'https://open.spotify.com/search/Starboy%20The%20Weeknd' },
];

const playlists = [
  { name:'Lo-Fi Chill Beats', desc:'Relaxing lo-fi for coding and studying', emoji:'🎧', songs:24, link:'https://open.spotify.com/playlist/37i9dQZF1DX4dyzvZRCJMC' },
  { name:'Indie Acoustic', desc:'Acoustic guitar vibes and folk tunes', emoji:'🎸', songs:18, link:'https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U' },
  { name:'Jazz Café Evenings', desc:'Smooth jazz for late night sessions', emoji:'🎷', songs:30, link:'https://open.spotify.com/playlist/37i9dQZF1DWV7EzJMK2FUI' },
  { name:'Bollywood Classics', desc:'Timeless Indian music favourites', emoji:'🎶', songs:45, link:'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd' },
  { name:'Workout Energy', desc:'High energy tracks to keep you going', emoji:'💪', songs:35, link:'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP' },
  { name:'Late Night Drive', desc:'Perfect songs for midnight road trips', emoji:'🌙', songs:20, link:'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M' },
];

export default function Music() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState('playlist');
  const tabRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const progressTimer = useRef(null);

  const current = playlist[currentIdx];

  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (tabRef.current) {
      const active = tabRef.current.querySelector('.gtab-item.active');
      if (active) setIndicatorStyle({ width: active.offsetWidth, left: active.offsetLeft });
    }
  }, [activeTab]);

  useEffect(() => {
    if (isPlaying) {
      progressTimer.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= current.durSec) {
            if (repeat) return 0;
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(progressTimer.current);
  }, [isPlaying, currentIdx, repeat]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playSong = (idx) => {
    setCurrentIdx(idx);
    setProgress(0);
    setIsPlaying(true);
  };

  const prev = () => {
    const idx = (currentIdx - 1 + playlist.length) % playlist.length;
    playSong(idx);
  };

  const next = () => {
    const idx = (currentIdx + 1) % playlist.length;
    playSong(idx);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2,'0')}`;
  };

  const pct = (progress / current.durSec) * 100;
  const volIcon = volume === 0 ? '🔇' : volume < 40 ? '🔉' : '🔊';

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

        {/* NOW PLAYING PLAYER */}
        <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
          <div className="np-player" style={{'--np-c1':current.colors[0],'--np-c2':current.colors[1]}}>
            <div className="np-art">
              <div className={`np-art-inner ${isPlaying?'np-spin':''}`}>
                <span className="np-art-icon">♫</span>
                <div className="np-art-ring" />
              </div>
              {isPlaying && <div className="np-bars"><span /><span /><span /><span /><span /></div>}
            </div>
            <div className="np-main">
              <div className="np-top">
                <div className="np-info">
                  <span className="np-label">Now Playing</span>
                  <h3 className="np-title">{current.title}</h3>
                  <p className="np-artist">{current.artist}</p>
                </div>
                <a href={current.link} target="_blank" rel="noreferrer" className="np-spotify" title="Open in Spotify">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                </a>
              </div>
              <div className="np-progress">
                <span className="np-time">{formatTime(progress)}</span>
                <div className="np-bar" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const p = (e.clientX - rect.left) / rect.width;
                  setProgress(Math.floor(p * current.durSec));
                }}>
                  <div className="np-bar-bg" />
                  <div className="np-bar-fill" style={{width:`${pct}%`}} />
                  <div className="np-bar-thumb" style={{left:`${pct}%`}} />
                </div>
                <span className="np-time">{current.dur}</span>
              </div>
              <div className="np-controls">
                <button className={`np-btn np-sm ${shuffle?'np-active':''}`} onClick={() => setShuffle(!shuffle)} title="Shuffle">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
                </button>
                <button className="np-btn np-md" onClick={prev} title="Previous">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                </button>
                <button className="np-btn np-play" onClick={togglePlay} title={isPlaying?'Pause':'Play'}>
                  {isPlaying
                    ? <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    : <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  }
                </button>
                <button className="np-btn np-md" onClick={next} title="Next">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                </button>
                <button className={`np-btn np-sm ${repeat?'np-active':''}`} onClick={() => setRepeat(!repeat)} title="Repeat">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
                </button>
              </div>
              <div className="np-vol">
                <span className="np-vol-icon" onClick={() => setVolume(volume > 0 ? 0 : 100)}>{volIcon}</span>
                <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} className="np-vol-bar" />
                <span className="np-vol-num">{volume}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="gtab-bar" ref={tabRef}>
          <div className="gtab-indicator" style={indicatorStyle} />
          <button className={`gtab-item ${activeTab==='playlist'?'active':''}`} onClick={() => setActiveTab('playlist')}>🎵 Playlist</button>
          <button className={`gtab-item ${activeTab==='top5'?'active':''}`} onClick={() => setActiveTab('top5')}>🎶 Top 5 Songs</button>
          <button className={`gtab-item ${activeTab==='links'?'active':''}`} onClick={() => setActiveTab('links')}>🔗 Playlists</button>
        </div>

        {activeTab === 'playlist' && (
          <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
            <h2>Playlist</h2>
            {playlist.map((t,i) => (
              <div key={i} className={`np-list-item ${i===currentIdx?'np-list-active':''}`} onClick={() => playSong(i)}>
                <div className={`np-list-art`} style={{background:`linear-gradient(135deg,${t.colors[0]},${t.colors[1]})`}}>
                  {i===currentIdx&&isPlaying
                    ? <div className="np-mini-bars"><span /><span /><span /></div>
                    : <span className="np-list-num">{String(i+1).padStart(2,'0')}</span>
                  }
                </div>
                <div className="np-list-info">
                  <strong>{t.title}</strong>
                  <span>{t.artist}</span>
                </div>
                <a href={t.link} target="_blank" rel="noreferrer" className="np-list-link" onClick={e => e.stopPropagation()} title="Open in Spotify">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                </a>
                <span className="np-list-dur">{t.dur}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'top5' && (
          <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
            <h2>Top 5 Songs</h2>
            {topSongs.map((t,i) => (
              <div key={i} className="np-list-item">
                <div className="np-list-rank">{i+1}</div>
                <div className="np-list-info">
                  <strong>{t.title}</strong>
                  <span>{t.artist} · {t.genre}</span>
                </div>
                <a href={t.link} target="_blank" rel="noreferrer" className="np-list-link" title="Open in Spotify">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                </a>
                <span className="np-list-dur">{t.dur}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'links' && (
          <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
            <h2>Playlist Links</h2>
            <div className="np-pl-grid">
              {playlists.map((pl,i) => (
                <a key={i} href={pl.link} target="_blank" rel="noreferrer" className="np-pl-card">
                  <div className="np-pl-emoji">{pl.emoji}</div>
                  <div className="np-pl-info">
                    <strong>{pl.name}</strong>
                    <span>{pl.desc}</span>
                    <span className="np-pl-count">{pl.songs} songs</span>
                  </div>
                  <span className="np-pl-arrow">↗</span>
                </a>
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
