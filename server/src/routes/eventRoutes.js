const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, authorize } = require('../middleware/auth');

// Public: anyone can read event settings (for countdown etc.)
router.get('/settings', eventController.getSettings);

// Admin only: update event settings
router.put('/settings', authenticate, authorize(['ADMIN', 'admin']), eventController.updateSettings);

module.exports = router;
