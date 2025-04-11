// Alert.js
import React, { useState, useEffect } from 'react';

const Alert = ({ type = 'info', message, duration = 5000, dismissible = true }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        {type === 'error' && <span className="alert-icon">⚠️</span>}
        {type === 'success' && <span className="alert-icon">✅</span>}
        {type === 'info' && <span className="alert-icon">ℹ️</span>}
        {type === 'warning' && <span className="alert-icon">⚠️</span>}
        <p>{message}</p>
      </div>
      {dismissible && (
        <button className="alert-dismiss" onClick={handleDismiss}>
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;