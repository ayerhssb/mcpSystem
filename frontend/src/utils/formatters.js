// src/utils/formatters.js

/**
 * Format a number as currency (USD)
 * @param {number} value - The value to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
    // Handle null, undefined or non-numeric values
    if (value === null || value === undefined || isNaN(value)) {
      return '$0.00';
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  /**
   * Format a date to a human-readable string
   * @param {Date|string} dateInput - Date object or string to format
   * @returns {string} Formatted date string
   */
  export const formatDate = (dateInput) => {
    // Handle null or undefined
    if (!dateInput) return 'N/A';
    
    // Convert string to Date if needed
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    // Check if date is valid
    if (!(date instanceof Date) || isNaN(date)) return 'Invalid Date';
    
    // Format date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * Format a number with thousand separators
   * @param {number} value - The value to format
   * @returns {string} Formatted number
   */
  export const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }
    
    return new Intl.NumberFormat('en-US').format(value);
  };