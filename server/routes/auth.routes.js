const express = require('express');
const {
  register,
  login,
  logout,
  getMe
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Register and login routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router; 