/**
 * Date and Timezone Utilities for SynapseOS Automation
 */

/**
 * Format Date object to YYYY-MM-DD
 */
const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

/**
 * Validate YYYY-MM-DD string
 */
const isValidDateString = (str) => {
    if (!str || typeof str !== "string") return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(str)) return false;
    const d = new Date(str);
    return !isNaN(d.getTime()) && formatDate(d) === str;
};

/**
 * Get standard Date object for today at 00:00:00
 */
const getTodayDate = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

/**
 * Get formatted string for today YYYY-MM-DD
 */
const getTodayString = () => {
    return formatDate(getTodayDate());
};

/**
 * Get standard Date object for yesterday at 00:00:00
 */
const getYesterdayDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0, 0);
    return d;
};

/**
 * Get formatted string for yesterday YYYY-MM-DD
 */
const getYesterdayString = () => {
    return formatDate(getYesterdayDate());
};

/**
 * Get date range for past N days ending on specified date (inclusive)
 */
const getDateRangeDays = (endDateStr, numDays = 7) => {
    const end = isValidDateString(endDateStr) ? new Date(endDateStr) : getYesterdayDate();
    end.setHours(23, 59, 59, 999);

    const start = new Date(end);
    start.setDate(start.getDate() - (numDays - 1));
    start.setHours(0, 0, 0, 0);

    const allDates = [];
    const curr = new Date(start);
    while (curr <= end) {
        allDates.push(formatDate(curr));
        curr.setDate(curr.getDate() + 1);
    }

    return {
        startDate: formatDate(start),
        endDate: formatDate(end),
        dayCount: numDays,
        allDates
    };
};

/**
 * Calculate difference in whole days between two date strings (date2 - date1)
 */
const daysBetween = (date1Str, date2Str) => {
    const d1 = new Date(date1Str);
    const d2 = new Date(date2Str);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = {
    formatDate,
    isValidDateString,
    getTodayDate,
    getTodayString,
    getYesterdayDate,
    getYesterdayString,
    getDateRangeDays,
    daysBetween
};
