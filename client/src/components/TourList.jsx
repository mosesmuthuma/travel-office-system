import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function TourList() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');

  const navigate = useNavigate();

  const fetchTours = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort) params.append('sort', sort);

      const queryString = params.toString();
      const endpoint = queryString ? `/tours?${queryString}` : '/tours';

      const res = await API.get(endpoint);
      setTours(res.data.data || res.data);
    } catch (err) {
      console.error('Failed to fetch tours:', err);
      setError(err.response?.data?.message || 'Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [sort]); // Refetch when sorting changes, or trigger via search button

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTours();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#38bdf8', marginBottom: '1.5rem' }}>Explore Tours</h1>

      {/* Search & Filter Bar */}
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by title or location..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff', flex: '1', minWidth: '200px' }}
        />
        <input 
          type="number" 
          placeholder="Min Price" 
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff', width: '120px' }}
        />
        <input 
          type="number" 
          placeholder="Max Price" 
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff', width: '120px' }}
        />
        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
          style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
        >
          <option value="">Sort By</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
        </select>
        <button 
          type="submit"
          style={{ padding: '0.6rem 1.5rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Filter
        </button>
      </form>

      {loading && <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading tours...</p>}
      {error && <p style={{ textAlign: 'center', color: '#ef4444' }}>{error}</p>}

      {/* Tour Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {!loading && tours.map((tour) => (
          <div 
            key={tour._id} 
            onClick={() => navigate(`/tours/${tour._id}`)}
            style={{ 
              background: '#1e293b', 
              borderRadius: '10px', 
              overflow: 'hidden', 
              border: '1px solid #334155', 
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {tour.image && (
              <img src={tour.image} alt={tour.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ color: '#38bdf8', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{tour.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>📍 {tour.location}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '1.1rem' }}>${tour.price}</span>
                <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>⏱️ {tour.duration} Days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}