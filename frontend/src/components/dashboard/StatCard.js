import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  // Fix the background color and text color classes
  const getColorClasses = (colorName) => {
    switch(colorName) {
      case 'green':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      case 'purple':
        return { bg: 'bg-purple-100', text: 'text-purple-800' };
      case 'blue':
        return { bg: 'bg-blue-100', text: 'text-blue-800' };
      case 'orange':
        return { bg: 'bg-orange-100', text: 'text-orange-800' };
      case 'red':
        return { bg: 'bg-red-100', text: 'text-red-800' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const { bg, text } = getColorClasses(color);
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;