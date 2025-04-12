// src/services/authService.js
import axios from 'axios';

axios.defaults.withCredentials = true;
const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth`;



// Register user
export const register = async (name, email, password, phone, address) => {
  try {
    const { data } = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      phone,
      address
    });
    return data;
  } catch (error) {
    const message = 
      error.response?.data?.message || error.message;
    throw new Error(message);
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    return data;
  } catch (error) {
    const message = 
      error.response?.data?.message || error.message;
    throw new Error(message);
  }
};

// Logout user
export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`);
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

// Check if user is authenticated
export const checkAuthStatus = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/check`);
    return data.authenticated;
  } catch (error) {
    return false;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/profile`);
    return data;
  } catch (error) {
    const message = 
      error.response?.data?.message || error.message;
    throw new Error(message);
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const { data } = await axios.put(`${API_URL}/profile`, userData);
    return data;
  } catch (error) {
    const message = 
      error.response?.data?.message || error.message;
    throw new Error(message);
  }
};
