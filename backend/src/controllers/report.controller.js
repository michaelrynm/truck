const reportService = require('../services/report.service');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * Get operations report
 */
const getOperationsReport = async (req, res, next) => {
  try {
    const { startDate, endDate, contractId } = req.query;

    if (!startDate || !endDate) {
      return errorResponse(res, 400, 'Start date and end date are required');
    }

    const report = await reportService.getOperationsReport(startDate, endDate, contractId);
    return successResponse(res, 200, 'Operations report generated', report);
  } catch (error) {
    next(error);
  }
};

/**
 * Get efficiency report
 */
const getEfficiencyReport = async (req, res, next) => {
  try {
    const report = await reportService.getEfficiencyReport();
    return successResponse(res, 200, 'Efficiency report generated', report);
  } catch (error) {
    next(error);
  }
};

/**
 * Export report (placeholder)
 */
const exportReport = async (req, res, next) => {
  try {
    const { format, startDate, endDate } = req.query;

    if (!format || !startDate || !endDate) {
      return errorResponse(res, 400, 'Format, start date, and end date are required');
    }

    if (!['pdf', 'excel'].includes(format)) {
      return errorResponse(res, 400, 'Format must be pdf or excel');
    }

    return successResponse(res, 200, 'Export functionality not yet implemented', {
      message: 'This endpoint will export reports in PDF or Excel format',
      format,
      startDate,
      endDate,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get driver performance report
 */
const getDriverReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return errorResponse(res, 400, 'Start date and end date are required');
    }

    const report = await reportService.getDriverReport(startDate, endDate);
    return successResponse(res, 200, 'Driver report generated', report);
  } catch (error) {
    next(error);
  }
};

/**
 * Get contract summary report
 */
const getContractReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return errorResponse(res, 400, 'Start date and end date are required');
    }

    const report = await reportService.getContractReport(startDate, endDate);
    return successResponse(res, 200, 'Contract report generated', report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOperationsReport,
  getEfficiencyReport,
  exportReport,
  getDriverReport,
  getContractReport,
};
