const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticate, authorize } = require('../middleware/auth');

// All team routes require authentication
router.use(authenticate);

router.get('/me', teamController.getTeamDashboard);
router.get('/me/members', teamController.getMembers);
router.post('/me/members', authorize(['TEAM_LEAD', 'team_lead']), teamController.addMember);
router.delete('/me/members/:memberId', authorize(['TEAM_LEAD', 'team_lead']), teamController.removeMember);
router.get('/me/idea', teamController.getAssignedIdea);

module.exports = router;
