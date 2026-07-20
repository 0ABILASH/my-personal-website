import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { SONGS, TOP_SONGS, PLAYLISTS, playSong as apiPlay, pauseSong, resumeSong, seekTo, setVolume as apiSetVolume, getAudioRef } from '../audio';
import '../App.css';

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
  const rafRef = useRef(null);

  const current = SONGS[currentIdx];

  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (tabRef.current) {
      const active = tabRef.current.querySelector('.gtab-item.active');
      if (active) setIndicatorStyle({ width: active.offsetWidth, left: active.offsetLeft });
    }
  }, [activeTab]);

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

  return (
    <div className="hp-wrap">
      <nav className="hp-nav"><button onClick={() => navigate('/')}>← Back</button><span>Music</span></nav>
      <div className={`hp-hero hp-hero-music ${ready ? 'hp-show' : ''}`}>
        <div className="hp-hero-content">
          <span className="hp-badge hp-badge-music">Hobby</span>
          <h1>Music</h1>
          <p>Playing guitar and discovering artists.</p>
        </div>
        <div className="hp-hero-icon">🎵</div>
      </div>
      <div className="hp-body">
        <div className={`hp-stats hp-stagger ${ready ? 'hp-show' : ''}`}>
          <div className="hp-stat"><span className="hp-stat-num hp-color-music">3</span><span className="hp-stat-label">Instruments</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-music">200+</span><span className="hp-stat-label">Songs Learned</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-music">5</span><span className="hp-stat-label">Years Playing</span></div>
        </div>

        {/* NOW PLAYING PLAYER */}
        <div className={`hp-section hp-stagger ${ready ? 'hp-show' : ''}`}>
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
        <div className="gtab-bar" ref={tabRef}>
          <div className="gtab-indicator" style={indicatorStyle} />
          <button className={`gtab-item ${activeTab === 'playlist' ? 'active' : ''}`} onClick={() => setActiveTab('playlist')}>🎵 Playlist</button>
          <button className={`gtab-item ${activeTab === 'top5' ? 'active' : ''}`} onClick={() => setActiveTab('top5')}>🎶 Top 5 Songs</button>
          <button className={`gtab-item ${activeTab === 'links' ? 'active' : ''}`} onClick={() => setActiveTab('links')}>🔗 Playlists</button>
        </div>

        {activeTab === 'playlist' && (
          <div className={`hp-section hp-stagger ${ready ? 'hp-show' : ''}`}>
            <h2>Playlist</h2>
            {SONGS.map((t, i) => (
              <div key={i} className={`np-list-item ${i === currentIdx ? 'np-list-active' : ''}`} onClick={() => handlePlaySong(i)}>
                <div className="np-list-art" style={{ background: `linear-gradient(135deg,${t.colors[0]},${t.colors[1]})` }}>
                  {i === currentIdx && isPlaying
                    ? <div className="np-mini-bars"><span /><span /><span /></div>
                    : <span className="np-list-num">{String(i + 1).padStart(2, '0')}</span>
                  }
                </div>
                <div className="np-list-info">
                  <strong>{t.title}</strong>
                  <span>{t.artist}</span>
                </div>
                <a href={t.link} target="_blank" rel="noreferrer" className="np-list-link" onClick={e => e.stopPropagation()} title="Open in Spotify">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
                </a>
                <span className="np-list-dur">{t.dur}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'top5' && (
          <div className={`hp-section hp-stagger ${ready ? 'hp-show' : ''}`}>
            <h2>Top 5 Songs</h2>
            {TOP_SONGS.map((t, i) => (
              <div key={i} className="np-list-item">
                <div className="np-list-rank">{i + 1}</div>
                <div className="np-list-info">
                  <strong>{t.title}</strong>
                  <span>{t.artist} · {t.genre}</span>
                </div>
                <a href={t.link} target="_blank" rel="noreferrer" className="np-list-link" title="Open in Spotify">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
                </a>
                <span className="np-list-dur">{t.dur}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'links' && (
          <div className={`hp-section hp-stagger ${ready ? 'hp-show' : ''}`}>
            <h2>Playlist Links</h2>
            <div className="np-pl-grid">
              {PLAYLISTS.map((pl, i) => (
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
