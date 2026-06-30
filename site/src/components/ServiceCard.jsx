import { Link } from 'react-router-dom';

const discount = (price, original) => Math.round((1 - price / original) * 100);

export default function ServiceCard({ service }) {
  const disc = service.originalPrice ? discount(service.price, service.originalPrice) : null;

  return (
    <div className={`service-card ${service.popular ? 'popular' : ''}`}>
      {service.popular && <div className="popular-badge">⭐ Most Popular</div>}
      <span className="card-icon">{service.icon || '📦'}</span>
      <div className="card-quantity">{service.quantity.toLocaleString('en-IN')}</div>
      <div className="card-name">{service.name}</div>
      <p className="card-desc">{service.description}</p>

      <div className="card-delivery">
        <span>⚡</span>
        <span>Delivery: {service.deliveryTime}</span>
      </div>

      <ul className="card-features">
        {service.features?.map((f, i) => <li key={i}>{f}</li>)}
      </ul>

      <div className="card-pricing">
        <span className="card-price">₹{service.price}</span>
        {service.originalPrice && (
          <>
            <span className="card-original-price">₹{service.originalPrice}</span>
            {disc && <span className="card-discount">{disc}% OFF</span>}
          </>
        )}
      </div>

      <Link to={`/order/${service._id}`} className="card-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
        Order Now →
      </Link>
    </div>
  );
}
