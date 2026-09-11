import API from './api'; // Ensure this matches your project folder structure (e.g., './api' or '../utils/api')

export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  
  // Extract token directly from response.data or nested response.data.data
  const token = response.data?.token || response.data?.data?.token;

  if (token) {
    localStorage.setItem('token', token);
  }

  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  
  // Extract token directly from response.data or nested response.data.data
  const token = response.data?.token || response.data?.data?.token;

  if (token) {
    localStorage.setItem('token', token);
  } else {
    throw new Error('Token missing from server response');
  }

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};