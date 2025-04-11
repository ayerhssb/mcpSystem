const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/mcpController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/dashboard', protect, getDashboardData);

module.exports = router;