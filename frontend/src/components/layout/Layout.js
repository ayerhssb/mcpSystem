// src/components/layout/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const Layout = () => {
  const { user, loading } = useAuth();
  const { notifications, removeNotification } = useNotification();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner-border animate-spin h-12 w-12 border-4 rounded-full border-blue-500 border-b-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1">
        {user && <Sidebar />}
        
        <main className="flex-1 bg-gray-100 p-6">
          {/* Notifications */}
          <div className="fixed top-6 right-6 z-50 w-72">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`mb-3 p-3 rounded-lg shadow-md ${
                  notification.type === 'error'
                    ? 'bg-red-500 text-white'
                    : notification.type === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <p>{notification.message}</p>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;