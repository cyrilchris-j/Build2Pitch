const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, ideaController.getAllIdeas);
router.get('/:id', authenticate, ideaController.getIdeaById);

module.exports = router;
