const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const teamRoutes = require('./teamRoutes');
const ideaRoutes = require('./ideaRoutes');
const submissionRoutes = require('./submissionRoutes');
const adminRoutes = require('./adminRoutes');
const eventRoutes = require('./eventRoutes');

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'NEXTGEN by BUILD2PITCH — Backend API',
    version: '1.0.0',
  });
});

// Modular domain routes
router.use('/auth', authRoutes);
router.use('/teams', teamRoutes);
router.use('/ideas', ideaRoutes);
router.use('/submissions', submissionRoutes);
router.use('/admin', adminRoutes);
router.use('/event', eventRoutes);

module.exports = router;
