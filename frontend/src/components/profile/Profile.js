import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Phone, MapPin, Mail, Edit } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-lg p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white text-blue-600 rounded-full p-4">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user?.name || 'User1'}</h1>
            <p className="text-blue-100">Account ID: {user?.id || '12345'}</p>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-b-lg shadow-lg p-6">
        {/* Profile Actions */}
        <div className="flex justify-end mb-6">
          <button className="flex items-center bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-md transition">
            <Edit size={16} className="mr-2" />
            Edit Profile
          </button>
        </div>

        {/* Profile Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center mb-4 text-blue-600">
              <User size={20} />
              <h3 className="ml-2 font-medium text-gray-700">Personal Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-800">{user?.name || 'User1'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date Joined</p>
                <p className="font-medium text-gray-800">{user?.joinDate || 'January 15, 2025'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center mb-4 text-blue-600">
              <Mail size={20} />
              <h3 className="ml-2 font-medium text-gray-700">Contact Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-800">{user?.email || 'user1@gmail.com'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-800">{user?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center mb-4 text-blue-600">
              <MapPin size={20} />
              <h3 className="ml-2 font-medium text-gray-700">Location</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-800">{user?.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City/Region</p>
                <p className="font-medium text-gray-800">{user?.city || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center mb-4 text-blue-600">
              <Phone size={20} />
              <h3 className="ml-2 font-medium text-gray-700">Preferences</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Notification Settings</p>
                <p className="font-medium text-gray-800">Email & SMS</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium text-gray-800">Standard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-medium text-gray-700 mb-4">Account Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-600">Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">3</p>
              <p className="text-sm text-gray-600">Partners</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">$249</p>
              <p className="text-sm text-gray-600">Wallet Balance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">5</p>
              <p className="text-sm text-gray-600">Reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;