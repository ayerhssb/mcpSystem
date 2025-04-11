// src/components/orders/AssignOrder.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';
import partnerService from '../../services/partnerService';
import Loader from '../common/Loader';
import Alert from '../common/Alert';

const AssignOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [partners, setPartners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedPartnerId, setSelectedPartnerId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch unassigned orders
        const ordersData = await orderService.getUnassignedOrders();
        setOrders(ordersData);
        
        // Fetch active partners
        const partnersData = await partnerService.getActivePartners();
        setPartners(partnersData);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    if (!selectedOrderId || !selectedPartnerId) {
      setError('Please select both an order and a pickup partner.');
      setSubmitting(false);
      return;
    }
    
    try {
      await orderService.assignOrder(selectedOrderId, { partnerId: selectedPartnerId });
      navigate(`/orders/${selectedOrderId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign order. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Assign Order to Pickup Partner</h2>
      
      {error && <Alert type="error" message={error} />}
      
      {orders.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded mb-6">
          <p className="text-yellow-700">No unassigned orders are available at the moment.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Order</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Select an Order --</option>
                {orders.map(order => (
                  <option key={order._id} value={order._id}>
                    Order #{order._id.substring(0, 8)} - {order.customerName} - ₹{order.amount}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Pickup Partner</label>
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Select a Partner --</option>
                {partners.map(partner => (
                  <option key={partner._id} value={partner._id}>
                    {partner.name} - Wallet Balance: ₹{partner.wallet?.balance || 0}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {submitting ? 'Assigning...' : 'Assign Order'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AssignOrder;