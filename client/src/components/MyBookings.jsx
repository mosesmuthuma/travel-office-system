import { useEffect, useState, useRef } from 'react';
import API from '../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Guard to prevent React StrictMode from running payment success twice
  const hasProcessedPayment = useRef(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('success') === 'true' && !hasProcessedPayment.current) {
      hasProcessedPayment.current = true;
      handleSuccessfulPayment();
    }
  }, []);

  const handleSuccessfulPayment = async () => {
    try {
      const pendingTourId = localStorage.getItem('pendingTourId');
      
      if (!pendingTourId) {
        console.log('No pending tour found to book.');
        return;
      }

      localStorage.removeItem('pendingTourId');

      const res = await API.post('/bookings', {
        tour: pendingTourId,
        guests: 1
      });
      
      setMessage('Payment successful! Your confirmation email has been sent.');
      console.log('Booking created & email sent:', res.data);
      
      fetchBookings(); 
    } catch (err) {
      console.error('Failed to create booking after payment:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to save booking after payment.');
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings');
      setBookings(res.data.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await API.delete(`/bookings/${bookingId}`);
      setMessage('Booking cancelled successfully.');
      fetchBookings();
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h2>My Bookings</h2>
      
      {message && <div style={{ background: '#d4edda', color: '#155724', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>{message}</div>}
      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>{error}</div>}
      {loading && <p>Loading your bookings...</p>}

      {!loading && bookings.length === 0 && (
        <p>You have no bookings yet.</p>
      )}

      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {bookings.map((booking, index) => (
          <div key={booking._id || index} style={{ border: '1px solid #ddd', padding: '1.2rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255, 255, 255, 0.05)' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{booking?.tour?.title || 'Tour'}</h3>
                 <p style={{ margin: '4px 0' }}>Location: {booking?.tour?.location || 'N/A'}</p>
                 <p style={{ margin: '4px 0' }}>Date: {booking?.tour?.startDate ? new Date(booking.tour.startDate).toLocaleDateString() : 'TBD'}</p>
                 <p style={{ margin: '4px 0' }}>Guests: {booking?.guests}</p>
                 <p style={{ margin: '4px 0' }}>Total Price: ${booking?.totalPrice}</p>
            </div>
            <button 
              onClick={() => handleCancelBooking(booking._id)}
              style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', alignSelf: 'flex-start', fontWeight: 'bold' }}
            >
              Cancel Booking
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}