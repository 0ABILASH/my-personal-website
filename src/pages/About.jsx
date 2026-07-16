import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about">
      <section className="about-header">
        <h1>A Little Bit About Me</h1>
        <p>I'd love to tell you my story!</p>
      </section>
      
      <section className="about-content">
        <div className="about-text">
          <h2>Hey there! 👋</h2>
          <p>
            I'm so glad you're here! I'm a developer who's genuinely passionate 
            about creating things that live on the internet. There's something 
            magical about writing code and watching it come to life in the browser.
          </p>
          <p>
            When I'm not lost in code, you'll probably find me exploring new 
            tech, binge-watching tutorials, or enjoying a cozy cup of coffee ☕. 
            I believe in learning something new every day and sharing what I know 
            along the way.
          </p>
          <p>
            I'm always excited to connect with fellow developers, designers, and 
            anyone who's curious about technology. Don't be shy — I love a good 
            conversation!
          </p>
        </div>
        
        <div className="skills">
          <h2>My Toolkit 🛠️</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Frontend</h3>
              <ul>
                <li>React</li>
                <li>JavaScript</li>
                <li>HTML/CSS</li>
                <li>Tailwind</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Backend</h3>
              <ul>
                <li>Node.js</li>
                <li>Python</li>
                <li>Databases</li>
                <li>APIs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
