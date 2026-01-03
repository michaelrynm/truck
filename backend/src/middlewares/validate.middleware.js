const { errorResponse } = require('../utils/response.util');

/**
 * Validation middleware using Zod schemas
 * @param {Object} schema - Zod schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return errorResponse(res, 400, 'Validation failed', errors);
    }
  };
};

module.exports = validate;
