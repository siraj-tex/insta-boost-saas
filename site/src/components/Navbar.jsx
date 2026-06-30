import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-brand">
        <div className="brand-logo">📸</div>
        <span className="brand-name">InstaBoost</span>
      </Link>

      <ul className="navbar-links" style={menuOpen ? { display: 'flex', flexDirection: 'column', position: 'fixed', top: '70px', left: 0, right: 0, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(0, 0, 0, 0.05)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' } : {}}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/track">Track Order</Link></li>
        <li><a href="/#how-it-works">How It Works</a></li>
        <li><a href="/#faq">FAQ</a></li>
      </ul>

      <Link to="/services" className="navbar-cta">Buy Now 🚀</Link>

      <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>
    </nav>
  );
}
