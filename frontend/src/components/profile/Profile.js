import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-600 font-semibold">Name</label>
          <p className="text-gray-800">{user?.name || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">Email</label>
          <p className="text-gray-800">{user?.email || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">Phone</label>
          <p className="text-gray-800">{user?.phone || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">Address</label>
          <p className="text-gray-800">{user?.address || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
