import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="eyebrow">Premium Fleet · Hyderabad</div>
            <h1>DRIVE THE<br /><span>EXTRAORDINARY</span></h1>
            <p>
              From daily commuters to Lamborghinis, VELOCE puts 48 hand-picked cars
              at your fingertips — book in under two minutes, insurance included.
            </p>
            <div className="hero-actions">
              <Link to="/cars" className="btn btn-red">Browse the Fleet</Link>
              <Link to="/about" className="btn btn-outline">How it Works</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow">Why VELOCE</div>
          <h2 className="section-title">Built for effortless rentals</h2>
          <p className="section-sub">No paperwork queues, no hidden fees — just pick a car and go.</p>

          <div className="grid grid-3">
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>⚡</div>
              <h3 style={{ marginBottom: 8 }}>Instant Booking</h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
                Reserve any car in the fleet in a few clicks, with live pricing by day, week, or month.
              </p>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>🛡️</div>
              <h3 style={{ marginBottom: 8 }}>Insurance Included</h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
                Every rental comes with full coverage baked into the price — no surprises at pickup.
              </p>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>📍</div>
              <h3 style={{ marginBottom: 8 }}>4 Pickup Hubs</h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
                Jubilee Hills, Banjara Hills, HITEC City, and the Airport Lounge — pick what's convenient.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
