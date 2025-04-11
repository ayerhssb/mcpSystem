// src/components/dashboard/Dashboard.js
import React, { useState } from "react";
import BalanceCard from "./BalanceCard";
import OrdersOverview from "./OrdersOverview";
import PartnersOverview from "./PartnersOverview";
import StatCard from "./StatCard";
import { FileText, Users } from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data
  const mockData = {
    walletBalance: 25000.0,
    totalOrders: 256,
    activePartners: 12,
    recentTransactions: [
      {
        id: 1,
        amount: 500,
        type: "CREDIT",
        description: "Added funds",
        date: new Date(),
      },
      {
        id: 2,
        amount: 150,
        type: "DEBIT",
        description: "Transfer to Partner A",
        date: new Date(Date.now() - 86400000),
      },
    ],
    partners: [
      {
        id: 1,
        name: "Partner A",
        email: "partnera@example.com",
        balance: 1200,
      },
      {
        id: 2,
        name: "Partner B",
        email: "partnerb@example.com",
        balance: 3400,
      },
    ],
    orders: [
      {
        id: 1,
        title: "Order #1001",
        status: "COMPLETED",
        amount: 250,
        date: new Date(),
      },
      {
        id: 2,
        title: "Order #1002",
        status: "PENDING",
        amount: 340,
        date: new Date(Date.now() - 172800000),
      },
    ],
  };

  if (loading)
    return <div className="flex justify-center p-12">Loading dashboard...</div>;
  if (error)
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-800">
        Error loading dashboard
      </div>
    );

  return (
    <div className="dashboard p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <div className="mt-4 md:mt-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              Download Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <BalanceCard balance={mockData.walletBalance} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
            <StatCard
              title="Total Orders"
              value={mockData.totalOrders}
              icon={<FileText size={22} className="text-green-600" />}
              color="green"
            />
            <StatCard
              title="Active Partners"
              value={mockData.activePartners}
              icon={<Users size={22} className="text-purple-600" />}
              color="purple"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <OrdersOverview orders={mockData.orders} />
          <PartnersOverview partners={mockData.partners} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
