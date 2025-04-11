// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

// Layout Components
import Layout from "./components/layout/Layout";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Dashboard Components
import Dashboard from "./components/dashboard/Dashboard";

// Partners Components
import PartnersList from "./components/partners/PartnersList";
import AddPartner from "./components/partners/AddPartner";
import PartnerDetails from "./components/partners/PartnerDetails";

// Orders Components
import OrdersList from "./components/orders/OrdersList";
import OrderDetails from "./components/orders/OrderDetails";
import AssignOrder from "./components/orders/AssignOrder";

// Wallet Components
import WalletOverview from "./components/wallet/WalletOverview";
import AddFunds from "./components/wallet/AddFunds";
import TransferFunds from "./components/wallet/TransferFunds";
import TransactionHistory from "./components/wallet/TransactionHistory";

// Styles
import "./styles/global.css";

// Auth Route Guard
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Changed from "authToken" to "token"
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes with Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard as index route */}
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Partners Routes */}
              <Route path="partners" element={<PartnersList />} />
              <Route path="partners/add" element={<AddPartner />} />
              <Route path="partners/:id" element={<PartnerDetails />} />

              {/* Orders Routes */}
              <Route path="orders" element={<OrdersList />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="orders/assign/:id" element={<AssignOrder />} />

              {/* Wallet Routes */}
              <Route path="wallet" element={<WalletOverview />} />
              <Route path="wallet/add-funds" element={<AddFunds />} />
              <Route path="wallet/transfer" element={<TransferFunds />} />
              <Route path="wallet/transactions" element={<TransactionHistory />} />
            </Route>

            {/* Catch-all redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;