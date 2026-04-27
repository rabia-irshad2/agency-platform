import axios from 'axios';

// In development, use relative URLs to take advantage of vite proxy
// In production, use the full URL
const baseURL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

console.log('🔌 API Base URL:', api.defaults.baseURL);
console.log('🔌 Development mode:', import.meta.env.DEV);

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agency_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log('📤 Request:', config.method?.toUpperCase(), config.url);
  return config;
}, (error) => Promise.reject(error));

// Handle 401 globally (token expired → redirect to login)
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('agency_token');
      localStorage.removeItem('agency_admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;