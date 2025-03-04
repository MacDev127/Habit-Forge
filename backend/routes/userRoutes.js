const express = require('express');
const {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  checkEmailExists,
  requestPasswordReset,
  resetPassword,
} = require('../controllers/userController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Register
router.post('/register', registerUser);

//  Login
router.post('/login', loginUser);

// Get Current User (`/me`)
router.get('/me', authenticateUser, getUser);

// Logout
router.post('/logout', logoutUser);

// Check if Email Exists
router.post('/check-email', checkEmailExists);

// Password Reset
router.post(
  '/forgot-password',
  (req, res, next) => {
    console.log('🚀 forgot-password route HIT');
    next();
  },
  requestPasswordReset
);
router.post('/reset-password', resetPassword);

module.exports = router;
