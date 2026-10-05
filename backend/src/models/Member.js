const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  membershipId: { type: String, required: true, unique: true, trim: true },
  joinedDate: { type: Date, default: Date.now }
});
memberSchema.pre('validate', function generateMembershipId(next) {
  if (!this.membershipId) this.membershipId = `MEM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  next();
});
module.exports = mongoose.model('Member', memberSchema);
