import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTourById } from '../services/tourService';

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getTourById(id);
        setTour(response.data.data || response.data);
      } catch (err) {
        setMessage('Could not load tour details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleBookingClick = () => {
    if (!tour) return;
    const finalGuests = Number(guests) || 1;
    localStorage.setItem('pendingTourId', tour._id || tour.id);
    localStorage.setItem('pendingGuests', finalGuests);
    navigate('/checkout', { state: { tour, guests: finalGuests } });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#fff' }}>Loading...</div>;
  if (!tour) return <div style={{ textAlign: 'center', padding: '3rem', color: '#fff' }}>{message || 'Tour not found.'}</div>;

  const tourImage = tour.imageCover || tour.image || tour.photo || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828';
  const effectiveGuests = guests === '' ? '' : Number(guests);
  const totalPrice = (tour.price || 0) * (effectiveGuests || 1);

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem', color: '#fff' }}>
      <h1>{tour.title}</h1>
      <p>📍 {tour.location} | ⏱ {tour.duration} Days</p>
      <img src={tourImage} alt={tour.title} style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '8px' }} />
      <p style={{ marginTop: '1rem' }}>{tour.description}</p>
      
      {/* Guest Selector Box */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'rgba(255, 255, 255, 0.05)', 
        padding: '12px 15px', 
        borderRadius: '8px',
        margin: '1.5rem 0',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <label htmlFor="guests" style={{ fontWeight: '600' }}>Number of Guests:</label>
        <input 
          id="guests"
          type="number" 
          min="1" 
          max="20"
          value={guests}
          onChange={(e) => {
            const val = e.target.value;
            setGuests(val === '' ? '' : parseInt(val));
          }}
          onBlur={() => {
            if (guests === '' || guests < 1) setGuests(1);
          }}
          style={{ width: '80px', padding: '8px', borderRadius: '6px', background: '#111', border: '1px solid #555', color: '#fff', textAlign: 'center', fontWeight: 'bold' }}
        />
      </div>

      <h3>Price per person: ${tour.price}</h3>
      <h2 style={{ color: '#2ecc71' }}>Total: ${totalPrice}</h2>

      <button 
        onClick={handleBookingClick}
        style={{ 
          width: '100%', 
          background: '#2ecc71', 
          color: '#fff', 
          border: 'none', 
          padding: '12px', 
          borderRadius: '6px', 
          fontWeight: 'bold', 
          fontSize: '1.1rem',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}