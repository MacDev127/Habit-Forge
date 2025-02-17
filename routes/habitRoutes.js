const express = require('express');
const {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
} = require('../controllers/habitController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateUser, createHabit);
router.get('/', authenticateUser, getHabits);
router.put('/:habitId', authenticateUser, updateHabit);
router.delete('/:habitId', authenticateUser, deleteHabit);

module.exports = router;
