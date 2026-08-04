import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const LOCATIONS = [
  'Hyderabad — Jubilee Hills Hub',
  'Hyderabad — Banjara Hills Centre',
  'Hyderabad — HITEC City Point',
  'Hyderabad — Airport Lounge',
];

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

export default function BookingModal({ car, onClose, onBooked }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user ? `${user.fname} ${user.lname}` : '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState(LOCATIONS[0]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState(null); // null | true | false
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const days = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;
    const d = (new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24);
    return d > 0 ? Math.ceil(d) : 0;
  }, [pickupDate, returnDate]);

  useEffect(() => {
    if (days <= 0) {
      setAvailability(null);
      return;
    }
    let cancelled = false;
    setCheckingAvailability(true);
    const timer = setTimeout(() => {
      api.get(`/api/cars/${car.id}/availability?pickupDate=${pickupDate}&returnDate=${returnDate}`)
        .then((res) => { if (!cancelled) setAvailability(res.available); })
        .catch(() => { if (!cancelled) setAvailability(null); })
        .finally(() => { if (!cancelled) setCheckingAvailability(false); });
    }, 350);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [car.id, pickupDate, returnDate, days]);

  const total = days * car.daily;

  if (!user) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>SIGN IN REQUIRED</h3>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="modal-body">
            <p style={{ color: 'var(--light)', marginBottom: 20 }}>
              Please sign in to book the {car.name}.
            </p>
            <button className="btn btn-red" style={{ width: '100%' }} onClick={() => navigate('/signin')}>
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (days <= 0) {
      setError('Return date must be after the pick-up date.');
      return;
    }

    if (availability === false) {
      setError('This car is already booked for the selected dates.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/bookings', {
        name,
        phone,
        pickupDate,
        returnDate,
        pickupLocation,
        price: total,
        carId: car.id,
        carName: car.name,
      });
      onBooked();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>BOOK YOUR CAR</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div
            className="modal-car-banner"
            style={{ backgroundImage: `linear-gradient(180deg, transparent, #000c), url(${car.img})` }}
          />
          <div style={{ marginBottom: 16 }}>
            <div className="car-name">{car.name}</div>
            <div className="car-sub">{car.sub} · {fmt(car.daily)}/day</div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Your Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  placeholder="10-digit number"
                  pattern="[6789][0-9]{9}"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Pick-up Date</label>
                <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Return Date</label>
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label>Pick-up Location</label>
              <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
                {LOCATIONS.map((loc) => <option key={loc}>{loc}</option>)}
              </select>
            </div>

            {checkingAvailability && (
              <div style={{ color: 'var(--gray)', fontSize: '0.82rem', marginBottom: 12 }}>
                Checking availability…
              </div>
            )}
            {!checkingAvailability && availability === false && (
              <div className="form-error">
                🚫 This car is already booked for the selected dates. Try different dates or another car.
              </div>
            )}
            {!checkingAvailability && availability === true && days > 0 && (
              <div className="form-success">✅ Available for these dates.</div>
            )}

            <div className="price-summary">
              <div className="price-row"><span>Daily Rate</span><span>{fmt(car.daily)}</span></div>
              <div className="price-row"><span>Duration</span><span>{days} day{days === 1 ? '' : 's'}</span></div>
              <div className="price-row"><span>Insurance</span><span>Included ✅</span></div>
              <div className="price-row total"><span>Total</span><span className="amount">{fmt(total)}</span></div>
            </div>

            <button
              type="submit"
              className="btn btn-red"
              style={{ width: '100%', padding: 13 }}
              disabled={submitting || checkingAvailability || availability === false}
            >
              {submitting ? 'Booking…' : '🚀 Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
