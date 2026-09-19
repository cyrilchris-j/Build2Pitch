const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const { authenticate } = require('../middleware/auth');

// Dice / roll-flow routes (must be declared before /:id)
router.get('/available', authenticate, ideaController.getAvailable);
router.get('/my-idea', authenticate, ideaController.getMyIdea);
router.post('/roll', authenticate, ideaController.rollIdea);
router.post('/lock', authenticate, ideaController.lockIdea);

router.get('/', authenticate, ideaController.getAllIdeas);
router.get('/:id', authenticate, ideaController.getIdeaById);

module.exports = router;