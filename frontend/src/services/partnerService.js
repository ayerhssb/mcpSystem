// src/services/partnerService.js
import api from './api';

const partnerService = {
  getAllPartners: async (page = 1, limit = 10, search = '', status = '') => {
    return api.get(`/partners?page=${page}&limit=${limit}&search=${search}&status=${status}`);
  },

  getPartnerById: async (partnerId) => {
    return api.get(`/partners/${partnerId}`);
  },

  createPartner: async (partnerData) => {
    return api.post('/partners', partnerData);
  },

  updatePartner: async (partnerId, partnerData) => {
    return api.put(`/partners/${partnerId}`, partnerData);
  },

  deletePartner: async (partnerId) => {
    return api.delete(`/partners/${partnerId}`);
  },

  getPartnerStatistics: async () => {
    return api.get('/partners/statistics');
  },
};

export default partnerService;
