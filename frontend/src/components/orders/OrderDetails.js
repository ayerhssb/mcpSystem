// src/components/orders/OrderDetails.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import orderService from "../../services/orderService";
import partnerService from "../../services/partnerService";
import Loader from "../common/Loader";
import Alert from "../common/Alert";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderData = await orderService.getOrderById(id);
        setOrder(orderData);

        if (orderData.pickupPartner) {
          setSelectedPartnerId(orderData.pickupPartner._id);
        }

        // Fetch available partners for assignment
        if (orderData.status !== "completed") {
          const partnersData = await partnerService.getActivePartners();
          setPartners(partnersData);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load order details. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAssignPartner = async () => {
    if (!selectedPartnerId) {
      setError("Please select a partner to assign.");
      return;
    }

    try {
      await orderService.assignOrder(id, { partnerId: selectedPartnerId });

      // Refresh order data
      const updatedOrder = await orderService.getOrderById(id);
      setOrder(updatedOrder);

      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to assign partner. Please try again."
      );
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await orderService.updateOrderStatus(id, { status: newStatus });

      // Refresh order data
      const updatedOrder = await orderService.getOrderById(id);
      setOrder(updatedOrder);

      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update order status. Please try again."
      );
    }
  };

  if (loading) return <Loader />;

  if (!order) return <Alert type="error" message="Order not found" />;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">
              Order #{order._id.substring(0, 8)}
            </h2>
            <div className="mt-2 text-gray-600">
              <p>Created on: {new Date(order.createdAt).toLocaleString()}</p>
              <p className="mt-2">
                Status:
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "in_progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status.replace("_", " ").charAt(0).toUpperCase() +
                    order.status.replace("_", " ").slice(1)}
                </span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Order Amount</p>
              <p className="text-2xl font-bold">₹{order.amount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {error && <Alert type="error" message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-medium mb-3">Customer Information</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p>
                <strong>Name:</strong> {order.customerName}
              </p>
              <p>
                <strong>Phone:</strong> {order.customerPhone}
              </p>
              <p>
                <strong>Email:</strong> {order.customerEmail || "N/A"}
              </p>
            </div>
          </div>

          {/* Pickup Location */}
          <div>
            <h3 className="text-lg font-medium mb-3">Pickup Location</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p>{order.pickupAddress}</p>
              {order.pickupCoordinates && (
                <p className="mt-2 text-sm text-gray-500">
                  Coordinates: {order.pickupCoordinates.lat},{" "}
                  {order.pickupCoordinates.lng}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pickup Partner Assignment */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">Pickup Partner</h3>

          {order.status === "completed" ? (
            <div className="bg-gray-50 p-4 rounded">
              {order.pickupPartner ? (
                <>
                  <p>
                    <strong>Name:</strong> {order.pickupPartner.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.pickupPartner.phone}
                  </p>
                  <p>
                    <strong>Completed on:</strong>{" "}
                    {order.completedAt
                      ? new Date(order.completedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </>
              ) : (
                <p>No pickup partner was assigned to this order.</p>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded">
              {order.pickupPartner ? (
                <div className="mb-4">
                  <p>
                    <strong>Current Assignment:</strong>{" "}
                    {order.pickupPartner.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.pickupPartner.phone}
                  </p>
                </div>
              ) : (
                <p className="mb-4">No pickup partner assigned yet.</p>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {order.pickupPartner ? "Reassign Partner" : "Assign Partner"}
                </label>
                <div className="flex">
                  <select
                    value={selectedPartnerId}
                    onChange={(e) => setSelectedPartnerId(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a partner</option>
                    {partners.map((partner) => (
                      <option key={partner._id} value={partner._id}>
                        {partner.name} - ₹{partner.wallet?.balance || 0} balance
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignPartner}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">Order Details</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p>
              <strong>Items:</strong> {order.items || "Not specified"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {order.description || "No description provided"}
            </p>
            <p>
              <strong>Special Instructions:</strong>{" "}
              {order.specialInstructions || "None"}
            </p>
          </div>
        </div>

        {/* Status Management */}
        {order.status !== "completed" && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3">Update Status</h3>
            <div className="flex space-x-3">
              {order.status === "pending" && (
                <button
                  onClick={() => handleUpdateStatus("in_progress")}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  disabled={!order.pickupPartner}
                >
                  Mark as In Progress
                </button>
              )}

              {(order.status === "pending" ||
                order.status === "in_progress") && (
                <button
                  onClick={() => handleUpdateStatus("completed")}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={!order.pickupPartner}
                >
                  Mark as Completed
                </button>
              )}

              {!order.pickupPartner && order.status !== "completed" && (
                <p className="text-sm text-red-500 mt-2">
                  You must assign a pickup partner before changing the order
                  status.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
