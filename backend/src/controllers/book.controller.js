const Book = require('../models/Book');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const createBook = asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json({ success: true, data: book });
});
const listBooks = asyncHandler(async (req, res) => {
  const { page, limit, genre, search, sort } = req.query;
  const filter = {};
  if (genre) filter.genre = new RegExp(`^${escapeRegex(genre)}$`, 'i');
  if (search) filter.title = new RegExp(escapeRegex(search), 'i');
  const [data, total] = await Promise.all([Book.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(), Book.countDocuments(filter)]);
  res.json({ success: true, data, meta: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page * limit < total, hasPrev: page > 1 } });
});
const genres = asyncHandler(async (req, res) => {
  const data = await Book.distinct('genre');
  res.json({ success: true, data: data.sort((a, b) => a.localeCompare(b)) });
});
module.exports = { createBook, listBooks, genres };
