const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate } = require('../middleware/auth');

// All submission endpoints require authentication
router.get('/me', authenticate, submissionController.getSubmission);
router.put('/me', authenticate, submissionController.saveDraft);
router.post('/final-submit', authenticate, submissionController.submitFinal);

module.exports = router;
