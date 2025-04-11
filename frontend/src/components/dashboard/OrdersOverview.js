// src/components/dashboard/OrdersOverview.js
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CircleCheck, Clock, ChevronRight, FileText } from 'lucide-react';

const OrdersOverview = ({ orders = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="bg-orange-100 p-2 rounded-lg mr-3">
            <FileText size={20} className="text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
        </div>
        <Link to="/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
          View All
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-gray-500 bg-gray-50 p-8 rounded-lg text-center">
          <p>No recent orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${
                  order.status === 'COMPLETED' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {order.status === 'COMPLETED' ? 
                    <CircleCheck size={18} className="text-green-600" /> : 
                    <Clock size={18} className="text-yellow-600" />
                  }
                </div>
                <div>
                  <p className="font-medium text-gray-800">{order.title}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{formatCurrency(order.amount)}</p>
                <span className={`text-xs px-3 py-1 rounded-full inline-block mt-1 font-medium ${
                  order.status === 'COMPLETED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersOverview;