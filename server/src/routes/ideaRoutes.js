const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const { authenticate } = require('../middleware/auth');

// Team 3-option problem selection & own idea submission
router.get('/options', authenticate, ideaController.getTeamIdeaOptions);
router.post('/select', authenticate, ideaController.selectIdea);
router.post('/own-idea', authenticate, ideaController.submitOwnIdea);

// Dice / roll-flow routes (legacy compatibility)
router.get('/available', authenticate, ideaController.getAvailable);
router.get('/my-idea', authenticate, ideaController.getMyIdea);
router.post('/roll', authenticate, ideaController.rollIdea);
router.post('/lock', authenticate, ideaController.lockIdea);

router.get('/', authenticate, ideaController.getAllIdeas);
router.get('/:id', authenticate, ideaController.getIdeaById);

module.exports = router;