// src/components/layout/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { addNotification } = useNotification();

  const handleLogout = () => {
    logout();
    addNotification('You have been logged out', 'info');
  };

  return (
    <header className="bg-gray-800 shadow-md py-4">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold text-blue-600">MCP System</Link>
        
        {user && (
          <div className="flex items-center">
            <span className="mr-4 text-gray-700">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

