import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/api/bookings')
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const { totalBookings, totalSpent, upcoming } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let spent = 0;
    let up = 0;
    bookings.forEach((b) => {
      spent += b.price;
      if (new Date(b.pickupDate) > today) up++;
    });
    return { totalBookings: bookings.length, totalSpent: spent, upcoming: up };
  }, [bookings]);

  const cancelBooking = async (id) => {
    setCancellingId(id);
    try {
      await api.del(`/api/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="eyebrow">Your Account</div>
        <h2 className="section-title">My Bookings</h2>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{totalBookings}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{fmt(totalSpent)}</div>
            <div className="stat-label">Total Spent</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{upcoming}</div>
            <div className="stat-label">Upcoming</div>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {loading && <div className="spinner-wrap">Loading your bookings…</div>}

        {!loading && bookings.length === 0 && !error && (
          <div className="empty-state">
            <h3>No bookings yet</h3>
            <p>Head to the fleet page to reserve your first car.</p>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Car</th>
                  <th>Pickup</th>
                  <th>Return</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const isUpcoming = new Date(b.pickupDate) > new Date();
                  return (
                    <tr key={b.id}>
                      <td>{b.carName || b.name}</td>
                      <td>{b.pickupDate}</td>
                      <td>{b.returnDate}</td>
                      <td>{b.pickupLocation}</td>
                      <td>{fmt(b.price)}</td>
                      <td>
                        <span className={`status-badge ${isUpcoming ? 'status-upcoming' : 'status-past'}`}>
                          {isUpcoming ? 'Upcoming' : 'Past'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                          disabled={cancellingId === b.id}
                          onClick={() => cancelBooking(b.id)}
                        >
                          {cancellingId === b.id ? 'Cancelling…' : 'Cancel'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
