import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css';

export default function Gaming() {
  const navigate = useNavigate();
  const [lines, setLines] = useState([]);
  const bootLines = [
    '> SYSTEM BOOT...',
    '> LOADING KERNEL ████████████ OK',
    '> GPU: NVIDIA RTX 4090 DETECTED',
    '> RAM: 32GB DDR5 ALLOCATED',
    '> DISPLAY: 4K 144Hz READY',
    '> CONTROLLER: CONNECTED',
    '> READY TO PLAY.',
  ];
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < bootLines.length) {
        setLines(prev => [...prev, bootLines[i]]);
        i++;
      } else clearInterval(timer);
    }, 400);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="g-terminal">
      <div className="g-scanlines" />
      <button className="g-back" onClick={() => navigate('/')}>← EXIT</button>
      <div className="g-screen">
        <div className="g-header">
          <span className="g-dot g-red" /><span className="g-dot g-yellow" /><span className="g-dot g-green" />
          <span className="g-title">gaming.exe</span>
        </div>
        <div className="g-body">
          {lines.map((l,i) => <div key={i} className="g-line">{l}</div>)}
          <span className="g-cursor">█</span>
        </div>
        <div className="g-stats-row">
          <div className="g-stat-card"><span className="g-stat-val">🎮</span><span>2000+ hrs</span></div>
          <div className="g-stat-card"><span className="g-stat-val">🏆</span><span>50 wins</span></div>
          <div className="g-stat-card"><span className="g-stat-val">⭐</span><span>Lv.99</span></div>
        </div>
        <div className="g-games">
          <h3>Recent Activity</h3>
          <div className="g-game"><span className="g-game-icon">⚔️</span><div><strong>The Witcher 3</strong><span>RPG · 340h</span></div></div>
          <div className="g-game"><span className="g-game-icon">🧩</span><div><strong>Portal 2</strong><span>Puzzle · 28h</span></div></div>
          <div className="g-game"><span className="g-game-icon">🗺️</span><div><strong>Elden Ring</strong><span>Adventure · 120h</span></div></div>
        </div>
      </div>
    </div>
  );
}
