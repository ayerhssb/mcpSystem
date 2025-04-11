// Loader.js
import React from 'react';

const Loader = ({ size = 'medium' }) => {
  const sizeClass = {
    small: 'loader-small',
    medium: 'loader-medium',
    large: 'loader-large'
  }[size] || 'loader-medium';

  return (
    <div className="loader-container">
      <div className={`loader ${sizeClass}`}>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default Loader;











