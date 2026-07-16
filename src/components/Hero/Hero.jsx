import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="wave">👋</span>
        <h1>Hi there! I'm <span className="highlight">Your Name</span></h1>
        <p className="hero-subtitle">
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
