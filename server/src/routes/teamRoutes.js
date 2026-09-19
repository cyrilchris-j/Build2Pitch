const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, teamController.createTeam);
router.get('/me', authenticate, teamController.getTeam);
router.post('/members', authenticate, teamController.addMember);
router.put('/members/:id', authenticate, teamController.updateMember);
router.delete('/members/:id', authenticate, teamController.removeMember);
router.get('/me/idea', authenticate, teamController.getAssignedIdea);

module.exports = router;
