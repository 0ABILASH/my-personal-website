import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">👋 Hey!</Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About Me</Link>
          <Link to="/projects" className="nav-link">My Work</Link>
          <Link to="/contact" className="nav-link">Say Hi!</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
