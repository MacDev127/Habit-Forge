const express = require('express');
const {
  registerUser,
  loginUser,
  checkEmailExists,
} = require('../controllers/userController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/check-email', checkEmailExists); // ✅ New Route to Check Email

router.post('/logout', (req, res) => {
  res.clearCookie('token'); // ✅ Clear token on logout
  res.json({ message: 'Logged out successfully' });
});

// ✅ Get Current User
router.get('/me', authenticateUser, async (req, res) => {
  try {
    res.json({
      id: req.user.userId, // ✅ Extracted from JWT
      username: req.user.username,
      email: req.user.email,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching user', error: error.message });
  }
});

module.exports = router;
