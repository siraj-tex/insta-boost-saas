import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';

const API = 'http://localhost:3000/api';

const faqs = [
  { q: 'Is it safe for my Instagram account?', a: 'Yes! We use safe, organic-looking delivery methods that comply with Instagram guidelines. We never ask for your password.' },
  { q: 'How fast will I receive my order?', a: 'Most orders start within minutes. Delivery time depends on your package — from 1 hour to a few days for larger packages.' },
  { q: 'Are the followers/views real?', a: 'We deliver from high-quality, real-looking profiles. They appear genuine and maintain good retention rates.' },
  { q: 'What if I don\'t receive my order?', a: 'We offer a full guarantee. If delivery fails, we\'ll redeliver or issue a complete refund.' },
  { q: 'Can I order multiple times?', a: 'Absolutely! Many customers place multiple orders. We recommend spacing them out for natural growth.' },
  { q: 'Do I need to share my password?', a: 'Never! We only need your Instagram username (handle). Your account stays 100% secure.' },
];

export default function Home() {
  const [popularServices, setPopularServices] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [counter, setCounter] = useState({ orders: 0, customers: 0, delivered: 0 });

  useEffect(() => {
    axios.get(`${API}/services`).then(r => {
      setPopularServices(r.data.data.filter(s => s.popular).slice(0, 3));
    }).catch(() => {});

    // Animate counters
    const targets = { orders: 50000, customers: 12000, delivered: 200000000 };
    const duration = 2000;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounter({
        orders: Math.round(targets.orders * progress),
        customers: Math.round(targets.customers * progress),
        delivered: Math.round(targets.delivered * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
        </div>
        <div className="hero-content">
          <div>
            <div className="hero-badge">
              <span>🟢</span> Live — 500+ orders today
            </div>
            <h1 className="hero-title">
              Grow Your Instagram
              <span className="gradient-text">Instantly & Safely</span>
            </h1>
            <p className="hero-desc">
              India's #1 trusted platform for real Instagram followers, views & likes. 
              Instant delivery, guaranteed results, 100% safe — no password required.
            </p>
            <div className="hero-actions">
              <Link to="/services" className="btn-primary">🚀 Buy Followers</Link>
              <Link to="/services?type=views" className="btn-secondary">👁️ Buy Views</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">{counter.orders.toLocaleString('en-IN')}+</div>
                <div className="hero-stat-label">Orders Completed</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">{counter.customers.toLocaleString('en-IN')}+</div>
                <div className="hero-stat-label">Happy Customers</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">{(counter.delivered / 1000000).toFixed(0)}M+</div>
                <div className="hero-stat-label">Followers Delivered</div>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="hero-visual">
            <div className="hero-phone">
              <div className="phone-header">
                <span className="phone-ig-logo">📸</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>9:41</span>
              </div>
              <div className="phone-profile">
                <div className="phone-avatar">👤</div>
                <div>
                  <div className="phone-username">@creator_india</div>
                  <div className="phone-handle" style={{ color: '#34d399' }}>+10K followers today 🎉</div>
                </div>
              </div>
              <div className="phone-img">🌟</div>
              <div className="phone-actions">
                <span>❤️</span><span>💬</span><span>📤</span>
              </div>
              <div className="phone-counter">24,891 likes · 1,240 comments</div>
            </div>
            <div className="phone-floating-badge badge-1">
              <span className="badge-icon">📈</span> +1,000 Followers Added!
            </div>
            <div className="phone-floating-badge badge-2">
              <span className="badge-icon">⚡</span> Instant Delivery
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="trust-section">
        <div className="trust-row">
          {[
            { icon: '🔒', text: 'No Password Required' },
            { icon: '⚡', text: 'Instant Delivery' },
            { icon: '💰', text: 'Razorpay Secured' },
            { icon: '🛡️', text: '30-Day Guarantee' },
            { icon: '🇮🇳', text: 'Made in India' },
            { icon: '📞', text: '24/7 Support' },
          ].map((item, i) => (
            <div className="trust-item" key={i}>
              <span className="trust-icon">{item.icon}</span>
              <span className="trust-text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── POPULAR PACKAGES ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">🔥 Best Sellers</div>
            <h2 className="section-title">Most Popular Packages</h2>
            <p className="section-desc">Chosen by thousands of creators, brands, and businesses across India</p>
          </div>
          <div className="services-grid" style={{ maxWidth: 900, margin: '0 auto' }}>
            {popularServices.length > 0
              ? popularServices.map(s => <ServiceCard key={s._id} service={s} />)
              : [1,2,3].map(i => (
                  <div key={i} className="service-card" style={{ animation: 'pulse 1.5s infinite' }}>
                    <div style={{ height: 200, background: 'rgba(0, 0, 0, 0.03)', borderRadius: 12 }} />
                  </div>
                ))
            }
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/services" className="btn-primary">View All Packages →</Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge">✨ Why Choose Us</div>
            <h2 className="section-title">Why 12,000+ Customers Trust InstaBoost</h2>
          </div>
          <div className="features-grid">
            {[
              { icon: '🔐', cls: 'purple', title: '100% Safe & Secure', desc: 'We never ask for your password. All orders use only your public Instagram handle.' },
              { icon: '⚡', cls: 'pink', title: 'Instant Delivery', desc: 'Most orders start within minutes of payment. See real results immediately.' },
              { icon: '📈', cls: 'orange', title: 'High Retention Rate', desc: 'Our followers and views stick around — no sudden drops after delivery.' },
              { icon: '💰', cls: 'green', title: 'Best Price Guarantee', desc: 'Get premium quality at the lowest prices. No hidden charges, ever.' },
              { icon: '🎯', cls: 'purple', title: 'Real-Looking Profiles', desc: 'We deliver from quality profiles that look authentic and organic.' },
              { icon: '🛡️', cls: 'pink', title: '30-Day Guarantee', desc: 'Not satisfied? We\'ll redeliver or give you a full refund, no questions asked.' },
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className={`feature-icon ${f.cls}`}>{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section how-it-works-bg" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">🚀 Simple Process</div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-desc">Get followers, views or likes in just 3 simple steps</p>
          </div>
          <div className="steps-grid">
            {[
              { num: '1', icon: '📦', title: 'Choose a Package', desc: 'Browse our packages and select the one that fits your needs and budget.' },
              { num: '2', icon: '📝', title: 'Enter Your Details', desc: 'Provide your Instagram handle and post URL (for views/likes). No password needed!' },
              { num: '3', icon: '💳', title: 'Make Payment', desc: 'Pay securely through Razorpay — UPI, cards, net banking all accepted.' },
              { num: '4', icon: '🎉', title: 'Watch It Grow!', desc: 'Sit back and watch your followers/views pour in. Instant or gradual delivery.' },
            ].map((step, i) => (
              <div className="step-card" key={i}>
                <div className="step-number">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <div className="step-title">{step.title}</div>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section testimonials-bg">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">💬 Reviews</div>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div className="testimonials-grid">
            {[
              { name: 'Priya Sharma', handle: '@priya_creates', text: 'Got 1000 followers in just 6 hours! My engagement went through the roof. Totally worth the money. InstaBoost is 100% legit!', stars: 5, init: 'P', color: '#833AB4' },
              { name: 'Rahul Verma', handle: '@rahul_fitness', text: 'My fitness page needed a boost. Ordered 5000 followers and the delivery was gradual and natural-looking. Amazing service!', stars: 5, init: 'R', color: '#E1306C' },
              { name: 'Sneha Patel', handle: '@sneha_food', text: 'Used their views package for my food reels. Got 10,000 views in 12 hours. My organic reach also improved. Highly recommended!', stars: 5, init: 'S', color: '#F77737' },
              { name: 'Amit Singh', handle: '@amit_travels', text: 'Been ordering from InstaBoost for 6 months now. Consistent quality, fast delivery, and great customer support. Best platform!', stars: 5, init: 'A', color: '#a78bfa' },
              { name: 'Kavya Nair', handle: '@kavya_beauty', text: 'The likes package is incredible! My posts are getting more organic engagement now because of better social proof. Thank you!', stars: 5, init: 'K', color: '#34d399' },
              { name: 'Rohan Gupta', handle: '@rohan_tech', text: 'Super easy process — chose a package, paid through UPI, and followers started coming in within an hour. No complaints at all!', stars: 5, init: 'R', color: '#fbbf24' },
            ].map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.color }}>{t.init}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-handle">{t.handle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.08) 0%, rgba(0, 180, 216, 0.03) 100%)', borderTop: '1px solid rgba(0, 0, 0, 0.05)', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <div className="container">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
          <h2 className="section-title">Ready to Go Viral?</h2>
          <p className="section-desc" style={{ maxWidth: 500, margin: '0 auto 2rem' }}>
            Join 12,000+ happy customers. Start growing your Instagram today with InstaBoost.
          </p>
          <Link to="/services" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}>
            Start Growing Now 🔥
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">❓ FAQ</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span className="faq-icon">+</span>
                </button>
                {openFaq === i && <div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
