import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function UserProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/auth/profile');
        const userData = data.data || data;
        setName(userData.name || '');
        setEmail(userData.email || '');
      } catch (err) {
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const payload = { name, email };
      if (password.trim() !== '') {
        payload.password = password;
      }

      const { data } = await API.put('/auth/profile', payload);
      const updatedUser = data.data || data;
      
      setName(updatedUser.name || name);
      setEmail(updatedUser.email || email);
      setPassword('');
      setMessage('Profile updated successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error updating profile';
      setError(errorMsg);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#fff' }}>Loading profile...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2.5rem auto', padding: '1.5rem', color: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>User Profile</h2>

      <div style={{ background: 'rgba(20, 30, 48, 0.9)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {message && <p style={{ color: '#2ecc71', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>{message}</p>}
        {error && <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#111', border: '1px solid #444', color: '#fff', fontSize: '1rem' }}
              required 
            />
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#111', border: '1px solid #444', color: '#fff', fontSize: '1rem' }}
              required 
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>New Password (leave blank to keep current):</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#111', border: '1px solid #444', color: '#fff', fontSize: '1rem' }}
            />
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', background: '#00bcd4', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}