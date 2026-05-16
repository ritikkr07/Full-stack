import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Setup axios default config
  axios.defaults.baseURL = '/api';
  axios.defaults.withCredentials = true; // IMPORTANT: For sending/receiving cookies

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const res = await axios.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user || res.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/auth/register', userData);
      if (res.data.success) {
        toast.success('Registration successful!');
        // Login immediately or just return true to let component redirect
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const login = async (userData) => {
    try {
      const res = await axios.post('/auth/login', userData);
      if (res.data.success) {
        setUser(res.data.data || res.data.user || {}); // Fallback in case user object is different
        // Re-fetch user to be sure
        await checkUserLoggedIn();
        toast.success('Logged in successfully!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.get('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, checkUserLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
