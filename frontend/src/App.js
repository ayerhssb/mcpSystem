// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/auth/PrivateRoute";

// Auth
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Dashboard
import Dashboard from "./components/dashboard/Dashboard";

// Partners
import PartnersList from "./components/partners/PartnersList";
import AddPartner from "./components/partners/AddPartner";
import PartnerDetails from "./components/partners/PartnerDetails";

// Orders
import OrdersList from "./components/orders/OrdersList";
import OrderDetails from "./components/orders/OrderDetails";
import AssignOrder from "./components/orders/AssignOrder";

// Wallet
import WalletOverview from "./components/wallet/WalletOverview";
import AddFunds from "./components/wallet/AddFunds";
import TransferFunds from "./components/wallet/TransferFunds";
import TransactionHistory from "./components/wallet/TransactionHistory";

//profile
import Profile from "./components/profile/Profile";


import "./styles/global.css";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ToastContainer position="top-right" autoClose={5000} />

          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/profile" element={<Profile />} />


                {/* Partners Routes */}
                <Route path="/partners" element={<PartnersList />} />
                <Route path="/partners/add" element={<AddPartner />} />
                <Route path="/partners/:id" element={<PartnerDetails />} />

                {/* Orders Routes */}
                <Route path="/orders" element={<OrdersList />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/orders/assign/:id" element={<AssignOrder />} />

                {/* Wallet Routes */}
                <Route path="/wallet" element={<WalletOverview />} />
                <Route path="/wallet/add-funds" element={<AddFunds />} />
                <Route path="/wallet/transfer" element={<TransferFunds />} />
                <Route path="/wallet/transactions" element={<TransactionHistory />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
