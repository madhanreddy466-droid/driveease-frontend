import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAdminAuth } from '../context/AdminAuthContext';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function Admin() {
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/stats'),
      api.get('/api/admin/bookings'),
    ])
      .then(([statsRes, bookingsRes]) => {
        setStats(statsRes);
        setBookings(bookingsRes);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/signin');
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="eyebrow">Admin</div>
            <h2 className="section-title">Fleet Dashboard</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>{admin?.name}</span>
            <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {loading && <div className="spinner-wrap">Loading dashboard…</div>}

        {stats && (
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">{fmt(stats.revenue)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.bookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.available}</div>
              <div className="stat-label">Available Cars</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.booked}</div>
              <div className="stat-label">Currently Booked</div>
            </div>
          </div>
        )}

        {!loading && bookings.length === 0 && !error && (
          <div className="empty-state">
            <h3>No bookings yet</h3>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Car</th>
                  <th>Pickup</th>
                  <th>Return</th>
                  <th>Location</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.name}</td>
                    <td>{b.userEmail}</td>
                    <td>{b.carName || '—'}</td>
                    <td>{b.pickupDate}</td>
                    <td>{b.returnDate}</td>
                    <td>{b.pickupLocation}</td>
                    <td>{fmt(b.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
