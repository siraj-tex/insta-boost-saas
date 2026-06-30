import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:3000/api';

const statusConfig = {
  pending: { label: 'Pending', emoji: '⏳', color: '#fbbf24', desc: 'We have received your payment and are setting up your delivery.' },
  processing: { label: 'Processing', emoji: '⚙️', color: '#60a5fa', desc: 'Our systems are actively sending the requested interactions to your account.' },
  completed: { label: 'Completed', emoji: '✅', color: '#34d399', desc: 'Your order has been fully completed! Thank you for boosting with us!' },
  cancelled: { label: 'Cancelled', emoji: '❌', color: '#f87171', desc: 'Your order was cancelled. Please contact support if you need a refund.' }
};

const typeIcon = { followers: '👥', views: '👁️', likes: '❤️' };

export default function Track() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderIdInput, setOrderIdInput] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const queryId = searchParams.get('id') || '';

  useEffect(() => {
    if (queryId) {
      setOrderIdInput(queryId);
      fetchOrderStatus(queryId);
    }
  }, [queryId]);

  const fetchOrderStatus = async (id) => {
    const targetId = (id || orderIdInput).trim();
    if (!targetId) {
      toast.error('Please enter an Order ID');
      return;
    }

    setLoading(true);
    setSearched(true);
    setOrder(null);

    try {
      const { data } = await axios.get(`${API}/orders/${targetId}`);
      if (data.success && data.data) {
        setOrder(data.data);
      } else {
        toast.error('Order not found');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Order not found. Please verify the ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(orderIdInput ? { id: orderIdInput } : {});
    fetchOrderStatus(orderIdInput);
  };

  return (
    <main className="track-page" style={{ minHeight: '80vh', padding: '8rem 2rem 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="track-container" style={{ width: '100%', maxWidth: '600px' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ display: 'inline-flex', padding: '0.4rem 1rem', background: 'rgba(0, 113, 227, 0.08)', border: '1px solid rgba(0, 113, 227, 0.2)', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, color: '#0071e3', marginBottom: '1rem' }}>
            🔍 LIVE TRACKING
          </span>
          <h1 style={{ fontFamily: 'var(--font-main)', fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.5rem', background: 'var(--grad-main)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Track Your Order
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Enter your Order ID (ORD...) to check your delivery progress in real time.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', marginBottom: '2.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
          <input
            type="text"
            placeholder="e.g. ORD1782801371543GAJB"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            style={{ flex: 1, padding: '0.8rem 1rem', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ padding: '0.8rem 1.5rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {loading ? <div className="spin" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : 'Track ⚡'}
          </button>
        </form>

        {/* Result Area */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spin" style={{ width: '40px', height: '40px', margin: '0 auto 1rem', border: '3px solid rgba(131,58,180,0.2)', borderTopColor: 'var(--purple)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Fetching live status...</p>
          </div>
        )}

        {!loading && searched && !order && (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>No Order Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              We couldn't find any order with ID "{orderIdInput}". Please double-check the ID or try again.
            </p>
            <Link to="/services" className="btn-secondary" style={{ fontSize: '0.9rem' }}>Browse Services</Link>
          </div>
        )}

        {!loading && order && (
          <div className="track-result-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-card)', backdropFilter: 'blur(20px)' }}>
            
            {/* Status Header */}
            <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ORDER ID</span>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.5px', marginTop: '0.2rem' }}>
                  {order.orderId}
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    background: `${statusConfig[order.orderStatus]?.color}15`,
                    border: `1px solid ${statusConfig[order.orderStatus]?.color}40`,
                    color: statusConfig[order.orderStatus]?.color
                  }}
                >
                  {statusConfig[order.orderStatus]?.emoji} {statusConfig[order.orderStatus]?.label}
                </span>
              </div>
            </div>

            {/* Status Steps Progress */}
            {order.orderStatus !== 'cancelled' && (
              <div style={{ display: 'flex', justifycontent: 'space-between', position: 'relative', margin: '2rem 1rem', paddingBottom: '1rem' }}>
                {/* Connecting lines */}
                <div style={{ position: 'absolute', top: '15px', left: '10px', right: '10px', height: '2px', background: 'var(--border)', zIndex: 0 }} />
                <div
                  style={{
                    position: 'absolute',
                    top: '15px',
                    left: '10px',
                    width: order.orderStatus === 'pending' ? '0%' : order.orderStatus === 'processing' ? '50%' : '100%',
                    height: '2px',
                    background: 'var(--grad-main)',
                    zIndex: 0,
                    transition: 'width 0.5s ease'
                  }}
                />

                {/* Step 1: Pending */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fbbf24', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>⏳</div>
                  <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#fbbf24', fontWeight: 600 }}>Received</span>
                </div>

                {/* Step 2: Processing */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: ['processing', 'completed'].includes(order.orderStatus) ? '#60a5fa' : '#e8e8ed', color: ['processing', 'completed'].includes(order.orderStatus) ? '#000' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>⚙️</div>
                  <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: ['processing', 'completed'].includes(order.orderStatus) ? '#60a5fa' : 'var(--text-muted)', fontWeight: 600 }}>Processing</span>
                </div>

                {/* Step 3: Completed */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: order.orderStatus === 'completed' ? '#34d399' : '#e8e8ed', color: order.orderStatus === 'completed' ? '#000' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>✅</div>
                  <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: order.orderStatus === 'completed' ? '#34d399' : 'var(--text-muted)', fontWeight: 600 }}>Completed</span>
                </div>
              </div>
            )}

            {/* Status Description Box */}
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              💡 {statusConfig[order.orderStatus]?.desc}
            </div>

            {/* Service & Details Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border)', paddingBottom: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Service Ordered</span>
                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {typeIcon[order.serviceSnapshot?.type]} {order.serviceSnapshot?.quantity?.toLocaleString('en-IN')} {order.serviceSnapshot?.name}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border)', paddingBottom: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Instagram Handle</span>
                <span style={{ fontWeight: 600, color: 'var(--purple)' }}>{order.instagramHandle}</span>
              </div>
              {order.postUrl && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border)', paddingBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Post URL</span>
                  <a href={order.postUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--purple)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
                    View Post ↗
                  </a>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border)', paddingBottom: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Amount Paid</span>
                <span style={{ fontWeight: 700, color: '#34d399' }}>₹{order.amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Order Placed At</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
