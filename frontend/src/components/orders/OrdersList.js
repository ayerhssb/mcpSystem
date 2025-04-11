// src/components/orders/OrdersList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import Loader from '../common/Loader';
import Alert from '../common/Alert';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, in_progress, completed

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) return <Loader />;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <Link 
          to="/orders/create" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Order
        </Link>
      </div>
      
      {error && <Alert type="error" message={error} />}
      
      {/* Filter tabs */}
      <div className="flex mb-4 border-b">
        <button 
          className={`px-4 py-2 font-medium border-b-2 ${
            filter === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent'
          }`}
          onClick={() => setFilter('all')}
        >
          All Orders
        </button>
        <button 
          className={`px-4 py-2 font-medium border-b-2 ${
            filter === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent'
          }`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`px-4 py-2 font-medium border-b-2 ${
            filter === 'in_progress' ? 'border-blue-500 text-blue-600' : 'border-transparent'
          }`}
          onClick={() => setFilter('in_progress')}
        >
          In Progress
        </button>
        <button 
          className={`px-4 py-2 font-medium border-b-2 ${
            filter === 'completed' ? 'border-blue-500 text-blue-600' : 'border-transparent'
          }`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>
      
      {filteredOrders.length === 0 ? (
        <p>No orders found with the selected filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Pickup Partner</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{order._id.substring(0, 8)}...</td>
                  <td className="py-3 px-4">{order.customerName}</td>
                  <td className="py-3 px-4">
                    {order.pickupPartner ? order.pickupPartner.name : 'Not Assigned'}
                  </td>
                  <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'in_progress' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.replace('_', ' ').slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">₹{order.amount}</td>
                  <td className="py-3 px-4">
                    <Link 
                      to={`/orders/${order._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View
                    </Link>
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

export default OrdersList;

