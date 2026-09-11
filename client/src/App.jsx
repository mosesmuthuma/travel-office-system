import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import TourList from './components/TourList';
import TourDetail from './components/TourDetail';
import Checkout from './components/Checkout';
import MyBookings from './components/MyBookings';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import { logoutUser } from './services/authService';

// Navigation component so we can use useNavigate() inside BrowserRouter
function Navigation({ userToken, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logoutUser();
    onLogout();
    navigate('/login');
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem', 
      background: 'rgba(10, 20, 35, 0.95)', 
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#fff'
    }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
        Travel Office
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/tours" style={{ color: '#ddd', textDecoration: 'none' }}>Tours</Link>
        {userToken ? (
          <>
            <Link to="/my-bookings" style={{ color: '#ddd', textDecoration: 'none' }}>My Bookings</Link>
            <Link to="/profile" style={{ color: '#ddd', textDecoration: 'none' }}>Profile</Link>
            <Link to="/admin" style={{ color: '#ddd', textDecoration: 'none' }}>Admin</Link>
            <button 
              onClick={handleLogoutClick}
              style={{ background: '#ff6b6b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#ddd', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ background: '#00bcd4', color: '#fff', padding: '6px 14px', borderRadius: '4px', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  const [userToken, setUserToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#0a1423', color: '#fff', fontFamily: 'sans-serif' }}>
        <Navigation userToken={userToken} onLogout={() => setUserToken(null)} />
        
        <Routes>
          <Route path="/" element={<TourList />} />
          <Route path="/tours" element={<TourList />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login onLogin={() => setUserToken(localStorage.getItem('token'))} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}