import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminSignin() {
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      adminLogin(email, pass);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 className="auth-title">ADMIN ACCESS</h2>
        <p className="auth-sub">Sign in with your admin credentials to view the dashboard.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@email.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-red" style={{ width: '100%', marginTop: 6 }}>
            🔑 Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
