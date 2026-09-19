const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { errorResponse } = require('../utils/response');

/**
 * Authentication & Authorization Middleware
 * Verifies Bearer JWT token and enforces Role-Based Access Control (RBAC).
 */

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Authentication required', 401);
  }

  const token = authHeader.split(' ')[1];

  // Handle mock tokens for dev / local fallback testing
  if (token === 'placeholder_jwt_token' || token === 'mock_leader_token') {
    req.user = {
      id: 'mock_user_1',
      name: 'Test Team Leader',
      email: 'leader@build2pitch.dev',
      role: 'team_lead',
      teamId: 'mock_team_1',
    };
    return next();
  }

  if (token === 'placeholder_member_token' || token === 'mock_member_token') {
    req.user = {
      id: 'mock_member_1',
      name: 'Team Member',
      email: 'member@build2pitch.dev',
      role: 'member',
      teamId: 'mock_team_1',
    };
    return next();
  }

  if (token === 'mock_admin_token' || token === 'placeholder_admin_token') {
    req.user = {
      id: 'mock_admin_1',
      name: 'System Admin',
      email: 'admin@build2pitch.dev',
      role: 'admin',
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const normalizedUserRole = (req.user.role || '').toLowerCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

    if (!normalizedAllowed.includes(normalizedUserRole)) {
      return errorResponse(res, 'Access forbidden: Insufficient permissions', 403);
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
