const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const teamRoutes = require('./teamRoutes');
const ideaRoutes = require('./ideaRoutes');
const submissionRoutes = require('./submissionRoutes');
const adminRoutes = require('./adminRoutes');

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'BUILD2PITCH Backend API',
    version: '1.0.0',
  });
});

// Modular domain routes
router.use('/auth', authRoutes);
router.use('/teams', teamRoutes);
router.use('/ideas', ideaRoutes);
router.use('/submissions', submissionRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
