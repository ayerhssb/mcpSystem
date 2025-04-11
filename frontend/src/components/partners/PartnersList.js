// src/components/partners/PartnersList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import partnerService from '../../services/partnerService';
import Loader from '../common/Loader';
import Alert from '../common/Alert';

const PartnersList = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await partnerService.getAllPartners();
        // Fix: Extract the partners array from the response
        if (data && data.partners && Array.isArray(data.partners)) {
          setPartners(data.partners);
        } else if (Array.isArray(data)) {
          setPartners(data);
        } else {
          console.error('Unexpected data format:', data);
          setPartners([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching partners:', err);
        setError('Failed to load partners. Please try again.');
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handleDeletePartner = async (partnerId) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await partnerService.deletePartner(partnerId);
        setPartners(partners.filter(partner => partner._id !== partnerId));
      } catch (err) {
        setError('Failed to delete partner. Please try again.');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Pickup Partners</h2>
        <Link 
          to="/partners/add" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Partner
        </Link>
      </div>
      
      {error && <Alert type="error" message={error} />}
      
      {partners.length === 0 ? (
        <p>No partners found. Start by adding a new pickup partner.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Orders Completed</th>
                <th className="py-3 px-4 text-left">Wallet Balance</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(partners) && partners.map((partner) => (
                <tr key={partner._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{partner.name}</td>
                  <td className="py-3 px-4">{partner.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      partner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">{partner.ordersCompleted}</td>
                  <td className="py-3 px-4">₹{partner.wallet?.balance || 0}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link 
                        to={`/partners/${partner._id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeletePartner(partner._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PartnersList;