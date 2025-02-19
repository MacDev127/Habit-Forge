const express = require('express');
const {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
} = require('../backend/controllers/habitController');
const { authenticateUser } = require('../backend/middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateUser, createHabit);
router.get('/', authenticateUser, getHabits);
router.put('/:habitId', authenticateUser, updateHabit);
router.delete('/:habitId', authenticateUser, deleteHabit);

module.exports = router;
