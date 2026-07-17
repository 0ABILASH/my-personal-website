import { useNavigate } from 'react-router-dom';
import '../App.css';

const shots = [
  { src:'https://picsum.photos/seed/polaroid1/400/500', caption:'Morning light', rotate:-3 },
  { src:'https://picsum.photos/seed/polaroid2/400/500', caption:'City reflections', rotate:2 },
  { src:'https://picsum.photos/seed/polaroid3/400/500', caption:'Street portrait', rotate:-1 },
  { src:'https://picsum.photos/seed/polaroid4/400/500', caption:'Golden hour', rotate:4 },
  { src:'https://picsum.photos/seed/polaroid5/400/500', caption:'Rainy window', rotate:-2 },
  { src:'https://picsum.photos/seed/polaroid6/400/500', caption:'Night neon', rotate:1 },
];

export default function Photography() {
  const navigate = useNavigate();
  return (
    <div className="g-photo">
      <button className="g-photo-back" onClick={() => navigate('/')}>← Back</button>
      <div className="g-photo-header">
        <h1>Photography</h1>
        <p>Capturing moments, light, and everyday beauty.</p>
      </div>
      <div className="g-photo-board">
        {shots.map((s,i) => (
          <div key={i} className="g-polaroid" style={{transform:`rotate(${s.rotate}deg)`}}>
            <img src={s.src} alt="" />
            <span>{s.caption}</span>
          </div>
        ))}
      </div>
      <div className="g-photo-stats">
        <div><strong>500+</strong><span>Photos taken</span></div>
        <div><strong>12</strong><span>Collections</span></div>
        <div><strong>3</strong><span>Cameras owned</span></div>
      </div>
    </div>
  );
}
