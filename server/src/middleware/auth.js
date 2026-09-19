const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { errorResponse } = require('../utils/response');

/**
 * Normalizes role string to standard uppercase format.
 * Maps 'team_lead' -> 'TEAM_LEAD', 'member' -> 'TEAM_MEMBER', 'admin' -> 'ADMIN'
 */
const normalizeRole = (role) => {
  if (!role) return '';
  const upper = String(role).trim().toUpperCase();
  if (upper === 'MEMBER') return 'TEAM_MEMBER';
  return upper;
};

/**
 * Authentication Middleware
 * Validates the Bearer token in the Authorization header.
 * Attaches decoded payload to req.user.
 */
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Authentication required: No token provided', 401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return errorResponse(res, 'Authentication required: Malformed token header', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = {
      ...decoded,
      role: normalizeRole(decoded.role),
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Authentication failed: Token has expired', 401);
    }
    return errorResponse(res, 'Authentication failed: Invalid or corrupt token', 401);
  }
};

/**
 * Authorization Middleware
 * Enforces Role-Based Access Control (RBAC).
 * Can be invoked with a single role or multiple roles:
 * e.g., requireRole('ADMIN') or requireRole('TEAM_LEAD', 'ADMIN') or requireRole(['TEAM_LEAD', 'TEAM_MEMBER'])
 */
const requireRole = (...allowedRoles) => {
  // Flatten array arguments in case array was passed as single arg
  const flatRoles = allowedRoles.flat().map(normalizeRole);

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return errorResponse(res, 'Authentication required before checking role permissions', 401);
    }

    const userRole = normalizeRole(req.user.role);

    if (!flatRoles.includes(userRole)) {
      return errorResponse(
        res,
        `Access forbidden: Role '${req.user.role}' is not authorized to access this resource`,
        403
      );
    }

    next();
  };
};

module.exports = {
  requireAuth,
  authenticate: requireAuth, // Reusable alias
  requireRole,
  authorize: requireRole,   // Reusable alias
  normalizeRole,
};

