import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css';

const GAMES = {
  'the-witcher-3': {
    icon:'⚔️', name:'The Witcher 3', genre:'RPG',
    tagline:'An open-world masterpiece',
    desc:'The Witcher 3: Wild Hunt is a story-driven open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences. You play as Geralt of Rivia, a professional monster hunter, searching for your missing adoptive daughter in a world torn apart by war.',
    features:['Open world exploration','Deep narrative choices','Monster hunting combat','Meaningful side quests'],
    color:'#6366f1',
  },
  'elden-ring': {
    icon:'🗺️', name:'Elden Ring', genre:'Action RPG',
    tagline:'A vast open world to conquer',
    desc:'Elden Ring is an action RPG by FromSoftware and George R.R. Martin. It features a massive open world filled with challenging enemies, hidden dungeons, and deep lore. Every corner of the Lands Between rewards exploration and skill.',
    features:['Open world design','Challenging combat','Deep lore','Build variety'],
    color:'#ea580c',
  },
};

export default function GameDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const game = GAMES[slug];

  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);

  if (!game) {
    return (
      <div className="hp-wrap">
        <nav className="hp-nav"><button onClick={() => navigate('/hobby/gaming')}>← Back</button><span>Game Not Found</span></nav>
        <div className="hp-body" style={{textAlign:'center',padding:'4rem 2rem'}}>
          <p style={{color:'var(--text-dim)'}}>This game doesn't exist.</p>
          <Link to="/hobby/gaming" className="hp-back-btn" style={{display:'inline-block',marginTop:'1rem'}}>← Back to Gaming</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="hp-wrap">
      <nav className="hp-nav">
        <button onClick={() => navigate('/hobby/gaming')}>← Back</button>
        <span>{game.name}</span>
      </nav>

      <div className={`hp-hero hp-hero-gaming ${ready?'hp-show':''}`}>
        <div className="hp-hero-content">
          <span className="hp-badge hp-badge-gaming">Game</span>
          <h1>{game.name}</h1>
          <p>{game.tagline}</p>
        </div>
        <div className="hp-hero-icon" style={{fontSize:'3rem'}}>{game.icon}</div>
      </div>

      <div className="hp-body">
        <div className={`hp-section hp-stagger ${ready?'hp-show':''}`}>
          <div className="gdetail-panel">
            <p className="gdetail-desc">{game.desc}</p>
            <div className="gdetail-features">
              {game.features.map((f,i) => (
                <span key={i} className="gdetail-feature" style={{background:game.color+'14',color:game.color}}>{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hp-bottom">
        <button className="hp-back-btn" onClick={() => navigate('/hobby/gaming')}>← Back to Gaming</button>
      </div>
    </div>
  );
}
