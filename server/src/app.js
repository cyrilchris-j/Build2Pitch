const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');
const connectDB = require('./config/db');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const { seedIfEmpty } = require('./services/seedService');

const app = express();

// Middleware
app.use(cors({
  origin: env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root ping
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'BUILD2PITCH Backend API Server is operational',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start server if run directly
if (require.main === module) {
  connectDB().then(async (conn) => {
    if (conn) {
      try {
        const seeded = await seedIfEmpty();
        if (seeded) logger.info('Seeded default startup ideas');
      } catch (err) {
        logger.warn(`Seed skipped: ${err.message}`);
      }
    }

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 BUILD2PITCH Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`🔗 API Health: http://localhost:${env.PORT}/api/health`);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      logger.info('Shutting down server gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });
  });
}

module.exports = app;
