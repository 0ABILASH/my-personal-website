import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css';

const books = [
  { title:'The Dark Valley', author:'Sarah Chen', pages:340, read:340, color:'#ef4444', genre:'Sci-Fi' },
  { title:'Code Complete', author:'Steve McConnell', pages:520, read:410, color:'#3b82f6', genre:'Tech' },
  { title:'The Garden', author:'Ruth Ozeki', pages:280, read:120, color:'#22c55e', genre:'Fiction' },
  { title:'Atomic Habits', author:'James Clear', pages:320, read:320, color:'#f97316', genre:'Self-Help' },
];

export default function Reading() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);
  const totalPages = books.reduce((a,b)=>a+b.pages,0);
  const readPages = books.reduce((a,b)=>a+b.read,0);
  const pct = Math.round((readPages/totalPages)*100);
  return (
    <div className="hp-wrap">
      <nav className="hp-nav"><button onClick={() => navigate('/')}>← Back</button><span>Reading</span></nav>
      <div className={`hp-hero hp-hero-reading ${ready?'hp-show':''}`}>
        <div className="hp-hero-content">
          <span className="hp-badge hp-badge-reading">Hobby</span>
          <h1>Reading</h1>
          <p>Sci-fi novels and tech blogs fill my evenings.</p>
        </div>
        <div className="hp-hero-icon">📚</div>
      </div>
      <div className="hp-body">
        <div className={`hp-stats hp-stagger ${ready?'hp-show':''}`}>
          <div className="hp-stat"><span className="hp-stat-num hp-color-reading">24</span><span className="hp-stat-label">Books Read</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-reading">{readPages}</span><span className="hp-stat-label">Pages Read</span></div>
          <div className="hp-stat"><span className="hp-stat-num hp-color-reading">{pct}%</span><span className="hp-stat-label">Completion</span></div>
        </div>
        <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
          <h2>Currently Reading</h2>
          {books.map((b,i) => (
            <div key={i} className="hp-list-item">
              <div className="hp-book-dot" style={{background:b.color}} />
              <div className="hp-list-info">
                <strong>{b.title}</strong>
                <span>{b.author} · {b.genre}</span>
              </div>
              <div className="hp-mini-bar"><div className="hp-mini-fill" style={{width:`${(b.read/b.pages)*100}%`,background:b.color}} /></div>
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
