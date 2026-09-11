import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [tour, setTour] = useState(location.state?.tour || null);
  const [guests, setGuests] = useState(
    Number(localStorage.getItem('pendingGuests')) || location.state?.guests || 1
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!tour) {
      const tourId = localStorage.getItem('pendingTourId');
      if (tourId) {
        API.get(`/tours/${tourId}`)
          .then((res) => setTour(res.data.data || res.data))
          .catch(() => setError('Could not load tour details for checkout.'));
      } else {
        setError('No tour selected for booking.');
      }
    }
  }, [tour]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tourIdentifier = tour._id || tour.id;
      
      await API.post('/bookings', { 
        tour: tourIdentifier, 
        tourId: tourIdentifier,
        guests: Number(guests),
        quantity: Number(guests)
      });
      
      setSuccess('Booking confirmed successfully!');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error && !tour) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#ff6b6b' }}>
        <h2>{error}</h2>
        <button 
          onClick={() => navigate('/tours')}
          style={{ marginTop: '1rem', padding: '10px 20px', background: '#00bcd4', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Back to Tours
        </button>
      </div>
    );
  }

  if (!tour) return <div style={{ textAlign: 'center', padding: '3rem', color: '#fff' }}>Loading checkout...</div>;

  const tourImage = tour.imageCover || tour.image || tour.photo || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828';
  const totalPrice = (tour.price || 0) * guests;

  return (
    <div style={{ maxWidth: '700px', margin: '2.5rem auto', padding: '1.5rem', color: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Confirm Your Booking</h2>

      <div style={{ 
        background: 'rgba(20, 30, 48, 0.9)', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        borderRadius: '12px', 
        overflow: 'hidden',
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <img 
            src={tourImage} 
            alt={tour.title} 
            style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
          />
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{tour.title}</h3>
            <p style={{ color: '#aaa', margin: '0 0 0.4rem 0' }}>📍 {tour.location}</p>
            <p style={{ color: '#ddd', margin: 0 }}>⏱ {tour.duration} Days | 💵 ${tour.price} per person</p>
          </div>
        </div>

        {/* Number of Guests Input Selector Box */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem', 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: '12px 15px', 
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <label htmlFor="guests" style={{ fontWeight: '600', fontSize: '1rem' }}>Number of Guests:</label>
          <input 
            id="guests"
            type="number" 
            min="1" 
            max="20"
            value={guests}
            onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: '90px', padding: '8px', borderRadius: '6px', background: '#111', border: '1px solid #555', color: '#fff', textAlign: 'center', fontSize: '1rem', fontWeight: 'bold' }}
          />
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-system', fontSize: '1.2rem' }}>
          <span>Total Price:</span>
          <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>${totalPrice}</span>
        </div>

        {error && <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        {success && <p style={{ color: '#2ecc71', textAlign: 'center', marginBottom: '1rem' }}>{success}</p>}

        <button 
          onClick={handleConfirmBooking}
          disabled={loading}
          style={{ 
            width: '100%', 
            background: '#2ecc71', 
            color: '#fff', 
            border: 'none', 
            padding: '12px', 
            borderRadius: '6px', 
            fontWeight: 'bold', 
            fontSize: '1.1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Processing...' : 'Complete Payment & Book'}
        </button>
      </div>
    </div>
  );
}
