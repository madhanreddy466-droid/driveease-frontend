import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <NavLink to="/" className="logo">VEL<span>O</span>CE</NavLink>

      <nav className="main-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
        <NavLink to="/cars" className={({ isActive }) => (isActive ? 'active' : '')}>Fleet</NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About</NavLink>
        {user && <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? 'active' : '')}>My Bookings</NavLink>}
        <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>Admin</NavLink>
      </nav>

      <div className="header-actions">
        {user ? (
          <>
            <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>Hi, {user.fname}</span>
            <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <NavLink to="/signin" className="btn btn-outline">Sign In</NavLink>
            <NavLink to="/signup" className="btn btn-red">Sign Up</NavLink>
          </>
        )}
      </div>
    </header>
  );
}
