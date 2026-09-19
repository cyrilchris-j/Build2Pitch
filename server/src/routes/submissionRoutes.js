const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate } = require('../middleware/auth');

router.get('/me', authenticate, submissionController.getSubmission);
router.post('/draft', authenticate, submissionController.saveDraft);
router.post('/final', authenticate, submissionController.submitFinal);

module.exports = router;
