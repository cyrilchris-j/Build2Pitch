const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All admin routes protected by admin role
router.use(authenticate);
router.use(authorize(['admin']));

router.get('/stats', adminController.getStats);
router.get('/teams', adminController.getTeams);
router.get('/students', adminController.getStudents);
router.get('/ideas', adminController.getIdeas);
router.get('/submissions', adminController.getSubmissions);
router.patch('/settings', adminController.updateSettings);

module.exports = router;
