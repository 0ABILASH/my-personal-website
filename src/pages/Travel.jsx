import { useNavigate } from 'react-router-dom';
import '../App.css';

const destinations = [
  { city:'Tokyo', country:'Japan', emoji:'🗼', visited:'Mar 2024', color:'#ef4444' },
  { city:'Paris', country:'France', emoji:'🗼', visited:'Jun 2024', color:'#3b82f6' },
  { city:'New York', country:'USA', emoji:'🗽', visited:'Sep 2024', color:'#22c55e' },
  { city:'Reykjavik', country:'Iceland', emoji:'🌋', visited:'Jan 2025', color:'#8b5cf6' },
  { city:'Bali', country:'Indonesia', emoji:'🌴', visited:'Apr 2025', color:'#f97316' },
  { city:'Kyoto', country:'Japan', emoji:'⛩️', visited:'Jun 2025', color:'#e11d48' },
];

export default function Travel() {
  const navigate = useNavigate();
  return (
    <div className="g-travel">
      <button className="g-travel-back" onClick={() => navigate('/')}>← Back</button>
      <div className="g-travel-header">
        <h1>Travel Log</h1>
        <span>{destinations.length} countries explored</span>
      </div>
      <div className="g-map-dots">
        <div className="g-map-line" />
        {destinations.map((d,i) => (
          <div key={i} className="g-map-pin" style={{background:d.color,left:`${10+i*15}%`}}>
            <span className="g-map-pulse" style={{borderColor:d.color}} />
            <span className="g-map-label">{d.city}</span>
          </div>
        ))}
      </div>
      <div className="g-dest-grid">
        {destinations.map((d,i) => (
          <div key={i} className="g-dest-card">
            <div className="g-dest-icon" style={{background:d.color+'20',color:d.color}}><span>{d.emoji}</span></div>
            <div className="g-dest-info">
              <strong>{d.city}</strong>
              <span>{d.country} · {d.visited}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="g-travel-footer">
        <div><strong>6</strong><span>Countries</span></div>
        <div><strong>15</strong><span>Cities</span></div>
        <div><strong>42</strong><span>Days abroad</span></div>
      </div>
    </div>
  );
}
