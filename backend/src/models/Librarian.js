const mongoose = require('mongoose');

const librarianSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, default: 'librarian' }
}, { timestamps: true });
module.exports = mongoose.model('Librarian', librarianSchema);
