// EmptyState.js
import React from 'react';

const EmptyState = ({ 
  title = 'No data found', 
  message = 'There are no items to display at this time.', 
  icon = 'inbox',
  actionText,
  onAction
}) => {
  const icons = {
    inbox: 'inbox-icon',
    search: 'search-icon',
    error: 'error-icon',
    add: 'add-icon'
  };

  const iconClass = icons[icon] || icons.inbox;

  return (
    <div className="empty-state">
      <div className={`empty-icon ${iconClass}`}></div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
      {actionText && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;