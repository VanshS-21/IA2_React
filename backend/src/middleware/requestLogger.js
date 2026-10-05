const crypto = require('crypto');
const morgan = require('morgan');
const { nodeEnv } = require('../config/env');

const assignRequestId = (req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
};
const logger = morgan(':method :url :status :response-time ms', { skip: () => nodeEnv === 'test' });
module.exports = { assignRequestId, logger };
