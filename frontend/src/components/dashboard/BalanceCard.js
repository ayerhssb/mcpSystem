// src/components/dashboard/BalanceCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import { Plus, ArrowUpRight, CreditCard } from 'lucide-react';

const BalanceCard = ({ balance }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full opacity-20 -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full opacity-20 -ml-12 -mb-12"></div>
      
      <div className="flex items-center mb-2">
        <CreditCard className="mr-2" size={20} />
        <h3 className="text-lg font-semibold text-white opacity-90">Wallet Balance</h3>
      </div>
      
      <p className="text-4xl font-bold mb-4 mt-2">
        {formatCurrency(balance || 0)}
      </p>
      
      <div className="flex space-x-3 mt-4">
        <Link
          to="/wallet/add-funds"
          className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 shadow-sm"
        >
          <Plus size={16} className="mr-1" />
          Add Funds
        </Link>
        <Link
          to="/wallet/transfer"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center border border-blue-400 hover:bg-blue-800 transition-all duration-200"
        >
          <ArrowUpRight size={16} className="mr-1" />
          Transfer
        </Link>
      </div>
    </div>
  );
};

export default BalanceCard;