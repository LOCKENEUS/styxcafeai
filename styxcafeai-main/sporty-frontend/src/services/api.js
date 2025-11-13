import axios from 'axios';

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  // Locations
  getLocations: () => api.get('/user/locations'),
  
  // Cafes
  getRecentCafes: () => api.get('/user/recent-cafe'),
  getCafeDetails: (id) => api.get(`/user/cafeDetails/${id}`),
  getCafesByFilter: (filters) => api.post('/user/cafesByFilter', filters),
  
  // Games
  getGameDetails: (id) => api.get(`/user/gameDetails/${id}`),
  
  // CMS Content
  getHeroContent: () => api.get('/user/content/hero'),
  getServiceContent: () => api.get('/user/content/services'),
  
  // Booking
  createBooking: (data) => api.post('/user/booking/create', data),
  getBookings: () => api.get('/user/booking/list'),
};

export default api;
