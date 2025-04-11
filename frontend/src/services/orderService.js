// src/services/orderService.js
import api from './api';

const orderService = {
  getAllOrders: async (filters = {}) => {
    return api.get('/orders', { params: filters });
  },
  
  getOrder: async (id) => {
    return api.get(`/orders/${id}`);
  },
  
  createOrder: async (orderData) => {
    return api.post('/orders', orderData);
  },
  
  updateOrder: async (id, orderData) => {
    return api.put(`/orders/${id}`, orderData);
  },
  
  deleteOrder: async (id) => {
    return api.delete(`/orders/${id}`);
  },
  
  assignOrder: async (orderId, partnerId) => {
    return api.post(`/orders/${orderId}/assign`, { partnerId });
  },
  
  updateOrderStatus: async (id, status) => {
    return api.patch(`/orders/${id}/status`, { status });
  },
  
  getOrderStats: async () => {
    return api.get('/orders/stats');
  },
  
  getPartnerOrders: async (partnerId) => {
    return api.get(`/partners/${partnerId}/orders`);
  },
};

export default orderService;