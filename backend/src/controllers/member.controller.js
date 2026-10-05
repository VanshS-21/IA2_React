const Member = require('../models/Member');
const asyncHandler = require('../utils/asyncHandler');
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const createMember = asyncHandler(async (req, res) => {
  const member = await Member.create(req.body);
  res.status(201).json({ success: true, data: member });
});
const listMembers = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const filter = search ? { $or: [{ name: new RegExp(escapeRegex(search), 'i') }, { email: new RegExp(escapeRegex(search), 'i') }] } : {};
  const [data, total] = await Promise.all([Member.find(filter).sort({ name: 1 }).skip((page - 1) * limit).limit(limit).lean(), Member.countDocuments(filter)]);
  res.json({ success: true, data, meta: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page * limit < total, hasPrev: page > 1 } });
});
module.exports = { createMember, listMembers };
