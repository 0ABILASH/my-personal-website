import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import './Header.css';

function Header({ isDark, toggleDark }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMenu}>👋 Hey!</Link>
        
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={closeMenu}>Home</Link>
          <Link to="/about" className={isActive('/about')} onClick={closeMenu}>About Me</Link>
          <Link to="/projects" className={isActive('/projects')} onClick={closeMenu}>My Work</Link>
          <Link to="/gallery" className={isActive('/gallery')} onClick={closeMenu}>Gallery</Link>
          <Link to="/games" className={isActive('/games')} onClick={closeMenu}>Games</Link>
          <Link to="/contact" className={isActive('/contact')} onClick={closeMenu}>Say Hi!</Link>
          <DarkModeToggle isDark={isDark} toggle={toggleDark} />
        </nav>
      </div>
    </header>
  );
}

export default Header;
