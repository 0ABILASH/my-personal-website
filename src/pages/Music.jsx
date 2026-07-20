import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import '../App.css';

const playlist = [
  { title:'Acoustic Sunrise', artist:'Morning Sessions', dur:'3:42', durSec:222, active:true, link:'https://open.spotify.com/search/Acoustic%20Sunrise%20Morning%20Sessions' },
  { title:'Midnight Drive', artist:'Lo-Fi Beats', dur:'4:15', durSec:255, link:'https://open.spotify.com/search/Midnight%20Drive%20Lo-Fi%20Beats' },
  { title:'Electric Feel', artist:'Indie Collection', dur:'3:58', durSec:238, link:'https://open.spotify.com/search/Electric%20Feel%20Indie' },
  { title:'Ocean Waves', artist:'Ambient Sounds', dur:'5:20', durSec:320, link:'https://open.spotify.com/search/Ocean%20Waves%20Ambient' },
  { title:'Last Summer', artist:'Jazz Café', dur:'4:01', durSec:241, link:'https://open.spotify.com/search/Last%20Summer%20Jazz%20Cafe' },
];

const topSongs = [
  { title:'Blinding Lights', artist:'The Weeknd', dur:'3:20', genre:'Pop', link:'https://open.spotify.com/search/Blinding%20Lights%20The%20Weeknd' },
  { title:'Levitating', artist:'Dua Lipa', dur:'3:23', genre:'Pop', link:'https://open.spotify.com/search/Levitating%20Dua%20Lipa' },
  { title:'Bohemian Rhapsody', artist:'Queen', dur:'5:55', genre:'Rock', link:'https://open.spotify.com/search/Bohemian%20Rhapsody%20Queen' },
  { title:'Shape of You', artist:'Ed Sheeran', dur:'3:53', genre:'Pop', link:'https://open.spotify.com/search/Shape%20of%20You%20Ed%20Sheeran' },
  { title:'Starboy', artist:'The Weeknd', dur:'3:50', genre:'R&B', link:'https://open.spotify.com/search/Starboy%20The%20Weeknd' },
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
  const [volume, setVolume] = useState(80);
  const progressTimer = useRef(null);

  const currentList = activeTab === 'playlist' ? playlist : topSongs;
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
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(progressTimer.current);
  }, [isPlaying, currentIdx]);

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

        {/* MP3 PLAYER */}
        <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
          <div className="mp3-player">
            <div className="mp3-left">
              <div className={`mp3-disc ${isPlaying?'mp3-spin':''}`}>
                <span>♫</span>
              </div>
            </div>
            <div className="mp3-center">
              <div className="mp3-info">
                <strong>{current.title}</strong>
                <span>{current.artist}</span>
              </div>
              <div className="mp3-progress-wrap">
                <span className="mp3-time">{formatTime(progress)}</span>
                <div className="mp3-bar" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  setProgress(Math.floor(pct * current.durSec));
                }}>
                  <div className="mp3-bar-fill" style={{width:`${pct}%`}} />
                  <div className="mp3-bar-thumb" style={{left:`${pct}%`}} />
                </div>
                <span className="mp3-time">{current.dur}</span>
              </div>
              <div className="mp3-controls">
                <button className="mp3-btn mp3-shuffle" title="Shuffle">⇄</button>
                <button className="mp3-btn mp3-prev" onClick={prev} title="Previous">⏮</button>
                <button className="mp3-btn mp3-play" onClick={togglePlay} title={isPlaying?'Pause':'Play'}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button className="mp3-btn mp3-next" onClick={next} title="Next">⏭</button>
                <button className="mp3-btn mp3-repeat" title="Repeat">↻</button>
              </div>
            </div>
            <div className="mp3-right">
              <span className="mp3-vol-icon">🔊</span>
              <input
                type="range" min="0" max="100" value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                className="mp3-vol-slider"
              />
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="gtab-bar" ref={tabRef}>
          <div className="gtab-indicator" style={indicatorStyle} />
          <button className={`gtab-item ${activeTab==='playlist'?'active':''}`} onClick={() => setActiveTab('playlist')}>🎵 Playlist</button>
          <button className={`gtab-item ${activeTab==='top5'?'active':''}`} onClick={() => setActiveTab('top5')}>🎶 Top 5 Songs</button>
        </div>

        {activeTab === 'playlist' && (
          <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
            <h2>Playlist</h2>
            {playlist.map((t,i) => (
              <div key={i} className={`hp-list-item ${i===currentIdx?'hp-list-active':''}`} onClick={() => playSong(i)}>
                <span className="hp-list-num">{i===currentIdx&&isPlaying?'▶':String(i+1).padStart(2,'0')}</span>
                <div className="hp-list-info">
                  <strong>{t.title}</strong>
                  <span>{t.artist}</span>
                </div>
                <a href={t.link} target="_blank" rel="noreferrer" className="mp3-link" onClick={e => e.stopPropagation()} title="Open in Spotify">🔗</a>
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
                <a href={t.link} target="_blank" rel="noreferrer" className="mp3-link" title="Open in Spotify">🔗</a>
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
