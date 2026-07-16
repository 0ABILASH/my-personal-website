import React from 'react';
import Hero from '../components/Hero/Hero';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <Hero />
      <section className="featured-section">
        <h2>Here's What I've Been Up To</h2>
        <p>I've been working on some fun projects lately. Want to take a peek?</p>
        <a href="/projects" className="view-all">Explore My Projects →</a>
      </section>
    </div>
  );
}

export default Home;
