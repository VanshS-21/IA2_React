const { loanPeriodDays } = require('../config/env');

const addDays = (date, days = loanPeriodDays) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const isOverdue = (dueDate, now = new Date()) => new Date(dueDate) < now;

module.exports = { addDays, isOverdue };
