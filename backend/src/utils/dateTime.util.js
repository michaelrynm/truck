/**
 * Check if date is valid
 * @param {Date} date - Date to validate
 * @returns {Boolean}
 */
const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

/**
 * Check if end date is after start date
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Boolean}
 */
const isEndDateAfterStartDate = (startDate, endDate) => {
  return new Date(endDate) > new Date(startDate);
};

/**
 * Check if date falls within a range
 * @param {Date} date - Date to check
 * @param {Date} startDate - Range start
 * @param {Date} endDate - Range end
 * @returns {Boolean}
 */
const isDateInRange = (date, startDate, endDate) => {
  const checkDate = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return checkDate >= start && checkDate <= end;
};

/**
 * Convert time string (HH:mm) to minutes
 * @param {String} time - Time in HH:mm format
 * @returns {Number} Minutes
 */
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Check if two time ranges overlap
 * @param {String} start1 - Start time 1 (HH:mm)
 * @param {String} end1 - End time 1 (HH:mm)
 * @param {String} start2 - Start time 2 (HH:mm)
 * @param {String} end2 - End time 2 (HH:mm)
 * @returns {Boolean}
 */
const doTimeRangesOverlap = (start1, end1, start2, end2) => {
  const start1Minutes = timeToMinutes(start1);
  const end1Minutes = timeToMinutes(end1);
  const start2Minutes = timeToMinutes(start2);
  const end2Minutes = timeToMinutes(end2);

  return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
};

/**
 * Validate time format (HH:mm)
 * @param {String} time - Time string
 * @returns {Boolean}
 */
const isValidTimeFormat = (time) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

module.exports = {
  isValidDate,
  isEndDateAfterStartDate,
  isDateInRange,
  timeToMinutes,
  doTimeRangesOverlap,
  isValidTimeFormat,
};
