const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// Enforce authentication + admin role authorization on all admin routes
router.use(authenticate);
router.use(authorize(['admin']));

router.get('/stats', adminController.getStats);
router.get('/teams', adminController.getTeams);
router.get('/students', adminController.getStudents);
router.get('/ideas', adminController.getIdeas);
router.post('/ideas', adminController.createIdea);
router.put('/ideas/:id', adminController.updateIdea);
router.delete('/ideas/:id', adminController.deleteIdea);
router.get('/submissions', adminController.getSubmissions);

module.exports = router;
