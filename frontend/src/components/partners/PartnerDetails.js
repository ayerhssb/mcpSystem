// src/components/partners/PartnerDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import partnerService from '../../services/partnerService';
import orderService from '../../services/orderService';
import walletService from '../../services/walletService';
import Loader from '../common/Loader';
import Alert from '../common/Alert';

const PartnerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [partner, setPartner] = useState(null);
    const [orders, setOrders] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('info');
    const [transferAmount, setTransferAmount] = useState('');
  
    useEffect(() => {
      const fetchPartnerData = async () => {
        try {
          const partnerData = await partnerService.getPartnerById(id);
          setPartner(partnerData);
          
          // Fetch partner's orders
          const ordersData = await orderService.getPartnerOrders(id);
          setOrders(ordersData);
          
          // Fetch partner's wallet transactions
          const transactionsData = await walletService.getPartnerTransactions(id);
          setTransactions(transactionsData);
          
          setLoading(false);
        } catch (err) {
          setError('Failed to load partner details. Please try again.');
          setLoading(false);
        }
      };
  
      fetchPartnerData();
    }, [id]);
  
    const handleStatusChange = async (status) => {
      try {
        await partnerService.updatePartner(id, { status });
        setPartner({ ...partner, status });
      } catch (err) {
        setError('Failed to update partner status. Please try again.');
      }
    };
  
    const handleTransferFunds = async (e) => {
      e.preventDefault();
      
      if (!transferAmount || isNaN(transferAmount) || parseFloat(transferAmount) <= 0) {
        setError('Please enter a valid amount to transfer.');
        return;
      }
      
      try {
        await walletService.transferFunds({
          partnerId: id,
          amount: parseFloat(transferAmount)
        });
        
        // Refresh partner data to show updated balance
        const updatedPartner = await partnerService.getPartnerById(id);
        setPartner(updatedPartner);
        
        // Refresh transactions
        const updatedTransactions = await walletService.getPartnerTransactions(id);
        setTransactions(updatedTransactions);
        
        setTransferAmount('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to transfer funds. Please try again.');
      }
    };
  
    if (loading) return <Loader />;
    
    if (!partner) return <Alert type="error" message="Partner not found" />;
  
    return (
      <div className="bg-white rounded-lg shadow">
        {/* Partner header with basic info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold">{partner.name}</h2>
              <div className="mt-2 text-gray-600">
                <p>Email: {partner.email}</p>
                <p>Phone: {partner.phone}</p>
                <p className="mt-2">
                  Status: 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    partner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Wallet Balance</p>
                <p className="text-2xl font-bold">₹{partner.wallet?.balance || 0}</p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                {partner.status === 'active' ? (
                  <button
                    onClick={() => handleStatusChange('inactive')}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange('active')}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Activate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`px-6 py-3 text-center border-b-2 font-medium ${
                activeTab === 'info' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('info')}
            >
              Partner Info
            </button>
            <button
              className={`px-6 py-3 text-center border-b-2 font-medium ${
                activeTab === 'orders' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button
              className={`px-6 py-3 text-center border-b-2 font-medium ${
                activeTab === 'wallet' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('wallet')}
            >
              Wallet & Transactions
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="p-6">
          {error && <Alert type="error" message={error} />}
          
          {activeTab === 'info' && (
            <div>
              <h3 className="text-xl font-medium mb-4">Partner Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Commission Details</h4>
                  <p className="mt-1">
                    Type: {partner.commissionType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                  </p>
                  <p>
                    {partner.commissionType === 'percentage' 
                      ? `Commission: ${partner.commissionValue}%` 
                      : `Fixed Amount: ₹${partner.commissionValue} per order`}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Performance</h4>
                  <p className="mt-1">Total Orders Completed: {partner.ordersCompleted || 0}</p>
                  <p>Total Earnings: ₹{partner.totalEarnings || 0}</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div>
              <h3 className="text-xl font-medium mb-4">Orders</h3>
              {orders.length === 0 ? (
                <p>No orders found for this partner.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left">Order ID</th>
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Amount</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-t hover:bg-gray-50">
                          <td className="py-3 px-4">{order._id.substring(0, 8)}...</td>
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
                            <button 
                              onClick={() => navigate(`/orders/${order._id}`)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'wallet' && (
            <div>
              <h3 className="text-xl font-medium mb-4">Wallet Management</h3>
              
              {/* Transfer funds form */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-2">Transfer Funds to Partner</h4>
                <form onSubmit={handleTransferFunds} className="flex items-end space-x-4">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      min="1"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Transfer
                  </button>
                </form>
              </div>
              
              {/* Transactions history */}
              <h4 className="font-medium mb-2">Transaction History</h4>
              {transactions.length === 0 ? (
                <p>No transactions found for this partner.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left">Transaction ID</th>
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-left">Type</th>
                        <th className="py-3 px-4 text-left">Amount</th>
                        <th className="py-3 px-4 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction._id} className="border-t hover:bg-gray-50">
                          <td className="py-3 px-4">{transaction._id.substring(0, 8)}...</td>
                          <td className="py-3 px-4">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              transaction.type === 'credit' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">₹{transaction.amount}</td>
                          <td className="py-3 px-4">{transaction.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default PartnerDetails;