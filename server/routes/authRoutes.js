const express = require('express');
const router = express.Router();
const { register, login, resetPassword } = require('../controllers/authController');

// POST /api/auth/register - Register new user
router.post('/register', register);

// POST /api/auth/login - Login user
router.post('/login', login);

// POST /api/auth/reset-password - Reset password
router.post('/reset-password', resetPassword);

module.exports = router;
