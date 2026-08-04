import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import BookingModal from '../components/BookingModal';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [cls, setCls] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    api.get('/api/cars')
      .then(setCars)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const classes = useMemo(() => ['All', ...new Set(cars.map((c) => c.cls))], [cars]);

  const filtered = useMemo(() => {
    return cars.filter((c) => {
      const matchesClass = cls === 'All' || c.cls === cls;
      const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase());
      return matchesClass && matchesQuery;
    });
  }, [cars, cls, query]);

  return (
    <div className="section">
      <div className="container">
        <div className="eyebrow">The Fleet</div>
        <h2 className="section-title">48 Cars, Zero Compromise</h2>
        <p className="section-sub">Filter by class or search by name to find your ride.</p>

        <div className="filters">
          <input
            className="search-bar"
            placeholder="Search cars…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {classes.map((c) => (
            <button
              key={c}
              className={`filter-pill ${cls === c ? 'active' : ''}`}
              onClick={() => setCls(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {loading && <div className="spinner-wrap">Loading the fleet…</div>}
        {loadError && <div className="form-error">{loadError}</div>}

        {!loading && !loadError && (
          <div className="grid grid-4">
            {filtered.map((car) => (
              <div className="card" key={car.id}>
                <img className="car-img" src={car.img} alt={car.name} />
                <div className="car-body">
                  <div className="car-name">{car.emoji} {car.name}</div>
                  <div className="car-sub">{car.sub}</div>
                  <div className="car-tags">
                    <span className="tag">{car.seats} seats</span>
                    <span className="tag">{car.fuel}</span>
                    <span className="tag">{car.trans}</span>
                  </div>
                  <div className="car-footer">
                    <div className="car-price">{fmt(car.daily)} <small>/day</small></div>
                    <button className="btn btn-red" onClick={() => setSelectedCar(car)}>Book</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !loadError && filtered.length === 0 && (
          <div className="empty-state">
            <h3>No cars match your search</h3>
            <p>Try a different class or search term.</p>
          </div>
        )}
      </div>

      {selectedCar && (
        <BookingModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onBooked={() => {
            setConfirmed(selectedCar.name);
            setSelectedCar(null);
          }}
        />
      )}

      {confirmed && (
        <div className="modal-overlay" onClick={() => setConfirmed(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>✅</div>
              <h3 style={{ marginBottom: 8 }}>Booking Confirmed</h3>
              <p style={{ color: 'var(--gray)', marginBottom: 20, fontSize: '0.9rem' }}>
                Your {confirmed} is reserved. Check My Bookings for the details.
              </p>
              <button className="btn btn-red" style={{ width: '100%' }} onClick={() => setConfirmed(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
