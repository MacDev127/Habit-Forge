const express = require('express');
const passport = require('passport');

const router = express.Router();

// ✅ Google OAuth Route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// ✅ Google Callback Route
router.get(
  '/callback/google',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:3000/dashboard'); // Redirect frontend after login
  }
);

// ✅ GitHub OAuth Route
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// ✅ GitHub Callback Route
router.get(
  '/callback/github',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:3000/dashboard');
  }
);

// ✅ Logout Route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.redirect('http://localhost:3000');
  });
});

// ✅ Get Current User
router.get('/user', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  res.json(req.user);
});

module.exports = router;
