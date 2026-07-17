import { useNavigate } from 'react-router-dom';
import '../App.css';

const weekly = [4.2, 5.1, 3.8, 6.0, 5.5, 7.2, 4.8];
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function Running() {
  const navigate = useNavigate();
  const max = Math.max(...weekly);
  return (
    <div className="g-running">
      <button className="g-running-back" onClick={() => navigate('/')}>← Back</button>
      <div className="g-running-header">
        <h1>Running Dashboard</h1>
        <span>This week's activity</span>
      </div>
      <div className="g-run-cards">
        <div className="g-run-card g-run-primary">
          <span className="g-run-label">Total Distance</span>
          <strong className="g-run-big">36.6 km</strong>
          <span className="g-run-sub">+12% from last week</span>
        </div>
        <div className="g-run-card">
          <span className="g-run-label">Avg Pace</span>
          <strong>5:30</strong>
          <span className="g-run-sub">min/km</span>
        </div>
        <div className="g-run-card">
          <span className="g-run-label">Best Streak</span>
          <strong>30 days</strong>
          <span className="g-run-sub">personal record</span>
        </div>
      </div>
      <div className="g-run-chart">
        <h3>Weekly km</h3>
        <div className="g-bars">
          {weekly.map((v,i) => (
            <div key={i} className="g-bar-col">
              <div className="g-bar-track">
                <div className="g-bar-fill" style={{height:`${(v/max)*100}%`}} />
              </div>
              <span className="g-bar-val">{v}</span>
              <span className="g-bar-day">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="g-run-recent">
        <h3>Recent Runs</h3>
        <div className="g-run-item"><span>🏃</span><div><strong>Morning Jog</strong><span>5.1 km · 28 min</span></div><span className="g-run-date">Today</span></div>
        <div className="g-run-item"><span>🏃</span><div><strong>Tempo Run</strong><span>7.2 km · 38 min</span></div><span className="g-run-date">Yesterday</span></div>
        <div className="g-run-item"><span>🏃</span><div><strong>Recovery Run</strong><span>3.8 km · 22 min</span></div><span className="g-run-date">2 days ago</span></div>
      </div>
    </div>
  );
}
