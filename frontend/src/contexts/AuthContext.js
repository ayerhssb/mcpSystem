// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/profile`, {
          withCredentials: true,
        });
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [API_URL]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name, email, password, phone, address) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/auth/register`,
        { name, email, password, phone, address },
        { withCredentials: true }
      );
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem('user');
      toast.info('You have been logged out');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/check`, {
        withCredentials: true,
      });
      return data.authenticated;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
