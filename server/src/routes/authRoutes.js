const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// Team Lead & General Registration
router.post('/register', authController.register);

// Team Lead / General Login
router.post('/login', authController.login);

// Team Member Login
router.post('/member-login', authController.memberLogin);

// Admin Login
router.post('/admin-login', authController.adminLogin);

// Current User Profile (Protected)
router.get('/me', requireAuth, authController.getProfile);

module.exports = router;

