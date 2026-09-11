import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#111', color: '#fff', alignItems: 'center' }}>
      <div>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>Travel Office</Link>
      </div>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Tours</Link>

        {token ? (
          <>
            <Link to="/bookings" style={{ color: '#fff', textDecoration: 'none' }}>My Bookings</Link>
            <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
            
            {isAdmin && (
              <Link to="/admin" style={{ color: '#ffeb3b', textDecoration: 'none', fontWeight: 'bold' }}>Admin</Link>
            )}

            <button 
              onClick={handleLogout}
              style={{ background: '#ff4757', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ background: '#00bcd4', color: '#fff', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}