/**
 * Calculate pagination metadata
 * @param {number} page - Current page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @param {number} total - Total number of items
 * @returns {object} Pagination metadata with skip, page, limit, total, totalPages
 */
const calculatePagination = (page = 1, limit = 10, total) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;
  const totalPages = Math.ceil(total / limitNum);

  return {
    page: pageNum,
    limit: limitNum,
    skip,
    total,
    totalPages,
  };
};

/**
 * Create paginated response structure
 * @param {array} data - Array of data items
 * @param {object} pagination - Pagination metadata from calculatePagination
 * @returns {object} Paginated response with data and pagination info
 */
const paginatedResponse = (data, pagination) => {
  return {
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages,
    },
  };
};

module.exports = {
  calculatePagination,
  paginatedResponse,
};
