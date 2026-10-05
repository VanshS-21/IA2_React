const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Librarian = require('../models/Librarian');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

const login = asyncHandler(async (req, res) => {
  const librarian = await Librarian.findOne({ email: req.body.email.toLowerCase() }).select('+passwordHash');
  if (!librarian || !(await bcrypt.compare(req.body.password, librarian.passwordHash))) throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  const token = jwt.sign({ sub: librarian.id, email: librarian.email, role: librarian.role }, jwtSecret, { expiresIn: jwtExpiresIn });
  res.json({ success: true, data: { token, librarian: { id: librarian.id, name: librarian.name, email: librarian.email } } });
});
module.exports = { login };
