const express = require('express');
const {
  markHabitProgress,
  getProgress,
} = require('../backend/controllers/progressController');
const { authenticateUser } = require('../backend/middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateUser, markHabitProgress);
router.get('/:habitId', authenticateUser, getProgress);

module.exports = router;
