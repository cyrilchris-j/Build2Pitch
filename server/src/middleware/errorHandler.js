const logger = require('../utils/logger');
const { errorResponse } = require('../utils/response');

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled error at ${req.method} ${req.url}:`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return errorResponse(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
};

module.exports = errorHandler;
