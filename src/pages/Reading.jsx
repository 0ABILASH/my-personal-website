import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css';

const books = [
  { title:'The Dark Valley', author:'Sarah Chen', pages:340, read:340, color:'#ffffff', genre:'Sci-Fi' },
  { title:'Code Complete', author:'Steve McConnell', pages:520, read:410, color:'#cccccc', genre:'Tech' },
  { title:'The Garden', author:'Ruth Ozeki', pages:280, read:120, color:'#999999', genre:'Fiction' },
  { title:'Atomic Habits', author:'James Clear', pages:320, read:320, color:'#e0e0e0', genre:'Self-Help' },
];

const stats = [
  { label:'Books Read', value:'24', bar:60 },
  { label:'Pages Read', value:'1460', bar:70 },
  { label:'Completion', value:'73%', bar:73 },
];

export default function Reading() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="cy-wrap">
      <nav className="cy-nav">
        <button className="cy-nav-back" onClick={() => navigate('/')}>← Back</button>
        <span className="cy-nav-tag">Reading</span>
      </nav>

      <div className={`cy-hero ${ready?'cy-show':''}`}>
        <div className="cy-scanlines" />
        <div className="cy-hero-inner">
          <div className="cy-hero-left">
            <span className="cy-tag">HOBBY</span>
            <h1 className="cy-hero-title">Reading</h1>
            <p className="cy-hero-desc">Sci-fi novels and tech blogs fill my evenings.</p>
          </div>
          <div className="cy-hero-right">
            <div className="cy-hero-icon-box">
              <span className="cy-hero-emoji">📚</span>
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

      <div className={`cy-panel ${ready?'cy-show':''}`} style={{width:'100%',margin:'1.5rem 0 0',padding:0}}>
        <div className="cy-panel-header">
          <h2>Currently Reading</h2>
          <span className="cy-panel-count">{books.length} books</span>
        </div>
        <div className="cy-book-list">
          {books.map((b,i) => (
            <div key={i} className="cy-book-card">
              <div className="cy-book-accent" style={{background: b.color}} />
              <div className="cy-book-left">
                <span className="cy-book-dot" style={{background: b.color}} />
              </div>
              <div className="cy-book-body">
                <div className="cy-book-row">
                  <h3>{b.title}</h3>
                  <span className="cy-book-genre" style={{color: b.color, background: b.color+'14'}}>{b.genre}</span>
                </div>
                <p>{b.author}</p>
                <div className="cy-book-progress">
                  <div className="cy-book-bar">
                    <div className="cy-book-fill" style={{width: `${(b.read/b.pages)*100}%`, background: b.color}} />
                  </div>
                  <span className="cy-book-pct">{Math.round((b.read/b.pages)*100)}%</span>
                </div>
              </div>
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
