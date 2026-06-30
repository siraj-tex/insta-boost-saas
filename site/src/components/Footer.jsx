import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-logo">📸</div>
            <span className="brand-name">InstaBoost</span>
          </div>
          <p className="footer-desc">
            India's most trusted Instagram growth service. Real followers, views & likes delivered fast and safely.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            {['📘','🐦','📸','▶️'].map((icon, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0, 0, 0, 0.03)', border: '1px solid rgba(0, 0, 0, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>{icon}</div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="footer-heading">Services</h4>
          <ul className="footer-links">
            <li><Link to="/services?type=followers">Instagram Followers</Link></li>
            <li><Link to="/services?type=views">Instagram Views</Link></li>
            <li><Link to="/services?type=likes">Instagram Likes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-links">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Affiliate</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-links">
            <li><a href="/#faq">FAQ</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Refund Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2025 InstaBoost. All rights reserved.</span>
        <span>🔒 Secured by Razorpay | 🇮🇳 Made in India</span>
      </div>
    </footer>
  );
}
