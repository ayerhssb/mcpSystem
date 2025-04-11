const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  assignOrder,
  getOrderStatistics,
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router.get('/statistics', protect, getOrderStatistics);

router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, updateOrder);

router.put('/:id/assign', protect, assignOrder);

module.exports = router;