const { nodeEnv } = require('../config/env');

module.exports = (error, req, res, next) => { // eslint-disable-line no-unused-vars
  let status = error.status || 500;
  let code = error.code || 'INTERNAL_ERROR';
  let message = error.message || 'An unexpected error occurred';
  let details = error.details;
  if (error.name === 'ValidationError') { status = 400; code = 'VALIDATION_ERROR'; message = 'Request validation failed'; details = Object.values(error.errors).map((item) => ({ path: item.path, message: item.message })); }
  if (error.name === 'CastError') { status = 400; code = 'VALIDATION_ERROR'; message = 'Invalid identifier'; }
  if (error.code === 11000) { status = 409; code = 'DUPLICATE_KEY'; message = `${Object.keys(error.keyPattern || {})[0] || 'Value'} already exists`; }
  const body = { success: false, error: { code, message } };
  if (details) body.error.details = details;
  if (nodeEnv === 'development' && status === 500) body.error.stack = error.stack;
  res.status(status).json(body);
};
