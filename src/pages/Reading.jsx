import { useNavigate } from 'react-router-dom';
import '../App.css';

const books = [
  { title:'The Dark Valley', author:'Sarah Chen', pages:340, read:340, color:'#ef4444', genre:'Sci-Fi' },
  { title:'Code Complete', author:'Steve McConnell', pages:520, read:410, color:'#3b82f6', genre:'Tech' },
  { title:'The Garden', author:'Ruth Ozeki', pages:280, read:120, color:'#22c55e', genre:'Fiction' },
  { title:'Atomic Habits', author:'James Clear', pages:320, read:320, color:'#f97316', genre:'Self-Help' },
];

export default function Reading() {
  const navigate = useNavigate();
  const totalPages = books.reduce((a,b)=>a+b.pages,0);
  const readPages = books.reduce((a,b)=>a+b.read,0);
  return (
    <div className="g-reading">
      <button className="g-reading-back" onClick={() => navigate('/')}>← Back</button>
      <div className="g-reading-header">
        <h1>My Library</h1>
        <p>Sci-fi novels and tech blogs fill my evenings.</p>
      </div>
      <div className="g-reading-shelf">
        {books.map((b,i) => (
          <div key={i} className="g-book">
            <div className="g-book-spine" style={{background:b.color}}>
              <span className="g-book-spine-title">{b.title}</span>
            </div>
            <div className="g-book-cover" style={{background:b.color}}>
              <span className="g-book-genre">{b.genre}</span>
              <h3>{b.title}</h3>
              <span className="g-book-author">{b.author}</span>
            </div>
            <div className="g-book-progress">
              <div className="g-book-bar"><div className="g-book-fill" style={{width:`${(b.read/b.pages)*100}%`,background:b.color}} /></div>
              <span>{b.read}/{b.pages} pages</span>
            </div>
          </div>
        ))}
      </div>
      <div className="g-reading-summary">
        <div className="g-reading-ring">
          <svg viewBox="0 0 36 36">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray={`${(readPages/totalPages)*100}, 100`} />
          </svg>
          <span className="g-ring-val">{Math.round((readPages/totalPages)*100)}%</span>
        </div>
        <div className="g-reading-info">
          <strong>{readPages} pages read</strong>
          <span>{books.filter(b=>b.read===b.pages).length} of {books.length} completed</span>
        </div>
      </div>
    </div>
  );
}
