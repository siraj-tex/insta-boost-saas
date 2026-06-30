import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

const API = 'http://localhost:3000/api';

const getAuth = () => {
  const token = localStorage.getItem('adminAuth') || '';
  try { const [u, p] = atob(token).split(':'); return { username: u, password: p }; }
  catch { return { username: '', password: '' }; }
};

const statusBadge = {
  pending: 'badge-pending',
  processing: 'badge-processing',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};
const statusIcon = { pending: '⏳', processing: '⚙️', completed: '✅', cancelled: '❌' };

const typeBadge = { followers: 'badge-followers', views: 'badge-views', likes: 'badge-likes' };
const typeIcon = { followers: '👥', views: '👁️', likes: '❤️' };

const formatDate = d => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [pendingCount, setPendingCount] = useState(0);

  const statusFilter = searchParams.get('status') || 'all';

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const auth = getAuth();
    try {
      const { data } = await axios.get(`${API}/admin/orders`, {
        headers: auth,
        params: { status: statusFilter, page, limit: 15, search: search || undefined },
      });
      setOrders(data.data);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Get pending count for sidebar badge
  useEffect(() => {
    const auth = getAuth();
    axios.get(`${API}/admin/stats`, { headers: auth })
      .then(r => setPendingCount(r.data.data.pendingOrders))
      .catch(() => {});
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    const auth = getAuth();
    try {
      await axios.patch(`${API}/admin/orders/${orderId}`, { orderStatus: newStatus }, { headers: auth });
      toast.success(`Order updated to "${newStatus}"`);
      fetchOrders();
    } catch {
      toast.error('Failed to update order');
    }
  };

  const filters = [
    { key: 'all', label: '🌟 All' },
    { key: 'pending', label: '⏳ Pending' },
    { key: 'processing', label: '⚙️ Processing' },
    { key: 'completed', label: '✅ Completed' },
    { key: 'cancelled', label: '❌ Cancelled' },
  ];

  return (
    <div className="admin-layout">
      <Sidebar pendingCount={pendingCount} />
      <div className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-title">📦 Orders Management</div>
          <div className="topbar-right">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{total} total orders</span>
          </div>
        </div>

        <div className="admin-content">
          <div className="table-card">
            <div className="table-header">
              <div className="table-title">All Orders</div>
              <div className="table-actions">
                {/* Search */}
                <div className="search-box">
                  <span>🔍</span>
                  <input
                    placeholder="Search name, email, handle..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                  />
                </div>

                {/* Status filter */}
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={e => { setSearchParams(e.target.value === 'all' ? {} : { status: e.target.value }); setPage(1); }}
                >
                  {filters.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
                </select>

                <button className="btn btn-outline btn-sm" onClick={fetchOrders}>🔄 Refresh</button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Instagram</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="loading-row">
                      <td colSpan={8}>
                        <div className="spin" style={{ width: 30, height: 30, margin: '0 auto 0.75rem', borderWidth: 2 }} />
                        <div>Loading orders...</div>
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr className="loading-row">
                      <td colSpan={8}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                        No orders found
                      </td>
                    </tr>
                  ) : orders.map(order => (
                    <tr key={order._id}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#a78bfa' }}>
                          {order.orderId}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                      </td>
                      <td>
                        <span className="ig-handle">{order.instagramHandle}</span>
                        {order.postUrl && (
                          <a href={order.postUrl} target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: '0.75rem', color: '#60a5fa', marginTop: '0.2rem' }}>
                            View Post ↗
                          </a>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.25rem' }}>
                          {order.serviceSnapshot?.quantity?.toLocaleString('en-IN')}
                        </div>
                        <span className={`badge ${typeBadge[order.serviceSnapshot?.type] || ''}`}>
                          {typeIcon[order.serviceSnapshot?.type]} {order.serviceSnapshot?.type}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>₹{order.amount}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-sec)' }}>
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${statusBadge[order.orderStatus] || ''}`}>
                          {statusIcon[order.orderStatus]} {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="action-select"
                          value={order.orderStatus}
                          onChange={e => updateStatus(order._id, e.target.value)}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="processing">⚙️ Processing</option>
                          <option value="completed">✅ Completed</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>‹</button>
                {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="page-btn" onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages}>›</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
