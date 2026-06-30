import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';

const API = 'http://localhost:3000/api';

const tabs = [
  { key: 'all', label: '🌟 All Services' },
  { key: 'followers', label: '👥 Followers' },
  { key: 'views', label: '👁️ Views' },
  { key: 'likes', label: '❤️ Likes' },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('type') || 'all';

  useEffect(() => {
    setLoading(true);
    const params = activeTab !== 'all' ? { type: activeTab } : {};
    axios.get(`${API}/services`, { params })
      .then(r => setServices(r.data.data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <main style={{ minHeight: '100vh', paddingTop: '5rem' }}>
      <div style={{ background: 'radial-gradient(ellipse at top, rgba(0, 113, 227, 0.1) 0%, transparent 60%)', padding: '4rem 2rem 2rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <div className="section-badge">📦 All Packages</div>
            <h1 className="section-title">Choose Your Package</h1>
            <p className="section-desc">Affordable plans for every creator. Instant delivery, guaranteed results.</p>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setSearchParams(tab.key === 'all' ? {} : { type: tab.key })}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <div className="loading-text">Loading packages...</div>
            </div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              No services found.
            </div>
          ) : (
            <div className="services-grid">
              {services.map(s => <ServiceCard key={s._id} service={s} />)}
            </div>
          )}
        </div>
      </div>

      {/* Bottom info */}
      <div style={{ background: 'var(--bg-secondary)', padding: '3rem 2rem', marginTop: '4rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { icon: '🔒', title: 'Safe & Secure', desc: 'No password required. 100% account safe.' },
              { icon: '⚡', title: 'Fast Delivery', desc: 'Orders start within minutes of payment.' },
              { icon: '💳', title: 'Easy Payment', desc: 'UPI, Cards, Net Banking via Razorpay.' },
              { icon: '🛡️', title: '30-Day Guarantee', desc: 'Full refund if order not delivered.' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
