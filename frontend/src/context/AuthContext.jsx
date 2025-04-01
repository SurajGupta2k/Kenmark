// Import necessary dependencies
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config/config';

// Create authentication context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps app and provides auth context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Verify if user has valid auth token
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${config.apiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  // Handle user login
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${config.apiUrl}/api/auth/login`, {
        email,
        password
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
      throw error;
    }
  };

  // Handle user registration
  const signup = async (username, email, password) => {
    try {
      const response = await axios.post(`${config.apiUrl}/api/auth/signup`, {
        username,
        email,
        password
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
      throw error;
    }
  };

  // Redirect to Google OAuth login
  const handleGoogleLogin = () => {
    console.log('Initiating Google login...');
    window.location.href = `${config.apiUrl}/api/auth/google`;
  };

  // Handle OAuth callback
  const handleAuthCallback = (token, userData) => {
    if (token && userData) {
      localStorage.setItem('token', token);
      setUser(userData);
      setError(null);
    }
  };

  // Handle user logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Context value containing auth state and methods
  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    handleGoogleLogin,
    handleAuthCallback
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 