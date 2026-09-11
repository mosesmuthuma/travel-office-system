import API from '../utils/api';

// Get tours with optional filter and search query serialization
export const getTours = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.sort) params.append('sort', filters.sort);

  const queryString = params.toString();
  const endpoint = queryString ? `/tours?${queryString}` : '/tours';

  const response = await API.get(endpoint);
  return response.data;
};

// Get single tour details by ID
export const getTourById = async (id) => {
  const response = await API.get(`/tours/${id}`);
  return response.data;
};

// Create a booking
export const createBooking = async (bookingData) => {
  const response = await API.post('/bookings', bookingData);
  return response.data;
};
