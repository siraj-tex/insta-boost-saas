import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const API = 'http://localhost:3000/api';

const getAuth = () => {
  const token = localStorage.getItem('adminAuth') || '';
  const [u, p] = atob(token).split(':');
  return { username: u, password: p };
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const auth = getAuth();
    axios.get(`${API}/admin/stats`, { headers: auth })
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon: '📦', label: 'Total Orders', value: stats.totalOrders, color: '#833AB4' },
    { icon: '💰', label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, color: '#E1306C' },
    { icon: '⏳', label: 'Pending', value: stats.pendingOrders, color: '#fbbf24' },
    { icon: '⚙️', label: 'Processing', value: stats.processingOrders, color: '#60a5fa' },
    { icon: '✅', label: 'Completed', value: stats.completedOrders, color: '#34d399' },
    { icon: '❌', label: 'Cancelled', value: stats.cancelledOrders, color: '#f87171' },
    { icon: '📅', label: 'Today\'s Orders', value: stats.todayOrders, color: '#f77737' },
  ] : [];

  return (
    <div className="admin-layout">
      <Sidebar pendingCount={stats?.pendingOrders || 0} />
      <div className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-title">📊 Dashboard</div>
          <div className="topbar-right">
            <span className="topbar-time">{time.toLocaleTimeString('en-IN')}</span>
            <div className="topbar-status">API Connected</div>
          </div>
        </div>

        <div className="admin-content">
          {/* Welcome */}
          <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'linear-gradient(135deg, rgba(131,58,180,0.12) 0%, rgba(225,48,108,0.08) 100%)', border: '1px solid rgba(131,58,180,0.2)', borderRadius: 16 }}>
            <div style={{ fontFamily: 'var(--font)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              👋 Welcome back, Admin!
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-sec)' }}>
              Here's your InstaBoost overview. {stats?.pendingOrders > 0 ? `You have ${stats.pendingOrders} pending orders waiting for action.` : 'All orders are up to date.'}
            </div>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <div className="spin" style={{ width: 40, height: 40, borderWidth: 3, margin: '0 auto 1rem' }} />
              Loading stats...
            </div>
          ) : (
            <div className="stats-grid">
              {statCards.map((card, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-icon">{card.icon}</div>
                  <div className="stat-value" style={{ background: card.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {card.value}
                  </div>
                  <div className="stat-label">{card.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Revenue by type */}
          {stats?.revenueByType?.length > 0 && (
            <div className="table-card" style={{ marginTop: '1.5rem' }}>
              <div className="table-header">
                <div className="table-title">📈 Revenue by Service Type</div>
              </div>
              <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {stats.revenueByType.map((r, i) => (
                  <div key={i} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font)', marginBottom: '0.25rem' }}>
                      ₹{r.total.toLocaleString('en-IN')}
                    </div>
                    <div className={`badge badge-${r._id}`} style={{ margin: '0 auto 0.4rem', display: 'inline-flex' }}>
                      {r._id === 'followers' ? '👥' : r._id === 'views' ? '👁️' : '❤️'} {r._id}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.count} orders</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { icon: '📦', title: 'Manage Orders', desc: 'View and update all customer orders', link: '/orders', color: '#833AB4' },
              { icon: '⏳', title: 'Pending Orders', desc: `${stats?.pendingOrders || 0} orders need attention`, link: '/orders?status=pending', color: '#fbbf24' },
            ].map((card, i) => (
              <a key={i} href={card.link} className="stat-card" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{card.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{card.title}</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-sec)' }}>{card.desc}</div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: card.color }}>Go →</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
