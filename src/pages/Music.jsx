import { useNavigate } from 'react-router-dom';
import '../App.css';

const playlist = [
  { title:'Acoustic Sunrise', artist:'Morning Sessions', dur:'3:42' },
  { title:'Midnight Drive', artist:'Lo-Fi Beats', dur:'4:15' },
  { title:'Electric Feel', artist:'Indie Collection', dur:'3:58' },
  { title:'Ocean Waves', artist:'Ambient Sounds', dur:'5:20' },
  { title:'Last Summer', artist:'Jazz Café', dur:'4:01' },
];

export default function Music() {
  const navigate = useNavigate();
  return (
    <div className="g-music">
      <button className="g-music-back" onClick={() => navigate('/')}>← Back</button>
      <div className="g-music-layout">
        <div className="g-vinyl-section">
          <div className="g-vinyl">
            <div className="g-vinyl-label">♫</div>
          </div>
          <div className="g-now-playing">
            <h2>Acoustic Sunrise</h2>
            <span>Morning Sessions</span>
            <div className="g-wave">
              {[...Array(24)].map((_,i) => <div key={i} className="g-wave-bar" style={{height:`${20+Math.random()*60}%`, animationDelay:`${i*0.05}s`}} />)}
            </div>
          </div>
        </div>
        <div className="g-playlist">
          <h3>Playlist</h3>
          {playlist.map((t,i) => (
            <div key={i} className={`g-track ${i===0?'active':''}`}>
              <span className="g-track-num">{i===0?'▶':String(i+1).padStart(2,'0')}</span>
              <div className="g-track-info"><strong>{t.title}</strong><span>{t.artist}</span></div>
              <span className="g-track-dur">{t.dur}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
