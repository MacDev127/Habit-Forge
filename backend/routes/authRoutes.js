const express = require('express');
const router = express.Router();

// ✅ Get Current User (From Token)
router.get('/user', (req, res) => {
  const user = req.user; // Ensure user is extracted from JWT in middleware
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  res.json(user);
});

module.exports = router;
