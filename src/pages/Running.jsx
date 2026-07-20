import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css';

const weekly = [4.2, 5.1, 3.8, 6.0, 5.5, 7.2, 4.8];
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const recent = [
  { name:'Morning Jog', dist:'5.1 km', time:'28 min', when:'Today' },
  { name:'Tempo Run', dist:'7.2 km', time:'38 min', when:'Yesterday' },
  { name:'Recovery Run', dist:'3.8 km', time:'22 min', when:'2 days ago' },
];

const stats = [
  { label:'km This Week', value:'36.6', bar:70 },
  { label:'min/km Avg', value:'5:30', bar:55 },
  { label:'Day Streak', value:'30', bar:90 },
];

export default function Running() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);
  const max = Math.max(...weekly);

  return (
    <div className="cy-wrap">
      <nav className="cy-nav">
        <button className="cy-nav-back" onClick={() => navigate('/')}>← Back</button>
        <span className="cy-nav-tag">Running</span>
      </nav>

      <div className={`cy-hero ${ready?'cy-show':''}`}>
        <div className="cy-scanlines" />
        <div className="cy-hero-inner">
          <div className="cy-hero-left">
            <span className="cy-tag">HOBBY</span>
            <h1 className="cy-hero-title">Running</h1>
            <p className="cy-hero-desc">Early morning runs to stay focused and energized.</p>
          </div>
          <div className="cy-hero-right">
            <div className="cy-hero-icon-box">
              <span className="cy-hero-emoji">🏃</span>
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

      <div className={`cy-panel ${ready?'cy-show':''}`} style={{maxWidth:800,margin:'1.5rem auto 0',padding:'0 1.4rem'}}>
        <div className="cy-panel-header">
          <h2>Weekly Activity</h2>
        </div>
        <div className="cy-chart">
          {weekly.map((v,i) => (
            <div key={i} className="cy-chart-col">
              <div className="cy-chart-track">
                <div className="cy-chart-fill" style={{height: `${(v/max)*100}%`}} />
              </div>
              <span className="cy-chart-val">{v}</span>
              <span className="cy-chart-day">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`cy-panel ${ready?'cy-show':''}`} style={{maxWidth:800,margin:'1.5rem auto 0',padding:'0 1.4rem'}}>
        <div className="cy-panel-header">
          <h2>Recent Runs</h2>
          <span className="cy-panel-count">{recent.length} runs</span>
        </div>
        <div className="cy-run-list">
          {recent.map((r,i) => (
            <div key={i} className="cy-run-card">
              <div className="cy-run-icon">🏃</div>
              <div className="cy-run-body">
                <h3>{r.name}</h3>
                <p>{r.dist} · {r.time}</p>
              </div>
              <span className="cy-run-when">{r.when}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cy-bottom">
        <button className="cy-back-btn" onClick={() => navigate('/')}>← Back to home</button>
      </div>
    </div>
  );
}
