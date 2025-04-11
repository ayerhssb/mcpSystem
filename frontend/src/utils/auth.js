// src/utils/auth.js
// Authentication utility functions

// Get the authentication token from localStorage
export const getAuthToken = () => {
    return localStorage.getItem('token');
  };
  
  // Set the authentication token in localStorage
  export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Remove the authentication token from localStorage
  export const removeAuthToken = () => {
    localStorage.removeItem('token');
  };
  
  // Check if user is authenticated
  export const isAuthenticated = () => {
    return !!getAuthToken();
  };