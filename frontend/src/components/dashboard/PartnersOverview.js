// src/components/dashboard/PartnersOverview.js
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import { Users, ChevronRight } from 'lucide-react';

const PartnersOverview = ({ partners = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="bg-purple-100 p-2 rounded-lg mr-3">
            <Users size={20} className="text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Top Partners</h3>
        </div>
        <Link to="/partners" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
          View All
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>

      {partners.length === 0 ? (
        <div className="text-gray-500 bg-gray-50 p-8 rounded-lg text-center">
          <p>No partners found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {partners.map((partner) => (
            <div key={partner.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <div>
                <p className="font-medium text-gray-800">{partner.name}</p>
                <p className="text-sm text-gray-500">{partner.email}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{formatCurrency(partner.balance)}</p>
                <Link to={`/partners/${partner.id}`} className="text-blue-600 hover:text-blue-800 text-xs inline-flex items-center mt-1">
                  Details
                  <ChevronRight size={12} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnersOverview;