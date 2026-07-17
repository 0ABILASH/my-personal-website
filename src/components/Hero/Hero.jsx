import { Link } from 'react-router-dom';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import './Hero.css';

const texts = ['a developer', 'a creator', 'a problem solver', 'a coffee lover ☕'];

function Hero() {
  const typedText = useTypingEffect(texts, 100, 50, 2000);

  return (
    <section className="hero">
      <div className="hero-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="hero-content">
        <span className="wave">👋</span>
        <h1>Hi there! I'm <span className="highlight">Your Name</span></h1>
        <p className="hero-subtitle">
          I'm <span className="typed-text">{typedText}</span>
          <span className="cursor">|</span>
        </p>
        <p className="hero-description">
          I love building things for the web and turning ideas into reality. 
          Nice to meet you!
        </p>
        <div className="hero-buttons">
          <Link to="/projects" className="btn btn-primary">See What I've Built</Link>
          <Link to="/contact" className="btn btn-secondary">Let's Chat!</Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
