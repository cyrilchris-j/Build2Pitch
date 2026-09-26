const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// Enforce authentication + admin role authorization on all admin routes
router.use(authenticate);
router.use(authorize(['ADMIN', 'admin']));

router.get('/stats', adminController.getStats);
router.get('/teams', adminController.getTeams);
router.get('/teams/:id', adminController.getTeamById);
router.post('/teams/:id/members', adminController.adminAddMember);
router.delete('/teams/:id/members/:memberId', adminController.adminRemoveMember);
router.delete('/teams/:id/lead', adminController.adminRemoveTeamLead);
router.get('/students', adminController.getStudents);
router.get('/ideas', adminController.getIdeas);
router.post('/ideas', adminController.createIdea);
router.put('/ideas/:id', adminController.updateIdea);
router.delete('/ideas/:id', adminController.deleteIdea);
router.get('/submissions', adminController.getSubmissions);

module.exports = router;
