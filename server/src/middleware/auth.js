const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { errorResponse } = require('../utils/response');

/**
 * Authentication & Authorization Middleware Placeholder
 * NOTE: Authentication logic is bypassed in the foundation phase.
 * Ready to verify Bearer JWT token and attach req.user in next sprint.
 */

const authenticate = (req, res, next) => {
  // Placeholder pass-through
  // Future implementation:
  // const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return errorResponse(res, 'Authentication required', 401);
  // }
  // const token = authHeader.split(' ')[1];
  // try {
  //   const decoded = jwt.verify(token, env.JWT_SECRET);
  //   req.user = decoded;
  //   next();
  // } catch (err) {
  //   return errorResponse(res, 'Invalid or expired token', 401);
  // }
  next();
};

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    // Placeholder pass-through
    // if (!req.user || !allowedRoles.includes(req.user.role)) {
    //   return errorResponse(res, 'Access forbidden: Insufficient permissions', 403);
    // }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
