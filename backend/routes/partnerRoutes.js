const express = require('express');
const router = express.Router();
const {
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  getPartnerStatistics,
} = require('../controllers/partnerController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getPartners)
  .post(protect, createPartner);

router.get('/statistics', protect, getPartnerStatistics);

router.route('/:id')
  .get(protect, getPartnerById)
  .put(protect, updatePartner)
  .delete(protect, deletePartner);

module.exports = router;