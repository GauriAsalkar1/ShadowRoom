import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await auth.getMe();
      if (response.user) {
        setUser(response.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await auth.register(userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        toast.success('Registration successful!');
        return { success: true };
      }
      toast.error(response.error || 'Registration failed');
      return { success: false };
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await auth.login({ email, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        toast.success('Welcome back!');
        return { success: true };
      }
      toast.error(response.error || 'Login failed');
      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      return { success: false };
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    token: localStorage.getItem('token'),
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};