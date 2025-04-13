import React, { useEffect, useState } from 'react';
import walletService from '../../services/walletService';
import { formatCurrency } from '../../utils/formatters';
import { Wallet, CreditCard, ArrowRightLeft, TrendingUp, TrendingDown, Plus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const WalletOverview = () => {
  const [wallet, setWallet] = useState({
    balance: 0,
    totalAdded: 0,
    totalWithdrawn: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      setLoading(true);
      try {
        const data = await walletService.getWalletBalance();
        setWallet(data);
        
        const tx = await walletService.getRecentTransactions(5);
        setRecentTransactions(Array.isArray(tx) ? tx : []);
      } catch (err) {
        console.error('Failed to fetch wallet data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  // Helper function for transaction icon
  const getTransactionIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'deposit':
        return <TrendingUp size={18} className="text-green-500" />;
      case 'withdrawal':
        return <TrendingDown size={18} className="text-red-500" />;
      case 'transfer':
        return <ArrowRightLeft size={18} className="text-blue-500" />;
      default:
        return <Clock size={18} className="text-gray-500" />;
    }
  };

  // Helper function for transaction status class
  const getAmountClass = (type) => {
    switch (type.toLowerCase()) {
      case 'deposit':
        return 'text-green-600';
      case 'withdrawal':
      case 'transfer':
        return 'text-red-600';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Wallet Overview</h1>
        <div className="flex space-x-2">
          <Link to="/wallet/add-funds" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm">
            <Plus size={16} className="mr-1" />
            Add Funds
          </Link>
          <Link to="/wallet/transfer" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center text-sm">
            <ArrowRightLeft size={16} className="mr-1" />
            Transfer
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Wallet Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Wallet size={24} />
                </div>
                <h2 className="ml-3 text-lg font-medium">Current Balance</h2>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(wallet.balance)}</p>
              <p className="text-blue-100 mt-2 text-sm">Available for transfers and withdrawals</p>
            </div>

            {/* Total Added Card */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Plus size={20} className="text-green-600" />
                </div>
                <h2 className="ml-3 text-lg font-medium text-gray-700">Total Added</h2>
              </div>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(wallet.totalAdded)}</p>
              <p className="text-gray-500 mt-2 text-sm">Lifetime deposits to your wallet</p>
            </div>

            {/* Total Withdrawn Card */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <TrendingDown size={20} className="text-red-600" />
                </div>
                <h2 className="ml-3 text-lg font-medium text-gray-700">Total Withdrawn</h2>
              </div>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(wallet.totalWithdrawn)}</p>
              <p className="text-gray-500 mt-2 text-sm">Lifetime withdrawals from your wallet</p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
              <Link to="/wallet/transactions" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="inline-flex bg-gray-100 p-3 rounded-full mb-4">
                  <CreditCard size={24} className="text-gray-500" />
                </div>
                <p className="text-gray-600 mb-2">No recent transactions.</p>
                <p className="text-gray-500 text-sm">When you add or transfer funds, your transactions will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id || tx._id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            {getTransactionIcon(tx.type)}
                            <span className="ml-2 font-medium text-gray-700 text-sm capitalize">
                              {tx.type}
                            </span>
                          </div>
                        </td>
                        <td className={`py-4 px-4 font-medium ${getAmountClass(tx.type)}`}>
                          {tx.type.toLowerCase() === 'deposit' ? '+' : '-'} {formatCurrency(tx.amount)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {new Date(tx.date || tx.createdAt).toLocaleDateString(undefined, { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 truncate max-w-xs">
                          {tx.description || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/wallet/add-funds" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center group">
                <div className="bg-blue-100 p-3 rounded-full mb-2 group-hover:bg-blue-200 transition">
                  <Plus size={20} className="text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium text-sm">Add Funds</span>
              </Link>
              <Link to="/wallet/transfer" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center group">
                <div className="bg-indigo-100 p-3 rounded-full mb-2 group-hover:bg-indigo-200 transition">
                  <ArrowRightLeft size={20} className="text-indigo-600" />
                </div>
                <span className="text-gray-700 font-medium text-sm">Transfer Funds</span>
              </Link>
              <Link to="/wallet/transactions" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center group">
                <div className="bg-green-100 p-3 rounded-full mb-2 group-hover:bg-green-200 transition">
                  <Clock size={20} className="text-green-600" />
                </div>
                <span className="text-gray-700 font-medium text-sm">Transaction History</span>
              </Link>
              <Link to="/wallet/settings" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center group">
                <div className="bg-gray-100 p-3 rounded-full mb-2 group-hover:bg-gray-200 transition">
                  <CreditCard size={20} className="text-gray-600" />
                </div>
                <span className="text-gray-700 font-medium text-sm">Payment Methods</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletOverview;