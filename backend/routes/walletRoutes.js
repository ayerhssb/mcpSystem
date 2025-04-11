const express = require('express');
const router = express.Router();
const {
  getWalletBalance,
  addFunds,
  transferToPartner,
  getTransactions,
  withdrawFunds,
} = require('../controllers/walletController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/balance', protect, getWalletBalance);
router.post('/add-funds', protect, addFunds);
router.post('/transfer-to-partner', protect, transferToPartner);
router.get('/transactions', protect, getTransactions);
router.post('/withdraw', protect, withdrawFunds);

module.exports = router;