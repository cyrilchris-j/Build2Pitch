const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticate } = require('../middleware/auth');

router.get('/me', authenticate, teamController.getTeamDashboard);
router.get('/me/members', authenticate, teamController.getMembers);
router.post('/me/members', authenticate, teamController.addMember);
router.get('/me/idea', authenticate, teamController.getAssignedIdea);

module.exports = router;
