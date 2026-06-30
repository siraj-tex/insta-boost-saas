import { useNavigate, useLocation, Link } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/orders', icon: '📦', label: 'Orders' },
];

export default function Sidebar({ pendingCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">📸</div>
        <div>
          <div className="sidebar-brand">InstaBoost</div>
          <div className="sidebar-subtitle">Admin Panel</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.path === '/orders' && pendingCount > 0 && (
              <span className="nav-badge">{pendingCount}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">A</div>
          <div>
            <div className="sidebar-user-name">Admin</div>
            <div className="sidebar-user-role">Super Admin</div>
          </div>
          <button onClick={logout} title="Logout" style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem' }}>🚪</button>
        </div>
      </div>
    </aside>
  );
}
