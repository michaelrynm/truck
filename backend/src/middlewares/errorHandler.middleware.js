const { errorResponse } = require('../utils/response.util');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return errorResponse(res, 409, `Duplicate value for ${err.meta?.target?.[0] || 'field'}`);
    }
    if (err.code === 'P2025') {
      return errorResponse(res, 404, 'Record not found');
    }
    if (err.code === 'P2003') {
      return errorResponse(res, 400, 'Foreign key constraint failed');
    }
  }

  if (err.name === 'PrismaClientValidationError') {
    return errorResponse(res, 400, 'Invalid data provided');
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, statusCode, message);
};

module.exports = errorHandler;
