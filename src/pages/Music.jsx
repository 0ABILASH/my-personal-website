import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { SONGS, TOP_SONGS, PLAYLISTS, playSong as apiPlay, pauseSong, resumeSong, seekTo, setVolume as apiSetVolume, getAudioRef } from '../audio';
import '../App.css';

export default function Music() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState('playlist');

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const rafRef = useRef(null);

  const current = SONGS[currentIdx];

  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const tick = () => {
      const audio = getAudioRef();
      if (audio && !audio.paused) {
        setProgress(audio.currentTime);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying]);

  useEffect(() => {
    const audio = getAudioRef();
    if (!audio) return;
    const onEnd = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
        setProgress(0);
      }
    };
    audio.addEventListener('ended', onEnd);
    return () => audio.removeEventListener('ended', onEnd);
  }, [repeat]);

  const handlePlaySong = async (idx) => {
    setCurrentIdx(idx);
    setProgress(0);
    try {
      await apiPlay(idx);
      setIsPlaying(true);
    } catch (e) {
      console.warn('Playback failed:', e);
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      pauseSong();
      setIsPlaying(false);
    } else {
      try {
        const audio = getAudioRef();
        if (!audio || !audio.src) {
          await handlePlaySong(currentIdx);
        } else {
          await resumeSong();
          setIsPlaying(true);
        }
      } catch (e) {
        console.warn('Playback failed:', e);
      }
    }
  };

  const prev = () => {
    const idx = (currentIdx - 1 + SONGS.length) % SONGS.length;
    handlePlaySong(idx);
  };

  const next = () => {
    const idx = (currentIdx + 1) % SONGS.length;
    handlePlaySong(idx);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(pct);
    setProgress(pct * current.durSec);
  };

  const handleVolume = (v) => {
    setVolume(v);
    apiSetVolume(v);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const pct = current.durSec > 0 ? (progress / current.durSec) * 100 : 0;
  const volIcon = volume === 0 ? '🔇' : volume < 40 ? '🔉' : '🔊';

  const stats = [
    { label:'Instruments', value:'3', bar:40 },
    { label:'Songs Learned', value:'200+', bar:75 },
    { label:'Years Playing', value:'5', bar:50 },
  ];

  return (
    <div className="cy-wrap">
      <nav className="cy-nav">
        <button className="cy-nav-back" onClick={() => navigate('/')}>← Back</button>
        <span className="cy-nav-tag">Music</span>
      </nav>

      <div className={`cy-hero ${ready?'cy-show':''}`}>
        <div className="cy-scanlines" />
        <div className="cy-hero-inner">
          <div className="cy-hero-left">
            <span className="cy-tag">HOBBY</span>
            <h1 className="cy-hero-title">Music</h1>
            <p className="cy-hero-desc">Playing guitar and discovering artists.</p>
          </div>
          <div className="cy-hero-right">
            <div className="cy-hero-icon-box">
              <span className="cy-hero-emoji">🎵</span>
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

      {/* NOW PLAYING PLAYER */}
      <div className={`cy-panel ${ready?'cy-show':''}`} style={{maxWidth:800,margin:'1.5rem auto 0',padding:'0 1.4rem'}}>
        <div className="np-player" style={{ '--np-c1': current.colors[0], '--np-c2': current.colors[1] }}>
          <div className="np-art">
            <div className={`np-art-inner ${isPlaying ? 'np-spin' : ''}`}>
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
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
              </a>
            </div>
            <div className="np-progress">
              <span className="np-time">{formatTime(progress)}</span>
              <div className="np-bar" onClick={handleSeek}>
                <div className="np-bar-bg" />
                <div className="np-bar-fill" style={{ width: `${pct}%` }} />
                <div className="np-bar-thumb" style={{ left: `${pct}%` }} />
              </div>
              <span className="np-time">{current.dur}</span>
            </div>
            <div className="np-controls">
              <button className={`np-btn np-sm ${shuffle ? 'np-active' : ''}`} onClick={() => setShuffle(!shuffle)} title="Shuffle">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" /></svg>
              </button>
              <button className="np-btn np-md" onClick={prev} title="Previous">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
              </button>
              <button className="np-btn np-play" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying
                  ? <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  : <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                }
              </button>
              <button className="np-btn np-md" onClick={next} title="Next">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
              </button>
              <button className={`np-btn np-sm ${repeat ? 'np-active' : ''}`} onClick={() => setRepeat(!repeat)} title="Repeat">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" /></svg>
              </button>
            </div>
            <div className="np-vol">
              <span className="np-vol-icon" onClick={() => handleVolume(volume > 0 ? 0 : 100)}>{volIcon}</span>
              <input type="range" min="0" max="100" value={volume} onChange={e => handleVolume(Number(e.target.value))} className="np-vol-bar" />
              <span className="np-vol-num">{volume}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="cy-tabs" style={{maxWidth:800,margin:'1.5rem auto 0',padding:'0 1.4rem'}}>
        {[
          { id:'playlist', icon:'🎵', label:'Playlist' },
          { id:'top5', icon:'🎶', label:'Top 5 Songs' },
          { id:'links', icon:'🔗', label:'Playlists' },
        ].map(t => (
          <button key={t.id}
            className={`cy-tab-btn ${activeTab===t.id?'cy-tab-active':''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'playlist' && (
        <div className={`cy-panel ${ready?'cy-show':''}`} style={{maxWidth:800,margin:'1rem auto 0',padding:'0 1.4rem'}}>
          <div className="cy-panel-header">
            <h2>Playlist</h2>
            <span className="cy-panel-count">{SONGS.length} songs</span>
          </div>
          <div className="cy-song-list">
            {SONGS.map((t, i) => (
              <div key={i} className={`cy-song-card ${i === currentIdx ? 'cy-song-active' : ''}`} onClick={() => handlePlaySong(i)}>
                <div className="cy-song-num" style={{background: `linear-gradient(135deg,${t.colors[0]},${t.colors[1]})`}}>
                  {i === currentIdx && isPlaying
                    ? <div className="np-mini-bars"><span /><span /><span /></div>
                    : <span>{String(i + 1).padStart(2, '0')}</span>
                  }
                </div>
                <div className="cy-song-body">
                  <h3>{t.title}</h3>
                  <p>{t.artist}</p>
                </div>
                <a href={t.link} target="_blank" rel="noreferrer" className="cy-song-link" onClick={e => e.stopPropagation()} title="Open in Spotify">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
                </a>
                <span className="cy-song-dur">{t.dur}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'top5' && (
        <div className={`cy-panel ${ready?'cy-show':''}`} style={{maxWidth:800,margin:'1rem auto 0',padding:'0 1.4rem'}}>
          <div className="cy-panel-header">
            <h2>Top 5 Songs</h2>
          </div>
          <div className="cy-song-list">
            {TOP_SONGS.map((t, i) => (
              <div key={i} className="cy-song-card">
                <div className="cy-song-rank">{i + 1}</div>
                <div className="cy-song-body">
                  <h3>{t.title}</h3>
                  <p>{t.artist} · {t.genre}</p>
                </div>
                <a href={t.link} target="_blank" rel="noreferrer" className="cy-song-link" title="Open in Spotify">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
                </a>
                <span className="cy-song-dur">{t.dur}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className={`cy-panel ${ready?'cy-show':''}`} style={{maxWidth:800,margin:'1rem auto 0',padding:'0 1.4rem'}}>
          <div className="cy-panel-header">
            <h2>Playlist Links</h2>
          </div>
          <div className="cy-pl-grid">
            {PLAYLISTS.map((pl, i) => (
              <a key={i} href={pl.link} target="_blank" rel="noreferrer" className="cy-pl-card">
                <div className="cy-pl-emoji">{pl.emoji}</div>
                <div className="cy-pl-info">
                  <strong>{pl.name}</strong>
                  <span>{pl.desc}</span>
                  <span className="cy-pl-count">{pl.songs} songs</span>
                </div>
                <span className="cy-pl-arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="cy-bottom">
        <button className="cy-back-btn" onClick={() => navigate('/')}>← Back to home</button>
      </div>
    </div>
  );
}
