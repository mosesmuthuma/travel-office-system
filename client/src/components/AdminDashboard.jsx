import React, { useState } from 'react';
import API from '../services/api';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    location: '',
    image: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tours', formData);
      setMessage('Tour created successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        duration: '',
        location: '',
        image: '',
      });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create tour');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', background: '#1e293b', padding: '2rem', borderRadius: '10px', color: '#fff', border: '1px solid #334155' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#38bdf8' }}>
        Admin Dashboard — Create Tour
      </h2>

      {message && (
        <p style={{ textAlign: 'center', color: message.includes('success') ? '#4ade80' : '#ef4444', marginBottom: '1rem' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          name="title"
          placeholder="Tour Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
        />

        <textarea
          name="description"
          placeholder="Tour Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{ padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff', minHeight: '80px' }}
        />

        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="number"
            name="price"
            placeholder="Price ($)"
            value={formData.price}
            onChange={handleChange}
            required
            style={{ flex: 1, padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration (Days)"
            value={formData.duration}
            onChange={handleChange}
            required
            style={{ flex: 1, padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
          />
        </div>

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          style={{ padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL (e.g. https://...)"
          value={formData.image}
          onChange={handleChange}
          style={{ padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
        />

        <button 
          type="submit" 
          style={{ padding: '0.75rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}
        >
          Add Tour
        </button>
      </form>
    </div>
  );
}