import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:3000/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/admin/login`, form);
      localStorage.setItem('adminAuth', data.token);
      localStorage.setItem('adminUser', form.username);
      toast.success('Welcome back, Admin! 👋');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid credentials. Try admin / admin123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">📸</div>
          <h1 className="login-title">Admin Login</h1>
          <p className="login-sub">Sign in to access the InstaBoost admin panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              placeholder="admin"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>

          <button type="submit" className="btn btn-grad btn-full" disabled={loading} style={{ marginTop: '0.75rem', padding: '0.95rem' }}>
            {loading ? <><span className="spin" /> Signing in...</> : '🔐 Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(131,58,180,0.08)', border: '1px solid rgba(131,58,180,0.2)', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-sec)', textAlign: 'center' }}>
          Default credentials: <strong>admin</strong> / <strong>admin123</strong>
        </div>
      </div>
    </main>
  );
}
