// src/components/layout/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  
  // Only show sidebar if user is logged in
  if (!user) return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/partners', label: 'Pickup Partners', icon: '👥' },
    { path: '/orders', label: 'Orders', icon: '📦' },
    { path: '/wallet', label: 'Wallet', icon: '💰' },
    { path: '/reports', label: 'Reports', icon: '📝' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">MCP Portal</h2>
      </div>
      
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
                  } ${
                    isActive ? 'text-gray-700' : 'hover:bg-blue-600'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

