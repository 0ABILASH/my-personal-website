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

export default function Running() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);
  const max = Math.max(...weekly);
  return (
    <div className="hp-wrap">
      <nav className="hp-nav"><button onClick={() => navigate('/')}>← Back</button><span>Running</span></nav>
      <div className={`hp-hero hp-hero-running ${ready?'hp-show':''}`}>
        <div className="hp-hero-content">
          <span className="hp-badge hp-badge-running">Hobby</span>
          <h1>Running</h1>
          <p>Early morning runs to stay focused and energized.</p>
        </div>
        <div className="hp-hero-icon">🏃</div>
      </div>
      <div className="hp-body">
        <div className={`hp-stats hp-stagger ${ready?'hp-show':''}`}>
          <div className="hp-stat"><span className="hp-stat-num hp-color-running">36.6</span><span className="hp-stat-label">km This Week</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-running">5:30</span><span className="hp-stat-label">min/km Avg</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-running">30</span><span className="hp-stat-label">Day Streak</span></div>
        </div>
        <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
          <h2>Weekly Activity</h2>
          <div className="hp-chart">
            {weekly.map((v,i) => (
              <div key={i} className="hp-chart-col">
                <div className="hp-chart-track"><div className="hp-chart-fill hp-bg-running" style={{height:`${(v/max)*100}%`}} /></div>
                <span className="hp-chart-val">{v}</span>
                <span className="hp-chart-day">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
          <h2>Recent Runs</h2>
          {recent.map((r,i) => (
            <div key={i} className="hp-list-item">
              <span className="hp-list-icon">🏃</span>
              <div className="hp-list-info">
                <strong>{r.name}</strong>
                <span>{r.dist} · {r.time}</span>
              </div>
              <span className="hp-list-dur">{r.when}</span>
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
