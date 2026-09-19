const { errorResponse } = require('../utils/response');

/**
 * Request body/query validator placeholder
 */
const validate = (schema) => {
  return (req, res, next) => {
    // Placeholder validation logic
    if (!req.body && schema) {
      return errorResponse(res, 'Request body is required', 400);
    }
    next();
  };
};

module.exports = validate;
