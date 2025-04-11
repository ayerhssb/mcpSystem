// src/services/partnerService.js
import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios with authentication
const configureAxios = () => {
  const token = getAuthToken();
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all partners
const getAllPartners = async (page = 1, limit = 10, search = '', status = '') => {
  try {
    const response = await axios.get(
      `${API_URL}/partners?page=${page}&limit=${limit}&search=${search}&status=${status}`,
      configureAxios()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get partner by ID
const getPartnerById = async (partnerId) => {
  try {
    const response = await axios.get(
      `${API_URL}/partners/${partnerId}`,
      configureAxios()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new partner
const createPartner = async (partnerData) => {
  try {
    const response = await axios.post(
      `${API_URL}/partners`,
      partnerData,
      configureAxios()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update partner
const updatePartner = async (partnerId, partnerData) => {
  try {
    const response = await axios.put(
      `${API_URL}/partners/${partnerId}`,
      partnerData,
      configureAxios()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete partner
const deletePartner = async (partnerId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/partners/${partnerId}`,
      configureAxios()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get partner statistics
const getPartnerStatistics = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/partners/statistics`,
      configureAxios()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const partnerService = {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  getPartnerStatistics,
};

export default partnerService;