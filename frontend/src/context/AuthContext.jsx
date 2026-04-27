import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('agency_token');
    const saved = localStorage.getItem('agency_admin');
    if (token && saved) {
      setAdmin(JSON.parse(saved));
      // Verify token is still valid
      api.get('/auth/me').then(res => {
        setAdmin(res.data.admin);
        localStorage.setItem('agency_admin', JSON.stringify(res.data.admin));
      }).catch(() => {
        localStorage.removeItem('agency_token');
        localStorage.removeItem('agency_admin');
        setAdmin(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login with:', email);
      const res = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', res.data);
      const { token, admin: adminData } = res.data;
      localStorage.setItem('agency_token', token);
      localStorage.setItem('agency_admin', JSON.stringify(adminData));
      setAdmin(adminData);
      return adminData;
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('agency_token');
    localStorage.removeItem('agency_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};