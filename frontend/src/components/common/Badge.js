// Badge.js
import React from 'react';

const Badge = ({ type = 'default', text, size = 'medium' }) => {
  const badgeClass = `badge badge-${type} badge-${size}`;
  
  return <span className={badgeClass}>{text}</span>;
};

export default Badge;