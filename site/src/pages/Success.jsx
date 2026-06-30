import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:3000/api';

const statusConfig = {
  pending: { label: 'Pending', emoji: '⏳', color: '#fbbf24' },
  processing: { label: 'Processing', emoji: '⚙️', color: '#60a5fa' },
  completed: { label: 'Completed', emoji: '✅', color: '#34d399' },
  cancelled: { label: 'Cancelled', emoji: '❌', color: '#f87171' }
};

export default function Success() {
  const { state } = useLocation();
  const initialOrder = state?.order;
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    if (initialOrder?.orderId) {
      axios.get(`${API}/orders/${initialOrder.orderId}`)
        .then(r => {
          if (r.data.success && r.data.data) {
            setOrder(r.data.data);
          }
        })
        .catch(err => console.error('Failed to fetch live order status:', err));
    }
  }, [initialOrder?.orderId]);

  if (!order) {
    return (
      <main className="success-page">
        <div className="success-card">
          <div className="success-icon">⚠️</div>
          <h1 className="success-title">No Order Found</h1>
          <p className="success-desc">Please place an order first.</p>
          <Link to="/services" className="btn-primary">Browse Packages</Link>
        </div>
      </main>
    );
  }

  const currentStatus = statusConfig[order.orderStatus] || { label: 'Processing', emoji: '⏳', color: '#fbbf24' };

  return (
    <main className="success-page">
      <div className="success-card">
        <div style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>🎉</div>
        <div className="success-icon">✅</div>
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-desc">
          Your order has been confirmed and processing has started. 
          You'll receive {order.serviceSnapshot?.quantity?.toLocaleString('en-IN')} {order.serviceSnapshot?.type} soon!
        </p>

        <div className="success-order-id">
          Order ID: {order.orderId}
        </div>

        <div className="success-details">
          <div className="success-detail-row">
            <span className="success-detail-label">Package</span>
            <span className="success-detail-value">{order.serviceSnapshot?.name}</span>
          </div>
          <div className="success-detail-row">
            <span className="success-detail-label">Instagram Handle</span>
            <span className="success-detail-value">{order.instagramHandle}</span>
          </div>
          <div className="success-detail-row">
            <span className="success-detail-label">Amount Paid</span>
            <span className="success-detail-value" style={{ color: '#34d399' }}>₹{order.amount}</span>
          </div>
          <div className="success-detail-row">
            <span className="success-detail-label">Status</span>
            <span className="success-detail-value" style={{ color: currentStatus.color, fontWeight: 600 }}>
              {currentStatus.emoji} {currentStatus.label}
            </span>
          </div>
          <div className="success-detail-row">
            <span className="success-detail-label">Email</span>
            <span className="success-detail-value">{order.customerEmail}</span>
          </div>
        </div>

        <div style={{ padding: '1rem', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 12, marginBottom: '2rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          📧 A confirmation has been recorded for <strong>{order.customerEmail}</strong>. 
          Your order will be delivered within the promised timeframe. 
          If you need help, contact our support team.
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to={`/track?id=${order.orderId}`} className="btn-primary" style={{ background: 'var(--grad-purple)', boxShadow: 'var(--shadow-btn)' }}>Track Live Status 🔍</Link>
          <Link to="/services" className="btn-primary">Order More 🚀</Link>
          <Link to="/" className="btn-secondary">← Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
