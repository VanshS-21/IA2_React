const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ success: false, error: { code: 'UNAUTHENTICATED', message: 'Authentication token is required' } });
  try {
    const payload = jwt.verify(header.slice(7), jwtSecret);
    req.user = { sub: payload.sub, email: payload.email, role: payload.role };
    return next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Authentication token has expired' : 'Authentication token is invalid';
    return res.status(401).json({ success: false, error: { code: 'UNAUTHENTICATED', message } });
  }
}
module.exports = { protect };
