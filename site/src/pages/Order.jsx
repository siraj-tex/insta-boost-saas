import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:3000/api';

export default function Order() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    instagramHandle: '',
    postUrl: '',
  });

  useEffect(() => {
    axios.get(`${API}/services/${serviceId}`)
      .then(r => setService(r.data.data))
      .catch(() => { toast.error('Service not found'); navigate('/services'); })
      .finally(() => setLoading(false));
  }, [serviceId]);

  // Load Razorpay script dynamically
  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePay = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.customerEmail || !form.instagramHandle) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!/^[^@]+$/.test(form.instagramHandle.replace('@', ''))) {
      toast.error('Enter a valid Instagram handle');
      return;
    }

    const handle = form.instagramHandle.startsWith('@') ? form.instagramHandle : '@' + form.instagramHandle;

    setPaying(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Payment gateway failed to load. Check your internet.'); setPaying(false); return; }

      // 1. Create Razorpay order
      const { data } = await axios.post(`${API}/payment/create`, {
        amount: service.price,
        receipt: `rcpt_${Date.now()}`,
      });

      // 2. Open Razorpay modal
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'InstaBoost',
        description: service.name,
        order_id: data.orderId,
        theme: { color: '#0071e3' },
        prefill: {
          name: form.customerName,
          email: form.customerEmail,
        },
        handler: async (response) => {
          try {
            // 3. Verify payment
            await axios.post(`${API}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // 4. Save order
            const orderRes = await axios.post(`${API}/orders`, {
              ...form,
              instagramHandle: handle,
              serviceId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            toast.success('Payment successful! 🎉');
            navigate('/success', { state: { order: orderRes.data.data } });
          } catch (err) {
            console.error('Order creation/payment verification error:', err);
            toast.error('Payment verification failed. Contact support.');
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => { setPaying(false); toast('Payment cancelled'); }
        }
      };

      new window.Razorpay(options).open();
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="order-page">
      <div className="loading-container">
        <div className="loading-spinner" />
        <div className="loading-text">Loading...</div>
      </div>
    </div>
  );

  if (!service) return null;

  const disc = service.originalPrice ? Math.round((1 - service.price / service.originalPrice) * 100) : null;

  return (
    <main className="order-page">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            ← Back to Services
          </button>
        </div>

        <div className="order-container">
          {/* Order Summary */}
          <div className="order-summary">
            <div className="order-summary-title">📋 Order Summary</div>

            <div className="summary-service">
              <div style={{ fontSize: '2.5rem' }}>{service.icon}</div>
              <div>
                <div className="summary-name">{service.name}</div>
                <div className="summary-qty">{service.quantity.toLocaleString('en-IN')} {service.type}</div>
              </div>
            </div>

            <div className="summary-row">
              <span className="summary-label">Package</span>
              <span className="summary-value">{service.type.charAt(0).toUpperCase() + service.type.slice(1)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Quantity</span>
              <span className="summary-value">{service.quantity.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Delivery</span>
              <span className="summary-value">⚡ {service.deliveryTime}</span>
            </div>
            {disc && (
              <div className="summary-row">
                <span className="summary-label">Discount</span>
                <span className="summary-value" style={{ color: '#34d399' }}>-{disc}% OFF</span>
              </div>
            )}

            <div className="summary-divider" />
            <div className="summary-row summary-total">
              <span className="summary-label">Total Amount</span>
              <span className="summary-value">₹{service.price}</span>
            </div>

            <div className="trust-badges">
              <div className="trust-badge"><span>🔒</span> SSL Secured Payment</div>
              <div className="trust-badge"><span>✅</span> Razorpay Payment Gateway</div>
              <div className="trust-badge"><span>🛡️</span> 30-Day Money Back Guarantee</div>
              <div className="trust-badge"><span>⚡</span> Instant Delivery Begins</div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(131,58,180,0.08)', border: '1px solid rgba(131,58,180,0.2)', borderRadius: 12 }}>
              <ul className="card-features" style={{ marginBottom: 0 }}>
                {service.features?.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          </div>

          {/* Order Form */}
          <div className="order-form-wrapper">
            <div className="form-title">Complete Your Order</div>
            <div className="form-subtitle">Fill in your details below to proceed with payment</div>

            <form onSubmit={handlePay}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  className="form-input"
                  type="text"
                  name="customerName"
                  placeholder="Enter your full name"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  className="form-input"
                  type="email"
                  name="customerEmail"
                  placeholder="your@email.com"
                  value={form.customerEmail}
                  onChange={handleChange}
                  required
                />
                <div className="form-hint">📧 Order confirmation will be sent to this email</div>
              </div>

              <div className="form-group">
                <label className="form-label">Instagram Handle *</label>
                <input
                  className="form-input"
                  type="text"
                  name="instagramHandle"
                  placeholder="@yourusername"
                  value={form.instagramHandle}
                  onChange={handleChange}
                  required
                />
                <div className="form-hint">🔒 We never ask for your password. Public profile required.</div>
              </div>

              {(service.type === 'views' || service.type === 'likes') && (
                <div className="form-group">
                  <label className="form-label">Post/Reel URL {service.type !== 'followers' ? '*' : '(Optional)'}</label>
                  <input
                    className="form-input"
                    type="url"
                    name="postUrl"
                    placeholder="https://www.instagram.com/p/..."
                    value={form.postUrl}
                    onChange={handleChange}
                    required={service.type !== 'followers'}
                  />
                  <div className="form-hint">📎 Paste the link to your Instagram post or reel</div>
                </div>
              )}

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>🎯 You're ordering:</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>{service.quantity.toLocaleString('en-IN')} {service.type} — {service.name}</span>
                  <span style={{ fontFamily: 'var(--font-main)', fontSize: '1.5rem', fontWeight: 700, background: 'var(--grad-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{service.price}</span>
                </div>
              </div>

              <button type="submit" className="pay-btn" disabled={paying}>
                {paying ? <><div className="spin" /> Processing...</> : <>💳 Pay ₹{service.price} via Razorpay</>}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span>🔒</span> Secured by Razorpay • UPI, Cards, Net Banking accepted
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
