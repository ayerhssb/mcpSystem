// src/services/walletService.js
import api from './api';

const walletService = {
  getWalletBalance: async () => {
    const res = await api.get('/wallet/balance');
    return res; // returns { balance, totalAdded, ... }
  },

  getTransactions: async ({ page = 1, limit = 10, type = '', startDate = '', endDate = '' } = {}) => {
    const params = { page, limit };
    if (type && type !== 'all') params.type = type;
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    const res = await api.get('/wallet/transactions', { params });
    return res; // returns { transactions, total, page }
  },

  getRecentTransactions: async (limit = 5) => {
    const res = await api.get('/wallet/transactions', { params: { limit } });
    return Array.isArray(res.transactions) ? res.transactions.slice(0, limit) : [];
  },

  addFunds: async ({ amount, paymentMethod, paymentDetails }) => {
    return await api.post('/wallet/add-funds', { amount, paymentMethod, paymentDetails });
  },

  transferFunds: async ({ partnerId, amount, description }) => {
    return await api.post('/wallet/transfer-to-partner', { partnerId, amount, description });
  },

  withdrawFunds: async ({ amount, bankDetails, description }) => {
    return await api.post('/wallet/withdraw', { amount, bankDetails, description });
  }
};

export default walletService;
