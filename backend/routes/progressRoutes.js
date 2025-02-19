const express = require('express');
const {
  markHabitProgress,
  getProgress,
} = require('../controllers/progressController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateUser, markHabitProgress);
router.get('/:habitId', authenticateUser, getProgress);

module.exports = router;
