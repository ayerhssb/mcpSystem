const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/check', protect, checkAuth);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;